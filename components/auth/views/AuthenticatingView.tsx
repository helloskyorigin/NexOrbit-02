'use client';

import React from 'react';
import { NexOrbitLogo } from '../NexOrbitLogo';
import { useAuth } from '../AuthContext';

export const AuthenticatingView: React.FC = () => {
  const { t } = useAuth();

  return (
    <div className="py-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-3 rounded-full bg-slate-100 animate-pulse" />
          <NexOrbitLogo variant="mark" size="xl" animated className="text-slate-900 relative z-10" />
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <h2 className="text-lg font-semibold text-slate-950 tracking-tight">
          Signing you in...
        </h2>
        <p className="text-sm text-slate-500 font-normal leading-relaxed">
          Please wait while we securely sign you in.
        </p>
      </div>
    </div>
  );
};
