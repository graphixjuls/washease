'use client';

import React from 'react';
import { StatTile } from './StatTile';
import { CreditCard, ArrowDownRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export function PaymentsView() {
  const transactions = [
    { id: 'tx_1', date: 'Today, 14:22', machine: 'Washer 02', resident: 'Lukas Meyer', amount: '€3.00', status: 'paid' },
    { id: 'tx_2', date: 'Today, 13:50', machine: 'Washer 05', resident: 'Marco Rossi', amount: '€3.00', status: 'paid' },
    { id: 'tx_3', date: 'Yesterday, 18:10', machine: 'Dryer 04', resident: 'Sophie Schmidt', amount: '€2.00', status: 'paid' },
    { id: 'tx_4', date: 'Yesterday, 16:45', machine: 'Washer 03', resident: 'Anna Weber', amount: '€3.00', status: 'refunded' },
    { id: 'tx_5', date: 'Nov 2, 2026', machine: 'Washer 08', resident: 'Elena Hoffmann', amount: '€3.00', status: 'paid' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-text-primary">Payments & Payouts</h1>
        <p className="text-sm text-text-secondary mt-1">
          Stripe automated billing, flat cycle pricing, and monthly building payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          label="Total Revenue (Nov 2026)"
          value="€3,420.00"
          note="1,140 total cycles completed"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <StatTile
          label="Next Payout (Nov 15)"
          value="€3,414.00"
          note="To IBAN DE44 ... 8802"
          icon={<ArrowDownRight className="w-5 h-5 text-status-success" />}
        />
        <StatTile
          label="Refunds this month"
          value="€6.00"
          note="2 auto-refunds on machine faults"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
      </div>

      <div className="bg-surface rounded-lg border border-border-default shadow-card overflow-hidden">
        <div className="p-6 border-b border-border-default flex items-center justify-between">
          <h2 className="text-lg font-bold font-heading text-text-primary">
            Recent Transactions
          </h2>
          <span className="text-xs text-text-secondary flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-status-success" />
            Stripe Test Mode Active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-subtle text-text-secondary text-xs font-semibold border-b border-border-default">
              <tr>
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5">Machine</th>
                <th className="px-6 py-3.5">Resident</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-canvas transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary">{tx.id}</td>
                  <td className="px-6 py-4 text-text-secondary text-xs">{tx.date}</td>
                  <td className="px-6 py-4 font-semibold text-text-primary">{tx.machine}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.resident}</td>
                  <td className="px-6 py-4 font-bold text-text-primary">{tx.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        tx.status === 'paid'
                          ? 'bg-status-success-tint text-status-success'
                          : 'bg-status-danger-tint text-status-danger'
                      }`}
                    >
                      {tx.status}
                    </span>
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

