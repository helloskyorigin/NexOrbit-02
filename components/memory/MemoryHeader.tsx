'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  Bell,
  ChevronDown,
  Sparkles,
  Layers,
  FileText,
  Mic,
  Link2,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface MemoryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  isFiltersActive: boolean;
  onAddMemory: (mode?: 'manual' | 'voice' | 'quick') => void;
  onNavigateSettings?: () => void;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenFilters,
  isFiltersActive,
  onAddMemory,
  onNavigateSettings,
}) => {
  const { addToast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

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
    <div className="space-y-4 pt-1 sm:pt-2">
      {/* Top Main Title & Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <span>Memory</span>
              <span className="text-indigo-500 inline-block text-2xl font-normal leading-none">
                ✦
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Your AI remembers what matters and connects the dots.
          </p>
        </div>

        {/* Top Right: Status, Bell & User Avatar */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Synced Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-xs font-semibold text-emerald-700 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synced</span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() =>
              addToast({
                title: 'Memory Activity Synced',
                description: '6 new synaptic memories indexed from Gmail and Calendar today.',
                type: 'info',
              })
            }
            className="h-9 w-9 rounded-full bg-white hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* User Avatar */}
          <button
            type="button"
            onClick={onNavigateSettings}
            className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-900 via-indigo-700 to-indigo-500 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 transition-transform border border-indigo-200/40"
            title="Aryan Mehta (Account Settings)"
          >
            <span>AM</span>
          </button>
        </div>
      </div>

      {/* Top Search & Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Search Memory Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search memory..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-14 py-2 bg-white rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-400 bg-slate-100 rounded-md border border-slate-200">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Action Buttons: Filters & + Add to Memory */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Filters Button */}
          <button
            onClick={onOpenFilters}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs',
              isFiltersActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs font-bold'
                : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
            {isFiltersActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            )}
          </button>

          {/* Primary + Add to Memory Button with Dropdown */}
          <div className="relative inline-block">
            <div className="inline-flex rounded-xl shadow-xs">
              <button
                onClick={() => onAddMemory('manual')}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 px-4 rounded-l-xl transition-all cursor-pointer active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add to Memory</span>
              </button>
              <button
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white px-2 rounded-r-xl border-l border-indigo-500/50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Add options"
              >
                <ChevronDown className="h-3.5 w-3.5 opacity-90" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isAddMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsAddMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150 text-left">
                  <button
                    onClick={() => {
                      setIsAddMenuOpen(false);
                      onAddMemory('manual');
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <span>Create custom memory</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAddMenuOpen(false);
                      onAddMemory('quick');
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>AI auto-extract synapse</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAddMenuOpen(false);
                      addToast({
                        title: 'Voice Recording',
                        description: 'Microphone memory transcription ready.',
                        type: 'info',
                      });
                      onAddMemory('voice');
                    }}
                    className="w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Mic className="h-4 w-4 text-rose-500" />
                    <span>Record voice memory</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
