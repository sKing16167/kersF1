'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, UserCheck, Key, Zap, Check, Lock } from 'lucide-react';
import { KersLogo } from '@/components/ui/KersLogo';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_DRIVERS = [
  { name: 'Max Verstappen', team: 'Red Bull Racing', number: '01', color: '#3671C6', role: 'Telemetry Driver P1' },
  { name: 'Lewis Hamilton', team: 'Mercedes-AMG', number: '44', color: '#27F4D2', role: 'Telemetry Driver P2' },
  { name: 'Charles Leclerc', team: 'Ferrari HP', number: '16', color: '#E80020', role: 'Telemetry Driver P3' },
  { name: 'Lando Norris', team: 'McLaren F1', number: '04', color: '#FF8000', role: 'Telemetry Driver P4' },
];

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [selectedDriver, setSelectedDriver] = useState(PRESET_DRIVERS[0]);
  const [licenseKey, setLicenseKey] = useState('FIA-2024-SUPER-0941');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          {/* Backdrop click to dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container with High-End Motorsport Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            className="relative z-10 w-full max-w-md rounded-lg bg-[#0D1017] border border-white/[0.12] shadow-2xl p-6 overflow-hidden"
          >
            {/* Top Red Racing Accent Notch Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E10600] via-[#FF2800] to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <KersLogo size={24} showText={false} />
                <div>
                  <h3 className="text-base font-bold font-mono tracking-tight text-white flex items-center gap-2">
                    FIA SUPERLICENSE ACCESS
                  </h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    KERS Telemetry Pro Encrypted Portal
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="mt-5 space-y-4">
              {/* Quick Select Preset Driver */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-2">
                  Select Driver Profile
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_DRIVERS.map((driver) => {
                    const isSelected = selectedDriver.name === driver.name;
                    return (
                      <button
                        key={driver.name}
                        type="button"
                        onClick={() => setSelectedDriver(driver)}
                        className={`p-2.5 rounded-md text-left transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-white/[0.08] border-[#E10600]'
                            : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-3 rounded-none inline-block"
                              style={{ backgroundColor: driver.color }}
                            />
                            {driver.name.split(' ')[1]}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono">#{driver.number} • {driver.team.split(' ')[0]}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#E10600]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Superlicense Key Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400">
                  Telemetry Token / Superlicense Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-md bg-[#141824] border border-white/[0.1] focus:border-[#E10600] text-white font-mono text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Status indicator */}
              <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5 text-[11px] font-mono text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-Bit Encrypted FastF1 & Live OpenF1 Telemetry Session</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-[#E10600] hover:bg-[#FF1801] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all active:scale-[0.98]"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>AUTHENTICATED: WELCOME {selectedDriver.name.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>CONNECT DRIVER TELEMETRY</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
