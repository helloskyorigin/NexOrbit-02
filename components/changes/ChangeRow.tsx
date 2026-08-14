'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Calendar as CalendarIcon, 
  FileText, 
  CheckSquare, 
  AtSign, 
  Code, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquareShare
} from 'lucide-react';
import { ChangeFeedItem } from './types';
import { SourceIcon } from './SourceIcon';
import { cn } from '../../lib/utils';
import Image from 'next/image';

export interface ChangeRowProps {
  item: ChangeFeedItem;
  onOpenDetailDrawer?: (item: ChangeFeedItem) => void;
  onAskNexorbit?: (item: ChangeFeedItem) => void;
  onToggleRead?: (id: string) => void;
}

export const ChangeRow: React.FC<ChangeRowProps> = ({
  item,
  onOpenDetailDrawer,
  onAskNexorbit,
  onToggleRead,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (item.iconType) {
      case 'mail':
        return <Mail className="h-5 w-5 text-indigo-600" />;
      case 'calendar':
        return <CalendarIcon className="h-5 w-5 text-blue-600" />;
      case 'doc':
        return <FileText className="h-5 w-5 text-emerald-600" />;
      case 'task':
        return <CheckSquare className="h-5 w-5 text-amber-600" />;
      case 'mention':
        return <AtSign className="h-5 w-5 text-blue-600" />;
      case 'code':
        return <Code className="h-5 w-5 text-purple-600" />;
      default:
        return <Mail className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getBadgeDotClass = () => {
    switch (item.badgeDotColor) {
      case 'purple':
        return 'bg-purple-500 ring-2 ring-white';
      case 'blue':
        return 'bg-blue-500 ring-2 ring-white';
      case 'emerald':
        return 'bg-emerald-500 ring-2 ring-white';
      case 'amber':
        return 'bg-amber-500 ring-2 ring-white';
      default:
        return 'bg-indigo-500 ring-2 ring-white';
    }
  };

  const getIconBgClass = () => {
    switch (item.iconType) {
      case 'mail':
        return 'bg-indigo-50/80 border-indigo-100/60';
      case 'calendar':
        return 'bg-blue-50/80 border-blue-100/60';
      case 'doc':
        return 'bg-emerald-50/80 border-emerald-100/60';
      case 'task':
        return 'bg-amber-50/80 border-amber-100/60';
      case 'mention':
        return 'bg-sky-50/80 border-sky-100/60';
      case 'code':
        return 'bg-purple-50/80 border-purple-100/60';
      default:
        return 'bg-slate-50 border-slate-200/60';
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Avoid expanding if clicking an action button specifically
    if ((e.target as HTMLElement).closest('button.direct-action')) return;
    setIsExpanded((prev) => !prev);
    if (!item.isRead && onToggleRead) {
      onToggleRead(item.id);
    }
  };

  return (
    <div
      id={`change-item-${item.id}`}
      onClick={handleRowClick}
      className={cn(
        "group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
        isExpanded
          ? "border-indigo-200/80 shadow-[0_4px_16px_rgba(79,70,229,0.06)] ring-1 ring-indigo-500/10"
          : "border-slate-100 hover:border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-xs"
      )}
    >
      {/* Unread indicator bar */}
      {!item.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500" />
      )}

      {/* Main Row Content */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4">
        {/* Left Icon Area */}
        <div className="relative shrink-0 mt-0.5">
          <div
            className={cn(
              "h-11 w-11 rounded-2xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105",
              getIconBgClass()
            )}
          >
            {getIcon()}
          </div>
          {/* Signal Indicator Dot */}
          <div
            className={cn(
              "absolute -top-1 -right-1 h-3 w-3 rounded-full",
              getBadgeDotClass()
            )}
          />
        </div>

        {/* Center Details */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight leading-snug">
              {item.title}
            </h3>
            {item.importance === 'important' && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                Actionable
              </span>
            )}
          </div>

          <p className="text-[13px] text-slate-500 font-normal mt-0.5 line-clamp-1 leading-relaxed">
            {item.contextSubtitle}
          </p>

          {/* Source badge */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
            <SourceIcon type={item.sourceId} className="h-3.5 w-3.5" />
            <span>{item.sourceName}</span>
          </div>
        </div>

        {/* Right Info: Time + Avatar + Chevron */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pt-0.5">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap block">
              {item.timestamp}
            </span>
          </div>

          {/* Avatar or Icon Indicator */}
          <div className="relative flex items-center justify-center">
            {item.personAvatar ? (
              <div className="relative h-7 w-7 rounded-full overflow-hidden ring-1 ring-slate-200/80 shrink-0">
                <Image
                  src={item.personAvatar}
                  alt={item.personName || 'User'}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-blue-500 ring-1 ring-white" />
              </div>
            ) : item.additionalPersonCount ? (
              <div className="flex -space-x-2 items-center">
                <div className="h-6 w-6 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center ring-2 ring-white">
                  +{item.additionalPersonCount}
                </div>
              </div>
            ) : item.iconType === 'calendar' ? (
              <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center ring-1 ring-blue-100">
                <CalendarIcon className="h-3.5 w-3.5" />
              </div>
            ) : item.iconType === 'task' ? (
              <div className="h-7 w-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center ring-1 ring-indigo-100">
                <CheckSquare className="h-3.5 w-3.5" />
              </div>
            ) : (
              <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center ring-1 ring-slate-200">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          {/* Arrow / Expand icon */}
          <div className="text-slate-400 group-hover:text-slate-700 transition-colors">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-indigo-600" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* AI Interpretation Accordion (Revealed on click) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="border-t border-slate-100/90 bg-gradient-to-b from-slate-50/50 to-indigo-50/20"
          >
            <div className="p-4 sm:p-5 space-y-4 text-xs">
              {/* WHAT CHANGED */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  WHAT CHANGED
                </div>
                <p className="text-slate-800 text-[13px] leading-relaxed font-medium">
                  {item.whatChanged}
                </p>
              </div>

              {/* WHY IT MATTERS */}
              <div className="space-y-1 bg-white/90 rounded-xl p-3.5 border border-indigo-100/80 shadow-[0_1px_2px_rgba(79,70,229,0.03)]">
                <div className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  WHY IT MATTERS
                </div>
                <p className="text-slate-700 text-[13px] leading-relaxed font-normal">
                  {item.whyItMatters}
                </p>
              </div>

              {/* RELATED CONTEXT BADGES */}
              {item.relatedContext && item.relatedContext.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    RELATED CONTEXT
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.relatedContext.map((ctx, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg text-slate-700 text-xs shadow-2xs font-medium"
                      >
                        <SourceIcon type={ctx.sourceId} className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{ctx.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WHAT YOU CAN DO / ACTIONS */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/50">
                <div className="flex items-center gap-2">
                  {item.recommendedAction && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDetailDrawer) onOpenDetailDrawer(item);
                      }}
                      className="direct-action flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{item.recommendedAction.label}</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenDetailDrawer) onOpenDetailDrawer(item);
                    }}
                    className="direct-action flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>View details</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </button>
                </div>

                {/* ASK NEXORBIT TRIGGER */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAskNexorbit) onAskNexorbit(item);
                  }}
                  className="direct-action flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  <MessageSquareShare className="h-3.5 w-3.5" />
                  <span>Ask NEXORBIT →</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
