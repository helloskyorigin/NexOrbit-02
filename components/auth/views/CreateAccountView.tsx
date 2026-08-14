'use client';

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { cn } from '../../../lib/utils';

export const CreateAccountView: React.FC = () => {
  const { signInWithGoogle, signInWithGitHub, signUpWithEmail, setAuthView, error, clearError, t } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password) {
      signUpWithEmail(email.trim(), password);
    }
  };

  return (
    <div className="space-y-5 text-left">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs mb-1">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          {t('createAccountTitle')}
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          {t('createAccountSubtitle')}
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

      {/* Social options */}
      <div className="space-y-3">
        {/* Google Primary */}
        <button
          onClick={signInWithGoogle}
          type="button"
          className="w-full h-10 px-4 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('continueWithGoogle')}</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>

        {/* GitHub Primary */}
        <button
          onClick={signInWithGitHub}
          type="button"
          className="w-full h-10 px-4 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>{t('continueWithGitHub')}</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>

        {/* Divider */}
        <div className="relative py-1 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {t('orSignUpWithEmail')}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
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
                className="w-full h-10 pl-9 pr-3.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all duration-150"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                placeholder={t('minPasswordLength')}
                required
                minLength={6}
                className="w-full h-10 pl-9 pr-3.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all duration-150"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group mt-2"
          >
            <span>{t('createAccountBtn')}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="pt-2 text-center border-t border-slate-50">
        <p className="text-xs text-slate-500 font-medium">
          {t('alreadyHaveAccount')}{' '}
          <button
            onClick={() => {
              clearError();
              setAuthView('welcome');
            }}
            className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-2 cursor-pointer transition-colors"
          >
            {t('signInInstead')}
          </button>
        </p>
      </div>
    </div>
  );
};
