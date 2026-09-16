'use client';

import React, { useState, useEffect } from 'react';
import { f1Api, AVAILABLE_SEASONS } from '@/lib/api';
import { DriverStanding, ConstructorStanding, SeasonChampion } from '@/lib/types';
import { Trophy, Calendar, Award, Star, Flame, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTelemetryStore } from '@/lib/store';
import { EmptyState } from '@/components/ui/EmptyState';

export function StandingsTable() {
  const { season: storeSeason, setSeason: setStoreSeason } = useTelemetryStore();
  const [selectedSeason, setSelectedSeason] = useState<number>(storeSeason || 2024);
  const [tab, setTab] = useState<'drivers' | 'constructors'>('drivers');
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [champion, setChampion] = useState<SeasonChampion | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAllDrivers, setShowAllDrivers] = useState<boolean>(false);

  useEffect(() => {
    setSelectedSeason(storeSeason);
  }, [storeSeason]);

  useEffect(() => {
    async function loadStandings() {
      setLoading(true);
      try {
        const [d, c, champ] = await Promise.all([
          f1Api.getDriverStandings(selectedSeason),
          f1Api.getConstructorStandings(selectedSeason),
          f1Api.getSeasonChampion(selectedSeason),
        ]);
        setDriverStandings(d);
        setConstructorStandings(c);
        setChampion(champ);
      } finally {
        setLoading(false);
      }
    }
    loadStandings();
  }, [selectedSeason]);

  const handleSeasonChange = (yr: number) => {
    setSelectedSeason(yr);
    setStoreSeason(yr);
  };

  return (
    <div className="w-full p-6 f1-glass-card flex flex-col gap-5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#FF1801]/10 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
            <Trophy className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white tracking-tight flex items-center gap-2 font-mono uppercase">
              <span>{selectedSeason} FIA Formula One World Championship</span>
              {selectedSeason >= 2025 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                  {selectedSeason === 2026 ? '2026 REGS' : 'LIVE'}
                </span>
              )}
            </h2>
            <p className="text-[11px] font-mono text-neutral-400">
              Verified historical points & standings archive (2000–2026)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Season Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#121622] border border-white/[0.12] text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#FF1801]" />
            <select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(Number(e.target.value))}
              aria-label="Filter Season"
              className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
            >
              {AVAILABLE_SEASONS.map((yr) => (
                <option key={yr} value={yr} className="bg-[#0B0E14] text-white">
                  Season {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Drivers vs Constructors toggle */}
          <div className="flex items-center p-1 rounded-md bg-[#121622] border border-white/[0.12]">
            <button
              onClick={() => setTab('drivers')}
              className={`px-3 py-1 rounded-sm text-xs font-mono font-bold transition-all ${
                tab === 'drivers'
                  ? 'bg-[#FF1801] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setTab('constructors')}
              className={`px-3 py-1 rounded-sm text-xs font-mono font-bold transition-all ${
                tab === 'constructors'
                  ? 'bg-[#FF1801] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Constructors
            </button>
          </div>
        </div>
      </div>

      {/* Official Season Champion Showcase Banner */}
      {champion && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg bg-[#07090E] border border-amber-500/30 relative overflow-hidden">
          {/* Driver Champion Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Trophy className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  WORLD DRIVERS&apos; CHAMPION
                </span>
                <span className="text-[10px] font-mono text-neutral-400 font-bold">P1 FINAL</span>
              </div>
              <p className="text-sm font-bold text-white font-mono mt-0.5">{champion.wdc_driver}</p>
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mt-1">
                <span className="text-white font-medium">{champion.wdc_team}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{champion.wdc_points} PTS</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{champion.wdc_wins} WINS</span>
              </div>
            </div>
          </div>

          {/* Constructor Champion Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
            <div className="w-10 h-10 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#FF1801] font-bold">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
                  CONSTRUCTORS&apos; CHAMPION
                </span>
                <span className="text-[10px] font-mono text-neutral-400 font-bold">WCC WINNER</span>
              </div>
              <p className="text-sm font-bold text-white font-mono mt-0.5">{champion.wcc_team}</p>
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mt-1">
                <span className="text-red-400 font-bold">{champion.wcc_points} PTS</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{champion.wcc_wins} WINS</span>
                {champion.notes && (
                  <>
                    <span>•</span>
                    <span className="text-[11px] text-neutral-400 truncate">{champion.notes}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="py-12 flex items-center justify-center gap-3 text-xs font-mono text-neutral-400">
          <div className="w-4 h-4 rounded-full border-2 border-[#FF1801] border-t-transparent animate-spin" />
          <span>Loading {selectedSeason} Championship Archive...</span>
        </div>
      ) : tab === 'drivers' ? (
        driverStandings.length === 0 ? (
          <EmptyState
            title="NO DRIVER STANDINGS AVAILABLE"
            description={`No driver championship data recorded for the ${selectedSeason} season.`}
          />
        ) : (
          <div className="overflow-x-auto space-y-3">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] text-neutral-500 uppercase font-semibold">
                  <th className="pb-2.5 px-3">Pos</th>
                  <th className="pb-2.5 px-3">Driver</th>
                  <th className="pb-2.5 px-3">Constructor</th>
                  <th className="pb-2.5 px-3 text-center">Wins</th>
                  <th className="pb-2.5 px-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {(showAllDrivers ? driverStandings : driverStandings.slice(0, 10)).map((s) => {
                  const isP1 = s.position === 1;
                  const isPodium = s.position <= 3;
                  return (
                    <tr
                      key={s.driver.id}
                      className={`transition-all hover:bg-white/[0.03] ${
                        isP1 ? 'border-l-2 border-l-[#FF1801] bg-red-500/[0.02]' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        {isP1 ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-[#FF1801] text-white font-bold text-[10px]">
                            1
                          </span>
                        ) : isPodium ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white/10 text-white font-semibold text-[10px]">
                            {s.position}
                          </span>
                        ) : (
                          <span className="text-neutral-400 pl-1.5">{s.position}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-3.5 rounded-none"
                            style={{ backgroundColor: s.driver.color_hex }}
                          />
                          <span className="font-semibold text-white font-sans">{s.driver.full_name}</span>
                          {s.driver.driver_number && (
                            <span className="text-[10px] text-neutral-500">#{s.driver.driver_number}</span>
                          )}
                          {isP1 && (
                            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                              ★ WDC
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-400 font-sans">{s.driver.team_name}</td>
                      <td className="py-3 px-3 text-center text-neutral-300 font-medium">{s.wins}</td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {s.points} <span className="text-[10px] font-normal text-neutral-500">PTS</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {driverStandings.length > 10 && (
              <div className="pt-2 border-t border-white/[0.06] flex justify-center">
                <button
                  onClick={() => setShowAllDrivers(!showAllDrivers)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-bold text-neutral-300 hover:text-white transition-all cursor-pointer"
                >
                  {showAllDrivers ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      COLLAPSE TO TOP 10
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      SHOW FULL GRID ({driverStandings.length} DRIVERS)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )
      ) : constructorStandings.length === 0 ? (
        <EmptyState
          title="NO CONSTRUCTOR STANDINGS AVAILABLE"
          description={`No constructor championship data recorded for the ${selectedSeason} season.`}
        />
      ) : (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] text-neutral-500 uppercase font-semibold">
                <th className="pb-2.5 px-3">Pos</th>
                <th className="pb-2.5 px-3">Constructor</th>
                <th className="pb-2.5 px-3 text-center">Wins</th>
                <th className="pb-2.5 px-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {constructorStandings.map((s) => {
                const isP1 = s.position === 1;
                const isPodium = s.position <= 3;
                return (
                  <tr
                    key={s.constructor.id}
                    className={`transition-all hover:bg-white/[0.03] ${
                      isP1 ? 'border-l-2 border-l-[#FF1801] bg-red-500/[0.02]' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      {isP1 ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-[#FF1801] text-white font-bold text-[10px]">
                          1
                        </span>
                      ) : isPodium ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white/10 text-white font-semibold text-[10px]">
                          {s.position}
                        </span>
                      ) : (
                        <span className="text-neutral-400 pl-1.5">{s.position}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-3.5 rounded-none"
                          style={{ backgroundColor: s.constructor.color_hex }}
                        />
                        <span className="font-semibold text-white font-sans">{s.constructor.full_name}</span>
                        {isP1 && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                            ★ WCC
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-neutral-300 font-medium">{s.wins}</td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {s.points} <span className="text-[10px] font-normal text-neutral-500">PTS</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

