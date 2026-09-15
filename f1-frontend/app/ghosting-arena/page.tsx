'use client';

import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '@/lib/store';
import { f1Api } from '@/lib/api';
import { TelemetryPoint } from '@/lib/types';
import { generateSyntheticTelemetry, loadParquetTelemetry } from '@/lib/parquet-loader';
import { MultiTraceCanvas } from '@/components/telemetry/MultiTraceCanvas';
import { TelemetryHUD } from '@/components/telemetry/TelemetryHUD';
import { Activity, Gauge } from 'lucide-react';

export default function GhostingArenaPage() {
  const {
    driverA,
    driverB,
    setDriverA,
    setDriverB,
    drivers,
    selectedSession,
    activeDistanceM,
  } = useTelemetryStore();

  const [telemetryA, setTelemetryA] = useState<TelemetryPoint[]>(() =>
    generateSyntheticTelemetry(0, 0)
  );
  const [telemetryB, setTelemetryB] = useState<TelemetryPoint[]>(() =>
    generateSyntheticTelemetry(1, -2.5)
  );
  const [selectedLapA, setSelectedLapA] = useState<string>('Q3 - 1:19.327 (Pole)');
  const [selectedLapB, setSelectedLapB] = useState<string>('Q3 - 1:19.436 (P2)');

  useEffect(() => {
    let isCancelled = false;
    async function loadGhostData() {
      try {
        const ghost = await f1Api.getGhostTelemetry(
          selectedSession?.id || 1,
          driverA.id,
          driverB.id
        );

        if (!isCancelled && ghost) {
          const [pointsA, pointsB] = await Promise.all([
            loadParquetTelemetry(ghost.driver_a.telemetry_file_url),
            loadParquetTelemetry(ghost.driver_b.telemetry_file_url),
          ]);

          if (pointsA.length > 0) setTelemetryA(pointsA);
          if (pointsB.length > 0) setTelemetryB(pointsB);
        }
      } catch (err) {
        console.error('Failed to load ghost data:', err);
      }
    }

    loadGhostData();
    return () => {
      isCancelled = true;
    };
  }, [driverA.id, driverB.id, selectedSession?.id]);

  const pointA = telemetryA.find((p) => p.distance >= activeDistanceM) || telemetryA[0];
  const pointB = telemetryB.find((p) => p.distance >= activeDistanceM) || telemetryB[0];

  const apexAnalysis = [
    { corner: 'T1-T2 Rettifilo', dist: 650, speedA: 74.2, speedB: 71.8, winner: driverA.broadcast_name },
    { corner: 'T3 Biassono', dist: 1450, speedA: 289.4, speedB: 291.2, winner: driverB.broadcast_name },
    { corner: 'T4-T5 Roggia', dist: 2250, speedA: 118.5, speedB: 114.2, winner: driverA.broadcast_name },
    { corner: 'T6 Lesmo 1', dist: 2750, speedA: 172.1, speedB: 169.8, winner: driverA.broadcast_name },
    { corner: 'T7 Lesmo 2', dist: 3150, speedA: 156.4, speedB: 158.1, winner: driverB.broadcast_name },
    { corner: 'T8-T10 Ascari', dist: 4200, speedA: 168.9, speedB: 164.5, winner: driverA.broadcast_name },
    { corner: 'T11 Parabolica', dist: 5300, speedA: 182.0, speedB: 184.2, winner: driverB.broadcast_name },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 f1-glass-card p-6 rounded-lg border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600]">
            <Activity className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Telemetry Ghosting Arena
            </h1>
            <p className="text-xs text-neutral-400">
              500-point normalized distance overlay comparing driver apex velocities and braking points.
            </p>
          </div>
        </div>

        {/* Quick Duel Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const nor = drivers.find((d) => d.id === 1);
              const ham = drivers.find((d) => d.id === 6);
              if (nor && ham) { setDriverA(nor); setDriverB(ham); }
            }}
            className="f1-pill px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Norris vs Hamilton
          </button>
          <button
            onClick={() => {
              const lec = drivers.find((d) => d.id === 2);
              const ham = drivers.find((d) => d.id === 6);
              if (lec && ham) { setDriverA(lec); setDriverB(ham); }
            }}
            className="f1-pill px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Leclerc vs Hamilton (Ferrari)
          </button>
          <button
            onClick={() => {
              const nor = drivers.find((d) => d.id === 1);
              const ver = drivers.find((d) => d.id === 3);
              if (nor && ver) { setDriverA(nor); setDriverB(ver); }
            }}
            className="f1-pill px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Norris vs Verstappen
          </button>
        </div>
      </div>

      {/* Driver Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Driver A */}
        <div className="f1-glass-card p-4 rounded-lg flex items-center justify-between gap-3 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-7 rounded-none"
              style={{ backgroundColor: driverA.color_hex }}
            />
            <div>
              <span className="font-bold text-xs text-white font-mono">{driverA.full_name}</span>
              <div className="text-[10px] text-neutral-400 font-mono">{driverA.team_name} • #{driverA.driver_number}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={driverA.id}
              onChange={(e) => {
                const d = drivers.find((item) => item.id === Number(e.target.value));
                if (d) setDriverA(d);
              }}
              aria-label="Select Driver A"
              className="f1-pill px-2.5 py-1 text-xs text-neutral-300 bg-transparent focus:outline-none cursor-pointer font-mono"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#0D1117]">
                  {d.broadcast_name}
                </option>
              ))}
            </select>

            <select
              value={selectedLapA}
              onChange={(e) => setSelectedLapA(e.target.value)}
              aria-label="Select Driver A Lap"
              className="f1-pill px-2.5 py-1 text-[11px] text-neutral-400 bg-transparent focus:outline-none cursor-pointer hidden sm:block font-mono"
            >
              <option value="Q3 - 1:19.327 (Pole)" className="bg-[#0D1117]">Q3 (Pole)</option>
              <option value="Q3 - 1:19.640" className="bg-[#0D1117]">Q3 (Run 1)</option>
            </select>
          </div>
        </div>

        {/* Driver B */}
        <div className="f1-glass-card p-4 rounded-lg flex items-center justify-between gap-3 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-7 rounded-none"
              style={{ backgroundColor: driverB.color_hex }}
            />
            <div>
              <span className="font-bold text-xs text-white font-mono">{driverB.full_name}</span>
              <div className="text-[10px] text-neutral-400 font-mono">{driverB.team_name} • #{driverB.driver_number}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={driverB.id}
              onChange={(e) => {
                const d = drivers.find((item) => item.id === Number(e.target.value));
                if (d) setDriverB(d);
              }}
              aria-label="Select Driver B"
              className="f1-pill px-2.5 py-1 text-xs text-neutral-300 bg-transparent focus:outline-none cursor-pointer font-mono"
            >
              {drivers.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#0D1117]">
                  {d.broadcast_name}
                </option>
              ))}
            </select>

            <select
              value={selectedLapB}
              onChange={(e) => setSelectedLapB(e.target.value)}
              aria-label="Select Driver B Lap"
              className="f1-pill px-2.5 py-1 text-[11px] text-neutral-400 bg-transparent focus:outline-none cursor-pointer hidden sm:block font-mono"
            >
              <option value="Q3 - 1:19.436 (P2)" className="bg-[#0D1117]">Q3 (P2)</option>
              <option value="Q3 - 1:19.810" className="bg-[#0D1117]">Q3 (Run 1)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cockpit HUD */}
      <TelemetryHUD
        pointA={pointA}
        pointB={pointB}
        driverA={driverA}
        driverB={driverB}
      />

      {/* MultiTraceCanvas */}
      <MultiTraceCanvas
        telemetryA={telemetryA}
        telemetryB={telemetryB}
        driverAColor={driverA.color_hex}
        driverBColor={driverB.color_hex}
        driverAName={driverA.broadcast_name}
        driverBName={driverB.broadcast_name}
      />

      {/* Corner Apex Breakdown Table */}
      <div className="f1-glass-card p-6 rounded-lg space-y-3 border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#E10600]/10 border border-[#E10600]/25 flex items-center justify-center text-[#E10600]">
              <Gauge className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-bold text-xs text-white font-mono uppercase">
              Monza Corner Minimum Apex Velocity Comparison
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] text-neutral-400 uppercase">
                <th className="pb-2 px-3">Corner</th>
                <th className="pb-2 px-3">Distance</th>
                <th className="pb-2 px-3" style={{ color: driverA.color_hex }}>{driverA.broadcast_name}</th>
                <th className="pb-2 px-3" style={{ color: driverB.color_hex }}>{driverB.broadcast_name}</th>
                <th className="pb-2 px-3 text-right">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {apexAnalysis.map((row) => (
                <tr key={row.corner} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">{row.corner}</td>
                  <td className="py-2.5 px-3 text-neutral-400 font-mono">{row.dist}m</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{row.speedA} km/h</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-400">{row.speedB} km/h</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="f1-pill px-2.5 py-0.5 text-[10px] font-mono text-neutral-200">
                      {row.winner}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
