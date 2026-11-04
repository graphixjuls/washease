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
import { ResidentApp } from '@/components/resident/ResidentApp';
import { Smartphone, Monitor, Menu, Sun, Moon } from 'lucide-react';

export type AppMode = 'resident' | 'admin';

export default function HomePage() {
  const [appMode, setAppMode] = useState<AppMode>('resident');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showPhoneFrame, setShowPhoneFrame] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setIsDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // If opening on a mobile screen, default to resident mobile app
      if (window.innerWidth < 768) {
        setAppMode('resident');
        setShowPhoneFrame(false);
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
      {/* Top Universal App Switcher Bar */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border-default px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs">
        {/* Left: Brand & Mobile Menu */}
        <div className="flex items-center gap-3 min-w-0">
          {appMode === 'admin' && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-canvas"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-brand-primary flex items-center justify-center text-text-on-brand font-bold text-xs shadow flex-shrink-0">
              W
            </div>
            <div className="font-heading font-bold text-base text-text-primary truncate hidden sm:block">
              WashEase
            </div>
          </div>
        </div>

        {/* Center: Interactive Mode Switcher */}
        <div className="flex items-center bg-subtle p-1 rounded-full border border-border-default shadow-inner">
          <button
            onClick={() => setAppMode('resident')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              appMode === 'resident'
                ? 'bg-brand-primary text-text-on-brand shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Resident App</span>
          </button>
          <button
            onClick={() => setAppMode('admin')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              appMode === 'admin'
                ? 'bg-brand-primary text-text-on-brand shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Admin Web</span>
          </button>
        </div>

        {/* Right: Theme Toggle & Phone Frame toggle */}
        <div className="flex items-center gap-2">
          {appMode === 'resident' && (
            <button
              onClick={() => setShowPhoneFrame((prev) => !prev)}
              title="Toggle Phone Frame"
              className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-md border border-border-default hover:bg-canvas"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{showPhoneFrame ? 'Frame: ON' : 'Frame: OFF'}</span>
            </button>
          )}

          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary border border-border-default hover:bg-canvas transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-brand-primary" />
            ) : (
              <Sun className="w-4 h-4 text-status-warning" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {appMode === 'resident' ? (
        /* ================= RESIDENT APP VIEW ================= */
        <div className="flex-1 flex items-center justify-center py-0 sm:py-8 px-0 sm:px-4 bg-canvas min-w-0">
          <div
            className={`w-full transition-all ${
              showPhoneFrame
                ? 'max-w-md sm:rounded-3xl sm:border sm:border-border-default sm:shadow-2xl overflow-hidden bg-canvas'
                : 'max-w-xl'
            }`}
          >
            <ResidentApp onSwitchToAdmin={() => setAppMode('admin')} />
          </div>
        </div>
      ) : (
        /* ================= ADMIN WEB PORTAL VIEW ================= */
        <div className="flex-1 flex min-h-0 bg-canvas min-w-0">
          <AdminSidebar
            activeTab={adminTab}
            onSelectTab={setAdminTab}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            isOpenMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-7xl min-w-0">
            {adminTab === 'dashboard' && <DashboardView onNavigate={setAdminTab} />}
            {adminTab === 'machines' && <MachinesView />}
            {adminTab === 'residents' && <ResidentsView />}
            {adminTab === 'activity' && <ActivityView />}
            {adminTab === 'payments' && <PaymentsView />}
            {adminTab === 'rules' && <RulesView />}
            {adminTab === 'settings' && <SettingsView />}
          </main>
        </div>
      )}
    </div>
  );
}
