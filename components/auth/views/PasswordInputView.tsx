'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const PasswordInputView: React.FC = () => {
  const { pendingEmail, submitPassword, setAuthView, error, clearError, t } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      submitPassword(password);
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Back button */}
      <button
        type="button"
        onClick={() => {
          clearError();
          setAuthView('welcome');
        }}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{t('back')}</span>
      </button>

      {/* Header */}
      <div className="space-y-1.5 text-center pb-1">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs mb-1">
          <ShieldCheck className="h-5 w-5 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          {t('enterPasswordTitle')}
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 max-w-full mx-auto">
          <span className="truncate max-w-[180px] font-semibold">{pendingEmail || 'user@nexorbit.ai'}</span>
          <button
            onClick={() => {
              clearError();
              setAuthView('welcome');
            }}
            className="text-indigo-600 hover:text-indigo-700 font-bold text-[10px] cursor-pointer"
          >
            {t('changeEmail')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer">
            ×
          </button>
        </div>
      )}

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('passwordLabel')}
            </label>
            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthView('forgot-password');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
            >
              {t('forgotPassword')}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) clearError();
              }}
              placeholder={t('passwordPlaceholder')}
              required
              autoFocus
              className="w-full h-10 pl-9 pr-10 text-xs sm:text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>{t('signIn')}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>
    </div>
  );
};
