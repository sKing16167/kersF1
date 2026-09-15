'use client';

import React, { useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { f1Api } from '@/lib/api';
import { UndercutPredictionResponse } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { TrendingUp, Sliders } from 'lucide-react';

export function StrategySimulator() {
  const { driverA, driverB, selectedSession } = useTelemetryStore();

  const [currentLap, setCurrentLap] = useState<number>(14);
  const [gapSeconds, setGapSeconds] = useState<number>(1.8);
  const [pitLossSeconds, setPitLossSeconds] = useState<number>(22.4);
  const [compoundIn, setCompoundIn] = useState<string>('MEDIUM');
  const [compoundOut, setCompoundOut] = useState<string>('HARD');

  const [prediction, setPrediction] = useState<UndercutPredictionResponse | null>(null);

  useEffect(() => {
    let isCancelled = false;
    async function runPrediction() {
      const res = await f1Api.predictUndercut({
        session_id: selectedSession?.id || 1,
        target_driver_id: driverA.id,
        rival_driver_id: driverB.id,
        current_lap: currentLap,
        gap_seconds: gapSeconds,
        pit_loss_seconds: pitLossSeconds,
        target_compound_in: compoundIn,
        target_compound_out: compoundOut,
        rival_compound_in: compoundIn,
      });
      if (!isCancelled) {
        setPrediction(res);
      }
    }
    runPrediction();
    return () => {
      isCancelled = true;
    };
  }, [currentLap, gapSeconds, pitLossSeconds, compoundIn, compoundOut, driverA.id, driverB.id, selectedSession?.id]);

  const chartWidth = 540;
  const chartHeight = 200;
  const margin = { top: 15, right: 25, bottom: 25, left: 40 };
  const width = chartWidth - margin.left - margin.right;
  const height = chartHeight - margin.top - margin.bottom;

  const { xScale, yScale, targetPath, rivalPath } = useMemo(() => {
    if (!prediction) {
      return { xScale: null, yScale: null, targetPath: '', rivalPath: '' };
    }

    const allLaps = prediction.target_pace_curve.map((d) => d.lap);
    const minLap = Math.min(...allLaps);
    const maxLap = Math.max(...allLaps);

    const allTimes = [
      ...prediction.target_pace_curve.map((d) => d.lap_time_est),
      ...prediction.rival_pace_curve.map((d) => d.lap_time_est),
    ];
    const minTime = Math.min(...allTimes) - 0.2;
    const maxTime = Math.max(...allTimes) + 0.4;

    const x = d3.scaleLinear().domain([minLap, maxLap]).range([0, width]);
    const y = d3.scaleLinear().domain([minTime, maxTime]).range([height, 0]);

    const lineTarget = d3.line<{ lap: number; lap_time_est: number }>()
      .x((d) => x(d.lap))
      .y((d) => y(d.lap_time_est))
      .curve(d3.curveMonotoneX);

    const lineRival = d3.line<{ lap: number; lap_time_est: number }>()
      .x((d) => x(d.lap))
      .y((d) => y(d.lap_time_est))
      .curve(d3.curveMonotoneX);

    return {
      xScale: x,
      yScale: y,
      targetPath: lineTarget(prediction.target_pace_curve) || '',
      rivalPath: lineRival(prediction.rival_pace_curve) || '',
    };
  }, [prediction, width, height]);

  return (
    <div className="w-full f1-glass-card p-6 rounded-lg flex flex-col gap-5 border border-white/[0.08] shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#E10600]/10 border border-[#E10600]/25 flex items-center justify-center text-[#E10600]">
            <TrendingUp className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white tracking-tight font-mono uppercase">
              Pit Stop & Tyre Strategy Predictor
            </h2>
          </div>
        </div>

        {prediction && (
          <div className="f1-pill px-3.5 py-1 text-xs font-mono flex items-center gap-2">
            <span className="text-neutral-400 text-[10px]">UNDERCUT PROBABILITY:</span>
            <span className="font-bold text-emerald-400">
              {prediction.success_probability.toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-3.5 p-4 rounded-md bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#E10600]" />
            Simulation Parameters
          </span>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Race Lap</span>
              <span className="font-mono font-medium text-white">Lap {currentLap} / 53</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={currentLap}
              onChange={(e) => setCurrentLap(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Track Margin</span>
              <span className="font-mono font-medium text-amber-300">{gapSeconds.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={gapSeconds}
              onChange={(e) => setGapSeconds(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Pit Loss</span>
              <span className="font-mono font-medium text-cyan-300">{pitLossSeconds.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="18.0"
              max="28.0"
              step="0.2"
              value={pitLossSeconds}
              onChange={(e) => setPitLossSeconds(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <select
              value={compoundIn}
              onChange={(e) => setCompoundIn(e.target.value)}
              className="f1-pill px-3 py-1.5 text-xs text-neutral-200 bg-transparent focus:outline-none cursor-pointer font-mono"
            >
              <option value="MEDIUM" className="bg-[#0D1117]">MEDIUM (Current)</option>
              <option value="SOFT" className="bg-[#0D1117]">SOFT (Current)</option>
              <option value="HARD" className="bg-[#0D1117]">HARD (Current)</option>
            </select>

            <select
              value={compoundOut}
              onChange={(e) => setCompoundOut(e.target.value)}
              className="f1-pill px-3 py-1.5 text-xs text-neutral-200 bg-transparent focus:outline-none cursor-pointer font-mono"
            >
              <option value="HARD" className="bg-[#0D1117]">HARD (Target)</option>
              <option value="MEDIUM" className="bg-[#0D1117]">MEDIUM (Target)</option>
              <option value="SOFT" className="bg-[#0D1117]">SOFT (Target)</option>
            </select>
          </div>
        </div>

        {/* Curves & Verdict */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {prediction && (
            <div className="p-3.5 rounded-md bg-white/[0.02] border border-white/[0.06] text-xs">
              <div className="font-mono font-bold text-white mb-0.5">
                {prediction.strategy_type} WINDOW: LAP {prediction.optimal_pit_lap}
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                {prediction.recommendation_text}
              </p>
            </div>
          )}

          <div className="p-4 rounded-md bg-[#05070B] border border-white/[0.06]">
            {prediction && xScale && yScale && (
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                  {yScale.ticks(3).map((tick) => (
                    <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
                      <line x1={0} x2={width} stroke="rgba(255,255,255,0.03)" />
                      <text x={-6} y={3} fill="#64748B" fontSize="9px" textAnchor="end" fontFamily="sans-serif">
                        {tick.toFixed(1)}s
                      </text>
                    </g>
                  ))}

                  <path d={rivalPath} fill="none" stroke={driverB.color_hex} strokeWidth={1.5} strokeDasharray="3,3" opacity={0.6} />
                  <path d={targetPath} fill="none" stroke={driverA.color_hex} strokeWidth={2} />

                  {prediction.crossover_lap && (
                    <g transform={`translate(${xScale(prediction.crossover_lap)}, 0)`}>
                      <line y1={0} y2={height} stroke="#00FF88" strokeWidth={1} strokeDasharray="2,2" opacity={0.7} />
                      <text y={-4} fill="#00FF88" fontSize="9px" textAnchor="middle" fontFamily="sans-serif">
                        Crossover (L{prediction.crossover_lap})
                      </text>
                    </g>
                  )}

                  {prediction.target_pace_curve.map((d) => (
                    <g key={d.lap} transform={`translate(${xScale(d.lap)}, ${height})`}>
                      <text y={15} fill="#64748B" fontSize="9px" textAnchor="middle" fontFamily="sans-serif">
                        L{d.lap}
                      </text>
                    </g>
                  ))}
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
