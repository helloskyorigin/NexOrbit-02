'use client';

import React, { useState } from 'react';
import {
  Home,
  MessageSquare,
  History,
  Sparkles,
  Box,
  LayoutGrid,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorId } from './ConnectorModal';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-[18px] w-[18px]" /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-[18px] w-[18px]" /> },
  { id: 'what-changed', label: 'What Changed', icon: <History className="h-[18px] w-[18px]" /> },
  { id: 'clean-my-day', label: 'Clean My Day', icon: <Sparkles className="h-[18px] w-[18px]" /> },
  { id: 'memory', label: 'Memory', icon: <Box className="h-[18px] w-[18px]" /> },
  { id: 'connected-apps', label: 'Connected Apps', icon: <LayoutGrid className="h-[18px] w-[18px]" /> },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-[18px] w-[18px]" /> },
  { id: 'support', label: 'Support', icon: <HelpCircle className="h-[18px] w-[18px]" /> },
];

export interface SidebarProps {
  activePage: string;
  onSelectPage: (pageId: string) => void;
  onOpenConnector?: (connectorId: ConnectorId) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexorbit_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexorbit_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'bg-white rounded-3xl border border-slate-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between shrink-0 select-none my-4 ml-4 h-[calc(100vh-2rem)] sticky top-4 z-20 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px] p-2.5' : 'w-[240px] p-4',
        className
      )}
    >
      {/* Top Header & Main Navigation */}
      <div className="space-y-6">
        {/* Brand / Logo + Collapse Toggle */}
        <div
          className={cn(
            'flex items-center pt-1 transition-all duration-200',
            isCollapsed ? 'flex-col gap-3 items-center justify-center' : 'justify-between px-2'
          )}
        >
          {/* Logo Click Handler */}
          <div
            onClick={() => onSelectPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
            title={isCollapsed ? 'NexOrbit AI BRAIN (Home)' : undefined}
          >
            {/* Orbital Ribbon Logo */}
            <div className="relative h-8 w-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-8 h-8 transform group-hover:rotate-12 transition-transform duration-300">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="3.5" fill="#6366f1" />
                <ellipse
                  cx="16"
                  cy="16"
                  rx="12"
                  ry="5.5"
                  fill="none"
                  stroke="url(#logoGrad)"
                  strokeWidth="2.2"
                  transform="rotate(-28 16 16)"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="16"
                  cy="16"
                  rx="12"
                  ry="5.5"
                  fill="none"
                  stroke="url(#logoGrad)"
                  strokeWidth="2.2"
                  transform="rotate(35 16 16)"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {!isCollapsed && (
              <div>
                <div className="text-[15px] font-extrabold tracking-wider text-slate-950 font-sans leading-none">
                  NexOrbit
                </div>
                <div className="text-[9px] font-bold tracking-widest text-indigo-600 uppercase mt-0.5">
                  AI BRAIN
                </div>
              </div>
            )}
          </div>

          {/* Subtle Desktop Collapse Control Button */}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-slate-500" />
            ) : (
              <PanelLeftClose className="h-4 w-4 text-slate-400 hover:text-slate-700" />
            )}
          </button>
        </div>

        {/* Main Navigation List */}
        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              activePage === item.id ||
              (item.id === 'connected-apps' && activePage === 'connectors') ||
              (item.id === 'chat' && (activePage === 'ask' || activePage === 'ask-my-world'));

            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'w-full flex items-center transition-all duration-150 text-left cursor-pointer',
                  isCollapsed
                    ? 'justify-center p-2.5 rounded-2xl'
                    : 'gap-3.5 px-4 py-2.5 rounded-2xl text-[13px] font-medium',
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold border border-indigo-100/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/80'
                )}
              >
                <span className={cn('shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings, Support & Profile Switcher */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="space-y-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'w-full flex items-center transition-all duration-150 text-left cursor-pointer',
                  isCollapsed
                    ? 'justify-center p-2.5 rounded-2xl'
                    : 'gap-3.5 px-4 py-2.5 rounded-2xl text-[13px] font-medium',
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold border border-indigo-100/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/80'
                )}
              >
                <span className={cn('shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Workspace Profile Switcher Pill */}
        <div className="pt-2 border-t border-slate-100/80">
          <div
            onClick={() => onSelectPage('settings')}
            title={isCollapsed ? 'Satyam (Free Plan)' : undefined}
            className={cn(
              'flex items-center rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group',
              isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                S
              </div>
              {!isCollapsed && (
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    Satyam
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal truncate">
                    Free Plan
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

