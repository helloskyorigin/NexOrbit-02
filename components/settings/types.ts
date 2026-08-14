export type SettingsTabId =
  | 'general'
  | 'ai-brain'
  | 'data-privacy'
  | 'connected-apps'
  | 'notifications'
  | 'interface'
  | 'shortcuts'
  | 'billing'
  | 'advanced';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  nexorbitId: string;
  memberSince: string;
  avatarUrl: string;
  bio?: string;
  timezone?: string;
}

export interface GeneralPreferences {
  language: string;
  theme: 'light';
  startupView: string;
  timezone: string;
  dateFormat: string;
}

export interface AIBrainPreferences {
  model: 'gemini-3.5-flash' | 'gemini-3.5-pro' | 'gemini-ultra-reasoning';
  reasoningLevel: 'balanced' | 'deep' | 'instant';
  proactiveSuggestions: boolean;
  contextWindow: number; // in tokens/items
  customPersona: string;
  autoExtractEntities: boolean;
}

export interface PrivacyPreferences {
  zeroTraining: boolean;
  localVectorEncryption: boolean;
  retentionDays: number;
  telemetryConsent: boolean;
  autoPurgeHistory: boolean;
}

export interface NotificationPreferences {
  dailyDigest: boolean;
  digestTime: string;
  calendarAlerts: boolean;
  urgentConflicts: boolean;
  emailNotifications: boolean;
  weeklyInsights: boolean;
}
