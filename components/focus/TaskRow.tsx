'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  FileText,
  Coffee,
  Users,
  Video,
  ExternalLink,
  Send,
  MoreVertical,
  Check,
  Sparkles,
  Clock,
} from 'lucide-react';
import { DailyPlanItem } from './types';
import { ConnectorIcon } from '../connectors/ConnectorIcon';
import { cn } from '../../lib/utils';

export interface TaskRowProps {
  item: DailyPlanItem;
  isFirst?: boolean;
  isLast?: boolean;
  isHighlighted?: boolean;
  onActionClick: (item: DailyPlanItem) => void;
  onCompleteToggle: (id: string) => void;
  onWhyClick: (item: DailyPlanItem) => void;
  onAskNexorbit: (item: DailyPlanItem) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  item,
  isFirst = false,
  isLast = false,
  isHighlighted = false,
  onActionClick,
  onCompleteToggle,
  onWhyClick,
  onAskNexorbit,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pick leading icon based on type / theme
  const renderItemIcon = () => {
    switch (item.type) {
      case 'meeting':
        return (
          <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        );
      case 'email':
        if (item.actionType === 'send_email') {
          return (
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Users className="h-5 w-5" />
            </div>
          );
        }
        return (
          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <CheckSquare className="h-5 w-5" />
          </div>
        );
      case 'document':
        return (
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <FileText className="h-5 w-5" />
          </div>
        );
      case 'break':
        return (
          <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Coffee className="h-5 w-5" />
          </div>
        );
      case 'notes':
        return (
          <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <CheckSquare className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <CheckSquare className="h-5 w-5" />
          </div>
        );
    }
  };

  // Node dot color
  const getNodeColorClass = () => {
    switch (item.colorTheme) {
      case 'purple':
        return 'bg-purple-600 ring-purple-100';
      case 'blue':
        return 'bg-blue-600 ring-blue-100';
      case 'emerald':
        return 'bg-emerald-600 ring-emerald-100';
      case 'amber':
        return 'bg-amber-500 ring-amber-100';
      case 'indigo':
        return 'bg-indigo-600 ring-indigo-100';
      default:
        return 'bg-slate-500 ring-slate-100';
    }
  };

  // Action button icon
  const renderActionIcon = () => {
    switch (item.actionType) {
      case 'join_meeting':
        return <Video className="h-4 w-4 text-indigo-600" />;
      case 'take_break':
        return <Coffee className="h-4 w-4 text-amber-600" />;
      case 'send_email':
        return <Send className="h-4 w-4 text-indigo-600" />;
      default:
        return <ExternalLink className="h-3.5 w-3.5 text-indigo-600" />;
    }
  };

  // Priority indicator
  const renderPriorityBadge = () => {
    if (item.priority === 'important') {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-rose-600">
          Important
        </span>
      );
    }
    if (item.priority === 'high') {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-amber-600">
          High priority
        </span>
      );
    }
    if (item.priority === 'medium') {
      return (
        <span className="inline-flex items-center text-xs font-semibold text-amber-700/90">
          Medium priority
        </span>
      );
    }
    return null;
  };

  return (
    <div
      id={`plan-item-${item.id}`}
      className={cn(
        'relative flex items-start gap-4 sm:gap-6 group transition-all duration-300',
        item.isCompleted && 'opacity-60',
        isHighlighted && 'scale-[1.01]'
      )}
    >
      {/* Left Time Column */}
      <div className="w-16 sm:w-20 pt-3.5 text-right shrink-0">
        <div className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight">
          {item.time}
        </div>
        <div className="text-[11px] text-slate-600 font-medium">{item.duration}</div>
      </div>

      {/* Middle Vertical Spine & Circular Node */}
      <div className="relative flex flex-col items-center self-stretch shrink-0">
        {/* Top spine connection */}
        <div
          className={cn(
            'w-px bg-slate-200 grow',
            isFirst ? 'opacity-0' : 'opacity-100'
          )}
        />
        {/* Node Circle */}
        <div
          className={cn(
            'h-2.5 w-2.5 rounded-full ring-4 transition-transform group-hover:scale-125 shrink-0 my-1',
            getNodeColorClass()
          )}
        />
        {/* Bottom spine connection */}
        <div
          className={cn(
            'w-px bg-slate-200 grow',
            isLast ? 'opacity-0' : 'opacity-100'
          )}
        />
      </div>

      {/* Main Content Card */}
      <div
        className={cn(
          'flex-1 min-w-0 bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 mb-4 shadow-sm hover:shadow-md hover:border-slate-300/80 relative',
          isHighlighted
            ? 'border-indigo-400/80 ring-2 ring-indigo-500/20 bg-indigo-50/10'
            : 'border-slate-200/80',
          item.isCompleted && 'bg-slate-50/60 border-slate-200'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main Info */}
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Leading Icon */}
            {renderItemIcon()}

            {/* Title, Subtitle, Badges */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    'text-sm sm:text-base font-semibold text-slate-900 truncate tracking-tight',
                    item.isCompleted && 'line-through text-slate-500'
                  )}
                >
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 line-clamp-1">
                {item.description}
              </p>

              {/* Source & Priority Row */}
              <div className="flex items-center flex-wrap gap-2.5 mt-2.5">
                {item.sourceId && item.sourceName && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <ConnectorIcon id={item.sourceId} size="sm" />
                    <span className="font-medium text-slate-700">{item.sourceName}</span>
                  </div>
                )}

                {renderPriorityBadge()}
              </div>
            </div>
          </div>

          {/* Right Action Button & Menu */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => onActionClick(item)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/70 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {renderActionIcon()}
              <span>{item.actionLabel}</span>
            </button>

            {/* Overflow menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200/80 p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        onCompleteToggle(item.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{item.isCompleted ? 'Mark incomplete' : 'Mark as complete'}</span>
                    </button>
                    <button
                      onClick={() => {
                        onWhyClick(item);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Why this priority?</span>
                    </button>
                    <button
                      onClick={() => {
                        onAskNexorbit(item);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-indigo-600 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <span>Ask NEXORBIT →</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
