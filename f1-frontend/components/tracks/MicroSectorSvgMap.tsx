'use client';

import React, { useState, useEffect } from 'react';
import { Circuit, MicroSector, TrackMicroSectorsResponse } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { MapPin } from 'lucide-react';

interface MicroSectorSvgMapProps {
  circuit: Circuit;
  microSectorData: TrackMicroSectorsResponse;
  selectedSector?: MicroSector | null;
  onSelectSector: (sector: MicroSector) => void;
}

export function MicroSectorSvgMap({
  circuit,
  microSectorData,
  selectedSector,
  onSelectSector,
}: MicroSectorSvgMapProps) {
  const { activeDistanceM, setActiveDistanceM, driverA, driverB } = useTelemetryStore();

  const { sectors, total_distance_m } = microSectorData;
  const activeSector = selectedSector || (sectors && sectors.length > 0 ? sectors[0] : null);

  // Dynamically calculate 60 accurate path segments along the true SVG path of ANY of the 23 circuits
  const [pathSegments, setPathSegments] = useState<
    Array<{
      sector: MicroSector;
      pathD: string;
      color: string;
      midPoint: { x: number; y: number };
    }>
  >([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svgPath.setAttribute('d', circuit.svg_path);
      const totalLen = svgPath.getTotalLength();

      if (!totalLen || totalLen === 0) return;

      const count = sectors.length || 60;
      const segments: Array<{
        sector: MicroSector;
        pathD: string;
        color: string;
        midPoint: { x: number; y: number };
      }> = [];

      for (let i = 0; i < count; i++) {
        const sec = sectors[i];
        const lenStart = (i / count) * totalLen;
        const lenEnd = ((i + 1) / count) * totalLen;

        // Sample multi-point smooth bezier arc between start and end of micro-sector
        const p0 = svgPath.getPointAtLength(lenStart);
        const p1 = svgPath.getPointAtLength(lenStart + (lenEnd - lenStart) * 0.33);
        const p2 = svgPath.getPointAtLength(lenStart + (lenEnd - lenStart) * 0.66);
        const p3 = svgPath.getPointAtLength(lenEnd);
        const mid = svgPath.getPointAtLength((lenStart + lenEnd) / 2);

        const pathD = `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} C ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}, ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`;

        segments.push({
          sector: sec,
          pathD,
          color: sec.fastest_team_color || '#FF8000',
          midPoint: { x: mid.x, y: mid.y },
        });
      }

      setPathSegments(segments);
    } catch (err) {
      console.error('Failed to sample circuit path segments:', err);
    }
  }, [circuit.svg_path, sectors]);

  // Active car scrubber marker
  const activeCarIndex = Math.min(
    59,
    Math.max(0, Math.floor((activeDistanceM / (total_distance_m || 5793)) * 60))
  );
  const activeSegment = pathSegments[activeCarIndex];

  // Sector win tallies for Driver A vs Driver B
  const driverAWins = sectors.filter((s) => s.fastest_driver_id === driverA.id).length;
  const driverBWins = sectors.filter((s) => s.fastest_driver_id === driverB.id).length;

  return (
    <div className="w-full f1-glass-card p-6 rounded-lg flex flex-col gap-5 border border-white/[0.08] shadow-2xl">
      {/* Header & Matchup Tally */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#FF1801]/10 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
            <MapPin className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#FF1801] font-bold uppercase">{circuit.country}</span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs font-mono text-neutral-400">{circuit.length_km} KM</span>
            </div>
            <h3 className="font-bold text-base text-white tracking-tight font-mono">
              {circuit.circuit_name} — 60 Micro-Sectors
            </h3>
          </div>
        </div>

        {/* Driver Duel Win Tally Bar */}
        <div className="flex items-center gap-3 f1-pill px-4 py-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none shadow-sm" style={{ backgroundColor: driverA.color_hex }} />
            <span className="text-white font-bold">{driverA.broadcast_name}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">
              {driverAWins} wins
            </span>
          </div>

          <span className="text-neutral-500 font-bold">VS</span>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none shadow-sm" style={{ backgroundColor: driverB.color_hex }} />
            <span className="text-white font-bold">{driverB.broadcast_name}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">
              {driverBWins} wins
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Track Canvas */}
      <div className="relative w-full min-h-[440px] md:min-h-[500px] rounded-lg bg-[#05070B] border border-white/[0.06] flex items-center justify-center p-4 overflow-hidden select-none">
        {/* Subtle Ambient Track Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[radial-gradient(circle,rgba(225,6,0,0.08)_0%,transparent_70%)] pointer-events-none" />

        <svg
          viewBox={circuit.view_box || '0 0 500 500'}
          className="w-full h-auto max-h-[460px] select-none"
        >
          <defs>
            {/* Sector Glow Filter */}
            <filter id="sectorGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFFFFF" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. Underlying Base Asphalt Track Ribbon */}
          <path
            d={circuit.svg_path}
            fill="none"
            stroke="#121722"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. Precision 60 Colored Micro-Sector Segments */}
          {pathSegments.map((seg, i) => {
            const isSelected = activeSector?.sector_index === seg.sector.sector_index;
            return (
              <path
                key={`micro-seg-${i}`}
                d={seg.pathD}
                fill="none"
                stroke={seg.color}
                strokeWidth={isSelected ? 9 : 5.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-150 hover:brightness-125"
                style={{
                  filter: isSelected ? 'url(#sectorGlow)' : undefined,
                  opacity: activeSector ? (isSelected ? 1 : 0.75) : 0.95,
                }}
                onClick={() => {
                  onSelectSector(seg.sector);
                  setActiveDistanceM(seg.sector.apex_distance_m);
                }}
              />
            );
          })}

          {/* 3. True Named Corner Turn Nodes */}
          {circuit.corners &&
            circuit.corners.map((corner, i) => {
              let cx = corner.x;
              let cy = corner.y;
              if (cx === undefined || cy === undefined) {
                const angle = (i / (circuit.corners.length || 1)) * Math.PI * 2;
                cx = Math.sin(angle) * 160 + 250;
                cy = Math.cos(angle) * 160 + 250;
              }

              return (
                <g
                  key={`corner-node-${corner.corner_number}`}
                  transform={`translate(${cx}, ${cy})`}
                  className="pointer-events-none select-none"
                >
                  <circle
                    r={4}
                    fill="#080B11"
                    stroke="#FFFFFF"
                    strokeWidth={1}
                  />
                  <text
                    x={7}
                    y={3}
                    fill="#FFFFFF"
                    fontSize="8px"
                    fontFamily="monospace"
                    fontWeight="bold"
                    opacity={0.85}
                  >
                    T{corner.corner_number}
                  </text>
                </g>
              );
            })}

          {/* 4. Start / Finish Line Marker */}
          {circuit.start_finish && (
            <g transform={`translate(${circuit.start_finish.x}, ${circuit.start_finish.y})`}>
              <line x1="-3" y1="-8" x2="3" y2="8" stroke="#FFFFFF" strokeWidth="2.5" />
              <text
                x={8}
                y={3}
                fill="#FFFFFF"
                fontSize="8px"
                fontFamily="monospace"
                fontWeight="bold"
              >
                S/F
              </text>
            </g>
          )}

          {/* 5. Live Telemetry Scrubber Car Marker */}
          {activeSegment && (
            <g transform={`translate(${activeSegment.midPoint.x}, ${activeSegment.midPoint.y})`}>
              <circle r={10} fill="#FFFFFF" opacity={0.25} className="animate-ping" />
              <circle r={5} fill="#FFFFFF" stroke="#FF1801" strokeWidth={1.5} />
            </g>
          )}
        </svg>

        {/* Active Selected Telemetry Glass Card */}
        {activeSector && (
          <div className="absolute top-4 right-4 f1-glass p-4 rounded-lg min-w-[240px] text-xs space-y-2 border border-white/[0.14] shadow-2xl z-20 font-mono">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 text-[11px] text-neutral-400">
              <span className="font-bold text-white">MICRO-SECTOR #{activeSector.sector_index} / 60</span>
              <span className="text-neutral-300 font-bold">{activeSector.apex_distance_m}m</span>
            </div>

            {activeSector.nearest_corner && (
              <div className="text-[10px] text-[#FF1801] font-bold">
                APEX: {activeSector.nearest_corner}
              </div>
            )}

            {/* Matchup Comparison */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-none" style={{ backgroundColor: driverA.color_hex }} />
                  {driverA.broadcast_name}
                </span>
                <span className={`font-bold ${activeSector.fastest_driver_id === driverA.id ? 'text-white' : 'text-neutral-400'}`}>
                  {activeSector.driver_a_apex_speed_kmh} km/h
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-none" style={{ backgroundColor: driverB.color_hex }} />
                  {driverB.broadcast_name}
                </span>
                <span className={`font-bold ${activeSector.fastest_driver_id === driverB.id ? 'text-white' : 'text-neutral-400'}`}>
                  {activeSector.driver_b_apex_speed_kmh} km/h
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-[10px]">
              <span className="text-neutral-400">Advantage:</span>
              <span className="font-bold text-emerald-400">
                {activeSector.fastest_driver_name} (+{activeSector.delta_kmh} km/h)
              </span>
            </div>

            <div className="pt-1 text-[9px] text-neutral-500 text-center">
              Click any sector or corner to inspect
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
