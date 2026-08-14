'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Filter,
  Bell,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Bot,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  GoalItem,
  GoalCategory,
  GoalPriority,
  GoalStatus,
  ConnectedSource,
  MilestoneItem,
  AIRecommendation,
} from './types';
import {
  INITIAL_GOALS,
  ARCHIVED_GOALS,
  AI_RECOMMENDATIONS,
  ALL_UPCOMING_MILESTONES,
} from './mockData';
import { GoalCard } from './GoalCard';
import { AISummaryBanner } from './AISummaryBanner';
import { GoalsOverviewCard } from './GoalsOverviewCard';
import { UpcomingMilestonesCard } from './UpcomingMilestonesCard';
import { AIRecommendationsCard } from './AIRecommendationsCard';
import { GoalWorkspaceModal } from './GoalWorkspaceModal';
import { NewGoalModal } from './NewGoalModal';
import { ReviewWithAIModal } from './ReviewWithAIModal';
import { AIInsightsModal } from './AIInsightsModal';
import { MilestonesModal } from './MilestonesModal';
import { ConnectedSourceModal } from './ConnectedSourceModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface GoalsViewProps {
  onNavigate?: (pageId: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ onNavigate }) => {
  const { addToast } = useToast();

  // Primary State
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>(ARCHIVED_GOALS);
  const [activeCategory, setActiveCategory] = useState<GoalCategory>('All Goals');
  const [showArchived, setShowArchived] = useState(false);
  const [highlightedGoalId, setHighlightedGoalId] = useState<string | null>(null);

  // Filter Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'on_track' | 'at_risk' | 'not_started'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'progress_desc' | 'progress_asc' | 'date'>('default');

  // Modals & Drawers State
  const [selectedGoalForWorkspace, setSelectedGoalForWorkspace] = useState<GoalItem | null>(null);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [newGoalInitialMode, setNewGoalInitialMode] = useState<'manual' | 'ai'>('manual');
  const [isReviewAiOpen, setIsReviewAiOpen] = useState(false);
  const [isAiInsightsOpen, setIsAiInsightsOpen] = useState(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);
  const [activeSourceModal, setActiveSourceModal] = useState<{
    source: ConnectedSource;
    goal: GoalItem;
  } | null>(null);

  // Categories list for top segmented bar
  const categories: GoalCategory[] = ['All Goals', 'Work', 'Personal', 'Learning', 'Health'];

  // Filter & Sort Logic
  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        if (goal.isArchived) return false;
        // Category filter
        if (activeCategory !== 'All Goals' && goal.category !== activeCategory) {
          return false;
        }
        // Priority filter
        if (selectedPriorityFilter === 'high' && goal.priority !== 'High priority') return false;
        if (selectedPriorityFilter === 'medium' && goal.priority !== 'Medium priority') return false;
        if (selectedPriorityFilter === 'low' && goal.priority !== 'Low priority') return false;
        // Status filter
        if (selectedStatusFilter !== 'all' && goal.status !== selectedStatusFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'progress_desc') return b.progress - a.progress;
        if (sortBy === 'progress_asc') return a.progress - b.progress;
        return 0; // default initial order
      });
  }, [goals, activeCategory, selectedPriorityFilter, selectedStatusFilter, sortBy]);

  // Actions
  const handleToggleCompleteGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const isCompleted = g.status === 'completed';
          return {
            ...g,
            status: isCompleted ? 'on_track' : 'completed',
            progress: isCompleted ? 50 : 100,
          };
        }
        return g;
      })
    );
    addToast({
      title: 'Goal Status Synchronized',
      description: 'Progress and workspace dependencies updated.',
      type: 'success',
    });
  };

  const handlePauseGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const nextStatus = g.status === 'paused' ? 'on_track' : 'paused';
          return { ...g, status: nextStatus };
        }
        return g;
      })
    );
    addToast({
      title: 'Goal Pacing Updated',
      description: 'Pacing schedule recalculated in NEXORBIT.',
      type: 'info',
    });
  };

  const handleArchiveGoal = (goalId: string) => {
    const target = goals.find((g) => g.id === goalId);
    if (!target) return;

    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    setArchivedGoals((prev) => [{ ...target, isArchived: true }, ...prev]);

    addToast({
      title: 'Goal Archived',
      description: `Moved "${target.title}" to archived goals.`,
      type: 'info',
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    addToast({
      title: 'Goal Removed',
      description: 'Goal permanently removed from active workspace.',
      type: 'info',
    });
  };

  const handleCreateGoal = (newGoal: GoalItem) => {
    setGoals((prev) => [newGoal, ...prev]);
    setHighlightedGoalId(newGoal.id);
    setTimeout(() => {
      setHighlightedGoalId(null);
    }, 3000);
  };

  const handleUpdateGoal = (updatedGoal: GoalItem) => {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    setSelectedGoalForWorkspace(updatedGoal);
  };

  const handleFocusGoal = (goalId: string) => {
    const target = goals.find((g) => g.id === goalId);
    if (target) {
      setSelectedGoalForWorkspace(target);
    }
  };

  const handleSelectRecommendation = (rec: AIRecommendation) => {
    const target = goals.find((g) => g.id === rec.targetGoalId);
    if (target) {
      setSelectedGoalForWorkspace(target);
    } else {
      setIsAiInsightsOpen(true);
    }
  };

  const handleSelectMilestoneGoal = (goalTitle: string) => {
    const target = goals.find((g) => g.title === goalTitle);
    if (target) {
      setSelectedGoalForWorkspace(target);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 text-left">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 sm:pt-2">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <span>Goals</span>
              <span className="text-indigo-600 inline-block text-2xl font-normal">✦</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Track progress. Get intelligent insights. Achieve what matters.
          </p>
        </div>

        {/* Top Right: Status, Bell, User Avatar & Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Synced Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/60 text-xs font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synced</span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() =>
              addToast({
                title: 'Notifications',
                description: 'All 6 goals are currently synchronized with your workspace.',
                type: 'info',
              })
            }
            className="h-9 w-9 rounded-full hover:bg-slate-200/70 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* User Avatar */}
          <div
            onClick={() => onNavigate?.('settings')}
            className="h-9 w-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 transition-transform"
            title="Aryan Mehta"
          >
            N
          </div>

          {/* Review with AI Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsReviewAiOpen(true)}
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-600" />}
            className="text-xs h-9 px-3.5 font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 cursor-pointer shadow-2xs"
          >
            Review with AI
          </Button>

          {/* Add Goal Secondary Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setNewGoalInitialMode('manual');
              setIsNewGoalModalOpen(true);
            }}
            leftIcon={<Plus className="h-3.5 w-3.5 text-slate-600" />}
            className="hidden lg:inline-flex text-xs h-9 px-3.5 font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 cursor-pointer shadow-2xs"
          >
            Add Goal
          </Button>

          {/* Primary + New Goal Button with dropdown */}
          <div className="relative inline-flex items-center">
            <button
              onClick={() => {
                setNewGoalInitialMode('manual');
                setIsNewGoalModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 px-4 rounded-xl shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Goal</span>
              <ChevronDown className="h-3 w-3 opacity-80" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. GOAL FILTER BAR & SEGMENTED TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Segmented Category Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={cn(
                'px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer',
                activeCategory === cat
                  ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter & Sort Dropdown */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
              isFilterOpen || selectedPriorityFilter !== 'all' || selectedStatusFilter !== 'all'
                ? 'bg-indigo-50/80 border-indigo-200 text-indigo-700 shadow-2xs'
                : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
            {(selectedPriorityFilter !== 'all' || selectedStatusFilter !== 'all') && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            )}
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Filter Popover Menu */}
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-30 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left">
                {/* Priority Filter */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Filter by Priority
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPriorityFilter(p)}
                        className={cn(
                          'px-2.5 py-1.5 rounded-lg font-medium capitalize text-left cursor-pointer transition-colors',
                          selectedPriorityFilter === p
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-600'
                        )}
                      >
                        {p === 'all' ? 'All Priorities' : `${p} priority`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Filter by Status
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {(
                      [
                        { id: 'all', label: 'All Statuses' },
                        { id: 'on_track', label: 'On Track' },
                        { id: 'at_risk', label: 'At Risk' },
                        { id: 'not_started', label: 'Not Started' },
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStatusFilter(s.id)}
                        className={cn(
                          'px-2.5 py-1.5 rounded-lg font-medium text-left cursor-pointer transition-colors',
                          selectedStatusFilter === s.id
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-600'
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Sort By
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                  >
                    <option value="default">Default Recommended</option>
                    <option value="progress_desc">Highest Progress</option>
                    <option value="progress_asc">Lowest Progress</option>
                  </select>
                </div>

                {/* Reset Filters */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedPriorityFilter('all');
                      setSelectedStatusFilter('all');
                      setSortBy('default');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    Reset all
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-xs bg-indigo-600 text-white font-semibold px-3 py-1 rounded-lg cursor-pointer hover:bg-indigo-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. AI SUMMARY BANNER */}
      <AISummaryBanner
        onViewInsights={() => setIsAiInsightsOpen(true)}
        onFocusGoal={handleFocusGoal}
      />

      {/* 4. MAIN 2-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MAIN GOAL LIST (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Filter className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Goals Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active alignment goals match the current category or filter criteria.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setActiveCategory('All Goals');
                  setSelectedPriorityFilter('all');
                  setSelectedStatusFilter('all');
                }}
                className="text-xs h-8 px-3 rounded-lg cursor-pointer"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onClick={(g) => setSelectedGoalForWorkspace(g)}
                onEdit={(g) => setSelectedGoalForWorkspace(g)}
                onPause={handlePauseGoal}
                onArchive={handleArchiveGoal}
                onDelete={handleDeleteGoal}
                onToggleComplete={handleToggleCompleteGoal}
                onSourceClick={(g, source) => {
                  setActiveSourceModal({ source, goal: g });
                }}
                isHighlighted={highlightedGoalId === goal.id}
              />
            ))
          )}

          {/* Collapsible Archived Goals Section */}
          <div className="pt-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="w-full py-2.5 px-4 rounded-xl hover:bg-slate-100/80 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View archived goals ({archivedGoals.length})</span>
              {showArchived ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {showArchived && (
              <div className="space-y-3 pt-3 animate-in fade-in">
                {archivedGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={(g) => setSelectedGoalForWorkspace(g)}
                    onEdit={(g) => setSelectedGoalForWorkspace(g)}
                    onPause={handlePauseGoal}
                    onArchive={handleArchiveGoal}
                    onDelete={handleDeleteGoal}
                    onToggleComplete={handleToggleCompleteGoal}
                    onSourceClick={(g, source) => {
                      setActiveSourceModal({ source, goal: g });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GOALS OVERVIEW, UPCOMING MILESTONES & AI RECOMMENDATIONS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Goals Overview Card */}
          <GoalsOverviewCard
            goals={goals}
            onFilterStatus={(status) => {
              setSelectedStatusFilter(status);
              addToast({
                title: 'Filter Applied',
                description: `Showing ${status.replace('_', ' ')} goals.`,
                type: 'info',
              });
            }}
          />

          {/* 2. Upcoming Milestones Card */}
          <UpcomingMilestonesCard
            milestones={ALL_UPCOMING_MILESTONES}
            onViewAll={() => setIsMilestonesModalOpen(true)}
            onSelectMilestone={(m) => {
              if (m.goalTitle) handleSelectMilestoneGoal(m.goalTitle);
            }}
          />

          {/* 3. AI Recommendations Card */}
          <AIRecommendationsCard
            recommendations={AI_RECOMMENDATIONS}
            onSelectRecommendation={handleSelectRecommendation}
            onViewAll={() => setIsAiInsightsOpen(true)}
          />
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      {/* Goal Workspace Modal */}
      <GoalWorkspaceModal
        goal={selectedGoalForWorkspace}
        isOpen={!!selectedGoalForWorkspace}
        onClose={() => setSelectedGoalForWorkspace(null)}
        onUpdateGoal={handleUpdateGoal}
        onOpenConnectorSource={(source) => {
          if (selectedGoalForWorkspace) {
            setActiveSourceModal({ source, goal: selectedGoalForWorkspace });
          }
        }}
      />

      {/* New Goal Modal */}
      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        initialMode={newGoalInitialMode}
        onClose={() => setIsNewGoalModalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />

      {/* Review with AI Modal */}
      <ReviewWithAIModal
        isOpen={isReviewAiOpen}
        onClose={() => setIsReviewAiOpen(false)}
        goals={goals}
        onApplyOptimization={handleFocusGoal}
      />

      {/* AI Insights Modal */}
      <AIInsightsModal
        isOpen={isAiInsightsOpen}
        onClose={() => setIsAiInsightsOpen(false)}
        goals={goals}
        onSelectGoal={handleFocusGoal}
      />

      {/* Milestones Modal */}
      <MilestonesModal
        isOpen={isMilestonesModalOpen}
        onClose={() => setIsMilestonesModalOpen(false)}
        milestones={ALL_UPCOMING_MILESTONES}
        onSelectMilestoneGoal={handleSelectMilestoneGoal}
      />

      {/* Connected Source Inspector Modal */}
      <ConnectedSourceModal
        isOpen={!!activeSourceModal}
        source={activeSourceModal?.source || null}
        goal={activeSourceModal?.goal || null}
        onClose={() => setActiveSourceModal(null)}
      />
    </div>
  );
};
