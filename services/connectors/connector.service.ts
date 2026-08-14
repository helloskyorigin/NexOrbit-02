import { SupportedConnectorType, NEXORBIT_CONFIG } from '../../config';
import { BaseConnector } from './base.connector';
import { ConnectorStatus, ConnectorSyncResult } from '../../types/connectors';
import { Connector } from '../../types/models';
import { ErrorCode, NexorbitError } from '../../types/errors';

export class GmailConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GMAIL';
}

export class GoogleCalendarConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GOOGLE_CALENDAR';
}

export class GoogleDriveConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GOOGLE_DRIVE';
}

export class NotionConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'NOTION';
}

export class GitHubConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GITHUB';
}

export class ConnectorService {
  private readonly connectorsMap: Map<SupportedConnectorType, BaseConnector>;

  constructor() {
    this.connectorsMap = new Map<SupportedConnectorType, BaseConnector>([
      ['GMAIL', new GmailConnector()],
      ['GOOGLE_CALENDAR', new GoogleCalendarConnector()],
      ['GOOGLE_DRIVE', new GoogleDriveConnector()],
      ['NOTION', new NotionConnector()],
      ['GITHUB', new GitHubConnector()],
    ]);
  }

  private getConnector(type: SupportedConnectorType): BaseConnector {
    const connector = this.connectorsMap.get(type);
    if (!connector) {
      throw new NexorbitError(
        ErrorCode.CONNECTOR_ERROR,
        `Unsupported or unknown connector: ${type}`
      );
    }
    return connector;
  }

  public async getStatuses(userId: string): Promise<ConnectorStatus[]> {
    const statuses: ConnectorStatus[] = [];
    for (const type of NEXORBIT_CONFIG.connectors) {
      const connector = this.getConnector(type);
      statuses.push(await connector.getStatus(userId));
    }
    return statuses;
  }

  public async connectConnector(
    userId: string,
    type: SupportedConnectorType,
    authData: Record<string, unknown>
  ): Promise<Connector> {
    return this.getConnector(type).connect(userId, authData);
  }

  public async disconnectConnector(userId: string, type: SupportedConnectorType): Promise<boolean> {
    return this.getConnector(type).disconnect(userId);
  }

  public async syncConnector(userId: string, type: SupportedConnectorType): Promise<ConnectorSyncResult> {
    return this.getConnector(type).sync(userId);
  }
}
