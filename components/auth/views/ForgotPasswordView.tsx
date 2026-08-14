'use client';

import React, { useState, useRef } from 'react';
import { ArrowLeft, Mail, Send, KeyRound, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import { validateEmailInput } from '../authErrors';

export const ForgotPasswordView: React.FC = () => {
  const {
    pendingEmail,
    sendPasswordReset,
    setAuthView,
    loading,
    authErrorInfo,
    clearError,
    setAuthError,
  } = useAuth();

  const [email, setEmail] = useState(pendingEmail || '');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Determine if email has active error
  const isEmailError = localError !== null || authErrorInfo?.targetField === 'email';
  const emailErrorMessage = localError || (authErrorInfo?.targetField === 'email' ? authErrorInfo.message : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || email.trim().length === 0) {
      setLocalError('Enter your email address.');
      emailInputRef.current?.focus();
      return;
    }

    const emailValidation = validateEmailInput(email);
    if (!emailValidation.isValid) {
      setLocalError(emailValidation.error || 'Enter a valid email address.');
      emailInputRef.current?.focus();
      return;
    }

    setLocalError(null);
    clearError();
    try {
      await sendPasswordReset(emailValidation.cleanEmail);
      setSentToEmail(emailValidation.cleanEmail);
      setIsSent(true);
    } catch (err) {
      // Handled in AuthContext
    }
  };

  const handleOpenEmailApp = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'mailto:';
    }
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Top Back Navigation */}
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
          <span>Back to sign in</span>
        </button>
      </div>

      {isSent ? (
        /* Password Reset Link Sent State */
        <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Send className="h-5 w-5 stroke-[2.25]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Check your email
            </h1>
            <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xs mx-auto">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-semibold text-slate-800">{sentToEmail}</span>. If you don&apos;t see it, check your spam or junk folder.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
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
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-1">
            <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-2xs">
              <KeyRound className="h-5 w-5 stroke-[2.25]" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Reset your password
            </h1>
            <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xs mx-auto">
              Enter your email address and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          {authErrorInfo && authErrorInfo.targetField !== 'email' && (
            <AuthErrorBanner
              error={authErrorInfo}
              onDismiss={clearError}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-xs font-medium text-slate-700 block">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  ref={emailInputRef}
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck="false"
                  value={email}
                  disabled={loading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (localError) setLocalError(null);
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

              {isEmailError && emailErrorMessage && (
                <p className="text-xs text-rose-600 font-medium pt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {emailErrorMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send reset link</span>
              )}
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                clearError();
                setAuthView('welcome');
              }}
              className="text-xs text-slate-500 hover:text-slate-950 font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Never mind, take me back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
