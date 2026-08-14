'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectedAppsHeaderProps {
  className?: string;
  onOpenNotifications?: () => void;
}

export const ConnectedAppsHeader: React.FC<ConnectedAppsHeaderProps> = ({
  className,
  onOpenNotifications,
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-4 pb-2 pt-1', className)}>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Connected Apps
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Connect the tools you use so NEXORBIT can understand your world.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenNotifications}
          className="h-9 w-9 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-2xs select-none">
          S
        </div>
      </div>
    </div>
  );
};
