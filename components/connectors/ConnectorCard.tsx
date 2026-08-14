'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { ConnectorStatus } from './ConnectorStatus';
import { ArrowRight, ChevronRight, Plus } from 'lucide-react';
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
  const isConnected = connector.status === 'connected' || connector.status === 'up_to_date' || connector.status === 'syncing' || connector.status === 'needs_attention';

  return (
    <div
      onClick={() => (isConnected ? onManage(connector) : onConnect(connector))}
      className={cn(
        'p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer group',
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Connector Icon Container */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <ConnectorIcon id={connector.id} size="md" />
        </div>

        {/* Name & Sync Time */}
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">
            {connector.name}
          </h3>
          <p className="text-xs text-slate-500 font-normal truncate">
            {connector.lastSynced || connector.description}
          </p>
        </div>
      </div>

      {/* Status Badge & Action Arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <ConnectorStatus status={connector.status} customLabel={connector.statusLabel} />

        {isConnected ? (
          <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect(connector);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Connect</span>
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
