'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pills' | 'soft';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'line',
  className,
}) => {
  if (variant === 'pills') {
    return (
      <div className={cn('flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/80', className)}>
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all duration-150 select-none',
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="ml-1">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-6 border-b border-slate-200', className)}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-2.5 text-xs font-semibold border-b-2 transition-all duration-150 select-none -mb-px',
              isActive
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
};
