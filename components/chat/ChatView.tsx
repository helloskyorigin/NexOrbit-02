'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  History,
  X,
  Plus,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  AIMode,
  ChatConversation,
  ChatMessage,
  SourceReference,
  ChatAction,
} from './types';
import { ChatHeader } from './ChatHeader';
import { ModeSelector } from './ModeSelector';
import { UserMessage, AssistantMessage, TypingIndicator } from './MessageItem';
import { RightContextPanel } from './RightContextPanel';
import { ChatComposer } from './ChatComposer';
import {
  generateAIResponse,
  MOCK_CHAT_SOURCES,
  MOCK_CHAT_ACTIONS,
  MOCK_MEMORY_DATA,
} from './chatEngine';
import { useToast } from '../ui/Toast';
import {
  ConflictDetailDrawer,
  EmailDrawer,
  MeetingDrawer,
  SourcePreviewDrawer,
  VoiceModal,
  AttachmentModal,
} from '../ask/DetailDrawers';

export interface ChatViewProps {
  onNavigate?: (pageId: string) => void;
  initialMode?: AIMode;
  initialQuery?: string;
  className?: string;
}

const INITIAL_CONVERSATION: ChatConversation = {
  id: 'conv-project-alpha',
  title: "What's the latest Project Alpha proposal?",
  updatedAt: '10:24 AM',
  mode: 'auto',
  sources: [
    MOCK_CHAT_SOURCES.driveProposal,
    MOCK_CHAT_SOURCES.gmailAlpha,
    MOCK_CHAT_SOURCES.notionRoadmap,
    MOCK_CHAT_SOURCES.calendarSync,
  ],
  actions: MOCK_CHAT_ACTIONS,
  memory: MOCK_MEMORY_DATA,
  messages: [
    {
      id: 'msg-user-1',
      sender: 'user',
      text: "What's the latest Project Alpha proposal?",
      timestamp: '10:24 AM',
      modeUsed: 'auto',
    },
    {
      id: 'msg-ai-1',
      sender: 'ai',
      text: `Here's the latest Project Alpha proposal I found.\n\nThe newest version is Proposal v2.3, updated yesterday by you. It includes the revised timeline, budget breakdown, and client feedback summary.`,
      timestamp: '10:24 AM',
      modeUsed: 'auto',
      document: {
        title: 'Project Alpha Proposal v2.3.pdf',
        source: 'Google Drive',
        updatedAt: 'Updated May 11, 2024',
        fileType: 'pdf',
      },
      highlights: [
        'Timeline moved to Aug 2024 – Feb 2025',
        'Budget increased by 12%',
        'Client requested 3 additional features',
        'Next review meeting on May 15',
      ],
      sourcesUsed: [
        MOCK_CHAT_SOURCES.driveProposal,
        MOCK_CHAT_SOURCES.gmailAlpha,
        MOCK_CHAT_SOURCES.notionRoadmap,
        MOCK_CHAT_SOURCES.calendarSync,
      ],
      actions: MOCK_CHAT_ACTIONS,
      memoryContext: MOCK_MEMORY_DATA,
    },
  ],
};

const SUGGESTED_FOLLOW_UPS = [
  'Summarize key changes',
  'Show client feedback',
  'Compare with v2.2',
];

let idCounter = 5000;
function createId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export const ChatView: React.FC<ChatViewProps> = ({
  onNavigate,
  initialMode = 'auto',
  initialQuery = '',
  className,
}) => {
  const { addToast } = useToast();

  const [conversations, setConversations] = useState<ChatConversation[]>([
    INITIAL_CONVERSATION,
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    INITIAL_CONVERSATION.id
  );
  const [currentMode, setCurrentMode] = useState<AIMode>(initialMode);
  const [inputText, setInputText] = useState(initialQuery);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Drawers & Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConflictDrawerOpen, setIsConflictDrawerOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
  const [selectedSourceForPreview, setSelectedSourceForPreview] =
    useState<SourceReference | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations[0];

  // Auto-scroll when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isThinking, scrollToBottom]);

  // Execute a user query with simulated AI response
  const executeUserQuery = useCallback(
    (query: string, convId: string, mode: AIMode, msgAttachments?: ChatAttachment[]) => {
      const userMsg: ChatMessage = {
        id: createId('msg-user'),
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        modeUsed: mode,
        attachments: msgAttachments && msgAttachments.length > 0 ? msgAttachments : undefined,
      };

      // Add user message immediately
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              updatedAt: 'Just now',
              messages: [...c.messages, userMsg],
            };
          }
          return c;
        })
      );

      setIsThinking(true);

      // Fast, smooth AI response delivery
      setTimeout(() => {
        const result = generateAIResponse(
          query || (msgAttachments ? `[Attached ${msgAttachments.length} file(s)]` : ''),
          mode
        );
        const aiMsg: ChatMessage = {
          id: createId('msg-ai'),
          sender: 'ai',
          text: result.text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          modeUsed: mode,
          document: result.document,
          highlights: result.highlights,
          sourcesUsed: result.sourcesUsed,
          findings: result.findings,
          actions: result.actions,
          memoryContext: result.memoryContext,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === convId) {
              return {
                ...c,
                updatedAt: 'Just now',
                sources: result.sourcesUsed || c.sources,
                actions: result.actions || c.actions,
                memory: result.memoryContext || c.memory,
                messages: [...c.messages, aiMsg],
              };
            }
            return c;
          })
        );
        setIsThinking(false);
      }, 550);
    },
    []
  );

  // Handle new conversation creation
  const handleStartNewConversation = useCallback(
    (initialUserText?: string, modeToUse?: AIMode) => {
      const targetMode = modeToUse || currentMode;
      const newId = createId('conv');
      const newConv: ChatConversation = {
        id: newId,
        title: initialUserText
          ? initialUserText.slice(0, 36) +
            (initialUserText.length > 36 ? '...' : '')
          : 'New Workspace Chat',
        updatedAt: 'Just now',
        mode: targetMode,
        messages: [],
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newId);

      if (initialUserText) {
        setTimeout(() => {
          executeUserQuery(initialUserText, newId, targetMode);
        }, 50);
      }
    },
    [currentMode, executeUserQuery]
  );

  // Handle incoming command from Home screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingCommand = sessionStorage.getItem('pending_ask_command');
      const pendingMode = sessionStorage.getItem(
        'pending_chat_mode'
      ) as AIMode | null;
      if (pendingCommand) {
        sessionStorage.removeItem('pending_ask_command');
        if (pendingMode) {
          sessionStorage.removeItem('pending_chat_mode');
        }
        const timer = setTimeout(() => {
          if (pendingMode) {
            setCurrentMode(pendingMode);
          }
          handleStartNewConversation(pendingCommand, pendingMode || currentMode);
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [currentMode, handleStartNewConversation]);

  // Submit current input
  const handleSendMessage = (e?: React.FormEvent, submitAttachments?: ChatAttachment[]) => {
    if (e) e.preventDefault();
    const pendingAttachments = submitAttachments || attachments;
    if ((!inputText.trim() && pendingAttachments.length === 0) || isThinking) return;

    const query = inputText.trim();
    const sendingAttachments = [...pendingAttachments];
    setInputText('');
    setAttachments([]);

    let convId = activeConversationId;
    if (!convId || !activeConv) {
      const newId = createId('conv');
      const newConv: ChatConversation = {
        id: newId,
        title: query
          ? query.slice(0, 36) + (query.length > 36 ? '...' : '')
          : sendingAttachments[0]?.name || 'New Chat',
        updatedAt: 'Just now',
        mode: currentMode,
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newId);
      convId = newId;
    }

    executeUserQuery(query, convId, currentMode, sendingAttachments);
  };

  // Handle action triggers from context panel or assistant message
  const handleActionClick = (action: ChatAction) => {
    switch (action.actionType) {
      case 'open_source':
        if (action.payload) {
          setSelectedSourceForPreview(action.payload);
        } else {
          setSelectedSourceForPreview(MOCK_CHAT_SOURCES.driveProposal);
        }
        break;
      case 'share':
        addToast({
          type: 'success',
          title: 'Link Copied',
          description: 'Shareable proposal link copied to clipboard.',
        });
        break;
      case 'add_to_notion':
        addToast({
          type: 'success',
          title: 'Notion Sync',
          description: 'Project Alpha Proposal v2.3 embedded into Notion Hub.',
        });
        break;
      case 'create_task':
        addToast({
          type: 'success',
          title: 'Follow-up Task Created',
          description: 'Added "Review Proposal v2.3" to Clean My Day priorities.',
        });
        break;
      case 'draft_reply':
        setIsEmailDrawerOpen(true);
        break;
      case 'review_conflict':
        setIsConflictDrawerOpen(true);
        break;
      case 'view_meeting':
        setIsMeetingDrawerOpen(true);
        break;
      default:
        addToast({
          type: 'info',
          title: 'Action Triggered',
          description: `Executed: ${action.label}`,
        });
        break;
    }
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col font-sans transition-colors duration-200',
        className
      )}
    >
      {/* 1. HEADER ROW */}
      <ChatHeader
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNavigateHome={() => onNavigate && onNavigate('home')}
      />

      {/* 2. THREE-COLUMN DESKTOP WORKSPACE (Center Conversation + Right Panel) */}
      <div className="w-full flex flex-col lg:flex-row items-start gap-8 lg:gap-10 pt-2">
        {/* CENTER CONVERSATION COLUMN */}
        <div className="flex-1 min-w-0 w-full flex flex-col space-y-6">
          {/* AI Mode Selector Segment Bar */}
          <div className="w-full flex justify-center pb-1">
            <ModeSelector
              currentMode={currentMode}
              onChangeMode={(mode) => {
                setCurrentMode(mode);
                addToast({
                  type: 'info',
                  title: `Mode: ${
                    mode === 'auto'
                      ? 'Auto'
                      : mode === 'general'
                      ? 'NEXORBIT AI'
                      : 'My Connected World'
                  }`,
                  description:
                    mode === 'auto'
                      ? 'NEXORBIT automatically determines context.'
                      : mode === 'general'
                      ? 'Conversational reasoning without app search.'
                      : 'Prioritizing information from your connected apps.',
                });
              }}
            />
          </div>

          {/* Conversation Stream */}
          <div className="space-y-6 min-h-[320px]">
            {activeConv.messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'user' ? (
                  <UserMessage message={msg} userInitial="S" />
                ) : (
                  <AssistantMessage
                    message={msg}
                    onOpenDocument={(docTitle) =>
                      setSelectedSourceForPreview(
                        MOCK_CHAT_SOURCES.driveProposal
                      )
                    }
                    onOpenSource={(src) => setSelectedSourceForPreview(src)}
                  />
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {isThinking && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up Suggestion Chips & Refresh Button */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2 select-none">
            {SUGGESTED_FOLLOW_UPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  executeUserQuery(chip, activeConv.id, currentMode)
                }
                className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200/80 shadow-3xs text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                {chip}
              </button>
            ))}

            {/* Regenerate / Refresh Button */}
            <button
              type="button"
              onClick={() => {
                const lastUser = activeConv.messages
                  .slice()
                  .reverse()
                  .find((m) => m.sender === 'user');
                if (lastUser) {
                  executeUserQuery(lastUser.text, activeConv.id, currentMode);
                } else {
                  executeUserQuery(
                    "What's the latest Project Alpha proposal?",
                    activeConv.id,
                    currentMode
                  );
                }
              }}
              className="p-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-200/80 shadow-3xs transition-all active:scale-95 cursor-pointer"
              title="Regenerate response"
              aria-label="Regenerate response"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Chat Composer Surface */}
          <div className="pt-2 sticky bottom-4 z-10 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pb-2">
            <ChatComposer
              inputText={inputText}
              onChangeText={setInputText}
              onSubmit={handleSendMessage}
              attachments={attachments}
              onAddAttachments={(files) =>
                setAttachments((prev) => [...prev, ...files])
              }
              onRemoveAttachment={(id) =>
                setAttachments((prev) => prev.filter((a) => a.id !== id))
              }
              isThinking={isThinking}
            />
          </div>
        </div>

        {/* RIGHT CONTEXT PANEL */}
        <RightContextPanel
          sources={activeConv.sources}
          actions={activeConv.actions}
          memory={activeConv.memory}
          onNavigateToMemory={() => onNavigate && onNavigate('memory')}
          onOpenSource={(src) => setSelectedSourceForPreview(src)}
          onExecuteAction={handleActionClick}
          onCreateWatch={() => {
            addToast({
              type: 'success',
              title: 'Proactive Watch Created',
              description: 'NEXORBIT is now monitoring Project Alpha for updates.',
            });
          }}
        />
      </div>

      {/* CONVERSATION HISTORY DRAWER */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Chat History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="p-3 space-y-2 flex-1 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setIsHistoryOpen(false);
                  handleStartNewConversation();
                }}
                className="w-full p-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-3xs"
              >
                <Plus className="h-4 w-4" />
                <span>Start New Conversation</span>
              </button>

              <div className="pt-2 space-y-1.5">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveConversationId(c.id);
                      setIsHistoryOpen(false);
                    }}
                    className={cn(
                      'w-full text-left p-3 rounded-2xl transition-all cursor-pointer block',
                      c.id === activeConversationId
                        ? 'bg-indigo-50/90 border border-indigo-200/80 text-indigo-950 font-medium'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">
                        {c.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {c.updatedAt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWERS & MODALS */}
      <ConflictDetailDrawer
        isOpen={isConflictDrawerOpen}
        onClose={() => setIsConflictDrawerOpen(false)}
        onPrepareResponse={() => setIsEmailDrawerOpen(true)}
        onOpenSource={(src) => setSelectedSourceForPreview(src)}
        sources={Object.values(MOCK_CHAT_SOURCES).slice(0, 3)}
      />

      <EmailDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        onPrepareReply={() => {
          setIsEmailDrawerOpen(false);
          addToast({
            type: 'success',
            title: 'Reply Draft Dispatched',
            description: 'Email sent to Rahul Mehta.',
          });
        }}
      />

      <MeetingDrawer
        isOpen={isMeetingDrawerOpen}
        onClose={() => setIsMeetingDrawerOpen(false)}
      />

      <SourcePreviewDrawer
        source={selectedSourceForPreview}
        onClose={() => setSelectedSourceForPreview(null)}
      />

      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSubmitVoice={(query) => {
          setIsVoiceModalOpen(false);
          executeUserQuery(query, activeConv.id, currentMode);
        }}
      />

      <AttachmentModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        onAttachFile={(fileName) => {
          setIsAttachModalOpen(false);
          addToast({
            type: 'info',
            title: 'File Attached',
            description: `Attached ${fileName} to chat workspace context.`,
          });
        }}
      />
    </div>
  );
};
