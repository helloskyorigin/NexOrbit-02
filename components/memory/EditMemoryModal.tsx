'use client';

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { MemoryItem, MemoryCategory } from './types';

export interface EditMemoryModalProps {
  memory: MemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: MemoryItem) => void;
}

export const EditMemoryModal: React.FC<EditMemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('Projects');
  const [aboutText, setAboutText] = useState('');

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setDescription(memory.description);
      setCategory(memory.category);
      setAboutText(memory.aboutText || memory.description);
    }
  }, [memory]);

  if (!isOpen || !memory) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated: MemoryItem = {
      ...memory,
      title: title.trim(),
      description: description.trim(),
      category: category,
      aboutText: aboutText.trim(),
      updatedAt: 'Just now',
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden text-left animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Edit Memory
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Memory Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Title"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MemoryCategory)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="Projects">Projects</option>
              <option value="People">People</option>
              <option value="Preferences">Preferences</option>
              <option value="Knowledge">Knowledge</option>
              <option value="Decisions">Decisions</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Short Summary</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Short description snippet"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">About Memory (Detailed)</label>
            <textarea
              rows={3}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200/90 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Save changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
