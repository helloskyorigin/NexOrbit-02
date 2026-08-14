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
import { cn } from '../../lib/utils';

export const MemoryView: React.FC = () => {
  const { addToast } = useToast();

  // Primary state
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryTabOption>('All');

  // Modals state
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [memoryToForget, setMemoryToForget] = useState<MemoryItem | null>(null);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

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
    if (selectedMemory?.id === memory.id) {
      setSelectedMemory(null);
    } else {
      setSelectedMemory(memory);
    }
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
      setSelectedMemory(null);
    }

    setMemoryToForget(null);
    addToast({
      title: 'Memory Forgotten',
      description: `NexOrbit will no longer use "${memory.title}".`,
      type: 'info',
    });
  };

  const handleSelectRelated = (relatedIdOrTitle: string) => {
    const found = memories.find(
      (m) => m.id === relatedIdOrTitle || m.title.toLowerCase() === relatedIdOrTitle.toLowerCase()
    );
    if (found) {
      setSelectedMemory(found);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategoryTab('All');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28 antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Top Header */}
        <MemoryHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenFilters={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
          isFiltersActive={searchTerm.length > 0 || activeCategoryTab !== 'All'}
        />

        {/* Category Tabs: All | People | Projects | Preferences | Knowledge | Decisions */}
        <MemoryCategoryTabs
          activeTab={activeCategoryTab}
          onSelectTab={setActiveCategoryTab}
        />

        {/* Single-line subtle summary count */}
        <MemorySummary
          totalCount={memories.length}
          filteredCount={filteredMemories.length}
        />

        {/* Dynamic Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main List Column */}
          <div className={cn(selectedMemory ? 'lg:col-span-7' : 'lg:col-span-12', 'transition-all duration-200')}>
            <MemoryTimeline
              memories={filteredMemories}
              selectedMemory={selectedMemory}
              onSelectMemory={handleSelectMemory}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Detail Inspector (Dismissible) */}
          {selectedMemory && (
            <div className="lg:col-span-5 sticky top-6">
              <MemoryDetailPanel
                memory={selectedMemory}
                onClose={() => setSelectedMemory(null)}
                onEdit={handleEditMemory}
                onForget={handleForgetMemory}
                onSelectRelated={handleSelectRelated}
              />
            </div>
          )}
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

