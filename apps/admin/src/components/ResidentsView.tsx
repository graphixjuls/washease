'use client';

import React, { useState } from 'react';
import { ResidentRequest } from './ResidentRequest';
import { UserCheck, Clock, Shield } from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  flat: string;
  role: 'resident' | 'manager' | 'technician';
  membership: 'active' | 'pending' | 'paused';
  cyclesCompleted: number;
  joinedDate: string;
}

const INITIAL_RESIDENTS: Resident[] = [
  { id: '1', name: 'Lukas Meyer', flat: 'Flat 4A', role: 'resident', membership: 'active', cyclesCompleted: 24, joinedDate: 'Oct 2026' },
  { id: '2', name: 'Sophie Schmidt', flat: 'Flat 1C', role: 'resident', membership: 'active', cyclesCompleted: 18, joinedDate: 'Oct 2026' },
  { id: '3', name: 'Marco Rossi', flat: 'Flat 2B', role: 'resident', membership: 'active', cyclesCompleted: 31, joinedDate: 'Sep 2026' },
  { id: '4', name: 'Elena Hoffmann', flat: 'Flat 5A', role: 'resident', membership: 'active', cyclesCompleted: 14, joinedDate: 'Nov 2026' },
  { id: '5', name: 'Hans Gruber', flat: 'Building Manager', role: 'manager', membership: 'active', cyclesCompleted: 2, joinedDate: 'Jan 2026' },
];

export function ResidentsView() {
  const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'p1', initials: 'AW', name: 'Anna Weber', detail: 'Flat 3B · Invite code 482913' },
    { id: 'p2', initials: 'TK', name: 'Tobias Klein', detail: 'Flat 2A · Invite code 482913' },
  ]);

  const handleApprove = (id: string, name: string, detail: string) => {
    const flat = detail.split('·')[0].trim();
    setResidents((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name,
        flat,
        role: 'resident',
        membership: 'active',
        cyclesCompleted: 0,
        joinedDate: 'Today',
      },
    ]);
    setPendingRequests((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDecline = (id: string) => {
    setPendingRequests((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-text-primary">Residents & Access</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage resident access, approve building registrations, and review resident accounts.
        </p>
      </div>

      {/* Pending Approvals */}
      {pendingRequests.length > 0 && (
        <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-status-warning" />
            <h2 className="text-lg font-bold font-heading text-text-primary">
              Pending Approvals ({pendingRequests.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <ResidentRequest
                key={req.id}
                initials={req.initials}
                name={req.name}
                detail={req.detail}
                onApprove={() => handleApprove(req.id, req.name, req.detail)}
                onDecline={() => handleDecline(req.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Residents Table */}
      <div className="bg-surface rounded-lg border border-border-default shadow-card overflow-hidden">
        <div className="p-6 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-bold font-heading text-text-primary">
              All Verified Residents ({residents.length})
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-subtle text-text-secondary text-xs font-semibold border-b border-border-default">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Flat / Apartment</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Cycles Run</th>
                <th className="px-6 py-3.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {residents.map((r) => (
                <tr key={r.id} className="hover:bg-canvas transition-colors">
                  <td className="px-6 py-4 font-semibold text-text-primary flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-tint text-brand-primary flex items-center justify-center text-xs font-bold">
                      {r.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span>{r.name}</span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{r.flat}</td>
                  <td className="px-6 py-4 text-text-secondary">
                    <span className="inline-flex items-center gap-1.5 capitalize text-xs">
                      {r.role === 'manager' && <Shield className="w-3.5 h-3.5 text-brand-primary" />}
                      {r.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-status-success-tint text-status-success capitalize">
                      {r.membership}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-primary font-medium">{r.cyclesCompleted}</td>
                  <td className="px-6 py-4 text-text-secondary text-xs">{r.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

