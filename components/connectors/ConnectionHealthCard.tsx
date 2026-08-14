'use client';

import React from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectionHealthCardProps {
  onViewStatus?: () => void;
  className?: string;
}

export const ConnectionHealthCard: React.FC<ConnectionHealthCardProps> = ({
  onViewStatus,
  className,
}) => {
  return (
    <div className={cn('p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4 text-center', className)}>
      <div className="flex items-center justify-between text-left">
        <h3 className="text-base font-bold text-slate-900 font-sans">
          Connection Health
        </h3>
      </div>

      <div className="py-2 space-y-3">
        <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-slate-900">
            All systems operational
          </h4>
          <p className="text-xs text-slate-400 font-normal">
            Last checked just now
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 text-left">
        <button
          onClick={onViewStatus}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View status</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
