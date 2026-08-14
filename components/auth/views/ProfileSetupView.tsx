'use client';

import React, { useState } from 'react';
import { User, Building2, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const ProfileSetupView: React.FC = () => {
  const { user, completeProfileSetup, error, clearError } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [role, setRole] = useState('Product Engineer');
  const [timezone, setTimezone] = useState('(GMT+05:30) Asia/Kolkata');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeProfileSetup({ displayName, role, timezone });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs mb-1">
          <Sparkles className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
          Basic Profile Setup
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          Help NEXOrbit personalize your intelligence models and daily summaries.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-rose-500 hover:text-rose-700 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Satyam Kumar"
              required
              className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm bg-slate-50/70 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Primary Role */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Primary Role / Workspace
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm bg-slate-50/70 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 focus:outline-none transition-all cursor-pointer"
            >
              <option value="Founder & Exec">Founder / Executive</option>
              <option value="Product Engineer">Product Engineer / Developer</option>
              <option value="Product Manager">Product Manager / Lead</option>
              <option value="Designer">UI/UX Designer</option>
              <option value="Researcher">AI Researcher / Analyst</option>
              <option value="Other">Other Profession</option>
            </select>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Default Timezone
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm bg-slate-50/70 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 focus:outline-none transition-all cursor-pointer"
            >
              <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata</option>
              <option value="(GMT-08:00) America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
              <option value="(GMT-05:00) America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
              <option value="(GMT+00:00) Europe/London">(GMT+00:00) London / Greenwich Mean Time</option>
              <option value="(GMT+09:00) Asia/Tokyo">(GMT+09:00) Tokyo / Japan Standard Time</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          <span>Complete Setup & Launch Workspace</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
