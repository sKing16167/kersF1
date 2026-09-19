'use client';

import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '@/lib/store';
import { ChevronRight, Cpu, Radio, Shield, Zap, Activity } from 'lucide-react';
import { KersLogo } from '@/components/ui/KersLogo';

export function KersIntroExperience() {
  const { showIntro, setShowIntro } = useTelemetryStore();
  const [stage, setStage] = useState<'scan' | 'reveal' | 'ready' | 'exiting'>('scan');

  useEffect(() => {
    if (showIntro) {
      setStage('scan');

      // Phase 2: Unveil the Logo Mark & Speed Stripes Fade In
      const t1 = setTimeout(() => {
        setStage('reveal');
      }, 300);

      // Phase 3: Ready state
      const t2 = setTimeout(() => {
        setStage('ready');
      }, 1100);

      // Phase 4: Smooth transition into dashboard
      const t3 = setTimeout(() => {
        handleEnter();
      }, 3300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [showIntro]);

  const handleEnter = () => {
    setStage('exiting');
    setTimeout(() => {
      setShowIntro(false);
      setStage('scan');
    }, 600);
  };

  if (!showIntro) return null;

  return (
    <div
      onClick={handleEnter}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 md:p-12 select-none overflow-hidden cursor-pointer transition-all duration-700 ${
        stage === 'exiting'
          ? 'opacity-0 scale-105 pointer-events-none blur-xl'
          : 'opacity-100 scale-100 blur-0'
      } bg-[#06080D]`}
    >
      {/* Precision Background Atmosphere & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Center Red Horizon Ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.12)_0%,transparent_70%)] blur-3xl" />

        {/* Minimal Laser Scanline Horizon */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] translate-y-16 bg-gradient-to-r from-transparent via-[#E10600]/20 to-transparent" />

        {/* Fine Technical Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Header */}
      <div className="w-full max-w-5xl flex items-center justify-between z-30">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-[#FF1801] animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] font-bold">kersF1 • FIA TELEMETRY PLATFORM</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="px-4 py-1.5 rounded-full ios-pill text-neutral-400 hover:text-white text-xs font-mono transition-all hover:scale-105 active:scale-95 border border-white/10 hover:border-white/20 bg-white/[0.04]"
        >
          Skip Intro →
        </button>
      </div>

      {/* Centerpiece: High-Tech Telemetry Boot & Iconic KERS Logo */}
      <div className="relative w-full max-w-2xl flex flex-col items-center justify-center my-auto z-20 text-center">
        {/* Main Precision Monogram Glass Card */}
        <div className="relative w-full px-8 sm:px-14 py-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex flex-col items-center gap-6">
          
          {/* Technical Corner Coordinate Markers */}
          <span className="absolute top-3 left-3 text-[10px] font-mono text-white/20">┌ 00.0</span>
          <span className="absolute top-3 right-3 text-[10px] font-mono text-white/20">100.0 ┐</span>
          <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#FF1801]/30">└ APEX</span>
          <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#FF1801]/30">LIVE ┘</span>

          {/* AMG-Inspired KERS Kinetic Monogram with Animated Speed Stripes */}
          <div className="relative group my-2 flex flex-col items-center justify-center">
            {/* Precision Red Ambient Halo */}
            <div className="absolute w-52 h-32 rounded-full bg-[#FF1801]/20 blur-3xl group-hover:bg-[#FF1801]/30 transition-all duration-500" />

            {/* Pure Motorsport KERS Emblem with 5 Animated Fading Speed Lines */}
            <div className="relative px-9 py-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex items-center justify-center">
              <KersLogo size={68} variant="full" animated={true} colorScheme="white" />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] text-neutral-300 uppercase font-bold">
              kersF1 • Telemetry & Strategy Hub
            </p>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEnter();
              }}
              className="px-8 py-3 rounded-full ios-pill bg-white/[0.08] hover:bg-[#FF1801] border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-red-950/40 cursor-pointer"
            >
              <span>Enter Hub</span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Status Indicators */}
      <div className="w-full max-w-5xl flex items-center justify-between text-[11px] font-mono text-neutral-500 z-30">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>kersF1 • 2026 WORLD CHAMPIONSHIP • FASTF1 READY</span>
        </div>

        <span className="hidden sm:inline text-neutral-600 font-medium">CLICK ANYWHERE TO ENTER</span>

        <span>FASTF1 HIGH-FREQUENCY TELEMETRY</span>
      </div>
    </div>
  );
}
