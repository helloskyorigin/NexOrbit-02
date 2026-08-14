'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
}) => {
  if (variant === 'card') {
    return (
      <div className={cn('p-4 rounded-xl border border-slate-200/80 bg-white space-y-3 animate-pulse', className)}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-slate-200 rounded-md w-1/3" />
            <div className="h-2 bg-slate-150 rounded-md w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-slate-200 rounded-md w-full" />
        <div className="h-3 bg-slate-200 rounded-md w-4/5" />
      </div>
    );
  }

  const variants = {
    text: 'h-4 w-full rounded-md',
    circular: 'h-10 w-10 rounded-full',
    rectangular: 'h-20 w-full rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/80 rounded-md',
        variants[variant],
        className
      )}
    />
  );
};
