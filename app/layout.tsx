import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'NEXORBIT | AI Brain for the Digital World',
  description: 'Your AI Brain for the Digital World. Unified context, intelligence gateway, and secure action execution.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body suppressHydrationWarning className="h-full flex flex-col font-sans text-slate-900 bg-slate-50">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
