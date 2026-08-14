'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div className={cn('p-5 rounded-xl bg-red-50/60 border border-red-200 flex items-start gap-3.5', className)}>
      <div className="p-1.5 rounded-lg bg-red-100 text-red-600 shrink-0 mt-0.5">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-semibold text-red-900">{title}</h4>
        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{message}</p>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            className="mt-2 text-xs text-red-700 hover:bg-red-100 h-7 px-2.5"
          >
            Retry operation
          </Button>
        )}
      </div>
    </div>
  );
};
