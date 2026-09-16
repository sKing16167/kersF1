'use client';

import React from 'react';
import { Flag, Search, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'flag' | 'search' | 'data';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'NO TELEMETRY RECORDED',
  description = 'No matching session data or race records were found for the selected query filters.',
  icon = 'flag',
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg bg-[#080B11]/70 border border-white/[0.08] font-mono select-none ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#FF1801]/10 border border-[#FF1801]/20 flex items-center justify-center text-[#FF1801] mb-3">
        {icon === 'search' ? (
          <Search className="w-5 h-5" />
        ) : (
          <Flag className="w-5 h-5" />
        )}
      </div>
      <h3 className="text-xs font-bold tracking-wider text-white uppercase mb-1">
        {title}
      </h3>
      <p className="text-[11px] text-neutral-400 max-w-sm leading-relaxed mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-[11px] font-semibold text-neutral-200 hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
