'use client';

import React from 'react';
import { Users, Calendar, Heart, BookOpen, Scale, Sparkles } from 'lucide-react';
import { MemoryCategory } from './types';
import { cn } from '../../lib/utils';

export type CategoryTabOption = 'All' | MemoryCategory;

export interface MemoryCategoryTabsProps {
  activeTab: CategoryTabOption;
  onSelectTab: (tab: CategoryTabOption) => void;
}

export const MemoryCategoryTabs: React.FC<MemoryCategoryTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: { id: CategoryTabOption; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'All', label: 'All', icon: Sparkles },
    { id: 'People', label: 'People', icon: Users },
    { id: 'Projects', label: 'Projects', icon: Calendar },
    { id: 'Preferences', label: 'Preferences', icon: Heart },
    { id: 'Knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'Decisions', label: 'Decisions', icon: Scale },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border',
              isSelected
                ? 'bg-blue-50/80 border-blue-500 text-blue-600 font-semibold shadow-2xs'
                : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            )}
          >
            {tab.id !== 'All' && <IconComponent className="h-3.5 w-3.5 shrink-0" />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
