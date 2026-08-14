'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, Inbox } from 'lucide-react';
import { MemoryItem } from './types';
import { MemoryCard } from './MemoryCard';
import { Button } from '../ui/Button';

export interface MemoryTimelineProps {
  memories: MemoryItem[];
  onSelectMemory: (memory: MemoryItem) => void;
  onEditMemory: (memory: MemoryItem) => void;
  onForgetMemory: (memory: MemoryItem) => void;
  onTogglePin: (memory: MemoryItem) => void;
  onOpenSource: (memory: MemoryItem) => void;
  onResetFilters?: () => void;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  memories,
  onSelectMemory,
  onEditMemory,
  onForgetMemory,
  onTogglePin,
  onOpenSource,
  onResetFilters,
}) => {
  const [visibleLimit, setVisibleLimit] = useState(6);

  // Group visible memories by date group
  const dateGroups: ('Today' | 'Yesterday' | 'Earlier this week' | 'Older')[] = [
    'Today',
    'Yesterday',
    'Earlier this week',
    'Older',
  ];

  const visibleMemories = memories.slice(0, visibleLimit);

  if (memories.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 text-center space-y-4 shadow-2xs">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
          <Inbox className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">No memories matched</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing active filters, or creating a new memory.
          </p>
        </div>
        {onResetFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
            className="text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Reset Filters &amp; Search
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Vertical Connecting Timeline Spine Line */}
      <div className="absolute left-[70px] sm:left-[86px] top-6 bottom-16 w-px bg-slate-200/70 -z-0" />

      {dateGroups.map((group) => {
        const groupMemories = visibleMemories.filter((m) => m.dateGroup === group);
        if (groupMemories.length === 0) return null;

        return (
          <div key={group} className="space-y-3 relative z-10 text-left">
            {/* Date Section Header */}
            <div className="flex items-center gap-2 pl-2">
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                {group}
              </span>
            </div>

            {/* List of Memory Cards in this group */}
            <div className="space-y-3">
              {groupMemories.map((mem, idx) => (
                <MemoryCard
                  key={mem.id}
                  memory={mem}
                  onClick={onSelectMemory}
                  onEdit={onEditMemory}
                  onForget={onForgetMemory}
                  onTogglePin={onTogglePin}
                  onOpenSource={onOpenSource}
                  isFirst={idx === 0}
                  isLast={idx === groupMemories.length - 1}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Load More Button */}
      {visibleLimit < memories.length && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setVisibleLimit((prev) => prev + 4)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span>Load more</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
};
