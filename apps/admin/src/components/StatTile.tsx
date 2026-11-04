import React from 'react';

interface StatTileProps {
  label: string;
  value: string;
  note?: string;
  icon?: React.ReactNode;
}

export function StatTile({ label, value, note, icon }: StatTileProps) {
  return (
    <div className="bg-surface rounded-lg p-5 border border-border-default shadow-card flex flex-col justify-between min-w-0">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-text-secondary text-xs sm:text-sm font-medium leading-tight">
          {label}
        </span>
        {icon && (
          <div className="text-brand-primary p-2 bg-brand-tint rounded-md flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-xl sm:text-2xl font-bold font-heading text-text-primary truncate">
          {value}
        </div>
        {note && (
          <div className="text-[11px] sm:text-xs text-text-secondary mt-1 leading-normal truncate">
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
