'use client';

import React from 'react';
import { StrategySimulator } from '@/components/strategy/StrategySimulator';
import { Flame, Cpu, ShieldAlert } from 'lucide-react';

export default function StrategyPage() {
  return (
    <div className="space-y-5">
      {/* Strategy Simulator */}
      <StrategySimulator />

      {/* Engineering Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="ios-card p-5 rounded-3xl space-y-1.5">
          <div className="flex items-center gap-2 text-neutral-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            The Undercut Principle
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Pitting 1 lap earlier allows the chasing driver to leverage fresh tyre out-lap delta (+1.8s to +2.4s faster than worn compound).
          </p>
        </div>

        <div className="ios-card p-5 rounded-3xl space-y-1.5">
          <div className="flex items-center gap-2 text-neutral-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Degradation Polynomials
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Pace degradation is modeled via quadratic regression Δt = α · lap + β · lap², capturing thermal settling and tyre wear cliffs.
          </p>
        </div>

        <div className="ios-card p-5 rounded-3xl space-y-1.5">
          <div className="flex items-center gap-2 text-neutral-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            Overcut Viability Window
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Effective when rival drivers get delayed in traffic or when cold hard compound warmup requires more than 1 installation lap.
          </p>
        </div>
      </div>
    </div>
  );
}
