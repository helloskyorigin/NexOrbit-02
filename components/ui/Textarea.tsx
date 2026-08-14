'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, disabled, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-md transition-all duration-150 resize-y min-h-[80px]',
            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-600 font-medium">{error}</span>
        ) : hint ? (
          <span className="text-xs text-slate-500">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
