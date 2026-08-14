'use client';

import React from 'react';
import { ListTodo, CheckCircle2, Clock } from 'lucide-react';

export interface PlanSummaryCardProps {
  totalItems?: number;
  completedItems?: number;
  pendingItems?: number;
}

export const PlanSummaryCard: React.FC<PlanSummaryCardProps> = ({
  totalItems = 6,
  completedItems = 2,
  pendingItems = 4,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Orbital Visual + Title & Description */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
          {/* Orbital NEXORBIT CSS/SVG Sphere Element */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white border border-indigo-100/60 flex items-center justify-center shrink-0 shadow-inner">
            <div className="absolute inset-0 rounded-full bg-blue-400/10 blur-md" />
            <svg
              className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 relative z-10"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer orbit ring */}
              <ellipse
                cx="50"
                cy="50"
                rx="42"
                ry="18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="opacity-40 animate-spin-slow"
              />
              {/* Core glowing orb */}
              <circle cx="50" cy="50" r="14" fill="url(#orbGlow)" />
              <circle cx="50" cy="50" r="8" fill="#2563EB" />
              {/* Inner highlight */}
              <circle cx="47" cy="47" r="3" fill="#93C5FD" opacity="0.8" />
              <defs>
                <radialGradient id="orbGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) scale(14)">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1D4ED8" stopOpacity="0.2" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Text block */}
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              Here&apos;s your optimized plan for today
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              Based on your schedule, deadlines, and priorities, here&apos;s what NEXORBIT recommends you focus on.
            </p>
          </div>
        </div>

        {/* Right: Summary Statistics Badges */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          {/* Total Items */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ListTodo className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 leading-none">
                {totalItems}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Total Items
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 leading-none">
                {completedItems}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Completed
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 leading-none">
                {pendingItems}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Pending
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
