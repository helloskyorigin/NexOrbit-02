'use client';

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
import { WelcomeView } from './views/WelcomeView';
import { CreateAccountView } from './views/CreateAccountView';
import { PasswordInputView } from './views/PasswordInputView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ProfileSetupView } from './views/ProfileSetupView';
import { AuthenticatingView } from './views/AuthenticatingView';
import { AuthErrorView } from './views/AuthErrorView';
import { AuthSuccessView } from './views/AuthSuccessView';
import { cn } from '../../lib/utils';

export interface AuthContainerProps {
  className?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ className }) => {
  const { authView } = useAuth();

  const renderCurrentView = () => {
    switch (authView) {
      case 'welcome':
      case 'email-signin':
        return <WelcomeView />;
      case 'create-account':
        return <CreateAccountView />;
      case 'password':
        return <PasswordInputView />;
      case 'forgot-password':
        return <ForgotPasswordView />;
      case 'profile-setup':
        return <ProfileSetupView />;
      case 'authenticating':
        return <AuthenticatingView />;
      case 'error':
        return <AuthErrorView />;
      case 'success':
        return <AuthSuccessView />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <div className={cn('min-h-screen w-full bg-slate-50/60 flex flex-col justify-center items-center p-4 sm:p-6 antialiased selection:bg-indigo-100 selection:text-indigo-900', className)}>
      {/* Top Brand Tag */}
      <div className="mb-6 flex items-center gap-2 select-none">
        <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
          N
        </div>
        <span className="font-sans font-extrabold text-base tracking-tight text-slate-900">
          NEXORBIT
        </span>
      </div>

      {/* Primary Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-4 relative overflow-hidden transition-all duration-200">
        {renderCurrentView()}
      </div>

      {/* Footer Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 select-none">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>NEXOrbit Zero-Trust Auth Architecture</span>
      </div>
    </div>
  );
};
