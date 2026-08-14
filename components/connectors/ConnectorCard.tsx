'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { ConnectorStatus } from './ConnectorStatus';
import { Button } from '../ui/Button';
import { ArrowRight, Sliders } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectorCardProps {
  connector: ConnectorItem;
  onConnect: (connector: ConnectorItem) => void;
  onManage: (connector: ConnectorItem) => void;
  className?: string;
}

export const ConnectorCard: React.FC<ConnectorCardProps> = ({
  connector,
  onConnect,
  onManage,
  className,
}) => {
  const isConnected = connector.status !== 'not_connected';

  return (
    <div
      className={cn(
        'flex flex-col justify-between transition-all duration-200 hover:shadow-md border rounded-2xl bg-white overflow-hidden',
        isConnected
          ? 'border-slate-200/90 shadow-2xs'
          : 'border-dashed border-slate-300/80 bg-slate-50/40',
        className
      )}
    >
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs shrink-0">
              <ConnectorIcon id={connector.id} size="md" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                {connector.name}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {connector.category}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <ConnectorStatus status={connector.status} customLabel={connector.statusLabel} />
          </div>
        </div>
      </div>

      <div className="p-5 pt-1 pb-4 flex-1 space-y-3">
        <p className="text-xs text-slate-600 leading-relaxed">
          {connector.description}
        </p>

        {isConnected && (
          <div className="pt-2 border-t border-slate-100/90 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Indexed context</span>
              <span className="text-indigo-600 font-semibold">{connector.contextCount || 'Active'}</span>
            </div>
            {connector.lastSynced && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Last synced</span>
                <span className="text-slate-600 font-medium">{connector.lastSynced}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 pt-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end">
        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onManage(connector)}
            className="w-full bg-white hover:bg-slate-100 border-slate-200 text-slate-800 text-xs font-semibold h-8.5 rounded-xl cursor-pointer"
            leftIcon={<Sliders className="h-3.5 w-3.5 text-slate-500" />}
          >
            Manage Context &amp; Permissions
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConnect(connector)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-8.5 rounded-xl shadow-xs cursor-pointer"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Connect to NEXORBIT
          </Button>
        )}
      </div>
    </div>
  );
};
