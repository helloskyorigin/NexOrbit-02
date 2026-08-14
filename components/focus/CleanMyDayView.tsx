'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCw, Flag, MoreHorizontal } from 'lucide-react';
import { DailyPlanItem, CleanMyDayTab } from './types';
import { INITIAL_TODAY_PLAN_ITEMS } from './mockData';
import { PlanSummaryCard } from './AIBrief';
import { DailyPlanTabs } from './DailyPlanTabs';
import { TaskRow } from './TaskRow';
import { DayOverview } from './DayOverview';
import { FocusSuggestionCard } from './FocusSuggestionCard';
import { AIInsights } from './AIInsights';
import { AIAssistantCard } from './AIAssistantCard';
import { TaskActionModal } from './TaskActionModal';
import { TimeBlocksView } from './TimeBlocksView';
import { TasksListView } from './TasksListView';
import { FocusTimeView } from './FocusTimeView';
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
  const [activeTab, setActiveTab] = useState<CleanMyDayTab>('plan');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [planItems, setPlanItems] = useState<DailyPlanItem[]>(INITIAL_TODAY_PLAN_ITEMS);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [selectedTaskItem, setSelectedTaskItem] = useState<DailyPlanItem | null>(null);

  // Derived Statistics
  const totalItemsCount = planItems.length;
  const completedCount = planItems.filter((item) => item.isCompleted).length;
  const pendingCount = totalItemsCount - completedCount;

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
      addToast({
        title: 'Plan Regenerated',
        description: 'NEXORBIT recalculated priorities based on latest calendar and email activity.',
        type: 'success',
      });
    }, 800);
  };

  const handleScheduleFocus = () => {
    addToast({
      title: 'Focus Block Reserved',
      description: 'Scheduled 2:00 PM – 4:00 PM deep work time on Google Calendar.',
      type: 'success',
    });
  };

  const handleAskNexorbit = (query?: string) => {
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  return (
    <div className={cn('space-y-6 pb-12 antialiased', className)}>
      {/* ========================================================================= */}
      {/* HEADER                                                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Clean My Day</span>
            <Sparkles className="h-5 w-5 text-blue-500 fill-blue-500/10" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Let NEXORBIT decide what matters today.
          </p>
        </div>

        {/* Regenerate Plan Button */}
        <div>
          <button
            onClick={handleRegeneratePlan}
            disabled={isRegenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <RotateCw className={cn('h-4 w-4 text-blue-600', isRegenerating && 'animate-spin')} />
            <span>{isRegenerating ? 'Calculating...' : 'Regenerate Plan'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AI PLAN SUMMARY CARD                                                     */}
      {/* ========================================================================= */}
      <PlanSummaryCard
        totalItems={totalItemsCount}
        completedItems={completedCount}
        pendingItems={pendingCount}
      />

      {/* ========================================================================= */}
      {/* PLAN TABS & SHOW COMPLETED TOGGLE                                         */}
      {/* ========================================================================= */}
      <DailyPlanTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        showCompleted={showCompleted}
        onToggleShowCompleted={setShowCompleted}
      />

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE GRID (LEFT 8 COLS, RIGHT 4 COLS)                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'plan' && (
            <div className="space-y-6">
              {/* HIGH PRIORITY SECTION */}
              {highPriorityItems.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-600 px-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Flag className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                      <span className="text-sm font-bold text-slate-900">High Priority</span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {highPriorityItems
                      .filter((item) => showCompleted || !item.isCompleted)
                      .map((item) => (
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

              {/* MEDIUM PRIORITY SECTION */}
              {mediumPriorityItems.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-600 px-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Flag className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-bold text-slate-900">Medium Priority</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {mediumPriorityItems
                      .filter((item) => showCompleted || !item.isCompleted)
                      .map((item) => (
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

              {/* LOW PRIORITY SECTION */}
              {lowPriorityItems.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 px-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Flag className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                      <span className="text-sm font-bold text-slate-900">Low Priority</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {lowPriorityItems
                      .filter((item) => showCompleted || !item.isCompleted)
                      .map((item) => (
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
            </div>
          )}

          {activeTab === 'schedule' && (
            <TimeBlocksView
              items={planItems}
              onSelectItem={(item) => setSelectedTaskItem(item)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksListView
              items={planItems}
              onSelectItem={(item) => setSelectedTaskItem(item)}
              onToggleComplete={handleToggleComplete}
            />
          )}

          {activeTab === 'focus' && (
            <FocusTimeView
              onScheduleWindow={(win) =>
                addToast({
                  title: 'Focus Window Protected',
                  description: `Reserved ${win} block on Google Calendar.`,
                  type: 'success',
                })
              }
            />
          )}
        </div>

        {/* Right Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Day Overview */}
          <DayOverview
            totalItems={totalItemsCount}
            highCount={highPriorityItems.length}
            mediumCount={mediumPriorityItems.length}
            lowCount={lowPriorityItems.length}
            doneCount={completedCount}
            dateString="May 11, 2024"
          />

          {/* 2. Focus Time */}
          <FocusSuggestionCard
            timeWindow="2:00 PM – 4:00 PM"
            description="Deep work time for important tasks."
            onScheduleFocusTime={handleScheduleFocus}
          />

          {/* 3. AI Insights */}
          <AIInsights />

          {/* 4. AI Assistant Entry Point */}
          <AIAssistantCard onAskNexorbit={() => handleAskNexorbit()} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TASK DETAIL / ACTION DIALOG                                               */}
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
