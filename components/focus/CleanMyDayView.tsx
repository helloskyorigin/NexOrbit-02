'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  RotateCw,
  Sliders,
  Play,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  DailyPlanItem,
  CleanMyDayTab,
  EnergyLevel,
  PrioritySettings,
} from './types';
import {
  INITIAL_TODAY_PLAN_ITEMS,
  INITIAL_PRIORITY_SETTINGS,
} from './mockData';
import { AIBrief } from './AIBrief';
import { DailyPlanTabs } from './DailyPlanTabs';
import { TaskRow } from './TaskRow';
import { DayOverview } from './DayOverview';
import { TopPrioritiesList } from './TopPrioritiesList';
import { FocusSuggestionCard } from './FocusSuggestionCard';
import { EnergyCheckinCard } from './EnergyCheckinCard';
import { PlanExplanationDrawer } from './PlanExplanationDrawer';
import { AdjustPrioritiesModal } from './AdjustPrioritiesModal';
import { RegeneratePlanModal } from './RegeneratePlanModal';
import { StartMyDayModal } from './StartMyDayModal';
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

  // Primary State
  const [activeTab, setActiveTab] = useState<CleanMyDayTab>('daily-plan');
  const [planItems, setPlanItems] = useState<DailyPlanItem[]>(INITIAL_TODAY_PLAN_ITEMS);
  const [prioritySettings, setPrioritySettings] = useState<PrioritySettings>(INITIAL_PRIORITY_SETTINGS);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('good');
  const [isFullDayExpanded, setIsFullDayExpanded] = useState(false);
  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);

  // Modals / Drawers State
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isRegeneratingOpen, setIsRegeneratingOpen] = useState(false);
  const [isStartDayOpen, setIsStartDayOpen] = useState(false);
  const [selectedTaskActionItem, setSelectedTaskActionItem] = useState<DailyPlanItem | null>(null);

  // Toggle Item Completion
  const handleToggleComplete = (id: string) => {
    setPlanItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isCompleted;
          if (nextState) {
            addToast({
              title: 'Task completed',
              description: `Completed: ${item.title}`,
              type: 'success',
            });
          }
          return { ...item, isCompleted: nextState };
        }
        return item;
      })
    );
  };

  // Scroll / Highlight Selected Priority
  const handleSelectPriority = (id: string) => {
    setSelectedPriorityId(id);
    const element = document.getElementById(`plan-item-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setSelectedPriorityId(null);
    }, 2500);
  };

  // Regenerate Plan Completion
  const handleRegenerateComplete = () => {
    setIsRegeneratingOpen(false);
    // Shuffle / re-prioritize mock items slightly
    setPlanItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    addToast({
      title: 'Plan rebalanced',
      description: 'NEXORBIT updated your day with latest calendar and email context.',
      type: 'success',
    });
  };

  // Apply Priority Settings
  const handleApplyPrioritySettings = (newSettings: PrioritySettings) => {
    setPrioritySettings(newSettings);
    addToast({
      title: 'Priorities updated',
      description: 'Daily plan re-weighted based on your preference profile.',
      type: 'info',
    });
  };

  // Select Energy Level
  const handleSelectEnergy = (level: EnergyLevel) => {
    setEnergyLevel(level);
    addToast({
      title: 'Energy updated',
      description: `Adjusted afternoon pacing for ${level.toUpperCase()} energy.`,
      type: 'info',
    });
  };

  // Navigation to Ask My World
  const handleAskNexorbit = (query?: string) => {
    if (onNavigate) {
      onNavigate('ask-my-world');
    }
  };

  // Visible items based on full day expansion
  const visiblePlanItems = isFullDayExpanded ? planItems : planItems.slice(0, 6);

  return (
    <div className={cn('relative min-h-screen pb-16 overflow-hidden', className)}>
      {/* ========================================================================= */}
      {/* SUBTLE ORBITAL AMBIENT SYSTEM                                            */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute -top-32 -right-32 w-[650px] h-[650px] text-indigo-200/25 animate-spin-slow"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="250"
            cy="250"
            rx="230"
            ry="110"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="4 6"
          />
          <ellipse
            cx="250"
            cy="250"
            rx="180"
            ry="85"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle cx="480" cy="250" r="3" fill="#6366F1" opacity="0.4" />
          <circle cx="70" cy="250" r="2.5" fill="#8B5CF6" opacity="0.3" />
        </svg>

        <svg
          className="absolute top-1/2 -left-40 w-[550px] h-[550px] text-indigo-100/30"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="250"
            cy="250"
            rx="210"
            ry="95"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="3 5"
          />
          <circle cx="250" cy="40" r="2" fill="#6366F1" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & WORKSPACE UTILITY ACTIONS                                */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Clean My Day</span>
                <Sparkles className="h-5 w-5 text-indigo-600 fill-indigo-500/10" />
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your AI assistant has prepared a focused plan for a productive day.
            </p>
          </div>

          {/* Right Controls: Top Actions + Synced + User */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Regenerate plan */}
            <button
              onClick={() => setIsRegeneratingOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer active:scale-95"
            >
              <RotateCw className="h-3.5 w-3.5 text-slate-500" />
              <span>Regenerate plan</span>
            </button>

            {/* Adjust priorities */}
            <button
              onClick={() => setIsAdjustModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer active:scale-95"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-500" />
              <span>Adjust priorities</span>
            </button>

            {/* Start my day */}
            <button
              onClick={() => setIsStartDayOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Start my day</span>
            </button>

            {/* Synced Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Synced</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() =>
                addToast({
                  title: 'Notifications',
                  description: 'All daily priorities and schedule alerts are up to date.',
                  type: 'info',
                })
              }
              className="h-9 w-9 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>

            {/* User Profile Avatar */}
            <div className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-indigo-500/20 shrink-0 cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Aryan Mehta"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TOP TABS CONTROL                                                      */}
        {/* ========================================================================= */}
        <DailyPlanTabs activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* ========================================================================= */}
        {/* 3. MAIN WORKSPACE + RIGHT RAIL GRID                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content Column (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* AI Daily Briefing Banner */}
            <AIBrief
              userName="Aryan"
              taskCount={11}
              eventCount={3}
              onOpenWhyThisPlan={() => setIsWhyDrawerOpen(true)}
            />

            {/* Tab Specific Content */}
            {activeTab === 'daily-plan' && (
              <div className="space-y-4">
                {/* Timeline Header with Date Controls */}
                <div className="flex items-center justify-between pt-2">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                    Today&apos;s Plan
                  </h2>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <span>Friday, May 16</span>
                    <div className="flex items-center gap-1 text-slate-400 pl-1 border-l border-slate-200">
                      <button
                        onClick={() =>
                          addToast({
                            title: 'Date view',
                            description: 'Showing plan for yesterday.',
                            type: 'info',
                          })
                        }
                        className="hover:text-slate-700 cursor-pointer"
                        aria-label="Previous day"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          addToast({
                            title: 'Date view',
                            description: 'Showing plan for tomorrow.',
                            type: 'info',
                          })
                        }
                        className="hover:text-slate-700 cursor-pointer"
                        aria-label="Next day"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vertical Timeline List */}
                <div className="space-y-0 pt-2">
                  {visiblePlanItems.map((item, index) => (
                    <TaskRow
                      key={item.id}
                      item={item}
                      isFirst={index === 0}
                      isLast={index === visiblePlanItems.length - 1}
                      isHighlighted={selectedPriorityId === item.id}
                      onActionClick={(clicked) => setSelectedTaskActionItem(clicked)}
                      onCompleteToggle={handleToggleComplete}
                      onWhyClick={() => setIsWhyDrawerOpen(true)}
                      onAskNexorbit={() => handleAskNexorbit(`Context regarding ${item.title}`)}
                    />
                  ))}
                </div>

                {/* View Full Day Button */}
                <div className="pt-3 pb-6 text-center">
                  <button
                    onClick={() => setIsFullDayExpanded(!isFullDayExpanded)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer"
                  >
                    <span>
                      {isFullDayExpanded
                        ? 'Show top scheduled items'
                        : 'View full day (11 tasks & 3 events)'}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        isFullDayExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'time-blocks' && (
              <TimeBlocksView
                items={planItems}
                onSelectItem={(item) => setSelectedTaskActionItem(item)}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksListView
                items={planItems}
                onSelectItem={(item) => setSelectedTaskActionItem(item)}
                onToggleComplete={handleToggleComplete}
              />
            )}

            {activeTab === 'focus-time' && (
              <FocusTimeView
                onScheduleWindow={(win) =>
                  addToast({
                    title: 'Focus block reserved',
                    description: `Protected ${win} on Google Calendar.`,
                    type: 'success',
                  })
                }
              />
            )}
          </div>

          {/* Right Supporting Intelligence Rail (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            {/* 1. Day Overview Card */}
            <DayOverview
              score={88}
              percentageChange={12}
              focusHours="4h 20m"
              meetingsCount={3}
            />

            {/* 2. Top Priorities List */}
            <TopPrioritiesList
              onSelectPriority={handleSelectPriority}
              selectedId={selectedPriorityId}
            />

            {/* 3. Focus Time Suggestion Card */}
            <FocusSuggestionCard
              timeWindow="9:00 AM – 11:00 AM"
              onScheduleFocusTime={() =>
                addToast({
                  title: 'Deep work scheduled',
                  description: 'Reserved 9:00 AM – 11:00 AM focus window.',
                  type: 'success',
                })
              }
            />

            {/* 4. Energy Check-in Card */}
            <EnergyCheckinCard
              currentEnergy={energyLevel}
              onSelectEnergy={handleSelectEnergy}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS & DRAWERS                                                          */}
      {/* ========================================================================= */}
      {/* Why This Plan Explanation Drawer */}
      <PlanExplanationDrawer
        isOpen={isWhyDrawerOpen}
        onClose={() => setIsWhyDrawerOpen(false)}
        onAskNexorbit={handleAskNexorbit}
      />

      {/* Adjust AI Priorities Modal */}
      <AdjustPrioritiesModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        settings={prioritySettings}
        onApplySettings={handleApplyPrioritySettings}
      />

      {/* Regenerate Plan Animated Loading Modal */}
      <RegeneratePlanModal
        isOpen={isRegeneratingOpen}
        onComplete={handleRegenerateComplete}
      />

      {/* Start My Day Modal */}
      <StartMyDayModal
        isOpen={isStartDayOpen}
        onClose={() => setIsStartDayOpen(false)}
        onStartSession={() =>
          addToast({
            title: 'Focus Session Active',
            description: 'First item: Project Alpha Sync (9:30 AM). Notifications muted.',
            type: 'info',
          })
        }
      />

      {/* Task Action Detail Dialog */}
      <TaskActionModal
        item={selectedTaskActionItem}
        isOpen={!!selectedTaskActionItem}
        onClose={() => setSelectedTaskActionItem(null)}
        onAskNexorbit={handleAskNexorbit}
      />
    </div>
  );
};
