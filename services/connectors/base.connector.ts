import { SupportedConnectorType } from '../../config';
import { GenericConnector, ConnectorStatus, ConnectorSyncResult } from '../../types/connectors';
import { Connector, ConnectorPermission } from '../../types/models';
import { inMemoryStore } from '../../lib/firebase';
import { UserIsolationService } from '../security/user-isolation.service';

export abstract class BaseConnector implements GenericConnector {
  abstract readonly type: SupportedConnectorType;

  protected getConnectorDocId(userId: string): string {
    return `connector_${userId}_${this.type}`;
  }

  async connect(userId: string, authData: Record<string, unknown>): Promise<Connector> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const docId = this.getConnectorDocId(validUserId);

    const connector: Connector = {
      id: docId,
      userId: validUserId,
      type: this.type,
      status: 'CONNECTED',
      accountEmail: (authData.accountEmail as string) || `user@${this.type.toLowerCase()}.com`,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc('connectors', docId, connector as unknown as Record<string, unknown>);

    const permDocId = `perm_${validUserId}_${this.type}`;
    const permission: ConnectorPermission = {
      id: permDocId,
      userId: validUserId,
      connectorId: docId,
      connectorType: this.type,
      scopes: (authData.scopes as string[]) || ['read', 'write'],
      grantedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc(
      'connectorPermissions',
      permDocId,
      permission as unknown as Record<string, unknown>
    );

    return connector;
  }

  async disconnect(userId: string): Promise<boolean> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const docId = this.getConnectorDocId(validUserId);
    const connector = inMemoryStore.getDoc('connectors', docId) as Connector | null;

    if (!connector) return false;
    UserIsolationService.validateOwnership(connector.userId, validUserId);

    inMemoryStore.setDoc('connectors', docId, {
      ...connector,
      status: 'DISCONNECTED',
      updatedAt: new Date().toISOString(),
    });

    return true;
  }

  async getStatus(userId: string): Promise<ConnectorStatus> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const docId = this.getConnectorDocId(validUserId);
    const connector = inMemoryStore.getDoc('connectors', docId) as Connector | null;

    if (!connector || connector.status === 'DISCONNECTED') {
      return {
        connected: false,
        type: this.type,
      };
    }

    UserIsolationService.validateOwnership(connector.userId, validUserId);

    return {
      connected: connector.status === 'CONNECTED',
      type: this.type,
      accountEmail: connector.accountEmail,
      lastSyncedAt: connector.lastSyncedAt,
    };
  }

  async getPermissions(userId: string): Promise<ConnectorPermission> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const permDocId = `perm_${validUserId}_${this.type}`;
    const perm = inMemoryStore.getDoc('connectorPermissions', permDocId) as ConnectorPermission | null;

    if (!perm) {
      return {
        id: permDocId,
        userId: validUserId,
        connectorId: this.getConnectorDocId(validUserId),
        connectorType: this.type,
        scopes: [],
        grantedAt: new Date().toISOString(),
      };
    }

    UserIsolationService.validateOwnership(perm.userId, validUserId);
    return perm;
  }

  async sync(userId: string): Promise<ConnectorSyncResult> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const status = await this.getStatus(validUserId);

    if (!status.connected) {
      return {
        connectorType: this.type,
        itemsProcessed: 0,
        status: 'FAILED',
        errors: ['Connector not connected'],
        syncedAt: new Date().toISOString(),
      };
    }

    return {
      connectorType: this.type,
      itemsProcessed: 0,
      status: 'SUCCESS',
      syncedAt: new Date().toISOString(),
    };
  }

  async getData(userId: string): Promise<unknown[]> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const status = await this.getStatus(validUserId);
    if (!status.connected) return [];
    return [];
  }

  async revokeAccess(userId: string): Promise<boolean> {
    return this.disconnect(userId);
  }
}
