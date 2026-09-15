'use client';

import React, { useState } from 'react';
import { SpotlightNavbar, NavItem } from '@/components/ui/spotlight-navbar';
import { GlowBorderCard } from '@/components/ui/glow-border-card';
import {
  Activity,
  Gauge,
  Zap,
  Flag,
  RotateCcw,
  Compass,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CircuitMeta {
  id: string;
  name: string;
  location: string;
  lengthKm: string;
  turns: number;
  lapRecord: string;
  driverRecord: string;
  svgPath: string;
  corners: { id: number; name: string; x: number; y: number; speed: string; gear: number }[];
}

const CIRCUITS: CircuitMeta[] = [
  {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    location: 'Monza, Italy',
    lengthKm: '5.793 km',
    turns: 11,
    lapRecord: '1:21.046',
    driverRecord: 'Rubens Barrichello (2004)',
    svgPath: 'M 140 180 L 480 180 Q 560 180 580 230 Q 600 280 560 320 L 450 350 Q 420 360 400 390 L 370 450 Q 350 490 310 480 L 220 460 Q 180 450 160 410 L 130 330 Q 110 270 110 230 Z',
    corners: [
      { id: 1, name: 'Variante del Rettifilo', x: 480, y: 180, speed: '78 km/h', gear: 2 },
      { id: 4, name: 'Curva Grande', x: 580, y: 250, speed: '298 km/h', gear: 7 },
      { id: 6, name: 'Variante della Roggia', x: 450, y: 350, speed: '118 km/h', gear: 3 },
      { id: 8, name: 'Curve di Lesmo', x: 370, y: 450, speed: '182 km/h', gear: 4 },
      { id: 10, name: 'Variante Ascari', x: 220, y: 460, speed: '210 km/h', gear: 5 },
      { id: 11, name: 'Curva Parabolica', x: 130, y: 330, speed: '195 km/h', gear: 5 },
    ],
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    location: 'Silverstone, United Kingdom',
    lengthKm: '5.891 km',
    turns: 18,
    lapRecord: '1:27.097',
    driverRecord: 'Max Verstappen (2020)',
    svgPath: 'M 160 220 L 340 160 Q 410 140 460 170 L 580 260 Q 620 300 590 340 L 480 400 Q 430 430 380 400 L 280 450 Q 220 470 180 420 L 140 330 Z',
    corners: [
      { id: 1, name: 'Abbey', x: 340, y: 160, speed: '275 km/h', gear: 7 },
      { id: 3, name: 'Village', x: 460, y: 170, speed: '105 km/h', gear: 3 },
      { id: 9, name: 'Copse', x: 580, y: 260, speed: '288 km/h', gear: 8 },
      { id: 11, name: 'Maggotts & Becketts', x: 480, y: 400, speed: '292 km/h', gear: 7 },
      { id: 15, name: 'Stowe', x: 280, y: 450, speed: '215 km/h', gear: 5 },
      { id: 18, name: 'Club', x: 160, y: 220, speed: '125 km/h', gear: 3 },
    ],
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    location: 'Stavelot, Belgium',
    lengthKm: '7.004 km',
    turns: 19,
    lapRecord: '1:46.286',
    driverRecord: 'Valtteri Bottas (2018)',
    svgPath: 'M 150 200 L 260 140 Q 320 120 360 150 L 520 220 Q 620 280 580 370 L 460 450 Q 380 480 300 440 L 200 380 Q 140 330 130 260 Z',
    corners: [
      { id: 1, name: 'La Source', x: 260, y: 140, speed: '72 km/h', gear: 2 },
      { id: 3, name: 'Eau Rouge / Raidillon', x: 360, y: 150, speed: '305 km/h', gear: 8 },
      { id: 7, name: 'Les Combes', x: 520, y: 220, speed: '142 km/h', gear: 4 },
      { id: 10, name: 'Pouhon', x: 460, y: 450, speed: '290 km/h', gear: 7 },
      { id: 14, name: 'Stavelot', x: 300, y: 440, speed: '240 km/h', gear: 6 },
      { id: 19, name: 'Bus Stop Chicane', x: 150, y: 200, speed: '85 km/h', gear: 2 },
    ],
  },
];

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Telemetry Arena', href: '#telemetry' },
  { label: 'Micro-Sectors', href: '#sectors' },
  { label: 'Ghosting', href: '#ghosting' },
  { label: 'Strategy', href: '#strategy' },
];

export default function Home() {
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitMeta>(CIRCUITS[0]);
  const [activeCorner, setActiveCorner] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center selection:bg-[#E10600] selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glow & Racing Grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Deep Red Radial Atmosphere */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.15)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/2 right-[-200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(225,6,0,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Minimal Engineering Dot / Line Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Sticky Top Navigation with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/50 border-b border-white/[0.08] px-4 md:px-8 py-3 flex items-center justify-between transition-all">
        {/* Left: KERS Iconic Brand Mark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(225,6,0,0.35)_0%,transparent_70%)]" />
            <svg viewBox="0 0 100 100" className="w-5 h-5 relative z-10">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="#E10600" strokeWidth="3" strokeDasharray="30 140" strokeLinecap="round" />
              <path d="M 30 24 L 42 24 L 42 76 L 30 76 Z" fill="#FFFFFF" />
              <line x1="26" y1="30" x2="26" y2="70" stroke="#E10600" strokeWidth="3" strokeLinecap="round" />
              <path d="M 46 48 L 72 24 L 86 24 L 56 52 Z" fill="#E10600" />
              <path d="M 52 46 L 86 76 L 72 76 L 44 54 Z" fill="#FFFFFF" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-widest text-white font-mono">
                <span className="text-[#E10600]">K</span>ERS
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono text-neutral-400 bg-white/[0.06] border border-white/[0.08]">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono tracking-tight">
              Formula 1 Telemetry
            </p>
          </div>
        </div>

        {/* Center: SpotlightNavbar Component */}
        <div className="hidden lg:flex items-center justify-center">
          <SpotlightNavbar
            className="pt-0"
            items={NAV_ITEMS}
            onItemClick={(item) => console.log('Navigated to', item.label)}
          />
        </div>

        {/* Right: Live Telemetry Status Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
            <span className="text-neutral-300 font-medium">LIVE TELEMETRY</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl px-4 md:px-8 py-8 md:py-12 flex flex-col items-center justify-center gap-8 relative z-10">
        {/* Title Header Section */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-[#E10600] font-bold">FIA HOMOLOGATED</span>
              <span>//</span>
              <span>2024 SEASON CALIBRATION</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{selectedCircuit.name}</span>
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              {selectedCircuit.location} • {selectedCircuit.lengthKm} • {selectedCircuit.turns} Turns
            </p>
          </div>

          {/* Circuit Switcher Selector Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            {CIRCUITS.map((circuit) => (
              <button
                key={circuit.id}
                onClick={() => {
                  setSelectedCircuit(circuit);
                  setActiveCorner(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-medium transition-all ${
                  selectedCircuit.id === circuit.id
                    ? 'bg-[#E10600] text-white shadow-lg shadow-red-900/40'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {circuit.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Centerpiece: Glowing Border Card containing the F1 Track Visualization */}
        <div className="w-full flex justify-center">
          <GlowBorderCard
            width="100%"
            height="520px"
            borderRadius="1.5rem"
            colorPreset="custom"
            gradientColors={[
              '#E10600',
              '#FF2800',
              '#FF6000',
              '#FFAA00',
              '#FF1801',
              '#E10600',
              '#900000',
              '#FF2800',
              '#FF5000',
              '#E10600',
            ]}
            borderWidth="1.25em"
            blurAmount="0.85em"
            animationDuration={6}
            className="bg-[#0A0D14]/90 border border-white/[0.08] shadow-2xl"
          >
            <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 select-none">
              {/* Card Top Overlay: Telemetry HUD Header */}
              <div className="flex items-start justify-between w-full z-20">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
                    <span>GPS TRACK VECTOR</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-white tracking-wide">
                    {selectedCircuit.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-right">
                    <span className="block text-[10px] font-mono text-neutral-400">LAP RECORD</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {selectedCircuit.lapRecord}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center: Interactive SVG F1 Track Visualization Placeholder */}
              <div className="relative w-full flex-1 flex items-center justify-center my-2">
                <svg
                  viewBox="0 0 700 550"
                  className="w-full h-full max-h-[340px] drop-shadow-[0_0_25px_rgba(225,6,0,0.45)]"
                >
                  <defs>
                    <linearGradient id="trackNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#E10600" />
                      <stop offset="100%" stopColor="#FF3000" />
                    </linearGradient>
                    <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Base Track Ambient Underlay */}
                  <path
                    d={selectedCircuit.svgPath}
                    fill="none"
                    stroke="#1E2330"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Racing Surface Path */}
                  <path
                    d={selectedCircuit.svgPath}
                    fill="none"
                    stroke="url(#trackNeonGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#trackGlow)"
                    className="transition-all duration-500"
                  />

                  {/* Start / Finish Line Vector */}
                  <line x1="140" y1="170" x2="140" y2="190" stroke="#FFFFFF" strokeWidth="4" />

                  {/* Corner Speed Apex Nodes */}
                  {selectedCircuit.corners.map((corner) => {
                    const isHovered = activeCorner === corner.id;
                    return (
                      <g
                        key={corner.id}
                        className="cursor-pointer transition-transform"
                        onMouseEnter={() => setActiveCorner(corner.id)}
                        onMouseLeave={() => setActiveCorner(null)}
                      >
                        {/* Outer Pulse */}
                        <circle
                          cx={corner.x}
                          cy={corner.y}
                          r={isHovered ? 14 : 9}
                          fill={isHovered ? '#E10600' : 'rgba(225,6,0,0.3)'}
                          className="transition-all duration-300 animate-pulse"
                        />
                        {/* Inner Node */}
                        <circle
                          cx={corner.x}
                          cy={corner.y}
                          r={isHovered ? 6 : 4}
                          fill="#FFFFFF"
                          stroke="#E10600"
                          strokeWidth="2"
                        />
                        {/* Turn Number Tag */}
                        <text
                          x={corner.x + 12}
                          y={corner.y - 10}
                          fill="#FFFFFF"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                          className="pointer-events-none drop-shadow-md"
                        >
                          T{corner.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Apex Telemetry Tooltip when corner is hovered */}
                {activeCorner !== null && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/80 border border-red-500/40 backdrop-blur-md shadow-2xl flex items-center gap-3 pointer-events-none transition-all animate-in fade-in zoom-in-95">
                    {(() => {
                      const corner = selectedCircuit.corners.find((c) => c.id === activeCorner);
                      if (!corner) return null;
                      return (
                        <>
                          <div className="flex items-center gap-1.5 font-mono text-xs text-white">
                            <span className="text-[#E10600] font-bold">TURN {corner.id}:</span>
                            <span className="font-semibold">{corner.name}</span>
                          </div>
                          <div className="h-3 w-[1px] bg-white/20" />
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-neutral-400">APEX SPEED:</span>
                            <span className="text-emerald-400 font-bold">{corner.speed}</span>
                            <span className="text-neutral-400">GEAR:</span>
                            <span className="text-white font-bold">{corner.gear}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Card Footer: Micro Telemetry Badges */}
              <div className="flex items-center justify-between w-full text-[11px] font-mono text-neutral-400 border-t border-white/[0.06] pt-3 z-20">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>100% FIA TELEMETRY RESOLUTION</span>
                </div>
                <span className="hidden sm:inline text-neutral-500">
                  HOVER APEX NODES TO INSPECT CORNER DATA
                </span>
                <span className="text-neutral-300 font-semibold">{selectedCircuit.lengthKm}</span>
              </div>
            </div>
          </GlowBorderCard>
        </div>

        {/* Telemetry Quick Telemetry Stats Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md flex flex-col gap-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span>TOP SPEED</span>
              <Gauge className="w-3.5 h-3.5 text-[#E10600]" />
            </div>
            <span className="text-2xl font-bold font-mono text-white">356.4 <span className="text-xs text-neutral-400">km/h</span></span>
            <span className="text-[10px] font-mono text-neutral-500">Main Straight Speed Trap</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md flex flex-col gap-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span>MIN APEX SPEED</span>
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="text-2xl font-bold font-mono text-white">72.8 <span className="text-xs text-neutral-400">km/h</span></span>
            <span className="text-[10px] font-mono text-neutral-500">Turn 1 Chicane Minimum</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md flex flex-col gap-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span>MAX LATERAL G</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-white">4.82 <span className="text-xs text-neutral-400">G</span></span>
            <span className="text-[10px] font-mono text-neutral-500">High-Downforce Apex</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md flex flex-col gap-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
              <span>FULL THROTTLE</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold font-mono text-white">78.4 <span className="text-xs text-neutral-400">%</span></span>
            <span className="text-[10px] font-mono text-neutral-500">Lap Duty Cycle</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 px-4 text-center text-xs font-mono text-neutral-500">
        <p>KERS APEX ANALYTICS & STRATEGY HUB • FORMULA 1 REAL-TIME TELEMETRY</p>
      </footer>
    </div>
  );
}

