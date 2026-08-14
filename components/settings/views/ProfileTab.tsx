'use client';

import React from 'react';
import { Pencil, ChevronRight, User, Mail, Globe, Clock, Shield, Calendar } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../../../lib/utils';

export interface ProfileTabProps {
  user: UserProfile;
  onEditProfile: () => void;
  onViewPlans: () => void;
  className?: string;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onEditProfile,
  onViewPlans,
  className,
}) => {
  const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Section Title */}
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Profile
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Main Profile Box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
        {/* Top Header Row with Avatar & Edit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* Circle Avatar */}
            <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-2xs shrink-0 select-none">
              {initialLetter}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {user.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                {user.email}
              </p>
              <div className="pt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100/80">
                  {user.plan}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer shrink-0 self-start sm:self-center"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Rows List */}
        <div className="divide-y divide-slate-100 text-xs">
          {/* Full Name */}
          <div
            onClick={onEditProfile}
            className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-500 font-normal min-w-0">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Full Name</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-medium shrink-0">
              <span>{user.name}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Email */}
          <div
            onClick={onEditProfile}
            className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-500 font-normal min-w-0">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Email</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-medium shrink-0">
              <span className="truncate max-w-[200px] sm:max-w-xs">{user.email}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Time Zone */}
          <div
            onClick={onEditProfile}
            className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-500 font-normal min-w-0">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Time Zone</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-medium shrink-0">
              <span>(GMT+05:30) Asia/Kolkata</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Language */}
          <div
            onClick={onEditProfile}
            className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-500 font-normal min-w-0">
              <Globe className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Language</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-medium shrink-0">
              <span>English</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Account ID */}
          <div
            onClick={onEditProfile}
            className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/50 rounded-xl px-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-500 font-normal min-w-0">
              <Shield className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Account ID</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-medium shrink-0">
              <span className="font-mono text-slate-600">{user.nexorbitId || 'nxo_7f3a9b2c1d4e'}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Member Since */}
          <div className="py-3 flex items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3 text-slate-500 font-normal min-w-0">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Member Since</span>
            </div>
            <div className="text-slate-900 font-medium shrink-0">
              <span>{user.memberSince || 'May 11, 2024'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card Section */}
      <div className="space-y-3 pt-2">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-slate-900 font-sans">
            Subscription
          </h3>
          <p className="text-xs text-slate-500 font-normal">
            You are on the Free Plan.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">
              Free Plan
            </h4>
            <p className="text-xs text-slate-500 font-normal">
              Limited access to features and daily usage limits.
            </p>
          </div>

          <button
            onClick={onViewPlans}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <span>View Plans</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
