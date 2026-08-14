'use client';

import React from 'react';
import { Sparkles, Bot, Globe, ChevronDown } from 'lucide-react';
import { AIMode } from './types';
import { cn } from '../../lib/utils';

export interface ModeSelectorProps {
  currentMode: AIMode;
  onChangeMode: (mode: AIMode) => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onChangeMode,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full max-w-2xl mx-auto flex items-center justify-center p-1 bg-slate-100/90 rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-3xs select-none',
        className
      )}
      role="radiogroup"
      aria-label="AI Intelligence Mode"
    >
      {/* 1. Auto Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'auto'}
        onClick={() => onChangeMode('auto')}
        className={cn(
          'flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-150 text-center flex items-center justify-center gap-2 cursor-pointer',
          currentMode === 'auto'
            ? 'bg-white text-indigo-700 shadow-sm font-semibold border border-indigo-100/80'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40 font-medium'
        )}
      >
        <Sparkles
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors',
            currentMode === 'auto' ? 'text-indigo-600 fill-indigo-100' : 'text-slate-400'
          )}
        />
        <span className="text-xs sm:text-[13px] tracking-tight">Auto</span>
      </button>

      {/* 2. NEXORBIT AI (General) */}
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'general'}
        onClick={() => onChangeMode('general')}
        className={cn(
          'flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-150 text-left flex items-center justify-center gap-2.5 cursor-pointer',
          currentMode === 'general'
            ? 'bg-white text-indigo-950 shadow-sm font-semibold border border-indigo-100/80'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40 font-medium'
        )}
      >
        <div className="shrink-0">
          <Bot
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              currentMode === 'general' ? 'text-indigo-600' : 'text-slate-400'
            )}
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-[13px] tracking-tight font-semibold">
              NEXORBIT AI
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
          </div>
          <span className="hidden sm:block text-[10px] text-slate-400 leading-none">
            General AI
          </span>
        </div>
      </button>

      {/* 3. My Connected World */}
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'connected'}
        onClick={() => onChangeMode('connected')}
        className={cn(
          'flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all duration-150 text-left flex items-center justify-center gap-2.5 cursor-pointer',
          currentMode === 'connected'
            ? 'bg-white text-indigo-950 shadow-sm font-semibold border border-indigo-100/80'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40 font-medium'
        )}
      >
        <div className="shrink-0">
          <Globe
            className={cn(
              'h-3.5 w-3.5 transition-colors',
              currentMode === 'connected' ? 'text-indigo-600' : 'text-slate-400'
            )}
          />
        </div>
        <div className="min-w-0">
          <span className="text-xs sm:text-[13px] tracking-tight font-semibold block">
            My Connected World
          </span>
          <span className="hidden sm:block text-[10px] text-slate-400 leading-none">
            Use my data & apps
          </span>
        </div>
      </button>
    </div>
  );
};
