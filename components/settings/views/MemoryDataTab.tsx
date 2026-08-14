'use client';

import React, { useState } from 'react';
import { Database, ChevronRight, HardDrive, Trash2, ArrowUpRight } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface MemoryDataTabProps {
  onNavigateMemory: () => void;
  className?: string;
}

export const MemoryDataTab: React.FC<MemoryDataTabProps> = ({
  onNavigateMemory,
  className,
}) => {
  const { addToast } = useToast();
  const [useMemoriesToggle, setUseMemoriesToggle] = useState(true);

  const handleToggle = () => {
    const nextVal = !useMemoriesToggle;
    setUseMemoriesToggle(nextVal);
    addToast({
      type: 'info',
      title: 'Memory Setting Updated',
      description: nextVal
        ? 'NEXORBIT will personalize answers using saved memories.'
        : 'Saved memories are temporarily paused for AI responses.',
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Memory & Data
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Control saved memories and vector context storage.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        {/* Toggle: Allow NEXORBIT to use saved memories */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span>Allow NEXORBIT to use saved memories</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              When enabled, NEXORBIT recalls past preferences, key context, and decisions across conversations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              useMemoriesToggle ? 'bg-blue-600' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                useMemoriesToggle ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Manage Memory Navigation Box */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">
              Manage Memory
            </h4>
            <p className="text-[11px] text-slate-500 font-normal">
              View, search, edit, or forget individual memories stored by NEXORBIT.
            </p>
          </div>

          <button
            onClick={onNavigateMemory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <span>Manage Memory</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>

        {/* Storage Breakdown Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-slate-400" />
            <span>Memory Vector Storage</span>
          </h4>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Vector Embeddings</span>
              <span>1.2 GB (142 Memory Nodes)</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Cached Entity Graph</span>
              <span>0.8 GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
