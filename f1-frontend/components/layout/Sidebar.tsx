'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  MapPin,
  TrendingUp,
  LayoutGrid,
  Users,
  Compass,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { useTelemetryStore } from '@/lib/store';
import { KersLogo } from '@/components/ui/KersLogo';

const NAV_ITEMS = [
  { name: 'Overview', href: '/', icon: LayoutGrid, tag: '00' },
  { name: 'Telemetry Arena', href: '/ghosting-arena', icon: Activity, tag: '01' },
  { name: 'Micro-Sectors', href: '/track-map', icon: MapPin, tag: '02' },
  { name: 'Race Strategy', href: '/strategy', icon: TrendingUp, tag: '03' },
  { name: 'Driver & Teams', href: '/drivers', icon: Users, tag: '04' },
  { name: 'Circuits & Globe', href: '/circuits', icon: Compass, tag: '05' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { setShowIntro, selectedRace } = useTelemetryStore();

  return (
    <aside className="hidden lg:flex w-64 h-[calc(100vh-20px)] m-2 flex-col f1-glass rounded-lg shrink-0 sticky top-2 z-40 border border-white/[0.1] shadow-2xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <KersLogo
            size={28}
            variant="badge"
            showText={true}
            subtitle="F1 Telemetry Pro"
          />
        </Link>
      </div>

      {/* Navigation Links with Smooth Animated Active Slider */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
          <span>RACE ANALYTICS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-mono transition-all group relative ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5 z-10">
                <Icon
                  className={`w-4 h-4 transition-colors stroke-[2] ${
                    isActive ? 'text-[#E10600]' : 'text-neutral-400 group-hover:text-white'
                  }`}
                />
                <span className="tracking-tight">{item.name}</span>
              </div>

              {item.tag && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm z-10 transition-colors ${
                    isActive
                      ? 'bg-[#E10600] text-white font-bold'
                      : 'bg-white/[0.04] text-neutral-500 group-hover:text-neutral-300'
                  }`}
                >
                  {item.tag}
                </span>
              )}

              {/* Animated Sliding Highlight on Active Tab */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveHighlight"
                  className="absolute inset-0 rounded-md bg-white/[0.08] border-l-2 border-l-[#E10600] z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Launch KERS Intro Action Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setShowIntro(true)}
          className="w-full py-2.5 px-3 rounded-md bg-[#E10600]/15 hover:bg-[#E10600]/25 border border-[#E10600]/40 text-white text-xs font-mono font-bold flex items-center justify-between transition-all active:scale-[0.98] group shadow-lg shadow-red-950/30 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#E10600] group-hover:scale-110 transition-transform fill-[#E10600]" />
            <span>Launch kersF1 Intro</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-white/10 text-neutral-200">
            ANIM
          </span>
        </button>
      </div>

      {/* Live Stream Telemetry Indicator Footer */}
      <div className="p-3 border-t border-white/[0.08] bg-black/30 rounded-b-lg">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-neutral-300 text-[11px] font-semibold">FastF1 Stream</span>
          </div>
          <span className="text-[10px] text-neutral-400">{selectedRace?.race_name || 'Italian GP'}</span>
        </div>
      </div>
    </aside>
  );
}
