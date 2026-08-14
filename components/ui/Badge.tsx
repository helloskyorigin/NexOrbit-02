'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'accent'
  | 'indigo'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-800 border-slate-200/80',
    secondary: 'bg-slate-200 text-slate-900 border-slate-300',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-slate-400',
    secondary: 'bg-slate-600',
    accent: 'bg-indigo-500',
    indigo: 'bg-indigo-500',
    info: 'bg-sky-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    outline: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-medium',
    md: 'px-2.5 py-0.5 text-xs font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        sizeClasses[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
