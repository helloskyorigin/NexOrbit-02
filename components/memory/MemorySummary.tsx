'use client';

import React from 'react';
import { Network, ArrowRight } from 'lucide-react';

export interface MemorySummaryProps {
  totalMemories?: number;
  peopleCount?: number;
  projectsCount?: number;
  preferencesCount?: number;
  knowledgeCount?: number;
  onViewConnections?: () => void;
}

export const MemorySummary: React.FC<MemorySummaryProps> = ({
  totalMemories = 128,
  peopleCount = 32,
  projectsCount = 18,
  preferencesCount = 21,
  knowledgeCount = 57,
  onViewConnections,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Stats Section */}
        <div className="space-y-3 min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
            Memory at a glance
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
            {/* Total Memories */}
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {totalMemories}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Total Memories
              </div>
            </div>

            {/* People */}
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {peopleCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                People
              </div>
            </div>

            {/* Projects */}
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {projectsCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Projects
              </div>
            </div>

            {/* Preferences */}
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {preferencesCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Preferences
              </div>
            </div>

            {/* Knowledge */}
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {knowledgeCount}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Knowledge
              </div>
            </div>
          </div>
        </div>

        {/* Right View Connections Card / Action Button */}
        <div className="shrink-0 pt-2 lg:pt-0">
          <button
            onClick={onViewConnections}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 hover:border-slate-300 text-slate-800 transition-all flex items-center justify-center gap-3 group cursor-pointer active:scale-95"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Network className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <span>View Connections</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
