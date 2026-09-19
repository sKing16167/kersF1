'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

export type ConsentStatus = 'accepted' | 'essential' | null;

export const CONSENT_STORAGE_KEY = 'kers_cookie_consent';
export const CONSENT_EVENT_NAME = 'kers-consent-updated';

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<ConsentStatus>('essential'); // Default safe state to avoid SSR flash
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentStatus;
      if (!stored) {
        setIsOpen(true);
      } else {
        setConsent(stored);
      }
    } catch {
      // Graceful fallback if localStorage is disabled in strict mode
    }
  }, []);

  const handleSaveConsent = (status: 'accepted' | 'essential') => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, status);
      setConsent(status);
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT_NAME, { detail: { status } }));
    } catch {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Cookie and telemetry consent preferences"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-50 pointer-events-auto"
      >
        <div className="f1-glass-card p-5 rounded-xl border border-white/[0.14] shadow-2xl space-y-4">
          {/* Header & Icon */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801] shrink-0">
                <Cookie className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-display text-white tracking-wide">
                  Telemetry & Cookie Transparency
                </h3>
                <span className="text-[10px] font-mono text-neutral-400">
                  GDPR & ePrivacy Directive Compliance
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSaveConsent('essential')}
              className="text-neutral-400 hover:text-white p-1 rounded transition-colors"
              aria-label="Close and keep essential storage only"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            kersF1 utilizes essential local storage to remember your audio mute states, UI theme, and custom lap times. 
            With your permission, we also collect anonymized telemetry diagnostics to benchmark micro-sector render speeds.
          </p>

          {/* Expandable Technical Details Drawer */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 pt-2 border-t border-white/[0.08] overflow-hidden text-xs font-mono"
              >
                <div className="p-2.5 rounded bg-black/50 border border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between text-[#00E5FF] font-bold">
                    <span>Essential Storage (Always Active)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00E5FF]/20">Required</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Saves UI theme (Obsidian/Scuderia), audio mute preferences, and custom lap record benchmarks. No PII is collected.
                  </p>
                </div>

                <div className="p-2.5 rounded bg-black/50 border border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span>Performance Analytics (Optional)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20">Opt-in</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Anonymized crash logs and API query latencies to diagnose slow lap comparisons. Completely cookie-free.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-400">
                  <Link href="/privacy" className="text-[#FF1801] hover:underline">
                    Read Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link href="/terms" className="text-[#FF1801] hover:underline">
                    Terms & Conditions
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{showDetails ? 'Hide Details' : 'Cookie Details'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveConsent('essential')}
                className="px-3 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 text-xs font-mono font-bold border border-white/[0.1] transition-all active:scale-95"
              >
                Essential Only
              </button>

              <button
                onClick={() => handleSaveConsent('accepted')}
                className="px-4 py-1.5 rounded-md bg-[#FF1801] hover:bg-[#E10600] text-white text-xs font-mono font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept All</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
