'use client';

import React from 'react';
import { StatusBadge, BadgeStatus } from './StatusBadge';
import { Activity, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  time: string;
  machine: string;
  resident: string;
  program: string;
  duration: string;
  amount: string;
  status: BadgeStatus;
}

const ACTIVITIES: ActivityItem[] = [
  { id: '1', time: '14:22', machine: 'Washer 02 (Room A)', resident: 'Lukas Meyer', program: 'Cotton 60°C', duration: '60 min', amount: '€3.00', status: 'running' },
  { id: '2', time: '14:18', machine: 'Dryer 01 (Room A)', resident: 'Sophie Schmidt', program: 'Cupboard Dry', duration: '40 min', amount: '€2.00', status: 'reserved' },
  { id: '3', time: '13:50', machine: 'Washer 05 (Room B)', resident: 'Marco Rossi', program: 'Quick 30', duration: '30 min', amount: '€3.00', status: 'done' },
  { id: '4', time: '12:45', machine: 'Washer 01 (Room A)', resident: 'Elena Hoffmann', program: 'Eco 40°C', duration: '45 min', amount: '€3.00', status: 'available' },
  { id: '5', time: '11:10', machine: 'Dryer 07 (Room B)', resident: 'Tobias Klein', program: 'Delicates Dry', duration: '35 min', amount: '€2.00', status: 'available' },
  { id: '6', time: '09:30', machine: 'Washer 07 (Room B)', resident: 'Anna Weber', program: 'Wool 30°C', duration: '40 min', amount: '€3.00', status: 'available' },
];

export function ActivityView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Live Activity</h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time feed of reservations, unlocks, machine starts, and completions.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border-default shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-subtle text-text-secondary text-xs font-semibold border-b border-border-default">
              <tr>
                <th className="px-6 py-3.5">Time</th>
                <th className="px-6 py-3.5">Machine</th>
                <th className="px-6 py-3.5">Resident</th>
                <th className="px-6 py-3.5">Program Selected</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {ACTIVITIES.map((act) => (
                <tr key={act.id} className="hover:bg-canvas transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{act.time}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-primary">{act.machine}</td>
                  <td className="px-6 py-4 text-text-secondary">{act.resident}</td>
                  <td className="px-6 py-4 text-text-primary font-medium">{act.program}</td>
                  <td className="px-6 py-4 text-text-secondary">{act.duration}</td>
                  <td className="px-6 py-4 font-semibold text-text-primary">{act.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <StatusBadge status={act.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

