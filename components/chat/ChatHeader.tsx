'use client';

import React, { useState } from 'react';
import { History, Star, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface ChatHeaderProps {
  onOpenHistory: () => void;
  onNavigateHome?: () => void;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onOpenHistory,
  onNavigateHome,
  className,
}) => {
  const { addToast } = useToast();
  const [isStarred, setIsStarred] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const toggleStar = () => {
    const nextState = !isStarred;
    setIsStarred(nextState);
    addToast({
      type: nextState ? 'success' : 'info',
      title: nextState ? 'Conversation Starred' : 'Star Removed',
      description: nextState
        ? 'Added this conversation to your favorites.'
        : 'Removed conversation from favorites.',
    });
  };

  return (
    <div
      className={cn(
        'w-full flex items-center justify-between pb-4 pt-1 select-none',
        className
      )}
    >
      {/* Left: Title & Subtitle */}
      <div className="flex items-center gap-3">
        {onNavigateHome && (
          <button
            type="button"
            onClick={onNavigateHome}
            className="md:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight leading-tight">
            Chat
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
            Your AI workspace
          </p>
        </div>
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 relative">
        {/* History / Clock button */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/90 transition-colors cursor-pointer"
          title="Conversation history"
          aria-label="Conversation history"
        >
          <History className="h-4 w-4" />
        </button>

        {/* Favorite / Star button */}
        <button
          type="button"
          onClick={toggleStar}
          className={cn(
            'p-2 sm:p-2.5 rounded-xl transition-colors cursor-pointer',
            isStarred
              ? 'text-amber-500 bg-amber-50/80 hover:bg-amber-100/80'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/90'
          )}
          title={isStarred ? 'Unstar conversation' : 'Star conversation'}
          aria-label="Star conversation"
        >
          <Star className={cn('h-4 w-4', isStarred && 'fill-amber-400')} />
        </button>

        {/* More Options Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100/90 transition-colors cursor-pointer"
            title="More options"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMoreMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.12)] p-1.5 z-40 animate-fadeIn"
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  addToast({
                    type: 'info',
                    title: 'Export Chat',
                    description: 'Conversation summary generated in Markdown.',
                  });
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Export conversation
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  addToast({
                    type: 'info',
                    title: 'Workspace Memory',
                    description: 'Context synchronized with NEXORBIT Memory.',
                  });
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Sync with Memory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
