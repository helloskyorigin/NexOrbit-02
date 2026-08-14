'use client';

import React, { useState } from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { ConnectorStatus } from './ConnectorStatus';
import { PermissionPanel } from './PermissionPanel';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RefreshCw, Shield, Trash2, ArrowRight, CheckCircle2, Clock, Layers } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface ConnectorDetailProps {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSyncNow: (connectorId: string) => void;
  onRequestDisconnect: (connector: ConnectorItem) => void;
}

export const ConnectorDetail: React.FC<ConnectorDetailProps> = ({
  connector,
  isOpen,
  onClose,
  onSyncNow,
  onRequestDisconnect,
}) => {
  const { addToast } = useToast();
  const [showPermissions, setShowPermissions] = useState(false);
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);

  if (!connector) return null;

  const handleSyncClick = () => {
    setIsSyncingLocal(true);
    setTimeout(() => {
      setIsSyncingLocal(false);
      onSyncNow(connector.id);
      addToast({
        type: 'success',
        title: `${connector.name} Synced`,
        description: `Resynced ${connector.name} context.`,
      });
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setShowPermissions(false);
        onClose();
      }}
      title={connector.name}
      description={`${connector.category} Integration`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onRequestDisconnect(connector);
            }}
            leftIcon={<Trash2 className="h-3.5 w-3.5 text-red-500" />}
            className="text-red-700 hover:bg-red-50 border-red-200 text-xs font-semibold h-8"
          >
            Disconnect
          </Button>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-slate-800">
        {/* Connection Header Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                <ConnectorIcon id={connector.id} size="lg" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{connector.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Your {connector.name} context is available to NEXORBIT.</p>
              </div>
            </div>

            <div className="shrink-0">
              <ConnectorStatus status={connector.status} customLabel={connector.statusLabel} />
            </div>
          </div>
        </div>

        {/* CONTEXT AVAILABLE */}
        <div className="space-y-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
            Context available
          </span>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900 text-xs pb-1 border-b border-slate-200/60">
              <span>Primary source items</span>
              <span className="text-indigo-600 font-extrabold">{connector.contextCount || 'Indexed'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(connector.contextItems || ['Context signals', 'Metadata', 'Activity threads']).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* LAST SYNC & SYNC NOW ACTION */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Sync</span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {isSyncingLocal ? 'Syncing...' : connector.lastSynced || 'Just now'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncClick}
            disabled={isSyncingLocal}
            leftIcon={<RefreshCw className={cn('h-3.5 w-3.5', isSyncingLocal && 'animate-spin text-indigo-600')} />}
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-800 text-xs font-semibold h-8 shrink-0"
          >
            {isSyncingLocal ? 'Syncing...' : 'Sync now'}
          </Button>
        </div>

        {/* PERMISSIONS SECTION TOGGLE */}
        <div className="pt-2 border-t border-slate-100">
          {!showPermissions ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/90 text-indigo-950">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-xs">Permissions &amp; Data Controls</span>
              </div>
              <button
                onClick={() => setShowPermissions(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Configured Permissions
                </span>
                <button
                  onClick={() => setShowPermissions(false)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                >
                  Hide details
                </button>
              </div>
              <PermissionPanel connector={connector} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
