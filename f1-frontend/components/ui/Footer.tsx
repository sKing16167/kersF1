'use client';

import React from 'react';
import Link from 'next/link';
import { KersLogo } from './KersLogo';
import { Shield, FileText, Activity, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  const handleResetCookies = () => {
    try {
      localStorage.removeItem('kers_cookie_consent');
      window.location.reload();
    } catch {
      // no-op
    }
  };

  return (
    <footer className="mt-12 border-t border-white/[0.08] f1-glass text-neutral-400 font-mono text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
        {/* Top Grid: Brand & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-block">
              <KersLogo size={28} showText={true} />
            </Link>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm">
              kersF1 — Formula 1 Telemetry & Precision Analytics Hub. Ultra-high frequency ghosting comparisons, 39 calibrated circuit layouts, micro-sector apex velocities, and dynamic tire strategy modeling.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Telemetry Pipeline Online
              </span>
              <span className="text-[10px] text-neutral-400">Build 2026.09-v2</span>
            </div>
          </div>

          {/* Telemetry Modules Col */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="text-white font-bold text-xs uppercase tracking-wider font-display">
              Telemetry Suites
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/circuits" className="hover:text-white transition-colors">
                  3D Earth & 39 Calibrated Circuits
                </Link>
              </li>
              <li>
                <Link href="/ghosting-arena" className="hover:text-white transition-colors">
                  Driver Ghosting Arena & Apex Deltas
                </Link>
              </li>
              <li>
                <Link href="/track-map" className="hover:text-white transition-colors">
                  Micro-Sector Velocity Maps
                </Link>
              </li>
              <li>
                <Link href="/strategy" className="hover:text-white transition-colors">
                  Pirelli Tire Degradation Strategy
                </Link>
              </li>
              <li>
                <Link href="/drivers" className="hover:text-white transition-colors">
                  Constructor & Driver Standings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Col */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-white font-bold text-xs uppercase tracking-wider font-display">
              Legal & Privacy
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#00E5FF]" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#FF1801]" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleResetCookies}
                  className="hover:text-white transition-colors text-left flex items-center gap-1 text-neutral-400"
                >
                  <span>Cookie Preferences</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory F1 Trademark Notice */}
        <div className="p-4 rounded-lg bg-black/40 border border-white/[0.06] text-[11px] text-neutral-400 font-sans leading-relaxed space-y-1">
          <p className="font-bold text-neutral-300 font-mono text-[10px] uppercase tracking-wider">
            Disclaimer of Affiliation & Intellectual Property Notice
          </p>
          <p>
            Formula 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX, team constructors, and driver names are trademarks and copyright of Formula One Licensing B.V. and the FIA. 
            kersF1 is an independent, non-commercial educational open-source software project. This site is not associated with, sponsored by, or endorsed by the Formula One companies.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} kersF1 Telemetry Analytics. Released under MIT Open Source.
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/sKing16167/kersF1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub Repository</span>
              <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
