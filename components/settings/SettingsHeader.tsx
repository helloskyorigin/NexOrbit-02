'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { UserProfile } from './types';
import { cn } from '../../lib/utils';

export interface SettingsHeaderProps {
  user: UserProfile;
  onEditProfile?: () => void;
  className?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  user,
  onEditProfile,
  className,
}) => {
  const { addToast } = useToast();

  const handleNotificationClick = () => {
    addToast({
      type: 'info',
      title: 'System Notifications',
      description: 'All 6 context integrations are synchronized and operating normally.',
    });
  };

  return (
    <div className={cn('relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 pt-2', className)}>
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-sans flex items-center gap-2">
            <span>Settings</span>
            <span className="text-indigo-600 text-xl inline-block animate-pulse">
              ✦
            </span>
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Manage your preferences, data and NEXORBIT experience.
        </p>
      </div>

      {/* Top-Right Control Bar */}
      <div className="flex items-center flex-wrap gap-3 sm:gap-4 shrink-0">
        {/* Synced Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/80 text-[11px] font-semibold text-emerald-700 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Synced</span>
        </div>

        {/* Notification Bell Button */}
        <button
          onClick={handleNotificationClick}
          aria-label="View notifications"
          className="h-8.5 w-8.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
        </button>

        {/* User Avatar */}
        <div
          onClick={onEditProfile}
          title="Click to edit profile"
          className="cursor-pointer group relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-xs group-hover:ring-2 group-hover:ring-indigo-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
