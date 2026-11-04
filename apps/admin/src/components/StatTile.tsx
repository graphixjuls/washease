import React from 'react';

interface StatTileProps {
  label: string;
  value: string;
  note?: string;
  icon?: React.ReactNode;
}

export function StatTile({ label, value, note, icon }: StatTileProps) {
  return (
    <div className="bg-surface rounded-lg p-6 border border-border-default shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-sm font-medium">{label}</span>
        {icon && <div className="text-brand-primary p-2 bg-brand-tint rounded-md">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold font-heading text-text-primary">{value}</div>
        {note && <div className="text-xs text-text-secondary mt-1">{note}</div>}
      </div>
    </div>
  );
}

