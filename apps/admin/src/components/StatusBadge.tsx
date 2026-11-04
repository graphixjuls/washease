import React from 'react';

export type BadgeStatus = 'available' | 'in_use' | 'reserved' | 'running' | 'done' | 'out_of_order';

interface StatusBadgeProps {
  status: BadgeStatus;
  labelOverride?: string;
}

export function StatusBadge({ status, labelOverride }: StatusBadgeProps) {
  let dotColor = 'bg-status-success';
  let badgeBg = 'bg-status-success-tint';
  let textColor = 'text-status-success';
  let label = 'Available';

  switch (status) {
    case 'available':
      dotColor = 'bg-status-success';
      badgeBg = 'bg-status-success-tint';
      textColor = 'text-status-success';
      label = 'Available';
      break;
    case 'reserved':
    case 'running':
    case 'in_use':
      dotColor = 'bg-status-warning';
      badgeBg = 'bg-status-warning-tint';
      textColor = 'text-status-warning-text';
      label = status === 'reserved' ? 'Reserved' : status === 'running' ? 'Running' : 'In use';
      break;
    case 'done':
      dotColor = 'bg-status-info';
      badgeBg = 'bg-brand-tint';
      textColor = 'text-status-info';
      label = 'Done';
      break;
    case 'out_of_order':
      dotColor = 'bg-status-danger';
      badgeBg = 'bg-status-danger-tint';
      textColor = 'text-status-danger';
      label = 'Out of order';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${badgeBg} ${textColor}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span>{labelOverride || label}</span>
    </span>
  );
}

