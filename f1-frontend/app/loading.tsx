'use client';

import React from 'react';
import { KersLogo } from '@/components/ui/KersLogo';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF1801]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <KersLogo size={42} showText={true} animated={true} />

        {/* Telemetry Sensor Sync Animation */}
        <div className="flex flex-col items-center space-y-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF1801] animate-ping" />
            <span className="text-xs font-bold tracking-widest text-neutral-300 uppercase">
              SYNCHRONIZING CAN-BUS TELEMETRY
            </span>
          </div>
          <div className="w-48 h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FF1801] to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>
          <p className="text-[10px] text-neutral-500 font-mono">
            Calibrating micro-sector velocity sensors...
          </p>
        </div>
      </div>
    </div>
  );
}
