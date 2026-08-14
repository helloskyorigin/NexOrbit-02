'use client';

import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AuthErrorView: React.FC = () => {
  const { error, setAuthView, clearError, t } = useAuth();

  return (
    <div className="py-4 space-y-4 text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs mx-auto">
        <AlertCircle className="h-5 w-5 text-rose-600" />
      </div>

      <div className="space-y-1">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          {t('authFailedTitle')}
        </h2>
        <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          {error || 'An unexpected error occurred.'}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
        <button
          onClick={() => {
            clearError();
            setAuthView('welcome');
          }}
          className="w-full px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t('tryAgain')}</span>
        </button>

        <button
          onClick={() => {
            clearError();
            setAuthView('welcome');
          }}
          className="w-full px-4 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t('backToSignIn')}</span>
        </button>
      </div>
    </div>
  );
};
