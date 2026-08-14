'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const PasswordInputView: React.FC = () => {
  const { pendingEmail, submitPassword, setAuthView, error, clearError } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      submitPassword(password);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-200 relative">
      {/* Top back navigation */}
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
            onClick={() => {
              clearError();
              setAuthView('welcome');
            }}
            className="text-slate-950 hover:text-indigo-600 font-semibold cursor-pointer underline underline-offset-2"
          >
            Change
          </button>
        </div>
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

      {/* Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password-input" className="text-xs font-medium text-slate-700 block">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthView('forgot-password');
              }}
              className="text-xs text-slate-500 hover:text-slate-950 font-medium transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) clearError();
              }}
              placeholder="Enter your password"
              required
              autoFocus
              className="w-full h-11 pl-10 pr-10 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none transition-all duration-150"
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
        </div>

        <button
          type="submit"
          className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>Sign in</span>
          <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>

      {/* Account Switching */}
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
