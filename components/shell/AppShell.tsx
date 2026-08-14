'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SlideMenu } from './SlideMenu';
import { ConnectorModal, ConnectorId } from './ConnectorModal';
import { PlaceholderPage, PAGE_CONFIG } from './PlaceholderPage';
import { HomeDashboard } from '../home/HomeDashboard';
import { ChatView } from '../chat/ChatView';
import { MemoryView } from '../memory/MemoryView';
import { ConnectedAppsView } from '../connectors/ConnectedAppsView';
import { WhatChangedView } from '../changes/WhatChangedView';
import { CleanMyDayView } from '../focus/CleanMyDayView';
import { SettingsView } from '../settings/SettingsView';
import { useAuth } from '../auth/AuthContext';
import { AuthContainer } from '../auth/AuthContainer';
import { AuthLoading } from '../auth/AuthLoading';
import { Palette } from 'lucide-react';
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
  const { isAuthenticated, authInitializing } = useAuth();
  const [activePage, setActivePage] = useState<string>(initialPage);
  const [activeConnectorId, setActiveConnectorId] = useState<ConnectorId | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashPage = window.location.hash.replace('#', '');
      if (
        hashPage === 'home' ||
        hashPage === 'chat' ||
        hashPage === 'ask' ||
        hashPage === 'ask-my-world' ||
        hashPage === 'what-changed' ||
        hashPage === 'clean-my-day' ||
        hashPage === 'memory' ||
        hashPage === 'connected-apps' ||
        hashPage === 'settings' ||
        hashPage === 'support' ||
        PAGE_CONFIG[hashPage]
      ) {
        setTimeout(() => {
          setActivePage(hashPage === 'ask' || hashPage === 'ask-my-world' ? 'chat' : hashPage);
        }, 0);
      }
    }
  }, []);

  // Show a clean loading state while auth state is being initialized/determined
  if (authInitializing) {
    return <AuthLoading />;
  }

  // If user is not authenticated, render the Auth UI view
  if (!isAuthenticated) {
    return <AuthContainer />;
  }


  const handleSelectPage = (pageId: string) => {
    const normalizedPage = pageId === 'ask' || pageId === 'ask-my-world' ? 'chat' : pageId;
    setActivePage(normalizedPage);
    if (typeof window !== 'undefined') {
      window.location.hash = normalizedPage;
    }
  };

  const currentPageMeta = PAGE_CONFIG[activePage] || PAGE_CONFIG['home'];

  const hasCustomHeader =
    activePage === 'home' ||
    activePage === 'chat' ||
    activePage === 'ask' ||
    activePage === 'ask-my-world' ||
    activePage === 'what-changed' ||
    activePage === 'clean-my-day' ||
    activePage === 'memory' ||
    activePage === 'settings' ||
    activePage === 'connected-apps' ||
    activePage === 'connectors';

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
        <div className="flex-1 flex flex-col min-w-0 pb-6 lg:pb-8">
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
                  NexOrbit 2.0
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
          <main
            className={cn(
              'flex-1 w-full mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-5 overflow-x-hidden',
              hasCustomHeader && 'safe-pt',
              activePage === 'home'
                ? 'max-w-7xl'
                : activePage === 'chat' || activePage === 'ask' || activePage === 'ask-my-world'
                ? 'max-w-7xl'
                : activePage === 'settings'
                ? 'max-w-7xl'
                : activePage === 'what-changed' || activePage === 'clean-my-day' || activePage === 'memory'
                ? 'max-w-7xl'
                : 'max-w-6xl'
            )}
          >
            {children ? (
              children
            ) : activePage === 'home' ? (
              <HomeDashboard
                onNavigate={handleSelectPage}
                onOpenConnector={(id) => setActiveConnectorId(id)}
                onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
              />
            ) : activePage === 'chat' || activePage === 'ask' || activePage === 'ask-my-world' ? (
              <ChatView
                onNavigate={handleSelectPage}
              />
            ) : activePage === 'what-changed' ? (
              <WhatChangedView onNavigate={handleSelectPage} />
            ) : activePage === 'clean-my-day' ? (
              <CleanMyDayView onNavigate={handleSelectPage} />
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

      {/* Top-Left Slide Menu (Mobile / Tablet) */}
      <SlideMenu
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onOpenConnector={(id) => setActiveConnectorId(id)}
      />

      {/* Connector Details Modal */}
      <ConnectorModal
        connectorId={activeConnectorId}
        onClose={() => setActiveConnectorId(null)}
      />
    </div>
  );
};
