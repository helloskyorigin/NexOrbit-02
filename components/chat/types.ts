export type AIMode = 'auto' | 'general' | 'connected';

export interface AIModeOption {
  id: AIMode;
  label: string;
  shortLabel: string;
  description: string;
}

export const AI_MODES: AIModeOption[] = [
  {
    id: 'auto',
    label: 'Auto',
    shortLabel: 'Auto',
    description: 'NexOrbit decides whether connected-app context is needed',
  },
  {
    id: 'general',
    label: 'NexOrbit AI',
    shortLabel: 'General AI',
    description: 'General AI conversation without connector search',
  },
  {
    id: 'connected',
    label: 'My Connected World',
    shortLabel: 'Connected World',
    description: 'Explicitly search connected apps, workspace files, and memory',
  },
];

export type ConnectorType = 'gmail' | 'calendar' | 'drive' | 'notion' | 'github' | 'slack' | 'linear';

export interface SourceReference {
  id: string;
  connector: ConnectorType;
  connectorName: string;
  title: string;
  snippet: string;
  timestamp: string;
  sender?: string;
  url?: string;
}

export interface ChatAction {
  id: string;
  label: string;
  actionType: 'draft_reply' | 'review_conflict' | 'view_meeting' | 'open_source' | 'copy_text' | 'custom';
  payload?: any;
}

export interface FindingItem {
  id: string;
  type: 'conflict' | 'pending' | 'meeting' | 'info';
  title: string;
  timestamp: string;
  description: string;
  sources: SourceReference[];
  actionLabel: string;
  actionType: 'review_conflict' | 'open_conversation' | 'view_meeting' | 'general';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  modeUsed?: AIMode;
  sourcesUsed?: SourceReference[];
  findings?: FindingItem[];
  actions?: ChatAction[];
  isThinking?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  updatedAt: string;
  previewText?: string;
  mode: AIMode;
  messages: ChatMessage[];
}
