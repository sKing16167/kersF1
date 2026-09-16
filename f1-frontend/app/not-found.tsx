'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, MapPin, Activity, ChevronRight } from 'lucide-react';
import { KersLogo } from '@/components/ui/KersLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF1801]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-lg w-full relative z-10 space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <KersLogo size={36} showText={true} />
        </div>

        {/* Large 404 Graphic */}
        <div className="relative py-4">
          <span className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/30 via-white/10 to-transparent select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-3 py-1 rounded bg-[#FF1801]/10 border border-[#FF1801]/30 text-[#FF1801] text-xs font-bold tracking-widest uppercase">
              TRACK LIMIT VIOLATION
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            SECTOR OUT OF BOUNDS
          </h1>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            The requested telemetry stream or circuit sector does not exist on the current FIA race calendar.
          </p>
        </div>

        {/* Recovery Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
          <Link
            href="/"
            className="flex items-center justify-between p-3.5 rounded-lg bg-[#0B0E15] hover:bg-[#121622] border border-white/[0.08] hover:border-[#FF1801]/50 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-[#FF1801]" />
              <div>
                <div className="text-xs font-bold text-white">Pit Straight</div>
                <div className="text-[10px] text-neutral-500">Return to Dashboard</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/circuits"
            className="flex items-center justify-between p-3.5 rounded-lg bg-[#0B0E15] hover:bg-[#121622] border border-white/[0.08] hover:border-[#FF1801]/50 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#00E5FF]" />
              <div>
                <div className="text-xs font-bold text-white">Circuits</div>
                <div className="text-[10px] text-neutral-500">23 Global Tracks</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/ghosting-arena"
            className="flex items-center justify-between p-3.5 rounded-lg bg-[#0B0E15] hover:bg-[#121622] border border-white/[0.08] hover:border-[#FF1801]/50 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#39FF14]" />
              <div>
                <div className="text-xs font-bold text-white">Ghosting Arena</div>
                <div className="text-[10px] text-neutral-500">Lap Telemetry</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/track-map"
            className="flex items-center justify-between p-3.5 rounded-lg bg-[#0B0E15] hover:bg-[#121622] border border-white/[0.08] hover:border-[#FF1801]/50 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#FFB800]" />
              <div>
                <div className="text-xs font-bold text-white">Micro-Sectors</div>
                <div className="text-[10px] text-neutral-500">Velocity Maps</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
