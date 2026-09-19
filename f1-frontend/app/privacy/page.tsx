'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, Database, Trash2, Eye, Server, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [purged, setPurged] = useState(false);

  const handlePurgeStorage = () => {
    if (typeof window !== 'undefined') {
      const keysToRemove = [
        'kers_theme',
        'kers_audio_muted',
        'kers_circuit_record_overrides',
        'kers_cookie_consent',
        'kers-telemetry-store',
      ];
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      setPurged(true);
      setTimeout(() => setPurged(false), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header Bar */}
      <div className="f1-glass-card p-6 md:p-8 rounded-xl border border-white/[0.08] space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">
              Privacy Policy & Data Transparency
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              Effective Date: September 2026 | Platform Version: KERS v2.4 (FIA Telemetry Specification)
            </p>
          </div>
        </div>
      </div>

      {/* Main Privacy Notice Cards */}
      <div className="space-y-4">
        {/* Section 1: Core Principles */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <Lock className="w-4 h-4 text-[#FF1801]" />
            <h2>1. Privacy-First Architecture</h2>
          </div>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            The Kinetic Energy Recovery System (KERS) F1 platform is designed with a strict privacy-first engineering philosophy. 
            We do not require user account registration, do not collect personal identifiers (such as names, emails, or phone numbers), 
            and do not sell, rent, or monetize any user data.
          </p>
        </div>

        {/* Section 2: Browser Storage & Local Data */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <Database className="w-4 h-4 text-[#00E5FF]" />
            <h2>2. Local Storage & Client State</h2>
          </div>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            To provide a seamless, persistent telemetry experience across race sessions, KERS stores small configuration tokens 
            locally in your browser&apos;s <code className="text-[#00E5FF] bg-white/[0.05] px-1.5 py-0.5 rounded font-mono">localStorage</code>. 
            This data never leaves your device:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-[#00E5FF] font-bold">kers_theme</span>
              <p className="text-[11px] text-neutral-400">Stores selected UI palette (Obsidian, Scuderia, Petronas, Monaco).</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-[#00E5FF] font-bold">kers_audio_muted</span>
              <p className="text-[11px] text-neutral-400">Preserves audio mute preference for engine sound effects & radio.</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-[#00E5FF] font-bold">kers_circuit_record_overrides</span>
              <p className="text-[11px] text-neutral-400">User-updated custom track records & lap time benchmarks.</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-[#00E5FF] font-bold">kers_cookie_consent</span>
              <p className="text-[11px] text-neutral-400">Records your cookie & analytics preference (Accepted or Essential).</p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-neutral-400 font-mono">
              Want to erase all saved preferences and reset storage?
            </span>
            <button
              onClick={handlePurgeStorage}
              className="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              {purged ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Local Data Cleared!</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Local Storage</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 3: Third-Party Telemetry & Network APIs */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <Server className="w-4 h-4 text-[#39FF14]" />
            <h2>3. Third-Party Data Sources & Telemetry Feeds</h2>
          </div>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            The telemetry, lap times, tire degradation data, and live sector timings displayed on KERS are retrieved from public open-access Formula 1 telemetry feeds:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-300 pl-1">
            <li><strong className="text-white font-mono">Jolpica-F1 / Ergast Archive:</strong> Historical race results, qualifying data, driver standings.</li>
            <li><strong className="text-white font-mono">OpenF1 API:</strong> Real-time high-frequency GPS positions, throttle/brake telemetry, tire stints.</li>
            <li><strong className="text-white font-mono">Formula 1 Live Timing Feed:</strong> Team radio audio communications and public timing feeds.</li>
          </ul>
          <p className="text-[11px] text-neutral-400 italic">
            When your browser queries these services, your IP address is processed temporarily by the respective CDN edge servers in accordance with standard internet networking protocols.
          </p>
        </div>

        {/* Section 4: Analytics & Cookie Compliance */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <Eye className="w-4 h-4 text-[#FFB800]" />
            <h2>4. Analytics & Cookie Consent (GDPR / ePrivacy)</h2>
          </div>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            KERS utilizes privacy-respecting client analytics solely to identify slow network requests, broken circuit maps, 
            and platform crashes. Analytics cookies are completely disabled by default until and unless you explicitly opt in via the 
            Cookie Consent banner.
          </p>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            Under the EU General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain the absolute right 
            to decline analytics tracking without affecting any telemetry visualization features of the platform.
          </p>
        </div>

        {/* Section 5: Security & Inquiries */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <h2 className="text-white font-display font-bold text-base">5. Security Governance & Open Source</h2>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            All data in transit is protected using Strict Transport Security (HSTS) and modern TLS 1.3 encryption. KERS enforces a stringent Content Security Policy (CSP) to neutralize cross-site scripting and unauthorized data exfiltration.
          </p>
          <p className="text-xs font-mono text-neutral-400 pt-1">
            For security inquiries or questions regarding this policy, please open an issue in the official GitHub project repository.
          </p>
        </div>
      </div>
    </div>
  );
}
