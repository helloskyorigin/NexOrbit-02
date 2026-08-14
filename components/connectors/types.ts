export type ConnectorId = 'gmail' | 'calendar' | 'drive' | 'notion' | 'github';

export type SyncState =
  | 'connected'
  | 'syncing'
  | 'up_to_date'
  | 'needs_attention'
  | 'not_connected'
  | 'error';

export interface ConnectorPermissionItem {
  access: string[];
  use: string[];
  control: string[];
}

export interface ConnectorItem {
  id: ConnectorId;
  name: string;
  category: 'Google Workspace' | 'Workspace Integration' | 'Developer Platform';
  description: string;
  status: SyncState;
  statusLabel: string;
  lastSynced?: string;
  contextCount?: string;
  contextItems?: string[];
  permissions: ConnectorPermissionItem;
  uses: string[];
  wonts: string[];
  brandColor?: string;
}
