'use client';

import React from 'react';
import {
  Home,
  MessageSquare,
  History,
  Sparkles,
  Target,
  Box,
  LayoutGrid,
  Settings as SettingsIcon,
  HelpCircle,
  ChevronRight,
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
  { id: 'ask-my-world', label: 'Ask My World', icon: <MessageSquare className="h-[18px] w-[18px]" /> },
  { id: 'what-changed', label: 'What Changed', icon: <History className="h-[18px] w-[18px]" /> },
  { id: 'clean-my-day', label: 'Clean My Day', icon: <Sparkles className="h-[18px] w-[18px]" /> },
  { id: 'goals', label: 'Goals', icon: <Target className="h-[18px] w-[18px]" /> },
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
  return (
    <aside
      className={cn(
        'w-[240px] bg-white rounded-3xl border border-slate-100/90 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between shrink-0 select-none p-4 my-4 ml-4 h-[calc(100vh-2rem)] sticky top-4 z-20 transition-colors duration-200',
        className
      )}
    >
      {/* Top Header & Main Navigation */}
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectPage('home')}
          className="flex items-center gap-3 px-3 pt-2 cursor-pointer group"
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

          <div>
            <div className="text-[15px] font-extrabold tracking-wider text-slate-950 font-sans leading-none">
              NEXORBIT
            </div>
            <div className="text-[9px] font-bold tracking-widest text-indigo-600 uppercase mt-0.5">
              AI BRAIN
            </div>
          </div>
        </div>

        {/* Main Navigation List */}
        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              activePage === item.id ||
              (item.id === 'connected-apps' && activePage === 'connectors') ||
              (item.id === 'ask-my-world' && activePage === 'ask');

            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={cn(
                  'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-150 text-left cursor-pointer',
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold border border-indigo-100/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/80'
                )}
              >
                <span className={cn('shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings, Support & Profile Switcher */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <div className="space-y-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={cn(
                  'w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-150 text-left cursor-pointer',
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold border border-indigo-100/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50/80'
                )}
              >
                <span className={cn('shrink-0', isActive ? 'text-indigo-600' : 'text-slate-400')}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Profile Switcher Pill */}
        <div className="pt-2 border-t border-slate-100/80">
          <div
            onClick={() => onSelectPage('settings')}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                N
              </div>
              <span className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                NEXORBIT
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </div>
    </aside>
  );
};
