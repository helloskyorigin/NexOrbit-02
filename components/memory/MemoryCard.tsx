'use client';

import React, { useState } from 'react';
import {
  MoreHorizontal,
  ExternalLink,
  Edit3,
  Pin,
  Trash2,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';
import { MemoryItem } from './types';
import { MemorySourceIcon } from './MemorySourceIcon';
import { cn } from '../../lib/utils';

export interface MemoryCardProps {
  memory: MemoryItem;
  onClick: (memory: MemoryItem) => void;
  onEdit: (memory: MemoryItem) => void;
  onForget: (memory: MemoryItem) => void;
  onTogglePin: (memory: MemoryItem) => void;
  onOpenSource: (memory: MemoryItem) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onClick,
  onEdit,
  onForget,
  onTogglePin,
  onOpenSource,
  isFirst,
  isLast,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getDotBg = (color?: string) => {
    switch (color) {
      case 'green':
        return 'bg-emerald-500 ring-emerald-100';
      case 'blue':
        return 'bg-blue-500 ring-blue-100';
      case 'amber':
        return 'bg-amber-500 ring-amber-100';
      case 'purple':
      default:
        return 'bg-indigo-600 ring-indigo-100';
    }
  };

  const formatSourceSubtitle = (mem: MemoryItem) => {
    const s = mem.source;
    if (s.email) return `${s.name} • ${s.email}`;
    if (s.path) return `${s.name} • ${s.path}`;
    if (s.type === 'meeting') return s.detail || 'Memory from meeting notes';
    if (s.type === 'decision') return 'Decision';
    return s.name;
  };

  return (
    <div className="relative flex items-start gap-3 sm:gap-5 group">
      {/* Left Timeline Timestamp & Dot */}
      <div className="w-16 sm:w-20 pt-4 flex items-center justify-end gap-2.5 shrink-0 text-right">
        <span className="text-[11px] sm:text-xs font-semibold text-slate-500 whitespace-nowrap">
          {memory.timestamp}
        </span>
        <div className="relative flex items-center justify-center">
          <div
            className={cn(
              'h-2.5 w-2.5 rounded-full ring-4 transition-transform group-hover:scale-125',
              getDotBg(memory.dotColor)
            )}
          />
        </div>
      </div>

      {/* Main Memory Card Container */}
      <div
        onClick={() => onClick(memory)}
        className={cn(
          'flex-1 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-indigo-200 transition-all cursor-pointer relative text-left',
          memory.isPinned && 'border-indigo-200/90 bg-gradient-to-r from-indigo-50/20 via-white to-white'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left Icon & Text Content */}
          <div className="flex items-start gap-3.5 min-w-0">
            {/* App / Source Icon */}
            <MemorySourceIcon
              type={memory.source.type}
              name={memory.source.name}
              className="h-9 w-9 rounded-xl text-xs shrink-0"
            />

            {/* Texts */}
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {memory.title}
                </h4>
                {memory.isPinned && (
                  <Pin className="h-3 w-3 text-indigo-500 fill-indigo-500/20 shrink-0" />
                )}
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                {memory.description}
              </p>

              <div className="pt-0.5 text-[11px] text-slate-400 font-medium flex items-center gap-1.5 truncate">
                <span>{formatSourceSubtitle(memory)}</span>
              </div>
            </div>
          </div>

          {/* Right Tag & Three-dot Menu */}
          <div className="flex items-center gap-2 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
            {/* Category / Project Tag */}
            {memory.tag && (
              <span className="hidden xs:inline-block text-[11px] font-semibold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100/80 whitespace-nowrap">
                {memory.tag}
              </span>
            )}

            {/* Three Dot Action Button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Memory actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {/* Action Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 text-left">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onClick(memory);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      <span>View details</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onEdit(memory);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                      <span>Edit memory</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onTogglePin(memory);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Pin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{memory.isPinned ? 'Unpin memory' : 'Pin memory'}</span>
                    </button>

                    {memory.source.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          onOpenSource(memory);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        <span>Open source</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onForget(memory);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                      <span>Forget memory</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
