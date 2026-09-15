'use client';

import React, { useState, useEffect } from 'react';
import { f1Api, MOCK_CIRCUITS } from '@/lib/api';
import { Circuit } from '@/lib/types';
import { GlobeView } from '@/components/circuits/GlobeView';
import { TrackLayoutViewer } from '@/components/circuits/TrackLayoutViewer';
import { Compass, MapPin, Globe, Sparkles, Filter } from 'lucide-react';

export default function CircuitsPage() {
  const [circuits, setCircuits] = useState<Circuit[]>(MOCK_CIRCUITS);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>(MOCK_CIRCUITS[0]);
  const [filterRegion, setFilterRegion] = useState<string>('ALL');

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
    if (filterRegion === 'EUROPE') return ['ITA', 'BEL', 'GBR', 'MON', 'AUT', 'NED', 'ESP'].includes(c.country_code);
    if (filterRegion === 'AMERICAS') return ['BRA', 'USA', 'CAN', 'MEX'].includes(c.country_code);
    if (filterRegion === 'ASIA_MIDDLE_EAST') return ['JPN', 'SGP', 'AZE', 'BHR', 'SAU', 'QAT', 'UAE', 'CHN', 'AUS'].includes(c.country_code);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 f1-glass-card p-6 rounded-lg border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600]">
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
        <div className="flex items-center f1-pill p-1 gap-1 text-xs">
          <button
            onClick={() => setFilterRegion('ALL')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'ALL'
                ? 'bg-[#E10600] text-white font-bold shadow-md shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Tracks ({circuits.length})
          </button>
          <button
            onClick={() => setFilterRegion('EUROPE')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'EUROPE'
                ? 'bg-[#E10600] text-white font-bold shadow-md shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Europe
          </button>
          <button
            onClick={() => setFilterRegion('AMERICAS')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'AMERICAS'
                ? 'bg-[#E10600] text-white font-bold shadow-md shadow-red-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Americas
          </button>
          <button
            onClick={() => setFilterRegion('ASIA_MIDDLE_EAST')}
            className={`px-3 py-1 rounded-sm text-[11px] font-mono transition-all ${
              filterRegion === 'ASIA_MIDDLE_EAST'
                ? 'bg-[#E10600] text-white font-bold shadow-md shadow-red-600/30'
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
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E10600]' : 'text-neutral-500'}`} />
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
                  <span className="text-neutral-500">Record: {c.lap_record}</span>
                  <span className={`font-bold ${isSelected ? 'text-[#E10600]' : 'text-neutral-400'}`}>
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
