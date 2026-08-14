'use client';

import React, { useState } from 'react';
import { ConnectorItem, SyncState } from './types';
import { INITIAL_MOCK_CONNECTORS } from './mockData';
import { ConnectedAppsHeader } from './ConnectedAppsHeader';
import { ConnectionOverview } from './ConnectionOverview';
import { ConnectorGrid } from './ConnectorGrid';
import { ConnectModal } from './ConnectModal';
import { ConnectorDetail } from './ConnectorDetail';
import { DisconnectModal } from './DisconnectModal';
import { PrivacyPanel } from './PrivacyPanel';
import { EmptyConnectState } from './EmptyConnectState';
import { useToast } from '../ui/Toast';

export interface ConnectedAppsViewProps {
  onNavigate?: (pageId: string) => void;
  initialSelectedConnectorId?: string | null;
}

export const ConnectedAppsView: React.FC<ConnectedAppsViewProps> = ({
  onNavigate,
  initialSelectedConnectorId,
}) => {
  const { addToast } = useToast();
  const [connectors, setConnectors] = useState<ConnectorItem[]>(INITIAL_MOCK_CONNECTORS);

  const [selectedToConnect, setSelectedToConnect] = useState<ConnectorItem | null>(null);
  const [selectedToManage, setSelectedToManage] = useState<ConnectorItem | null>(() => {
    if (initialSelectedConnectorId) {
      return INITIAL_MOCK_CONNECTORS.find((c) => c.id === initialSelectedConnectorId) || null;
    }
    return null;
  });
  const [selectedToDisconnect, setSelectedToDisconnect] = useState<ConnectorItem | null>(null);

  const activeConnectedCount = connectors.filter((c) => c.status !== 'not_connected').length;

  // Handle Connect Confirmation
  const handleConfirmConnect = (connectorId: string) => {
    setConnectors((prev) =>
      prev.map((c) => {
        if (c.id === connectorId) {
          return {
            ...c,
            status: 'connected' as SyncState,
            statusLabel: 'Connected',
            lastSynced: 'Just now',
            contextCount: c.contextCount || 'Indexed',
          };
        }
        return c;
      })
    );
  };

  // Handle Disconnect Confirmation
  const handleConfirmDisconnect = (connectorId: string) => {
    setConnectors((prev) =>
      prev.map((c) => {
        if (c.id === connectorId) {
          return {
            ...c,
            status: 'not_connected' as SyncState,
            statusLabel: 'Not connected',
            lastSynced: undefined,
            contextCount: undefined,
          };
        }
        return c;
      })
    );
  };

  // Handle Sync Now
  const handleSyncNow = (connectorId: string) => {
    setConnectors((prev) =>
      prev.map((c) => {
        if (c.id === connectorId) {
          return {
            ...c,
            status: 'connected' as SyncState,
            statusLabel: 'Connected',
            lastSynced: 'Just now',
          };
        }
        return c;
      })
    );
  };

  const handleConnectGoogle = () => {
    const gmailConn = connectors.find((c) => c.id === 'gmail');
    if (gmailConn) {
      setSelectedToConnect(gmailConn);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <ConnectedAppsHeader />

      {activeConnectedCount === 0 ? (
        <EmptyConnectState
          onConnectGoogle={handleConnectGoogle}
          onExploreApps={() => {
            addToast({
              type: 'info',
              title: 'Available Connectors',
              description: 'Select any connector card below to initiate connection.',
            });
          }}
        />
      ) : (
        <>
          {/* Top Connection Overview */}
          <ConnectionOverview connectors={connectors} />

          {/* Connector Cards Grid */}
          <ConnectorGrid
            connectors={connectors}
            onConnect={(conn) => setSelectedToConnect(conn)}
            onManage={(conn) => setSelectedToManage(conn)}
          />
        </>
      )}

      {/* Bottom Privacy & Trust Section */}
      <PrivacyPanel
        onManagePermissionsClick={() => {
          const connected = connectors.find((c) => c.status !== 'not_connected');
          if (connected) {
            setSelectedToManage(connected);
          } else {
            addToast({
              type: 'info',
              title: 'No Connected Apps',
              description: 'Connect an app to configure active permissions.',
            });
          }
        }}
      />

      {/* Connect Modal */}
      <ConnectModal
        connector={selectedToConnect}
        isOpen={!!selectedToConnect}
        onClose={() => setSelectedToConnect(null)}
        onConfirmConnect={handleConfirmConnect}
      />

      {/* Connector Detail / Manage Modal */}
      <ConnectorDetail
        connector={selectedToManage}
        isOpen={!!selectedToManage}
        onClose={() => setSelectedToManage(null)}
        onSyncNow={handleSyncNow}
        onRequestDisconnect={(conn) => {
          setSelectedToManage(null);
          setSelectedToDisconnect(conn);
        }}
      />

      {/* Disconnect Modal */}
      <DisconnectModal
        connector={selectedToDisconnect}
        isOpen={!!selectedToDisconnect}
        onClose={() => setSelectedToDisconnect(null)}
        onConfirmDisconnect={handleConfirmDisconnect}
      />
    </div>
  );
};
