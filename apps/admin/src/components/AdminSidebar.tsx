'use client';

import React from 'react';
import {
  LayoutDashboard,
  Disc,
  Users,
  Activity,
  CreditCard,
  Building2,
  Settings,
  Sun,
  Moon,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'machines'
  | 'residents'
  | 'activity'
  | 'payments'
  | 'rules'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const items: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'machines', label: 'Machines', icon: Disc },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'rules', label: 'Building & rules', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border-default flex flex-col justify-between p-6 flex-shrink-0 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="min-w-0">
          {/* Brand logo & title + Mobile close */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-md bg-brand-primary flex items-center justify-center text-text-on-brand font-bold text-lg shadow flex-shrink-0">
                W
              </div>
              <div className="min-w-0">
                <div className="font-heading font-bold text-lg text-text-primary leading-tight truncate">
                  WashEase
                </div>
                <div className="text-xs text-text-secondary truncate">Building Admin</div>
              </div>
            </div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Building selector / tag */}
          <div className="bg-canvas rounded-md p-3 mb-6 border border-border-default min-w-0">
            <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold truncate">
              Active Building
            </div>
            <div className="text-sm font-semibold text-text-primary truncate mt-0.5">
              Wilhelmstr. 12
            </div>
            <div className="text-xs text-text-secondary truncate">79098 Freiburg</div>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-brand-tint text-brand-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-brand-primary fill-current' : 'text-text-secondary'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Theme toggle & footer */}
        <div className="pt-6 border-t border-border-default space-y-3 min-w-0">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-canvas transition-colors border border-border-default"
          >
            <span className="flex items-center gap-2 truncate">
              {isDark ? (
                <Moon className="w-4 h-4 text-brand-primary flex-shrink-0" />
              ) : (
                <Sun className="w-4 h-4 text-status-warning flex-shrink-0" />
              )}
              <span className="truncate">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] text-text-disabled uppercase flex-shrink-0">Toggle</span>
          </button>

          <div className="px-3 text-[11px] text-text-disabled truncate">
            WashEase v1.0.0 · Miele Partner
          </div>
        </div>
      </aside>
    </>
  );
}
