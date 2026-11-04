'use client';

import React from 'react';
import { Home, Shirt, User } from 'lucide-react';

export type ResidentTab = 'home' | 'laundry' | 'profile';

interface FloatingTabBarProps {
  activeTab: ResidentTab;
  onSelectTab: (tab: ResidentTab) => void;
  hasActiveCycle?: boolean;
}

export function FloatingTabBar({
  activeTab,
  onSelectTab,
  hasActiveCycle,
}: FloatingTabBarProps) {
  const tabs = [
    { id: 'home' as ResidentTab, label: 'Home', icon: Home, ariaLabel: 'Home tab' },
    {
      id: 'laundry' as ResidentTab,
      label: 'My laundry',
      icon: Shirt,
      ariaLabel: 'My laundry tab',
      badge: hasActiveCycle,
    },
    { id: 'profile' as ResidentTab, label: 'Profile', icon: User, ariaLabel: 'Profile tab' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[calc(100%-48px)]">
      {/* Background blur pill */}
      <div className="bg-surface/95 backdrop-blur-md rounded-full p-2 shadow-2xl border border-border-default flex items-center justify-between gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (isActive) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                aria-label={tab.ariaLabel}
                className="flex-1 h-12 rounded-full bg-brand-primary text-text-on-brand flex items-center justify-center gap-2 px-4 shadow transition-all duration-200"
              >
                <Icon className="w-5 h-5 fill-current flex-shrink-0" />
                <span className="text-xs font-semibold whitespace-nowrap">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              aria-label={tab.ariaLabel}
              className="relative w-12 h-12 rounded-full bg-subtle text-text-secondary hover:text-text-primary hover:bg-border-default/40 flex items-center justify-center flex-shrink-0 transition-all duration-200"
            >
              <Icon className="w-5 h-5" />
              {tab.badge && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand-primary border-2 border-surface animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
