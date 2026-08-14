'use client';

import React from 'react';
import { Sun, Calendar as CalendarIcon, CheckSquare, Target } from 'lucide-react';
import { CleanMyDayTab } from './types';
import { cn } from '../../lib/utils';

export interface DailyPlanTabsProps {
  activeTab: CleanMyDayTab;
  onSelectTab: (tab: CleanMyDayTab) => void;
}

export const DailyPlanTabs: React.FC<DailyPlanTabsProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: CleanMyDayTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'daily-plan',
      label: 'Daily Plan',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      id: 'time-blocks',
      label: 'Time Blocks',
      icon: <CalendarIcon className="h-4 w-4" />,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="h-4 w-4" />,
    },
    {
      id: 'focus-time',
      label: 'Focus Time',
      icon: <Target className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 overflow-x-auto no-scrollbar w-fit max-w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer',
              isActive
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            )}
          >
            <span className={cn(isActive ? 'text-indigo-600' : 'text-slate-500')}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
