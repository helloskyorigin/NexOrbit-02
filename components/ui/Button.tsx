'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isSpinnerActive = isLoading || loading;

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 border border-slate-900',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80',
      outline:
        'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 border border-slate-200/80 shadow-xs',
      ghost:
        'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
      destructive:
        'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800',
      danger:
        'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-9 px-4 text-xs gap-2 rounded-xl',
      lg: 'h-11 px-5 text-sm gap-2.5 rounded-xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isSpinnerActive}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isSpinnerActive ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-current shrink-0" />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!isSpinnerActive && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
