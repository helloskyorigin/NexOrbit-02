'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white border border-slate-200/80', className)}>
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4 border border-slate-200">
        {icon || <Inbox className="h-6 w-6 stroke-[1.5]" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
