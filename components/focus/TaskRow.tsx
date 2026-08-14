'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { DailyPlanItem } from './types';
import { SourceIcon } from '../changes/SourceIcon';
import { cn } from '../../lib/utils';

export interface TaskRowProps {
  item: DailyPlanItem;
  onActionClick: (item: DailyPlanItem) => void;
  onCompleteToggle: (id: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  item,
  onActionClick,
  onCompleteToggle,
}) => {
  // Priority styling for time badge and priority tag
  const getTimeStyles = () => {
    switch (item.priority) {
      case 'high':
        return 'bg-rose-50 text-rose-600 border border-rose-100/60';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border border-amber-100/60';
      case 'low':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100/60';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const getPriorityBadgeStyles = () => {
    switch (item.priority) {
      case 'high':
        return 'bg-rose-50 text-rose-600';
      case 'medium':
        return 'bg-amber-50 text-amber-600';
      case 'low':
        return 'bg-emerald-50 text-emerald-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div
      id={`plan-item-${item.id}`}
      className={cn(
        'group flex items-center justify-between p-3 sm:p-3.5 bg-white border border-slate-100/90 rounded-2xl hover:border-slate-200/90 hover:shadow-2xs transition-all duration-150',
        item.isCompleted && 'opacity-60 bg-slate-50/50'
      )}
    >
      {/* Left section: Time + Checkbox + Icon + Title/Subtitle */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2">
        {/* Toggle completion checkbox button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompleteToggle(item.id);
          }}
          className={cn(
            'h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer',
            item.isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-200 hover:border-slate-300 bg-white text-transparent'
          )}
          title={item.isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </button>

        {/* Time Badge */}
        <div className={cn('px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0', getTimeStyles())}>
          {item.time}
        </div>

        {/* Source Icon Box */}
        <div className="h-9 w-9 rounded-xl bg-indigo-50/60 border border-indigo-100/40 flex items-center justify-center shrink-0">
          <SourceIcon type={item.sourceIcon || item.source} className="h-4 w-4" />
        </div>

        {/* Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              'text-xs sm:text-sm font-semibold text-slate-900 truncate',
              item.isCompleted && 'line-through text-slate-400 font-normal'
            )}
          >
            {item.title}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
            {item.subtitle}
          </div>
        </div>
      </div>

      {/* Right section: Priority Badge + Action Arrow */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        <span className={cn('px-3 py-1 rounded-full text-xs font-medium capitalize', getPriorityBadgeStyles())}>
          {item.priority === 'high' ? 'High' : item.priority === 'medium' ? 'Medium' : 'Low'}
        </span>

        <button
          onClick={() => onActionClick(item)}
          className="h-7 w-7 rounded-lg border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Open task options"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
