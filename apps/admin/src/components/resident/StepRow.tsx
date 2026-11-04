import React from 'react';

interface StepRowProps {
  number: number;
  title: string;
  text: string;
}

export function StepRow({ number, title, text }: StepRowProps) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-7 h-7 rounded-full bg-brand-tint text-brand-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <div className="text-sm font-semibold text-text-primary leading-tight">{title}</div>
        <div className="text-xs text-text-secondary mt-0.5 leading-relaxed">{text}</div>
      </div>
    </div>
  );
}

