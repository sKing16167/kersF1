'use client';

import React, { useState, useEffect } from 'react';
import { f1Api, MOCK_DRIVERS } from '@/lib/api';
import { Driver } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { HeadToHeadCard } from '@/components/drivers/HeadToHeadCard';
import { StandingsTable } from '@/components/drivers/StandingsTable';
import { Users, Award } from 'lucide-react';

export default function DriversHubPage() {
  const { setDriverA, setDriverB } = useTelemetryStore();
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);

  useEffect(() => {
    async function loadData() {
      const d = await f1Api.getDrivers();
      if (d.length > 0) setDrivers(d);
    }
    loadData();
  }, []);

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
              Complete modern grid lineup and direct head-to-head comparison telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Head to Head Card */}
      <HeadToHeadCard />

      {/* Driver Grid */}
      <div className="f1-glass-card p-6 rounded-lg space-y-4 border border-white/[0.08] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#FF1801]/10 border border-[#FF1801]/25 flex items-center justify-center text-[#FF1801]">
              <Award className="w-4 h-4 stroke-[2]" />
            </div>
            <h2 className="font-bold text-xs text-white font-mono uppercase">
              Official World Championship Grid Lineup
            </h2>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">20 Drivers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="p-3.5 rounded-md bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                  <span>{d.country_code}</span>
                  <span className="font-bold text-white">#{d.driver_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-3.5 rounded-none"
                    style={{ backgroundColor: d.color_hex }}
                  />
                  <h3 className="font-bold text-xs text-white truncate font-mono">
                    {d.full_name}
                  </h3>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5 ml-3.5 truncate">{d.team_name}</p>
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
      </div>

      {/* Standings */}
      <StandingsTable />
    </div>
  );
}
