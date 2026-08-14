'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { UserProfile } from '../types';
import { useToast } from '../../ui/Toast';
import { User, Mail, Briefcase, Camera, Sparkles } from 'lucide-react';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<UserProfile>(user);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Your user profile and persona settings have been saved.',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal details and NEXORBIT AI identity"
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4 pt-2">
        {/* Avatar Preview & Quick Switch */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={formData.avatarUrl}
            alt={formData.name}
            className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
          />
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Profile Photo
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const seed = Math.floor(Math.random() * 100);
                  setFormData({
                    ...formData,
                    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80&sig=${seed}`,
                  });
                }}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Camera className="h-3 w-3" />
                <span>Randomize Avatar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            <span>Workspace Role / Title</span>
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};
