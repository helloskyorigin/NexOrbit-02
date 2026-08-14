'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ButtonVariant, ButtonSize } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon: React.ReactNode;
  label?: string;
  'aria-label'?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      icon,
      label,
      'aria-label': ariaLabel,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const accessibleLabel = ariaLabel || label || 'Action button';

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl shrink-0';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 border border-slate-900',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80',
      outline: 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/80 shadow-xs',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      destructive: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
      danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 w-8 text-xs rounded-lg',
      md: 'h-9 w-9 text-xs rounded-xl',
      lg: 'h-11 w-11 text-sm rounded-xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-label={accessibleLabel}
        title={accessibleLabel}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-current" /> : icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
