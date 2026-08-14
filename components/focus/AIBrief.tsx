'use client';

import React from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';

export interface AIBriefProps {
  userName?: string;
  taskCount?: number;
  eventCount?: number;
  onOpenWhyThisPlan: () => void;
}

export const AIBrief: React.FC<AIBriefProps> = ({
  userName = 'Aryan',
  taskCount = 11,
  eventCount = 3,
  onOpenWhyThisPlan,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-indigo-100/90 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] p-4 sm:p-5 transition-all">
      {/* Soft background ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/30 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Sparkle + Greeting */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <Sparkles className="h-5 w-5 fill-indigo-500/10 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
              Good morning, {userName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              I have prioritized your {taskCount} tasks and {eventCount} events.
            </p>
          </div>
        </div>

        {/* Right Side: "Why this plan?" button */}
        <button
          onClick={onOpenWhyThisPlan}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/80 px-3 py-1.5 rounded-lg border border-transparent hover:border-indigo-100 transition-colors self-start sm:self-auto group cursor-pointer"
        >
          <span>Why this plan?</span>
          <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </div>
  );
};
