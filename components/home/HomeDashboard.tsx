'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Calendar,
  Mail,
  FileText,
  Video,
  Bell,
  Sparkles,
  CheckCircle2,
  Menu,
  Mic,
  MicOff,
  Paperclip,
  Plus,
  Image as ImageIcon,
  X,
  Globe,
  Bot,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorId } from '../shell/ConnectorModal';
import { useToast } from '../ui/Toast';
import { AIMode } from '../chat/types';
import { useAuth } from '../auth/AuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface AttachmentItem {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface HomeDashboardProps {
  onNavigate: (pageId: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
  onOpenMobileMenu?: () => void;
  userName?: string;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenConnector,
  onOpenMobileMenu,
  userName = 'Satyam',
}) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [commandText, setCommandText] = useState('');
  const [currentMode, setCurrentMode] = useState<AIMode>('auto');

  // Use real user displayName or email instead of a hardcoded string
  const activeUserName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');

  // Real connections state from Firestore
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchConnections = async () => {
      try {
        const colRef = collection(db, 'users', user.uid, 'connections');
        const snapshot = await getDocs(colRef);
        const connectedIds: string[] = [];
        snapshot.forEach((doc) => {
          if (doc.data().connected === true) {
            connectedIds.push(doc.id);
          }
        });
        setActiveConnections(connectedIds);
      } catch (e) {
        console.warn('Error loading dashboard connections:', e);
      } finally {
        setLoadingConnections(false);
      }
    };

    fetchConnections();
  }, [user?.uid]);


  // Multimodal Attachment State
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Close attach menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setIsAttachMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    const newAttachments: AttachmentItem[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        addToast({
          type: 'warning',
          title: 'File Too Large',
          description: `"${file.name}" exceeds the 15 MB limit.`,
        });
        return;
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const previewUrl = event.target?.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              size: file.size,
              type: file.type,
              previewUrl,
            },
          ]);
        };
        reader.onerror = () => {
          addToast({
            type: 'error',
            title: 'File Read Error',
            description: `Could not process image "${file.name}".`,
          });
        };
        reader.readAsDataURL(file);
      } else {
        newAttachments.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    });

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }

    // Reset input so re-selecting the same file fires onChange
    e.target.value = '';
    setIsAttachMenuOpen(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast({
        type: 'warning',
        title: 'Voice Input Unsupported',
        description: 'Your browser does not support voice input. Try Chrome or Edge.',
      });
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        addToast({
          type: 'info',
          title: 'Voice Input Active',
          description: 'Listening... Speak now to populate your command.',
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setCommandText(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          addToast({
            type: 'error',
            title: 'Microphone Access Denied',
            description: 'Please allow microphone access in your browser settings to use voice input.',
          });
        } else if (event.error !== 'no-speech') {
          addToast({
            type: 'warning',
            title: 'Voice Input Issue',
            description: `Voice input encountered an issue (${event.error}). Please try again.`,
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      addToast({
        type: 'error',
        title: 'Voice Input Error',
        description: 'Failed to access microphone. Please check browser permissions.',
      });
    }
  };

  const handleCommandSubmit = (e?: React.FormEvent, customQuery?: string, customMode?: AIMode) => {
    if (e) e.preventDefault();
    const queryToSend = customQuery !== undefined ? customQuery : commandText;
    const modeToSend = customMode || currentMode;

    if (!queryToSend.trim() && attachments.length === 0) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_ask_command', queryToSend.trim() || 'Multimodal context query');
      sessionStorage.setItem('pending_chat_mode', modeToSend);
      if (attachments.length > 0) {
        sessionStorage.setItem(
          'pending_chat_attachments',
          JSON.stringify(attachments.map((a) => ({ name: a.name, type: a.type })))
        );
      }
    }

    setCommandText('');
    setAttachments([]);
    setIsAttachMenuOpen(false);

    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const handleNotificationClick = () => {
    addToast({
      type: 'info',
      title: 'Notifications',
      description: '2 new context updates from Gmail & Google Calendar.',
    });
  };

  // Determine active integrations dynamically to replace hardcoded values with real status
  const hasGmail = activeConnections.includes('gmail');
  const hasCalendar = activeConnections.includes('calendar');
  const hasDrive = activeConnections.includes('drive');
  const hasGithub = activeConnections.includes('github');
  const hasNotion = activeConnections.includes('notion');

  const attentionCount = (hasGmail || hasDrive) ? 2 : 0;
  const changedCount = (hasGithub || hasNotion || hasDrive) ? 3 : 0;
  const upcomingCount = hasCalendar ? 2 : 0;
  const completedCount = (hasGmail || hasGithub) ? 6 : 0;

  // Dynamically filter Today's Focus
  const focusItems = [];
  if (hasCalendar) {
    focusItems.push({ title: 'Deadline conflict detected', desc: 'Friday vs Monday', action: 'Review', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' });
    focusItems.push({ title: 'Meeting tomorrow', desc: '10:00 AM', action: 'Prepare', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' });
  }
  if (hasGmail) {
    focusItems.push({ title: "Client hasn't replied", desc: 'Rahul · 4 days', action: 'Open', icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50' });
  }

  // Dynamically filter What Changed
  const recentChanges = [];
  if (hasCalendar || hasGithub || hasNotion) {
    recentChanges.push({ title: 'Project Alpha deadline changed', time: '2h ago', icon: Calendar, desc: 'Dec 12 → Dec 15' });
  }
  if (hasGmail) {
    recentChanges.push({ title: 'Rahul replied', time: '4h ago', icon: Mail, desc: 'Re: Project Alpha · "Thanks for the update..."' });
  }
  if (hasDrive || hasNotion) {
    recentChanges.push({ title: 'Proposal v2 updated', time: '6h ago', icon: FileText, desc: 'In Project Alpha' });
  }

  // Dynamically filter Upcoming events
  const upcomingEvents = hasCalendar ? [
    { time: '10:00 AM', title: 'Project Alpha Sync', source: 'Google Meet', icon: Calendar, color: 'text-indigo-600' },
    { time: '1:30 PM', title: 'Client Call', source: 'Zoom Meeting', icon: Video, color: 'text-purple-600' },
    { time: '4:00 PM', title: 'Product Review', source: 'NEXORBIT HQ', icon: Globe, color: 'text-emerald-600' },
  ] : [];

  return (
    <div className="relative min-h-full w-full flex flex-col justify-between overflow-x-hidden pb-8 select-none">
      {/* 1. COSMIC AMBIENT ORBITAL BACKGROUND (SVG + CSS) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Radial Center Glow */}
        <div className="absolute top-[20%] md:top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[700px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-br from-indigo-100/40 via-purple-50/25 to-transparent blur-3xl" />

        {/* Mobile Ambient Orbital SVG Curves */}
        <svg
          viewBox="0 0 400 800"
          className="block md:hidden absolute inset-0 w-full h-full object-cover opacity-40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mobOrbit1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M -50 150 C 150 20, 300 80, 450 250"
            fill="none"
            stroke="url(#mobOrbit1)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle cx="180" cy="110" r="2.5" fill="#818cf8" filter="drop-shadow(0 0 4px #6366f1)" />
          <circle cx="320" cy="190" r="2" fill="#c084fc" />
        </svg>

        {/* Desktop Ambient Orbital SVG Curves */}
        <svg
          viewBox="0 0 1400 900"
          className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-65"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="orbitStroke1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.05" />
              <stop offset="45%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#a855f7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="orbitStroke2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
            <radialGradient id="planetGlow1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4338ca" />
            </radialGradient>
            <radialGradient id="planetGlow2" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </radialGradient>
            <radialGradient id="planetGlow3" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>

          {/* Large Upper Arc */}
          <path
            d="M -100 280 C 350 80, 1050 80, 1500 280"
            fill="none"
            stroke="url(#orbitStroke1)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Sweeping Center Orbit Ellipse */}
          <ellipse
            cx="700"
            cy="410"
            rx="620"
            ry="180"
            fill="none"
            stroke="url(#orbitStroke1)"
            strokeWidth="1.2"
            transform="rotate(-4 700 410)"
          />

          {/* Secondary Counter Orbit Ellipse */}
          <ellipse
            cx="700"
            cy="420"
            rx="510"
            ry="140"
            fill="none"
            stroke="url(#orbitStroke2)"
            strokeWidth="1"
            strokeDasharray="2 6"
            transform="rotate(6 700 420)"
          />

          {/* Ambient Floating Planet Beads */}
          <circle cx="210" cy="220" r="5" fill="url(#planetGlow1)" filter="drop-shadow(0 0 6px #818cf8)" />
          <circle cx="1180" cy="240" r="6" fill="url(#planetGlow2)" filter="drop-shadow(0 0 8px #c084fc)" />
          <circle cx="340" cy="460" r="4.5" fill="url(#planetGlow3)" filter="drop-shadow(0 0 6px #38bdf8)" />
          <circle cx="1060" cy="480" r="5.5" fill="url(#planetGlow1)" filter="drop-shadow(0 0 7px #818cf8)" />
          <circle cx="780" cy="260" r="3.5" fill="url(#planetGlow2)" />
        </svg>
      </div>

      {/* 2. TOP ROW: GREETING (LEFT) & STATUS / PROFILE (RIGHT) */}
      <div className="flex items-start justify-between gap-4 pt-1 sm:pt-2 px-1">
        {/* Left: Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {onOpenMobileMenu && (
              <button
                onClick={onOpenMobileMenu}
                className="p-1.5 -ml-1.5 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 flex items-center gap-2">
              <span>Good morning, {activeUserName}</span>
              <span className="text-indigo-600 font-normal inline-block text-xl sm:text-2xl animate-pulse">
                ✦
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            NEXORBIT is ready.
          </p>
        </div>

        {/* Right: Synced Status Pill + Notification Bell + Profile Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notifications Bell */}
          <button
            onClick={handleNotificationClick}
            className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/80 text-slate-600 hover:text-slate-950 hover:bg-slate-50 flex items-center justify-center shadow-2xs transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => onNavigate('settings')}
            className="h-9 w-9 rounded-full overflow-hidden border border-slate-200/80 shadow-2xs cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all shrink-0 bg-indigo-600 text-white flex items-center justify-center font-bold text-sm"
            title="User Settings"
          >
            {activeUserName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* 3. HERO COMMAND SURFACE (SIGNATURE HIGH-END AI COMMAND CENTER) */}
      <div className="w-full max-w-3xl mx-auto my-6 sm:my-8 px-1">
        <form onSubmit={handleCommandSubmit} className="relative group flex flex-col">
          {/* Glowing Animated Gradient Perimeter */}
          <div className="absolute -inset-[1.5px] rounded-[1.75rem] bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 sm:from-indigo-500 sm:via-purple-500 sm:to-indigo-500 opacity-50 sm:opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 blur-[2px] transition-all duration-500 animate-gradient-x" />

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.txt,.csv,.json,.xlsx,.pptx,.md,text/*,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Command Surface Card */}
          <div className="relative flex flex-col rounded-[1.75rem] bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_32px_rgba(99,102,241,0.06)] border border-indigo-100/90 gap-3">
            {/* Attached Chips Section */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 px-1 pt-0.5">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-medium text-slate-800"
                  >
                    {file.previewUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="h-6 w-6 rounded-md object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <span className="max-w-[140px] truncate font-bold text-slate-900">{file.name}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.id)}
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder={isListening ? 'Listening... Speak now' : 'What can NEXORBIT help you with?'}
              className={cn(
                'w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base sm:text-[17px] focus:outline-none px-2 font-medium',
                isListening && 'placeholder:text-indigo-600 placeholder:font-semibold'
              )}
            />
            
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-3 border-t border-slate-100/90">
              {/* Mode Selector - Un-cramped spacious design */}
              <div
                className="bg-slate-100/80 p-1 rounded-2xl flex items-center gap-1 select-none overflow-x-auto max-w-full"
                role="radiogroup"
                aria-label="AI Mode Selection"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={currentMode === 'auto'}
                  onClick={() => setCurrentMode('auto')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer',
                    currentMode === 'auto'
                      ? 'bg-white text-indigo-700 shadow-2xs border border-indigo-100/80'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                  )}
                >
                  <Sparkles className={cn('h-3.5 w-3.5', currentMode === 'auto' ? 'text-indigo-600' : 'text-slate-400')} />
                  <span>Auto</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={currentMode === 'general'}
                  onClick={() => setCurrentMode('general')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer',
                    currentMode === 'general'
                      ? 'bg-white text-indigo-950 shadow-2xs border border-indigo-100/80'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                  )}
                >
                  <Bot className={cn('h-3.5 w-3.5', currentMode === 'general' ? 'text-indigo-600' : 'text-slate-400')} />
                  <span>NEXORBIT AI</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={currentMode === 'connected'}
                  onClick={() => setCurrentMode('connected')}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 whitespace-nowrap cursor-pointer',
                    currentMode === 'connected'
                      ? 'bg-white text-indigo-950 shadow-2xs border border-indigo-100/80'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                  )}
                >
                  <Globe className={cn('h-3.5 w-3.5', currentMode === 'connected' ? 'text-indigo-600' : 'text-slate-400')} />
                  <span>My Connected World</span>
                </button>
              </div>

              {/* Action Buttons: Attach (+), Voice (Mic), Send */}
              <div className="flex items-center gap-2 shrink-0 ml-auto relative">
                {/* Attach (+) Button & Dropdown Menu */}
                <div className="relative" ref={attachMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsAttachMenuOpen((prev) => !prev)}
                    className={cn(
                      'p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors cursor-pointer flex items-center gap-1 font-semibold text-xs',
                      isAttachMenuOpen && 'bg-indigo-50 text-indigo-600'
                    )}
                    title="Attach files or photos"
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                  {/* Popover Options */}
                  {isAttachMenuOpen && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl p-1.5 shadow-xl border border-slate-100 z-30 space-y-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 font-semibold transition-colors cursor-pointer text-left"
                      >
                        <ImageIcon className="h-4 w-4 text-indigo-600 shrink-0" />
                        <span>Photo / Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 font-semibold transition-colors cursor-pointer text-left"
                      >
                        <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                        <span>File / Document</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={cn(
                    'p-2 rounded-xl transition-all cursor-pointer relative',
                    isListening
                      ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-400 ring-offset-1 animate-pulse'
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80'
                  )}
                  title={isListening ? 'Stop recording' : 'Voice input'}
                >
                  {isListening ? <MicOff className="h-4 w-4 text-rose-600" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Circular Send Action Button */}
                <button
                  type="submit"
                  disabled={!commandText.trim() && attachments.length === 0}
                  className="h-10 w-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send command"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* QUICK PROMPTS (3 CLEAN RESPONSIVE PROMPT CHIPS - ZERO OVERFLOW) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mt-3.5">
          {[
            { text: 'What changed since yesterday?', mode: 'auto' as AIMode },
            { text: 'Do I have any deadline conflicts?', mode: 'connected' as AIMode },
            { text: 'What should I focus on today?', mode: 'auto' as AIMode },
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleCommandSubmit(undefined, prompt.text, prompt.mode)}
              className="p-3 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-950 text-xs sm:text-[12.5px] font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-2.5 text-left w-full group min-w-0"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. STATUS SUMMARY (4 CONSISTENT COMPACT METRIC CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6 sm:my-8 px-1">
        {[
          { label: 'Need attention', count: attentionCount, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100/80' },
          { label: 'Changed', count: changedCount, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100/80' },
          { label: 'Upcoming', count: upcomingCount, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100/80' },
          { label: 'Completed', count: completedCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100/80' }
        ].map((stat, i) => (
          <div
            key={i}
            onClick={() => {
              if (stat.label === 'Need attention') onNavigate('clean-my-day');
              else if (stat.label === 'Changed') onNavigate('what-changed');
              else if (stat.label === 'Upcoming') onOpenConnector('calendar');
              else addToast({ type: 'success', title: 'Completed Tasks', description: `${completedCount} tasks successfully finished.` });
            }}
            className={cn(
              'flex items-center justify-between p-4 rounded-3xl border bg-white shadow-2xs hover:shadow-sm transition-all cursor-pointer group',
              stat.border
            )}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={cn('h-10 w-10 rounded-2xl flex items-center justify-center shrink-0', stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-extrabold text-slate-950 font-mono leading-none">{stat.count}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1 truncate">{stat.label}</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>
        ))}
      </div>

      {/* 5. MAIN CONTENT REGION (TODAY'S FOCUS + WHAT CHANGED & CLEAN MY DAY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1">
        
        {/* TODAY'S FOCUS (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-indigo-100 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[17px] text-slate-950 tracking-tight">
                  Today&apos;s Focus
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Things that may need your attention.
                </p>
              </div>
              <button
                onClick={() => onNavigate('clean-my-day')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View all</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {focusItems.length > 0 ? (
                focusItems.map((focus, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`h-10 w-10 rounded-2xl ${focus.bg} ${focus.color} flex items-center justify-center shrink-0`}>
                        <focus.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{focus.title}</div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">{focus.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (focus.action === 'Review') onNavigate('clean-my-day');
                        else if (focus.action === 'Open') handleCommandSubmit(undefined, 'Draft follow up email for Rahul');
                        else onOpenConnector('calendar');
                      }}
                      className="shrink-0 text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-3xs px-3.5 py-1.5 rounded-xl group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{focus.action}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs space-y-2">
                  <p>No active focus items indexes.</p>
                  <button
                    onClick={() => onNavigate('connected-apps')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-block"
                  >
                    Connect Gmail or Google Calendar to sync your schedule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN (lg:col-span-4): WHAT CHANGED + CLEAN MY DAY */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* WHAT CHANGED */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-indigo-100 hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[15px] text-slate-950 tracking-tight">
                    What Changed
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Recent updates since your last visit.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('what-changed')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View all</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {recentChanges.length > 0 ? (
                  recentChanges.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => onNavigate('what-changed')}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{item.desc}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 font-medium">{item.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    No recent updates. Connect your workspace integrations to start tracking changes.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CLEAN MY DAY CARD */}
          <div className="relative bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/30 rounded-3xl p-5 border border-indigo-100/60 shadow-[0_4px_24px_rgba(99,102,241,0.04)] hover:shadow-sm transition-all duration-200 flex flex-col justify-between space-y-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 blur-2xl rounded-full -mr-10 -mt-10" />
            
            <div className="space-y-1 relative z-10">
              <h3 className="font-bold text-[17px] text-slate-950 tracking-tight">
                Need a clearer day?
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Let NEXORBIT decide what matters.
              </p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => onNavigate('clean-my-day')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[13px] py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-md shadow-indigo-600/20 active:scale-[0.98]"
              >
                <span>Clean My Day</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. UPCOMING SECTION */}
      <div className="mt-6 sm:mt-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[17px] text-slate-950 tracking-tight">
              Upcoming
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your next events and commitments.
            </p>
          </div>
          <button
            onClick={() => onOpenConnector('calendar')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View full calendar</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((item, i) => (
              <div
                key={i}
                onClick={() => onOpenConnector('calendar')}
                className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {item.time}
                  </span>
                  <div className={`h-8 w-8 rounded-xl bg-slate-50 group-hover:bg-white ${item.color} flex items-center justify-center transition-colors`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {item.source}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs flex flex-col justify-center items-center gap-2 min-h-[120px] col-span-1 sm:col-span-2 lg:col-span-3">
              <p>No synced calendar events today.</p>
              <button
                onClick={() => onOpenConnector('calendar')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                + Connect Google Calendar
              </button>
            </div>
          )}

          {/* Add more card */}
          <div
            onClick={() => onOpenConnector('calendar')}
            className="p-4 rounded-2xl border border-dashed border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 text-xs font-semibold"
          >
            <span>+ Add more</span>
          </div>
        </div>
      </div>

      {/* 7. BOTTOM BRAND STATEMENT */}
      <div className="relative text-center mt-10 pt-4 px-4">
        <p className="text-xs sm:text-sm text-slate-500 font-normal tracking-tight">
          <strong className="font-bold text-slate-900">NEXORBIT</strong> works across your world to deliver clarity.{' '}
          <span className="text-indigo-600 font-normal">✦</span>
        </p>
      </div>
    </div>
  );
};

