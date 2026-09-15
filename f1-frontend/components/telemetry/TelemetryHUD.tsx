'use client';

import React from 'react';
import { TelemetryPoint, Driver } from '@/lib/types';
import { Wind } from 'lucide-react';

interface TelemetryHUDProps {
  pointA: TelemetryPoint;
  pointB: TelemetryPoint;
  driverA: Driver;
  driverB: Driver;
}

export function TelemetryHUD({ pointA, pointB, driverA, driverB }: TelemetryHUDProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CockpitCard point={pointA} driver={driverA} />
      <CockpitCard point={pointB} driver={driverB} />
    </div>
  );
}

function CockpitCard({
  point,
  driver,
}: {
  point: TelemetryPoint;
  driver: Driver;
}) {
  const isDrsActive = point.drs > 0;

  return (
    <div className="f1-glass-card p-5 rounded-lg flex flex-col gap-4 border border-white/[0.08] shadow-2xl">
      {/* Driver Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-6 rounded-none"
            style={{ backgroundColor: driver.color_hex }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight font-mono">{driver.broadcast_name}</span>
              <span className="text-[10px] font-mono text-neutral-400">#{driver.driver_number}</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">{driver.team_name}</span>
          </div>
        </div>

        {/* Minimalist DRS Pill */}
        <div
          className={`px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all ${
            isDrsActive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-white/[0.04] text-neutral-500 border border-white/[0.08]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isDrsActive ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
          <span>DRS {isDrsActive ? 'ACTIVE' : 'OFF'}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 items-center">
        {/* Speed */}
        <div className="flex flex-col items-center justify-center p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">SPEED</span>
          <span className="text-3xl font-black font-mono tracking-tight text-white my-0.5">
            {point.speed}
          </span>
          <span className="text-[9px] font-mono text-neutral-500">KM/H</span>
        </div>

        {/* Gear */}
        <div className="flex flex-col items-center justify-center p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">GEAR</span>
          <span
            className="text-3xl font-black font-mono tracking-tight my-0.5"
            style={{ color: driver.color_hex }}
          >
            {point.n_gear}
          </span>
          <span className="text-[9px] font-mono text-neutral-500">
            {point.rpm ? `${(point.rpm / 1000).toFixed(1)}k RPM` : 'DRIVE'}
          </span>
        </div>

        {/* Throttle & Brake Minimal Bars */}
        <div className="flex flex-col justify-center gap-2 p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
          <div>
            <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1 font-bold">
              <span>THR</span>
              <span className="text-white">{point.throttle}%</span>
            </div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-none overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-none transition-all duration-75"
                style={{ width: `${point.throttle}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-mono text-neutral-400 mb-1 font-bold">
              <span>BRK</span>
              <span className="text-rose-400">{point.brake}%</span>
            </div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-none overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-none transition-all duration-75"
                style={{ width: `${point.brake}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
