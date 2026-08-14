'use client';

import React from 'react';
import {
  User,
  Settings as SettingsIcon,
  Sparkles,
  Database,
  Shield,
  Bell,
  Moon,
  Grid,
  Code2,
} from 'lucide-react';
import { SettingsTabId } from './types';
import { cn } from '../../lib/utils';

export interface NavSectionItem {
  id: SettingsTabId;
  label: string;
  icon: React.ReactNode;
}

export const SETTINGS_SECTIONS: NavSectionItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 'general',
    label: 'General',
    icon: <SettingsIcon className="h-4 w-4" />,
  },
  {
    id: 'ai-brain',
    label: 'AI Preferences',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'memory-data',
    label: 'Memory & Data',
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: 'privacy-security',
    label: 'Privacy & Security',
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: <Moon className="h-4 w-4" />,
  },
  {
    id: 'connected-apps',
    label: 'Connected Apps',
    icon: <Grid className="h-4 w-4" />,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: <Code2 className="h-4 w-4" />,
  },
];

export interface SettingsSectionNavProps {
  activeTab: SettingsTabId;
  onSelectTab: (tab: SettingsTabId) => void;
  className?: string;
}

export const SettingsSectionNav: React.FC<SettingsSectionNavProps> = ({
  activeTab,
  onSelectTab,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col gap-1',
        className
      )}
    >
      {SETTINGS_SECTIONS.map((section) => {
        const isActive = activeTab === section.id;
        return (
          <button
            key={section.id}
            onClick={() => onSelectTab(section.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer text-left select-none',
              isActive
                ? 'bg-blue-50/90 text-blue-600 font-bold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <span
              className={cn(
                'shrink-0 transition-colors',
                isActive ? 'text-blue-600' : 'text-slate-500'
              )}
            >
              {section.icon}
            </span>
            <span className="truncate">{section.label}</span>
          </button>
        );
      })}
    </div>
  );
};
