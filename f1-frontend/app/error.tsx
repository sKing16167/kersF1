'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, Radio, Activity } from 'lucide-react';
import { KersLogo } from '@/components/ui/KersLogo';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log telemetry diagnostic error to console
    console.error('[KERS Telemetry Diagnostic Error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF1801]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6">
        {/* Top Logo & Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <KersLogo size={28} showText={true} />
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-[#FF1801] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF1801] animate-pulse" />
            TELEMETRY FAULT
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="rounded-lg p-6 bg-[#090C12] border border-red-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[#FF1801] shrink-0">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                CAN-BUS TELEMETRY SENSOR DESYNC
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The optical telemetry stream encountered an unhandled computational exception while processing circuit timing sectors.
              </p>
              {error.digest && (
                <div className="inline-block px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-[10px] text-neutral-400">
                  DIGEST ID: <span className="text-white font-semibold">{error.digest}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fault Summary Box */}
          <div className="mt-5 p-3 rounded bg-black/50 border border-white/[0.06] text-[11px] text-neutral-300 font-mono break-all">
            <span className="text-[#FF1801] font-bold">[ERROR]:</span> {error.message || 'Unknown pitlane telemetry timeout'}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => reset()}
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#FF1801] hover:bg-[#E10600] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,24,1,0.3)] hover:shadow-[0_0_30px_rgba(255,24,1,0.5)] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reboot Telemetry Sensors
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white text-xs font-semibold tracking-wider transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              Pit Straight (Home)
            </Link>
          </div>
        </div>

        {/* Footer Diagnostics */}
        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-2 border-t border-white/[0.04]">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#FF1801]" />
            kersF1 FIA Telemetry Core v2.4
          </span>
          <span>Fail-Safe Mode Active</span>
        </div>
      </div>
    </div>
  );
}
