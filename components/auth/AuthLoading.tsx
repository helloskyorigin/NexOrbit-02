'use client';

import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export const AuthLoading: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50/60 flex flex-col justify-center items-center p-4 antialiased select-none">
      <div className="space-y-4 text-center max-w-sm mx-auto">
        {/* NEXOrbit Brand Badge */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-2xs">
            N
          </div>
          <span className="font-sans font-extrabold text-lg tracking-tight text-slate-900">
            NEXORBIT
          </span>
        </div>

        {/* Loading Spinner Box */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Initializing Session
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verifying workspace authorization...
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>NEXOrbit Zero-Trust Auth Gate</span>
        </div>
      </div>
    </div>
  );
};
