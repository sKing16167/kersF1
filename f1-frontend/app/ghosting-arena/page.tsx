'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTelemetryStore } from '@/lib/store';
import { f1Api, matchCircuit, parseLapTimeToMs } from '@/lib/api';
import { TelemetryPoint } from '@/lib/types';
import { generateDriverTelemetry, loadParquetTelemetry, getDriverTelemetryProfile } from '@/lib/parquet-loader';
import { MultiTraceCanvas } from '@/components/telemetry/MultiTraceCanvas';
import { TelemetryHUD } from '@/components/telemetry/TelemetryHUD';
import { Activity, Gauge, Play, Pause, RotateCcw, Zap, Flame } from 'lucide-react';

interface ApexRow {
  corner: string;
  dist: number;
  speedA: number;
  speedB: number;
  winner: string;
}

export default function GhostingArenaPage() {
  const {
    driverA,
    driverB,
    setDriverA,
    setDriverB,
    drivers,
    selectedRace,
    selectedSession,
    season,
    activeDistanceM,
    setActiveDistanceM,
    isPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed,
  } = useTelemetryStore();

  // Dynamically resolve circuit from user's selected race
  const activeCircuit = useMemo(() => {
    return matchCircuit(selectedRace?.circuit);
  }, [selectedRace]);

  const totalLengthM = useMemo(() => {
    return Math.round((activeCircuit.length_km || 5.0) * 1000);
  }, [activeCircuit]);

  // Dynamic corner apex markers for selected circuit
  const circuitCorners = useMemo(() => {
    if (activeCircuit.corners && activeCircuit.corners.length > 0) {
      const numCorners = activeCircuit.corners.length;
      return activeCircuit.corners.map((c, idx) => {
        const approxDist = Math.round(((idx + 0.7) / (numCorners + 0.3)) * totalLengthM);
        return {
          corner: `T${c.corner_number} ${c.corner_name || ''}`.trim(),
          name: `T${c.corner_number}`,
          dist: approxDist,
          minSpeed: c.min_speed_kmh,
        };
      });
    }
    const count = activeCircuit.corners_count || 12;
    return Array.from({ length: count }, (_, idx) => ({
      corner: `Turn ${idx + 1}`,
      name: `T${idx + 1}`,
      dist: Math.round(((idx + 0.7) / (count + 0.3)) * totalLengthM),
      minSpeed: 135,
    }));
  }, [activeCircuit, totalLengthM]);

  // Sector boundaries calculated proportionally for this circuit
  const s1End = Math.round(totalLengthM * 0.28);
  const s2End = Math.round(totalLengthM * 0.66);

  // Synchronized Telemetry Points
  const [telemetryA, setTelemetryA] = useState<TelemetryPoint[]>(() =>
    generateDriverTelemetry(driverA, totalLengthM, 'pole', driverB, activeCircuit)
  );
  const [telemetryB, setTelemetryB] = useState<TelemetryPoint[]>(() =>
    generateDriverTelemetry(driverB, totalLengthM, 'chaser', driverA, activeCircuit)
  );

  // Dynamic Lap Times based on Circuit Lap Record
  const baseLapMs = useMemo(() => {
    const ms = parseLapTimeToMs(activeCircuit.lap_record);
    return ms && ms !== Infinity ? ms : 80500;
  }, [activeCircuit]);

  const isAPole = driverA.id <= driverB.id;

  const lapTimeStrA = useMemo(() => {
    const sec = baseLapMs / 1000 + (isAPole ? 0 : 0.185);
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toFixed(3);
    return `${m}:${s.padStart(6, '0')}`;
  }, [baseLapMs, isAPole]);

  const lapTimeStrB = useMemo(() => {
    const sec = baseLapMs / 1000 + (!isAPole ? 0 : 0.185);
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toFixed(3);
    return `${m}:${s.padStart(6, '0')}`;
  }, [baseLapMs, isAPole]);

  const [selectedLapA, setSelectedLapA] = useState<string>('');
  const [selectedLapB, setSelectedLapB] = useState<string>('');

  useEffect(() => {
    setSelectedLapA(`Q3 - ${lapTimeStrA} (${isAPole ? 'Pole' : 'P2'})`);
    setSelectedLapB(`Q3 - ${lapTimeStrB} (${!isAPole ? 'Pole' : 'P2'})`);
  }, [lapTimeStrA, lapTimeStrB, isAPole]);

  // Fetch telemetry whenever session, race, drivers, or season changes
  useEffect(() => {
    let isCancelled = false;
    async function loadGhostData() {
      try {
        const ghost = await f1Api.getGhostTelemetry(
          selectedSession?.id || 1,
          driverA.id,
          driverB.id,
          activeCircuit,
          season
        );

        if (!isCancelled && ghost) {
          const [pointsA, pointsB] = await Promise.all([
            loadParquetTelemetry(ghost.driver_a.telemetry_file_url, driverA, totalLengthM, 'pole', driverB, activeCircuit),
            loadParquetTelemetry(ghost.driver_b.telemetry_file_url, driverB, totalLengthM, 'chaser', driverA, activeCircuit),
          ]);

          if (pointsA.length > 0) setTelemetryA(pointsA);
          if (pointsB.length > 0) setTelemetryB(pointsB);
        }
      } catch (err) {
        if (!isCancelled) {
          setTelemetryA(generateDriverTelemetry(driverA, totalLengthM, 'pole', driverB, activeCircuit));
          setTelemetryB(generateDriverTelemetry(driverB, totalLengthM, 'chaser', driverA, activeCircuit));
        }
      }
    }

    loadGhostData();
    return () => {
      isCancelled = true;
    };
  }, [driverA, driverB, selectedSession?.id, activeCircuit, totalLengthM, season]);

  const pointA = telemetryA.find((p) => p.distance >= activeDistanceM) || telemetryA[0];
  const pointB = telemetryB.find((p) => p.distance >= activeDistanceM) || telemetryB[0];

  // Dynamic Apex table analysis for current track
  const apexAnalysis = useMemo<ApexRow[]>(() => {
    return circuitCorners.map((c) => {
      const pA = telemetryA.find((p) => p.distance >= c.dist) || telemetryA[0];
      const pB = telemetryB.find((p) => p.distance >= c.dist) || telemetryB[0];
      const speedA = pA ? pA.speed : 0;
      const speedB = pB ? pB.speed : 0;
      const winner = speedA >= speedB ? driverA.broadcast_name : driverB.broadcast_name;
      return {
        corner: c.corner,
        dist: c.dist,
        speedA,
        speedB,
        winner,
      };
    });
  }, [circuitCorners, telemetryA, telemetryB, driverA.broadcast_name, driverB.broadcast_name]);

  return (
    <div className="space-y-4 sm:space-y-5 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 f1-glass-card p-4 sm:p-6 rounded-lg border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600] shrink-0">
            <Activity className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
              Telemetry Ghosting Arena
            </h1>
            <p className="text-xs text-neutral-400">
              {activeCircuit.circuit_name} ({totalLengthM}m) • {selectedRace?.race_name || 'Grand Prix'} {season}
            </p>
          </div>
        </div>

        {/* Quick Duel Presets dynamically populated from current roster */}
        <div className="flex flex-wrap items-center gap-2">
          {drivers.length >= 2 && (
            <button
              onClick={() => {
                setDriverA(drivers[0]);
                setDriverB(drivers[1]);
              }}
              className="f1-pill px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {drivers[0].broadcast_name} vs {drivers[1].broadcast_name}
            </button>
          )}
          {drivers.length >= 3 && (
            <button
              onClick={() => {
                setDriverA(drivers[0]);
                setDriverB(drivers[2]);
              }}
              className="f1-pill px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {drivers[0].broadcast_name} vs {drivers[2].broadcast_name}
            </button>
          )}
          {drivers.length >= 4 && (
            <button
              onClick={() => {
                setDriverA(drivers[1]);
                setDriverB(drivers[3]);
              }}
              className="f1-pill px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {drivers[1].broadcast_name} vs {drivers[3].broadcast_name}
            </button>
          )}
        </div>
      </div>

      {/* Driver Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Driver A */}
        <div className="f1-glass-card p-3 sm:p-4 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-7 rounded-none shrink-0"
              style={{ backgroundColor: driverA.color_hex }}
            />
            <div>
              <span className="font-bold text-xs text-white font-mono">{driverA.full_name}</span>
              <div className="text-[10px] text-neutral-400 font-mono">{driverA.team_name} • #{driverA.driver_number}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
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
              <option value={`Q3 - ${lapTimeStrA} (${isAPole ? 'Pole' : 'P2'})`} className="bg-[#0D1117]">
                Q3 ({isAPole ? 'Pole' : 'P2'}) - {lapTimeStrA}
              </option>
            </select>
          </div>
        </div>

        {/* Driver B */}
        <div className="f1-glass-card p-3 sm:p-4 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-7 rounded-none shrink-0"
              style={{ backgroundColor: driverB.color_hex }}
            />
            <div>
              <span className="font-bold text-xs text-white font-mono">{driverB.full_name}</span>
              <div className="text-[10px] text-neutral-400 font-mono">{driverB.team_name} • #{driverB.driver_number}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
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
              <option value={`Q3 - ${lapTimeStrB} (${!isAPole ? 'Pole' : 'P2'})`} className="bg-[#0D1117]">
                Q3 ({!isAPole ? 'Pole' : 'P2'}) - {lapTimeStrB}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Lap Playback & Track Scrubber Deck */}
      <div className="f1-glass-card p-3 sm:p-5 rounded-lg border border-white/[0.08] shadow-2xl space-y-3 sm:space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayback}
              className={`px-3 sm:px-4 py-2 rounded-md font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-[#FF1801] text-white shadow-red-600/40 animate-pulse'
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE LAP</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY LAP</span>
                </>
              )}
            </button>

            {/* Reset to Start */}
            <button
              onClick={() => setActiveDistanceM(0)}
              className="p-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Reset to Start / Finish Line (0m)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playback Speed Selector */}
            <div className="flex items-center f1-pill p-0.5">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 sm:px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Scrubber Position & Progress */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-400 text-[10px] sm:text-[11px]">DIST:</span>
              <strong className="text-white text-xs sm:text-sm">{activeDistanceM} m</strong>
              <span className="text-neutral-500 text-[10px] sm:text-xs">/ {totalLengthM} m</span>
            </div>
            <span className="text-amber-400 font-bold px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] sm:text-[10px]">
              {((activeDistanceM / Math.max(1, totalLengthM)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Full-width Track Scrubber Slider with Dynamic Proportional Sector Boundaries */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={totalLengthM}
            step={10}
            value={activeDistanceM}
            onChange={(e) => setActiveDistanceM(Number(e.target.value))}
            className="w-full cursor-pointer accent-[#FF1801]"
            aria-label="Lap Distance Scrubber"
          />

          {/* Dynamic Sector Breakdown Markers */}
          <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-neutral-400 px-1">
            <div className="flex items-center gap-1">
              <span className="text-emerald-400 font-bold">S1</span>
              <span>(0m - {s1End}m)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-cyan-400 font-bold">S2</span>
              <span>({s1End}m - {s2End}m)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-amber-400 font-bold">S3</span>
              <span>({s2End}m - {totalLengthM}m)</span>
            </div>
          </div>
        </div>

        {/* Quick Corner Apex Jump Shortcuts (dynamic per circuit) */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold mr-1">
            Apex Jump:
          </span>
          {circuitCorners.map((c) => {
            const isNear = Math.abs(activeDistanceM - c.dist) < 180;
            return (
              <button
                key={c.corner}
                onClick={() => setActiveDistanceM(c.dist)}
                className={`px-2 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                  isNear
                    ? 'bg-[#FF1801] text-white font-bold shadow-sm'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border border-white/[0.06]'
                }`}
              >
                {c.name || c.corner} ({c.dist}m)
              </button>
            );
          })}
        </div>
      </div>

      {/* Cockpit HUD */}
      <TelemetryHUD
        pointA={pointA}
        pointB={pointB}
        driverA={driverA}
        driverB={driverB}
      />

      {/* MultiTraceCanvas with Dynamic Circuit Corners and Circuit Length */}
      <MultiTraceCanvas
        telemetryA={telemetryA}
        telemetryB={telemetryB}
        driverAColor={driverA.color_hex}
        driverBColor={driverB.color_hex}
        driverAName={driverA.broadcast_name}
        driverBName={driverB.broadcast_name}
        corners={circuitCorners.map((c) => ({ name: c.name || c.corner, dist: c.dist }))}
        circuitLengthM={totalLengthM}
      />

      {/* Dynamic Corner Apex Breakdown Table */}
      <div className="f1-glass-card p-4 sm:p-6 rounded-lg space-y-3 border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#E10600]/10 border border-[#E10600]/25 flex items-center justify-center text-[#E10600] shrink-0">
              <Gauge className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="font-bold text-xs text-white font-mono uppercase tracking-tight">
              {activeCircuit.circuit_name} Corner Minimum Apex Velocity Comparison
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
            {activeCircuit.corners_count || circuitCorners.length} Corners Analyzed
          </span>
        </div>

        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left text-xs font-mono min-w-[500px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] text-neutral-400 uppercase">
                <th className="pb-2 px-3">Corner</th>
                <th className="pb-2 px-3">Apex Dist</th>
                <th className="pb-2 px-3" style={{ color: driverA.color_hex }}>{driverA.broadcast_name}</th>
                <th className="pb-2 px-3" style={{ color: driverB.color_hex }}>{driverB.broadcast_name}</th>
                <th className="pb-2 px-3 text-right">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {apexAnalysis.map((row: ApexRow) => (
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

      {/* How to Read F1 Telemetry Educational Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="f1-glass-card p-4 sm:p-5 rounded-lg space-y-1.5 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-white text-xs font-bold font-mono">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            1. Speed Profiles & Apex Dips
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Flat plateau tops represent straightaway top speed. Each sharp dip indicates a corner apex—the higher the dip, the more minimum cornering speed the driver carried.
          </p>
        </div>

        <div className="f1-glass-card p-4 sm:p-5 rounded-lg space-y-1.5 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-white text-xs font-bold font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            2. Braking Markers (Red Dashes)
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Braking appears as sharp red dashed spikes. A driver whose spike starts further down the track braked later, taking more entry risk into the braking zone.
          </p>
        </div>

        <div className="f1-glass-card p-4 sm:p-5 rounded-lg space-y-1.5 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-white text-xs font-bold font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            3. Throttle Pick-Up & Traction
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Solid colored traces reflect throttle application. A steep climb back to 100% throttle out of slow corners indicates superior rear-end aerodynamic traction.
          </p>
        </div>
      </div>
    </div>
  );
}
