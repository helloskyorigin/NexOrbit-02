'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  MemoryItem,
  MemoryCategory,
  MemorySourceType,
  CategoryStat,
  ConnectedSourceStat,
  RecentPersonItem,
  MemorySettingsConfig,
} from './types';
import {
  INITIAL_MEMORIES,
  CATEGORY_STATS,
  CONNECTED_SOURCES_STATS,
  RECENT_PEOPLE,
  DEFAULT_MEMORY_SETTINGS,
} from './mockData';
import { AmbientBackground } from './AmbientBackground';
import { MemoryHeader } from './MemoryHeader';
import { MemoryCategoryTabs, CategoryTabOption } from './MemoryCategoryTabs';
import { MemoryInsightsBanner } from './MemoryInsightsBanner';
import { MemoryTimeline } from './MemoryTimeline';
import { MemoryRightPanel } from './MemoryRightPanel';
import { MemoryDetailDrawer } from './MemoryDetailDrawer';
import { MemoryFilterPopover, MemoryFiltersState } from './MemoryFilterPopover';
import { AddMemoryModal } from './AddMemoryModal';
import { MemoryInsightsModal } from './MemoryInsightsModal';
import { MemorySettingsModal } from './MemorySettingsModal';
import { ForgetMemoryModal } from './ForgetMemoryModal';
import { MemorySourcesModal } from './MemorySourcesModal';
import { useToast } from '../ui/Toast';

export interface MemoryViewProps {
  onNavigate?: (pageId: string) => void;
}

export const MemoryView: React.FC<MemoryViewProps> = ({ onNavigate }) => {
  const { addToast } = useToast();

  // Core Data State
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [settings, setSettings] = useState<MemorySettingsConfig>(DEFAULT_MEMORY_SETTINGS);

  // Search & Navigation Tab Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTabOption>('All Memory');

  // Advanced Multi-filter State
  const [filters, setFilters] = useState<MemoryFiltersState>({
    category: 'all',
    person: 'all',
    source: 'all',
    dateGroup: 'all',
    pinnedOnly: false,
  });
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  // Modals and Drawers
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [memoryToForget, setMemoryToForget] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Unique people options for filter popover
  const peopleOptions = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      if (m.relatedPerson) set.add(m.relatedPerson);
    });
    return Array.from(set);
  }, [memories]);

  // Is any custom filter active?
  const isFiltersActive = useMemo(() => {
    return (
      filters.category !== 'all' ||
      filters.person !== 'all' ||
      filters.source !== 'all' ||
      filters.dateGroup !== 'all' ||
      filters.pinnedOnly
    );
  }, [filters]);

  // Main Filtering Logic
  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      // 1. Category Tab Filter
      if (activeCategoryTab !== 'All Memory' && mem.category !== activeCategoryTab) {
        return false;
      }

      // 2. Search query filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = mem.title.toLowerCase().includes(query);
        const matchesDesc = mem.description.toLowerCase().includes(query);
        const matchesTag = mem.tag.toLowerCase().includes(query);
        const matchesPerson = mem.relatedPerson?.toLowerCase().includes(query);
        const matchesProject = mem.relatedProject?.toLowerCase().includes(query);
        const matchesSource = mem.source.name.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesTag && !matchesPerson && !matchesProject && !matchesSource) {
          return false;
        }
      }

      // 3. Multi-filter popover criteria
      if (filters.category !== 'all' && mem.category !== filters.category) {
        return false;
      }

      if (filters.person !== 'all' && mem.relatedPerson !== filters.person) {
        return false;
      }

      if (filters.source !== 'all' && mem.source.type !== filters.source) {
        return false;
      }

      if (filters.dateGroup !== 'all' && mem.dateGroup !== filters.dateGroup) {
        return false;
      }

      if (filters.pinnedOnly && !mem.isPinned) {
        return false;
      }

      return true;
    });
  }, [memories, activeCategoryTab, searchTerm, filters]);

  // Dynamically recalculated category statistics
  const dynamicCategoryStats: CategoryStat[] = useMemo(() => {
    const counts: Record<MemoryCategory, number> = {
      Projects: 0,
      Preferences: 0,
      People: 0,
      Knowledge: 0,
      Decisions: 0,
    };
    memories.forEach((m) => {
      if (counts[m.category] !== undefined) {
        counts[m.category]++;
      }
    });

    return CATEGORY_STATS.map((stat) => ({
      ...stat,
      count: counts[stat.category] !== undefined ? counts[stat.category] : stat.count,
    }));
  }, [memories]);

  // Handlers
  const handleAddMemory = (newMem: MemoryItem) => {
    setMemories((prev) => [newMem, ...prev]);
  };

  const handleSaveEdit = (updated: MemoryItem) => {
    setMemories((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    if (selectedMemory?.id === updated.id) {
      setSelectedMemory(updated);
    }
  };

  const handleTogglePin = (memory: MemoryItem) => {
    const updatedStatus = !memory.isPinned;
    setMemories((prev) =>
      prev.map((m) => (m.id === memory.id ? { ...m, isPinned: updatedStatus } : m))
    );
    if (selectedMemory?.id === memory.id) {
      setSelectedMemory((prev) => (prev ? { ...prev, isPinned: updatedStatus } : null));
    }
    addToast({
      title: updatedStatus ? 'Memory Pinned' : 'Memory Unpinned',
      description: `"${memory.title}" is now ${updatedStatus ? 'pinned to the top of your workspace' : 'unpinned'}.`,
      type: 'info',
    });
  };

  const handleConfirmForget = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
    }
    setMemoryToForget(null);
    addToast({
      title: 'Memory Forgotten',
      description: 'Synapse successfully detached from active memory graph.',
      type: 'info',
    });
  };

  const handleOpenSource = (mem: MemoryItem) => {
    if (mem.source.url) {
      addToast({
        title: `Connected to ${mem.source.name}`,
        description: `Inspecting original provenance: ${mem.source.detail || mem.title}`,
        type: 'info',
      });
    }
  };

  const handleSelectCategoryFilter = (cat: MemoryCategory) => {
    setActiveCategoryTab(cat);
    setFilters((prev) => ({ ...prev, category: 'all' }));
  };

  const handleSelectSourceFilter = (sourceType: MemorySourceType) => {
    setFilters((prev) => ({ ...prev, source: sourceType }));
    addToast({
      title: `Filtered by Source`,
      description: `Showing memories anchored from ${sourceType}.`,
      type: 'info',
    });
  };

  const handleSelectPersonFilter = (personName: string) => {
    setFilters((prev) => ({ ...prev, person: personName }));
    addToast({
      title: `Filtered by Person`,
      description: `Showing memories associated with ${personName}.`,
      type: 'info',
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategoryTab('All Memory');
    setFilters({
      category: 'all',
      person: 'all',
      source: 'all',
      dateGroup: 'all',
      pinnedOnly: false,
    });
    addToast({
      title: 'Filters Cleared',
      description: 'Showing all indexed memories.',
      type: 'info',
    });
  };

  const handleClearAllMemories = () => {
    setMemories([]);
    setSelectedMemory(null);
  };

  return (
    <div className="relative min-h-[90vh] space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Background Ambient Atmospheric Orbit Lines */}
      <AmbientBackground />

      {/* Top Header System */}
      <MemoryHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenFilters={() => setIsFilterPopoverOpen(true)}
        isFiltersActive={isFiltersActive}
        onAddMemory={(mode) => setIsAddModalOpen(true)}
        onNavigateSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Category Tabs: All Memory | People | Preferences | Projects | Knowledge | Decisions */}
      <div className="pt-1">
        <MemoryCategoryTabs
          activeTab={activeCategoryTab}
          onSelectTab={setActiveCategoryTab}
        />
      </div>

      {/* Memory Insights Banner: "You have 1,248 memories..." */}
      <MemoryInsightsBanner
        onViewInsights={() => setIsInsightsModalOpen(true)}
        totalMemories={1248 + (memories.length - INITIAL_MEMORIES.length)}
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Timeline of Memories (~8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <MemoryTimeline
            memories={filteredMemories}
            onSelectMemory={(m) => setSelectedMemory(m)}
            onEditMemory={(m) => {
              setSelectedMemory(m);
            }}
            onForgetMemory={(m) => setMemoryToForget(m)}
            onTogglePin={handleTogglePin}
            onOpenSource={handleOpenSource}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Column: Statistics, Sources, People, Settings (~4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <MemoryRightPanel
            totalMemories={1248 + (memories.length - INITIAL_MEMORIES.length)}
            categoryStats={dynamicCategoryStats}
            sourceStats={CONNECTED_SOURCES_STATS}
            recentPeople={RECENT_PEOPLE}
            activeCategoryFilter={activeCategoryTab !== 'All Memory' ? activeCategoryTab : undefined}
            activeSourceFilter={filters.source !== 'all' ? filters.source : undefined}
            activePersonFilter={filters.person !== 'all' ? filters.person : undefined}
            onSelectCategory={handleSelectCategoryFilter}
            onSelectSource={handleSelectSourceFilter}
            onSelectPerson={handleSelectPersonFilter}
            onViewAllSources={() => setIsSourcesModalOpen(true)}
            onViewAllPeople={() => setIsFilterPopoverOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>

      {/* Slide-In Memory Detail Drawer */}
      <MemoryDetailDrawer
        memory={selectedMemory}
        isOpen={!!selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onSaveEdit={handleSaveEdit}
        onTogglePin={handleTogglePin}
        onRequestForget={(m) => {
          setSelectedMemory(null);
          setMemoryToForget(m);
        }}
        onOpenSource={handleOpenSource}
        onSelectRelatedMemory={(relId) => {
          const target = memories.find((m) => m.id === relId);
          if (target) setSelectedMemory(target);
        }}
      />

      {/* Multi-Dimensional Filter Popover */}
      <MemoryFilterPopover
        isOpen={isFilterPopoverOpen}
        onClose={() => setIsFilterPopoverOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={handleResetFilters}
        peopleOptions={peopleOptions}
      />

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMemory={handleAddMemory}
        initialCategory={activeCategoryTab !== 'All Memory' ? (activeCategoryTab as MemoryCategory) : 'Projects'}
      />

      {/* Memory Insights Modal */}
      <MemoryInsightsModal
        isOpen={isInsightsModalOpen}
        onClose={() => setIsInsightsModalOpen(false)}
        totalMemories={1248 + (memories.length - INITIAL_MEMORIES.length)}
      />

      {/* Memory Settings Modal */}
      <MemorySettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onClearAllMemories={handleClearAllMemories}
      />

      {/* Forget Memory Confirmation Modal */}
      <ForgetMemoryModal
        memory={memoryToForget}
        isOpen={!!memoryToForget}
        onClose={() => setMemoryToForget(null)}
        onConfirmForget={handleConfirmForget}
      />

      {/* Connected Sources Modal */}
      <MemorySourcesModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
        sources={CONNECTED_SOURCES_STATS}
        onSelectSourceFilter={handleSelectSourceFilter}
      />
    </div>
  );
};
