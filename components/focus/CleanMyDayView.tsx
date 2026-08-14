'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCw, Flag, Check } from 'lucide-react';
import { DailyPlanItem } from './types';
import { INITIAL_TODAY_PLAN_ITEMS } from './mockData';
import { PlanSummaryCard } from './AIBrief';
import { TaskRow } from './TaskRow';
import { TaskActionModal } from './TaskActionModal';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface CleanMyDayViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const CleanMyDayView: React.FC<CleanMyDayViewProps> = ({
  onNavigate,
  className,
}) => {
  const { addToast } = useToast();

  // State
  const [planItems, setPlanItems] = useState<DailyPlanItem[]>(INITIAL_TODAY_PLAN_ITEMS);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [selectedTaskItem, setSelectedTaskItem] = useState<DailyPlanItem | null>(null);

  // Grouped Priorities
  const highPriorityItems = planItems.filter((item) => item.priority === 'high');
  const mediumPriorityItems = planItems.filter((item) => item.priority === 'medium');
  const lowPriorityItems = planItems.filter((item) => item.priority === 'low');

  // Interactive Handlers
  const handleToggleComplete = (id: string) => {
    setPlanItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isCompleted;
          if (nextState) {
            addToast({
              title: 'Task completed',
              description: `Completed: "${item.title}"`,
              type: 'success',
            });
          }
          return { ...item, isCompleted: nextState };
        }
        return item;
      })
    );
  };

  const handleRegeneratePlan = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setPlanItems(INITIAL_TODAY_PLAN_ITEMS.map((item) => ({ ...item, isCompleted: false })));
      addToast({
        title: 'Plan Regenerated',
        description: 'NEXORBIT recalculated priorities based on your connected calendar, emails, and drive files.',
        type: 'success',
      });
    }, 700);
  };

  const handleAskNexorbit = (query?: string) => {
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const hasItems = planItems.length > 0;

  return (
    <div
      className={cn(
        'min-h-screen bg-slate-50/50 pb-28 antialiased',
        className
      )}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* ========================================================================= */}
        {/* HEADER                                                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Clean My Day</span>
              <Sparkles className="h-5 w-5 text-indigo-600 fill-indigo-600/10" />
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Let NEXORBIT decide what matters today.
            </p>
          </div>

          {/* Regenerate Plan Button */}
          <button
            onClick={handleRegeneratePlan}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer disabled:opacity-60 shrink-0 self-start sm:self-center"
          >
            <RotateCw className={cn('h-3.5 w-3.5 text-indigo-600', isRegenerating && 'animate-spin')} />
            <span>{isRegenerating ? 'Calculating...' : 'Regenerate Plan'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MAIN AI SUMMARY CARD                                                     */}
        {/* ========================================================================= */}
        <PlanSummaryCard />

        {/* ========================================================================= */}
        {/* MAIN PLAN LIST                                                            */}
        {/* ========================================================================= */}
        {!hasItems ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-2xs space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">You’re clear for today.</h3>
              <p className="text-xs text-slate-500">
                NEXORBIT couldn’t find anything that needs your attention right now.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* HIGH PRIORITY */}
            {highPriorityItems.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <Flag className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    High Priority
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200/70" />
                </div>

                <div className="space-y-2">
                  {highPriorityItems.map((item) => (
                    <TaskRow
                      key={item.id}
                      item={item}
                      onActionClick={(selected) => setSelectedTaskItem(selected)}
                      onCompleteToggle={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* MEDIUM PRIORITY */}
            {mediumPriorityItems.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <Flag className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Medium Priority
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200/70" />
                </div>

                <div className="space-y-2">
                  {mediumPriorityItems.map((item) => (
                    <TaskRow
                      key={item.id}
                      item={item}
                      onActionClick={(selected) => setSelectedTaskItem(selected)}
                      onCompleteToggle={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* LOW PRIORITY */}
            {lowPriorityItems.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <Flag className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Low Priority
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200/70" />
                </div>

                <div className="space-y-2">
                  {lowPriorityItems.map((item) => (
                    <TaskRow
                      key={item.id}
                      item={item}
                      onActionClick={(selected) => setSelectedTaskItem(selected)}
                      onCompleteToggle={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUBTLE BOTTOM AI RECOMMENDATION                                           */}
            {/* ========================================================================= */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-indigo-100/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
                    AI Recommendation
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5 leading-relaxed">
                    You have a deadline conflict today. Resolve this before your afternoon meetings.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleAskNexorbit('How should I resolve today\'s deadline conflict?')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold border border-indigo-200/60 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Ask NEXORBIT</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TASK DETAIL / ACTION MODAL                                                */}
      {/* ========================================================================= */}
      <TaskActionModal
        item={selectedTaskItem}
        isOpen={!!selectedTaskItem}
        onClose={() => setSelectedTaskItem(null)}
        onAskNexorbit={handleAskNexorbit}
      />
    </div>
  );
};

