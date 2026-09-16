'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { f1Api, MOCK_DRIVERS, AVAILABLE_SEASONS, HISTORICAL_CONSTRUCTORS } from '@/lib/api';
import { Driver, Constructor } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { HeadToHeadCard } from '@/components/drivers/HeadToHeadCard';
import { StandingsTable } from '@/components/drivers/StandingsTable';
import { Users, Award, Calendar, Shield, Trophy, Flag, History, Search } from 'lucide-react';

export default function DriversHubPage() {
  const { season: storeSeason, setSeason: setStoreSeason, setDriverA, setDriverB } = useTelemetryStore();
  const [selectedSeason, setSelectedSeason] = useState<number>(storeSeason || 2026);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'drivers' | 'team_rosters' | 'historical_teams'>('drivers');
  const [histFilter, setHistFilter] = useState<'ALL' | 'CHAMPIONS' | 'WINNERS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (storeSeason) setSelectedSeason(storeSeason);
  }, [storeSeason]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const d = await f1Api.getDrivers(selectedSeason);
        if (d && d.length > 0) setDrivers(d);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedSeason]);

  // Group current season drivers by their constructor
  const seasonTeams = useMemo(() => {
    const map = new Map<string, { name: string; color: string; drivers: Driver[] }>();
    for (const d of drivers) {
      const team = d.team_name || 'Independent';
      if (!map.has(team)) {
        map.set(team, { name: team, color: d.color_hex, drivers: [] });
      }
      map.get(team)!.drivers.push(d);
    }
    return Array.from(map.values());
  }, [drivers]);

  // Filter historical constructors not currently on the grid
  const filteredHistoricalConstructors = useMemo(() => {
    return HISTORICAL_CONSTRUCTORS.filter((c) => {
      if (histFilter === 'CHAMPIONS') {
        if (!c.championships || (c.championships.wdc === 0 && c.championships.wcc === 0)) return false;
      }
      if (histFilter === 'WINNERS') {
        const winners = ['Brawn', 'Renault', 'BMW Sauber', 'Toro Rosso', 'AlphaTauri', 'Racing Point', 'Lotus F1', 'Jordan', 'Honda'];
        if (!winners.includes(c.name)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q) || c.full_name.toLowerCase().includes(q);
        const matchDriver = c.notable_drivers?.some((d) => d.toLowerCase().includes(q));
        const matchMember = c.members?.some((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
        return matchName || matchDriver || matchMember;
      }
      return true;
    });
  }, [histFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 f1-glass-card p-6 rounded-lg border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
            <Users className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Driver & Team Analytics
            </h1>
            <p className="text-xs text-neutral-400">
              Synchronized driver lineups, historical team rosters, and legendary constructors archive.
            </p>
          </div>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#121622] border border-white/[0.12] text-xs">
          <Calendar className="w-3.5 h-3.5 text-[#FF1801]" />
          <span className="text-[10px] font-mono text-neutral-400 uppercase">Season:</span>
          <select
            value={selectedSeason}
            onChange={(e) => {
              const yr = Number(e.target.value);
              setSelectedSeason(yr);
              setStoreSeason(yr);
            }}
            aria-label="Select Drivers Season"
            className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
          >
            {AVAILABLE_SEASONS.map((yr) => (
              <option key={yr} value={yr} className="bg-[#0B0E14] text-white">
                Season {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head to Head Card */}
      <HeadToHeadCard />

      {/* Driver & Team Hub with 3 Specialized Views */}
      <div className="f1-glass-card p-6 rounded-lg space-y-5 border border-white/[0.08] shadow-2xl">
        {/* Navigation Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'drivers'
                  ? 'bg-[#FF1801] text-white shadow-md'
                  : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Driver Lineup ({selectedSeason})</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-normal">
                {drivers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team_rosters')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'team_rosters'
                  ? 'bg-[#FF1801] text-white shadow-md'
                  : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Team Rosters ({selectedSeason})</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-normal">
                {seasonTeams.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('historical_teams')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'historical_teams'
                  ? 'bg-[#FF1801] text-white shadow-md'
                  : 'bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Historic Teams (Not on Grid)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                {HISTORICAL_CONSTRUCTORS.length}
              </span>
            </button>
          </div>

          {activeTab === 'historical_teams' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search team or driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs rounded-md bg-[#121622] border border-white/[0.12] text-white font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#FF1801]"
                />
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#121622] border border-white/[0.12]">
                <button
                  onClick={() => setHistFilter('ALL')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    histFilter === 'ALL' ? 'bg-[#FF1801] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({HISTORICAL_CONSTRUCTORS.length})
                </button>
                <button
                  onClick={() => setHistFilter('CHAMPIONS')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    histFilter === 'CHAMPIONS' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Champions
                </button>
                <button
                  onClick={() => setHistFilter('WINNERS')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    histFilter === 'WINNERS' ? 'bg-emerald-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  GP Winners
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 1. DRIVER GRID VIEW */}
        {activeTab === 'drivers' && (
          <div>
            {loading ? (
              <div className="py-12 flex items-center justify-center gap-3 text-xs font-mono text-neutral-400">
                <div className="w-4 h-4 rounded-full border-2 border-[#FF1801] border-t-transparent animate-spin" />
                <span>Loading {selectedSeason} Driver Lineup...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {drivers.map((d) => (
                  <div
                    key={d.id || `${d.full_name}-${d.driver_number}`}
                    className="p-3.5 rounded-md bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                        <span>{d.country_code}</span>
                        <span className="font-bold text-white">#{d.driver_number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-4 rounded-none shrink-0"
                          style={{ backgroundColor: d.color_hex }}
                        />
                        <h3 className="font-bold text-xs text-white truncate font-mono">
                          {d.full_name}
                        </h3>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5 ml-3.5 truncate">
                        {d.team_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/[0.06]">
                      <button
                        onClick={() => setDriverA(d)}
                        className="flex-1 py-1 rounded-sm bg-white/[0.05] hover:bg-[#FF1801] text-[10px] font-mono font-bold text-neutral-200 hover:text-white transition-colors cursor-pointer"
                      >
                        Set A
                      </button>
                      <button
                        onClick={() => setDriverB(d)}
                        className="flex-1 py-1 rounded-sm bg-white/[0.05] hover:bg-[#FF1801] text-[10px] font-mono font-bold text-neutral-200 hover:text-white transition-colors cursor-pointer"
                      >
                        Set B
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. TEAM ROSTERS VIEW (Grouped by Constructor for Selected Season) */}
        {activeTab === 'team_rosters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seasonTeams.map((t) => (
              <div
                key={t.name}
                className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Team Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-7 rounded-none shrink-0 shadow-sm"
                        style={{ backgroundColor: t.color }}
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white font-mono tracking-tight">
                          {t.name}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {selectedSeason} Official Constructor
                        </span>
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor: `${t.color}20`,
                        color: t.color,
                        borderColor: `${t.color}40`,
                        borderWidth: 1,
                      }}
                    >
                      {t.drivers.length} Drivers
                    </span>
                  </div>

                  {/* Team Driver Members */}
                  <div className="mt-3.5 space-y-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                      Official Team Drivers
                    </span>
                    <div className="space-y-1.5">
                      {t.drivers.map((drv) => (
                        <div
                          key={drv.id || `${drv.full_name}-${drv.driver_number}`}
                          className="flex items-center justify-between p-2 rounded bg-black/20 border border-white/[0.04] text-xs font-mono"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400 font-bold text-[10px] w-5">
                              #{drv.driver_number}
                            </span>
                            <span className="font-semibold text-white">{drv.full_name}</span>
                            <span className="text-[9px] text-neutral-500">({drv.country_code})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDriverA(drv)}
                              className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-[#FF1801] text-[9px] font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            >
                              Set A
                            </button>
                            <button
                              onClick={() => setDriverB(drv)}
                              className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-[#FF1801] text-[9px] font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            >
                              Set B
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. HISTORICAL CONSTRUCTORS ARCHIVE (Teams Not on the Active Grid) */}
        {activeTab === 'historical_teams' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
              <span>SHOWING {filteredHistoricalConstructors.length} HISTORIC CONSTRUCTORS (TEAMS CURRENTLY NOT PART OF THE ACTIVE GRID)</span>
              <span className="text-amber-400 font-bold">LEGENDS ARCHIVE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredHistoricalConstructors.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-lg bg-[#07090E] border border-white/[0.08] hover:border-white/[0.2] transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  {/* Livery Accent Glow */}
                  <div
                    className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none"
                    style={{ backgroundColor: c.color_hex }}
                  />

                  {/* Top Bar: Color, Name, Era, Championships */}
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-9 rounded-none shrink-0 shadow-md"
                          style={{ backgroundColor: c.color_hex }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white font-mono tracking-tight">
                              {c.name}
                            </h3>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] text-neutral-300 border border-white/10">
                              {c.country_code}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 font-mono">{c.full_name}</p>
                        </div>
                      </div>

                      {/* Championship Badges */}
                      {c.championships && (c.championships.wdc > 0 || c.championships.wcc > 0) ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-400" />
                            {c.championships.wdc} WDC • {c.championships.wcc} WCC
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                            WORLD CHAMPION
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                          {c.era}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {c.description && (
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed pt-1">
                        {c.description}
                      </p>
                    )}
                  </div>

                  {/* Team Members & Roster */}
                  {c.members && c.members.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-white/[0.06] relative z-10">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase font-semibold">
                        <span>Team Members & Leadership</span>
                        <span>{c.members.length} Members</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {c.members.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded bg-white/[0.02] border border-white/[0.04] text-xs font-mono"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{m.name}</span>
                              {m.nationality && (
                                <span className="text-[9px] text-neutral-400">{m.nationality}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-400 block mt-0.5 truncate">
                              {m.role}
                            </span>
                            {m.notes && (
                              <span className="text-[9px] text-neutral-400 block mt-0.5 italic truncate">
                                {m.notes}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Footer: Headquarters & Era */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-white/[0.06] relative z-10">
                    <span>HQ: {c.base_location || 'Europe'}</span>
                    <span>Era: {c.era}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Standings Table with Driver & Constructor Archive */}
      <StandingsTable />
    </div>
  );
}
