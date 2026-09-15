'use client';

import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '@/lib/store';
import { ChevronRight, Cpu, Radio, Shield, Zap, Activity } from 'lucide-react';
import { KersLogo } from '@/components/ui/KersLogo';

export function KersIntroExperience() {
  const { showIntro, setShowIntro } = useTelemetryStore();
  const [stage, setStage] = useState<'scan' | 'reveal' | 'ready' | 'exiting'>('scan');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (showIntro) {
      setStage('scan');
      setProgress(0);

      // Smooth progress ticker
      const pInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(pInterval);
            return 100;
          }
          return prev + 4;
        });
      }, 50);

      // Phase 2: Unveil the Logo Mark
      const t1 = setTimeout(() => {
        setStage('reveal');
      }, 600);

      // Phase 3: Ready state
      const t2 = setTimeout(() => {
        setStage('ready');
      }, 1400);

      // Phase 4: Smooth transition into dashboard
      const t3 = setTimeout(() => {
        handleEnter();
      }, 3600);

      return () => {
        clearInterval(pInterval);
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
          <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] font-bold">FIA TELEMETRY PLATFORM</span>
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
        <div className="relative w-full px-8 sm:px-14 py-10 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.9)] flex flex-col items-center gap-6">
          
          {/* Technical Corner Coordinate Markers */}
          <span className="absolute top-3 left-3 text-[10px] font-mono text-white/20">┌ 00.0</span>
          <span className="absolute top-3 right-3 text-[10px] font-mono text-white/20">100.0 ┐</span>
          <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#E10600]/30">└ APEX</span>
          <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[#E10600]/30">LIVE ┘</span>

          {/* AMG-Inspired KERS Kinetic Monogram with Animated Speed Stripes */}
          <div className="relative group my-4 flex flex-col items-center justify-center">
            {/* Precision Red Ambient Halo */}
            <div className="absolute w-48 h-28 rounded-full bg-[#E10600]/20 blur-3xl group-hover:bg-[#E10600]/30 transition-all duration-500" />

            {/* Pure Motorsport KERS Emblem with 5 Animated Speed Lines */}
            <div className="relative px-8 py-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-2xl flex items-center justify-center">
              <KersLogo size={64} variant="full" animated={true} />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] text-neutral-300 uppercase font-bold">
              Formula 1 Telemetry & Strategy Hub
            </p>
          </div>

          {/* High-Tech Calibration Ticker */}
          <div className="w-full max-w-sm space-y-2 pt-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#E10600]" />
                CALIBRATING 23 GPS CIRCUITS
              </span>
              <span className="text-white font-bold">{progress}%</span>
            </div>

            {/* Precision Micro Progress Bar */}
            <div className="w-full h-1 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E10600] to-white rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEnter();
              }}
              className="px-7 py-3 rounded-full ios-pill bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-red-950/40"
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
          <span>2024 SEASON • 23 CIRCUITS ACTIVE</span>
        </div>

        <span className="hidden sm:inline text-neutral-600 font-medium">CLICK ANYWHERE TO ENTER</span>

        <span>FASTF1 HIGH-FREQUENCY TELEMETRY</span>
      </div>
    </div>
  );
}
