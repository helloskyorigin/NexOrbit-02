'use client';

import React, { useRef, useEffect } from 'react';
import { Paperclip, Mic, ArrowUp, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ChatComposerProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onOpenAttach: () => void;
  onOpenVoice: () => void;
  isThinking?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  inputText,
  onChangeText,
  onSubmit,
  onOpenAttach,
  onOpenVoice,
  isThinking = false,
  placeholder = 'Ask anything or give a command...',
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height smoothly
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={cn('w-full flex flex-col items-center select-none', className)}>
      {/* Primary Composer Surface with subtle blue outline */}
      <form
        onSubmit={onSubmit}
        className="w-full rounded-3xl bg-white border-2 border-indigo-400/80 shadow-[0_4px_24px_rgba(99,102,241,0.08)] p-3 sm:p-4 space-y-2 transition-all focus-within:border-indigo-600 focus-within:shadow-[0_0_24px_rgba(99,102,241,0.18)]"
      >
        {/* Top section: Text input + subtle Sparkle icon on right */}
        <div className="relative flex items-start justify-between gap-2">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isThinking}
            className="w-full bg-transparent resize-none border-none outline-none text-xs sm:text-[14px] text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed min-h-[36px] max-h-[140px] px-1 focus:ring-0 select-text disabled:opacity-50"
          />
          <span className="text-indigo-500 shrink-0 mt-0.5 text-xs">✦</span>
        </div>

        {/* Bottom controls row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Left: Attach & Voice pill buttons */}
          <div className="flex items-center gap-2">
            {/* Attach button */}
            <button
              type="button"
              onClick={onOpenAttach}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-3xs transition-colors cursor-pointer"
            >
              <Paperclip className="h-3.5 w-3.5 text-slate-500" />
              <span>Attach</span>
            </button>

            {/* Voice button */}
            <button
              type="button"
              onClick={onOpenVoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-3xs transition-colors cursor-pointer"
            >
              <Mic className="h-3.5 w-3.5 text-slate-500" />
              <span>Voice</span>
            </button>
          </div>

          {/* Right: Blue Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className={cn(
              'h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer shrink-0',
              inputText.trim() && !isThinking && 'hover:shadow-lg hover:shadow-blue-600/25'
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Safety / Verification disclaimer underneath */}
      <p className="text-[11px] text-slate-400 text-center mt-2.5">
        NEXORBIT can make mistakes. Please verify important information.
      </p>
    </div>
  );
};
