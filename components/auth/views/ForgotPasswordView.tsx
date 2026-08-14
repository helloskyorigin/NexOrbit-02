'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const ForgotPasswordView: React.FC = () => {
  const { pendingEmail, sendPasswordReset, setAuthView, error, clearError, t } = useAuth();
  const [email, setEmail] = useState(pendingEmail || '');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await sendPasswordReset(email);
      setIsSent(true);
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
        <span>{t('backToSignIn')}</span>
      </button>

      {/* Header */}
      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs mb-1">
          <KeyRound className="h-5 w-5 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          {t('resetPasswordTitle')}
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          {t('resetPasswordSubtitle')}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer">
            ×
          </button>
        </div>
      )}

      {isSent ? (
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center space-y-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-emerald-950">{t('resetLinkSentTitle')}</h3>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              {t('resetLinkSentDesc')} <span className="font-semibold">{email}</span>.
            </p>
          </div>
          <button
            onClick={() => setAuthView('welcome')}
            className="w-full h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            {t('returnToSignIn')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('emailLabel')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                placeholder={t('emailPlaceholder')}
                required
                autoFocus
                className="w-full h-10 pl-9 pr-3.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all duration-150"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 cursor-pointer"
          >
            {t('sendResetLink')}
          </button>
        </form>
      )}
    </div>
  );
};
