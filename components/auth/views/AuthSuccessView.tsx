'use client';

import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AuthSuccessView: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="py-8 space-y-4 text-center">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs mx-auto">
        <CheckCircle2 className="h-8 w-8 text-emerald-600 animate-bounce" />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.displayName || 'User'}!
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Session verified. Launching NEXOrbit workspace...
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Syncing context & memory store...</span>
      </div>
    </div>
  );
};
