'use client';

import React from 'react';
import { Bell, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { NotificationPreferences } from '../types';
import { cn } from '../../../lib/utils';

export interface NotificationsTabProps {
  preferences: NotificationPreferences;
  onChange: (updated: Partial<NotificationPreferences>) => void;
  className?: string;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  preferences,
  onChange,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Notifications
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Configure alerts, meeting reminders, and email updates.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-5 text-xs">
        {/* Important Changes */}
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="space-y-0.5">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span>Important Changes</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Get notified when connected app permissions or critical settings change
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChange({ importantChanges: !preferences.importantChanges })}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              preferences.importantChanges ? 'bg-blue-600' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                preferences.importantChanges ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Meeting Reminders */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <div className="space-y-0.5">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Meeting Reminders</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Receive smart prep briefings 10 minutes before calendar events
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChange({ meetingReminders: !preferences.meetingReminders })}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              preferences.meetingReminders ? 'bg-blue-600' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                preferences.meetingReminders ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* AI Updates */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <div className="space-y-0.5">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>AI Updates & Proactive Insights</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Digest notifications when NEXORBIT detects unread action items
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChange({ aiUpdates: !preferences.aiUpdates })}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              preferences.aiUpdates ? 'bg-blue-600' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                preferences.aiUpdates ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
