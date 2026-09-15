'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { f1Api, MOCK_RACES } from '@/lib/api';
import { Race, RaceResult } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { RacePodiumShowcase } from './RacePodiumShowcase';
import {
  Calendar,
  Flag,
  Trophy,
  ChevronRight,
  Sparkles,
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
        if (raceList.length > 0 && !raceList.some((r) => r.id === activeRaceId)) {
          setActiveRaceId(raceList[0].id);
        }
      }
    }
    loadRaces();
    return () => {
      isCancelled = true;
    };
  }, [activeSeason, activeRaceId]);

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
        const res = await f1Api.getRaceResult(currentRace.id, activeSeason);
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

  // Quick feature chips
  const featuredRounds = [1, 8, 12, 16, 24];

  return (
    <div className="w-full space-y-6">
      {/* 
        ========================================================================
        1. 24-RACE CALENDAR HORIZONTAL SELECTOR STRIP
        ========================================================================
      */}
      <div className="p-5 md:p-6 rounded-lg bg-[#0B0E15] border border-white/[0.08] shadow-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600]">
              <Calendar className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#E10600] font-bold">2026 WORLD CHAMPIONSHIP CALENDAR</span>
                <span className="text-xs text-neutral-500">•</span>
                <span className="text-xs font-mono text-neutral-400">24 OFFICIAL GRANDS PRIX</span>
              </div>
              <h3 className="text-lg font-bold font-mono text-white tracking-tight">
                Select Any Race to Inspect Podium & Telemetry
              </h3>
            </div>
          </div>

          {/* Quick Featured Round Jump Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
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
                      ? 'bg-[#E10600] text-white shadow-md shadow-red-600/30'
                      : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.1] border border-white/[0.06]'
                  }`}
                >
                  R{rd < 10 ? `0${rd}` : rd} {target.circuit.country_code}
                </button>
              );
            })}
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
                      ? 'bg-[#141926] border-[#E10600] shadow-xl shadow-red-950/40 ring-1 ring-[#E10600]'
                      : 'bg-[#080B11] border-white/[0.06] hover:border-white/[0.2] hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Top Bar: Round + Status */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#E10600] text-white'
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
                          : 'text-neutral-400 bg-white/[0.04]'
                      }`}
                    >
                      {r.status || 'SCHEDULED'}
                    </span>
                  </div>

                  {/* Race Title & Country */}
                  <h4 className="text-xs font-bold font-mono text-white truncate max-w-full group-hover:text-[#E10600] transition-colors">
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
      {raceResult && currentRace && (
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
      )}
    </div>
  );
}
