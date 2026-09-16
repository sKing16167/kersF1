'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelemetryStore, ThemeType } from '@/lib/store';
import { AVAILABLE_SEASONS } from '@/lib/api';
import { KersLogo } from '@/components/ui/KersLogo';

import {
  Play,
  Pause,
  Palette,
  Flag,
  Calendar,
  Sparkles,
  ChevronDown,
  Zap,
  Menu,
  X,
} from 'lucide-react';

interface NavOption {
  label: string;
  href: string;
  badge?: string;
  subItems?: { label: string; href: string }[];
}

const NAV_OPTIONS: NavOption[] = [
  { label: 'Overview', href: '/' },
  {
    label: 'Circuits',
    href: '/circuits',
    subItems: [
      { label: '3D Earth Globe', href: '/circuits' },
      { label: '23 Official Tracks', href: '/circuits#tracks' },
    ],
  },
  { label: 'Ghosting Arena', href: '/ghosting-arena' },
  { label: 'Micro-Sectors', href: '/track-map' },
  { label: 'Race Strategy', href: '/strategy' },
  { label: 'Drivers & Teams', href: '/drivers' },
  { label: 'Font Lab', href: '/fonts', badge: 'NEW' },
];

export function TopHeader() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    season,
    setSeason,
    races,
    selectedRace,
    selectedSession,
    setSelectedRace,
    setSelectedSession,
    driverA,
    driverB,
    isPlaying,
    togglePlayback,
    playbackSpeed,
    setPlaybackSpeed,
    theme,
    setTheme,
    setShowIntro,
    activeDistanceM,
    circuitLengthM,
  } = useTelemetryStore();

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const progressPct = ((activeDistanceM / (circuitLengthM || 5793)) * 100).toFixed(0);

  return (
    <>
      <header className="sticky top-2 z-40 mx-2 md:mx-4 my-2 flex flex-col gap-2">
        {/* Main F1 Signature Navigation Bar (Inspired by Screenshot) */}
        <div className="h-14 px-3 f1-glass rounded-lg flex items-center justify-between gap-3 relative overflow-visible border border-white/[0.1] shadow-2xl">
          {/* Top Left: F1 Angled Red Notch with Refined KERS Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 -ml-3 -my-3 f1-header-notch group transition-transform active:scale-95 shrink-0"
            >
              <KersLogo size={24} showText={true} colorScheme="white" />
            </Link>

            {/* F1 Red Accent Speed Line */}
            <div className="hidden xl:block w-8 h-[2px] bg-gradient-to-r from-[#FF1801] to-transparent" />

            {/* Desktop Navigation Links with Animated Sliding Pill Indicator */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_OPTIONS.map((item) => {
                const isActive = pathname === item.href;
                const hasDropdown = Boolean(item.subItems && item.subItems.length > 0);

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => hasDropdown && setActiveDropdown(item.label)}
                    onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`relative px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 transition-colors z-10 ${
                        isActive
                          ? 'text-white'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {hasDropdown && (
                        <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-white transition-transform" />
                      )}
                      {item.badge && (
                        <span className={`text-[8px] font-mono px-1 py-0.2 rounded-sm font-bold ${
                          item.badge === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : 'bg-white/20 text-neutral-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Animated Sliding Active Indicator using framer-motion layoutId */}
                      {isActive && (
                        <motion.div
                          layoutId="topNavActiveIndicator"
                          className="absolute inset-0 rounded-md bg-white/[0.12] border-b-2 border-b-[#FF1801] -z-10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>

                    {/* Animated Dropdown Menu */}
                    {hasDropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-1 w-48 p-1.5 rounded-md bg-[#0D1017]/95 border border-white/[0.12] backdrop-blur-xl shadow-2xl z-50 space-y-1"
                      >
                        {item.subItems?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-3 py-1.5 rounded text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls: SIGN IN + SUBSCRIBE/JOIN LIVE (Matching Screenshot) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Join Live Red Action CTA */}
            <Link
              href="/ghosting-arena"
              className="px-3.5 py-1.5 f1-btn-primary text-xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>JOIN LIVE</span>
            </Link>

            {/* Replay KERS Animation */}
            <button
              onClick={() => setShowIntro(true)}
              className="p-1.5 rounded-md f1-pill text-neutral-300 hover:text-white transition-all hover:scale-105 active:scale-95 hidden sm:flex"
              title="Replay KERS Starting Animation"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF1801]" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md f1-pill text-neutral-300 hover:text-white lg:hidden flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden p-3 f1-glass rounded-lg border border-white/[0.1] space-y-1 overflow-hidden"
            >
              {NAV_OPTIONS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-xs font-mono font-bold transition-colors ${
                    pathname === item.href
                      ? 'bg-[#FF1801] text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secondary Telemetry & Session Control Sub-Bar */}
        <div className="px-3 py-1.5 f1-glass rounded-md flex flex-wrap items-center justify-between gap-3 border border-white/[0.06] text-xs font-mono">
          {/* Left: Season & Race Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Season Selector */}
            <div className="flex items-center gap-1.5 f1-pill px-2.5 py-0.5">
              <Calendar className="w-3 h-3 text-[#FF1801]" />
              <select
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                aria-label="Select F1 Season"
                className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
              >
                {AVAILABLE_SEASONS.map((s) => (
                  <option key={s} value={s} className="bg-[#0D1117] text-white">
                    Season {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Race Dropdown */}
            <div className="flex items-center gap-1.5 f1-pill px-2.5 py-0.5">
              <Flag className="w-3 h-3 text-neutral-400" />
              <select
                value={selectedRace?.id || ''}
                onChange={(e) => {
                  const r = races.find((item) => item.id === Number(e.target.value));
                  if (r) setSelectedRace(r);
                }}
                aria-label="Select Grand Prix"
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                {races.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#0D1117] text-white">
                    {r.race_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Session Switcher */}
            {selectedRace && selectedRace.sessions && selectedRace.sessions.length > 0 && (
              <div className="hidden sm:flex items-center f1-pill p-0.5 gap-0.5">
                {selectedRace.sessions.map((s) => {
                  const isSelected = selectedSession?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSession(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-[#FF1801] text-white shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {s.session_type}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Center: Live Driver Telemetry Delta (H2H) */}
          <div className="hidden md:flex items-center gap-2.5 f1-pill px-3 py-0.5">
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-3 rounded-none shadow-sm inline-block"
                style={{ backgroundColor: driverA.color_hex }}
              />
              <span className="font-bold text-white">{driverA.broadcast_name}</span>
            </div>

            <span className="text-neutral-500 text-[10px] font-bold">VS</span>

            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-3 rounded-none shadow-sm inline-block"
                style={{ backgroundColor: driverB.color_hex }}
              />
              <span className="font-bold text-white">{driverB.broadcast_name}</span>
            </div>

            <span className="text-neutral-500 pl-2 border-l border-white/[0.08] text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeDistanceM}m</span>
              <span className="text-neutral-400">({progressPct}%)</span>
            </span>
          </div>

          {/* Right: Telemetry Playback & Theme */}
          <div className="flex items-center gap-2">
            {/* Playback Controls */}
            <div className="flex items-center f1-pill p-0.5">
              <button
                onClick={togglePlayback}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                  isPlaying
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'bg-white/10 text-neutral-200 hover:bg-white/15'
                }`}
              >
                {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                aria-label="Playback speed"
                className="bg-transparent text-[10px] font-mono text-neutral-400 focus:outline-none cursor-pointer px-1"
              >
                <option value={1} className="bg-[#0D1117]">1x</option>
                <option value={2} className="bg-[#0D1117]">2x</option>
                <option value={5} className="bg-[#0D1117]">5x</option>
              </select>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center f1-pill px-2 py-0.5">
              <Palette className="w-3 h-3 text-neutral-400 mr-1" />
              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as ThemeType)}
                aria-label="Theme selection"
                className="bg-transparent text-neutral-300 text-xs font-mono focus:outline-none cursor-pointer"
              >
                <option value="obsidian" className="bg-[#0D1117]">Obsidian</option>
                <option value="scuderia" className="bg-[#0D1117]">Scuderia</option>
                <option value="petronas" className="bg-[#0D1117]">Petronas</option>
                <option value="monaco" className="bg-[#0D1117]">Monaco</option>
              </select>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
