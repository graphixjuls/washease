'use client';

import React, { useState } from 'react';
import { StatusBadge, BadgeStatus } from './StatusBadge';
import { Disc, Filter, AlertTriangle } from 'lucide-react';

interface MachineItem {
  id: string;
  name: string;
  type: 'washer' | 'dryer';
  room: 'Room A' | 'Room B';
  model: string;
  capacity: string;
  status: BadgeStatus;
  currentProgram?: string;
  timeLeft?: string;
  price: string;
}

const INITIAL_MACHINES: MachineItem[] = [
  // Room A - 5 Washers, 5 Dryers
  { id: 'w01', name: 'Washer 01', type: 'washer', room: 'Room A', model: 'Miele PWM 507', capacity: '8 kg', status: 'available', price: '€3.00' },
  { id: 'w02', name: 'Washer 02', type: 'washer', room: 'Room A', model: 'Miele PWM 507', capacity: '8 kg', status: 'running', currentProgram: 'Cotton 60°C', timeLeft: '38 min left', price: '€3.00' },
  { id: 'w03', name: 'Washer 03', type: 'washer', room: 'Room A', model: 'Miele PWM 507', capacity: '8 kg', status: 'available', price: '€3.00' },
  { id: 'w04', name: 'Washer 04', type: 'washer', room: 'Room A', model: 'Miele PWM 507', capacity: '8 kg', status: 'reserved', timeLeft: '07:20 hold', price: '€3.00' },
  { id: 'w05', name: 'Washer 05', type: 'washer', room: 'Room A', model: 'Miele PWM 507', capacity: '8 kg', status: 'available', price: '€3.00' },
  { id: 'd01', name: 'Dryer 01', type: 'dryer', room: 'Room A', model: 'Miele PDR 507', capacity: '8 kg', status: 'running', currentProgram: 'Cupboard Dry', timeLeft: '19 min left', price: '€2.00' },
  { id: 'd02', name: 'Dryer 02', type: 'dryer', room: 'Room A', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },
  { id: 'd03', name: 'Dryer 03', type: 'dryer', room: 'Room A', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },
  { id: 'd04', name: 'Dryer 04', type: 'dryer', room: 'Room A', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },
  { id: 'd05', name: 'Dryer 05', type: 'dryer', room: 'Room A', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },

  // Room B - 5 Washers, 5 Dryers
  { id: 'w06', name: 'Washer 06', type: 'washer', room: 'Room B', model: 'Miele PWM 507', capacity: '8 kg', status: 'available', price: '€3.00' },
  { id: 'w07', name: 'Washer 07', type: 'washer', room: 'Room B', model: 'Miele PWM 507', capacity: '8 kg', status: 'running', currentProgram: 'Eco 40°C', timeLeft: '24 min left', price: '€3.00' },
  { id: 'w08', name: 'Washer 08', type: 'washer', room: 'Room B', model: 'Miele PWM 507', capacity: '8 kg', status: 'available', price: '€3.00' },
  { id: 'w09', name: 'Washer 09', type: 'washer', room: 'Room B', model: 'Miele PWM 507', capacity: '8 kg', status: 'available', price: '€3.00' },
  { id: 'w10', name: 'Washer 10', type: 'washer', room: 'Room B', model: 'Miele PWM 507', capacity: '8 kg', status: 'available', price: '€3.00' },
  { id: 'd06', name: 'Dryer 06', type: 'dryer', room: 'Room B', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },
  { id: 'd07', name: 'Dryer 07', type: 'dryer', room: 'Room B', model: 'Miele PDR 507', capacity: '8 kg', status: 'running', currentProgram: 'Quick Dry', timeLeft: '11 min left', price: '€2.00' },
  { id: 'd08', name: 'Dryer 08', type: 'dryer', room: 'Room B', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },
  { id: 'd09', name: 'Dryer 09', type: 'dryer', room: 'Room B', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },
  { id: 'd10', name: 'Dryer 10', type: 'dryer', room: 'Room B', model: 'Miele PDR 507', capacity: '8 kg', status: 'available', price: '€2.00' },
];

export function MachinesView() {
  const [machines, setMachines] = useState<MachineItem[]>(INITIAL_MACHINES);
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<MachineItem | null>(null);

  const filtered = machines.filter((m) => {
    if (filterRoom !== 'all' && m.room !== filterRoom) return false;
    if (filterType !== 'all' && m.type !== filterType) return false;
    return true;
  });

  const toggleOutOfOrder = (id: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newStatus: BadgeStatus = m.status === 'out_of_order' ? 'available' : 'out_of_order';
        return { ...m, status: newStatus };
      })
    );
    if (selectedMachine && selectedMachine.id === id) {
      setSelectedMachine((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === 'out_of_order' ? 'available' : 'out_of_order',
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Machines</h1>
          <p className="text-sm text-text-secondary mt-1">
            20 Miele professional machines across Room A & Room B
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Room filter tabs */}
          <div className="flex items-center bg-subtle p-1 rounded-md border border-border-default text-xs font-semibold">
            {['all', 'Room A', 'Room B'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRoom(r)}
                className={`px-3 py-1.5 rounded-sm transition-colors ${
                  filterRoom === r
                    ? 'bg-surface text-brand-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {r === 'all' ? 'All Rooms' : r}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center bg-subtle p-1 rounded-md border border-border-default text-xs font-semibold">
            {['all', 'washer', 'dryer'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-sm capitalize transition-colors ${
                  filterType === t
                    ? 'bg-surface text-brand-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {t === 'all' ? 'All Types' : t + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Machine Table */}
      <div className="bg-surface rounded-lg border border-border-default shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-subtle text-text-secondary text-xs font-semibold border-b border-border-default">
              <tr>
                <th className="px-6 py-3.5">Machine</th>
                <th className="px-6 py-3.5">Type & Room</th>
                <th className="px-6 py-3.5">Model & Spec</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-canvas transition-colors cursor-pointer"
                  onClick={() => setSelectedMachine(m)}
                >
                  <td className="px-6 py-4 font-semibold text-text-primary flex items-center gap-3">
                    <Disc className="w-4 h-4 text-brand-primary" />
                    <span>{m.name}</span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    <span className="capitalize">{m.type}</span> · {m.room}
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-xs">
                    {m.model} ({m.capacity})
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={m.status} />
                      {m.timeLeft && (
                        <span className="text-xs text-text-secondary">
                          ({m.timeLeft})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-text-primary">{m.price}</td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleOutOfOrder(m.id)}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                        m.status === 'out_of_order'
                          ? 'bg-status-success-tint text-status-success hover:bg-status-success hover:text-white'
                          : 'bg-subtle text-text-secondary hover:text-status-danger'
                      }`}
                    >
                      {m.status === 'out_of_order' ? 'Set Available' : 'Set Out of Order'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine Detail Modal / Drawer */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-border-default shadow-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border-default pb-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-text-primary">
                  {selectedMachine.name}
                </h3>
                <p className="text-xs text-text-secondary">
                  {selectedMachine.room} · {selectedMachine.model}
                </p>
              </div>
              <StatusBadge status={selectedMachine.status} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-border-default">
                <span className="text-text-secondary">Machine Type</span>
                <span className="font-semibold text-text-primary capitalize">
                  {selectedMachine.type}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-default">
                <span className="text-text-secondary">Capacity</span>
                <span className="font-semibold text-text-primary">{selectedMachine.capacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-default">
                <span className="text-text-secondary">Flat Price per Cycle</span>
                <span className="font-semibold text-text-primary">{selectedMachine.price}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-default">
                <span className="text-text-secondary">Gateway Signal</span>
                <span className="font-semibold text-status-success">Online · BLE 5.2 (100%)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-default">
                <span className="text-text-secondary">Total Lifetime Cycles</span>
                <span className="font-semibold text-text-primary">842 cycles</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Recent Faults</span>
                <span className="text-text-secondary">None reported</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
              <button
                onClick={() => setSelectedMachine(null)}
                className="px-4 py-2 rounded-md text-sm font-semibold text-text-secondary hover:bg-canvas transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => toggleOutOfOrder(selectedMachine.id)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  selectedMachine.status === 'out_of_order'
                    ? 'bg-status-success text-white'
                    : 'bg-status-danger text-white'
                }`}
              >
                {selectedMachine.status === 'out_of_order'
                  ? 'Reactivate Machine'
                  : 'Mark Out of Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

