'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Bot,
  Globe,
  Plus,
  History,
  Send,
  Paperclip,
  Mic,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  FileText,
  Mail,
  Calendar,
  AlertTriangle,
  Clock,
  Search,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AIMode, ChatConversation, ChatMessage, SourceReference, FindingItem, ChatAction } from './types';
import { ModeSelector } from './ModeSelector';
import { generateAIResponse, MOCK_CHAT_SOURCES } from './chatEngine';
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
  onNavigate: (pageId: string) => void;
  initialMode?: AIMode;
  initialQuery?: string;
  className?: string;
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-alpha-timeline',
    title: 'Project Alpha Timeline & Conflict',
    updatedAt: 'Today, 9:24 AM',
    previewText: 'Deadline conflict between client email and brief...',
    mode: 'auto',
    messages: [
      {
        id: 'msg-u1',
        sender: 'user',
        text: 'What changed in Project Alpha and do I have any conflicts?',
        timestamp: 'Today, 9:22 AM',
        modeUsed: 'auto',
      },
      {
        id: 'msg-a1',
        sender: 'ai',
        text: `NEXORBIT analyzed your workspace updates across **Gmail**, **Google Calendar**, **Google Drive**, and **Notion**.

### ⚠️ Primary Attention Item:
- **Deadline Conflict Detected**: Rahul's latest email notes **Friday COB** as the deliverable deadline, whereas the master scope document (*Project_Alpha_Master_Brief_v2.pdf*) targets **Monday, August 18**.

### 📊 Sprint 14 Status:
- 8 engineering tasks completed in **Notion**, 2 tasks in code review.
- PR #142 (*Core API Alignment*) merged successfully on **GitHub**.
- Sync meeting scheduled for **Tomorrow at 10:00 AM**.`,
        timestamp: 'Today, 9:24 AM',
        modeUsed: 'auto',
        sourcesUsed: [
          MOCK_CHAT_SOURCES.gmailAlpha,
          MOCK_CHAT_SOURCES.calendarSync,
          MOCK_CHAT_SOURCES.driveProposal,
          MOCK_CHAT_SOURCES.notionRoadmap,
        ],
        findings: [
          {
            id: 'find-alpha-1',
            type: 'conflict',
            title: 'Deadline conflict: Friday vs Monday',
            timestamp: '2 min ago',
            description: 'Client email mentions Friday while project document specifies Monday.',
            sources: [MOCK_CHAT_SOURCES.gmailAlpha, MOCK_CHAT_SOURCES.driveProposal],
            actionLabel: 'Review Conflict →',
            actionType: 'review_conflict',
          },
        ],
        actions: [
          { id: 'act-conf-1', label: 'Review Conflict Analysis', actionType: 'review_conflict' },
          { id: 'act-draft-1', label: 'Draft Clarification Email', actionType: 'draft_reply' },
        ],
      },
    ],
  },
  {
    id: 'conv-quantum',
    title: 'Quantum Computing Fundamentals',
    updatedAt: 'Yesterday, 4:15 PM',
    previewText: 'Core principles of superposition and entanglement...',
    mode: 'general',
    messages: [
      {
        id: 'msg-u2',
        sender: 'user',
        text: 'Explain quantum computing in simple terms with applications.',
        timestamp: 'Yesterday, 4:14 PM',
        modeUsed: 'general',
      },
      {
        id: 'msg-a2',
        sender: 'ai',
        text: `**Quantum computing** is a multidisciplinary field utilizing the principles of quantum mechanics to solve complex problems exponentially faster than classical supercomputers.

### Core Mechanics:
1. **Superposition**: Qubits can represent multiple states simultaneously.
2. **Entanglement**: Instantaneous correlation across quantum states.
3. **Interference**: Amplifying accurate pathways while eliminating destructive ones.`,
        timestamp: 'Yesterday, 4:15 PM',
        modeUsed: 'general',
        actions: [
          { id: 'act-copy-q', label: 'Copy Summary', actionType: 'copy_text' },
        ],
      },
    ],
  },
];

let idCounter = 1000;
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

  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-alpha-timeline');
  const [currentMode, setCurrentMode] = useState<AIMode>(initialMode);
  const [inputText, setInputText] = useState(initialQuery);
  const [isThinking, setIsThinking] = useState(false);

  // Drawers & Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConflictDrawerOpen, setIsConflictDrawerOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
  const [selectedSourceForPreview, setSelectedSourceForPreview] = useState<SourceReference | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isThinking]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputText]);

  const executeUserQuery = (query: string, convId: string, mode: AIMode) => {
    const userMsg: ChatMessage = {
      id: createId('msg-u'),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
      modeUsed: mode,
    };

    // Add user message immediately
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            title: c.messages.length === 0 ? query.slice(0, 32) + (query.length > 32 ? '...' : '') : c.title,
            updatedAt: 'Just now',
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    setIsThinking(true);

    // Realistic AI thinking response
    setTimeout(() => {
      const result = generateAIResponse(query, mode);
      const aiMsg: ChatMessage = {
        id: createId('msg-a'),
        sender: 'ai',
        text: result.text,
        timestamp: 'Just now',
        modeUsed: mode,
        sourcesUsed: result.sourcesUsed,
        findings: result.findings,
        actions: result.actions,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              updatedAt: 'Just now',
              messages: [...c.messages, aiMsg],
            };
          }
          return c;
        })
      );
      setIsThinking(false);
    }, 650);
  };

  const handleStartNewConversation = (initialUserText?: string, modeToUse?: AIMode) => {
    const targetMode = modeToUse || currentMode;
    const newId = createId('conv');
    const newConv: ChatConversation = {
      id: newId,
      title: initialUserText ? initialUserText.slice(0, 32) + (initialUserText.length > 32 ? '...' : '') : 'New Conversation',
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
  };

  // Handle pending command from Home session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingCommand = sessionStorage.getItem('pending_ask_command');
      const pendingMode = sessionStorage.getItem('pending_chat_mode') as AIMode | null;
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
        }, 60);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;

    const query = inputText.trim();
    setInputText('');

    let convId = activeConversationId;
    if (!convId || !activeConv) {
      const newId = createId('conv');
      const newConv: ChatConversation = {
        id: newId,
        title: query.slice(0, 32) + (query.length > 32 ? '...' : ''),
        updatedAt: 'Just now',
        mode: currentMode,
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newId);
      convId = newId;
    }

    executeUserQuery(query, convId, currentMode);
  };

  const handleActionClick = (action: ChatAction) => {
    switch (action.actionType) {
      case 'draft_reply':
        setIsEmailDrawerOpen(true);
        break;
      case 'review_conflict':
        setIsConflictDrawerOpen(true);
        break;
      case 'view_meeting':
        setIsMeetingDrawerOpen(true);
        break;
      case 'open_source':
        if (action.payload) {
          setSelectedSourceForPreview(action.payload);
        } else {
          setSelectedSourceForPreview(MOCK_CHAT_SOURCES.driveProposal);
        }
        break;
      case 'copy_text':
        navigator.clipboard.writeText(activeConv?.messages[activeConv.messages.length - 1]?.text || '');
        addToast({
          type: 'success',
          title: 'Copied to Clipboard',
          description: 'Text copied successfully.',
        });
        break;
      default:
        addToast({
          type: 'info',
          title: 'Action Triggered',
          description: `Executed action: ${action.label}`,
        });
        break;
    }
  };

  const getConnectorIcon = (type: string) => {
    switch (type) {
      case 'gmail':
        return <Mail className="h-3.5 w-3.5 text-rose-500" />;
      case 'calendar':
        return <Calendar className="h-3.5 w-3.5 text-blue-500" />;
      case 'drive':
        return <FileText className="h-3.5 w-3.5 text-amber-500" />;
      case 'notion':
        return <FileText className="h-3.5 w-3.5 text-slate-800" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className={cn('relative flex flex-col min-h-[calc(100dvh-4rem)] max-w-4xl mx-auto font-sans', className)}>
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 select-none">
        {/* Left: Back to Home + Page Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight flex items-center gap-1.5">
              <span>Chat</span>
              <span className="text-indigo-600 font-normal text-xs">✦</span>
            </h1>
            <span className="hidden md:inline-block text-xs text-slate-400 font-normal">
              NEXORBIT AI Workspace
            </span>
          </div>
        </div>

        {/* Right: Mode Selector + New Chat + History Drawer Toggle */}
        <div className="flex items-center gap-2">
          {/* Mode Selector Pill */}
          <ModeSelector
            currentMode={currentMode}
            onChangeMode={(newMode) => {
              setCurrentMode(newMode);
              addToast({
                type: 'info',
                title: `Mode: ${newMode === 'auto' ? 'Auto' : newMode === 'general' ? 'NexOrbit AI' : 'My Connected World'}`,
                description:
                  newMode === 'auto'
                    ? 'NexOrbit intelligently routes questions.'
                    : newMode === 'general'
                    ? 'General AI reasoning without connector search.'
                    : 'Explicitly searching connected apps & memory.',
              });
            }}
            variant="compact"
          />

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => handleStartNewConversation()}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-3xs"
            title="New Chat"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* History Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer relative"
            title="Conversation History"
          >
            <History className="h-4 w-4" />
            {conversations.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN CONVERSATION AREA */}
      <main className="flex-1 flex flex-col justify-between overflow-y-auto px-3 sm:px-4 py-4 space-y-6">
        {activeConv && activeConv.messages.length > 0 ? (
          <div className="space-y-6 flex-1">
            {activeConv.messages.map((msg) => (
              <div key={msg.id} className="animate-fadeIn space-y-3">
                {/* USER MESSAGE */}
                {msg.sender === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-tr-md bg-indigo-600 text-white px-4.5 py-3 shadow-md shadow-indigo-600/10 text-[14px] leading-relaxed select-text">
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-indigo-200">
                        <span>{msg.timestamp}</span>
                        {msg.modeUsed && (
                          <span>
                            • {msg.modeUsed === 'auto' ? 'Auto' : msg.modeUsed === 'general' ? 'General' : 'Connected'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI MESSAGE */}
                {msg.sender === 'ai' && (
                  <div className="flex flex-col space-y-3 max-w-full">
                    {/* AI Message Card */}
                    <div className="rounded-3xl rounded-tl-md bg-white border border-indigo-50/80 shadow-[0_4px_24px_rgba(99,102,241,0.04)] p-4 sm:p-5 space-y-4">
                      {/* AI Header: Identity & Mode Badge */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
                            <Sparkles className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-950">NEXORBIT</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/70">
                                {msg.modeUsed === 'general'
                                  ? 'NexOrbit AI'
                                  : msg.modeUsed === 'connected'
                                  ? 'My Connected World'
                                  : 'Auto • Verified'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Top Message Action Icons */}
                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text);
                              addToast({
                                type: 'success',
                                title: 'Copied',
                                description: 'AI response copied to clipboard.',
                              });
                            }}
                            className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Copy text"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Message Text (formatted with linebreaks & markdown style) */}
                      <div className="text-[13.5px] sm:text-[14.5px] text-slate-800 leading-relaxed space-y-3 select-text font-normal">
                        {msg.text.split('\n\n').map((paragraph, pIdx) => {
                          // If header
                          if (paragraph.startsWith('### ')) {
                            return (
                              <h3 key={pIdx} className="font-bold text-slate-950 text-sm sm:text-base pt-1">
                                {paragraph.replace('### ', '')}
                              </h3>
                            );
                          }
                          // If blockquote
                          if (paragraph.startsWith('> ')) {
                            return (
                              <blockquote
                                key={pIdx}
                                className="pl-3 py-1 border-l-2 border-indigo-400 bg-indigo-50/40 rounded-r-xl text-slate-700 italic text-xs sm:text-sm"
                              >
                                {paragraph.replace('> ', '')}
                              </blockquote>
                            );
                          }
                          // Standard paragraph with simple bold parsing
                          return (
                            <p key={pIdx} className="whitespace-pre-line">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>

                      {/* FINDINGS / CONFLICTS (if any) */}
                      {msg.findings && msg.findings.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            Attention Items
                          </span>
                          {msg.findings.map((f) => (
                            <div
                              key={f.id}
                              className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start justify-between gap-3"
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                                  <p className="text-[11.5px] text-slate-600 mt-0.5">{f.description}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsConflictDrawerOpen(true)}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap shrink-0 cursor-pointer pt-0.5"
                              >
                                {f.actionLabel}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* SOURCES USED (Beneath answer) */}
                      {msg.sourcesUsed && msg.sourcesUsed.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Referenced Sources ({msg.sourcesUsed.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.sourcesUsed.map((src) => (
                              <button
                                key={src.id}
                                type="button"
                                onClick={() => setSelectedSourceForPreview(src)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 text-xs font-medium transition-all shadow-3xs cursor-pointer group"
                              >
                                {getConnectorIcon(src.connector)}
                                <span className="font-semibold text-slate-900 group-hover:text-indigo-900">
                                  {src.connectorName}:
                                </span>
                                <span className="truncate max-w-[160px]">{src.title}</span>
                                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-600" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CONTEXTUAL ACTIONS */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          {msg.actions.map((act) => (
                            <button
                              key={act.id}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="h-3 w-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking / Streaming Indicator */}
            {isThinking && (
              <div className="animate-fadeIn flex items-center gap-3 p-4 rounded-3xl bg-white border border-indigo-100/80 shadow-xs max-w-sm">
                <div className="h-7 w-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-spin">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Synthesizing answer</span>
                    <span className="inline-flex gap-0.5">
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {currentMode === 'general'
                      ? 'Executing general AI reasoning'
                      : 'Cross-referencing connected workspace & memory'}
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* EMPTY STATE (Clean AI command center) */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 space-y-6">
            <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                Universal AI Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Ask general knowledge questions, generate drafts, plan schedules, or query your connected apps in real-time.
              </p>
            </div>

            {/* Suggested Starter Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg pt-2">
              {[
                {
                  label: 'What is quantum computing?',
                  sub: 'General knowledge & concepts',
                  mode: 'general' as AIMode,
                },
                {
                  label: 'Where is the Project Alpha proposal?',
                  sub: 'Google Drive & Notion search',
                  mode: 'connected' as AIMode,
                },
                {
                  label: 'Write a professional email update',
                  sub: 'Executive draft generation',
                  mode: 'general' as AIMode,
                },
                {
                  label: 'What meetings do I have tomorrow?',
                  sub: 'Google Calendar sync',
                  mode: 'connected' as AIMode,
                },
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCurrentMode(item.mode);
                    executeUserQuery(item.label, activeConversationId || 'conv-new', item.mode);
                  }}
                  className="p-3.5 rounded-2xl bg-white hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 text-left transition-all shadow-3xs hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                      {item.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. STICKY BOTTOM COMPOSER */}
        <div className="sticky bottom-2 z-20 pt-2 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          {/* Quick Follow-up Suggestions Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 px-1">
            {[
              'Draft reply to Rahul',
              'Review deadline conflict',
              'What should I focus on next?',
              'Summarize unread emails',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(chip);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-3xs transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Glowing Composer Box */}
          <form
            onSubmit={handleSendMessage}
            className="relative rounded-3xl bg-white border border-indigo-100/90 shadow-[0_8px_30px_rgba(99,102,241,0.08)] p-3 sm:p-3.5 space-y-2.5 transition-all focus-within:border-indigo-300 focus-within:shadow-[0_0_24px_rgba(99,102,241,0.14)]"
          >
            {/* Input textarea */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                currentMode === 'general'
                  ? 'Ask NexOrbit AI anything (reasoning, writing, coding)...'
                  : currentMode === 'connected'
                  ? 'Search files, emails, calendar, Notion & memory...'
                  : 'Ask anything or search your connected world...'
              }
              rows={1}
              className="w-full bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed min-h-[36px] max-h-[140px] px-1 focus:ring-0 select-text"
            />

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
              {/* Left: Mode selector pill + Attach + Voice */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ModeSelector currentMode={currentMode} onChangeMode={setCurrentMode} variant="compact" />

                <button
                  type="button"
                  onClick={() => setIsAttachModalOpen(true)}
                  className="p-2 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="Attach File / Context"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="p-2 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="Voice Input"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>

              {/* Right: Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 4. CONVERSATION HISTORY DRAWER */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Chat History</h3>
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
                        ? 'bg-indigo-50/90 border border-indigo-200/80 text-indigo-950'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold truncate">{c.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{c.updatedAt}</span>
                    </div>
                    {c.previewText && (
                      <p className="text-[11px] text-slate-500 truncate mt-1">{c.previewText}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE DRAWERS & MODALS */}
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
            title: 'Reply Draft Sent',
            description: 'Email sent to Rahul Mehta successfully.',
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
          executeUserQuery(query, activeConversationId || 'conv-new', currentMode);
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
            description: `Attached ${fileName} to chat context.`,
          });
        }}
      />
    </div>
  );
};
