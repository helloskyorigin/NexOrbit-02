'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { ChatMessage, SourceReference } from './types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface UserMessageProps {
  message: ChatMessage;
  userInitial?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  userInitial = 'S',
}) => {
  return (
    <div className="flex items-start justify-end gap-3 w-full animate-fadeIn select-text">
      {/* Message bubble */}
      <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-tr-md bg-[#eef2ff]/90 border border-indigo-100/70 text-slate-900 px-5 py-3.5 shadow-3xs text-[14.5px] leading-relaxed">
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div className="mt-1 flex items-center justify-end text-[11px] text-slate-400 font-medium">
          <span>{message.timestamp}</span>
        </div>
      </div>

      {/* User Avatar */}
      <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center justify-center shrink-0 shadow-xs select-none">
        {userInitial}
      </div>
    </div>
  );
};

export interface AssistantMessageProps {
  message: ChatMessage;
  onOpenDocument?: (docTitle: string) => void;
  onOpenSource?: (source: SourceReference) => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  onOpenDocument,
  onOpenSource,
}) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      description: 'AI response text copied successfully.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (isPositive: boolean) => {
    setLiked(isPositive);
    addToast({
      type: 'info',
      title: isPositive ? 'Feedback Received' : 'Feedback Logged',
      description: isPositive
        ? 'Thank you for your feedback!'
        : 'Thanks! We will refine future responses.',
    });
  };

  return (
    <div className="flex items-start gap-3.5 w-full animate-fadeIn">
      {/* Planetary Orbital AI Icon */}
      <div className="relative shrink-0 mt-1 select-none">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="h-4 w-4 fill-white/20" />
        </div>
        {/* Orbital Ring Simulation */}
        <div className="absolute -inset-1 rounded-full border border-indigo-300/40 pointer-events-none scale-110 -rotate-12" />
      </div>

      {/* AI Card Content */}
      <div className="flex-1 min-w-0">
        <div className="rounded-3xl bg-white border border-slate-200/70 shadow-[0_4px_20px_rgba(15,23,42,0.03)] p-5 sm:p-6 space-y-4 select-text">
          {/* Text paragraphs */}
          <div className="text-[14.5px] text-slate-800 leading-relaxed space-y-3 font-normal">
            {message.text.split('\n\n').map((paragraph, idx) => {
              // Primary headline/opening
              if (idx === 0 && paragraph.startsWith("Here's")) {
                return (
                  <h3
                    key={idx}
                    className="text-[15.5px] font-bold text-slate-950 tracking-tight leading-snug"
                  >
                    {paragraph}
                  </h3>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h4
                    key={idx}
                    className="font-bold text-slate-950 text-sm pt-1"
                  >
                    {paragraph.replace('### ', '')}
                  </h4>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-line text-slate-700">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Embedded Document Card (if provided) */}
          {message.document && (
            <div className="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/70">
              <div className="flex items-center gap-3 min-w-0">
                {/* Red PDF Icon badge */}
                <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-200/70 flex flex-col items-center justify-center shrink-0 text-red-600 shadow-3xs">
                  <FileText className="h-4 w-4" />
                  <span className="text-[9px] font-extrabold uppercase tracking-tight leading-none mt-0.5">
                    PDF
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-950 truncate">
                    {message.document.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {message.document.source} • {message.document.updatedAt}
                  </p>
                </div>
              </div>

              {/* Open button */}
              <button
                type="button"
                onClick={() =>
                  onOpenDocument
                    ? onOpenDocument(message.document!.title)
                    : addToast({
                        type: 'info',
                        title: 'Opening Document',
                        description: `Viewing ${message.document!.title}`,
                      })
                }
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all shadow-3xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <span>Open</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </button>
            </div>
          )}

          {/* Key Highlights Bullet Section */}
          {message.highlights && message.highlights.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs sm:text-[13px] font-bold text-slate-950">
                Key highlights
              </h4>
              <ul className="space-y-1.5 pl-1">
                {message.highlights.map((hl, hIdx) => (
                  <li
                    key={hIdx}
                    className="flex items-start gap-2.5 text-xs sm:text-[13.5px] text-slate-700 leading-snug"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800 shrink-0 mt-2" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Response Footer: Timestamp & Feedback Icons */}
          <div className="pt-2 border-t border-slate-100/90 flex items-center justify-between select-none">
            <span className="text-[11px] text-slate-400 font-medium">
              {message.timestamp}
            </span>

            <div className="flex items-center gap-1 text-slate-400">
              {/* Thumbs up */}
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className={cn(
                  'p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer',
                  liked === true ? 'text-indigo-600 bg-indigo-50' : 'hover:text-slate-700'
                )}
                title="Helpful response"
                aria-label="Thumbs up"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>

              {/* Thumbs down */}
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className={cn(
                  'p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer',
                  liked === false ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-700'
                )}
                title="Not helpful"
                aria-label="Thumbs down"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>

              {/* Copy */}
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy response"
                aria-label="Copy response"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3.5 w-full animate-fadeIn select-none">
      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
        <Sparkles className="h-4 w-4 animate-spin" />
      </div>

      <div className="rounded-3xl bg-white border border-slate-200/70 p-4 shadow-3xs flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          NEXORBIT is synthesizing...
        </span>
      </div>
    </div>
  );
};
