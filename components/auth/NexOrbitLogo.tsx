'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface NexOrbitLogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  textColor?: string;
}

export const NexOrbitLogo: React.FC<NexOrbitLogoProps> = ({
  variant = 'full',
  size = 'md',
  animated = false,
  className,
  textColor = 'text-slate-950',
}) => {
  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };

  const textSizes = {
    sm: 'text-xs tracking-[0.22em]',
    md: 'text-sm tracking-[0.24em]',
    lg: 'text-base tracking-[0.26em]',
    xl: 'text-lg tracking-[0.28em]',
  };

  const OrbitIcon = (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        iconSizes[size],
        'shrink-0 select-none transition-transform duration-500',
        animated && 'animate-spin [animation-duration:8s]',
        className
      )}
    >
      {/* Outer subtle orbit path */}
      <ellipse
        cx="16"
        cy="16"
        rx="13.5"
        ry="6.5"
        transform="rotate(-28 16 16)"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="text-slate-900"
      />
      {/* Planetary Sphere in Center */}
      <circle
        cx="16"
        cy="16"
        r="4.25"
        className="fill-slate-950"
      />
      {/* Orbiting Satellite Node */}
      <circle
        cx="25.5"
        cy="11"
        r="2"
        className="fill-slate-900"
      />
    </svg>
  );

  if (variant === 'mark') {
    return OrbitIcon;
  }

  if (variant === 'wordmark') {
    return (
      <span className={cn('font-semibold uppercase font-sans select-none', textSizes[size], textColor)}>
        N E X O R B I T
      </span>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      {OrbitIcon}
      <span className={cn('font-bold uppercase font-sans tracking-[0.24em]', textSizes[size], textColor)}>
        NEXORBIT
      </span>
    </div>
  );
};
