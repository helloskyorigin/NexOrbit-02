'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'soft';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      title,
      subtitle,
      description,
      action,
      variant = 'default',
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white border border-slate-200/80 shadow-sm',
      elevated: 'bg-white border border-slate-200/80 shadow-md',
      bordered: 'bg-white border border-slate-200',
      soft: 'bg-slate-50/80 border border-slate-200/60',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-5',
      lg: 'p-6 sm:p-8',
    };

    const subText = subtitle || description;

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl transition-all duration-150', variants[variant], paddings[padding], className)}
        {...props}
      >
        {(title || subText || action) && (
          <div className="flex items-start justify-between gap-3 mb-3.5 pb-2 border-b border-slate-100">
            <div>
              {title && <h3 className="text-xs font-semibold text-slate-900">{title}</h3>}
              {subText && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{subText}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
