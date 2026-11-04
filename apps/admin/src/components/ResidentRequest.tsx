import React from 'react';

interface ResidentRequestProps {
  initials: string;
  name: string;
  detail: string;
  onApprove: () => void;
  onDecline: () => void;
}

export function ResidentRequest({
  initials,
  name,
  detail,
  onApprove,
  onDecline,
}: ResidentRequestProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border-default">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-tint text-brand-primary flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
        <div>
          <div className="font-semibold text-text-primary text-sm">{name}</div>
          <div className="text-xs text-text-secondary">{detail}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecline}
          className="px-3 py-1.5 rounded-md text-xs font-semibold text-text-secondary bg-subtle hover:bg-border-default transition-colors"
        >
          Decline
        </button>
        <button
          onClick={onApprove}
          className="px-3 py-1.5 rounded-md text-xs font-semibold text-text-on-brand bg-brand-primary hover:bg-brand-strong transition-colors"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

