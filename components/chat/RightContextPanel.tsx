'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Share2,
  Calendar,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { SourceReference, ChatAction, MemoryContextData } from './types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface RightContextPanelProps {
  sources?: SourceReference[];
  actions?: ChatAction[];
  memory?: MemoryContextData;
  onNavigateToMemory?: () => void;
  onOpenSource?: (source: SourceReference) => void;
  onExecuteAction?: (action: ChatAction) => void;
  onCreateWatch?: () => void;
  className?: string;
}

export const RightContextPanel: React.FC<RightContextPanelProps> = ({
  sources = [],
  actions = [],
  memory,
  onNavigateToMemory,
  onOpenSource,
  onExecuteAction,
  onCreateWatch,
  className,
}) => {
  const { addToast } = useToast();
  const [showAllSources, setShowAllSources] = useState(false);

  // Default fallback sources if none passed
  const displaySources = sources.length > 0 ? sources : [
    {
      id: 'src-drive-1',
      connector: 'drive' as const,
      connectorName: 'Google Drive',
      title: 'proposal_v2.3.pdf',
      iconType: 'drive' as const,
    },
    {
      id: 'src-gmail-1',
      connector: 'gmail' as const,
      connectorName: 'Gmail',
      title: 'Re: Project Alpha Proposal',
      iconType: 'gmail' as const,
    },
    {
      id: 'src-notion-1',
      connector: 'notion' as const,
      connectorName: 'Notion',
      title: 'Project Alpha Hub',
      iconType: 'notion' as const,
    },
    {
      id: 'src-cal-1',
      connector: 'calendar' as const,
      connectorName: 'Calendar',
      title: 'Project Alpha Review Meeting',
      iconType: 'calendar' as const,
    },
  ];

  const visibleSources = showAllSources ? displaySources : displaySources.slice(0, 3);

  const getSourceIcon = (type?: string) => {
    switch (type) {
      case 'drive':
        return (
          <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M8.2 2l-6 10.4 4.1 7.1 6-10.4-4.1-7.1zm7.6 0h-8.2l4.1 7.1h8.2l-4.1-7.1zm2.3 8.3l-4.1 7.1h8.2l4.1-7.1h-8.2z" />
            </svg>
          </div>
        );
      case 'gmail':
        return (
          <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
        );
      case 'notion':
        return (
          <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 font-serif font-bold text-xs">
            N
          </div>
        );
      default:
        return (
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
        );
    }
  };

  const defaultActions: ChatAction[] = actions.length > 0 ? actions : [
    { id: 'act-drive', label: 'Open in Drive', actionType: 'open_source' },
    { id: 'act-share', label: 'Share', actionType: 'share' },
    { id: 'act-notion', label: 'Add to Notion', actionType: 'add_to_notion' },
    { id: 'act-task', label: 'Create follow-up task', actionType: 'create_task' },
  ];

  return (
    <aside
      className={cn(
        'w-full lg:w-[300px] xl:w-[330px] shrink-0 flex flex-col space-y-6 select-none',
        className
      )}
    >
      {/* 1. SOURCES SECTION */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-950 tracking-tight">
          Sources
        </h3>

        <div className="space-y-2">
          {visibleSources.map((src) => (
            <button
              key={src.id}
              type="button"
              onClick={() => {
                if (onOpenSource) {
                  onOpenSource(src);
                } else {
                  addToast({
                    type: 'info',
                    title: `Viewing ${src.connectorName}`,
                    description: `Opened source: ${src.title}`,
                  });
                }
              }}
              className="w-full p-3 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/70 text-left flex items-center justify-between gap-3 transition-all shadow-3xs hover:shadow-xs group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getSourceIcon(src.iconType || (src.connector as string))}
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-indigo-900">
                    {src.connectorName}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {src.title}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}

          {/* Show all sources toggle */}
          {displaySources.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllSources(!showAllSources)}
              className="w-full pt-1 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>
                {showAllSources
                  ? 'Show fewer sources'
                  : `Show all ${displaySources.length} sources`}
              </span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-150',
                  showAllSources && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* 2. ACTIONS SECTION */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-950 tracking-tight">
          Actions
        </h3>

        <div className="space-y-2">
          {defaultActions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                if (onExecuteAction) {
                  onExecuteAction(act);
                } else {
                  addToast({
                    type: 'success',
                    title: 'Action Triggered',
                    description: `Executed: ${act.label}`,
                  });
                }
              }}
              className="w-full p-3 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/70 text-left flex items-center justify-between gap-3 transition-all shadow-3xs hover:shadow-xs group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {act.actionType === 'open_source' ? (
                  <div className="h-6 w-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ExternalLink className="h-3 w-3" />
                  </div>
                ) : act.actionType === 'share' ? (
                  <div className="h-6 w-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Share2 className="h-3 w-3" />
                  </div>
                ) : act.actionType === 'add_to_notion' ? (
                  <div className="h-6 w-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-[10px]">
                    N
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CheckSquare className="h-3 w-3" />
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900">
                  {act.label}
                </span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. MEMORY SECTION */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-950 tracking-tight">
          Memory
        </h3>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-3xs space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            {memory?.text ||
              'You asked about Project Alpha proposal 3 times this week.'}
          </p>

          <button
            type="button"
            onClick={() => {
              if (onNavigateToMemory) {
                onNavigateToMemory();
              } else {
                addToast({
                  type: 'info',
                  title: 'Memory Context',
                  description: 'Opening workspace memory overview.',
                });
              }
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50/80 text-indigo-600 hover:text-indigo-800 text-xs font-semibold text-center border border-slate-200/80 transition-colors cursor-pointer"
          >
            {memory?.actionText || 'View related memories'}
          </button>
        </div>
      </div>

      {/* 4. "Working on something important?" PROMO CARD */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#eff4ff] via-[#f5f3ff] to-[#eef2ff] border border-indigo-100/90 p-5 shadow-3xs overflow-hidden">
        {/* Orbital Sphere Graphic in Background */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Glowing Orb */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-white/60 blur-[1px]" />
            </div>
            {/* Orbit Rings */}
            <div className="absolute inset-0 rounded-full border border-indigo-400/40 scale-125 -rotate-45" />
            <div className="absolute inset-1 rounded-full border border-purple-400/30 scale-90 rotate-12" />
          </div>
        </div>

        <div className="relative z-10 max-w-[190px] space-y-1.5">
          <h4 className="text-xs sm:text-[13px] font-bold text-slate-950 leading-snug">
            Working on something important?
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed pb-2">
            Let NEXORBIT proactively track updates for you.
          </p>

          <button
            type="button"
            onClick={() => {
              if (onCreateWatch) {
                onCreateWatch();
              } else {
                addToast({
                  type: 'success',
                  title: 'Proactive Watch Created',
                  description: 'NEXORBIT will alert you whenever Project Alpha changes.',
                });
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 text-xs font-semibold shadow-3xs transition-all active:scale-95 cursor-pointer"
          >
            Create a Watch
          </button>
        </div>
      </div>
    </aside>
  );
};
