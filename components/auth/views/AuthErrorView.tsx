'use client';

import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AuthErrorView: React.FC = () => {
  const { error, setAuthView, clearError } = useAuth();

  return (
    <div className="py-6 space-y-5 text-center">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs mx-auto">
        <AlertCircle className="h-7 w-7 text-rose-600" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Authentication Failed
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
          {error || 'An unexpected error occurred while verifying your credentials. Please try again.'}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <button
          onClick={() => {
            clearError();
            setAuthView('welcome');
          }}
          className="w-full sm:w-auto px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>

        <button
          onClick={() => {
            clearError();
            setAuthView('welcome');
          }}
          className="w-full sm:w-auto px-4 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Welcome</span>
        </button>
      </div>
    </div>
  );
};
