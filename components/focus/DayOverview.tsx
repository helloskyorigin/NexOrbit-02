'use client';

import React from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';

export interface DayOverviewProps {
  score?: number;
  percentageChange?: number;
  focusHours?: string;
  meetingsCount?: number;
}

export const DayOverview: React.FC<DayOverviewProps> = ({
  score = 88,
  percentageChange = 12,
  focusHours = '4h 20m',
  meetingsCount = 3,
}) => {
  // Circular gauge calculations
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>Day Overview</span>
        </h3>
        <Sparkles className="h-4 w-4 text-indigo-500/80" />
      </div>

      {/* Main Score & Circular Gauge */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{score}%</span>
            <span className="text-xs font-medium text-slate-600">Day Score</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600">
            <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>{percentageChange}% vs yesterday</span>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
          <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 80 80">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth="6"
            />
            {/* Active progress ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-indigo-600 fill-none transition-all duration-1000 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Stats Breakdown: Focus & Meetings */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div>
          <div className="text-xs font-medium text-slate-600">Focus</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{focusHours}</div>
          <div className="text-[11px] text-slate-600 mt-0.5">Deep work time</div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-600">Meetings</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{meetingsCount}</div>
          <div className="text-[11px] text-slate-600 mt-0.5">Total scheduled</div>
        </div>
      </div>
    </div>
  );
};
