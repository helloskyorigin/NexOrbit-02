'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface DisconnectModalProps {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisconnect: (connectorId: string) => void;
}

export const DisconnectModal: React.FC<DisconnectModalProps> = ({
  connector,
  isOpen,
  onClose,
  onConfirmDisconnect,
}) => {
  const { addToast } = useToast();

  if (!connector) return null;

  const handleDisconnect = () => {
    onConfirmDisconnect(connector.id);
    addToast({
      type: 'info',
      title: `${connector.name} Disconnected`,
      description: `NEXORBIT has stopped context sync for ${connector.name}.`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Disconnect ${connector.name}?`}
      description="Context Synchronization Control"
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs text-slate-700">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/90">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
            <ConnectorIcon id={connector.id} size="md" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{connector.name}</span>
            <span className="text-[11px] text-slate-500 font-medium">Currently connected</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="leading-relaxed font-medium text-slate-800">
            NEXORBIT will stop using new {connector.name} information for your Brain.
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Existing connected context will follow your data deletion settings. You can reconnect at any time.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 font-semibold text-xs h-9 px-4"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </Modal>
  );
};
