'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, MapPin, Activity, ChevronRight, Shield, FileText } from 'lucide-react';
import { KersLogo } from '@/components/ui/KersLogo';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-mono">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF1801]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10 space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <KersLogo size={40} showText={true} />
        </div>

        {/* Large 404 Graphic */}
        <div className="relative py-4">
          <span className="text-8xl md:text-9xl font-black font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/40 via-white/15 to-transparent select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded bg-[#FF1801]/15 border border-[#FF1801]/40 text-[#FF1801] text-xs font-bold font-mono tracking-widest uppercase shadow-lg shadow-red-600/20">
              TRACK LIMIT VIOLATION
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white">
            SECTOR OUT OF BOUNDS
          </h1>
          <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed font-sans">
            The requested telemetry stream or circuit sector does not exist on the current FIA race calendar.
          </p>
        </div>

        {/* Recovery Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
          <Link
            href="/"
            className="flex items-center justify-between p-3.5 rounded-lg f1-glass-card hover:border-[#FF1801]/60 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-[#FF1801]" />
              <div>
                <div className="text-xs font-bold text-white font-mono">Pit Straight</div>
                <div className="text-[10px] text-neutral-400">Return to Dashboard</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/circuits"
            className="flex items-center justify-between p-3.5 rounded-lg f1-glass-card hover:border-[#00E5FF]/60 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#00E5FF]" />
              <div>
                <div className="text-xs font-bold text-white font-mono">Circuits</div>
                <div className="text-[10px] text-neutral-400">39 Global Tracks</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/ghosting-arena"
            className="flex items-center justify-between p-3.5 rounded-lg f1-glass-card hover:border-[#39FF14]/60 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#39FF14]" />
              <div>
                <div className="text-xs font-bold text-white font-mono">Ghosting Arena</div>
                <div className="text-[10px] text-neutral-400">Driver Telemetry Deltas</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/track-map"
            className="flex items-center justify-between p-3.5 rounded-lg f1-glass-card hover:border-[#FFB800]/60 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#FFB800]" />
              <div>
                <div className="text-xs font-bold text-white font-mono">Micro-Sectors</div>
                <div className="text-[10px] text-neutral-400">Velocity Maps</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Footer Legal Sub-Links */}
        <div className="pt-4 flex items-center justify-center gap-4 text-[11px] text-neutral-400">
          <Link href="/privacy" className="hover:text-white flex items-center gap-1 transition-colors">
            <Shield className="w-3 h-3 text-[#00E5FF]" />
            <span>Privacy Policy</span>
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white flex items-center gap-1 transition-colors">
            <FileText className="w-3 h-3 text-[#FF1801]" />
            <span>Terms & Conditions</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
