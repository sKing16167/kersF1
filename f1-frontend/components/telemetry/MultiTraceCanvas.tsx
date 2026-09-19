'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TelemetryPoint } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { Activity } from 'lucide-react';

interface MultiTraceCanvasProps {
  telemetryA: TelemetryPoint[];
  telemetryB: TelemetryPoint[];
  driverAColor?: string;
  driverBColor?: string;
  driverAName?: string;
  driverBName?: string;
  corners?: Array<{ name: string; dist: number }>;
  circuitLengthM?: number;
}

export function MultiTraceCanvas({
  telemetryA,
  telemetryB,
  driverAColor = '#FF8000',
  driverBColor = '#E80020',
  driverAName = 'L. NORRIS',
  driverBName = 'C. LECLERC',
  corners,
  circuitLengthM: propCircuitLengthM,
}: MultiTraceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeDistanceM, setActiveDistanceM, isPlaying, circuitLengthM: storeCircuitLengthM } = useTelemetryStore();
  const circuitLengthM = propCircuitLengthM || storeCircuitLengthM;
  const [containerWidth, setContainerWidth] = useState(800);

  // If teammates share the exact same team color, provide a high-contrast F1 T-cam accent for Driver B
  const effectiveDriverBColor = useMemo(() => {
    if (!driverAColor || !driverBColor) return driverBColor || '#E80020';
    if (driverAColor.toLowerCase() === driverBColor.toLowerCase()) {
      return driverAColor.toLowerCase() === '#ff8000' ? '#FFD700' : '#00E5FF';
    }
    return driverBColor;
  }, [driverAColor, driverBColor]);

  // Resize listener with mobile support (min 280px instead of 600px)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(Math.max(280, Math.floor(entries[0].contentRect.width)));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animation loop when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const step = 25;
      const total = circuitLengthM || 5793;
      const nextDist = (activeDistanceM + step) % total;
      setActiveDistanceM(nextDist);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, activeDistanceM, circuitLengthM, setActiveDistanceM]);

  // Track max distance
  const maxDistance = useMemo(() => {
    const maxA = telemetryA[telemetryA.length - 1]?.distance || circuitLengthM || 5793;
    const maxB = telemetryB[telemetryB.length - 1]?.distance || circuitLengthM || 5793;
    return Math.max(maxA, maxB);
  }, [telemetryA, telemetryB, circuitLengthM]);

  // Current values at activeDistanceM
  const currentA = useMemo(() => {
    return telemetryA.find((p) => p.distance >= activeDistanceM) || telemetryA[0] || {
      distance: 0, speed: 0, throttle: 0, brake: 0, n_gear: 1, drs: 0, time_sec: 0
    };
  }, [telemetryA, activeDistanceM]);

  const currentB = useMemo(() => {
    return telemetryB.find((p) => p.distance >= activeDistanceM) || telemetryB[0] || {
      distance: 0, speed: 0, throttle: 0, brake: 0, n_gear: 1, drs: 0, time_sec: 0
    };
  }, [telemetryB, activeDistanceM]);

  const speedDelta = (currentA.speed - currentB.speed).toFixed(1);
  const timeDeltaSec = ((currentA.time_sec ?? 0) - (currentB.time_sec ?? 0)).toFixed(3);

  // Layout Dimensions with Mobile Responsiveness
  const isMobile = containerWidth < 640;
  const margin = {
    top: 24,
    right: isMobile ? 12 : 25,
    bottom: 25,
    left: isMobile ? 32 : 45,
  };
  const width = Math.max(100, containerWidth - margin.left - margin.right);
  const speedHeight = isMobile ? 160 : 200;
  const throttleBrakeHeight = isMobile ? 75 : 90;
  const gearHeight = isMobile ? 45 : 55;

  // Dynamic distance ticks
  const distanceTicks = useMemo(() => {
    const step = maxDistance > 6000 ? 1500 : maxDistance > 3500 ? 1000 : 500;
    const ticks: number[] = [];
    for (let d = 0; d <= maxDistance; d += step) {
      ticks.push(d);
    }
    return ticks;
  }, [maxDistance]);

  // Dynamic Corner markers
  const displayCorners = useMemo(() => {
    if (corners && corners.length > 0) {
      return corners;
    }
    // Fallback: estimate 8-10 evenly spaced corners along track length
    const total = circuitLengthM || maxDistance || 5000;
    const count = 8;
    return Array.from({ length: count }, (_, i) => ({
      name: `T${i + 1}`,
      dist: Math.round(((i + 0.8) / count) * total),
    }));
  }, [corners, circuitLengthM, maxDistance]);

  // X Scale
  const xScale = useMemo(() => {
    return d3.scaleLinear().domain([0, maxDistance]).range([0, width]);
  }, [maxDistance, width]);

  // Speed Y Scale
  const yScaleSpeed = useMemo(() => {
    return d3.scaleLinear().domain([50, 360]).range([speedHeight, 0]);
  }, [speedHeight]);

  // Throttle / Brake Y Scale
  const yScaleThrottle = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([throttleBrakeHeight, 0]);
  }, [throttleBrakeHeight]);

  // Gear Y Scale
  const yScaleGear = useMemo(() => {
    return d3.scaleLinear().domain([1, 8]).range([gearHeight, 0]);
  }, [gearHeight]);

  // Line Generators
  const speedLineA = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleSpeed(d.speed))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScaleSpeed]);

  const speedLineB = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleSpeed(d.speed))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScaleSpeed]);

  const throttleLineA = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleThrottle(d.throttle))
      .curve(d3.curveStepAfter);
  }, [xScale, yScaleThrottle]);

  const throttleLineB = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleThrottle(d.throttle))
      .curve(d3.curveStepAfter);
  }, [xScale, yScaleThrottle]);

  const brakeLineA = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleThrottle(d.brake))
      .curve(d3.curveStepAfter);
  }, [xScale, yScaleThrottle]);

  const brakeLineB = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleThrottle(d.brake))
      .curve(d3.curveStepAfter);
  }, [xScale, yScaleThrottle]);

  const gearLineA = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleGear(d.n_gear))
      .curve(d3.curveStepAfter);
  }, [xScale, yScaleGear]);

  const gearLineB = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((d) => xScale(d.distance))
      .y((d) => yScaleGear(d.n_gear))
      .curve(d3.curveStepAfter);
  }, [xScale, yScaleGear]);

  const handleSvgPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = event.clientX - rect.left - margin.left;
    const clampedX = Math.max(0, Math.min(width, clientX));
    const dist = Math.round(xScale.invert(clampedX));
    setActiveDistanceM(dist);
  };

  const cursorX = xScale(activeDistanceM);

  const fasterDriver = Number(speedDelta) >= 0 ? driverAName : driverBName;
  const absSpeedDelta = Math.abs(Number(speedDelta));
  const timeDeltaNum = Number(timeDeltaSec);
  const leadingDriver = timeDeltaNum <= 0 ? driverAName : driverBName;
  const absTimeDelta = Math.abs(timeDeltaNum).toFixed(3);

  return (
    <div ref={containerRef} className="w-full f1-glass-card p-3 sm:p-5 md:p-6 rounded-lg flex flex-col gap-4 select-none border border-white/[0.08] shadow-2xl overflow-x-hidden">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600]">
            <Activity className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-mono uppercase tracking-tight">
              Synchronized 4-Channel Telemetry Trace
            </h3>
            <p className="text-[11px] text-neutral-400 font-mono">
              Real-time comparative telemetry overlaid across circuit distance (Drag or scrub anywhere on graph)
            </p>
          </div>
        </div>

        {/* Live Delta Summary Badge */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="f1-pill px-3 py-1 flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">SPEED ADVANTAGE:</span>
            <span
              className="font-bold"
              style={{ color: Number(speedDelta) >= 0 ? driverAColor : effectiveDriverBColor }}
            >
              {fasterDriver} +{absSpeedDelta} km/h
            </span>
          </div>

          <div className="f1-pill px-3 py-1 flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">LAP SPLIT:</span>
            <span
              className="font-bold"
              style={{ color: timeDeltaNum <= 0 ? driverAColor : effectiveDriverBColor }}
            >
              {leadingDriver} -{absTimeDelta}s
            </span>
          </div>
        </div>
      </div>

      {/* Live Driver Telemetry Scoreboard at Scrubber Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-2.5 sm:p-3.5 rounded-md bg-white/[0.02] border border-white/[0.06] font-mono text-xs">
        {/* Driver A Live Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded bg-[#0A0D14] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: driverAColor }} />
            <span className="font-bold text-white text-xs">{driverAName}</span>
            <span className="text-[10px] text-neutral-400 hidden sm:inline">(Solid)</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-xs">
            <span className="text-neutral-400">
              SPD: <strong className="text-white">{currentA.speed}</strong> <span className="text-[9px]">km/h</span>
            </span>
            <span className="text-neutral-400">
              THR: <strong className="text-amber-400">{currentA.throttle}%</strong>
            </span>
            <span className="text-neutral-400">
              BRK: <strong className="text-rose-400">{currentA.brake}%</strong>
            </span>
            <span className="text-neutral-400">
              GEAR: <strong style={{ color: driverAColor }}>G{currentA.n_gear}</strong>
            </span>
          </div>
        </div>

        {/* Driver B Live Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded bg-[#0A0D14] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: effectiveDriverBColor }} />
            <span className="font-bold text-white text-xs">{driverBName}</span>
            <span className="text-[10px] text-neutral-400 hidden sm:inline">(Dashed)</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-xs">
            <span className="text-neutral-400">
              SPD: <strong className="text-white">{currentB.speed}</strong> <span className="text-[9px]">km/h</span>
            </span>
            <span className="text-neutral-400">
              THR: <strong className="text-amber-400">{currentB.throttle}%</strong>
            </span>
            <span className="text-neutral-400">
              BRK: <strong className="text-rose-400">{currentB.brake}%</strong>
            </span>
            <span className="text-neutral-400">
              GEAR: <strong style={{ color: effectiveDriverBColor }}>G{currentB.n_gear}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-x-auto">
        <svg
          width={containerWidth}
          height={speedHeight + throttleBrakeHeight + gearHeight + margin.top + margin.bottom + 40}
          onPointerDown={handleSvgPointer}
          onPointerMove={(e) => e.buttons === 1 && handleSvgPointer(e)}
          className="cursor-crosshair block overflow-visible"
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Background Corner Guides */}
            {displayCorners.map((corner, idx) => {
              const xPos = xScale(corner.dist);
              // On narrow screens, avoid label overlap if many corners exist
              const showLabel = !isMobile || displayCorners.length <= 8 || idx % 2 === 0;
              return (
                <g key={`${corner.name}-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line
                    y1={0}
                    y2={speedHeight + throttleBrakeHeight + gearHeight + 25}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="2,3"
                  />
                  {showLabel && (
                    <text
                      y={-6}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize={isMobile ? '8px' : '9px'}
                      fontFamily="sans-serif"
                      fontWeight="500"
                    >
                      {corner.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* CHANNEL 1: SPEED (km/h) */}
            <g transform="translate(0, 0)">
              {/* Horizontal Gridlines */}
              {[100, 200, 300].map((s) => (
                <g key={s} transform={`translate(0, ${yScaleSpeed(s)})`}>
                  <line x1={0} x2={width} stroke="rgba(255,255,255,0.03)" />
                  <text x={-8} y={3.5} fill="#475569" fontSize="9px" textAnchor="end" fontFamily="sans-serif">
                    {s}
                  </text>
                </g>
              ))}

              <text x={6} y={15} fill="#FFFFFF" fontSize="10px" fontWeight="700" fontFamily="monospace">
                SPEED PROFILE (KM/H)
              </text>
              <text x={6} y={27} fill="#94A3B8" fontSize="9px" fontFamily="monospace">
                Solid = {driverAName} | Dashed = {driverBName}
              </text>

              {/* Driver B Trace */}
              <path
                d={speedLineB(telemetryB) || ''}
                fill="none"
                stroke={effectiveDriverBColor}
                strokeWidth={1.85}
                opacity={0.85}
              />
              {/* Driver A Trace */}
              <path
                d={speedLineA(telemetryA) || ''}
                fill="none"
                stroke={driverAColor}
                strokeWidth={2.25}
                className="glow-spline"
              />
            </g>

            {/* CHANNEL 2: THROTTLE & BRAKE (%) */}
            <g transform={`translate(0, ${speedHeight + 15})`}>
              <text x={6} y={14} fill="#FFFFFF" fontSize="10px" fontWeight="700" fontFamily="monospace">
                THROTTLE & BRAKE APPLICATION (%)
              </text>
              <text x={6} y={26} fill="#94A3B8" fontSize="9px" fontFamily="monospace">
                Solid = Throttle (0-100%) | Red Dashed = Braking Pressure
              </text>

              {/* Throttle */}
              <path d={throttleLineB(telemetryB) || ''} fill="none" stroke={effectiveDriverBColor} strokeWidth={1.35} opacity={0.7} />
              <path d={throttleLineA(telemetryA) || ''} fill="none" stroke={driverAColor} strokeWidth={1.75} />

              {/* Brake */}
              <path d={brakeLineB(telemetryB) || ''} fill="none" stroke="#FF453A" strokeWidth={1.25} strokeDasharray="3,3" opacity={0.6} />
              <path d={brakeLineA(telemetryA) || ''} fill="none" stroke="#FF453A" strokeWidth={1.75} strokeDasharray="3,2" />
            </g>

            {/* CHANNEL 3: GEAR */}
            <g transform={`translate(0, ${speedHeight + throttleBrakeHeight + 30})`}>
              <text x={6} y={12} fill="#FFFFFF" fontSize="10px" fontWeight="700" fontFamily="monospace">
                SEQUENTIAL GEAR RATIO (1-8)
              </text>

              <path d={gearLineB(telemetryB) || ''} fill="none" stroke={effectiveDriverBColor} strokeWidth={1.35} opacity={0.7} />
              <path d={gearLineA(telemetryA) || ''} fill="none" stroke={driverAColor} strokeWidth={1.75} />

              {/* Distance Axis */}
              {distanceTicks.map((d) => (
                <g key={d} transform={`translate(${xScale(d)}, ${gearHeight})`}>
                  <line y1={0} y2={4} stroke="rgba(255,255,255,0.1)" />
                  <text y={15} fill="#64748B" fontSize="9px" textAnchor="middle" fontFamily="sans-serif">
                    {d}m
                  </text>
                </g>
              ))}
            </g>

            {/* SYNCHRONIZED SCRUBBER HAIRLINE WITH INTERACTIVE DISTANCE PILL */}
            <g transform={`translate(${cursorX}, 0)`}>
              {/* Distance Badge at top of hairline */}
              <rect x={-32} y={-22} width={64} height={16} rx={3} fill="#0F172A" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              <text x={0} y={-11} fill="#FFFFFF" fontSize="8.5px" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                {activeDistanceM}m
              </text>

              <line
                y1={-5}
                y2={speedHeight + throttleBrakeHeight + gearHeight + 25}
                stroke="#FFFFFF"
                strokeWidth={1.25}
                strokeDasharray="2,2"
                opacity={0.75}
              />
              <circle cx={0} cy={yScaleSpeed(currentA.speed)} r={4.5} fill={driverAColor} stroke="#fff" strokeWidth={1.5} />
              <circle cx={0} cy={yScaleSpeed(currentB.speed)} r={4} fill={effectiveDriverBColor} stroke="#fff" strokeWidth={1.5} />
            </g>
          </g>
        </svg>
      </div>

      {/* Clean Minimalist Footer Key */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: driverAColor }} />
            <span className="text-white font-medium">{driverAName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: effectiveDriverBColor }} />
            <span className="text-white font-medium">{driverBName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-2.5 h-0.5 border-b border-dashed border-rose-400" />
            <span>Brake</span>
          </div>
        </div>

        <div className="text-neutral-400">
          Position: <span className="font-semibold text-white">{activeDistanceM} m</span> / {maxDistance} m
        </div>
      </div>
    </div>
  );
}
