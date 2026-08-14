'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, ArrowRight, AlertTriangle, Clock, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface FocusItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'info';
  sources?: Array<{ name: string; icon: React.ReactNode }>;
  actionLabel: string;
}

export interface TodayFocusProps {
  onItemAction?: (item: FocusItem) => void;
  className?: string;
}

export const TodayFocus: React.FC<TodayFocusProps> = ({ onItemAction, className }) => {
  const items: FocusItem[] = [
    {
      id: 'deadline-conflict',
      title: 'Deadline conflict detected',
      description: 'Project Alpha has different dates across your connected sources.',
      priority: 'high',
      sources: [
        { name: 'Gmail', icon: <Mail className="h-3 w-3 text-red-500" /> },
        { name: 'Calendar', icon: <Calendar className="h-3 w-3 text-blue-500" /> },
        { name: 'Drive', icon: <HardDrive className="h-3 w-3 text-amber-500" /> },
      ],
      actionLabel: 'Review',
    },
    {
      id: 'no-reply',
      title: "Client hasn't replied",
      description: "Rahul hasn't replied to your recent Project Alpha conversation.",
      priority: 'medium',
      actionLabel: 'Open',
    },
    {
      id: 'meeting-sync',
      title: 'Meeting tomorrow',
      description: 'Project Alpha sync at 10:00 AM.',
      priority: 'info',
      actionLabel: 'Prepare',
    },
  ];

  return (
    <Card
      title="Today's Focus"
      description="Things that may need your attention."
      className={className}
    >
      <div className="space-y-3 mt-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full shrink-0',
                    item.priority === 'high' && 'bg-amber-500 ring-2 ring-amber-100',
                    item.priority === 'medium' && 'bg-indigo-500',
                    item.priority === 'info' && 'bg-sky-500'
                  )}
                />
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-4">{item.description}</p>

              {item.sources && item.sources.length > 0 && (
                <div className="flex items-center gap-2 pl-4 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-medium">Sources:</span>
                  <div className="flex items-center gap-1.5">
                    {item.sources.map((src, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600 font-medium"
                      >
                        {src.icon}
                        <span>{src.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sm:self-center shrink-0 pl-4 sm:pl-0">
              <Button
                variant={item.priority === 'high' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onItemAction?.(item)}
                rightIcon={<ArrowRight className="h-3 w-3" />}
                className="h-8 text-xs font-semibold"
              >
                {item.actionLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
