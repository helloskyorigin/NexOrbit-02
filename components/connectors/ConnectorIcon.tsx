'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, BookOpen, GitBranch } from 'lucide-react';
import { ConnectorId } from './types';
import { cn } from '../../lib/utils';

export interface ConnectorIconProps {
  id: ConnectorId;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConnectorIcon: React.FC<ConnectorIconProps> = ({ id, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const iconClass = className || sizeClasses[size];

  switch (id) {
    case 'gmail':
      return <Mail className={cn(iconClass, 'text-red-500')} />;
    case 'calendar':
      return <Calendar className={cn(iconClass, 'text-blue-500')} />;
    case 'drive':
      return <HardDrive className={cn(iconClass, 'text-amber-500')} />;
    case 'notion':
      return <BookOpen className={cn(iconClass, 'text-slate-700')} />;
    case 'github':
      return <GitBranch className={cn(iconClass, 'text-slate-900')} />;
    default:
      return <Mail className={iconClass} />;
  }
};
