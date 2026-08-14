'use client';

import React, { useState } from 'react';
import { Shield, Zap, Lock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { WelcomeView } from './views/WelcomeView';
import { CreateAccountView } from './views/CreateAccountView';
import { PasswordInputView } from './views/PasswordInputView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ProfileSetupView } from './views/ProfileSetupView';
import { AuthenticatingView } from './views/AuthenticatingView';
import { AuthErrorView } from './views/AuthErrorView';
import { AuthSuccessView } from './views/AuthSuccessView';
import { NexOrbitLogo } from './NexOrbitLogo';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

export interface AuthContainerProps {
  className?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ className }) => {
  const { authView } = useAuth();
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

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
    <div
      className={cn(
        'min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-between antialiased selection:bg-slate-200 selection:text-slate-900',
        className
      )}
    >
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen p-4 sm:p-8 lg:p-12 items-center">
        {/* Left Column: Brand Hero & Orbital Visuals (Desktop) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between h-full pr-8 xl:pr-16 py-6 select-none relative">
          {/* Top Brand Logo */}
          <div className="flex items-center">
            <NexOrbitLogo variant="full" size="md" />
          </div>

          {/* Center Display Hero & Orbital Visual */}
          <div className="relative my-auto py-12">
            {/* Background Orbital Aesthetic Trail */}
            <div className="absolute -top-16 -left-8 w-[520px] h-[440px] pointer-events-none opacity-80">
              <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Outer gentle orbital curves */}
                <path
                  d="M 40 280 C 140 100, 360 40, 480 180 C 560 270, 360 400, 160 360 C 80 340, 30 300, 40 280 Z"
                  stroke="url(#orbitGradient)"
                  strokeWidth="1.25"
                  strokeDasharray="4 4"
                  className="opacity-40"
                />
                <ellipse
                  cx="280"
                  cy="210"
                  rx="190"
                  ry="95"
                  transform="rotate(-22 280 210)"
                  stroke="url(#orbitGradient2)"
                  strokeWidth="1.5"
                  className="opacity-60"
                />
                {/* Floating planetary spheres */}
                <circle cx="165" cy="225" r="10" className="fill-slate-900 shadow-md" />
                <circle cx="162" cy="222" r="3" className="fill-white/30" />
                
                <circle cx="410" cy="130" r="4.5" className="fill-indigo-600/80" />
                <circle cx="105" cy="310" r="3.5" className="fill-slate-400" />

                <defs>
                  <linearGradient id="orbitGradient" x1="40" y1="100" x2="480" y2="380" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" stopOpacity="0.4" />
                    <stop offset="0.5" stopColor="#94A3B8" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#CBD5E1" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="orbitGradient2" x1="120" y1="140" x2="440" y2="280" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#475569" stopOpacity="0.4" />
                    <stop offset="0.7" stopColor="#818CF8" stopOpacity="0.3" />
                    <stop offset="1" stopColor="#E2E8F0" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-10 space-y-4 max-w-lg">
              <h1 className="text-4xl xl:text-[44px] font-bold text-slate-950 tracking-tight leading-[1.12]">
                Your AI workspace for the future.
              </h1>
              <p className="text-base text-slate-500 font-normal leading-relaxed max-w-md">
                One secure place for all your work, AI agents, and integrations.
              </p>
            </div>

            {/* Value Proposition List */}
            <div className="relative z-10 mt-14 space-y-6 max-w-md">
              <div className="flex items-start gap-3.5">
                <div className="h-8 w-8 rounded-lg bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <Shield className="h-4 w-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Enterprise-grade security
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Your data is encrypted and always protected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-8 w-8 rounded-lg bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Seamless &amp; fast
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    Built for speed, simplicity and productivity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-8 w-8 rounded-lg bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <Lock className="h-4 w-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Privacy first
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5">
                    You own your data. We respect that.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer Copyright */}
          <div className="text-xs text-slate-400 font-normal">
            &copy; 2025 NexOrbit. All rights reserved.
          </div>
        </div>

        {/* Right Column: Centered Elevated Auth Card (Desktop & Mobile) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center w-full py-4 sm:py-8">
          {/* Mobile Top Brand Header */}
          <div className="flex lg:hidden flex-col items-center justify-center mb-8 text-center select-none">
            <NexOrbitLogo variant="full" size="md" />
          </div>

          {/* Elevated Auth Card */}
          <div className="w-full max-w-[420px] bg-white rounded-3xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-200/70 transition-all duration-200">
            {renderCurrentView()}
          </div>

          {/* Terms and Privacy Policy Note below Card */}
          <div className="mt-6 text-center max-w-sm px-4">
            <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
              By continuing, you agree to our{' '}
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="text-slate-600 hover:text-slate-950 font-medium underline underline-offset-2 cursor-pointer transition-colors"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="text-slate-600 hover:text-slate-950 font-medium underline underline-offset-2 cursor-pointer transition-colors"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Terms of Service & Privacy Policy Modals */}
      <Modal
        isOpen={legalModal !== null}
        onClose={() => setLegalModal(null)}
        title={legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        description={`NexOrbit ${legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'} Agreement`}
      >
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-80 overflow-y-auto pr-1">
          {legalModal === 'terms' ? (
            <>
              <p>
                Welcome to NexOrbit. By accessing or using our personal AI workspace platform and associated services, you agree to be bound by these Terms of Service.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">1. Your AI Workspace</h4>
              <p>
                NexOrbit provides a privacy-first personal AI intelligence engine. You retain full ownership and intellectual property rights to all prompts, data, context vectors, and workspace contents.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">2. Acceptable Use</h4>
              <p>
                You agree not to misuse the NexOrbit services or assist anyone else in doing so, including attempting unauthorized access to any system or automated rate abuse.
              </p>
            </>
          ) : (
            <>
              <p>
                At NexOrbit, your privacy and data sovereignty are paramount. We design all AI workspaces with strict boundary isolation.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">1. Data Ownership</h4>
              <p>
                Your personal notes, emails, documents, and brain context memory vectors are strictly isolated to your authenticated account and are never used to train public machine learning foundation models.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">2. Encryption</h4>
              <p>
                All workspace data is encrypted at rest and in transit using modern cryptographic standards.
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
