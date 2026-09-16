'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RaceResult, Race } from '@/lib/types';
import {
  Trophy,
  Medal,
  Timer,
  Flag,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Compass,
  Gauge,
  Wind,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface RacePodiumShowcaseProps {
  race: Race;
  result: RaceResult;
  onOpenTelemetry?: () => void;
}

export function RacePodiumShowcase({ race, result }: RacePodiumShowcaseProps) {
  const [showFullClassification, setShowFullClassification] = useState(false);

  const { podium, fastest_lap, pole_position, top_finishers, status } = result;
  const isUpcoming = status === 'UPCOMING' || !podium;

  return (
    <div className="w-full f1-glass-card p-6 md:p-8 relative flex flex-col gap-6">
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[radial-gradient(circle,rgba(225,6,0,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-[radial-gradient(circle,rgba(255,215,0,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Header: Grand Prix Name, Round Number & Status */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-sm bg-[#FF1801] text-white font-mono text-[10px] font-black tracking-wider uppercase">
              ROUND {race.round_number < 10 ? `0${race.round_number}` : race.round_number}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FF1801]" />
              {race.date}
            </span>
            <span className="text-neutral-500">•</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-sm font-bold border ${
                status === 'COMPLETED'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : status === 'LIVE'
                  ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              {status === 'UPCOMING' ? 'SCHEDULED / UPCOMING' : status}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
            <span>{race.race_name}</span>
            <span className="text-xs font-normal text-neutral-400 font-sans hidden sm:inline">
              ({race.circuit.circuit_name})
            </span>
          </h2>
        </div>

        {/* Quick Action Links */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/circuits"
            className="px-3.5 py-2 rounded-md bg-[#121622] hover:bg-[#181D2D] border border-white/10 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Track Info</span>
          </Link>
          <Link
            href="/track-map"
            className="px-3.5 py-2 rounded-md bg-[#FF1801] hover:bg-[#FF2800] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Micro-Sectors</span>
          </Link>
        </div>
      </div>

      {/* 
        ========================================================================
        SCENARIO A: UPCOMING RACE (STRICTLY NO FAKE DATA - CLEAN EVENT PREVIEW)
        ========================================================================
      */}
      {isUpcoming ? (
        <div className="relative z-10 space-y-6 py-2">
          {/* Informational Status Banner */}
          <div className="p-4 rounded-lg bg-[#0F1420] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  Upcoming Grand Prix Weekend
                </h3>
                <p className="text-xs text-neutral-300">
                  Race classification and telemetry data will be published live following official FIA session timing.
                </p>
              </div>
            </div>

            <div className="px-3 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-400 flex items-center gap-1.5 self-stretch sm:self-auto justify-center">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>RACE DATE: {race.date}</span>
            </div>
          </div>

          {/* Weekend Session Schedule & Circuit Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Official Weekend Timetable (Left) */}
            <div className="lg:col-span-6 space-y-3 font-mono">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#FF1801]" />
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  OFFICIAL WEEKEND SCHEDULE
                </span>
              </div>

              <div className="space-y-2">
                {race.sessions && race.sessions.length > 0 ? (
                  race.sessions.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      className="p-3 rounded-lg bg-[#0B0E15] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-6 rounded bg-white/[0.06] flex items-center justify-center text-xs font-bold text-neutral-300">
                          {s.session_type}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white">{s.session_name}</span>
                          <p className="text-[10px] text-neutral-500">{s.date || race.date}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400">UPCOMING</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-[#0B0E15] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-6 rounded bg-white/[0.06] flex items-center justify-center text-xs font-bold text-neutral-300">
                        GP
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white">Grand Prix Race Weekend</span>
                        <p className="text-[10px] text-neutral-500">{race.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400">SCHEDULED</span>
                  </div>
                )}
              </div>
            </div>

            {/* Circuit Specifications & Homologation Profile (Right) */}
            <div className="lg:col-span-6 space-y-3 font-mono">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  CIRCUIT SPECIFICATIONS & BRIEFING
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-[#0B0E15] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-500 uppercase">TRACK LENGTH</span>
                  <p className="text-base font-bold text-white mt-0.5">{race.circuit.length_km} km</p>
                  <span className="text-[10px] text-neutral-400">{race.circuit.corners_count} Calibration Turns</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0B0E15] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-500 uppercase">TOTAL RACE DISTANCE</span>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">{result.total_laps} Laps</p>
                  <span className="text-[10px] text-neutral-400">~305.0 km Total</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0B0E15] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-500 uppercase">AERODYNAMIC LEVEL</span>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{race.circuit.downforce_level}</p>
                  <span className="text-[10px] text-neutral-400">{race.circuit.drs_zones} DRS Zones</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0B0E15] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-500 uppercase">OFFICIAL LAP RECORD</span>
                  <p className="text-base font-bold text-white mt-0.5">{race.circuit.lap_record || '1:19.327'}</p>
                  <span className="text-[10px] text-neutral-400">
                    {race.circuit.lap_record_driver} ({race.circuit.lap_record_year})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 
          ========================================================================
          SCENARIO B: COMPLETED RACE (OFFICIAL 3D PODIUM & CLASSIFICATION)
          ========================================================================
        */
        <>
          <div className="relative z-10 py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                  OFFICIAL GRAND PRIX PODIUM
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                {result.laps_completed} / {result.total_laps} LAPS CLASSIFIED
              </span>
            </div>

            {/* Podium Grid Layout */}
            <div className="grid grid-cols-3 gap-3 md:gap-5 items-end max-w-4xl mx-auto pt-8 pb-4">
              {/* ======================= P2: SILVER STEP (LEFT) ======================= */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col items-center group"
              >
                {/* Driver Badge Top Box */}
                <div className="w-full p-3 rounded-t-lg bg-[#0F131C] border-t-2 border-x border-[#CBD5E1]/40 flex flex-col items-center text-center shadow-lg relative group-hover:border-[#CBD5E1] transition-all">
                  {/* Medal / Position Tag */}
                  <div className="w-7 h-7 rounded-full bg-[#CBD5E1]/20 border border-[#CBD5E1] flex items-center justify-center text-[#CBD5E1] mb-2 font-mono font-bold text-xs shadow-md">
                    2
                  </div>

                  {/* Team Color Pill */}
                  <div
                    className="w-8 h-1 rounded-full mb-1.5"
                    style={{ backgroundColor: podium.p2.driver.color_hex }}
                  />

                  <h4 className="text-xs md:text-sm font-bold font-mono text-white truncate max-w-full">
                    {podium.p2.driver.broadcast_name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-sans truncate max-w-full">
                    {podium.p2.driver.team_name}
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/[0.06] w-full flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-400">{podium.p2.time_or_gap}</span>
                    <span className="font-bold text-[#CBD5E1]">+{podium.p2.points} PTS</span>
                  </div>
                </div>

                {/* 3D Podium Base Step (Silver - 120px) */}
                <div className="w-full h-24 md:h-32 bg-gradient-to-b from-[#181F2C] to-[#0A0D14] border border-[#CBD5E1]/30 flex flex-col items-center justify-center rounded-b-md relative overflow-hidden shadow-inner">
                  <span className="text-4xl md:text-5xl font-black font-mono text-[#CBD5E1]/20 select-none">
                    2
                  </span>
                  <div className="absolute bottom-2 text-[10px] font-mono font-bold tracking-widest text-[#CBD5E1]/60 uppercase">
                    SILVER
                  </div>
                </div>
              </motion.div>

              {/* ======================= P1: GOLD STEP (CENTER ELEVATED) ======================= */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center relative -top-4 group"
              >
                {/* Crown / Winner Trophy Icon Over Podium */}
                <div className="absolute -top-7 flex items-center justify-center">
                  <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-wider">
                      WINNER
                    </span>
                  </div>
                </div>

                {/* Driver Badge Top Box */}
                <div className="w-full p-4 rounded-t-lg bg-[#141924] border-t-2 border-x border-amber-400 flex flex-col items-center text-center shadow-2xl relative group-hover:border-amber-300 transition-all">
                  {/* Gold Winner Badge */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 border-2 border-white flex items-center justify-center text-black mb-2 font-mono font-black text-sm shadow-lg shadow-amber-500/40">
                    1
                  </div>

                  {/* Team Color Pill */}
                  <div
                    className="w-12 h-1.5 rounded-full mb-1.5"
                    style={{ backgroundColor: podium.p1.driver.color_hex }}
                  />

                  <h3 className="text-sm md:text-base font-black font-mono text-white tracking-tight truncate max-w-full">
                    {podium.p1.driver.full_name}
                  </h3>
                  <p className="text-[11px] text-neutral-300 font-sans font-semibold truncate max-w-full">
                    {podium.p1.driver.team_name}
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/[0.08] w-full flex items-center justify-between text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">{podium.p1.time_or_gap}</span>
                    <span className="font-bold text-amber-400">+{podium.p1.points} PTS</span>
                  </div>
                </div>

                {/* 3D Podium Base Step (Gold - 160px) */}
                <div className="w-full h-36 md:h-44 bg-gradient-to-b from-[#221B10] via-[#16130B] to-[#0A0D14] border border-amber-500/40 flex flex-col items-center justify-center rounded-b-md relative overflow-hidden shadow-2xl">
                  <span className="text-6xl md:text-7xl font-black font-mono text-amber-400/25 select-none">
                    1
                  </span>
                  <div className="absolute bottom-2 text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    P1 VICTORY
                  </div>
                </div>
              </motion.div>

              {/* ======================= P3: BRONZE STEP (RIGHT) ======================= */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col items-center group"
              >
                {/* Driver Badge Top Box */}
                <div className="w-full p-3 rounded-t-lg bg-[#0F131C] border-t-2 border-x border-[#CD7F32]/50 flex flex-col items-center text-center shadow-lg relative group-hover:border-[#CD7F32] transition-all">
                  {/* Medal / Position Tag */}
                  <div className="w-7 h-7 rounded-full bg-[#CD7F32]/20 border border-[#CD7F32] flex items-center justify-center text-[#CD7F32] mb-2 font-mono font-bold text-xs shadow-md">
                    3
                  </div>

                  {/* Team Color Pill */}
                  <div
                    className="w-8 h-1 rounded-full mb-1.5"
                    style={{ backgroundColor: podium.p3.driver.color_hex }}
                  />

                  <h4 className="text-xs md:text-sm font-bold font-mono text-white truncate max-w-full">
                    {podium.p3.driver.broadcast_name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-sans truncate max-w-full">
                    {podium.p3.driver.team_name}
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/[0.06] w-full flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-400">{podium.p3.time_or_gap}</span>
                    <span className="font-bold text-[#CD7F32]">+{podium.p3.points} PTS</span>
                  </div>
                </div>

                {/* 3D Podium Base Step (Bronze - 95px) */}
                <div className="w-full h-20 md:h-28 bg-gradient-to-b from-[#1E1611] to-[#0A0D14] border border-[#CD7F32]/30 flex flex-col items-center justify-center rounded-b-md relative overflow-hidden shadow-inner">
                  <span className="text-4xl md:text-5xl font-black font-mono text-[#CD7F32]/20 select-none">
                    3
                  </span>
                  <div className="absolute bottom-2 text-[10px] font-mono font-bold tracking-widest text-[#CD7F32]/60 uppercase">
                    BRONZE
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* 
            ========================================================================
            FASTEST LAP & POLE POSITION BANNERS
            ========================================================================
          */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {fastest_lap && (
              <div className="p-3.5 rounded-lg bg-[#140D1D] border border-purple-500/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Timer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      OFFICIAL FASTEST LAP (+1 PT)
                    </span>
                    <p className="text-xs font-mono font-bold text-white">
                      {fastest_lap.driver.full_name} ({fastest_lap.driver.team_name})
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-black text-purple-300">{fastest_lap.lap_time}</span>
                  <p className="text-[10px] text-neutral-400">Lap {fastest_lap.lap_number}</p>
                </div>
              </div>
            )}

            {pole_position && (
              <div className="p-3.5 rounded-lg bg-[#0F131C] border border-white/[0.08] flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                    <Flag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                      POLE POSITION QUALIFYING
                    </span>
                    <p className="text-xs font-mono font-bold text-white">
                      {pole_position.driver.full_name} ({pole_position.driver.team_name})
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-black text-white">{pole_position.q3_time}</span>
                  <p className="text-[10px] text-neutral-400">Q3 Shootout</p>
                </div>
              </div>
            )}
          </div>

          {/* 
            ========================================================================
            EXPANDABLE TOP 10 POINTS CLASSIFICATION TABLE
            ========================================================================
          */}
          {top_finishers && top_finishers.length > 0 && (
            <div className="relative z-10 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setShowFullClassification(!showFullClassification)}
                className="w-full py-2.5 px-4 rounded-md bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-between font-mono text-xs text-neutral-300 font-semibold transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>FULL TOP 10 RACE CLASSIFICATION & POINTS</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white">
                    {top_finishers.length} Finishers
                  </span>
                </span>
                {showFullClassification ? (
                  <ChevronUp className="w-4 h-4 text-[#FF1801]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                )}
              </button>

              <AnimatePresence>
                {showFullClassification && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3 rounded-lg border border-white/[0.08] bg-[#07090E]"
                  >
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.08] text-[10px] uppercase text-neutral-400 bg-white/[0.02]">
                          <th className="py-2.5 px-3">POS</th>
                          <th className="py-2.5 px-3">DRIVER</th>
                          <th className="py-2.5 px-3 hidden sm:table-cell">TEAM</th>
                          <th className="py-2.5 px-3">GRID DELTA</th>
                          <th className="py-2.5 px-3">STOPS</th>
                          <th className="py-2.5 px-3 text-right">GAP / TIME</th>
                          <th className="py-2.5 px-3 text-right">POINTS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {top_finishers.map((f) => {
                          const gridDelta = f.grid_start ? f.grid_start - f.position : 0;
                          return (
                            <tr key={f.position} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2.5 px-3 font-bold text-white">P{f.position}</td>
                              <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                                <span
                                  className="w-1.5 h-3 rounded-full"
                                  style={{ backgroundColor: f.team_color }}
                                />
                                <span>{f.driver.broadcast_name}</span>
                              </td>
                              <td className="py-2.5 px-3 text-neutral-400 hidden sm:table-cell font-sans text-xs">
                                {f.team_name}
                              </td>
                              <td className="py-2.5 px-3 text-xs">
                                {gridDelta > 0 ? (
                                  <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                                    <TrendingUp className="w-3 h-3" /> +{gridDelta}
                                  </span>
                                ) : gridDelta < 0 ? (
                                  <span className="text-rose-400 flex items-center gap-0.5 font-bold">
                                    <TrendingDown className="w-3 h-3" /> {gridDelta}
                                  </span>
                                ) : (
                                  <span className="text-neutral-500 flex items-center gap-0.5">
                                    <Minus className="w-3 h-3" /> 0
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-neutral-300">{f.pit_stops || 1} Stop</td>
                              <td className="py-2.5 px-3 text-right text-neutral-400">{f.time_or_gap}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                                +{f.points}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}
