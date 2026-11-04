'use client';

import React, { useState } from 'react';
import { Toggle } from './Toggle';
import { Building2, Save, CheckCircle } from 'lucide-react';

export function RulesView() {
  const [settings, setSettings] = useState({
    hold_minutes: 10,
    queue_hold_minutes: 5,
    max_active_reservations: 1,
    price_washer_cents: 300,
    price_dryer_cents: 200,
    max_cycle_minutes: 180,
    collect_reminder_minutes: 15,
    quiet_hours: '22:00-06:00',
    require_manager_approval: true,
    auto_refund_on_fault: true,
    invite_code: '482913',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Building & Rules</h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure reservation limits, flat pricing, quiet hours, and access settings for Wilhelmstr. 12.
          </p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-status-success-tint text-status-success">
            <CheckCircle className="w-4 h-4" />
            Rules saved to building settings
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Reservation Rules */}
        <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card space-y-5">
          <div className="border-b border-border-default pb-3">
            <h2 className="text-base font-bold font-heading text-text-primary">
              Reservation & Walk-Down Rules
            </h2>
            <p className="text-xs text-text-secondary">
              Parameters controlling hold timers and queue allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Walk-Down Hold Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.hold_minutes}
                onChange={(e) =>
                  setSettings({ ...settings, hold_minutes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-md bg-canvas border border-border-default text-text-primary text-sm focus:outline-none focus:border-brand-primary"
              />
              <span className="text-[11px] text-text-secondary mt-1 block">
                Held for resident walking downstairs. Default: 10 min.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Queue Offer Hold Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.queue_hold_minutes}
                onChange={(e) =>
                  setSettings({ ...settings, queue_hold_minutes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-md bg-canvas border border-border-default text-text-primary text-sm focus:outline-none focus:border-brand-primary"
              />
              <span className="text-[11px] text-text-secondary mt-1 block">
                Time next person in line has to claim. Default: 5 min.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Max Active Reservations per Resident
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={settings.max_active_reservations}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    max_active_reservations: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-md bg-canvas border border-border-default text-text-primary text-sm focus:outline-none focus:border-brand-primary"
              />
              <span className="text-[11px] text-text-secondary mt-1 block">
                Prevents one resident monopolising multiple machines. Default: 1.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Collection Reminder Delay (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.collect_reminder_minutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    collect_reminder_minutes: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-md bg-canvas border border-border-default text-text-primary text-sm focus:outline-none focus:border-brand-primary"
              />
              <span className="text-[11px] text-text-secondary mt-1 block">
                Repeats every 10 min after cycle finish until collected. Default: 15 min.
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Rules */}
        <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card space-y-5">
          <div className="border-b border-border-default pb-3">
            <h2 className="text-base font-bold font-heading text-text-primary">
              Flat Pricing (Integer Cents EUR)
            </h2>
            <p className="text-xs text-text-secondary">
              Prices come strictly from building settings, never from client requests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Washer Price (cents)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={settings.price_washer_cents}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      price_washer_cents: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-md bg-canvas border border-border-default text-text-primary text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <span className="text-[11px] text-text-secondary mt-1 block">
                Equals €{(settings.price_washer_cents / 100).toFixed(2)} per wash cycle.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Dryer Price (cents)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={settings.price_dryer_cents}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      price_dryer_cents: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-md bg-canvas border border-border-default text-text-primary text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>
              <span className="text-[11px] text-text-secondary mt-1 block">
                Equals €{(settings.price_dryer_cents / 100).toFixed(2)} per dry cycle.
              </span>
            </div>
          </div>
        </div>

        {/* Quiet Hours & Access */}
        <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card space-y-4">
          <div className="border-b border-border-default pb-3">
            <h2 className="text-base font-bold font-heading text-text-primary">
              Building Access & Quiet Hours
            </h2>
            <p className="text-xs text-text-secondary">
              Quiet hours enforce no new starts during night hours.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Quiet Hours Range (HH:MM-HH:MM)
            </label>
            <input
              type="text"
              value={settings.quiet_hours}
              onChange={(e) => setSettings({ ...settings, quiet_hours: e.target.value })}
              className="w-full max-w-xs px-3 py-2 rounded-md bg-canvas border border-border-default text-text-primary text-sm focus:outline-none focus:border-brand-primary"
            />
            <span className="text-[11px] text-text-secondary mt-1 block">
              Machines cannot be started during this window. Default: 22:00-06:00.
            </span>
          </div>

          <div className="pt-2 divide-y divide-border-default">
            <Toggle
              checked={settings.require_manager_approval}
              onChange={(val) =>
                setSettings({ ...settings, require_manager_approval: val })
              }
              label="Require Manager Approval"
              description="New residents entering invite code wait in pending approval before reserving."
            />
            <Toggle
              checked={settings.auto_refund_on_fault}
              onChange={(val) =>
                setSettings({ ...settings, auto_refund_on_fault: val })
              }
              label="Automatic Refund on Machine Fault"
              description="Automatically issue a Stripe refund if a machine fails or disconnects mid-cycle."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm bg-brand-primary text-text-on-brand hover:bg-brand-strong transition-colors shadow"
          >
            <Save className="w-4 h-4" />
            Save Building Rules
          </button>
        </div>
      </form>
    </div>
  );
}

