'use client';

import React from 'react';
import { MemoryCategory } from './types';
import { cn } from '../../lib/utils';

export type CategoryTabOption = 'All Memory' | MemoryCategory;

export interface MemoryCategoryTabsProps {
  activeTab: CategoryTabOption;
  onSelectTab: (tab: CategoryTabOption) => void;
}

export const MemoryCategoryTabs: React.FC<MemoryCategoryTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: CategoryTabOption[] = [
    'All Memory',
    'People',
    'Preferences',
    'Projects',
    'Knowledge',
    'Decisions',
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
              isSelected
                ? 'bg-indigo-50/90 text-indigo-700 font-bold border border-indigo-100 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
