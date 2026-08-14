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
  const { authView, language, setLanguage, t } = useAuth();

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
      {/* Top Brand Tag & Language Selector */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 px-1">
        <div className="flex items-center gap-2 select-none">
          <div className="h-8.5 w-8.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
            N
          </div>
          <div>
            <div className="font-sans font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-none">
              {t('brandName')}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {t('brandSubtitle')}
            </div>
          </div>
        </div>

        {/* Premium Language Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setLanguage('en')}
            className={cn(
              "px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer",
              language === 'en' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={cn(
              "px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer",
              language === 'hi' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            )}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Primary Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-4 relative overflow-hidden transition-all duration-200">
        {renderCurrentView()}
      </div>

      {/* Footer Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 select-none">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>{t('securityReassurance')}</span>
      </div>
    </div>
  );
};
