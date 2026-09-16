'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelemetryStore } from '@/lib/store';
import { generateSyntheticTelemetry } from '@/lib/parquet-loader';
import { MultiTraceCanvas } from '@/components/telemetry/MultiTraceCanvas';
import { TelemetryHUD } from '@/components/telemetry/TelemetryHUD';
import { StandingsTable } from '@/components/drivers/StandingsTable';
import { RaceCalendarWithPodium } from '@/components/races/RaceCalendarWithPodium';
import { UpdateLapRecordModal } from '@/components/circuits/UpdateLapRecordModal';
import { MOCK_CIRCUITS, MOCK_RACES, f1Api } from '@/lib/api';
import { CornerDetail, RaceResult, Race } from '@/lib/types';
import {
  Activity,
  MapPin,
  TrendingUp,
  Radio,
  ChevronRight,
  Zap,
  Globe,
  Compass,
  Gauge,
  Wind,
  Thermometer,
  Flag,
  Sparkles,
  Layers,
  BarChart3,
  Timer,
  Play,
  ArrowUpRight,
  Eye,
  Sliders,
  Calendar,
  Clock,
  Trophy,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    driverA,
    driverB,
    activeDistanceM,
    selectedRace,
    setSelectedRace,
    season,
    races,
    setCircuitLengthM,
  } = useTelemetryStore();

  // Selected race drives the entire overview page, keeping in sync with active season
  const currentRace: Race = useMemo(() => {
    if (selectedRace && (selectedRace.season === season || !selectedRace.season)) {
      return selectedRace;
    }
    const matched = races.find((r) => r.season === season);
    return matched || selectedRace || races[0] || MOCK_RACES[0];
  }, [selectedRace, season, races]);

  // Active circuit derived directly from the current race
  const activeCircuit = useMemo(() => {
    return currentRace.circuit || MOCK_CIRCUITS[0];
  }, [currentRace]);

  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);
  const [loadingResult, setLoadingResult] = useState<boolean>(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);

  // Sync circuit length to telemetry store
  useEffect(() => {
    if (activeCircuit.length_km) {
      setCircuitLengthM(Math.round(activeCircuit.length_km * 1000));
    }
  }, [activeCircuit, setCircuitLengthM]);

  // Fetch or retrieve race result whenever current race or season changes
  useEffect(() => {
    let mounted = true;
    setLoadingResult(true);
    const roundToFetch = currentRace.round_number || (currentRace.id > 100 ? currentRace.id % 100 : currentRace.id);
    f1Api
      .getRaceResult(roundToFetch, season || currentRace.season || 2026)
      .then((res) => {
        if (mounted) {
          setRaceResult(res);
        }
      })
      .finally(() => {
        if (mounted) setLoadingResult(false);
      });
    return () => {
      mounted = false;
    };
  }, [currentRace.id, currentRace.round_number, currentRace.season, season]);

  // Dynamic telemetry traces calibrated to active circuit length
  const telemetryA = useMemo(() => {
    return generateSyntheticTelemetry(0, 0, Math.round(activeCircuit.length_km * 1000));
  }, [activeCircuit.length_km]);

  const telemetryB = useMemo(() => {
    return generateSyntheticTelemetry(1, -2.5, Math.round(activeCircuit.length_km * 1000));
  }, [activeCircuit.length_km]);

  const [activeCorner, setActiveCorner] = useState<CornerDetail | null>(null);

  // Sync active corner when circuit changes
  useEffect(() => {
    if (activeCircuit.corners && activeCircuit.corners.length > 0) {
      setActiveCorner(activeCircuit.corners[0]);
    } else {
      setActiveCorner(null);
    }
  }, [activeCircuit]);

  const pointA = telemetryA.find((p) => p.distance >= activeDistanceM) || telemetryA[0];
  const pointB = telemetryB.find((p) => p.distance >= activeDistanceM) || telemetryB[0];

  const isUpcoming = currentRace.status === 'UPCOMING' || raceResult?.status === 'UPCOMING' || !raceResult?.podium;
  const isLive = currentRace.status === 'LIVE' || raceResult?.status === 'LIVE';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 
        ========================================================================
        1. F1 SIGNATURE LIVE / OFFICIAL RACE HERO (Driven dynamically by selectedRace)
        ========================================================================
      */}
      <div className="f1-glass-card p-6 md:p-8 relative">
        {/* Ambient Racing Flare */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[300px] bg-[radial-gradient(circle,rgba(225,6,0,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[250px] bg-[radial-gradient(circle,rgba(39,244,210,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Status Badge + Grand Prix Title + Track Geometry */}
          <div className="lg:col-span-6 space-y-4">
            {/* Live Status & Weather Header */}
            <div className="flex items-center gap-3">
              {isUpcoming ? (
                <span className="px-2.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[11px] font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  UPCOMING GRAND PRIX
                </span>
              ) : isLive ? (
                <span className="px-2.5 py-0.5 rounded-sm bg-[#FF1801] text-white font-mono text-[11px] font-bold tracking-wider animate-pulse flex items-center gap-1.5 shadow-sm shadow-red-600/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE SESSION
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Flag className="w-3.5 h-3.5 text-emerald-400" />
                  OFFICIAL RESULT
                </span>
              )}

              <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
                <Thermometer className="w-3.5 h-3.5 text-[#FF1801]" />
                <span>{isUpcoming ? 'FORECAST: DRY / 24°C' : '24.8°C TRACK'}</span>
              </div>
              <span className="text-neutral-500">•</span>
              <span className="text-xs font-mono text-[#FF1801] font-bold">
                ROUND {currentRace.round_number < 10 ? `0${currentRace.round_number}` : currentRace.round_number} OF {races.length || 24}
              </span>
            </div>

            {/* Huge F1 Race Title with Solid Country & Outline Year Typography */}
            <div>
              <Link
                href={isUpcoming ? "#circuit-studio" : "/ghosting-arena"}
                className="group flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                  <span>{activeCircuit.country.toUpperCase()}</span>
                  <span className="font-outline-f1">{season || currentRace.season || 2026}</span>
                  <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-[#FF1801] group-hover:translate-x-1.5 transition-transform" />
                </h1>
              </Link>
              <p className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase mt-1">
                {currentRace.race_name.toUpperCase()} • {activeCircuit.circuit_name.toUpperCase()}
              </p>
            </div>

            {/* Track Geometry Layout with Dynamic Driver Placement (Only if Completed/Live) */}
            <div className="pt-2">
              <div className="w-full max-w-[360px] h-[165px] rounded-lg bg-[#05070A] border border-white/[0.08] p-3 relative flex items-center justify-center">
                <svg
                  viewBox={activeCircuit.view_box || '0 0 500 500'}
                  className="w-full h-full max-h-[140px] select-none"
                >
                  {/* Track Surface Ribbon */}
                  <path
                    d={activeCircuit.svg_path}
                    fill="none"
                    stroke="#161C28"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={activeCircuit.svg_path}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Driver Dots only rendered if race has happened */}
                  {!isUpcoming && raceResult?.podium && (
                    <>
                      <circle
                        r="6"
                        fill={raceResult.podium.p1.driver.color_hex}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      >
                        <animateMotion
                          path={activeCircuit.svg_path}
                          dur="9s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        r="5"
                        fill={raceResult.podium.p2.driver.color_hex}
                        stroke="#CBD5E1"
                        strokeWidth="1.2"
                      >
                        <animateMotion
                          path={activeCircuit.svg_path}
                          dur="9s"
                          begin="-1.2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        r="5"
                        fill={raceResult.podium.p3.driver.color_hex}
                        stroke="#CD7F32"
                        strokeWidth="1.2"
                      >
                        <animateMotion
                          path={activeCircuit.svg_path}
                          dur="9s"
                          begin="-3.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}
                </svg>

                {/* Track Legend / Status Footer */}
                {!isUpcoming && raceResult?.podium ? (
                  <div className="absolute bottom-2 left-3 flex items-center gap-2.5 text-[10px] font-mono text-neutral-400 bg-black/75 px-2 py-0.5 rounded border border-white/[0.06]">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: raceResult.podium.p1.driver.color_hex }}
                      />{' '}
                      P1 {raceResult.podium.p1.driver.broadcast_name.split(' ')[1] || 'WIN'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: raceResult.podium.p2.driver.color_hex }}
                      />{' '}
                      P2 {raceResult.podium.p2.driver.broadcast_name.split(' ')[1] || 'P2'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: raceResult.podium.p3.driver.color_hex }}
                      />{' '}
                      P3 {raceResult.podium.p3.driver.broadcast_name.split(' ')[1] || 'P3'}
                    </span>
                  </div>
                ) : (
                  <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 bg-black/75 px-2 py-0.5 rounded border border-white/[0.06]">
                    <MapPin className="w-3 h-3 text-[#FF1801]" />
                    <span>{activeCircuit.length_km} KM • {activeCircuit.corners_count} TURNS</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Lap Count + Leaderboard Standings / Upcoming Weekend Preview */}
          <div className="lg:col-span-6 space-y-4">
            {/* Top Pill Bar */}
            <div className="flex items-center justify-between">
              {isUpcoming ? (
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-xs text-neutral-400 uppercase font-semibold">SCHEDULED</span>
                  <span className="text-2xl font-black text-amber-400 tracking-tight">
                    {raceResult?.total_laps || Math.max(44, Math.round(305 / (activeCircuit.length_km || 5.0)))}
                  </span>
                  <span className="text-xs text-neutral-500 font-bold">LAPS DISTANCE</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-xs text-neutral-400 uppercase font-semibold">LAP</span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {raceResult?.laps_completed || raceResult?.total_laps || 53}
                  </span>
                  <span className="text-base text-neutral-500 font-bold">
                    / {raceResult?.total_laps || 53}
                  </span>
                </div>
              )}

              <span
                className={`text-[10px] font-mono px-2 py-1 rounded border font-bold flex items-center gap-1.5 ${
                  isUpcoming
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    : 'bg-white/[0.04] border-white/[0.08] text-emerald-400'
                }`}
              >
                {isUpcoming ? (
                  <>
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{currentRace.date}</span>
                  </>
                ) : raceResult?.podium ? (
                  `${raceResult.podium.p1.driver.team_name.toUpperCase()} VICTORY`
                ) : (
                  'OFFICIAL CLASSIFICATION'
                )}
              </span>
            </div>

            {/* Leaderboard Box OR Upcoming Weekend Preview (Strictly No Fake Classifications) */}
            {loadingResult ? (
              <div className="p-4 rounded-lg bg-[#05070B] border border-white/[0.08] space-y-3 font-mono animate-pulse">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="h-3 w-36 bg-white/10 rounded" />
                  <div className="h-2 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-9 bg-white/[0.04] rounded border-l-2 border-[#FF1801]" />
                <div className="h-9 bg-white/[0.04] rounded border-l-2 border-white/20" />
                <div className="h-9 bg-white/[0.04] rounded border-l-2 border-white/20" />
              </div>
            ) : isUpcoming || !raceResult?.podium ? (
              <div className="p-4 rounded-lg bg-[#05070B] border border-white/[0.08] space-y-2.5 font-mono">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-1.5 border-b border-white/[0.06]">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    SESSION CLASSIFICATION PENDING
                  </span>
                  <span className="text-[10px] text-neutral-500">WEEKEND SCHEDULE</span>
                </div>

                {/* Schedule Entry 1 */}
                <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border-l-2 border-l-amber-500/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">FP1 & FP2</span>
                    <span className="text-xs text-neutral-400">Friday Practice Sessions</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-300">Track Acclimatization</span>
                </div>

                {/* Schedule Entry 2 */}
                <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border-l-2 border-l-amber-500/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">QUALIFYING</span>
                    <span className="text-xs text-neutral-400">Saturday Q1 - Q2 - Q3</span>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-300">Pole Position Decider</span>
                </div>

                {/* Schedule Entry 3 */}
                <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border-l-2 border-l-amber-500/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">GRAND PRIX</span>
                    <span className="text-xs text-neutral-400">Sunday 305 km Sprint</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400">
                    {raceResult?.total_laps || Math.max(44, Math.round(305 / (activeCircuit.length_km || 5.0)))} Laps
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-[#05070B] border border-white/[0.08] space-y-2.5 font-mono">
                {/* P1 Leader */}
                <div
                  className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border-l-2"
                  style={{ borderLeftColor: raceResult.podium.p1.driver.color_hex }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">1</span>
                    <span
                      className="w-1 h-3.5"
                      style={{ backgroundColor: raceResult.podium.p1.driver.color_hex }}
                    />
                    <span className="text-xs text-neutral-300 font-sans">
                      {raceResult.podium.p1.driver.full_name.split(' ')[0]}{' '}
                      <strong className="text-white font-mono">
                        {raceResult.podium.p1.driver.full_name.split(' ').slice(1).join(' ').toUpperCase()}
                      </strong>
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: `${raceResult.podium.p1.driver.color_hex}25`,
                      color: raceResult.podium.p1.driver.color_hex,
                    }}
                  >
                    WINNER
                  </span>
                </div>

                {/* P2 */}
                <div
                  className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border-l-2"
                  style={{ borderLeftColor: raceResult.podium.p2.driver.color_hex }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-400">2</span>
                    <span
                      className="w-1 h-3.5"
                      style={{ backgroundColor: raceResult.podium.p2.driver.color_hex }}
                    />
                    <span className="text-xs text-neutral-300 font-sans">
                      {raceResult.podium.p2.driver.full_name.split(' ')[0]}{' '}
                      <strong className="text-white font-mono">
                        {raceResult.podium.p2.driver.full_name.split(' ').slice(1).join(' ').toUpperCase()}
                      </strong>
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-300">
                    {raceResult.podium.p2.time_or_gap}
                  </span>
                </div>

                {/* P3 */}
                <div
                  className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[0.02] border-l-2"
                  style={{ borderLeftColor: raceResult.podium.p3.driver.color_hex }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-neutral-400">3</span>
                    <span
                      className="w-1 h-3.5"
                      style={{ backgroundColor: raceResult.podium.p3.driver.color_hex }}
                    />
                    <span className="text-xs text-neutral-300 font-sans">
                      {raceResult.podium.p3.driver.full_name.split(' ')[0]}{' '}
                      <strong className="text-white font-mono">
                        {raceResult.podium.p3.driver.full_name.split(' ').slice(1).join(' ').toUpperCase()}
                      </strong>
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {raceResult.podium.p3.time_or_gap}{' '}
                    {raceResult.podium.p3.fastest_lap ? '(FL)' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* High Impact Red Action CTA */}
            {isUpcoming ? (
              <a
                href="#circuit-studio"
                className="w-full py-3 px-4 rounded-md bg-[#121622] hover:bg-[#1A2030] border border-white/[0.12] text-white flex items-center justify-center gap-2 text-sm font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Gauge className="w-4 h-4 text-[#FF1801]" />
                <span>INSPECT CIRCUIT SPECIFICATIONS</span>
              </a>
            ) : (
              <Link
                href="/ghosting-arena"
                className="w-full py-3 px-4 rounded-md f1-btn-primary flex items-center justify-center gap-2 text-sm font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                <span>JOIN LIVE TELEMETRY SESSION</span>
              </Link>
            )}
          </div>
        </div>

        {/* 
          ========================================================================
          FEATURED TELEMETRY INSIGHT CARDS
          ========================================================================
        */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              FEATURED ANALYTICS & INSIGHTS
            </span>
            <span className="text-[10px] font-mono text-neutral-500">FASTF1 STREAM V2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Featured 1: Pit Stop Dynamics */}
            <Link
              href="/strategy"
              className="f1-glass-card p-4 rounded-lg hover:border-[#FF1801] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-red-600/10 border border-red-500/20 flex items-center justify-center text-[#FF1801] group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h4 className="text-sm font-bold text-white font-mono group-hover:text-[#FF1801] transition-colors">
                  Pit Stop & Tyre Crossover
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  Predictive delta models for Hard vs Soft tyre degradation and under-cut windows.
                </p>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 group-hover:text-white mt-3 flex items-center gap-1 font-semibold">
                Simulate Strategy <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Featured 2: Driver Apex Focus */}
            <Link
              href="/ghosting-arena"
              className="f1-glass-card p-4 rounded-lg hover:border-[#FF1801] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h4 className="text-sm font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                  Telemetry Apex Ghosting
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  500-point Parquet trace comparison of throttle application and braking markers.
                </p>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 group-hover:text-white mt-3 flex items-center gap-1 font-semibold">
                Launch Arena <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Featured 3: Micro-Sector Speed Traps */}
            <Link
              href="/track-map"
              className="f1-glass-card p-4 rounded-lg hover:border-[#FF1801] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h4 className="text-sm font-bold text-white font-mono group-hover:text-amber-400 transition-colors">
                  60 Mini-Sector Speeds
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  Real-time micro-sector winner mapping highlighting peak velocity across all 23 tracks.
                </p>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 group-hover:text-white mt-3 flex items-center gap-1 font-semibold">
                Inspect Track Map <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. 24-RACE CHAMPIONSHIP CALENDAR & 3D PODIUM SHOWCASE
        ========================================================================
      */}
      <RaceCalendarWithPodium initialSeason={season || 2026} />

      {/* 
        ========================================================================
        3. PRIMARY 23-TRACK STUDIO & TELEMETRY CALIBRATION VIEWER
        ========================================================================
      */}
      <div
        id="circuit-studio"
        className="f1-glass-card p-6 md:p-7 relative"
      >
        <div className="relative z-10 flex flex-col gap-6">
          {/* Top Info Bar & 23-Track Dropdown Switcher */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-[#FF1801]" />
                <span className="text-[#FF1801] font-bold">23 OFFICIAL FIA HOMOLOGATED CIRCUITS</span>
              </div>
              <h2 className="text-2xl font-bold font-mono tracking-tight text-white">
                {activeCircuit.circuit_name}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* 23 Track Switcher Dropdown (Synchronized with Global Race Selection) */}
              <div className="relative flex-1 lg:flex-initial">
                <select
                  value={activeCircuit.id}
                  onChange={(e) => {
                    const newId = Number(e.target.value);
                    const matchingCircuit = MOCK_CIRCUITS.find((c) => c.id === newId);
                    if (matchingCircuit) {
                      const matchingRace = MOCK_RACES.find(
                        (r) =>
                          r.circuit.id === newId ||
                          r.circuit.circuit_name === matchingCircuit.circuit_name
                      );
                      if (matchingRace) {
                        setSelectedRace(matchingRace);
                      } else {
                        setSelectedRace({
                          id: matchingCircuit.id,
                          season: season || 2026,
                          round_number: matchingCircuit.id,
                          race_name: `${matchingCircuit.country} Grand Prix`,
                          circuit: matchingCircuit,
                          date: '2026-09-01',
                          status: 'COMPLETED',
                        });
                      }
                    }
                  }}
                  aria-label="Select F1 Circuit"
                  className="w-full lg:w-64 px-3 py-2 rounded-md bg-[#121622] hover:bg-[#181D2D] border border-white/[0.12] focus:border-[#FF1801] text-white font-mono text-xs font-semibold focus:outline-none cursor-pointer transition-all"
                >
                  {MOCK_CIRCUITS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0B0E15] text-white py-1">
                      {c.id < 10 ? `0${c.id}` : c.id}. {c.circuit_name} ({c.country_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation Quick Links */}
              <Link
                href="/circuits"
                className="px-3.5 py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-[#FF1801]" />
                <span>3D Globe</span>
              </Link>
              <Link
                href="/track-map"
                className="px-3.5 py-2 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Micro-Sectors</span>
              </Link>
              <Link
                href="/ghosting-arena"
                className="px-3.5 py-2 rounded-md bg-[#FF1801] hover:bg-[#FF2800] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Ghosting Arena</span>
              </Link>
            </div>
          </div>

          {/* Main Grid: Track Technical Specs (Left) + Interactive SVG (Center) + Apex Inspector (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Specs Column */}
            <div className="lg:col-span-3 space-y-3 font-mono">
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">CIRCUIT LENGTH</span>
                <p className="text-base font-bold text-white mt-0.5">{activeCircuit.length_km} km</p>
                <span className="text-[10px] text-neutral-400">{activeCircuit.corners_count} Calibration Turns</span>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">OFFICIAL LAP RECORD</span>
                  <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="p-1 rounded bg-white/[0.04] hover:bg-[#FF1801]/20 hover:border-[#FF1801]/40 border border-white/[0.08] text-[10px] font-mono text-[#FF1801] flex items-center gap-1 transition-all"
                    title="Calibrate or update official lap record in real time"
                  >
                    <Zap className="w-2.5 h-2.5 text-[#FF1801]" />
                    UPDATE
                  </button>
                </div>
                <p className="text-base font-bold text-white mt-0.5">{activeCircuit.lap_record}</p>
                <span className="text-[10px] text-neutral-400">
                  {activeCircuit.lap_record_driver} ({activeCircuit.lap_record_year})
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">AERODYNAMIC SETUP</span>
                <p className="text-base font-bold text-amber-400 mt-0.5">{activeCircuit.downforce_level}</p>
                <span className="text-[10px] text-neutral-400">{activeCircuit.full_throttle_pct}% Full Throttle</span>
              </div>
            </div>

            {/* Center Track Vector with True Homologated Geometry */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[320px] select-none bg-[#07090E] rounded-lg border border-white/[0.06] p-4">
              <svg
                viewBox={activeCircuit.view_box || '0 0 500 500'}
                className="w-full h-auto max-h-[300px] select-none"
              >
                <defs>
                  <linearGradient id="f1ActiveTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="70%" stopColor="#FF1801" />
                    <stop offset="100%" stopColor="#FF2800" />
                  </linearGradient>
                </defs>

                {/* Base Asphalt track ribbon */}
                <path
                  d={activeCircuit.svg_path}
                  fill="none"
                  stroke="#161A24"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Precision Racing Line Surface Path */}
                <path
                  d={activeCircuit.optimal_line_svg || activeCircuit.svg_path}
                  fill="none"
                  stroke="url(#f1ActiveTrackGrad)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Start / Finish line indicator */}
                {activeCircuit.start_finish && (
                  <g transform={`translate(${activeCircuit.start_finish.x}, ${activeCircuit.start_finish.y})`}>
                    <line x1="-3" y1="-8" x2="3" y2="8" stroke="#FFFFFF" strokeWidth="2.5" />
                    <text
                      x={10}
                      y={3}
                      fill="#FFFFFF"
                      fontSize="8px"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      S/F
                    </text>
                  </g>
                )}

                {/* Turn Nodes with Crisp Solid Red Border On Selection */}
                {activeCircuit.corners.map((corner, i) => {
                  let cx = corner.x;
                  let cy = corner.y;
                  if (cx === undefined || cy === undefined) {
                    const angle = (i / (activeCircuit.corners.length || 1)) * Math.PI * 2;
                    cx = Math.sin(angle) * 160 + 250;
                    cy = Math.cos(angle) * 160 + 250;
                  }

                  const isSelected = activeCorner?.corner_number === corner.corner_number;
                  const formattedNumber =
                    corner.corner_number < 10 ? `0${corner.corner_number}` : `${corner.corner_number}`;

                  return (
                    <g
                      key={corner.corner_number}
                      transform={`translate(${cx}, ${cy})`}
                      className="cursor-pointer"
                      onClick={() => setActiveCorner(corner)}
                      onMouseEnter={() => setActiveCorner(corner)}
                    >
                      {/* Crisp Solid Red Line Ring when selected */}
                      {isSelected && (
                        <circle
                          r={12}
                          fill="none"
                          stroke="#FF1801"
                          strokeWidth={1.5}
                        />
                      )}

                      {/* Outer Dot Ring */}
                      <circle
                        r={isSelected ? 7.5 : 5.5}
                        fill={isSelected ? '#FF1801' : '#0D1117'}
                        stroke={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'}
                        strokeWidth={isSelected ? 1.5 : 1}
                      />

                      {/* Turn Number Tag */}
                      <text
                        x={9}
                        y={3}
                        fill={isSelected ? '#FF1801' : '#FFFFFF'}
                        fontSize="8px"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                      >
                        T{formattedNumber}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Real-time Hovered Corner Telemetry Floating HUD */}
              {activeCorner && (
                <div className="mt-2 px-3 py-1.5 rounded-md bg-[#0D1017] border border-[#FF1801] shadow-xl flex flex-wrap items-center justify-center gap-3 transition-all">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-[#FF1801] font-bold">TURN {activeCorner.corner_number}:</span>
                    <span className="text-white font-semibold">{activeCorner.corner_name}</span>
                  </div>
                  <div className="h-3 w-[1px] bg-white/20 hidden sm:block" />
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <span className="text-neutral-400">APEX:</span>
                    <span className="text-emerald-400 font-bold">{activeCorner.min_speed_kmh} km/h</span>
                    <span className="text-neutral-400">GEAR:</span>
                    <span className="text-white font-bold">G{activeCorner.gear}</span>
                    <span className="text-neutral-400">LATERAL:</span>
                    <span className="text-blue-400 font-bold">{activeCorner.lateral_g} G</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Telemetry Column */}
            <div className="lg:col-span-3 space-y-3 font-mono">
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">DRS DETECTION</span>
                <p className="text-base font-bold text-emerald-400 mt-0.5">{activeCircuit.drs_zones} DRS Zones</p>
                <span className="text-[10px] text-neutral-400">Pit Straight & DRS Activation</span>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">TYRE STRESS & BRAKES</span>
                <p className="text-base font-bold text-white mt-0.5">Level {activeCircuit.tyre_stress_level} / 5</p>
                <span className="text-[10px] text-neutral-400">Brake Wear: {activeCircuit.brake_wear_index}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">ELEVATION DELTA</span>
                <p className="text-base font-bold text-blue-400 mt-0.5">{activeCircuit.elevation_gain_m} m</p>
                <span className="text-[10px] text-neutral-400">Pit Loss: {activeCircuit.pit_loss_time_sec}s</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500 border-t border-white/[0.08] pt-3">
            <span>SELECT OR HOVER CORNER NODES FOR APEX TELEMETRY PROFILES</span>
            <span className="text-neutral-400 font-semibold">{MOCK_CIRCUITS.length} / 23 OFFICIAL FIA TRACKS LOADED</span>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        4. COCKPIT HUD & MULTI-TRACE PARQUET CANVAS (Scaled to Active Circuit)
        ========================================================================
      */}
      <TelemetryHUD
        pointA={pointA}
        pointB={pointB}
        driverA={driverA}
        driverB={driverB}
      />

      <MultiTraceCanvas
        telemetryA={telemetryA}
        telemetryB={telemetryB}
        driverAColor={driverA.color_hex}
        driverBColor={driverB.color_hex}
        driverAName={driverA.broadcast_name}
        driverBName={driverB.broadcast_name}
      />

      {/* 
        ========================================================================
        5. HISTORICAL WORLD CHAMPIONS STANDINGS ARCHIVE
        ========================================================================
      */}
      <StandingsTable />

      {/* Dynamic Circuit Record Calibration Modal */}
      <UpdateLapRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        circuit={activeCircuit}
      />
    </div>
  );
}
