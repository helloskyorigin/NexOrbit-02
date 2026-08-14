'use client';

import React from 'react';
import { CheckCircle2, RefreshCw, AlertCircle, AlertTriangle, Circle } from 'lucide-react';
import { SyncState } from './types';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface ConnectorStatusProps {
  status: SyncState;
  customLabel?: string;
  className?: string;
}

export const ConnectorStatus: React.FC<ConnectorStatusProps> = ({
  status,
  customLabel,
  className,
}) => {
  switch (status) {
    case 'connected':
    case 'up_to_date':
      return (
        <Badge
          variant="success"
          size="sm"
          className={cn('bg-emerald-50 text-emerald-700 border-emerald-200/90 font-medium', className)}
        >
          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600 inline shrink-0" />
          {customLabel || (status === 'up_to_date' ? 'Up to date' : 'Connected')}
        </Badge>
      );
    case 'syncing':
      return (
        <Badge
          variant="info"
          size="sm"
          className={cn('bg-blue-50 text-blue-700 border-blue-200/90 font-medium', className)}
        >
          <RefreshCw className="h-3 w-3 mr-1 text-blue-600 animate-spin inline shrink-0" />
          {customLabel || 'Syncing context...'}
        </Badge>
      );
    case 'needs_attention':
      return (
        <Badge
          variant="warning"
          size="sm"
          className={cn('bg-amber-50 text-amber-800 border-amber-200/90 font-medium', className)}
        >
          <AlertTriangle className="h-3 w-3 mr-1 text-amber-600 inline shrink-0" />
          {customLabel || 'Needs attention'}
        </Badge>
      );
    case 'error':
      return (
        <Badge
          variant="danger"
          size="sm"
          className={cn('bg-red-50 text-red-700 border-red-200/90 font-medium', className)}
        >
          <AlertCircle className="h-3 w-3 mr-1 text-red-500 inline shrink-0" />
          {customLabel || "Couldn't sync. Try again."}
        </Badge>
      );
    case 'not_connected':
    default:
      return (
        <Badge
          variant="default"
          size="sm"
          className={cn('bg-slate-100 text-slate-500 border-slate-200 font-medium', className)}
        >
          <Circle className="h-2.5 w-2.5 mr-1 text-slate-400 inline shrink-0" />
          {customLabel || 'Not connected'}
        </Badge>
      );
  }
};
