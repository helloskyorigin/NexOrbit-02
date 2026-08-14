'use client';

import React from 'react';
import {
  Calendar,
  Users,
  Heart,
  BookOpen,
  Scale,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from './types';
import { MemorySourceIcon } from './MemorySourceIcon';
import { cn } from '../../lib/utils';

export interface MemoryCardProps {
  memory: MemoryItem;
  isSelected?: boolean;
  onClick: (memory: MemoryItem) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  isSelected,
  onClick,
}) => {
  // Category badge & icon styling matching reference image
  const getCategoryStyles = (category: MemoryCategory) => {
    switch (category) {
      case 'Projects':
        return {
          iconBox: 'bg-blue-50 text-blue-600 border border-blue-100',
          badge: 'bg-blue-50 text-blue-600 border border-blue-100/80',
          icon: Calendar,
        };
      case 'People':
        return {
          iconBox: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
          badge: 'bg-indigo-50 text-indigo-600 border border-indigo-100/80',
          icon: Users,
        };
      case 'Preferences':
        return {
          iconBox: 'bg-rose-50 text-rose-500 border border-rose-100',
          badge: 'bg-rose-50 text-rose-500 border border-rose-100/80',
          icon: Heart,
        };
      case 'Knowledge':
        return {
          iconBox: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          badge: 'bg-emerald-50 text-emerald-600 border border-emerald-100/80',
          icon: BookOpen,
        };
      case 'Decisions':
        return {
          iconBox: 'bg-amber-50 text-amber-600 border border-amber-100',
          badge: 'bg-amber-50 text-amber-600 border border-amber-100/80',
          icon: Scale,
        };
      default:
        return {
          iconBox: 'bg-slate-50 text-slate-600 border border-slate-100',
          badge: 'bg-slate-50 text-slate-600 border border-slate-100',
          icon: FileText,
        };
    }
  };

  const style = getCategoryStyles(memory.category);
  const IconComponent = style.icon;

  return (
    <div
      onClick={() => onClick(memory)}
      className={cn(
        'group p-4 rounded-2xl bg-white border transition-all cursor-pointer text-left flex items-start justify-between gap-4 relative',
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-500/20 shadow-xs'
          : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
      )}
    >
      {/* Left Icon & Text Block */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Category Square Icon Box */}
        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5', style.iconBox)}>
          <IconComponent className="h-4 w-4" />
        </div>

        {/* Text Details */}
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
              {memory.title}
            </h4>
            <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none', style.badge)}>
              {memory.tag || memory.category}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
            {memory.description}
          </p>
        </div>
      </div>

      {/* Right Date & Source Info */}
      <div className="flex items-center gap-3 shrink-0 pt-0.5">
        <div className="text-right hidden sm:block">
          <div className="text-xs text-slate-400 font-medium">
            {memory.timestamp}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-0.5 text-xs font-medium text-slate-600">
            <MemorySourceIcon type={memory.source.type} name={memory.source.name} className="h-3.5 w-3.5" />
            <span>{memory.source.name}</span>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="text-slate-300 group-hover:text-slate-600 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
