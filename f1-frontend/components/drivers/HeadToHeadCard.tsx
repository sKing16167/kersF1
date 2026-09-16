'use client';

import React, { useState, useEffect } from 'react';
import { f1Api, AVAILABLE_SEASONS } from '@/lib/api';
import { HeadToHeadComparison, Driver } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { Swords, Calendar } from 'lucide-react';

export function HeadToHeadCard() {
  const { driverA, driverB, setDriverA, setDriverB, drivers, season: storeSeason } = useTelemetryStore();
  const [selectedSeason, setSelectedSeason] = useState<number>(storeSeason || 2026);
  const [seasonDrivers, setSeasonDrivers] = useState<Driver[]>(drivers);
  const [h2h, setH2h] = useState<HeadToHeadComparison | null>(null);

  useEffect(() => {
    if (storeSeason) setSelectedSeason(storeSeason);
  }, [storeSeason]);

  // Load authentic drivers for selected season
  useEffect(() => {
    async function loadSeasonDrivers() {
      const d = await f1Api.getDrivers(selectedSeason);
      if (d && d.length > 0) {
        setSeasonDrivers(d);
        if (!d.some((item) => item.id === driverA.id)) {
          setDriverA(d[0]);
        }
        if (!d.some((item) => item.id === driverB.id)) {
          setDriverB(d[1] || d[0]);
        }
      }
    }
    loadSeasonDrivers();
  }, [selectedSeason]);

  useEffect(() => {
    async function loadComparison() {
      const data = await f1Api.getHeadToHead(driverA.id, driverB.id, selectedSeason);
      setH2h(data);
    }
    loadComparison();
  }, [driverA.id, driverB.id, selectedSeason]);

  return (
    <div className="w-full f1-glass-card p-6 rounded-lg flex flex-col gap-5 border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
            <Swords className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white tracking-tight font-mono uppercase">
              Driver Head-to-Head Comparison
            </h2>
            <p className="text-[10px] font-mono text-neutral-400">
              Direct telemetry & verified championship records
            </p>
          </div>
        </div>

        {/* Season Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#121622] border border-white/[0.12] text-xs">
          <Calendar className="w-3.5 h-3.5 text-[#FF1801]" />
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            aria-label="Head-to-Head Season"
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

      {/* Driver Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-md bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-8 rounded-none"
              style={{ backgroundColor: h2h?.driver_a.color_hex || driverA.color_hex }}
            />
            <div>
              <div className="font-bold text-sm text-white font-mono">{h2h?.driver_a.full_name || driverA.full_name}</div>
              <div className="text-[10px] text-neutral-400 font-mono">
                {h2h?.driver_a.team_name || driverA.team_name} • #{h2h?.driver_a.driver_number || driverA.driver_number}
              </div>
            </div>
          </div>

          <select
            value={driverA.id}
            onChange={(e) => {
              const d = seasonDrivers.find((item) => item.id === Number(e.target.value));
              if (d) setDriverA(d);
            }}
            aria-label="Select Driver A"
            className="f1-pill px-3 py-1.5 text-xs text-neutral-300 bg-transparent focus:outline-none cursor-pointer font-mono"
          >
            {seasonDrivers.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#0D1117]">
                {d.broadcast_name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-md bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-8 rounded-none"
              style={{ backgroundColor: h2h?.driver_b.color_hex || driverB.color_hex }}
            />
            <div>
              <div className="font-bold text-sm text-white font-mono">{h2h?.driver_b.full_name || driverB.full_name}</div>
              <div className="text-[10px] text-neutral-400 font-mono">
                {h2h?.driver_b.team_name || driverB.team_name} • #{h2h?.driver_b.driver_number || driverB.driver_number}
              </div>
            </div>
          </div>

          <select
            value={driverB.id}
            onChange={(e) => {
              const d = seasonDrivers.find((item) => item.id === Number(e.target.value));
              if (d) setDriverB(d);
            }}
            aria-label="Select Driver B"
            className="f1-pill px-3 py-1.5 text-xs text-neutral-300 bg-transparent focus:outline-none cursor-pointer font-mono"
          >
            {seasonDrivers.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#0D1117]">
                {d.broadcast_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics */}
      {h2h && (
        <div className="space-y-2.5">
          <MetricBar
            label="Qualifying Battles"
            valA={h2h.qualifying_head_to_head.driver_a_ahead}
            valB={h2h.qualifying_head_to_head.driver_b_ahead}
            colorA={driverA.color_hex}
            colorB={driverB.color_hex}
          />
          <MetricBar
            label="Race Finishes Ahead"
            valA={h2h.race_head_to_head.driver_a_ahead}
            valB={h2h.race_head_to_head.driver_b_ahead}
            colorA={driverA.color_hex}
            colorB={driverB.color_hex}
          />
          <MetricBar
            label="Championship Points"
            valA={h2h.points.driver_a}
            valB={h2h.points.driver_b}
            colorA={driverA.color_hex}
            colorB={driverB.color_hex}
            suffix=" PTS"
          />
          <MetricBar
            label="Race Victories"
            valA={h2h.wins.driver_a}
            valB={h2h.wins.driver_b}
            colorA={driverA.color_hex}
            colorB={driverB.color_hex}
          />
          <MetricBar
            label="Avg Minimum Apex Velocity"
            valA={h2h.avg_apex_speed_kmh.driver_a}
            valB={h2h.avg_apex_speed_kmh.driver_b}
            colorA={driverA.color_hex}
            colorB={driverB.color_hex}
            suffix=" km/h"
          />
        </div>
      )}
    </div>
  );
}

function MetricBar({
  label,
  valA,
  valB,
  colorA,
  colorB,
  suffix = '',
}: {
  label: string;
  valA: number;
  valB: number;
  colorA: string;
  colorB: string;
  suffix?: string;
}) {
  const total = (valA + valB) || 1;
  const pctA = Math.round((valA / total) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06] space-y-1.5 font-mono">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-white" style={{ color: colorA }}>
          {valA}{suffix}
        </span>
        <span className="text-neutral-400 text-[10px] uppercase tracking-wider font-bold">{label}</span>
        <span className="font-bold text-white" style={{ color: colorB }}>
          {valB}{suffix}
        </span>
      </div>

      <div className="w-full h-1.5 rounded-none overflow-hidden flex gap-0.5 bg-white/[0.06]">
        <div
          className="h-full rounded-none transition-all duration-300"
          style={{ width: `${pctA}%`, backgroundColor: colorA }}
        />
        <div
          className="h-full rounded-none transition-all duration-300"
          style={{ width: `${pctB}%`, backgroundColor: colorB }}
        />
      </div>
    </div>
  );
}
