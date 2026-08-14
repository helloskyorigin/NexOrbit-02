'use client';

import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AuthenticatingView: React.FC = () => {
  const { t } = useAuth();

  return (
    <div className="py-8 space-y-4 text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs mx-auto">
        <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight uppercase tracking-wider">
          {t('signingIn')}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {t('securingSession')}
        </p>
      </div>
    </div>
  );
};
