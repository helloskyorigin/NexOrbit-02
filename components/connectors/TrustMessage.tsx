'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TrustMessageProps {
  className?: string;
}

export const TrustMessage: React.FC<TrustMessageProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3 text-xs text-slate-500 font-medium',
        className
      )}
    >
      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
      <span>
        Your connections stay under your control. NEXORBIT only uses connected services according to the permissions you approve.
      </span>
    </div>
  );
};
