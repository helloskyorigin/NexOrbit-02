'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
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
  const { authView, t } = useAuth();

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
    <div className={cn('min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6 antialiased selection:bg-slate-200 selection:text-black', className)}>
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Minimal Logo */}
        <div className="mb-10 flex items-center justify-center select-none">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-black text-white flex items-center justify-center font-semibold text-xs shadow-sm">
              N
            </div>
            <div className="font-sans font-semibold text-sm tracking-tight text-black">
              NexOrbit
            </div>
          </div>
        </div>

        {/* Primary Auth Form Container */}
        <div className="w-full">
          {renderCurrentView()}
        </div>

        {/* Footer Security Badge */}
        <div className="mt-12 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 select-none">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{t('securityReassurance')}</span>
        </div>
      </div>
    </div>
  );
};
