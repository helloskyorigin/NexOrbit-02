'use client';

export type MemoryCategory = 'People' | 'Preferences' | 'Projects' | 'Knowledge' | 'Decisions';

export type MemorySourceType =
  | 'gmail'
  | 'calendar'
  | 'notion'
  | 'drive'
  | 'meeting'
  | 'decision'
  | 'note'
  | 'slack'
  | 'manual';

export interface MemorySourceInfo {
  type: MemorySourceType;
  name: string;
  detail?: string;
  email?: string;
  url?: string;
  path?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  category: MemoryCategory;
  source: MemorySourceInfo;
  tag: string;
  timestamp: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier this week' | 'Older';
  dotColor?: 'blue' | 'green' | 'purple' | 'amber' | 'emerald';
  relatedPerson?: string;
  relatedPersonRole?: string;
  relatedProject?: string;
  relatedMemories?: { id: string; title: string; time: string; source: string }[];
  isPinned?: boolean;
  strength?: number; // 1-5 confidence/recall
  createdAt?: string;
  updatedAt?: string;
}

export interface ConnectedSourceStat {
  id: string;
  name: string;
  type: MemorySourceType;
  count: number;
  color: string;
}

export interface RecentPersonItem {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  initials: string;
  avatarColor?: string;
  avatarImage?: string;
  memoryCount: number;
}

export interface CategoryStat {
  category: MemoryCategory;
  count: number;
  iconName: string;
  color: string;
}

export interface MemorySettingsConfig {
  autoRememberContext: boolean;
  rememberConversations: boolean;
  rememberPreferences: boolean;
  rememberProjectContext: boolean;
  allowCrossAppContext: boolean;
  retentionPeriod: 'forever' | '1year' | '6months' | '90days';
}
