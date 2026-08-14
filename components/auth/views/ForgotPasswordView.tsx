'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, Send, KeyRound, ExternalLink } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const ForgotPasswordView: React.FC = () => {
  const { pendingEmail, sendPasswordReset, setAuthView, error, clearError } = useAuth();
  const [email, setEmail] = useState(pendingEmail || '');
  const [isSent, setIsSent] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setLoadingReset(true);
      try {
        await sendPasswordReset(email.trim());
        setIsSent(true);
      } catch (err) {
        // Handled in AuthContext
      } finally {
        setLoadingReset(false);
      }
    }
  };

  const handleOpenEmailApp = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'mailto:';
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Top Back Navigation */}
      <div>
        <button
          type="button"
          onClick={() => {
            clearError();
            setAuthView('welcome');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </button>
      </div>

      {isSent ? (
        /* Password Reset Link Sent State */
        <div className="space-y-6 text-center py-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Send className="h-5 w-5 stroke-[2.25]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Password reset link sent
            </h1>
            <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xs mx-auto">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-semibold text-slate-800">{email}</span>. If you don&apos;t see it, check your spam folder.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleOpenEmailApp}
              className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-sm shadow-2xs transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Open email app</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthView('welcome');
              }}
              className="w-full h-10 text-xs font-medium text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              Back to sign in
            </button>
          </div>
        </div>
      ) : (
        /* Forgot Password Input State */
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <KeyRound className="h-5 w-5 stroke-[2.25]" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Forgot password
            </h1>
            <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xs mx-auto">
              Enter your email address and we&apos;ll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center justify-between">
              <span className="leading-relaxed">{error}</span>
              <button
                onClick={clearError}
                type="button"
                className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer p-0.5"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-xs font-medium text-slate-700 block">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none transition-all duration-150"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingReset}
              className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-50 text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loadingReset ? 'Sending link...' : 'Send reset link'}</span>
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthView('welcome');
              }}
              className="text-xs text-slate-500 hover:text-slate-950 font-medium transition-colors cursor-pointer"
            >
              Back to sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
