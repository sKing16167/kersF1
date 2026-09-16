'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ExternalLink, Gauge, Zap, Timer, Flame, Eye, Sparkles } from 'lucide-react';

interface FontOption {
  id: string;
  code: string;
  name: string;
  tagline: string;
  vibe: string;
  recommendation?: string;
  displayFont: string;
  telemetryFont: string;
  bodyFont: string;
  googleFontsLink: string;
  links: { name: string; url: string }[];
  styleConfig: {
    displayFamily: string;
    telemetryFamily: string;
    bodyFamily: string;
  };
}

const FONT_OPTIONS: FontOption[] = [
  {
    id: 'pitwall',
    code: 'Option A',
    name: 'Technical Pitwall',
    tagline: 'Precision Formula 1 Timing Screen & Engineering Telemetry',
    vibe: 'Clinical, hyper-accurate, high-tech engineering workstation.',
    recommendation: 'Recommended for Precision Motorsport & Telemetry',
    displayFont: 'Space Grotesk (700)',
    telemetryFont: 'JetBrains Mono (600)',
    bodyFont: 'Inter (400/500)',
    googleFontsLink: 'https://fonts.google.com/specimen/Space+Grotesk',
    links: [
      { name: 'Space Grotesk', url: 'https://fonts.google.com/specimen/Space+Grotesk' },
      { name: 'JetBrains Mono', url: 'https://fonts.google.com/specimen/JetBrains+Mono' },
      { name: 'Inter', url: 'https://fonts.google.com/specimen/Inter' },
    ],
    styleConfig: {
      displayFamily: "'Space Grotesk', sans-serif",
      telemetryFamily: "'JetBrains Mono', monospace",
      bodyFamily: "'Inter', sans-serif",
    },
  },
  {
    id: 'cyber',
    code: 'Option B',
    name: 'Cyber Grand Prix',
    tagline: 'Aggressive, Angular, Futuristic Broadcast Graphics',
    vibe: 'Hypercar cockpit, night racing in Singapore/Vegas, esports thrill.',
    displayFont: 'Orbitron (700) / Chakra Petch',
    telemetryFont: 'Share Tech Mono (400)',
    bodyFont: 'Plus Jakarta Sans (400/500)',
    googleFontsLink: 'https://fonts.google.com/specimen/Orbitron',
    links: [
      { name: 'Orbitron', url: 'https://fonts.google.com/specimen/Orbitron' },
      { name: 'Chakra Petch', url: 'https://fonts.google.com/specimen/Chakra+Petch' },
      { name: 'Share Tech Mono', url: 'https://fonts.google.com/specimen/Share+Tech+Mono' },
    ],
    styleConfig: {
      displayFamily: "'Orbitron', sans-serif",
      telemetryFamily: "'Share Tech Mono', monospace",
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
    },
  },
  {
    id: 'minimalist',
    code: 'Option C',
    name: 'Minimalist Studio',
    tagline: 'Silicon Valley & iOS 18 Design Language',
    vibe: 'Ultra-clean, modern luxury automotive, frictionless readability.',
    displayFont: 'Plus Jakarta Sans (800)',
    telemetryFont: 'Geist Mono / SF Mono (600)',
    bodyFont: 'Plus Jakarta Sans (400/500)',
    googleFontsLink: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans',
    links: [
      { name: 'Plus Jakarta Sans', url: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans' },
      { name: 'Geist Mono', url: 'https://fonts.google.com/specimen/Geist+Mono' },
    ],
    styleConfig: {
      displayFamily: "'Plus Jakarta Sans', sans-serif",
      telemetryFamily: "'Geist Mono', 'SF Mono', monospace",
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
    },
  },
  {
    id: 'brutalist',
    code: 'Option D',
    name: 'Speedway Brutalist',
    tagline: 'Heavy, Sculpted Editorial Motorsport Presence',
    vibe: 'Paddock magazine, iconic poster typography, heritage racing power.',
    displayFont: 'Syne (800 ExtraBold)',
    telemetryFont: 'Space Mono (700)',
    bodyFont: 'DM Sans (400/500)',
    googleFontsLink: 'https://fonts.google.com/specimen/Syne',
    links: [
      { name: 'Syne', url: 'https://fonts.google.com/specimen/Syne' },
      { name: 'Space Mono', url: 'https://fonts.google.com/specimen/Space+Mono' },
      { name: 'DM Sans', url: 'https://fonts.google.com/specimen/DM+Sans' },
    ],
    styleConfig: {
      displayFamily: "'Syne', sans-serif",
      telemetryFamily: "'Space Mono', monospace",
      bodyFamily: "'DM Sans', sans-serif",
    },
  },
];

export default function FontsPage() {
  const [selectedId, setSelectedId] = useState<string>('pitwall');
  const selectedOption = FONT_OPTIONS.find((o) => o.id === selectedId) || FONT_OPTIONS[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Load Google Webfonts dynamically for live preview */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700&family=Geist+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Orbitron:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Share+Tech+Mono&family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap"
      />

      {/* Header Navigation & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FF1801] uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Typography Design System</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Font Style Selection Laboratory
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Compare all 4 curated motorsport font styles side-by-side on live telemetry glass cards.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Telemetry Hub</span>
        </Link>
      </div>

      {/* 4 Font Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FONT_OPTIONS.map((option) => {
          const isSelected = selectedId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedId(option.id)}
              className={`f1-glass-card cursor-pointer p-5 transition-all relative border ${
                isSelected
                  ? 'ring-2 ring-[#FF1801] border-[#FF1801]/60 shadow-[0_0_30px_rgba(255,24,1,0.25)]'
                  : 'hover:border-white/20'
              }`}
            >
              {/* Option Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                    {option.code}
                  </span>
                  <h3
                    className="text-lg font-bold text-white tracking-wide"
                    style={{ fontFamily: option.styleConfig.displayFamily }}
                  >
                    {option.name}
                  </h3>
                </div>
                {isSelected ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#FF1801] bg-[#FF1801]/10 border border-[#FF1801]/30 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Selected Active
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Click to test
                  </span>
                )}
              </div>

              {option.recommendation && (
                <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF1801]/15 border border-[#FF1801]/30 text-[11px] text-[#FF9E94] font-medium">
                  <Sparkles className="w-3 h-3 text-[#FF1801]" />
                  <span>{option.recommendation}</span>
                </div>
              )}

              <p
                className="text-xs text-zinc-300 mb-4"
                style={{ fontFamily: option.styleConfig.bodyFamily }}
              >
                {option.tagline}
              </p>

              {/* Live Mini Telemetry Preview Card inside the Glass */}
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 mb-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span
                    className="text-xs tracking-wider uppercase text-zinc-400 font-semibold"
                    style={{ fontFamily: option.styleConfig.displayFamily }}
                  >
                    AUTODROMO NAZIONALE MONZA
                  </span>
                  <span
                    className="text-xs text-[#27F4D2] font-semibold"
                    style={{ fontFamily: option.styleConfig.telemetryFamily }}
                  >
                    POLE LAP RECORD
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">LAP TIME</div>
                    <div
                      className="text-base text-[#FF1801] font-bold tracking-tight"
                      style={{ fontFamily: option.styleConfig.telemetryFamily }}
                    >
                      1:18.887
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">SPEED TRAP</div>
                    <div
                      className="text-base text-white font-bold tracking-tight"
                      style={{ fontFamily: option.styleConfig.telemetryFamily }}
                    >
                      362.8 <span className="text-[10px] font-normal text-zinc-400">KM/H</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">DELTA (S1)</div>
                    <div
                      className="text-base text-[#27F4D2] font-bold tracking-tight"
                      style={{ fontFamily: option.styleConfig.telemetryFamily }}
                    >
                      -0.184s
                    </div>
                  </div>
                </div>

                <p
                  className="text-[11px] text-zinc-400 leading-relaxed border-t border-white/5 pt-2"
                  style={{ fontFamily: option.styleConfig.bodyFamily }}
                >
                  High-speed chicane downforce balance with DRS activation through Curva Grande.
                </p>
              </div>

              {/* Font Stack Breakdown */}
              <div className="text-[11px] text-zinc-400 space-y-1 font-mono border-t border-white/5 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Display / Titles:</span>
                  <span className="text-zinc-200">{option.displayFont}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Telemetry / Digits:</span>
                  <span className="text-zinc-200">{option.telemetryFont}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Interface / Body:</span>
                  <span className="text-zinc-200">{option.bodyFont}</span>
                </div>
              </div>

              {/* External Google Fonts Links */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <span className="text-[10px] uppercase font-mono text-zinc-500">Google Fonts:</span>
                {option.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-[#FF1801] underline underline-offset-2 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Style Full Interactive Telemetry Bench */}
      <div className="f1-glass-card p-6 border border-[#FF1801]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#FF1801]/20 border-b border-l border-[#FF1801]/30 rounded-bl-lg text-xs font-mono text-[#FF9E94] flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-[#FF1801]" />
          <span>Active Test Canvas: {selectedOption.code} ({selectedOption.name})</span>
        </div>

        <div className="mb-6">
          <div className="text-xs font-mono text-[#FF1801] tracking-widest uppercase mb-1">
            Full Cockpit Telemetry Simulation
          </div>
          <h2
            className="text-2xl md:text-3xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: selectedOption.styleConfig.displayFamily }}
          >
            FORMULA 1 SECTOR DELTA & REGEN STATUS
          </h2>
          <p
            className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl"
            style={{ fontFamily: selectedOption.styleConfig.bodyFamily }}
          >
            Observe how numbers, punctuation, uppercase abbreviations, and micro-sector splits appear in this font stack under rapid eye movement.
          </p>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
              <Timer className="w-3.5 h-3.5 text-[#FF1801]" />
              <span className="font-mono text-[10px] uppercase">FL Lap Time</span>
            </div>
            <div
              className="text-2xl font-bold text-white"
              style={{ fontFamily: selectedOption.styleConfig.telemetryFamily }}
            >
              1:20.447
            </div>
            <div
              className="text-[10px] text-[#27F4D2] mt-0.5"
              style={{ fontFamily: selectedOption.styleConfig.telemetryFamily }}
            >
              -0.312s vs PURPLE
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[10px] uppercase">Peak Velocity</span>
            </div>
            <div
              className="text-2xl font-bold text-white"
              style={{ fontFamily: selectedOption.styleConfig.telemetryFamily }}
            >
              354.2 <span className="text-xs text-zinc-400 font-normal">KM/H</span>
            </div>
            <div
              className="text-[10px] text-zinc-400 mt-0.5"
              style={{ fontFamily: selectedOption.styleConfig.bodyFamily }}
            >
              Gear 8 @ 11,920 RPM
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-mono text-[10px] uppercase">KERS State of Charge</span>
            </div>
            <div
              className="text-2xl font-bold text-[#27F4D2]"
              style={{ fontFamily: selectedOption.styleConfig.telemetryFamily }}
            >
              94.8%
            </div>
            <div
              className="text-[10px] text-zinc-400 mt-0.5"
              style={{ fontFamily: selectedOption.styleConfig.bodyFamily }}
            >
              Harvest: 2.14 MJ / Lap
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-mono text-[10px] uppercase">Brake Rotor Temp</span>
            </div>
            <div
              className="text-2xl font-bold text-white"
              style={{ fontFamily: selectedOption.styleConfig.telemetryFamily }}
            >
              842°C
            </div>
            <div
              className="text-[10px] text-emerald-400 mt-0.5"
              style={{ fontFamily: selectedOption.styleConfig.bodyFamily }}
            >
              Optimal Window
            </div>
          </div>
        </div>

        {/* Narrative & Explanatory text */}
        <div
          className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300 leading-relaxed space-y-2"
          style={{ fontFamily: selectedOption.styleConfig.bodyFamily }}
        >
          <p>
            <strong className="text-white">Aerodynamic Downforce Evaluation:</strong> High-speed telemetry channels indicate zero bottoming out through the compression at Eau Rouge. Front wing flap angle is dialed at 34.5° generating 820 kg of vertical load at 300 km/h with laminar boundary flow.
          </p>
          <p className="text-xs text-zinc-400">
            Typography verdict: Notice how {selectedOption.name} balances readability for long analysis paragraphs while keeping telemetry numbers crisp and clear without character collisions.
          </p>
        </div>
      </div>
    </div>
  );
}
