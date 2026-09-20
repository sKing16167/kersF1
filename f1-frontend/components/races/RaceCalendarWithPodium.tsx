'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { f1Api, MOCK_RACES, AVAILABLE_SEASONS } from '@/lib/api';
import { Race, RaceResult } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { RacePodiumShowcase } from './RacePodiumShowcase';
import {
  Calendar,
  Flag,
  Trophy,
  ChevronRight,
  MapPin,
  Clock,
  Flame,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface RaceCalendarWithPodiumProps {
  initialSeason?: number;
}

export function RaceCalendarWithPodium({ initialSeason = 2026 }: RaceCalendarWithPodiumProps) {
  const { season, setSeason, selectedRace, setSelectedRace } = useTelemetryStore();
  const [activeSeason, setActiveSeason] = useState<number>(season || initialSeason);
  const [races, setRaces] = useState<Race[]>(MOCK_RACES);
  const [activeRaceId, setActiveRaceId] = useState<number>(selectedRace?.id || 16);
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);
  const [loadingResult, setLoadingResult] = useState<boolean>(false);

  // Sync store season and selectedRace
  useEffect(() => {
    if (season) setActiveSeason(season);
  }, [season]);

  useEffect(() => {
    if (selectedRace) {
      setActiveRaceId(selectedRace.id);
    }
  }, [selectedRace]);

  // Load races for season
  useEffect(() => {
    let isCancelled = false;
    async function loadRaces() {
      const raceList = await f1Api.getRaces(activeSeason);
      if (!isCancelled) {
        setRaces(raceList);
        if (raceList.length > 0) {
          const match = raceList.find((r) => r.id === activeRaceId);
          if (!match) {
            setActiveRaceId(raceList[0].id);
            setSelectedRace(raceList[0]);
          }
        }
      }
    }
    loadRaces();
    return () => {
      isCancelled = true;
    };
  }, [activeSeason]);

  const currentRace = useMemo<Race>(
    () => races.find((r) => r.id === activeRaceId) || races[0] || MOCK_RACES[0],
    [races, activeRaceId]
  );

  // Load race result when active race changes
  useEffect(() => {
    let isCancelled = false;
    async function loadResult() {
      if (!currentRace) return;
      setLoadingResult(true);
      try {
        const roundToFetch = currentRace.round_number || (currentRace.id < 100 ? currentRace.id : 1);
        const res = await f1Api.getRaceResult(roundToFetch, activeSeason);
        if (!isCancelled) {
          setRaceResult(res);
        }
      } finally {
        if (!isCancelled) {
          setLoadingResult(false);
        }
      }
    }
    loadResult();
    return () => {
      isCancelled = true;
    };
  }, [currentRace, activeSeason]);

  const handleSelectRace = (r: Race) => {
    setActiveRaceId(r.id);
    setSelectedRace(r);
  };

  // Dynamically compute authentic key race chips based on current season's actual rounds
  const featuredRounds = useMemo(() => {
    if (!races || races.length === 0) return [1];
    const total = races.length;
    const r1 = 1;
    const rLast = total;
    const rMid1 = Math.max(2, Math.round(total * 0.35));
    const rMid2 = Math.max(3, Math.round(total * 0.70));
    const monaco = races.find((r) => r.circuit?.country_code === 'MON' || r.race_name.toLowerCase().includes('monaco'))?.round_number;
    const monza = races.find((r) => r.circuit?.country_code === 'ITA' || r.race_name.toLowerCase().includes('italian'))?.round_number;
    const silv = races.find((r) => r.circuit?.country_code === 'GBR' || r.circuit?.country_code === 'UK' || r.race_name.toLowerCase().includes('british'))?.round_number;

    const candidates = [r1, monaco, silv, monza, rMid1, rMid2, rLast]
      .filter((n): n is number => typeof n === 'number' && n >= 1 && n <= total);

    return Array.from(new Set(candidates)).sort((a, b) => a - b).slice(0, 5);
  }, [races]);

  return (
    <div className="w-full space-y-6">
      {/* 
        ========================================================================
        1. 24-RACE CALENDAR HORIZONTAL SELECTOR STRIP
        ========================================================================
      */}
      <div className="f1-glass-card p-5 md:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
              <Calendar className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#FF1801] font-bold">
                  {activeSeason} WORLD CHAMPIONSHIP CALENDAR
                </span>
                <span className="text-xs text-neutral-500">•</span>
                <span className="text-xs font-mono text-neutral-400">{races.length} OFFICIAL GRANDS PRIX</span>
              </div>
              <h3 className="text-lg font-bold font-mono text-white tracking-tight">
                {activeSeason >= 2025
                  ? 'Scheduled Grand Prix Calendar & Event Briefings'
                  : 'Official FIA Race Classifications & Podiums'}
              </h3>
            </div>
          </div>

          {/* Quick Season Switcher & Featured Round Jump Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#121622] border border-white/10 text-xs font-mono">
              <span className="text-neutral-400 font-bold">SEASON:</span>
              <select
                value={activeSeason}
                onChange={(e) => {
                  const newSeason = Number(e.target.value);
                  setActiveSeason(newSeason);
                  setSeason(newSeason);
                }}
                aria-label="Select Season"
                className="bg-transparent text-[#FF1801] font-bold font-mono text-xs focus:outline-none cursor-pointer"
              >
                {AVAILABLE_SEASONS.map((s) => (
                  <option key={s} value={s} className="bg-[#0D1017] text-white">
                    {s} {s === 2026 ? '(Current Season)' : s === 2024 ? '(Completed)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-mono text-neutral-400 font-semibold mr-1">
                KEY RACES:
              </span>
              {featuredRounds.map((rd) => {
                const target = races.find((r) => r.round_number === rd);
                if (!target) return null;
                const isSelected = activeRaceId === target.id;
                return (
                  <button
                    key={rd}
                    onClick={() => handleSelectRace(target)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF1801] text-white shadow-md shadow-red-600/30'
                        : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.1] border border-white/[0.06]'
                    }`}
                  >
                    R{rd < 10 ? `0${rd}` : rd} {target.circuit.country_code}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable 24-Race Carousel Strip */}
        <div className="relative">
          <div className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {races.map((r) => {
              const isSelected = activeRaceId === r.id;
              const roundFormatted = r.round_number < 10 ? `0${r.round_number}` : r.round_number;

              return (
                <button
                  key={r.id}
                  onClick={() => handleSelectRace(r)}
                  className={`flex-shrink-0 w-52 p-3 rounded-lg text-left transition-all relative border group cursor-pointer ${
                    isSelected
                      ? 'bg-[#141926] border-[#FF1801] shadow-xl shadow-red-950/40 ring-1 ring-[#FF1801]'
                      : 'bg-[#080B11] border-white/[0.06] hover:border-white/[0.2] hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Top Bar: Round + Status */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#FF1801] text-white'
                          : 'bg-white/[0.06] text-neutral-400 group-hover:text-white'
                      }`}
                    >
                      ROUND {roundFormatted}
                    </span>

                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        r.status === 'COMPLETED'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : r.status === 'LIVE'
                          ? 'text-red-400 bg-red-500/20 animate-pulse'
                          : r.status === 'CANCELLED'
                          ? 'text-red-400 bg-red-500/20 border border-red-500/30'
                          : 'text-neutral-400 bg-white/[0.04]'
                      }`}
                    >
                      {r.status || 'SCHEDULED'}
                    </span>
                  </div>

                  {/* Race Title & Country */}
                  <h4 className="text-xs font-bold font-mono text-white truncate max-w-full group-hover:text-[#FF1801] transition-colors">
                    {r.race_name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-sans truncate max-w-full">
                    {r.circuit.circuit_name}
                  </p>

                  {/* Date & Track Length Footer */}
                  <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>{r.date}</span>
                    <span className="font-semibold text-neutral-400">{r.circuit.country_code}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. HIGHLIGHTED GRAND PRIX 3D PODIUM SHOWCASE
        ========================================================================
      */}
      {loadingResult ? (
        <div className="p-8 rounded-lg bg-[#0B0E15] border border-white/[0.08] flex flex-col items-center justify-center gap-3 animate-pulse font-mono">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF1801] border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-neutral-300 tracking-wider">
            FETCHING OFFICIAL RACE CLASSIFICATION...
          </span>
        </div>
      ) : raceResult && currentRace ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRace.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <RacePodiumShowcase race={currentRace} result={raceResult} />
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  );
}
