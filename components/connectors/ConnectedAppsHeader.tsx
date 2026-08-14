'use client';

import React from 'react';
import { Link2, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface ConnectedAppsHeaderProps {
  className?: string;
}

export const ConnectedAppsHeader: React.FC<ConnectedAppsHeaderProps> = ({ className }) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80', className)}>
      <SectionHeader
        title="Connected apps"
        subtitle="Connect the tools where your important information lives."
        badge={
          <Badge variant="indigo" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-100">
            <Link2 className="h-3 w-3 mr-1 text-indigo-600 inline" />
            Workspace Context
          </Badge>
        }
      />

      {/* Subtle privacy message */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <span>You&apos;re always in control of what NEXORBIT can access.</span>
      </div>
    </div>
  );
};
