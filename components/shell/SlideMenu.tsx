'use client';

import React, { useEffect } from 'react';
import {
  Home,
  MessageSquare,
  History,
  Sparkles,
  Box,
  LayoutGrid,
  Settings as SettingsIcon,
  HelpCircle,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorId } from './ConnectorModal';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../ui/Toast';

export interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onSelectPage: (pageId: string) => void;
  onOpenConnector?: (connectorId: ConnectorId) => void;
  userName?: string;
  userEmail?: string;
}

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'what-changed', label: 'What Changed', icon: <History className="h-5 w-5" /> },
  { id: 'clean-my-day', label: 'Clean My Day', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'memory', label: 'Memory', icon: <Box className="h-5 w-5" /> },
  { id: 'connected-apps', label: 'Connected Apps', icon: <LayoutGrid className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  { id: 'support', label: 'Support', icon: <HelpCircle className="h-5 w-5" /> },
];

export const SlideMenu: React.FC<SlideMenuProps> = ({
  isOpen,
  onClose,
  activePage,
  onSelectPage,
  userName: fallbackName = 'User',
  userEmail: fallbackEmail = 'user@nexorbit.ai',
}) => {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  const displayName = user?.displayName || fallbackName;
  const displayEmail = user?.email || fallbackEmail;
  const displayPlan = user?.plan || 'Free Plan';
  const initialLetter = displayName.charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    onClose();
    try {
      await signOut();
      addToast({
        type: 'info',
        title: 'Signed Out',
        description: 'You have been safely signed out.',
      });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer Surface */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-slideInLeft border-r border-slate-100 p-5">
        {/* Top: Header & Brand */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight text-slate-950 leading-none">
                  NexOrbit
                </h2>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  AI BRAIN
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Preview */}
          <div
            onClick={() => {
              onClose();
              onSelectPage('settings');
            }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs">
              {initialLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive =
                activePage === item.id ||
                (item.id === 'chat' && (activePage === 'ask' || activePage === 'ask-my-world')) ||
                (item.id === 'connected-apps' && activePage === 'connectors');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectPage(item.id);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer',
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-600 shadow-3xs font-bold'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Workspace status & Logout Action */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              <span>Connectors Synced</span>
            </div>
            <span className="font-semibold text-slate-700">6/6 Active</span>
          </div>

          {/* Prominent Log Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 font-semibold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-600" />
            <span>Sign Out of NexOrbit</span>
          </button>

          <div className="text-[10px] text-slate-400 text-center font-medium">
            NexOrbit • {displayPlan}
          </div>
        </div>
      </div>
    </div>
  );
};
