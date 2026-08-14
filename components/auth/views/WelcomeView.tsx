'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import { validateEmailInput } from '../authErrors';

export const WelcomeView: React.FC = () => {
  const {
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    setAuthView,
    loading,
    oauthLoading,
    authErrorInfo,
    clearError,
    setAuthError,
    pendingEmail,
  } = useAuth();

  const [emailInput, setEmailInput] = useState(pendingEmail || '');
  const [localEmailError, setLocalEmailError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Determine if email field has an active error
  const isEmailError =
    localEmailError !== null || (authErrorInfo?.targetField === 'email');
  const emailErrorMessage =
    localEmailError || (authErrorInfo?.targetField === 'email' ? authErrorInfo.message : null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || oauthLoading) return;

    if (!emailInput || emailInput.trim().length === 0) {
      setLocalEmailError('Enter your email address.');
      emailInputRef.current?.focus();
      return;
    }

    const validation = validateEmailInput(emailInput);
    if (!validation.isValid) {
      setLocalEmailError(validation.error || 'Enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    setLocalEmailError(null);
    clearError();
    signInWithEmail(validation.cleanEmail);
  };

  const isAnyLoading = loading || oauthLoading !== null;

  return (
    <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 font-normal leading-relaxed">
          Sign in to continue to your NexOrbit workspace
        </p>
      </div>

      {/* General (Non-field-specific) Error Banner */}
      {authErrorInfo && authErrorInfo.targetField !== 'email' && (
        <AuthErrorBanner
          error={authErrorInfo}
          onDismiss={clearError}
          onAction={(actionType) => {
            if (actionType === 'signup') {
              clearError();
              setAuthView('create-account');
            }
          }}
        />
      )}

      {/* Primary Email Flow */}
      <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="welcome-email" className="text-xs font-medium text-slate-700 block">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              ref={emailInputRef}
              id="welcome-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              value={emailInput}
              disabled={isAnyLoading}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (localEmailError) setLocalEmailError(null);
                if (authErrorInfo) clearError();
              }}
              placeholder="name@company.com"
              required
              autoFocus
              className={`w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-150 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                isEmailError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                  : 'border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10'
              }`}
            />
          </div>

          {/* Inline Field Error */}
          {isEmailError && emailErrorMessage && (
            <div className="flex items-center justify-between pt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <p className="text-xs text-rose-600 font-medium">
                {emailErrorMessage}
              </p>
              {authErrorInfo?.actionType === 'signup' && (
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    setAuthView('create-account');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
                >
                  Create account
                </button>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isAnyLoading}
          className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
        >
          {loading && !oauthLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
              <span>Continuing...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          or continue with
        </span>
      </div>

      {/* Social Alternative Options */}
      <div className="space-y-2.5">
        {/* Google Primary */}
        <button
          onClick={signInWithGoogle}
          disabled={isAnyLoading}
          type="button"
          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-800 font-medium text-sm shadow-2xs transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer group"
        >
          {oauthLoading === 'google' ? (
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span>Connecting to Google...</span>
            </div>
          ) : (
            <>
              <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24">
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
            </>
          )}
        </button>

        {/* GitHub Primary */}
        <button
          onClick={signInWithGitHub}
          disabled={isAnyLoading}
          type="button"
          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-slate-800 font-medium text-sm shadow-2xs transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer group"
        >
          {oauthLoading === 'github' ? (
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
              <span>Connecting to GitHub...</span>
            </div>
          ) : (
            <>
              <svg className="h-[18px] w-[18px] shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>Continue with GitHub</span>
            </>
          )}
        </button>
      </div>

      {/* Account Switching Bottom Link */}
      <div className="pt-2 text-center">
        <p className="text-xs text-slate-500 font-normal">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => {
              clearError();
              setAuthView('create-account');
            }}
            className="text-slate-950 hover:text-indigo-600 font-semibold cursor-pointer transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
