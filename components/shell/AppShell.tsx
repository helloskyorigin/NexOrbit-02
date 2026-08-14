'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ConnectorModal, ConnectorId } from './ConnectorModal';
import { PlaceholderPage, PAGE_CONFIG } from './PlaceholderPage';
import { HomeDashboard } from '../home/HomeDashboard';
import { AskMyWorldView } from '../ask/AskMyWorldView';
import { GoalsView } from '../goals/GoalsView';
import { MemoryView } from '../memory/MemoryView';
import { ConnectedAppsView } from '../connectors/ConnectedAppsView';
import { WhatChangedView } from '../changes/WhatChangedView';
import { CleanMyDayView } from '../focus/CleanMyDayView';
import { SettingsView } from '../settings/SettingsView';
import { Drawer } from '../ui/Drawer';
import { Terminal, Palette } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface AppShellProps {
  initialPage?: string;
  children?: React.ReactNode;
  showDevTabOption?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  initialPage = 'home',
  children,
  showDevTabOption = false,
}) => {
  const [activePage, setActivePage] = useState<string>(initialPage);
  const [activeConnectorId, setActiveConnectorId] = useState<ConnectorId | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashPage = window.location.hash.replace('#', '');
      if (PAGE_CONFIG[hashPage]) {
        setTimeout(() => {
          setActivePage(hashPage);
        }, 0);
      }
    }
  }, []);

  const handleSelectPage = (pageId: string) => {
    setActivePage(pageId);
    if (typeof window !== 'undefined') {
      window.location.hash = pageId;
    }
  };

  const currentPageMeta = PAGE_CONFIG[activePage] || PAGE_CONFIG['home'];

  const hasCustomHeader =
    activePage === 'home' ||
    activePage === 'ask' ||
    activePage === 'ask-my-world' ||
    activePage === 'what-changed' ||
    activePage === 'clean-my-day' ||
    activePage === 'goals' ||
    activePage === 'memory' ||
    activePage === 'settings';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased transition-colors duration-200">
      <div className="flex flex-1 w-full relative">
        {/* Persistent Fixed Left Sidebar for Desktop (lg+) */}
        <Sidebar
          activePage={activePage}
          onSelectPage={handleSelectPage}
          onOpenConnector={(id) => setActiveConnectorId(id)}
          className="hidden lg:flex"
        />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-8">
          {/* Reusable Top Header Bar (Shown only on simple subpages without custom header systems) */}
          {!hasCustomHeader && (
            <TopBar
              activePageTitle={currentPageMeta.title}
              activePageIcon={currentPageMeta.icon}
              onNavigate={handleSelectPage}
              onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
            />
          )}

          {/* Developer / Design System Quick Switcher Bar */}
          {showDevTabOption && (
            <div className="bg-slate-100/80 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="indigo" size="sm">
                  NEXORBIT 2.0
                </Badge>
                <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                  Navigating: <code className="font-mono text-indigo-700 font-semibold">/{activePage}</code>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activePage !== 'dev-showcase' && (
                  <button
                    onClick={() => handleSelectPage('dev-showcase')}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Palette className="h-3.5 w-3.5" />
                    <span>View UI Tokens</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main Content Area Container */}
          <main className={cn(
            "flex-1 w-full mx-auto px-4 sm:px-6 py-2 sm:py-4",
            hasCustomHeader && "safe-pt",
            activePage === 'home' ? "max-w-5xl" : activePage === 'settings' ? "max-w-7xl" : activePage === 'ask' || activePage === 'ask-my-world' || activePage === 'what-changed' || activePage === 'clean-my-day' || activePage === 'goals' || activePage === 'memory' ? "max-w-7xl" : "max-w-6xl"
          )}>
            {children ? (
              children
            ) : activePage === 'home' ? (
              <HomeDashboard
                onNavigate={handleSelectPage}
                onOpenConnector={(id) => setActiveConnectorId(id)}
                onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
              />
            ) : activePage === 'ask' || activePage === 'ask-my-world' ? (
              <AskMyWorldView
                onNavigate={handleSelectPage}
                onOpenConnector={(id) => setActiveConnectorId(id as ConnectorId)}
              />
            ) : activePage === 'what-changed' ? (
              <WhatChangedView onNavigate={handleSelectPage} />
            ) : activePage === 'clean-my-day' ? (
              <CleanMyDayView onNavigate={handleSelectPage} />
            ) : activePage === 'goals' ? (
              <GoalsView onNavigate={handleSelectPage} />
            ) : activePage === 'memory' ? (
              <MemoryView onNavigate={handleSelectPage} />
            ) : activePage === 'settings' ? (
              <SettingsView onNavigate={handleSelectPage} />
            ) : activePage === 'connected-apps' || activePage === 'connectors' ? (
              <ConnectedAppsView
                onNavigate={handleSelectPage}
                initialSelectedConnectorId={activeConnectorId}
              />
            ) : (
              <PlaceholderPage pageId={activePage} onNavigate={handleSelectPage} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Sticky Navigation (sm & md) */}
      <MobileNav
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onOpenConnector={(id) => setActiveConnectorId(id)}
      />

      {/* Mobile Header Drawer Menu */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="NEXORBIT Navigation"
        subtitle="App Shell Menu"
      >
        <div className="space-y-4">
          <Sidebar
            activePage={activePage}
            onSelectPage={(pageId) => {
              setIsMobileDrawerOpen(false);
              handleSelectPage(pageId);
            }}
            onOpenConnector={(id) => {
              setIsMobileDrawerOpen(false);
              setActiveConnectorId(id);
            }}
            className="w-full border-none shadow-none h-auto m-0 ml-0 p-2"
          />
        </div>
      </Drawer>

      {/* Connector Details Modal */}
      <ConnectorModal
        connectorId={activeConnectorId}
        onClose={() => setActiveConnectorId(null)}
      />
    </div>
  );
};
