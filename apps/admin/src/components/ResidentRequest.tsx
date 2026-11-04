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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface rounded-lg border border-border-default min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-brand-tint text-brand-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-text-primary text-sm truncate">{name}</div>
          <div className="text-xs text-text-secondary truncate">{detail}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
        <button
          onClick={onDecline}
          className="px-3 py-1.5 rounded-md text-xs font-semibold text-text-secondary bg-subtle hover:bg-border-default transition-colors flex-shrink-0"
        >
          Decline
        </button>
        <button
          onClick={onApprove}
          className="px-3 py-1.5 rounded-md text-xs font-semibold text-text-on-brand bg-brand-primary hover:bg-brand-strong transition-colors flex-shrink-0"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
