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
}

export function MultiTraceCanvas({
  telemetryA,
  telemetryB,
  driverAColor = '#FF8000',
  driverBColor = '#E80020',
  driverAName = 'L. NORRIS',
  driverBName = 'C. LECLERC',
}: MultiTraceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeDistanceM, setActiveDistanceM, isPlaying, circuitLengthM } = useTelemetryStore();
  const [containerWidth, setContainerWidth] = useState(900);

  // Resize listener
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(Math.max(600, entries[0].contentRect.width));
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

  // Layout Dimensions
  const margin = { top: 20, right: 25, bottom: 25, left: 45 };
  const width = containerWidth - margin.left - margin.right;
  const speedHeight = 200;
  const throttleBrakeHeight = 90;
  const gearHeight = 55;

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

  // Corner markers
  const monzaCorners = [
    { name: 'T1 Rettifilo', dist: 650 },
    { name: 'T3 Biassono', dist: 1450 },
    { name: 'T4 Roggia', dist: 2250 },
    { name: 'T6 Lesmo 1', dist: 2750 },
    { name: 'T7 Lesmo 2', dist: 3150 },
    { name: 'T8 Ascari', dist: 4200 },
    { name: 'T11 Parabolica', dist: 5300 },
  ];

  const handleSvgPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = event.clientX - rect.left - margin.left;
    const clampedX = Math.max(0, Math.min(width, clientX));
    const dist = Math.round(xScale.invert(clampedX));
    setActiveDistanceM(dist);
  };

  const cursorX = xScale(activeDistanceM);

  return (
    <div ref={containerRef} className="w-full ios-card p-6 rounded-3xl flex flex-col gap-4 select-none">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-white stroke-[2]" />
          <div>
            <h3 className="font-semibold text-sm text-white tracking-tight">
              Synchronized Telemetry Trace
            </h3>
          </div>
        </div>

        {/* Minimalist Floating Delta Readout */}
        <div className="flex items-center gap-3 ios-pill px-3.5 py-1 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">Δ SPEED</span>
            <span className={`font-bold ${Number(speedDelta) >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
              {Number(speedDelta) >= 0 ? `+${speedDelta}` : speedDelta} km/h
            </span>
          </div>

          <span className="text-neutral-600">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">SPLIT</span>
            <span className={`font-bold ${Number(timeDeltaSec) <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {Number(timeDeltaSec) <= 0 ? `${timeDeltaSec}s` : `+${timeDeltaSec}s`}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative">
        <svg
          width={containerWidth}
          height={speedHeight + throttleBrakeHeight + gearHeight + margin.top + margin.bottom + 40}
          onPointerDown={handleSvgPointer}
          onPointerMove={(e) => e.buttons === 1 && handleSvgPointer(e)}
          className="cursor-crosshair block overflow-visible"
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Background Corner Guides */}
            {monzaCorners.map((corner) => {
              const xPos = xScale(corner.dist);
              return (
                <g key={corner.name} transform={`translate(${xPos}, 0)`}>
                  <line
                    y1={0}
                    y2={speedHeight + throttleBrakeHeight + gearHeight + 25}
                    stroke="rgba(255, 255, 255, 0.04)"
                    strokeDasharray="2,3"
                  />
                  <text
                    y={-6}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="9px"
                    fontFamily="sans-serif"
                    fontWeight="500"
                  >
                    {corner.name}
                  </text>
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

              <text x={6} y={16} fill="#64748B" fontSize="10px" fontWeight="600" fontFamily="sans-serif">
                SPEED (KM/H)
              </text>

              {/* Driver B Trace */}
              <path
                d={speedLineB(telemetryB) || ''}
                fill="none"
                stroke={driverBColor}
                strokeWidth={1.75}
                opacity={0.8}
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
              <text x={6} y={14} fill="#64748B" fontSize="10px" fontWeight="600" fontFamily="sans-serif">
                THROTTLE / BRAKE (%)
              </text>

              {/* Throttle */}
              <path d={throttleLineB(telemetryB) || ''} fill="none" stroke={driverBColor} strokeWidth={1.25} opacity={0.6} />
              <path d={throttleLineA(telemetryA) || ''} fill="none" stroke={driverAColor} strokeWidth={1.75} />

              {/* Brake */}
              <path d={brakeLineB(telemetryB) || ''} fill="none" stroke="#FF453A" strokeWidth={1.25} strokeDasharray="3,3" opacity={0.6} />
              <path d={brakeLineA(telemetryA) || ''} fill="none" stroke="#FF453A" strokeWidth={1.75} strokeDasharray="3,2" />
            </g>

            {/* CHANNEL 3: GEAR */}
            <g transform={`translate(0, ${speedHeight + throttleBrakeHeight + 30})`}>
              <text x={6} y={12} fill="#64748B" fontSize="10px" fontWeight="600" fontFamily="sans-serif">
                GEAR (1-8)
              </text>

              <path d={gearLineB(telemetryB) || ''} fill="none" stroke={driverBColor} strokeWidth={1.25} opacity={0.6} />
              <path d={gearLineA(telemetryA) || ''} fill="none" stroke={driverAColor} strokeWidth={1.75} />

              {/* Distance Axis */}
              {[0, 1000, 2000, 3000, 4000, 5000].map((d) => (
                <g key={d} transform={`translate(${xScale(d)}, ${gearHeight})`}>
                  <line y1={0} y2={4} stroke="rgba(255,255,255,0.1)" />
                  <text y={15} fill="#64748B" fontSize="9px" textAnchor="middle" fontFamily="sans-serif">
                    {d}m
                  </text>
                </g>
              ))}
            </g>

            {/* SYNCHRONIZED SCRUBBER HAIRLINE */}
            <g transform={`translate(${cursorX}, 0)`}>
              <line
                y1={0}
                y2={speedHeight + throttleBrakeHeight + gearHeight + 25}
                stroke="#FFFFFF"
                strokeWidth={1}
                strokeDasharray="2,2"
                opacity={0.6}
              />
              <circle cx={0} cy={yScaleSpeed(currentA.speed)} r={4} fill={driverAColor} stroke="#fff" strokeWidth={1.5} />
              <circle cx={0} cy={yScaleSpeed(currentB.speed)} r={3.5} fill={driverBColor} stroke="#fff" strokeWidth={1.5} />
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
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: driverBColor }} />
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
