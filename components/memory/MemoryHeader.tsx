'use client';

import React, { useRef, useEffect } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MemoryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  isFiltersActive: boolean;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenFilters,
  isFiltersActive,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Memory</span>
          <Sparkles className="h-5 w-5 text-indigo-600 fill-indigo-600/10" />
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Everything NexOrbit remembers about your connected world.
        </p>
      </div>

      {/* Right Controls: Search & Filter */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search memory..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-white rounded-xl border border-slate-200/90 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-md border border-slate-200/80">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={onOpenFilters}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shrink-0',
            isFiltersActive && 'bg-indigo-50 border-indigo-200 text-indigo-700'
          )}
        >
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

