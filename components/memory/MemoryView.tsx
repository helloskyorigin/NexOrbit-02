'use client';

import React, { useState, useMemo } from 'react';
import { MemoryHeader } from './MemoryHeader';
import { MemoryCategoryTabs, CategoryTabOption } from './MemoryCategoryTabs';
import { MemorySummary } from './MemorySummary';
import { MemoryTimeline } from './MemoryTimeline';
import { MemoryDetailPanel } from './MemoryDetailPanel';
import { EditMemoryModal } from './EditMemoryModal';
import { ForgetMemoryModal } from './ForgetMemoryModal';
import { INITIAL_MEMORIES } from './mockData';
import { MemoryItem } from './types';
import { useToast } from '../ui/Toast';

export const MemoryView: React.FC = () => {
  const { addToast } = useToast();

  // Primary state
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(
    INITIAL_MEMORIES[0] || null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTabOption>('All');

  // Modals state
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [memoryToForget, setMemoryToForget] = useState<MemoryItem | null>(null);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  // Compute stats dynamically
  const memoryStats = useMemo(() => {
    const total = memories.length;
    const people = memories.filter((m) => m.category === 'People').length;
    const projects = memories.filter((m) => m.category === 'Projects').length;
    const preferences = memories.filter((m) => m.category === 'Preferences').length;
    const knowledge = memories.filter((m) => m.category === 'Knowledge').length;

    return { total, people, projects, preferences, knowledge };
  }, [memories]);

  // Filter memories list based on category & search term
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      // Category match
      if (activeCategoryTab !== 'All' && m.category !== activeCategoryTab) {
        return false;
      }

      // Search match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const titleMatch = m.title.toLowerCase().includes(query);
        const descMatch = m.description.toLowerCase().includes(query);
        const categoryMatch = m.category.toLowerCase().includes(query);
        const sourceMatch = m.source.name.toLowerCase().includes(query);
        const detailMatch = m.source.detail?.toLowerCase().includes(query);

        return titleMatch || descMatch || categoryMatch || sourceMatch || detailMatch;
      }

      return true;
    });
  }, [memories, activeCategoryTab, searchTerm]);

  // Handlers
  const handleSelectMemory = (memory: MemoryItem) => {
    setSelectedMemory(memory);
  };

  const handleEditMemory = (memory: MemoryItem) => {
    setEditingMemory(memory);
  };

  const handleSaveEdit = (updated: MemoryItem) => {
    setMemories((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    if (selectedMemory?.id === updated.id) {
      setSelectedMemory(updated);
    }
    addToast({
      title: 'Memory Updated',
      description: `Saved changes for "${updated.title}".`,
      type: 'success',
    });
  };

  const handleForgetMemory = (memory: MemoryItem) => {
    setMemoryToForget(memory);
  };

  const handleConfirmForget = (memory: MemoryItem) => {
    setMemories((prev) => prev.filter((item) => item.id !== memory.id));

    if (selectedMemory?.id === memory.id) {
      const remaining = memories.filter((item) => item.id !== memory.id);
      setSelectedMemory(remaining[0] || null);
    }

    setMemoryToForget(null);
    addToast({
      title: 'Memory Forgotten',
      description: `NEXORBIT will no longer use "${memory.title}".`,
      type: 'info',
    });
  };

  const handleSelectRelated = (relatedIdOrTitle: string) => {
    const found = memories.find(
      (m) => m.id === relatedIdOrTitle || m.title.toLowerCase() === relatedIdOrTitle.toLowerCase()
    );
    if (found) {
      setSelectedMemory(found);
    } else {
      addToast({
        title: 'Related Memory',
        description: `Navigating to memory reference: ${relatedIdOrTitle}`,
        type: 'info',
      });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategoryTab('All');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <MemoryHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenFilters={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
        isFiltersActive={searchTerm.length > 0 || activeCategoryTab !== 'All'}
        onNavigateSettings={() => {
          addToast({
            title: 'Settings',
            description: 'Opened NEXORBIT Memory settings.',
            type: 'info',
          });
        }}
      />

      {/* Category Tabs: All | People | Projects | Preferences | Knowledge | Decisions */}
      <MemoryCategoryTabs
        activeTab={activeCategoryTab}
        onSelectTab={setActiveCategoryTab}
      />

      {/* Memory Summary: "Memory at a glance" */}
      <MemorySummary
        totalMemories={128 + (memories.length - INITIAL_MEMORIES.length)}
        peopleCount={32}
        projectsCount={18}
        preferencesCount={21}
        knowledgeCount={57}
        onViewConnections={() => {
          addToast({
            title: 'Memory Connections',
            description: 'Viewing NEXORBIT synaptic memory network graph.',
            type: 'info',
          });
        }}
      />

      {/* Main Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List (~7 cols) */}
        <div className="lg:col-span-7">
          <MemoryTimeline
            memories={filteredMemories}
            selectedMemory={selectedMemory}
            onSelectMemory={handleSelectMemory}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Detail Panel (~5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <MemoryDetailPanel
            memory={selectedMemory}
            onClose={() => setSelectedMemory(null)}
            onEdit={handleEditMemory}
            onForget={handleForgetMemory}
            onSelectRelated={handleSelectRelated}
          />
        </div>
      </div>

      {/* Edit Memory Modal */}
      <EditMemoryModal
        memory={editingMemory}
        isOpen={!!editingMemory}
        onClose={() => setEditingMemory(null)}
        onSave={handleSaveEdit}
      />

      {/* Forget Memory Confirmation Modal */}
      <ForgetMemoryModal
        memory={memoryToForget}
        isOpen={!!memoryToForget}
        onClose={() => setMemoryToForget(null)}
        onConfirmForget={handleConfirmForget}
      />
    </div>
  );
};
