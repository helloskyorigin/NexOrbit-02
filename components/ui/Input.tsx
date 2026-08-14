'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full h-10 px-3 py-2 text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-md transition-all duration-150',
              'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-slate-400 flex items-center">{rightIcon}</div>
          )}
        </div>
        {error ? (
          <span className="text-xs text-red-600 font-medium">{error}</span>
        ) : hint ? (
          <span className="text-xs text-slate-500">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
