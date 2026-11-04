'use client';

import React from 'react';
import { Shield, Bell, CreditCard, Building } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-text-primary">Admin Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Building manager team, notification preferences, and Stripe payout integration.
        </p>
      </div>

      <div className="space-y-4">
        {/* Building & Address */}
        <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-5 h-5 text-brand-primary" />
            <h2 className="text-base font-bold font-heading text-text-primary">
              Property Details
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-text-secondary block">Building Name</span>
              <span className="font-semibold text-text-primary">Wilhelmstr. 12</span>
            </div>
            <div>
              <span className="text-xs text-text-secondary block">Location</span>
              <span className="font-semibold text-text-primary">79098 Freiburg im Breisgau, DE</span>
            </div>
            <div>
              <span className="text-xs text-text-secondary block">Rooms</span>
              <span className="font-semibold text-text-primary">Room A (Ground) & Room B (Basement)</span>
            </div>
            <div>
              <span className="text-xs text-text-secondary block">Machines</span>
              <span className="font-semibold text-text-primary">10 Washers, 10 Dryers (20 total)</span>
            </div>
          </div>
        </div>

        {/* Payout Account */}
        <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-status-success" />
              <h2 className="text-base font-bold font-heading text-text-primary">
                Stripe Connected Account
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-status-success-tint text-status-success">
              Active · Connected
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Monthly payouts are transferred automatically on the 15th of every month.
          </p>
          <div className="p-3 bg-canvas rounded-md border border-border-default text-xs font-mono text-text-secondary">
            IBAN: DE44 6805 0101 0000 8802 (Sparkasse Freiburg-Nördlicher Breisgau)
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-status-warning" />
            <h2 className="text-base font-bold font-heading text-text-primary">
              Manager Notifications
            </h2>
          </div>
          <div className="space-y-2 text-sm text-text-secondary">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-brand-primary" />
              <span>Instant email alert when a machine reports a hardware fault or goes offline</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-brand-primary" />
              <span>Email alert when laundry remains uncollected after 30 minutes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-brand-primary" />
              <span>Weekly utilisation & revenue digest</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

