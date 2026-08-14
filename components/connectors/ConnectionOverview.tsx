'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectionOverviewProps {
  connectors: ConnectorItem[];
  onConnectNewApp?: () => void;
  className?: string;
}

export const ConnectionOverview: React.FC<ConnectionOverviewProps> = ({
  connectors,
  onConnectNewApp,
  className,
}) => {
  const connectedCount = connectors.filter((c) => c.status === 'connected' || c.status === 'up_to_date').length;
  const needsAttentionCount = connectors.filter((c) => c.status === 'needs_attention' || c.status === 'error' || c.status === 'connection_failed').length;
  const disconnectedCount = connectors.filter((c) => c.status === 'not_connected').length;

  return (
    <div
      className={cn(
        'p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-blue-50/30 border border-slate-200/80 shadow-2xs relative overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          {/* Orbital Orb Graphic */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs">
            <svg viewBox="0 0 48 48" className="w-12 h-12 text-blue-600">
              <defs>
                <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="8" fill="url(#orbGrad)" />
              <ellipse
                cx="24"
                cy="24"
                rx="18"
                ry="8"
                fill="none"
                stroke="url(#orbGrad)"
                strokeWidth="2.5"
                transform="rotate(-25 24 24)"
                strokeDasharray="100"
              />
              <ellipse
                cx="24"
                cy="24"
                rx="18"
                ry="8"
                fill="none"
                stroke="url(#orbGrad)"
                strokeWidth="2.5"
                transform="rotate(35 24 24)"
                strokeOpacity="0.6"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
              {connectedCount} {connectedCount === 1 ? 'app' : 'apps'} connected
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Your digital world is connected
            </p>

            {/* Metrics Pills Row */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{connectedCount} Connected</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                <span>{needsAttentionCount} Needs attention</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0" />
                <span>{disconnectedCount} Disconnected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 self-start md:self-center">
          <button
            onClick={onConnectNewApp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Connect New App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
