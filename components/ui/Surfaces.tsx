'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassSurface: React.FC<SurfaceProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SoftSurface: React.FC<SurfaceProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-slate-100/70 border border-slate-200/60 rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
