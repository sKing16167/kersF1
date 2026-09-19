'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { f1Api, MOCK_CIRCUITS } from '@/lib/api';
import { Circuit, MicroSector, TrackMicroSectorsResponse } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { MicroSectorSvgMap } from '@/components/tracks/MicroSectorSvgMap';
import {
  MapPin,
  Gauge,
  Activity,
  Users,
  Swords,
  Layers,
  Filter,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function TrackMapPage() {
  const {
    activeDistanceM,
    setActiveDistanceM,
    driverA,
    driverB,
    setDriverA,
    setDriverB,
    drivers,
  } = useTelemetryStore();

  // 23 Official Circuits State
  const [selectedCircuitId, setSelectedCircuitId] = useState<number>(1);
  const activeCircuit = useMemo<Circuit>(
    () => MOCK_CIRCUITS.find((c) => c.id === selectedCircuitId) || MOCK_CIRCUITS[0],
    [selectedCircuitId]
  );

  const [microSectorData, setMicroSectorData] = useState<TrackMicroSectorsResponse | null>(null);
  const [hoveredSector, setHoveredSector] = useState<MicroSector | null>(null);
  const [selectedSector, setSelectedSector] = useState<MicroSector | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'DRIVER_A' | 'DRIVER_B' | 'SLOW' | 'FAST'>('ALL');

  // Load micro-sectors for the active circuit and driver matchup
  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      const res = await f1Api.getMicroSectors(activeCircuit.id, driverA.id, driverB.id);
      if (!isCancelled) {
        setMicroSectorData(res);
        if (res.sectors.length > 0) {
          setSelectedSector(res.sectors[0]);
        }
      }
    }
    loadData();
    return () => {
      isCancelled = true;
    };
  }, [activeCircuit.id, driverA.id, driverB.id]);

  // Filtered micro-sectors
  const filteredSectors = useMemo(() => {
    if (!microSectorData) return [];
    const all = microSectorData.sectors;

    if (filterMode === 'DRIVER_A') return all.filter((s) => s.fastest_driver_id === driverA.id);
    if (filterMode === 'DRIVER_B') return all.filter((s) => s.fastest_driver_id === driverB.id);
    if (filterMode === 'SLOW') return all.filter((s) => s.fastest_apex_speed_kmh < 160);
    if (filterMode === 'FAST') return all.filter((s) => s.fastest_apex_speed_kmh >= 270);
    return all;
  }, [microSectorData, filterMode, driverA.id, driverB.id]);

  const driverAWins = microSectorData?.sectors.filter((s) => s.fastest_driver_id === driverA.id).length || 0;
  const driverBWins = microSectorData?.sectors.filter((s) => s.fastest_driver_id === driverB.id).length || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* 
        ========================================================================
        1. HEADER & 23-CIRCUIT SELECTOR
        ========================================================================
      */}
      <div className="f1-glass-card p-6 rounded-lg border border-white/[0.08] shadow-2xl flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600]">
              <Layers className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#E10600] font-bold">{MOCK_CIRCUITS.length} OFFICIAL FIA TRACKS</span>
                <span className="text-xs text-neutral-500">•</span>
                <span className="text-xs font-mono text-neutral-400">60-SECTOR APEX OVERLAY</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight">
                Micro-Sector Velocity Analysis: {activeCircuit.circuit_name}
              </h1>
            </div>
          </div>

          {/* 23 Track Switcher Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold whitespace-nowrap hidden sm:inline">
              SELECT TRACK:
            </span>
            <select
              value={selectedCircuitId}
              onChange={(e) => setSelectedCircuitId(Number(e.target.value))}
              aria-label="Select F1 Circuit"
              className="w-full lg:w-72 px-3 py-2 rounded-md bg-[#121622] hover:bg-[#181D2D] border border-white/[0.12] focus:border-[#E10600] text-white font-mono text-xs font-bold focus:outline-none cursor-pointer transition-all"
            >
              {MOCK_CIRCUITS.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0B0E15] text-white py-1">
                  {c.id < 10 ? `0${c.id}` : c.id}. {c.circuit_name} ({c.country_code} - {c.length_km}km)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Circuit Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-[10px] text-neutral-500 font-bold uppercase mr-1 whitespace-nowrap">
            FEATURED TRACKS:
          </span>
          {[1, 2, 3, 4, 5, 6, 11, 22].map((id) => {
            const track = MOCK_CIRCUITS.find((c) => c.id === id);
            if (!track) return null;
            const isSelected = selectedCircuitId === track.id;

            return (
              <button
                key={track.id}
                onClick={() => setSelectedCircuitId(track.id)}
                className={`px-3 py-1 rounded-sm text-[11px] whitespace-nowrap transition-all cursor-pointer font-bold ${
                  isSelected
                    ? 'bg-[#E10600] text-white shadow-sm shadow-red-950/50'
                    : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                {track.circuit_name.split(' ')[0]} ({track.country_code})
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        ========================================================================
        2. DRIVER A VS DRIVER B MATCHUP CONTROLS
        ========================================================================
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Driver A Selector */}
        <div className="f1-glass-card p-4 rounded-lg flex items-center justify-between gap-3 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-8 rounded-none shadow-sm inline-block"
              style={{ backgroundColor: driverA.color_hex }}
            />
            <div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">DRIVER A (TELEMETRY 1)</span>
              <div className="font-bold text-sm text-white font-mono">{driverA.full_name}</div>
              <div className="text-[10px] text-neutral-400 font-mono">{driverA.team_name} • #{driverA.driver_number}</div>
            </div>
          </div>

          <select
            value={driverA.id}
            onChange={(e) => {
              const d = drivers.find((item) => item.id === Number(e.target.value));
              if (d) setDriverA(d);
            }}
            aria-label="Select Driver A"
            className="f1-pill px-3 py-1.5 text-xs text-neutral-200 bg-transparent focus:outline-none cursor-pointer font-mono font-bold"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#0D1117] text-white">
                {d.broadcast_name} ({d.team_name.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Driver B Selector */}
        <div className="f1-glass-card p-4 rounded-lg flex items-center justify-between gap-3 border border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-8 rounded-none shadow-sm inline-block"
              style={{ backgroundColor: driverB.color_hex }}
            />
            <div>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">DRIVER B (TELEMETRY 2)</span>
              <div className="font-bold text-sm text-white font-mono">{driverB.full_name}</div>
              <div className="text-[10px] text-neutral-400 font-mono">{driverB.team_name} • #{driverB.driver_number}</div>
            </div>
          </div>

          <select
            value={driverB.id}
            onChange={(e) => {
              const d = drivers.find((item) => item.id === Number(e.target.value));
              if (d) setDriverB(d);
            }}
            aria-label="Select Driver B"
            className="f1-pill px-3 py-1.5 text-xs text-neutral-200 bg-transparent focus:outline-none cursor-pointer font-mono font-bold"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#0D1117] text-white">
                {d.broadcast_name} ({d.team_name.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Duel Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-neutral-400 font-bold uppercase">DUEL PRESETS:</span>
          <button
            onClick={() => {
              const nor = drivers.find((d) => d.id === 1);
              const ham = drivers.find((d) => d.id === 6);
              if (nor && ham) { setDriverA(nor); setDriverB(ham); }
            }}
            className="f1-pill px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Norris vs Hamilton
          </button>
          <button
            onClick={() => {
              const lec = drivers.find((d) => d.id === 2);
              const ham = drivers.find((d) => d.id === 6);
              if (lec && ham) { setDriverA(lec); setDriverB(ham); }
            }}
            className="f1-pill px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Leclerc vs Hamilton (Ferrari)
          </button>
          <button
            onClick={() => {
              const ver = drivers.find((d) => d.id === 3);
              const nor = drivers.find((d) => d.id === 1);
              if (ver && nor) { setDriverA(ver); setDriverB(nor); }
            }}
            className="f1-pill px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Verstappen vs Norris
          </button>
          <button
            onClick={() => {
              const rus = drivers.find((d) => d.id === 7);
              const ant = drivers.find((d) => d.id === 8);
              if (rus && ant) { setDriverA(rus); setDriverB(ant); }
            }}
            className="f1-pill px-2.5 py-1 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Russell vs Antonelli (Mercedes)
          </button>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center f1-pill p-1 gap-1 text-[11px]">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-2.5 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterMode === 'ALL' ? 'bg-[#E10600] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All 60
          </button>
          <button
            onClick={() => setFilterMode('DRIVER_A')}
            className={`px-2.5 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterMode === 'DRIVER_A' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            style={{ color: filterMode === 'DRIVER_A' ? '#FFFFFF' : driverA.color_hex }}
          >
            {driverA.broadcast_name} ({driverAWins})
          </button>
          <button
            onClick={() => setFilterMode('DRIVER_B')}
            className={`px-2.5 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterMode === 'DRIVER_B' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            style={{ color: filterMode === 'DRIVER_B' ? '#FFFFFF' : driverB.color_hex }}
          >
            {driverB.broadcast_name} ({driverBWins})
          </button>
          <button
            onClick={() => setFilterMode('SLOW')}
            className={`px-2.5 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterMode === 'SLOW' ? 'bg-amber-400/20 text-amber-300' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Apexes (&lt;160km/h)
          </button>
          <button
            onClick={() => setFilterMode('FAST')}
            className={`px-2.5 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterMode === 'FAST' ? 'bg-blue-400/20 text-blue-300' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Straights (&gt;270km/h)
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        3. MAIN INTERACTIVE SVG MICRO-SECTOR MAP (True Homologated Geometry)
        ========================================================================
      */}
      {microSectorData && (
        <MicroSectorSvgMap
          circuit={activeCircuit}
          microSectorData={microSectorData}
          hoveredSector={hoveredSector}
          onHoverSector={setHoveredSector}
          onSelectSector={setSelectedSector}
        />
      )}

      {/* 
        ========================================================================
        4. FULL 60 MICRO-SECTOR REGISTRY & TELEMETRY SPEED TRAP TABLE
        ========================================================================
      */}
      {microSectorData && (
        <div className="f1-glass-card p-6 rounded-lg space-y-4 border border-white/[0.08] shadow-2xl">
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] pb-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#E10600]/10 border border-[#E10600]/25 flex items-center justify-center text-[#E10600]">
                <Gauge className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white font-mono uppercase">
                  Micro-Sector Apex Velocity Registry ({filteredSectors.length} Sectors Shown)
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Showing apex speeds, turn names, and split advantage between {driverA.broadcast_name} and {driverB.broadcast_name}.
                </p>
              </div>
            </div>

            <span className="text-[10px] text-neutral-400 font-mono">
              Click any sector to jump distance scrubber
            </span>
          </div>

          {/* Micro-Sector Grid Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredSectors.map((sec) => {
              const isCurrent = Math.abs(sec.apex_distance_m - activeDistanceM) < (activeCircuit.length_km * 1000) / 60;
              const isHovered = hoveredSector?.sector_index === sec.sector_index;
              const isDriverAWinner = sec.fastest_driver_id === driverA.id;

              return (
                <div
                  key={`sec-card-${sec.sector_index}`}
                  onClick={() => {
                    setSelectedSector(sec);
                    setActiveDistanceM(sec.apex_distance_m);
                  }}
                  onMouseEnter={() => setHoveredSector(sec)}
                  onMouseLeave={() => setHoveredSector(null)}
                  className={`p-3 rounded-md transition-all cursor-pointer flex flex-col justify-between border font-mono ${
                    isCurrent || isHovered
                      ? 'bg-white/[0.14] border-[#E10600] shadow-md shadow-red-950/40 translate-y-[-1px]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-bold text-white">SEC #{sec.sector_index}</span>
                    <span>{sec.apex_distance_m}m</span>
                  </div>

                  {sec.nearest_corner && (
                    <div className="text-[9px] text-[#E10600] font-bold truncate my-0.5">
                      {sec.nearest_corner}
                    </div>
                  )}

                  {/* Driver Speeds */}
                  <div className="space-y-1 my-1.5 pt-1 border-t border-white/[0.04] text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400" style={{ color: driverA.color_hex }}>
                        {driverA.broadcast_name}
                      </span>
                      <span className={`font-bold ${isDriverAWinner ? 'text-white' : 'text-neutral-500'}`}>
                        {sec.driver_a_apex_speed_kmh}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400" style={{ color: driverB.color_hex }}>
                        {driverB.broadcast_name}
                      </span>
                      <span className={`font-bold ${!isDriverAWinner ? 'text-white' : 'text-neutral-500'}`}>
                        {sec.driver_b_apex_speed_kmh}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px]">
                    <span className="text-neutral-400">Δ {sec.delta_kmh}k</span>
                    <span
                      className="px-1.5 py-0.2 rounded-sm font-bold text-[9px]"
                      style={{
                        backgroundColor: `${sec.fastest_team_color}25`,
                        color: sec.fastest_team_color,
                      }}
                    >
                      {sec.fastest_driver_name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

