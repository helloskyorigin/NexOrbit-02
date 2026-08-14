'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Filter, 
  ChevronDown, 
  Plus, 
  Bell, 
  Check, 
  Search, 
  RotateCcw,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  ChangeFeedItem, 
  CategoryFilter, 
  ConnectorSourceId, 
  ViewToggleControls 
} from './types';
import { 
  INITIAL_CHANGE_ITEMS 
} from './mockData';
import { CategoryFilterTabs } from './CategoryFilterTabs';
import { ChangeRow } from './ChangeRow';
import { GroupedChangeRow } from './GroupedChangeRow';
import { RightIntelligenceRail } from './RightIntelligenceRail';
import { ChangeDetailDrawer } from './ChangeDetailDrawer';
import { FilterPopover, FilterState } from './FilterPopover';
import { DateSelectorPopover } from './DateSelectorPopover';
import { cn } from '../../lib/utils';
import Image from 'next/image';

export interface WhatChangedViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const WhatChangedView: React.FC<WhatChangedViewProps> = ({
  onNavigate,
  className,
}) => {
  // Main Data States
  const [items, setItems] = useState<ChangeFeedItem[]>(INITIAL_CHANGE_ITEMS);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<ConnectorSourceId | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('Today, May 14');
  const [showMoreLoaded, setShowMoreLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // View Controls Toggles
  const [viewControls, setViewControls] = useState<ViewToggleControls>({
    connectedApps: true,
    yourTeam: true,
    mentions: true,
    tasksAndProjects: true,
  });

  // Modal / Popover / Drawer States
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [activeDrawerItem, setActiveDrawerItem] = useState<ChangeFeedItem | null>(null);
  const [popoverFilters, setPopoverFilters] = useState<FilterState>({
    importance: 'all',
    unreadOnly: false,
    source: 'all',
  });

  // Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Toggle single item read state
  const handleToggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    triggerToast('All changes marked as read');
  };

  // Handle View Control Toggle
  const handleToggleViewControl = (key: keyof ViewToggleControls) => {
    setViewControls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle Ask NEXORBIT
  const handleAskNexorbit = (item: ChangeFeedItem) => {
    if (onNavigate) {
      onNavigate('ask-my-world');
    }
  };

  // Filter Pipeline
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSub = item.contextSubtitle.toLowerCase().includes(q);
        const matchesSource = item.sourceName.toLowerCase().includes(q);
        const matchesWhat = item.whatChanged.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSub && !matchesSource && !matchesWhat) {
          return false;
        }
      }

      // 2. Category Tab Filter
      if (activeCategory !== 'all') {
        if (item.category !== activeCategory && !item.isGroup) {
          return false;
        }
      }

      // 3. Source Filter from Right Rail
      if (selectedSourceFilter) {
        if (item.sourceId !== selectedSourceFilter && !item.sourceName.toLowerCase().includes(selectedSourceFilter)) {
          return false;
        }
      }

      // 4. Popover Filter: Importance
      if (popoverFilters.importance !== 'all') {
        if (item.importance !== popoverFilters.importance) {
          return false;
        }
      }

      // 5. Popover Filter: Unread Only
      if (popoverFilters.unreadOnly && item.isRead) {
        return false;
      }

      // 6. Popover Filter: Source
      if (popoverFilters.source !== 'all') {
        if (item.sourceId !== popoverFilters.source) {
          return false;
        }
      }

      // 7. View Controls Toggles
      if (!viewControls.connectedApps && (item.sourceId === 'drive' || item.sourceId === 'notion' || item.sourceId === 'github')) {
        return false;
      }
      if (!viewControls.mentions && item.category === 'mentions') {
        return false;
      }
      if (!viewControls.tasksAndProjects && (item.category === 'tasks' || item.sourceId === 'asana')) {
        return false;
      }

      // 8. Load More filter (hide 'Earlier' section until Load More is clicked)
      if (!showMoreLoaded && item.timeSection === 'Earlier') {
        return false;
      }

      return true;
    });
  }, [
    items,
    searchQuery,
    activeCategory,
    selectedSourceFilter,
    popoverFilters,
    viewControls,
    showMoreLoaded,
  ]);

  // Section Grouping
  const sections = useMemo(() => {
    const availableSections: ('Earlier Today' | 'Yesterday' | 'Earlier')[] = [
      'Earlier Today',
      'Yesterday',
      'Earlier',
    ];
    return availableSections
      .map((sec) => ({
        section: sec,
        items: filteredItems.filter((i) => i.timeSection === sec),
      }))
      .filter((grp) => grp.items.length > 0);
  }, [filteredItems]);

  const unreadCount = useMemo(() => items.filter((i) => !i.isRead).length, [items]);

  return (
    <div
      className={cn(
        "relative min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-28",
        className
      )}
    >
      {/* 1. SUBTLE AMBIENT ORBITAL BACKGROUND (Real SVG / Ambient curves) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute -top-32 -left-48 w-[1000px] h-[1000px] text-indigo-500/6"
          viewBox="0 0 1000 1000"
          fill="none"
        >
          <circle cx="500" cy="500" r="450" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="500" cy="500" r="350" stroke="currentColor" strokeWidth="1" />
          <circle cx="500" cy="500" r="220" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="780" cy="320" r="4" fill="#6366F1" className="opacity-40 animate-pulse" />
          <circle cx="280" cy="650" r="3" fill="#818CF8" className="opacity-30" />
        </svg>

        <svg
          className="absolute top-1/3 -right-64 w-[900px] h-[900px] text-purple-500/5"
          viewBox="0 0 900 900"
          fill="none"
        >
          <ellipse cx="450" cy="450" rx="400" ry="250" transform="rotate(-25 450 450)" stroke="currentColor" strokeWidth="1" />
          <circle cx="450" cy="450" r="280" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 8" />
          <circle cx="320" cy="380" r="3.5" fill="#A855F7" className="opacity-40" />
        </svg>

        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-100/30 via-purple-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* 3. TOP LEVEL BRAND / STATUS HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>What Changed</span>
                <span className="text-indigo-600 font-normal">✦</span>
              </h1>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium tracking-tight mt-1">
              Track important changes across your digital world.
            </p>
          </div>

          {/* Top Right Utility Badges */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            {/* Synced Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Synced</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => triggerToast(`You have ${unreadCount} unread change signals`)}
              className="relative h-9 w-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              )}
            </button>

            {/* User Avatar */}
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

        {/* 4. ACTION CONTROLS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Category Filter Tabs */}
          <CategoryFilterTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            className="flex-1 min-w-0"
          />

          {/* Action Buttons on the Right */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Filters Button */}
            <button
              id="open-filters-btn"
              onClick={() => setIsFilterPopoverOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs border",
                popoverFilters.importance !== 'all' || popoverFilters.unreadOnly || popoverFilters.source !== 'all'
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
              )}
            >
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <span>Filters</span>
              {(popoverFilters.importance !== 'all' || popoverFilters.unreadOnly || popoverFilters.source !== 'all') && (
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              )}
            </button>

            {/* Date Selector */}
            <button
              id="open-date-selector-btn"
              onClick={() => setIsDatePopoverOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
            >
              <span>{selectedDateRange}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Mark all as read */}
            <button
              id="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-[0_1px_3px_rgba(79,70,229,0.2)] transition-all cursor-pointer select-none"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Mark all as read</span>
            </button>
          </div>
        </div>

        {/* 5. SEARCH & ACTIVE FILTER STATUS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Active Filter Chips / Status */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
            {selectedSourceFilter && (
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200/60 font-semibold">
                <span>Source: {selectedSourceFilter}</span>
                <button
                  onClick={() => setSelectedSourceFilter(null)}
                  className="hover:text-indigo-900 cursor-pointer ml-0.5"
                >
                  ×
                </button>
              </div>
            )}

            {searchQuery && (
              <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                <span>Search: &quot;{searchQuery}&quot;</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-slate-900 cursor-pointer ml-0.5"
                >
                  ×
                </button>
              </div>
            )}

            <span className="text-[11px] text-slate-400 font-medium">
              Showing {filteredItems.length} changes across 5 connected apps
            </span>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search changes..."
              className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-medium shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 6. MAIN WORKSPACE GRID (Feed + Right Intelligence Rail) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MAIN CHANGE FEED (Left / Center Column - 8 Cols) */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            {sections.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <div className="relative mx-auto h-16 w-16 rounded-full bg-indigo-50/70 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Sparkles className="h-7 w-7" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-slate-900">
                    Nothing changed here.
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your world is quiet for now. No new changes match the active filters.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedSourceFilter(null);
                    setSearchQuery('');
                    setPopoverFilters({
                      importance: 'all',
                      unreadOnly: false,
                      source: 'all',
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset all filters</span>
                </button>
              </div>
            ) : (
              /* FEED SECTIONS */
              <div className="space-y-8">
                {sections.map(({ section, items: sectionItems }) => (
                  <div key={section} className="space-y-3">
                    {/* Section Header */}
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {section}
                      </span>
                      <div className="h-[1px] flex-1 bg-slate-100" />
                    </div>

                    {/* Section Items List */}
                    <div className="space-y-3">
                      {sectionItems.map((item) =>
                        item.isGroup ? (
                          <GroupedChangeRow
                            key={item.id}
                            item={item}
                            onOpenDetailDrawer={setActiveDrawerItem}
                            onAskNexorbit={handleAskNexorbit}
                          />
                        ) : (
                          <ChangeRow
                            key={item.id}
                            item={item}
                            onOpenDetailDrawer={setActiveDrawerItem}
                            onAskNexorbit={handleAskNexorbit}
                            onToggleRead={handleToggleRead}
                          />
                        )
                      )}
                    </div>
                  </div>
                ))}

                {/* LOAD MORE BUTTON */}
                {!showMoreLoaded && (
                  <div className="pt-2 text-center">
                    <button
                      id="load-more-btn"
                      onClick={() => {
                        setShowMoreLoaded(true);
                        triggerToast('Loaded earlier change signals');
                      }}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-indigo-600 font-semibold text-xs border border-indigo-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all cursor-pointer"
                    >
                      <span>Load more</span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT INTELLIGENCE RAIL (Right Column - 4 Cols) */}
          <div className="lg:col-span-4 min-w-0">
            <div className="sticky top-6">
              <RightIntelligenceRail
                selectedSourceFilter={selectedSourceFilter}
                onSelectSourceFilter={setSelectedSourceFilter}
                viewControls={viewControls}
                onToggleViewControl={handleToggleViewControl}
                totalNewChangesCount={items.length * 2 + 2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. SLIDING CHANGE DETAIL DRAWER */}
      <ChangeDetailDrawer
        item={activeDrawerItem}
        isOpen={Boolean(activeDrawerItem)}
        onClose={() => setActiveDrawerItem(null)}
        onAskNexorbit={handleAskNexorbit}
      />

      {/* 8. FILTER POPOVER */}
      <FilterPopover
        isOpen={isFilterPopoverOpen}
        onClose={() => setIsFilterPopoverOpen(false)}
        filters={popoverFilters}
        onApplyFilters={(newFilters) => {
          setPopoverFilters(newFilters);
          triggerToast('Filters updated');
        }}
        onResetFilters={() => {
          setPopoverFilters({
            importance: 'all',
            unreadOnly: false,
            source: 'all',
          });
          triggerToast('Filters reset');
        }}
      />

      {/* 9. DATE SELECTOR POPOVER */}
      <DateSelectorPopover
        isOpen={isDatePopoverOpen}
        onClose={() => setIsDatePopoverOpen(false)}
        selectedRange={selectedDateRange}
        onSelectRange={(range) => {
          setSelectedDateRange(range);
          triggerToast(`Date range set to ${range}`);
        }}
      />
    </div>
  );
};
