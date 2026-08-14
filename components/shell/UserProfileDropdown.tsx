'use client';

import React from 'react';
import { User, Settings, Zap, LogOut, ChevronDown } from 'lucide-react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { useToast } from '../ui/Toast';

export interface UserProfileDropdownProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  onNavigate,
  className,
}) => {
  const { addToast } = useToast();

  const handleProfileClick = () => {
    addToast({
      type: 'info',
      title: 'Satyam',
      description: 'Free Plan • Satyam@nexorbit.ai',
    });
  };

  const handleSettingsClick = () => {
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleUsageClick = () => {
    addToast({
      type: 'info',
      title: 'Credit Usage Overview',
      description: '1,250 / 15,000 credits used this cycle.',
    });
  };

  const handleSignOutClick = () => {
    addToast({
      type: 'info',
      title: 'Sign Out',
      description: 'Authentication simulation: Signed out session.',
    });
  };

  const menuItems: DropdownItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-3.5 w-3.5 text-slate-500" />,
      onClick: handleProfileClick,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-3.5 w-3.5 text-slate-500" />,
      onClick: handleSettingsClick,
    },
    {
      id: 'usage',
      label: 'Usage & Billing',
      icon: <Zap className="h-3.5 w-3.5 text-slate-500" />,
      onClick: handleUsageClick,
    },
    {
      id: 'signout',
      label: 'Sign out',
      icon: <LogOut className="h-3.5 w-3.5 text-rose-500" />,
      danger: true,
      onClick: handleSignOutClick,
    },
  ];

  const triggerNode = (
    <div className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group select-none">
      <Avatar name="Satyam" size="sm" status="online" />
      <div className="text-left hidden sm:block">
        <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
          Satyam
        </div>
        <div className="text-[10px] font-medium text-slate-400">Free Plan</div>
      </div>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
    </div>
  );

  return <Dropdown trigger={triggerNode} items={menuItems} align="right" className={className} />;
};
