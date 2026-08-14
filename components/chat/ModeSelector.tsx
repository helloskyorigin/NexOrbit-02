'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, Globe, ChevronDown, Check } from 'lucide-react';
import { AIMode, AI_MODES } from './types';
import { cn } from '../../lib/utils';

export interface ModeSelectorProps {
  currentMode: AIMode;
  onChangeMode: (mode: AIMode) => void;
  variant?: 'compact' | 'pill' | 'header';
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onChangeMode,
  variant = 'compact',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = AI_MODES.find((m) => m.id === currentMode) || AI_MODES[0];

  const getModeIcon = (mode: AIMode, iconClass = 'h-3.5 w-3.5') => {
    switch (mode) {
      case 'general':
        return <Bot className={cn(iconClass, 'text-purple-600')} />;
      case 'connected':
        return <Globe className={cn(iconClass, 'text-indigo-600')} />;
      case 'auto':
      default:
        return <Sparkles className={cn(iconClass, 'text-indigo-600')} />;
    }
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left select-none', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-1.5 transition-all duration-150 cursor-pointer',
          variant === 'compact'
            ? 'px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
            : variant === 'header'
            ? 'px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-3xs'
            : 'px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/70 shadow-3xs'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={currentOption.description}
      >
        <span className="shrink-0">{getModeIcon(currentMode, 'h-3 w-3 sm:h-3.5 sm:w-3.5')}</span>
        <span className="truncate max-w-[120px]">{currentOption.label}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-slate-400 transition-transform duration-150 shrink-0',
            isOpen && 'rotate-180 text-indigo-600'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 w-72 rounded-2xl bg-white border border-indigo-100 shadow-[0_12px_36px_rgba(15,23,42,0.12)] p-1.5 z-50 animate-scaleUp focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2.5 py-1.5 border-b border-slate-100/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Intelligence Mode
            </span>
          </div>

          <div className="py-1 space-y-1">
            {AI_MODES.map((option) => {
              const isSelected = option.id === currentMode;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChangeMode(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer group',
                    isSelected
                      ? 'bg-indigo-50/90 text-indigo-950 font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                  role="menuitem"
                >
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={cn(
                        'h-6 w-6 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100 group-hover:bg-white'
                      )}
                    >
                      {getModeIcon(option.id, 'h-3.5 w-3.5')}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-xs font-bold',
                          isSelected ? 'text-indigo-900' : 'text-slate-900'
                        )}
                      >
                        {option.label}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
