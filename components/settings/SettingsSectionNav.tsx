'use client';

import React from 'react';
import {
  Sliders,
  Brain,
  Shield,
  LayoutGrid,
  Bell,
  Palette,
  Keyboard,
  CreditCard,
  Code2,
} from 'lucide-react';
import { SettingsTabId } from './types';
import { cn } from '../../lib/utils';

export interface NavSectionItem {
  id: SettingsTabId;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const SETTINGS_SECTIONS: NavSectionItem[] = [
  {
    id: 'general',
    label: 'General',
    subtitle: 'Profile, language, theme',
    icon: <Sliders className="h-4 w-4" />,
  },
  {
    id: 'ai-brain',
    label: 'AI Brain',
    subtitle: 'AI mode, responses, memory',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    id: 'data-privacy',
    label: 'Data & Privacy',
    subtitle: 'Your data, permissions',
    icon: <Shield className="h-4 w-4" />,
  },
  {
    id: 'connected-apps',
    label: 'Connected Apps',
    subtitle: 'Manage integrations',
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    subtitle: 'Alerts, emails, reminders',
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: 'interface',
    label: 'Interface',
    subtitle: 'Density, layout, display',
    icon: <Palette className="h-4 w-4" />,
  },
  {
    id: 'shortcuts',
    label: 'Shortcuts',
    subtitle: 'Keyboard shortcuts',
    icon: <Keyboard className="h-4 w-4" />,
  },
  {
    id: 'billing',
    label: 'Billing',
    subtitle: 'Plan, invoices, payments',
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: 'advanced',
    label: 'Advanced',
    subtitle: 'Labs, beta features, logs',
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
        'w-full lg:w-[260px] shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none',
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
              'group relative flex items-start gap-3 p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer shrink-0 lg:shrink w-auto lg:w-full border select-none',
              isActive
                ? 'bg-indigo-50/90 border-indigo-200/80 shadow-2xs'
                : 'bg-white/60 hover:bg-white border-slate-200/70 hover:border-slate-300'
            )}
          >
            {/* Icon Box */}
            <div
              className={cn(
                'p-2 rounded-xl shrink-0 transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-500 group-hover:text-slate-800'
              )}
            >
              {section.icon}
            </div>

            {/* Labels */}
            <div className="min-w-0 pr-1">
              <div
                className={cn(
                  'text-xs font-bold transition-colors leading-tight',
                  isActive
                    ? 'text-indigo-950'
                    : 'text-slate-800 group-hover:text-slate-950'
                )}
              >
                {section.label}
              </div>
              <div
                className={cn(
                  'text-[11px] font-medium transition-colors line-clamp-1 mt-0.5',
                  isActive
                    ? 'text-indigo-600/90'
                    : 'text-slate-400'
                )}
              >
                {section.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
