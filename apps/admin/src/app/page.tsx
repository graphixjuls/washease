'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTab } from '@/components/AdminSidebar';
import { DashboardView } from '@/components/DashboardView';
import { MachinesView } from '@/components/MachinesView';
import { ResidentsView } from '@/components/ResidentsView';
import { ActivityView } from '@/components/ActivityView';
import { PaymentsView } from '@/components/PaymentsView';
import { RulesView } from '@/components/RulesView';
import { SettingsView } from '@/components/SettingsView';

export default function AdminHomePage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Check initial system preference or stored theme
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-canvas font-body text-text-primary">
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === 'machines' && <MachinesView />}
        {activeTab === 'residents' && <ResidentsView />}
        {activeTab === 'activity' && <ActivityView />}
        {activeTab === 'payments' && <PaymentsView />}
        {activeTab === 'rules' && <RulesView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

