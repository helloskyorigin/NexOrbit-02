'use client';

import React from 'react';
import { Shield, RefreshCw, Sliders, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AboutConnectedAppsCardProps {
  onLearnMorePrivacy?: () => void;
  className?: string;
}

export const AboutConnectedAppsCard: React.FC<AboutConnectedAppsCardProps> = ({
  onLearnMorePrivacy,
  className,
}) => {
  return (
    <div className={cn('p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-5', className)}>
      <h3 className="text-base font-bold text-slate-900 font-sans">
        About Connected Apps
      </h3>

      <p className="text-xs text-slate-500 font-normal leading-relaxed">
        NEXORBIT securely connects to your apps to understand your world and help you get things done.
      </p>

      <div className="space-y-4 pt-1">
        {/* Benefit 1 */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-700 shrink-0 mt-0.5 border border-slate-100">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900">Secure by design</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              We use industry-standard encryption and never store your passwords.
            </p>
          </div>
        </div>

        {/* Benefit 2 */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-700 shrink-0 mt-0.5 border border-slate-100">
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900">Real-time sync</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              NEXORBIT keeps your data fresh across all your apps.
            </p>
          </div>
        </div>

        {/* Benefit 3 */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-700 shrink-0 mt-0.5 border border-slate-100">
            <Sliders className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900">You&apos;re in control</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Connect, disconnect, and manage access anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onLearnMorePrivacy}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Learn more about privacy</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
