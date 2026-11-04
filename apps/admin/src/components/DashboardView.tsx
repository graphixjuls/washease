'use client';

import React from 'react';
import { StatTile } from './StatTile';
import { StatusBadge } from './StatusBadge';
import { ResidentRequest } from './ResidentRequest';
import { RefreshCw, Zap, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import type { AdminTab } from './AdminSidebar';

interface DashboardViewProps {
  onNavigate: (tab: AdminTab) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const recentActivity = [
    {
      id: '1',
      machine: 'Washer 02',
      room: 'Room A',
      resident: 'Lukas Meyer (Flat 4A)',
      action: 'Cycle started',
      details: 'Cotton 60°C · 52 min left',
      time: '3 min ago',
      status: 'running' as const,
    },
    {
      id: '2',
      machine: 'Dryer 01',
      room: 'Room A',
      resident: 'Sophie Schmidt (Flat 1C)',
      action: 'Reserved',
      details: 'Held for 8 min',
      time: '6 min ago',
      status: 'reserved' as const,
    },
    {
      id: '3',
      machine: 'Washer 05',
      room: 'Room B',
      resident: 'Marco Rossi (Flat 2B)',
      action: 'Cycle finished',
      details: 'Ready for collection',
      time: '12 min ago',
      status: 'done' as const,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-text-primary truncate">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5 truncate">
            Real-time status of 20 machines at Wilhelmstr. 12, 79098 Freiburg
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-status-success-tint text-status-success">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            Simulator Online
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Cycles today"
          value="42"
          note="+8 from yesterday"
          icon={<RefreshCw className="w-5 h-5" />}
        />
        <StatTile
          label="Utilisation"
          value="78%"
          note="Peak 17:00–21:00"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatTile
          label="Revenue today"
          value="€126.00"
          note="34 washes · 12 dries"
          icon={<Zap className="w-5 h-5" />}
        />
        <StatTile
          label="Machines offline"
          value="0"
          note="All 20 healthy"
          icon={<AlertCircle className="w-5 h-5" />}
        />
      </div>

      {/* Two columns: Needs Attention + Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 min-w-0">
        {/* Left Column: Live machine glance */}
        <div className="lg:col-span-2 bg-surface rounded-lg p-5 sm:p-6 border border-border-default shadow-card min-w-0">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold font-heading text-text-primary truncate">
                Live Machines Right Now
              </h2>
              <p className="text-xs text-text-secondary truncate">
                12 Available · 6 In use · 2 Reserved
              </p>
            </div>
            <button
              onClick={() => onNavigate('machines')}
              className="text-xs font-semibold text-brand-primary flex items-center gap-1 hover:underline flex-shrink-0"
            >
              View all 20 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 min-w-0">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-md bg-canvas border border-border-default gap-3 min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-md bg-brand-tint text-brand-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {act.machine.split(' ')[0][0]}
                    {act.machine.split(' ')[1]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">
                      {act.machine}{' '}
                      <span className="text-xs font-normal text-text-secondary">
                        ({act.room})
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary truncate">
                      {act.resident} · {act.details}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={act.status} />
                  <div className="text-[10px] text-text-disabled mt-1">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Needs attention */}
        <div className="bg-surface rounded-lg p-5 sm:p-6 border border-border-default shadow-card flex flex-col justify-between min-w-0">
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heading text-text-primary truncate">
                Needs Attention
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-tint text-brand-primary flex-shrink-0">
                1 pending
              </span>
            </div>
            <p className="text-xs text-text-secondary mb-4">
              Review resident access requests and machine alerts.
            </p>

            <ResidentRequest
              initials="AW"
              name="Anna Weber"
              detail="Flat 3B · Code 482913"
              onApprove={() => alert('Approved Anna Weber')}
              onDecline={() => alert('Declined Anna Weber')}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-border-default min-w-0">
            <div className="text-xs text-text-secondary truncate">
              Invite code for building Wilhelmstr. 12:
            </div>
            <div className="text-xl font-bold font-heading tracking-widest text-brand-primary mt-1">
              482913
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
