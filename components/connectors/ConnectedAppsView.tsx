'use client';

import React, { useState } from 'react';
import { ConnectorItem, SyncState } from './types';
import { INITIAL_MOCK_CONNECTORS, AVAILABLE_SECONDARY_CONNECTORS } from './mockData';
import { ConnectedAppsHeader } from './ConnectedAppsHeader';
import { ConnectionOverview } from './ConnectionOverview';
import { ConnectorCard } from './ConnectorCard';
import { AboutConnectedAppsCard } from './AboutConnectedAppsCard';
import { ConnectionHealthCard } from './ConnectionHealthCard';
import { TrustMessage } from './TrustMessage';
import { ConnectModal } from './ConnectModal';
import { ConnectorDetail } from './ConnectorDetail';
import { DisconnectModal } from './DisconnectModal';
import { ChevronDown, ChevronUp, Plus, ShieldCheck } from 'lucide-react';
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

  // Primary V1 connectors state
  const [connectors, setConnectors] = useState<ConnectorItem[]>(INITIAL_MOCK_CONNECTORS);
  // Secondary available connectors state
  const [availableConnectors, setAvailableConnectors] = useState<ConnectorItem[]>(AVAILABLE_SECONDARY_CONNECTORS);

  const [showAllAvailable, setShowAllAvailable] = useState(false);

  // Modal / Drawer states
  const [selectedToConnect, setSelectedToConnect] = useState<ConnectorItem | null>(null);
  const [selectedToManage, setSelectedToManage] = useState<ConnectorItem | null>(() => {
    if (initialSelectedConnectorId) {
      return (
        INITIAL_MOCK_CONNECTORS.find((c) => c.id === initialSelectedConnectorId) ||
        AVAILABLE_SECONDARY_CONNECTORS.find((c) => c.id === initialSelectedConnectorId) ||
        null
      );
    }
    return null;
  });
  const [selectedToDisconnect, setSelectedToDisconnect] = useState<ConnectorItem | null>(null);

  // Handle Connect Confirmation
  const handleConfirmConnect = (connectorId: string) => {
    // Check if in primary connectors list
    const isPrimary = connectors.some((c) => c.id === connectorId);

    if (isPrimary) {
      setConnectors((prev) =>
        prev.map((c) => {
          if (c.id === connectorId) {
            return {
              ...c,
              status: 'connected' as SyncState,
              statusLabel: 'Connected',
              lastSynced: 'Synced just now',
            };
          }
          return c;
        })
      );
    } else {
      // Move from available to connected
      const foundInAvailable = availableConnectors.find((c) => c.id === connectorId);
      if (foundInAvailable) {
        const updatedItem: ConnectorItem = {
          ...foundInAvailable,
          status: 'connected' as SyncState,
          statusLabel: 'Connected',
          lastSynced: 'Synced just now',
        };
        setConnectors((prev) => [...prev, updatedItem]);
        setAvailableConnectors((prev) => prev.filter((c) => c.id !== connectorId));
      }
    }
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
            lastSynced: 'Synced just now',
          };
        }
        return c;
      })
    );
  };

  const handleOpenNotifications = () => {
    addToast({
      type: 'info',
      title: 'Connector Health Status',
      description: 'All 5 active connector sync pipelines are operational and healthy.',
    });
  };

  const handleConnectNewAppClick = () => {
    const disconnected = connectors.find((c) => c.status === 'not_connected');
    if (disconnected) {
      setSelectedToConnect(disconnected);
    } else if (availableConnectors.length > 0) {
      setSelectedToConnect(availableConnectors[0]);
    } else {
      addToast({
        type: 'info',
        title: 'All Apps Connected',
        description: 'You have connected all available workspace applications.',
      });
    }
  };

  // Filter connected vs disconnected for "Your Connected Apps" vs "Available Apps"
  const connectedAppsList = connectors.filter((c) => c.status !== 'not_connected');
  const disconnectedAppsList = connectors.filter((c) => c.status === 'not_connected');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <ConnectedAppsHeader onOpenNotifications={handleOpenNotifications} />

      {/* Top Overview Hero Banner */}
      <ConnectionOverview
        connectors={connectors}
        onConnectNewApp={handleConnectNewAppClick}
      />

      {/* Main Two-Column Layout (Matching Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Connected & Available Apps) - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Your Connected Apps Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-slate-900 font-sans">
                Your Connected Apps
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {connectedAppsList.length} connected
              </span>
            </div>

            <div className="space-y-2.5">
              {connectedAppsList.map((connector) => (
                <ConnectorCard
                  key={connector.id}
                  connector={connector}
                  onConnect={(conn) => setSelectedToConnect(conn)}
                  onManage={(conn) => setSelectedToManage(conn)}
                />
              ))}

              {connectedAppsList.length === 0 && (
                <div className="p-8 text-center rounded-2xl bg-white border border-slate-200/80 text-slate-500 text-xs">
                  No connected apps yet. Click below to connect your tools.
                </div>
              )}
            </div>
          </div>

          {/* Available Apps Section */}
          {(disconnectedAppsList.length > 0 || availableConnectors.length > 0) && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold text-slate-900 font-sans">
                  Available Apps
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {disconnectedAppsList.length + availableConnectors.length} available
                </span>
              </div>

              <div className="space-y-2.5">
                {disconnectedAppsList.map((connector) => (
                  <ConnectorCard
                    key={connector.id}
                    connector={connector}
                    onConnect={(conn) => setSelectedToConnect(conn)}
                    onManage={(conn) => setSelectedToManage(conn)}
                  />
                ))}

                {(showAllAvailable ? availableConnectors : availableConnectors.slice(0, 2)).map((connector) => (
                  <ConnectorCard
                    key={connector.id}
                    connector={connector}
                    onConnect={(conn) => setSelectedToConnect(conn)}
                    onManage={(conn) => setSelectedToManage(conn)}
                  />
                ))}
              </div>

              {availableConnectors.length > 2 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowAllAvailable(!showAllAvailable)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 bg-white border border-slate-200/80 px-4 py-2 rounded-xl transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>{showAllAvailable ? 'Show fewer apps' : 'View all apps'}</span>
                    {showAllAvailable ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Trust Disclaimer */}
          <TrustMessage />
        </div>

        {/* Right Column (Info & Status Cards) - 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          {/* About Connected Apps Card */}
          <AboutConnectedAppsCard
            onLearnMorePrivacy={() => {
              addToast({
                type: 'info',
                title: 'Data Privacy Standard',
                description: 'NEXORBIT uses AES-256 encryption, zero third-party AI training, and full client data isolation.',
              });
            }}
          />

          {/* Connection Health Card */}
          <ConnectionHealthCard
            onViewStatus={() => {
              addToast({
                type: 'success',
                title: 'System Diagnostics',
                description: 'All 5 connector sync endpoints are operating with 100% health & zero rate-limit errors.',
              });
            }}
          />
        </div>
      </div>

      {/* Connect Modal */}
      <ConnectModal
        connector={selectedToConnect}
        isOpen={!!selectedToConnect}
        onClose={() => setSelectedToConnect(null)}
        onConfirmConnect={handleConfirmConnect}
      />

      {/* Manage Connection Drawer / Modal */}
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
