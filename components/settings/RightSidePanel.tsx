'use client';

import React from 'react';
import {
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Upload,
  Download,
  Trash2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RightSidePanelProps {
  onManageSecurity?: () => void;
  onManageStorage?: () => void;
  onExportData?: () => void;
  onDownloadData?: () => void;
  onDeleteAccount?: () => void;
  onNavigateSupport?: () => void;
  className?: string;
}

export const RightSidePanel: React.FC<RightSidePanelProps> = ({
  onManageSecurity,
  onManageStorage,
  onExportData,
  onDownloadData,
  onDeleteAccount,
  onNavigateSupport,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 1. Account Security Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4 text-center">
        <h3 className="text-base font-bold text-slate-900 font-sans text-left">
          Account Security
        </h3>

        <div className="py-2 space-y-2">
          {/* Green Shield Circle Icon */}
          <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="h-7 w-7" />
          </div>

          <div className="space-y-0.5 pt-1">
            <h4 className="text-sm font-bold text-slate-900">
              Your account is secure
            </h4>
            <p className="text-xs text-slate-400 font-normal">
              Last security check: Today, 9:30 AM
            </p>
          </div>
        </div>

        <button
          onClick={onManageSecurity}
          className="w-full py-2 px-4 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
        >
          Manage Security
        </button>
      </div>

      {/* 2. Data Storage Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-sans">
          Data Storage
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-900 font-bold">
              2.4 GB <span className="text-slate-400 font-normal">of 10 GB used</span>
            </span>
          </div>

          {/* Progress Bar with Percentage */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: '24%' }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500 shrink-0">
              24%
            </span>
          </div>
        </div>

        <button
          onClick={onManageStorage}
          className="w-full py-2 px-4 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
        >
          Manage Storage
        </button>
      </div>

      {/* 3. Quick Actions Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 font-sans">
          Quick Actions
        </h3>

        <div className="space-y-1">
          {/* Export My Data */}
          <button
            onClick={onExportData}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Upload className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              <span>Export My Data</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
          </button>

          {/* Download My Data */}
          <button
            onClick={onDownloadData}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Download className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              <span>Download My Data</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
          </button>

          {/* Delete Account */}
          <button
            onClick={onDeleteAccount}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/60 text-slate-700 hover:text-rose-600 transition-colors text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="h-4 w-4 text-slate-400 group-hover:text-rose-500" />
              <span>Delete Account</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-rose-500" />
          </button>
        </div>
      </div>

      {/* 4. Need help? Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-blue-50/80 to-indigo-100/70 border border-indigo-100/90 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="space-y-3 max-w-[190px]">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Need help?
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Visit our Help Center for guides and support.
              </p>
            </div>

            <button
              onClick={onNavigateSupport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs border border-slate-200/80 transition-colors cursor-pointer"
            >
              <span>Go to Support</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </button>
          </div>

          {/* 3D Blue Orbital Sphere Graphic (Matching Reference Image) */}
          <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="w-16 h-16 drop-shadow-md">
              <defs>
                <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="40%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </radialGradient>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Back Ring Orbit */}
              <ellipse
                cx="32"
                cy="32"
                rx="26"
                ry="9"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="1.8"
                transform="rotate(-20 32 32)"
              />

              {/* Center Glow Sphere */}
              <circle cx="32" cy="32" r="11" fill="url(#sphereGrad)" />

              {/* Front Ring Orbit */}
              <ellipse
                cx="32"
                cy="32"
                rx="26"
                ry="9"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="2.2"
                strokeDasharray="45 25"
                transform="rotate(-20 32 32)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
