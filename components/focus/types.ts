import { ConnectorId } from '../connectors/types';

export type PriorityLevel = 'important' | 'high' | 'medium' | 'low';

export type PlanItemType = 'meeting' | 'task' | 'document' | 'break' | 'notes' | 'email';

export interface DailyPlanItem {
  id: string;
  time: string;
  period?: 'AM' | 'PM';
  duration: string;
  durationMinutes: number;
  title: string;
  description: string;
  sourceId?: ConnectorId;
  sourceName?: string;
  priority: PriorityLevel;
  type: PlanItemType;
  actionLabel: string;
  actionType: 'join_meeting' | 'open_email' | 'open_file' | 'take_break' | 'open_notes' | 'send_email' | 'review_task';
  actionUrl?: string;
  isCompleted?: boolean;
  colorTheme?: 'purple' | 'blue' | 'emerald' | 'amber' | 'indigo' | 'slate';
  whyPrioritized?: string;
  contextEvidence?: {
    source: string;
    snippet: string;
    timestamp: string;
  }[];
}

export type CleanMyDayTab = 'daily-plan' | 'time-blocks' | 'tasks' | 'focus-time';

export type EnergyLevel = 'low' | 'okay' | 'good' | 'great' | 'amazing';

export interface PrioritySettings {
  deadlineSensitive: boolean;
  meetingsAndCollab: boolean;
  clientWork: boolean;
  deepWorkBias: boolean;
  quickWins: boolean;
}
