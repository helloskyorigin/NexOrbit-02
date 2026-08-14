'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { UserProfile } from './types';
import { cn } from '../../lib/utils';

export interface SettingsHeaderProps {
  user: UserProfile;
  onEditProfile?: () => void;
  onOpenNotifications?: () => void;
  className?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  user,
  onEditProfile,
  onOpenNotifications,
  className,
}) => {
  const { addToast } = useToast();

  const handleSearchClick = () => {
    addToast({
      type: 'info',
      title: 'Search Settings',
      description: 'Type to filter preferences or navigate sections.',
    });
  };

  const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className={cn('flex items-center justify-between gap-4 pb-4 pt-1', className)}>
      <div className="space-y-0.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Manage your preferences and control your experience.
        </p>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Search button */}
        <button
          onClick={handleSearchClick}
          aria-label="Search settings"
          className="h-9 w-9 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications bell button */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="h-9 w-9 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer relative"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Profile Avatar Badge */}
        <button
          onClick={onEditProfile}
          title="Edit Profile"
          className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-2xs select-none hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {initialLetter}
        </button>
      </div>
    </div>
  );
};
