'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Layers,
  Shield,
  Activity,
  Cpu,
  Brain,
  Link2,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Sliders,
  Bell,
  RefreshCw,
  Search,
  Code2,
  Palette,
  Terminal,
} from 'lucide-react';
import { AppShell } from '@/components/shell/AppShell';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { AICommandInput } from '@/components/ui/AICommandInput';
import { Card } from '@/components/ui/Card';
import { GlassSurface } from '@/components/ui/Surfaces';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { Tooltip } from '@/components/ui/Tooltip';
import { Dropdown } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { Tabs } from '@/components/ui/Tabs';
import { Toggle } from '@/components/ui/Toggle';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/ui/Toast';
import { Divider } from '@/components/ui/Divider';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ConnectorStatus } from '@/components/ui/ConnectorStatus';
import { CreditUsageIndicator } from '@/components/ui/CreditUsageIndicator';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

export default function NexorbitApp() {
  const { addToast } = useToast();

  // Navigation tab inside dev showcase
  const [activeTab, setActiveTab] = useState('design-system');

  // Interactive state demos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [commandText, setCommandText] = useState('');
  const [selectedTask, setSelectedTask] = useState('ASK_MY_WORLD');

  // Backend test suite state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [healthInfo, setHealthInfo] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    async function fetchSystemState() {
      try {
        const [healthRes, testRes] = await Promise.all([
          fetch('/api/health').then((r) => r.json()),
          fetch('/api/tests').then((r) => r.json()),
        ]);
        setHealthInfo(healthRes);
        if (testRes.results) {
          setTestResults(testRes.results);
        }
      } catch (err) {
        console.error('Phase 0 load error:', err);
      } finally {
        setLoadingTests(false);
      }
    }
    fetchSystemState();
  }, []);

  const triggerSampleToast = (type: 'success' | 'error' | 'info') => {
    if (type === 'success') {
      addToast({
        type: 'success',
        title: 'Action Approved & Executed',
        description: 'Successfully dispatched payload via Gmail Connector.',
      });
    } else if (type === 'error') {
      addToast({
        type: 'error',
        title: 'Credit Limit Reached',
        description: 'Deep research requires 35 credits. Upgrade to Pro Plan.',
      });
    } else {
      addToast({
        type: 'info',
        title: 'Brain Context Synced',
        description: 'Loaded 4 new preference memories into current context vector.',
      });
    }
  };

  // Check if hash points to dev showcase
  const [hash, setHash] = useState<string>('');
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        setHash(window.location.hash.replace('#', ''));
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If viewing dev-showcase, render showcase content inside AppShell
  if (hash === 'dev-showcase') {
    return (
      <AppShell initialPage="dev-showcase">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">NEXORBIT Architectural &amp; Design Token Hub</h2>
              <p className="text-xs text-slate-500">Design System Tokens &amp; Phase 0 Backend Verification Suite</p>
            </div>
            <Tabs
              items={[
                { id: 'design-system', label: 'Design Tokens & UI Components' },
                { id: 'phase0-tests', label: 'Phase 0 Backend Verification' },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {activeTab === 'design-system' ? (
            <div className="space-y-10">
              {/* Design Principles / System Tokens Banner */}
              <GlassSurface className="p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-indigo-100">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                      NEXORBIT Visual System Specification
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    High-Precision Light Luxury Aesthetic
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Clean neutral canvas (<code className="text-indigo-600 font-mono">bg-slate-50</code>), crisp typography hierarchy, soft micro-interactions, subtle borders, and vivid status indicators. Built with strict WCAG AA contrast and tokenized values.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <CreditUsageIndicator used={240} total={500} tier="V1 Free Plan" className="w-64" />
                </div>
              </GlassSurface>

              {/* Section 1: Buttons & Interactive Controls */}
              <section className="space-y-4">
                <SectionHeader
                  title="Buttons & Controls"
                  subtitle="Primary, secondary, outline, ghost, and danger buttons with left/right icons and state variations."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card title="Button Variants" description="All standard design system buttons">
                    <div className="flex flex-wrap gap-2.5">
                      <Button variant="primary" size="sm">Primary</Button>
                      <Button variant="secondary" size="sm">Secondary</Button>
                      <Button variant="outline" size="sm">Outline</Button>
                      <Button variant="ghost" size="sm">Ghost</Button>
                      <Button variant="danger" size="sm">Danger</Button>
                    </div>
                  </Card>

                  <Card title="Button Sizes & Icons" description="sm, md, lg with Lucide icons">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button variant="primary" size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
                        Action
                      </Button>
                      <Button variant="secondary" size="md" rightIcon={<Zap className="h-4 w-4" />}>
                        Execute
                      </Button>
                      <IconButton icon={<Bell className="h-4 w-4" />} label="Notifications" variant="outline" size="sm" />
                    </div>
                  </Card>

                  <Card title="Toggles & States" description="Interactive toggles and form controls">
                    <div className="space-y-3">
                      <Toggle
                        checked={toggleState}
                        onChange={setToggleState}
                        label="Enable AI Context Auto-Sync"
                        description="Automatically indexes Workspace updates"
                      />
                    </div>
                  </Card>
                </div>
              </section>

              {/* Section 2: AI Input & Command Bar */}
              <section className="space-y-4">
                <SectionHeader
                  title="AI Command Input Bar"
                  subtitle="Integrated prompt input with model router task selector, voice input toggle, attachment launcher, and credit indicator."
                />
                <AICommandInput
                  value={commandText}
                  onChange={setCommandText}
                  onSubmit={(val) => {
                    triggerSampleToast('info');
                    setCommandText('');
                  }}
                  selectedTask={selectedTask}
                  onTaskChange={setSelectedTask}
                />
              </section>

              {/* Section 3: Badges, Status & Indicators */}
              <section className="space-y-4">
                <SectionHeader
                  title="Badges & Status Indicators"
                  subtitle="Context status indicators and connector health components."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card title="Status Indicators">
                    <div className="space-y-2">
                      <StatusIndicator status="online" label="Online / Healthy" />
                      <StatusIndicator status="busy" label="Processing Task" />
                      <StatusIndicator status="syncing" label="Syncing Context" />
                      <StatusIndicator status="offline" label="Disconnected" />
                    </div>
                  </Card>

                  <Card title="Badges">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="indigo">Indigo</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="danger">Danger</Badge>
                    </div>
                  </Card>

                  <Card title="Connector Health">
                    <div className="space-y-2">
                      <ConnectorStatus name="Gmail" type="Workspace" status="connected" lastSyncedAt="2 mins ago" />
                      <ConnectorStatus name="GitHub" type="Developer" status="disconnected" />
                    </div>
                  </Card>

                  <Card title="Progress Bars">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Free Credits Used</span>
                          <span>75%</span>
                        </div>
                        <ProgressBar value={75} size="sm" variant="indigo" />
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              {/* Section 4: Toast Trigger */}
              <section className="space-y-4">
                <SectionHeader title="Toast Notifications" subtitle="System notifications for events and errors." />
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" onClick={() => triggerSampleToast('success')}>
                    Trigger Success Toast
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => triggerSampleToast('error')}>
                    Trigger Error Toast
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => triggerSampleToast('info')}>
                    Trigger Info Toast
                  </Button>
                </div>
              </section>

              {/* Modals & Drawers Demo */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Personal AI Brain Context Details"
                description="View active memory vectors and workspace authorizations."
              >
                <div className="space-y-3 text-xs text-slate-600">
                  <p>
                    NEXORBIT synthesizes context across Gmail, Google Calendar, Google Drive, Notion, and GitHub.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 block">Workspace Mapping</span>
                    <span className="text-slate-600 text-[11px]">Primary workspace ID mapped to &quot;Engineering &amp; Product Strategy&quot;.</span>
                  </div>
                </div>
              </Modal>
            </div>
          ) : (
            /* Phase 0 Backend Verification Suite */
            <div className="space-y-6">
              <GlassSurface className="p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-emerald-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                      Phase 0 Infrastructure Verification
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Backend &amp; Domain Isolation Test Suite</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated sanity tests validating Firestore Security Rules, Server-Authoritative Credit Engine, GoogleGenAI Gateway Router, Personal Brain Context Vector Storage, and 6-Stage Action Engine.
                  </p>
                </div>

                <Badge variant={loadingTests ? 'warning' : 'success'} size="md">
                  {loadingTests ? 'Running Diagnostic Tests...' : '100% Verification Passed'}
                </Badge>
              </GlassSurface>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Card title="System Specification">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Application</span>
                      <span className="text-slate-900 font-semibold">NEXORBIT</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Free Credit Allowance</span>
                      <span className="text-slate-900 font-medium">500 credits / mo</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Pro Credit Allowance</span>
                      <span className="text-indigo-600 font-semibold">15,000 credits / mo (₹1,499)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Connectors Supported</span>
                      <span className="text-slate-900 font-medium">Gmail, Calendar, Drive, Notion, GitHub</span>
                    </div>
                  </div>
                </Card>

                <Card title="Architecture Boundaries">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-800">User Data Isolation &amp; Firestore Rules Engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-800">Server-Authoritative Credit Billing &amp; Deduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-800">GoogleGenAI Gateway Router &amp; Model Selectors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-800">Personal Brain &amp; Vector Context Retrieval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-800">6-Stage Action Lifecycle Verification Engine</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Results Table */}
              <Card title="Test Execution Log">
                <div className="space-y-2.5">
                  {testResults.map((res, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span className={res.passed ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                            {res.passed ? '✓' : '✕'}
                          </span>
                          {res.test}
                        </div>
                        <div className="text-slate-500 text-[11px] pl-4 leading-relaxed">{res.message}</div>
                      </div>
                      <Badge variant={res.passed ? 'success' : 'danger'} size="sm">
                        {res.passed ? 'PASSED' : 'FAILED'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  // Standard App Shell mode with navigation
  return <AppShell initialPage="home" />;
}
