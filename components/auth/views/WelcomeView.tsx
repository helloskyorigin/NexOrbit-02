'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { cn } from '../../../lib/utils';

export const WelcomeView: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, setAuthView, error, clearError } = useAuth();
  const [emailInput, setEmailInput] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      signInWithEmail(emailInput.trim());
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs mb-1">
          <Sparkles className="h-6 w-6 text-indigo-600" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
          Welcome to NEXOrbit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
          Your personal desktop AI ecosystem. Sign in to access your synchronized workspace.
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

      {/* Primary Action: Google */}
      <div className="space-y-3">
        <button
          onClick={signInWithGoogle}
          type="button"
          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer group"
        >
          {/* Official Google G Logo SVG */}
          <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-auto" />
        </button>

        {/* Divider */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            or continue with email
          </span>
        </div>

        {/* Email Input Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (error) clearError();
              }}
              placeholder="name@company.com"
              required
              className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm bg-slate-50/70 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue with Email</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Footer link to switch view */}
      <div className="pt-2 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <button
            onClick={() => {
              clearError();
              setAuthView('create-account');
            }}
            className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-2 cursor-pointer"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};
