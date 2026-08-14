'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Users,
  Folder,
  Tag,
  Calendar,
  MessageSquare,
  FileText,
  Mail,
  Zap,
} from 'lucide-react';
import { MemoryCategory, MemoryItem, MemorySourceType } from './types';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMemory: (memory: MemoryItem) => void;
  initialCategory?: MemoryCategory;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAddMemory,
  initialCategory = 'Projects',
}) => {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MemoryCategory>(initialCategory);
  const [sourceType, setSourceType] = useState<MemorySourceType>('note');
  const [relatedPerson, setRelatedPerson] = useState('');
  const [relatedProject, setRelatedProject] = useState('Project Alpha');
  const [tag, setTag] = useState('Project Alpha');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({
        title: 'Title required',
        description: 'Please provide a title for this memory.',
        type: 'error',
      });
      return;
    }

    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Manually captured knowledge synapse in NexOrbit.',
      category,
      source: {
        type: sourceType,
        name: sourceType === 'gmail' ? 'Gmail' : sourceType === 'calendar' ? 'Google Calendar' : sourceType === 'notion' ? 'Notion' : sourceType === 'drive' ? 'Google Drive' : sourceType === 'meeting' ? 'Meeting Note' : 'Manual Note',
        detail: 'Captured via NexOrbit Quick Memory',
      },
      tag: tag.trim() || category,
      timestamp: 'Just now',
      dateGroup: 'Today',
      dotColor: category === 'Decisions' ? 'amber' : category === 'People' ? 'green' : category === 'Knowledge' ? 'purple' : 'blue',
      relatedPerson: relatedPerson.trim() || undefined,
      relatedProject: relatedProject.trim() || undefined,
      strength: 5,
    };

    onAddMemory(newMem);
    addToast({
      title: 'Memory Remembered ✦',
      description: `"${newMem.title}" has been anchored into your AI context.`,
      type: 'success',
    });

    // Reset & close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Box */}
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 sm:p-7 text-left shadow-2xl transition-all border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 fill-indigo-600/20" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Add to Memory</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium pl-10">
              Anchor facts, context, or decisions so NexOrbit can reference them in your future tasks.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Memory Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Rahul approved the launch budget up to ₹12L"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Full Context &amp; Details
              </label>
              <textarea
                rows={3}
                placeholder="Provide details, rationale, or key takeaways..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white resize-none transition-all"
              />
            </div>

            {/* Category & Source Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white cursor-pointer"
                >
                  <option value="Projects">Projects</option>
                  <option value="People">People</option>
                  <option value="Preferences">Preferences</option>
                  <option value="Knowledge">Knowledge</option>
                  <option value="Decisions">Decisions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Source Type</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as MemorySourceType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white cursor-pointer"
                >
                  <option value="note">Manual Note</option>
                  <option value="gmail">Gmail</option>
                  <option value="calendar">Google Calendar</option>
                  <option value="notion">Notion</option>
                  <option value="drive">Google Drive</option>
                  <option value="meeting">Meeting Note</option>
                  <option value="slack">Slack</option>
                  <option value="decision">Strategy Decision</option>
                </select>
              </div>
            </div>

            {/* Related Person & Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Related Person (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={relatedPerson}
                  onChange={(e) => setRelatedPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tag / Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Project Alpha"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs h-9 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-5 font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                Anchor Memory
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
