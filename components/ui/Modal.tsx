'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-10 transition-all duration-200 animate-scaleUp',
          maxWidths[maxWidth]
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between safe-pt">
            <div>
              {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
              {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
            </div>
            <IconButton
              icon={<X className="h-4 w-4" />}
              aria-label="Close modal"
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto safe-pb">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 safe-pb">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
