'use client';

import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export const AuthenticatingView: React.FC = () => {
  return (
    <div className="py-8 space-y-4 text-center">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs mx-auto">
        <Loader2 className="h-7 w-7 text-indigo-600 animate-spin" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Authenticating Session...
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Securing user credentials and initializing NEXOrbit context...
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>TLS 1.3 Encrypted Handshake</span>
      </div>
    </div>
  );
};
