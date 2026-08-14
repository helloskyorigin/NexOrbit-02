'use client';

import React, { useState, useRef } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';

export const PasswordInputView: React.FC = () => {
  const {
    pendingEmail,
    submitPassword,
    setAuthView,
    loading,
    authErrorInfo,
    clearError,
    setAuthError,
  } = useAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Determine if password has active error
  const isPasswordError =
    localError !== null || (authErrorInfo?.targetField === 'password');
  const passwordErrorMessage =
    localError || (authErrorInfo?.targetField === 'password' ? authErrorInfo.message : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!password || password.trim().length === 0) {
      setLocalError('Enter your password.');
      passwordInputRef.current?.focus();
      return;
    }

    setLocalError(null);
    clearError();
    submitPassword(password);
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200 relative">
      {/* Top back navigation */}
      <div>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            clearError();
            setAuthView('welcome');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Enter your password
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="truncate max-w-[200px] font-medium text-slate-700">
            {pendingEmail || 'you@example.com'}
          </span>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              clearError();
              setAuthView('welcome');
            }}
            className="text-slate-950 hover:text-indigo-600 font-semibold cursor-pointer underline underline-offset-2 disabled:opacity-50"
          >
            Change
          </button>
        </div>
      </div>

      {/* General Error Banner for non-field specific errors */}
      {authErrorInfo && authErrorInfo.targetField !== 'password' && (
        <AuthErrorBanner
          error={authErrorInfo}
          onDismiss={clearError}
          onAction={() => {
            clearError();
            setAuthView('forgot-password');
          }}
          actionLabel="Reset password"
        />
      )}

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password-input" className="text-xs font-medium text-slate-700 block">
              Password
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                clearError();
                setAuthView('forgot-password');
              }}
              className="text-xs text-slate-500 hover:text-slate-950 font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              ref={passwordInputRef}
              id="password-input"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);
                if (localError) setLocalError(null);
                if (authErrorInfo) clearError();
              }}
              placeholder="Enter your password"
              required
              autoFocus
              className={`w-full h-11 pl-10 pr-10 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-150 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                isPasswordError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                  : 'border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Inline Field Error */}
          {isPasswordError && passwordErrorMessage && (
            <div className="flex items-center justify-between pt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <p className="text-xs text-rose-600 font-medium">
                {passwordErrorMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  clearError();
                  setAuthView('forgot-password');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2 ml-2 shrink-0 cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Account Switching */}
      <div className="pt-2 text-center">
        <p className="text-xs text-slate-500 font-normal">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              clearError();
              setAuthView('create-account');
            }}
            className="text-slate-950 hover:text-indigo-600 font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
