'use client';

import React, { useState } from 'react';
import { SettingsHeader } from './SettingsHeader';
import { SettingsSectionNav } from './SettingsSectionNav';
import { RightSidePanel } from './RightSidePanel';
import {
  SettingsTabId,
  UserProfile,
  GeneralPreferences,
  AIBrainPreferences,
  NotificationPreferences,
} from './types';
import { ProfileTab } from './views/ProfileTab';
import { GeneralTab } from './views/GeneralTab';
import { AIBrainTab } from './views/AIBrainTab';
import { MemoryDataTab } from './views/MemoryDataTab';
import { PrivacySecurityTab } from './views/PrivacySecurityTab';
import { NotificationsTab } from './views/NotificationsTab';
import { AppearanceTab } from './views/AppearanceTab';
import { ConnectedAppsTab } from './views/ConnectedAppsTab';
import { AdvancedTab } from './views/AdvancedTab';
import { EditProfileModal } from './modals/EditProfileModal';
import { ViewPlansModal } from './modals/ViewPlansModal';
import { ManageSecurityModal } from './modals/ManageSecurityModal';
import { ManageStorageModal } from './modals/ManageStorageModal';
import { DeleteAccountModal } from './modals/DeleteAccountModal';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface SettingsViewProps {
  onNavigate: (pageId: string) => void;
  className?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onNavigate,
  className,
}) => {
  const { addToast } = useToast();

  // Active subnav tab state
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');

  // User profile state
  const [user, setUser] = useState<UserProfile>({
    name: 'Satyam',
    email: 'satyam@example.com',
    role: 'Workspace Member',
    nexorbitId: 'nxo_7f3a9b2c1d4e',
    memberSince: 'May 11, 2024',
    timezone: '(GMT+05:30) Asia/Kolkata',
    language: 'English',
    plan: 'Free Plan',
  });

  // General preferences state
  const [generalPrefs, setGeneralPrefs] = useState<GeneralPreferences>({
    language: 'English',
    timezone: '(GMT+05:30) Asia/Kolkata',
    dateFormat: 'MMM D, YYYY',
    startupView: 'clean-my-day',
  });

  // AI Brain preferences state
  const [aiPrefs, setAiPrefs] = useState<AIBrainPreferences>({
    defaultMode: 'Auto',
    responseStyle: 'Balanced',
    proactiveSuggestions: true,
    autoExtractEntities: true,
  });

  // Notifications preferences state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    importantChanges: true,
    meetingReminders: true,
    aiUpdates: true,
  });

  // Modal visibility states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isViewPlansOpen, setIsViewPlansOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  // Export handlers
  const handleExportData = () => {
    addToast({
      type: 'success',
      title: 'Export Started',
      description: 'Preparing your NEXORBIT memory archive (.json format)...',
    });
  };

  const handleDownloadData = () => {
    addToast({
      type: 'info',
      title: 'Download Ready',
      description: 'Downloading full memory vectors & chat history package.',
    });
  };

  const handleSignOut = () => {
    addToast({
      type: 'info',
      title: 'Signed Out',
      description: 'You have been safely signed out of your NEXORBIT workspace.',
    });
  };

  return (
    <div className={cn('w-full max-w-7xl mx-auto space-y-4 pb-12', className)}>
      {/* Top Header Bar */}
      <SettingsHeader
        user={user}
        onEditProfile={() => setIsEditProfileOpen(true)}
        onOpenNotifications={() => setActiveTab('notifications')}
      />

      {/* Main 3-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sub-navigation (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <SettingsSectionNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>

        {/* Center Column: Active View Content (lg:col-span-6) */}
        <div className="lg:col-span-6 min-w-0">
          {activeTab === 'profile' && (
            <ProfileTab
              user={user}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onViewPlans={() => setIsViewPlansOpen(true)}
            />
          )}

          {activeTab === 'general' && (
            <GeneralTab
              preferences={generalPrefs}
              onChange={(updated) => setGeneralPrefs({ ...generalPrefs, ...updated })}
            />
          )}

          {activeTab === 'ai-brain' && (
            <AIBrainTab
              preferences={aiPrefs}
              onChange={(updated) => setAiPrefs({ ...aiPrefs, ...updated })}
            />
          )}

          {activeTab === 'memory-data' && (
            <MemoryDataTab
              onNavigateMemory={() => onNavigate('memory')}
            />
          )}

          {activeTab === 'privacy-security' && (
            <PrivacySecurityTab
              onNavigateConnectedApps={() => onNavigate('connected-apps')}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              preferences={notifPrefs}
              onChange={(updated) => setNotifPrefs({ ...notifPrefs, ...updated })}
            />
          )}

          {activeTab === 'appearance' && <AppearanceTab />}

          {activeTab === 'connected-apps' && (
            <ConnectedAppsTab
              onNavigateConnectedApps={() => onNavigate('connected-apps')}
            />
          )}

          {activeTab === 'advanced' && (
            <AdvancedTab
              nexorbitId={user.nexorbitId}
              onSignOut={handleSignOut}
              onDeleteAccount={() => setIsDeleteAccountOpen(true)}
            />
          )}
        </div>

        {/* Right Column: Auxiliary Control Cards (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <RightSidePanel
            onManageSecurity={() => setIsSecurityOpen(true)}
            onManageStorage={() => setIsStorageOpen(true)}
            onExportData={handleExportData}
            onDownloadData={handleDownloadData}
            onDeleteAccount={() => setIsDeleteAccountOpen(true)}
            onNavigateSupport={() => onNavigate('support')}
          />
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={(updatedUser) => setUser(updatedUser)}
      />

      <ViewPlansModal
        isOpen={isViewPlansOpen}
        onClose={() => setIsViewPlansOpen(false)}
        currentPlan={user.plan}
        onSelectPlan={(newPlan) => setUser({ ...user, plan: newPlan })}
      />

      <ManageSecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />

      <ManageStorageModal
        isOpen={isStorageOpen}
        onClose={() => setIsStorageOpen(false)}
      />

      <DeleteAccountModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        userEmail={user.email}
      />
    </div>
  );
};
