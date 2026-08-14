'use client';

import React, { useRef, useEffect } from 'react';
import { Search, ChevronDown, Bell, Sparkles } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface MemoryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  isFiltersActive: boolean;
  onNavigateSettings?: () => void;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenFilters,
  isFiltersActive,
  onNavigateSettings,
}) => {
  const { addToast } = useToast();
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Memory</span>
          <Sparkles className="h-5 w-5 text-blue-500 fill-blue-500/10" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Things NEXORBIT remembers about your world.
        </p>
      </div>

      {/* Top Right Controls: Search, Filter, Bell, User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search your memory..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-md border border-slate-200">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={onOpenFilters}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-2xs bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50',
            isFiltersActive && 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
          )}
        >
          <span>Filter</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() =>
            addToast({
              title: 'Memory Activity Synced',
              description: 'Memory graph is up to date.',
              type: 'info',
            })
          }
          className="h-9 w-9 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-2xs relative shrink-0"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onNavigateSettings}
          className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-2xs hover:bg-blue-700 transition-colors shrink-0"
          title="Satyam (Account Settings)"
        >
          <span>S</span>
        </button>
      </div>
    </div>
  );
};
