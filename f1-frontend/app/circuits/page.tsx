'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { f1Api, MOCK_CIRCUITS } from '@/lib/api';
import { Circuit } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { TrackLayoutViewer } from '@/components/circuits/TrackLayoutViewer';
import { Compass, MapPin, Globe, Filter } from 'lucide-react';

const GlobeView = dynamic(
  () => import('@/components/circuits/GlobeView').then((mod) => mod.GlobeView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[480px] f1-glass-card rounded-xl flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin flex items-center justify-center">
          <Globe className="w-6 h-6 text-[#00E5FF]/60 animate-pulse" />
        </div>
        <div className="text-center space-y-1 font-mono">
          <div className="text-sm font-bold text-white tracking-wide">
            INITIALIZING 3D REVOLVING EARTH GLOBE
          </div>
          <p className="text-xs text-neutral-400">
            Calibrating orbital projection for 39 global Grand Prix circuits...
          </p>
        </div>
      </div>
    ),
  }
);

export default function CircuitsPage() {
  const [circuits, setCircuits] = useState<Circuit[]>(MOCK_CIRCUITS);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>(MOCK_CIRCUITS[0]);
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const { circuitRecordOverrides } = useTelemetryStore();

  useEffect(() => {
    async function loadData() {
      const data = await f1Api.getCircuits();
      if (data.length > 0) {
        setCircuits(data);
      }
    }
    loadData();
  }, []);

  const filteredCircuits = circuits.filter((c) => {
    if (filterRegion === 'ALL') return true;
    if (filterRegion === 'EUROPE') return ['ITA', 'BEL', 'GBR', 'MON', 'AUT', 'NED', 'ESP', 'FRA', 'GER', 'TUR', 'POR', 'RUS', 'HUN'].includes(c.country_code);
    if (filterRegion === 'AMERICAS') return ['BRA', 'USA', 'CAN', 'MEX'].includes(c.country_code);
    if (filterRegion === 'ASIA_MIDDLE_EAST') return ['JPN', 'SGP', 'AZE', 'BHR', 'SAU', 'QAT', 'UAE', 'CHN', 'AUS', 'MAL', 'IND', 'KOR'].includes(c.country_code);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 f1-glass-card p-6 rounded-lg border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
            <Globe className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Global Circuit Encyclopedia & Track Analysis
            </h1>
            <p className="text-xs text-neutral-400">
              Interactive 3D Earth tracking, optimal racing lines, corner apex telemetry, and DRS zones.
            </p>
          </div>
        </div>

        {/* Region Filter Pills */}
        <div className="flex items-center f1-pill p-1 gap-1 text-xs overflow-x-auto no-scrollbar max-w-full shrink-0">
          <button
            onClick={() => setFilterRegion('ALL')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'ALL'
                ? 'bg-[#FF1801] text-white font-bold shadow-md shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Tracks ({circuits.length})
          </button>
          <button
            onClick={() => setFilterRegion('EUROPE')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'EUROPE'
                ? 'bg-[#FF1801] text-white font-bold shadow-md shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Europe
          </button>
          <button
            onClick={() => setFilterRegion('AMERICAS')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'AMERICAS'
                ? 'bg-[#FF1801] text-white font-bold shadow-md shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Americas
          </button>
          <button
            onClick={() => setFilterRegion('ASIA_MIDDLE_EAST')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'ASIA_MIDDLE_EAST'
                ? 'bg-[#FF1801] text-white font-bold shadow-md shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Asia & Pacific
          </button>
        </div>
      </div>

      {/* 3D Revolving Earth Globe Section */}
      <GlobeView
        circuits={circuits}
        selectedCircuit={selectedCircuit}
        onSelectCircuit={(c) => setSelectedCircuit(c)}
      />

      {/* Track Layout & Optimal Racing Lines Viewer */}
      {selectedCircuit && <TrackLayoutViewer circuit={selectedCircuit} />}

      {/* Circuit Catalog Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-xs text-neutral-400 uppercase tracking-wider font-mono">
            Select Track ({filteredCircuits.length} Circuits)
          </h3>
          <span className="text-[10px] text-neutral-500 font-mono">
            Click any circuit to fly 3D Earth and load optimal lines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCircuits.map((c) => {
            const isSelected = selectedCircuit?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCircuit(c)}
                className={`p-5 rounded-lg cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'ios-card-selected'
                    : 'f1-glass-card'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF1801]' : 'text-neutral-500'}`} />
                      <span>{c.location}, {c.country}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.08] text-neutral-300">
                      {c.length_km} KM
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-white font-mono">{c.circuit_name}</h4>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-md bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[9px] text-neutral-500">CORNERS</span>
                      <div className="font-semibold text-white mt-0.5">{c.corners_count} Turns</div>
                    </div>
                    <div className="p-2 rounded-md bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[9px] text-neutral-500">THROTTLE</span>
                      <div className="font-semibold text-emerald-300 mt-0.5">{c.full_throttle_pct}%</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500">Record: {circuitRecordOverrides[c.id]?.lap_record || c.lap_record}</span>
                  <span className={`font-bold ${isSelected ? 'text-[#FF1801]' : 'text-neutral-400'}`}>
                    {isSelected ? 'ACTIVE VIEW' : 'INSPECT'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
