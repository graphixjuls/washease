'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar, AdminTab } from '@/components/AdminSidebar';
import { DashboardView } from '@/components/DashboardView';
import { MachinesView } from '@/components/MachinesView';
import { ResidentsView } from '@/components/ResidentsView';
import { ActivityView } from '@/components/ActivityView';
import { PaymentsView } from '@/components/PaymentsView';
import { RulesView } from '@/components/RulesView';
import { SettingsView } from '@/components/SettingsView';
import { Smartphone, Menu } from 'lucide-react';

export default function AdminRoutePage() {
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
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
    <div className="min-h-screen bg-canvas font-body text-text-primary flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border-default px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-brand-primary flex items-center justify-center text-text-on-brand font-bold text-sm shadow">
              W
            </div>
            <div>
              <div className="font-heading font-bold text-base text-text-primary leading-tight">
                WashEase Admin
              </div>
              <div className="text-[11px] text-text-secondary">Building Management Portal</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-tint text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Switch to Resident App</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex min-h-0 bg-canvas">
        <AdminSidebar
          activeTab={adminTab}
          onSelectTab={setAdminTab}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl min-w-0">
          {adminTab === 'dashboard' && <DashboardView onNavigate={setAdminTab} />}
          {adminTab === 'machines' && <MachinesView />}
          {adminTab === 'residents' && <ResidentsView />}
          {adminTab === 'activity' && <ActivityView />}
          {adminTab === 'payments' && <PaymentsView />}
          {adminTab === 'rules' && <RulesView />}
          {adminTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
