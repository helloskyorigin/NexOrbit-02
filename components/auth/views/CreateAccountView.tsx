'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, User } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const CreateAccountView: React.FC = () => {
  const {
    signInWithGoogle,
    signInWithGitHub,
    signUpWithEmail,
    setAuthView,
    error,
    clearError,
  } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password) {
      // Store full name temporarily for profile setup persistence if provided
      if (fullName.trim() && typeof window !== 'undefined') {
        try {
          localStorage.setItem('nexorbit_temp_fullname', fullName.trim());
        } catch (err) {}
      }
      signUpWithEmail(email.trim(), password);
    }
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Create your account
        </h1>
        <p className="text-sm text-slate-500 font-normal leading-relaxed">
          Start your journey with NexOrbit
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullname-input" className="text-xs font-medium text-slate-700 block">
            Full name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="fullname-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none transition-all duration-150"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-xs font-medium text-slate-700 block">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) clearError();
              }}
              placeholder="you@example.com"
              required
              className="w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none transition-all duration-150"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="text-xs font-medium text-slate-700 block">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) clearError();
              }}
              placeholder="Create a strong password"
              required
              minLength={6}
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

          {/* Password requirement checklist */}
          <div className="pt-1 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-normal transition-colors">
              <div
                className={`h-3.5 w-3.5 rounded-full flex items-center justify-center text-[9px] ${
                  hasMinLength ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span className={hasMinLength ? 'text-slate-700' : 'text-slate-400'}>
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-normal transition-colors">
              <div
                className={`h-3.5 w-3.5 rounded-full flex items-center justify-center text-[9px] ${
                  hasNumberOrSymbol ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
              <span className={hasNumberOrSymbol ? 'text-slate-700' : 'text-slate-400'}>
                Include a number or symbol
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group mt-3"
        >
          <span>Create account</span>
          <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          or
        </span>
      </div>

      {/* Social options */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={signInWithGoogle}
          type="button"
          className="h-10 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-xs shadow-2xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
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
          <span>Google</span>
        </button>

        <button
          onClick={signInWithGitHub}
          type="button"
          className="h-10 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-xs shadow-2xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="h-4 w-4 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      {/* Account Switching */}
      <div className="pt-1 text-center">
        <p className="text-xs text-slate-500 font-normal">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              clearError();
              setAuthView('welcome');
            }}
            className="text-slate-950 hover:text-indigo-600 font-semibold cursor-pointer transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
