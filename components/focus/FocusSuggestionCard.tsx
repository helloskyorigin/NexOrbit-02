'use client';

import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export interface FocusSuggestionCardProps {
  timeWindow?: string;
  onScheduleFocusTime: () => void;
}

export const FocusSuggestionCard: React.FC<FocusSuggestionCardProps> = ({
  timeWindow = '9:00 AM – 11:00 AM',
  onScheduleFocusTime,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>Focus Time Suggestion</span>
        </h3>
        <Sparkles className="h-4 w-4 text-indigo-500/80" />
      </div>

      {/* Suggestion Card Container */}
      <div className="rounded-xl bg-indigo-50/40 border border-indigo-100/70 p-4">
        <div className="text-xs text-slate-600">Your most productive time is</div>
        <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 tracking-tight">
          {timeWindow}
        </div>
        <p className="text-xs text-slate-600 mt-1">Schedule deep work during this time.</p>

        {/* Schedule Button */}
        <button
          onClick={onScheduleFocusTime}
          className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-indigo-50/80 border border-indigo-200/70 text-xs sm:text-sm font-medium text-indigo-700 transition-all shadow-xs cursor-pointer active:scale-98"
        >
          <Calendar className="h-4 w-4 text-indigo-600" />
          <span>Schedule focus time</span>
        </button>
      </div>
    </div>
  );
};
