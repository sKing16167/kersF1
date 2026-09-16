'use client';

import React, { useState } from 'react';
import { Circuit } from '@/lib/types';
import { useTelemetryStore, LapRecordData } from '@/lib/store';
import { parseLapTimeToMs } from '@/lib/api';
import { Timer, Zap, CheckCircle2, AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface UpdateLapRecordModalProps {
  circuit: Circuit;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateLapRecordModal({ circuit, isOpen, onClose }: UpdateLapRecordModalProps) {
  const { circuitRecordOverrides, updateCircuitRecord } = useTelemetryStore();
  const currentRecordData = circuitRecordOverrides[circuit.id] || {
    lap_record: circuit.lap_record || '1:21.000',
    lap_record_driver: circuit.lap_record_driver || 'Unknown Driver',
    lap_record_year: circuit.lap_record_year || 2024,
    lap_record_team: circuit.lap_record_team || 'Formula 1',
  };

  const [newTime, setNewTime] = useState(currentRecordData.lap_record);
  const [newDriver, setNewDriver] = useState(currentRecordData.lap_record_driver);
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear());
  const [newTeam, setNewTeam] = useState(currentRecordData.lap_record_team || 'Formula 1');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentMs = parseLapTimeToMs(currentRecordData.lap_record);
  const newMs = parseLapTimeToMs(newTime);
  const isValidTime = newMs !== Infinity && newMs > 30000 && newMs < 200000;
  const isFaster = isValidTime && newMs < currentMs;
  const deltaMs = isValidTime && currentMs !== Infinity ? currentMs - newMs : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTime || !newDriver.trim()) return;

    const updatedData: LapRecordData = {
      lap_record: newTime.trim(),
      lap_record_driver: newDriver.trim(),
      lap_record_year: Number(newYear) || new Date().getFullYear(),
      lap_record_team: newTeam.trim() || 'Formula 1',
      updated_at: new Date().toISOString(),
    };

    updateCircuitRecord(circuit.id, updatedData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-lg kers-glass-refract p-6 rounded-xl border border-white/[0.14] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
              <Timer className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-base text-white tracking-tight">
                Update Official Circuit Lap Record
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                {circuit.circuit_name} ({circuit.country})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Standing Record Banner */}
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-neutral-500 uppercase text-[10px]">Standing Official Record</span>
            <div className="text-white font-bold text-base mt-0.5">
              {currentRecordData.lap_record}{' '}
              <span className="text-xs font-normal text-neutral-400">({currentRecordData.lap_record_year})</span>
            </div>
          </div>
          <div className="text-right text-neutral-300">
            <div>{currentRecordData.lap_record_driver}</div>
            <div className="text-[10px] text-neutral-500">{currentRecordData.lap_record_team}</div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">
              New Lap Time (e.g. 1:44.215 or 1:19.450)
            </label>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="M:SS.mmm"
              className="w-full px-3 py-2.5 rounded-md bg-[#0A0D14] border border-white/[0.12] text-white focus:outline-none focus:border-[#FF1801] font-bold text-sm tracking-wider"
              required
            />
            {isValidTime && deltaMs !== null && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                {isFaster ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    New Record! -{(deltaMs / 1000).toFixed(3)}s faster than standing record
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    +{(Math.abs(deltaMs) / 1000).toFixed(3)}s slower than standing record
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">Driver Name</label>
              <input
                type="text"
                value={newDriver}
                onChange={(e) => setNewDriver(e.target.value)}
                placeholder="e.g. Lando Norris"
                className="w-full px-3 py-2 rounded-md bg-[#0A0D14] border border-white/[0.12] text-white focus:outline-none focus:border-[#FF1801]"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">Year</label>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-md bg-[#0A0D14] border border-white/[0.12] text-white focus:outline-none focus:border-[#FF1801]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">Constructor / Car Model</label>
            <input
              type="text"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="e.g. McLaren MCL38"
              className="w-full px-3 py-2 rounded-md bg-[#0A0D14] border border-white/[0.12] text-white focus:outline-none focus:border-[#FF1801]"
              required
            />
          </div>

          {/* Submission status feedback */}
          {submitted ? (
            <div className="p-3 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Circuit Lap Record Updated in Real Time!
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValidTime || !newDriver.trim()}
                className="px-5 py-2 rounded-md bg-[#FF1801] hover:bg-[#FF3820] disabled:opacity-40 disabled:hover:bg-[#FF1801] text-white text-xs font-bold transition-all shadow-lg shadow-[#FF1801]/30 flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                Broadcast New Lap Record
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
