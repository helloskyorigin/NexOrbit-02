'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ShieldCheck, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface ConnectionOverviewProps {
  connectors: ConnectorItem[];
  className?: string;
}

export const ConnectionOverview: React.FC<ConnectionOverviewProps> = ({
  connectors,
  className,
}) => {
  const connectedList = connectors.filter((c) => c.status !== 'not_connected');
  const connectedCount = connectedList.length;
  const totalCount = connectors.length;

  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50/60 to-slate-100/50 text-slate-900 shadow-sm border border-indigo-100 relative overflow-hidden',
        className
      )}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              Brain Context Synapses
            </span>
            <Badge variant="indigo" size="sm" className="bg-indigo-100 text-indigo-700 border-indigo-200/50">
              <Sparkles className="h-3 w-3 mr-1 inline" />
              {connectedCount} of {totalCount} Connected
            </Badge>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950">
            Workspace Intelligence Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            NEXORBIT dynamically indexes authorized emails, documents, and calendar events to deliver context-aware answers, daily cleanup, and goal insights.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-white p-3.5 rounded-xl border border-slate-100/80 shadow-3xs">
          <div className="space-y-0.5 text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Active Health</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All Synced
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-500 font-medium block">Privacy Standard</span>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              Zero Training
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
