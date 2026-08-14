'use client';

import React, { useState } from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Check, ShieldCheck, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface ConnectModalProps {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmConnect: (connectorId: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  connector,
  isOpen,
  onClose,
  onConfirmConnect,
}) => {
  const { addToast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  if (!connector) return null;

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onConfirmConnect(connector.id);
      addToast({
        type: 'success',
        title: `${connector.name} Connected`,
        description: `NEXORBIT AI Brain now has secure context access to ${connector.name}.`,
      });
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Connect ${connector.name}`}
      description="Authorize NEXORBIT AI Context Ingestion"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-600" />
            256-bit OAuth PKCE
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isConnecting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Authorizing...
                </>
              ) : (
                `Connect ${connector.name}`
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
            <ConnectorIcon id={connector.id} size="md" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{connector.name}</h4>
            <p className="text-slate-500 text-xs font-medium">{connector.description}</p>
          </div>
        </div>

        {/* What NEXORBIT will use */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">
            What NEXORBIT will access:
          </span>
          <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/80 space-y-1.5">
            {connector.uses.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-indigo-950 font-medium">
                <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What NEXORBIT will NOT do */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">
            What NEXORBIT will never do:
          </span>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            {connector.wonts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust disclaimer */}
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-[11px]">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>You can revoke permissions or disconnect this application at any time with one click.</span>
        </div>
      </div>
    </Modal>
  );
};
