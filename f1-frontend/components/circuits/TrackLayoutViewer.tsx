'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Circuit, CornerDetail } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { UpdateLapRecordModal } from './UpdateLapRecordModal';
import {
  Timer,
  Gauge,
  Activity,
  Wind,
  Layers,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface TrackLayoutViewerProps {
  circuit: Circuit;
}

export function TrackLayoutViewer({ circuit }: TrackLayoutViewerProps) {
  const [selectedCorner, setSelectedCorner] = useState<CornerDetail | null>(
    circuit.corners[0] || null
  );
  const [showOptimalLine, setShowOptimalLine] = useState<boolean>(true);
  const [showBrakingZones, setShowBrakingZones] = useState<boolean>(true);
  const [showDrsZones, setShowDrsZones] = useState<boolean>(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const { circuitRecordOverrides } = useTelemetryStore();

  const activeRecord = circuitRecordOverrides[circuit.id];
  const lapRecord = activeRecord?.lap_record || circuit.lap_record;
  const lapDriver = activeRecord?.lap_record_driver || circuit.lap_record_driver;
  const lapYear = activeRecord?.lap_record_year || circuit.lap_record_year;
  const lapTeam = activeRecord?.lap_record_team || circuit.lap_record_team;
  const isCustomUpdated = Boolean(activeRecord);

  // Synchronize active corner when circuit changes
  React.useEffect(() => {
    if (circuit && circuit.corners && circuit.corners.length > 0) {
      setSelectedCorner(circuit.corners[0]);
    }
  }, [circuit]);

  return (
    <div className="w-full ios-card p-6 rounded-lg space-y-6">
      {/* Header with Title & Telemetry Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#E10600] font-semibold">{circuit.country}</span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs font-mono text-neutral-400">First GP: {circuit.first_grand_prix_year}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight mt-0.5">
            {circuit.circuit_name}
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl mt-1 leading-relaxed">
            {circuit.description}
          </p>
        </div>

        {/* Action Button to launch Telemetry Arena */}
        <Link
          href="/ghosting-arena"
          className="px-4 py-2 rounded-md bg-[#E10600] hover:bg-[#FF2800] text-white text-xs font-bold font-mono flex items-center gap-2 transition-all active:scale-95"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Launch Ghosting Arena</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Track Layout & Interactive SVG Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Track Canvas View */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold px-2">
              Layer Overlays:
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowOptimalLine(!showOptimalLine)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  showOptimalLine
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                    : 'bg-white/[0.04] text-neutral-500 border border-transparent'
                }`}
              >
                Optimal Racing Line
              </button>
              <button
                onClick={() => setShowBrakingZones(!showBrakingZones)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  showBrakingZones
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'bg-white/[0.04] text-neutral-500 border border-transparent'
                }`}
              >
                Braking Zones
              </button>
              <button
                onClick={() => setShowDrsZones(!showDrsZones)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  showDrsZones
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-white/[0.04] text-neutral-500 border border-transparent'
                }`}
              >
                DRS Zones ({circuit.drs_zones})
              </button>
            </div>
          </div>

          {/* Circuit Interactive SVG */}
          <div className="relative w-full h-[400px] md:h-[440px] rounded-lg bg-[#07090E] border border-white/[0.08] flex items-center justify-center overflow-hidden group">
            <svg
              viewBox={circuit.view_box || '0 0 500 500'}
              className="w-full h-full max-h-[420px] select-none p-4"
            >
              <defs>
                <pattern id="checkeredFlag" width="6" height="6" patternUnits="userSpaceOnUse">
                  <rect width="3" height="3" fill="#FFFFFF" />
                  <rect x="3" width="3" height="3" fill="#111111" />
                  <rect y="3" width="3" height="3" fill="#111111" />
                  <rect x="3" width="3" height="3" fill="#FFFFFF" />
                </pattern>
              </defs>

              {/* Outer Track Curb Boundary */}
              <path
                d={circuit.svg_path}
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Main Matte Asphalt Track Ribbon */}
              <path
                d={circuit.svg_path}
                fill="none"
                stroke="#121620"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Track Center White Line */}
              <path
                d={circuit.svg_path}
                fill="none"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth={0.8}
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Optimal Racing Line (Gold/Yellow Spline) */}
              {showOptimalLine && (
                <path
                  d={circuit.optimal_line_svg || circuit.svg_path}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  opacity={0.9}
                />
              )}

              {/* Start/Finish Line with Checkered Flag Pattern & Directional Arrows */}
              {circuit.start_finish && (
                <g transform={`translate(${circuit.start_finish.x}, ${circuit.start_finish.y})`}>
                  {/* Checkered Finish Gate */}
                  <rect x={-4} y={-8} width={8} height={16} rx={1} fill="url(#checkeredFlag)" stroke="#FFFFFF" strokeWidth={1} />
                  
                  {/* Directional Chevron Arrows */}
                  <path d="M 10 -3 L 14 0 L 10 3 M 15 -3 L 19 0 L 15 3" stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.85} />

                  <text
                    x={circuit.start_finish.label_x ?? 24}
                    y={circuit.start_finish.label_y ?? 2.5}
                    fill="#FFFFFF"
                    fontSize="7px"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="select-none drop-shadow-md"
                  >
                    START / FINISH
                  </text>
                </g>
              )}

              {/* Official Corner Badges with Leading Zeros (01, 02, 03...) */}
              {circuit.corners.map((corner, i) => {
                let cx = corner.x;
                let cy = corner.y;

                if (cx === undefined || cy === undefined) {
                  const angle = (i / (circuit.corners.length || 1)) * Math.PI * 2;
                  cx = Math.sin(angle) * 160 + 250;
                  cy = Math.cos(angle) * 160 + 250;
                }

                const isSelected = selectedCorner?.corner_number === corner.corner_number;
                const isBraking = showBrakingZones && corner.brake_zone;
                const isDrs = showDrsZones && corner.drs_zone;
                const formattedNumber = corner.corner_number < 10 ? `0${corner.corner_number}` : `${corner.corner_number}`;

                return (
                  <g
                    key={corner.corner_number}
                    transform={`translate(${cx}, ${cy})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedCorner(corner)}
                  >
                    {/* Clean Solid Red Line Border indicator when selected (No ping animation/flashing) */}
                    {isSelected && (
                      <circle
                        r={13}
                        fill="none"
                        stroke="#E10600"
                        strokeWidth={1.5}
                      />
                    )}

                    {/* Braking Halo when Braking Zones overlay is ON */}
                    {isBraking && !isSelected && (
                      <circle
                        r={11}
                        fill="none"
                        stroke="#E10600"
                        strokeWidth={1}
                        strokeDasharray="2.5 2.5"
                        opacity={0.8}
                      />
                    )}

                    {/* DRS Halo when DRS overlay is ON */}
                    {isDrs && !isSelected && (
                      <circle
                        r={11}
                        fill="none"
                        stroke="#00FF88"
                        strokeWidth={1}
                        strokeDasharray="3 1.5"
                        opacity={0.8}
                      />
                    )}

                    {/* Outer Badge Ring */}
                    <circle
                      r={isSelected ? 9 : 7.5}
                      fill={
                        isSelected
                          ? '#E10600'
                          : isBraking
                          ? '#2A0B0E'
                          : isDrs
                          ? '#062419'
                          : '#0A0D14'
                      }
                      stroke={
                        isSelected
                          ? '#FFFFFF'
                          : isBraking
                          ? '#FF3B30'
                          : isDrs
                          ? '#00FF88'
                          : 'rgba(255, 255, 255, 0.6)'
                      }
                      strokeWidth={isSelected ? 1.5 : 1}
                      className="transition-all duration-150"
                    />

                    {/* Corner Number Text */}
                    <text
                      y={2.5}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={isSelected ? '7.5px' : '6.5px'}
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="select-none pointer-events-none"
                    >
                      {formattedNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Corner Apex Speed Inspector & Technical Profile */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Corner Deep-Dive Card */}
          {selectedCorner && (
            <div className="p-4 rounded-lg bg-[#0A0D14] border border-[#E10600] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div>
                  <span className="text-[10px] font-mono text-[#E10600] font-bold">
                    TURN {selectedCorner.corner_number}
                  </span>
                  <h4 className="font-bold text-sm text-white font-mono">{selectedCorner.corner_name}</h4>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
                  Gear {selectedCorner.gear}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-500">APEX SPEED</span>
                  <div className="font-bold text-amber-300 text-sm mt-0.5">
                    {selectedCorner.min_speed_kmh} km/h
                  </div>
                </div>

                <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-neutral-500">LATERAL G</span>
                  <div className="font-bold text-cyan-300 text-sm mt-0.5">
                    {selectedCorner.lateral_g} G
                  </div>
                </div>
              </div>

              {selectedCorner.notes && (
                <p className="text-[11px] text-neutral-400 font-mono italic bg-black/40 p-2.5 rounded-md border border-white/[0.06]">
                  &ldquo;{selectedCorner.notes}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Track Technical Telemetry Indices */}
          <div className="p-4 rounded-lg bg-[#0A0D14] border border-white/[0.08] space-y-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">
              Aerodynamic & Tyre Demands
            </span>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Full Throttle:</span>
                <span className="font-bold text-white">{circuit.full_throttle_pct}% of lap</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Downforce Level:</span>
                <span className="font-bold text-cyan-300">{circuit.downforce_level}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Brake Severity:</span>
                <span className="font-bold text-rose-400">{circuit.brake_wear_index}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Tyre Stress:</span>
                <span className="font-bold text-amber-300">Level {circuit.tyre_stress_level} / 5</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Gear Shifts:</span>
                <span className="font-bold text-white">{circuit.gear_shifts_per_lap} shifts / lap</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Pit Loss Delta:</span>
                <span className="font-bold text-neutral-300">{circuit.pit_loss_time_sec}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lap Record & Circuit Specs Footer with Real-Time Updation Provision */}
      {lapRecord && (
        <div className="p-4 rounded-lg bg-[#0A0D14]/80 border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Official Lap Record</span>
                {isCustomUpdated && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#FF1801]/20 border border-[#FF1801]/40 text-[#FF1801]">
                    REAL-TIME UPDATED
                  </span>
                )}
              </div>
              <div className="font-mono text-base font-bold text-white">
                {lapRecord} <span className="text-xs font-normal text-neutral-400 font-mono">({lapYear})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs font-mono text-neutral-300">
              <div>{lapDriver}</div>
              <div className="text-[10px] text-neutral-500">{lapTeam}</div>
            </div>

            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-[#FF1801]/20 hover:border-[#FF1801]/40 border border-white/[0.12] text-xs font-mono font-bold text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
              title="Calibrate or update official lap record in real time"
            >
              <Zap className="w-3 h-3 text-[#FF1801]" />
              Update Record
            </button>
          </div>
        </div>
      )}

      {/* Real-time Lap Record Updation Modal */}
      <UpdateLapRecordModal
        circuit={circuit}
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />
    </div>
  );
}
