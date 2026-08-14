'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Brain,
  Shield,
  LayoutGrid,
  Bell,
  Palette,
  Keyboard,
  CreditCard,
  Code2,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  Sparkles,
  Plus,
  Search,
  Check,
  CheckCircle2,
  Activity,
  Cpu,
  Layers,
  Wifi,
  Mail,
  Calendar,
  HardDrive,
  BookOpen,
  MessageSquare,
  GitBranch,
  Info,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Copy,
} from 'lucide-react';

import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

// Import Types
import {
  SettingsTabId,
  UserProfile,
  GeneralPreferences,
  AIBrainPreferences,
  PrivacyPreferences,
  NotificationPreferences,
} from './types';

// Import Modular Components
import { SettingsBackgroundArt } from './SettingsBackgroundArt';
import { SettingsHeader } from './SettingsHeader';
import { SettingsSectionNav } from './SettingsSectionNav';
import { ProfileCard } from './general/ProfileCard';
import { LanguageSetting } from './general/LanguageSetting';
import { StartupViewSelector } from './general/StartupViewSelector';
import { TimezoneSelector } from './general/TimezoneSelector';
import { DateFormatSelector } from './general/DateFormatSelector';
import { ConnectedAppsCard } from './general/ConnectedAppsCard';
import { StorageUsageCard } from './general/StorageUsageCard';
import { DataControlsCard } from './general/DataControlsCard';
import { DangerZone } from './general/DangerZone';
import { EditProfileModal } from './modals/EditProfileModal';

export interface SettingsViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onNavigate,
  className,
}) => {
  const { addToast } = useToast();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<SettingsTabId>('general');

  // Modals Toggles
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // ==========================================
  // STATE MANAGEMENT FOR PREFERENCES
  // ==========================================

  // 1. User Profile State
  const [user, setUser] = useState<UserProfile>({
    name: 'Satyam Origin',
    email: 'hello.skyorigin@gmail.com',
    role: 'Workspace Architect',
    nexorbitId: 'NEX-9842-X',
    memberSince: 'May 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80&sig=42',
    timezone: 'Asia/Kolkata',
  });

  // 2. General Preferences State
  const [generalPrefs, setGeneralPrefs] = useState<GeneralPreferences>({
    language: 'en-US',
    theme: 'light',
    startupView: 'clean-my-day',
    timezone: 'Asia/Kolkata',
    dateFormat: 'MMM D, YYYY',
  });

  // 3. AI Brain Preferences State
  const [aiPrefs, setAiPrefs] = useState<AIBrainPreferences>({
    model: 'gemini-3.5-flash',
    reasoningLevel: 'balanced',
    proactiveSuggestions: true,
    contextWindow: 15000,
    customPersona: 'Act as a professional Executive Workspace Assistant. Prioritize high-impact calendar conflicts and upcoming deadlines. Keep summaries bulleted.',
    autoExtractEntities: true,
  });

  // 4. Privacy Preferences State
  const [privacyPrefs, setPrivacyPrefs] = useState<PrivacyPreferences>({
    zeroTraining: true,
    localVectorEncryption: true,
    retentionDays: 30,
    telemetryConsent: false,
    autoPurgeHistory: false,
  });

  // 5. Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    dailyDigest: true,
    digestTime: '08:30',
    calendarAlerts: true,
    urgentConflicts: true,
    emailNotifications: true,
    weeklyInsights: false,
  });

  // 6. Appearance Extras State
  const [density, setDensity] = useState<'compact' | 'balanced' | 'comfortable'>('balanced');
  const [fontPairing, setFontPairing] = useState<'sans' | 'serif' | 'mono'>('sans');

  // 7. Shortcuts Customization State
  const [editingShortcutId, setEditingShortcutId] = useState<string | null>(null);
  const [shortcuts, setShortcuts] = useState([
    { id: 'ask-my-world', name: 'Open Ask My World', key: 'Ctrl + K', osIcon: '⌃K' },
    { id: 'toggle-dark', name: 'Toggle Dark Mode', key: 'Cmd + Shift + L', osIcon: '⌘⇧L' },
    { id: 'clean-day', name: 'Clean My Day', key: 'Alt + F', osIcon: '⌥F' },
    { id: 'memory-view', name: 'Open Memory View', key: 'Ctrl + M', osIcon: '⌃M' },
  ]);

  // 8. Billing / Plan State
  const [cardEnding, setCardEnding] = useState('4242');
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [tempCardDigits, setTempCardDigits] = useState('4242');
  const invoices = [
    { id: 'INV-2026-004', date: 'May 01, 2026', amount: '$15.00', status: 'Paid' },
    { id: 'INV-2026-003', date: 'Apr 01, 2026', amount: '$15.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Mar 01, 2026', amount: '$15.00', status: 'Paid' },
  ];

  // 9. Advanced / Labs State
  const [labsVoice, setLabsVoice] = useState(true);
  const [labsCollab, setLabsCollab] = useState(false);
  const [labsSearchGrounding, setLabsSearchGrounding] = useState(true);
  const [logs, setLogs] = useState<string[]>(() => [
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Nexorbit AI Engine Boot Sequence Completed.`,
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Tenant vector storage mounted at zero-data local isolation node.`,
    `[${new Date().toLocaleTimeString()}] [SYSTEM] All API connections status verified: 100% operational.`,
  ]);
  const [isLoggingPaused, setIsLoggingPaused] = useState(false);
  const logTerminalRef = useRef<HTMLDivElement>(null);

  // Connected Apps statuses
  const [appConnections, setAppConnections] = useState<Record<string, boolean>>({
    gmail: true,
    calendar: true,
    drive: true,
    notion: true,
    slack: false,
    github: false,
  });

  // Handle live logs update for the Advanced tab
  useEffect(() => {
    if (activeTab !== 'advanced' || isLoggingPaused) return;

    const phrases = [
      '[INFO] Syncing context nodes with vector memory storage...',
      '[SUCCESS] Synchronized Google Calendar workspace: 18 nodes processed.',
      '[INFO] Generating vector embeddings for speculative document chunks...',
      '[DEBUG] Context recall search finished in 88ms.',
      '[INFO] Parsing incoming email streams for high-priority actionables...',
      '[WARNING] High-priority scheduled meeting conflict detected on Friday.',
      '[SUCCESS] Gemini reasoning graph recalculated successfully.',
      '[INFO] Purging older transient context frames (zero-data footprint policy)...',
    ];

    const generateLog = () => {
      const time = new Date().toLocaleTimeString();
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setLogs((prev) => [...prev.slice(-30), `[${time}] ${randomPhrase}`]);
    };

    const interval = setInterval(generateLog, 3000);
    return () => clearInterval(interval);
  }, [activeTab, isLoggingPaused]);

  // Auto scroll logs console to bottom
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Key recording listener for custom shortcuts
  useEffect(() => {
    if (!editingShortcutId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const keys: string[] = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.metaKey) keys.push('Cmd');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');

      // Avoid alone modifiers
      const keyName = e.key;
      if (
        keyName !== 'Control' &&
        keyName !== 'Shift' &&
        keyName !== 'Alt' &&
        keyName !== 'Meta'
      ) {
        keys.push(keyName.length === 1 ? keyName.toUpperCase() : keyName);
      }

      if (keys.length > 0) {
        const fullKey = keys.join(' + ');
        const osIcon = keys
          .map((k) => {
            if (k === 'Ctrl') return '⌃';
            if (k === 'Cmd') return '⌘';
            if (k === 'Shift') return '⇧';
            if (k === 'Alt') return '⌥';
            return k;
          })
          .join('');

        setShortcuts((prev) =>
          prev.map((s) =>
            s.id === editingShortcutId ? { ...s, key: fullKey, osIcon } : s
          )
        );
        addToast({
          type: 'success',
          title: 'Shortcut updated',
          description: `Keybind is now mapped to: ${fullKey}`,
        });
        setEditingShortcutId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [editingShortcutId, addToast]);

  // General global saves
  const handleSavePreferences = () => {
    addToast({
      type: 'success',
      title: 'Preferences Synchronized',
      description: 'Your workspace settings are fully stored and live across Nexorbit.',
    });
  };

  const toggleConnection = (id: string) => {
    const isConnected = appConnections[id];
    if (isConnected) {
      setAppConnections((prev) => ({ ...prev, [id]: false }));
      addToast({
        type: 'info',
        title: 'App Disconnected',
        description: `Permanently disconnected and revoked scopes for ${id.toUpperCase()}.`,
      });
    } else {
      addToast({
        type: 'info',
        title: 'Authenticating...',
        description: `Initializing secure OAuth handshakes for ${id.toUpperCase()}`,
      });
      setTimeout(() => {
        setAppConnections((prev) => ({ ...prev, [id]: true }));
        addToast({
          type: 'success',
          title: 'App Synchronized',
          description: `Connected ${id.toUpperCase()} successfully to your vector memory space.`,
        });
      }, 1000);
    }
  };

  return (
    <div className={cn('relative min-h-[calc(100vh-6rem)] w-full flex flex-col', className)}>
      {/* Visual background node artwork */}
      <SettingsBackgroundArt />

      {/* Settings Header bar (Title + theme mode toggle quick-links) */}
      <SettingsHeader
        user={user}
        onEditProfile={() => setIsProfileModalOpen(true)}
        className="mb-4 relative z-10"
      />

      {/* Main Settings Frame Body */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 relative z-10">
        {/* Left Section navigation column */}
        <div className="w-full lg:w-[260px] shrink-0">
          <SettingsSectionNav
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        </div>

        {/* Right content view area */}
        <div className="flex-1 min-w-0 flex flex-col gap-5 pb-12">
          {/* Active Tab rendering */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Profile card span 12 */}
              <div className="lg:col-span-12">
                <ProfileCard
                  user={user}
                  onEditProfile={() => setIsProfileModalOpen(true)}
                />
              </div>

              {/* 2-Column layout for language & timezone */}
              <div className="lg:col-span-6">
                <LanguageSetting
                  currentLanguage={generalPrefs.language}
                  onChangeLanguage={(lang) => setGeneralPrefs({ ...generalPrefs, language: lang })}
                />
              </div>
              <div className="lg:col-span-6">
                <StartupViewSelector
                  currentView={generalPrefs.startupView}
                  onChangeView={(view) => setGeneralPrefs({ ...generalPrefs, startupView: view })}
                />
              </div>

              <div className="lg:col-span-6">
                <TimezoneSelector
                  currentTimezone={generalPrefs.timezone}
                  onChangeTimezone={(tz) => setGeneralPrefs({ ...generalPrefs, timezone: tz })}
                />
              </div>
              <div className="lg:col-span-6">
                <DateFormatSelector
                  currentFormat={generalPrefs.dateFormat}
                  onChangeFormat={(fmt) => setGeneralPrefs({ ...generalPrefs, dateFormat: fmt })}
                />
              </div>

              {/* Connected apps inline mini-dashboard preview */}
              <div className="lg:col-span-6">
                <ConnectedAppsCard onManageClick={() => setActiveTab('connected-apps')} />
              </div>
              <div className="lg:col-span-6">
                <StorageUsageCard onViewDetails={() => setActiveTab('advanced')} />
              </div>

              {/* Data controls & Danger Zone */}
              <div className="lg:col-span-6">
                <DataControlsCard
                  onExportClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Export Initiated',
                      description: 'Generating full memory workspace ZIP archive...',
                    });
                    setTimeout(() => {
                      addToast({
                        type: 'success',
                        title: 'Export Complete',
                        description: 'Nexorbit_Workspace_Export.zip downloaded successfully.',
                      });
                    }, 1500);
                  }}
                  onImportClick={() => {}} // Handled internally inside the component ref trigger
                  onClearBrowsingClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Cache Purged',
                      description: 'Successfully cleared transient HTML indexes.',
                    });
                  }}
                  onManageMemoryClick={() => {
                    if (onNavigate) onNavigate('memory');
                  }}
                />
              </div>
              <div className="lg:col-span-6">
                <DangerZone
                  onDeleteAllData={() => {
                    addToast({
                      type: 'error',
                      title: 'Factory Reset Triggered',
                      description: 'Are you absolutely sure? This will wipe all memory embeddings.',
                    });
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'ai-brain' && (
            <div className="space-y-5">
              {/* Model Select */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    AI Engine Model
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Select the brain model driving all search synthesizers and digests.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'gemini-3.5-flash',
                      label: 'Gemini 3.5 Flash',
                      desc: 'Optimized speed and agility for summaries and parsing logs.',
                    },
                    {
                      id: 'gemini-3.5-pro',
                      label: 'Gemini 3.5 Pro',
                      desc: 'Advanced contextual reasoning, deep planning, and complex analysis.',
                    },
                    {
                      id: 'gemini-ultra-reasoning',
                      label: 'Gemini Ultra Reasoning',
                      desc: 'Uncompromised multi-step logic. Highest mathematical precision.',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAiPrefs({ ...aiPrefs, model: opt.id as any })}
                      className={cn(
                        'p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer h-32 group relative select-none',
                        aiPrefs.model === opt.id
                          ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/25 ring-1 ring-indigo-500 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-100/50 dark:hover:bg-slate-800/60'
                      )}
                    >
                      {aiPrefs.model === opt.id && (
                        <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal mt-2 block font-medium">
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Depth Reasoning Scale */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Reasoning Strategy
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Control latency budget vs inference computation depth.
                  </p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-fit">
                  {[
                    { id: 'instant', label: 'Instant', note: 'Fast answers' },
                    { id: 'balanced', label: 'Balanced', note: 'Smart & quick' },
                    { id: 'deep', label: 'Deep', note: 'Maximum logic' },
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setAiPrefs({ ...aiPrefs, reasoningLevel: level.id as any })}
                      className={cn(
                        'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative',
                        aiPrefs.reasoningLevel === level.id
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/60 dark:border-slate-800/80'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Persona Custom Instructions */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Custom Persona Guidelines
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Override default system instruction blocks to custom shape the AI tone.
                  </p>
                </div>
                <textarea
                  value={aiPrefs.customPersona}
                  onChange={(e) => setAiPrefs({ ...aiPrefs, customPersona: e.target.value })}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed"
                  placeholder="Tell Nexorbit how you want it to act, prioritize, summarize, or talk..."
                />
              </div>

              {/* Context Limit & Suggestions */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-5">
                {/* Context range slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200 block">
                        Vector recall limit
                      </span>
                      <span className="text-[11px] text-slate-450 dark:text-slate-500">
                        Maximum document contexts parsed simultaneously.
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 px-2.5 py-1 rounded-xl">
                      {aiPrefs.contextWindow.toLocaleString()} items
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={aiPrefs.contextWindow}
                    onChange={(e) => setAiPrefs({ ...aiPrefs, contextWindow: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600 focus:outline-hidden"
                  />
                </div>

                {/* Switch 1: proactive suggestions */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Proactive Context Suggestions
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Enable Nexorbit to auto-highlight scheduling warnings on startup.
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={aiPrefs.proactiveSuggestions}
                    onClick={() => setAiPrefs({ ...aiPrefs, proactiveSuggestions: !aiPrefs.proactiveSuggestions })}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                      aiPrefs.proactiveSuggestions ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                        aiPrefs.proactiveSuggestions ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>

                {/* Switch 2: auto entities */}
                <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Auto-Extract Entities
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Identify metadata elements (roles, organizations, metrics) in newly uploaded attachments.
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={aiPrefs.autoExtractEntities}
                    onClick={() => setAiPrefs({ ...aiPrefs, autoExtractEntities: !aiPrefs.autoExtractEntities })}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                      aiPrefs.autoExtractEntities ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                        aiPrefs.autoExtractEntities ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save AI Configuration</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data-privacy' && (
            <div className="space-y-5">
              {/* Privacy protection panel */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div className="flex items-center gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/40 rounded-2xl">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block">
                      Local Vector Separation
                    </span>
                    <span className="text-[11px] text-indigo-700/80 dark:text-indigo-400 font-medium">
                      Your files and data threads are contained inside isolated local sandbox volumes.
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Toggle 1: Zero Training */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Zero Training Data Footprint
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Opt out completely from sharing anonymous interactions or indexes to train models.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={privacyPrefs.zeroTraining}
                      onClick={() => setPrivacyPrefs({ ...privacyPrefs, zeroTraining: !privacyPrefs.zeroTraining })}
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        privacyPrefs.zeroTraining ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          privacyPrefs.zeroTraining ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  {/* Toggle 2: Local Encryption */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Local Vector Encryption
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Encrypt embedding logs at rest using standard AES-GCM on-device partitions.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={privacyPrefs.localVectorEncryption}
                      onClick={() =>
                        setPrivacyPrefs({ ...privacyPrefs, localVectorEncryption: !privacyPrefs.localVectorEncryption })
                      }
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        privacyPrefs.localVectorEncryption ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          privacyPrefs.localVectorEncryption ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  {/* Toggle 3: Telemetry */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Anonymous Telemetry logs
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Share diagnostic performance metrics to help engineers optimize processing speed.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={privacyPrefs.telemetryConsent}
                      onClick={() => setPrivacyPrefs({ ...privacyPrefs, telemetryConsent: !privacyPrefs.telemetryConsent })}
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        privacyPrefs.telemetryConsent ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          privacyPrefs.telemetryConsent ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Purge controls */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Data Retention &amp; Automatic Purge
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Configure automated timeline expiration criteria for indexed items.
                  </p>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Auto-Purge Inactive Memory
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Delete parsed document logs if unqueried for long durations.
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={privacyPrefs.autoPurgeHistory}
                    onClick={() => setPrivacyPrefs({ ...privacyPrefs, autoPurgeHistory: !privacyPrefs.autoPurgeHistory })}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                      privacyPrefs.autoPurgeHistory ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                        privacyPrefs.autoPurgeHistory ? 'translate-x-4' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>

                {privacyPrefs.autoPurgeHistory && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Retention Window length
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Automatically clear inactive memory older than:
                      </span>
                    </div>
                    <select
                      value={privacyPrefs.retentionDays}
                      onChange={(e) => setPrivacyPrefs({ ...privacyPrefs, retentionDays: parseInt(e.target.value) })}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    >
                      <option value={7}>7 Days (Strict)</option>
                      <option value={30}>30 Days (Standard)</option>
                      <option value={90}>90 Days (Generous)</option>
                      <option value={365}>365 Days (Archival)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Privacy Profile Exported',
                      description: 'Generating compliance manifest file...',
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Download GDPR Report
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save Privacy Settings</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'connected-apps' && (
            <div className="space-y-5">
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    External Application Connections
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Authorise Nexorbit to construct contextual search graphs across your services.
                  </p>
                </div>

                {/* List of 6 integration platforms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {[
                    {
                      id: 'gmail',
                      name: 'Gmail Suite',
                      desc: 'Index email threads and parse project specifications.',
                      icon: <Mail className="h-5 w-5" />,
                      color: 'bg-red-50 text-red-600 dark:bg-red-950/35 dark:text-red-400 border-red-100 dark:border-red-900/30',
                    },
                    {
                      id: 'calendar',
                      name: 'Google Calendar',
                      desc: 'Scan schedules and automatically highlight conflicts.',
                      icon: <Calendar className="h-5 w-5" />,
                      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/35 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
                    },
                    {
                      id: 'drive',
                      name: 'Google Drive',
                      desc: 'Ingest reference PDFs, spreadsheets, and specifications.',
                      icon: <HardDrive className="h-5 w-5" />,
                      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/35 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
                    },
                    {
                      id: 'notion',
                      name: 'Notion Workspace',
                      desc: 'Synchronize document pages and planning trackers.',
                      icon: <BookOpen className="h-5 w-5" />,
                      color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
                    },
                    {
                      id: 'slack',
                      name: 'Slack Messages',
                      desc: 'Monitor workspace channels for urgent action items.',
                      icon: <MessageSquare className="h-5 w-5" />,
                      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/35 dark:text-purple-400 border-purple-100 dark:border-purple-900/30',
                    },
                    {
                      id: 'github',
                      name: 'GitHub Repositories',
                      desc: 'Track commit history, issues, and PR statuses.',
                      icon: <GitBranch className="h-5 w-5" />,
                      color: 'bg-slate-900 text-white dark:bg-slate-800 border-slate-800 dark:border-slate-700',
                    },
                  ].map((app) => {
                    const isConnected = appConnections[app.id];
                    return (
                      <div
                        key={app.id}
                        className={cn(
                          'p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center border shadow-2xs', app.color)}>
                            {app.icon}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                              {app.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-snug block font-medium">
                              {app.desc}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          <span className="text-[11px] font-bold flex items-center gap-1">
                            <span className={cn('h-2 w-2 rounded-full', isConnected ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')} />
                            <span className={isConnected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                              {isConnected ? 'Active Sync' : 'Disconnected'}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleConnection(app.id)}
                            className={cn(
                              'px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-2xs cursor-pointer transition-colors',
                              isConnected
                                ? 'bg-red-50 hover:bg-red-100/80 text-red-700 border border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            )}
                          >
                            {isConnected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              {/* Notification priorities */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Workspace Briefing Delivery
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Select exactly when and how you receive workspace logs and daily focus briefings.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Toggle 1: Daily Focus Digest */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Morning Focus Digest
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Deliver a consolidated overview of today&apos;s key tasks and action items.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationPrefs.dailyDigest}
                      onClick={() =>
                        setNotificationPrefs({ ...notificationPrefs, dailyDigest: !notificationPrefs.dailyDigest })
                      }
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        notificationPrefs.dailyDigest ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          notificationPrefs.dailyDigest ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  {/* Nested time picker */}
                  {notificationPrefs.dailyDigest && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                            Digest Delivery Time
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            Preferred arrival in inbox:
                          </span>
                        </div>
                      </div>
                      <input
                        type="time"
                        value={notificationPrefs.digestTime}
                        onChange={(e) => setNotificationPrefs({ ...notificationPrefs, digestTime: e.target.value })}
                        className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {/* Toggle 2: Calendar Alerts */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Calendar Conflict Warnings
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Trigger urgent banners when scheduling overlaps occur.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationPrefs.calendarAlerts}
                      onClick={() =>
                        setNotificationPrefs({ ...notificationPrefs, calendarAlerts: !notificationPrefs.calendarAlerts })
                      }
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        notificationPrefs.calendarAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          notificationPrefs.calendarAlerts ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  {/* Toggle 3: Email notifications */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Direct Email Notifications
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Receive system announcements, billing updates, and account details.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationPrefs.emailNotifications}
                      onClick={() =>
                        setNotificationPrefs({ ...notificationPrefs, emailNotifications: !notificationPrefs.emailNotifications })
                      }
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        notificationPrefs.emailNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          notificationPrefs.emailNotifications ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  {/* Toggle 4: Weekly Insights */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Weekly Efficiency Insights
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Receive a weekly efficiency graph reporting context recall savings.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationPrefs.weeklyInsights}
                      onClick={() =>
                        setNotificationPrefs({ ...notificationPrefs, weeklyInsights: !notificationPrefs.weeklyInsights })
                      }
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        notificationPrefs.weeklyInsights ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          notificationPrefs.weeklyInsights ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom save */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'interface' && (
            <div className="space-y-5">
              {/* Density selection */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Workspace layout density
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Adjust interface padding math to suit your reading comfort.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'compact', label: 'Compact', note: 'Dense, focused metadata' },
                    { id: 'balanced', label: 'Balanced', note: 'Standard comfortable layout' },
                    { id: 'comfortable', label: 'Spacious', note: 'Generous blank spacing' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setDensity(opt.id as any);
                        addToast({
                          type: 'success',
                          title: 'Density Applied',
                          description: `Switched layout metric density to ${opt.label}.`,
                        });
                      }}
                      className={cn(
                        'p-4 rounded-2xl border text-center transition-all cursor-pointer relative',
                        density === opt.id
                          ? 'bg-indigo-50/50 border-indigo-500 dark:bg-indigo-950/25 dark:border-indigo-500 shadow-2xs ring-1 ring-indigo-500'
                          : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50'
                      )}
                    >
                      <span className="text-xs font-bold text-slate-850 dark:text-slate-100 block">
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        {opt.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography pairing */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Font System Pairings
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Select modern visual pairing palettes to style Nexorbit.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'sans', label: 'Plus Jakarta & Playfair Display', example: 'Elegant displays, legible lists' },
                    { id: 'serif', label: 'Merriweather & Inter Sans', example: 'Highly legible long-form blog styles' },
                    { id: 'mono', label: 'Fira Code & Geist Mono', example: 'Technical look with clean tabular grids' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setFontPairing(opt.id as any);
                        addToast({
                          type: 'success',
                          title: 'Typography Configured',
                          description: `Setting interface font engine family.`,
                        });
                      }}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-colors cursor-pointer',
                        fontPairing === opt.id
                          ? 'bg-indigo-50/40 border-indigo-500 dark:bg-indigo-950/20 dark:border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50'
                      )}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                          {opt.example}
                        </span>
                      </div>
                      {fontPairing === opt.id && (
                        <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-5">
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Keyboard Shortcut Keybinds
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Customise key layouts for swift workspace navigations. Click on any shortcut row to record a new mapping.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  {shortcuts.map((shortcut) => {
                    const isRecording = editingShortcutId === shortcut.id;
                    return (
                      <div
                        key={shortcut.id}
                        onClick={() => setEditingShortcutId(shortcut.id)}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group relative',
                          isRecording
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/50'
                            : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Keyboard className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {shortcut.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isRecording ? (
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 animate-pulse bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-150 px-2.5 py-1 rounded-xl">
                              Press keys now...
                            </span>
                          ) : (
                            <kbd className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-700 dark:text-slate-300 shadow-3xs group-hover:border-indigo-300 transition-all">
                              {shortcut.osIcon}
                            </kbd>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-5">
              {/* Pro plan badge */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-48">
                <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-6 rotate-12 opacity-15">
                  <svg width="240" height="240" fill="white" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" />
                  </svg>
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-widest font-extrabold text-indigo-100 bg-indigo-700/50 border border-indigo-400/30 px-2.5 py-1 rounded-full w-fit">
                      Premium Enterprise Plan
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mt-2.5">
                      Satyam Workspace Pro
                    </h3>
                  </div>
                  <Zap className="h-6 w-6 text-indigo-200 animate-pulse fill-indigo-200" />
                </div>

                <div className="flex items-end justify-between relative z-10 pt-4 border-t border-white/20">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-indigo-100 block">Subscription Cost</span>
                    <span className="text-lg sm:text-xl font-black">
                      $15.00 <span className="text-xs font-medium text-indigo-200">/ month</span>
                    </span>
                  </div>

                  <span className="text-[11px] font-bold bg-white/25 text-white border border-white/30 px-3 py-1.5 rounded-xl">
                    Renews Jun 01, 2026
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                      Credit Card Details
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Update your payment credentials on file safely.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingCard) {
                        setCardEnding(tempCardDigits);
                        setIsEditingCard(false);
                        addToast({
                          type: 'success',
                          title: 'Payment Details Updated',
                          description: 'Your credit card ending was updated successfully.',
                        });
                      } else {
                        setTempCardDigits(cardEnding);
                        setIsEditingCard(true);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {isEditingCard ? 'Save card' : 'Change card'}
                  </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center font-black italic text-indigo-600 text-sm tracking-wide shadow-2xs">
                      VISA
                    </div>
                    <div>
                      {isEditingCard ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-slate-400">•••• •••• ••••</span>
                          <input
                            type="text"
                            maxLength={4}
                            value={tempCardDigits}
                            onChange={(e) => setTempCardDigits(e.target.value.replace(/\D/g, ''))}
                            className="w-12 px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200 rounded-md focus:outline-hidden"
                          />
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                            •••• •••• •••• {cardEnding}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">Expires 09/28</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Billing Invoice History
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    View and export your historic subscription billing statements.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {inv.id}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {inv.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">
                          {inv.amount}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            addToast({
                              type: 'success',
                              title: 'Invoice PDF Export',
                              description: `Successfully downloaded statement ${inv.id}.`,
                            });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-3xs cursor-pointer"
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-5">
              {/* Feature Flags */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Nexorbit Laboratory &amp; Beta features
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Experiment with highly prospective advanced research features before public rollout.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Flag 1: Voice Synthesis */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Interactive Voice Synthesis
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Enable experimental Text-to-Speech playback widgets on summaries.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={labsVoice}
                      onClick={() => setLabsVoice(!labsVoice)}
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        labsVoice ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          labsVoice ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  {/* Flag 2: Multiplayer collab */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Real-time Multi-User Sync
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Synthesize joint calendar and collaborative workspace nodes in live sync.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={labsCollab}
                      onClick={() => setLabsCollab(!labsCollab)}
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        labsCollab ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          labsCollab ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>

                  {/* Flag 3: Grounding */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Web Search Grounding Engine
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Incorporate real-time external web query data to ground speculative insights.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={labsSearchGrounding}
                      onClick={() => setLabsSearchGrounding(!labsSearchGrounding)}
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                        labsSearchGrounding ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                          labsSearchGrounding ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Console log console output terminal */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 text-slate-800 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                      <span>Live Indexing Stream Console</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Monitor processing logs generated by context parsing in real-time.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLogs([]);
                        addToast({
                          type: 'info',
                          title: 'Logs Cleared',
                          description: 'Terminal console buffer emptied.',
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200 flex items-center gap-1 cursor-pointer shadow-3xs"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Clear</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggingPaused(!isLoggingPaused);
                        addToast({
                          type: 'info',
                          title: isLoggingPaused ? 'Stream Resumed' : 'Stream Paused',
                          description: isLoggingPaused
                            ? 'Indexing logs flowing again.'
                            : 'Log feed stream has been frozen.',
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200 flex items-center gap-1 cursor-pointer shadow-3xs"
                    >
                      <Play className="h-3 w-3" />
                      <span>{isLoggingPaused ? 'Resume' : 'Pause'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText(logs.join('\n'));
                          addToast({
                            type: 'success',
                            title: 'Logs Copied',
                            description: 'All terminal lines copied to your system clipboard.',
                          });
                        } catch {
                          // Ignore
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200 flex items-center gap-1 cursor-pointer shadow-3xs"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Console text box */}
                <div
                  ref={logTerminalRef}
                  className="h-48 rounded-2xl bg-white border border-slate-200 p-4 font-mono text-[10px] sm:text-xs leading-relaxed overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200"
                >
                  {logs.length === 0 ? (
                    <div className="text-slate-400 italic text-center pt-16">Terminal console is empty. Waiting for logs...</div>
                  ) : (
                    logs.map((log, index) => {
                      let color = 'text-slate-600';
                      if (log.includes('[SUCCESS]')) color = 'text-emerald-600 font-semibold';
                      if (log.includes('[WARNING]')) color = 'text-amber-600 font-semibold';
                      if (log.includes('[ERROR]')) color = 'text-rose-600 font-semibold';
                      if (log.includes('[DEBUG]')) color = 'text-sky-600';
                      if (log.includes('[SYSTEM]')) color = 'text-indigo-600 font-semibold';

                      return (
                        <div key={index} className={cn('whitespace-pre-wrap font-mono', color)}>
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSave={(updated) => setUser(updated)}
      />
    </div>
  );
};
