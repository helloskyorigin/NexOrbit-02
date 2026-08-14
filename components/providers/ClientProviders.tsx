'use client';

import React from 'react';
import { ToastProvider } from '../ui/Toast';
import { ThemeProvider } from './ThemeProvider';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
