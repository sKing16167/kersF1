'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import countriesData from 'world-atlas/countries-110m.json';
import { Circuit } from '@/lib/types';
import {
  Compass,
  RotateCw,
  MapPin,
  Globe,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Play,
  Pause,
} from 'lucide-react';

interface GlobeViewProps {
  circuits: Circuit[];
  selectedCircuit: Circuit | null;
  onSelectCircuit: (circuit: Circuit) => void;
}

export function GlobeView({ circuits, selectedCircuit, onSelectCircuit }: GlobeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction & Animation Refs
  const rotationRef = useRef<[number, number]>([0, -20]);
  const defaultScale = 260;
  const zoomScaleRef = useRef<number>(defaultScale);
  const minScale = 140;
  const maxScale = 750;

  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<[number, number]>([0, 0]);
  const lastMousePosRef = useRef<[number, number]>([0, 0]);
  const hasMovedRef = useRef(false);

  const isFlyingRef = useRef(false);
  const flyAnimationIdRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Dynamic references to prevent render loop teardown
  const selectedCircuitRef = useRef<Circuit | null>(selectedCircuit);
  const hoveredCircuitRef = useRef<Circuit | null>(null);
  const circuitsRef = useRef<Circuit[]>(circuits);
  const autoRotateRef = useRef<boolean>(true);

  // Component UI State
  const [hoveredCircuit, setHoveredCircuit] = useState<Circuit | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  // Sync state to refs
  useEffect(() => {
    selectedCircuitRef.current = selectedCircuit;
  }, [selectedCircuit]);

  useEffect(() => {
    circuitsRef.current = circuits;
  }, [circuits]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Convert TopoJSON to GeoJSON once
  const land = useRef(feature(countriesData as any, countriesData.objects.countries as any)).current;

  // Shortest-path angular fly-to without spinning glitches
  const flyToCircuit = useCallback((target: Circuit) => {
    if (flyAnimationIdRef.current) {
      cancelAnimationFrame(flyAnimationIdRef.current);
      flyAnimationIdRef.current = null;
    }

    const currentLng = rotationRef.current[0];
    const currentLat = rotationRef.current[1];
    const targetLng = -target.lng;
    const targetLat = Math.max(-75, Math.min(75, -target.lat));

    // Calculate shortest angular path on longitude (-180 to 180)
    let deltaLng = ((targetLng - currentLng) % 360);
    if (deltaLng > 180) deltaLng -= 360;
    if (deltaLng < -180) deltaLng += 360;

    const startLng = currentLng;
    const destLng = currentLng + deltaLng;
    const startLat = currentLat;
    const destLat = targetLat;

    const startTime = performance.now();
    const duration = 950; // Smooth 0.95s transition
    isFlyingRef.current = true;

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      rotationRef.current = [
        startLng + (destLng - startLng) * ease,
        startLat + (destLat - startLat) * ease,
      ];

      if (progress < 1 && isFlyingRef.current) {
        flyAnimationIdRef.current = requestAnimationFrame(step);
      } else {
        isFlyingRef.current = false;
        flyAnimationIdRef.current = null;
      }
    }

    flyAnimationIdRef.current = requestAnimationFrame(step);
  }, []);

  // When selected circuit changes externally, fly to it smoothly
  useEffect(() => {
    if (selectedCircuit) {
      flyToCircuit(selectedCircuit);
    }
  }, [selectedCircuit, flyToCircuit]);

  // Zoom Helpers
  const applyZoom = useCallback((newScale: number) => {
    if (typeof newScale !== 'number' || isNaN(newScale) || !isFinite(newScale)) return;
    const clamped = Math.max(minScale, Math.min(maxScale, newScale));
    zoomScaleRef.current = clamped;
    const pct = Math.round((clamped / (defaultScale || 260)) * 100);
    setZoomPercent(isNaN(pct) || !isFinite(pct) ? 100 : pct);
  }, [defaultScale, minScale, maxScale]);

  const handleZoomIn = () => applyZoom(zoomScaleRef.current * 1.25);
  const handleZoomOut = () => applyZoom(zoomScaleRef.current * 0.8);
  const handleResetView = () => {
    applyZoom(defaultScale);
    if (selectedCircuitRef.current) {
      flyToCircuit(selectedCircuitRef.current);
    } else {
      rotationRef.current = [0, -20];
    }
  };

  // Attach non-passive wheel listener for trackpad pinch & scroll zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // If pinch-to-zoom (trackpad pinch sets ctrlKey) or wheel scroll
      const zoomFactor = e.ctrlKey ? Math.exp(-e.deltaY * 0.015) : Math.exp(-e.deltaY * 0.0018);
      applyZoom(zoomScaleRef.current * zoomFactor);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [applyZoom]);

  // Continuous Canvas Render Loop (never torn down on hover/selection)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const projection = d3
      .geoOrthographic()
      .scale(zoomScaleRef.current)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath(projection, ctx);
    const graticule = d3.geoGraticule10();

    function render(time: number) {
      if (!ctx || !canvas) return;

      // Smooth auto-rotation when idle
      if (!isDraggingRef.current && !isFlyingRef.current && autoRotateRef.current && !hoveredCircuitRef.current) {
        rotationRef.current[0] += 0.18;
      }

      projection.scale(zoomScaleRef.current);
      projection.rotate(rotationRef.current);

      ctx.clearRect(0, 0, width, height);

      const center = projection.translate();
      const radius = projection.scale();

      // 1. Vibrant Atmosphere Glow (Intense F1 Neon Red)
      const glowGrad = ctx.createRadialGradient(
        center[0],
        center[1],
        radius * 0.85,
        center[0],
        center[1],
        radius * 1.08
      );
      glowGrad.addColorStop(0, 'rgba(255, 24, 1, 0.0)');
      glowGrad.addColorStop(0.75, 'rgba(255, 24, 1, 0.12)');
      glowGrad.addColorStop(0.95, 'rgba(255, 24, 1, 0.45)');
      glowGrad.addColorStop(1, 'rgba(255, 24, 1, 0.0)');

      ctx.beginPath();
      ctx.arc(center[0], center[1], radius * 1.07, 0, 2 * Math.PI);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // 2. Globe Sphere (Deep Carbon Ocean)
      const oceanGrad = ctx.createRadialGradient(
        center[0] - radius * 0.35,
        center[1] - radius * 0.35,
        radius * 0.1,
        center[0],
        center[1],
        radius
      );
      oceanGrad.addColorStop(0, '#0F1626');
      oceanGrad.addColorStop(0.7, '#070A10');
      oceanGrad.addColorStop(1, '#030407');

      ctx.beginPath();
      ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
      ctx.fillStyle = oceanGrad;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      // 3. Graticule Lines (Subtle Lat/Long Grid)
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // 4. Landmass Polygons
      ctx.beginPath();
      path(land);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 5. Draw Interactive Circuit Pins
      const pulseSize = 4 + Math.sin(time * 0.006) * 3;
      const zoomFactor = radius / defaultScale;
      const activeCircuits = circuitsRef.current;
      const selectedId = selectedCircuitRef.current?.id;
      const hoveredId = hoveredCircuitRef.current?.id;

      for (const circuit of activeCircuits) {
        const coords: [number, number] = [circuit.lng, circuit.lat];
        // Test visibility on forward hemisphere
        const isVisible = d3.geoDistance(coords, [-rotationRef.current[0], -rotationRef.current[1]]) < 1.55;

        if (isVisible) {
          const pt = projection(coords);
          if (pt) {
            const isSelected = selectedId === circuit.id;
            const isHovered = hoveredId === circuit.id;
            const isHighlighted = isSelected || isHovered;

            // Vibrant Pulsating Radar Ring
            ctx.beginPath();
            const ringRadius = isHighlighted
              ? Math.max(12, pulseSize * 2.8 * Math.sqrt(zoomFactor))
              : Math.max(6, 6 * Math.sqrt(zoomFactor));
            ctx.arc(pt[0], pt[1], ringRadius, 0, 2 * Math.PI);
            ctx.fillStyle = isHighlighted
              ? 'rgba(255, 24, 1, 0.45)'
              : 'rgba(255, 255, 255, 0.16)';
            ctx.fill();

            // Core Pin Dot
            ctx.beginPath();
            const pinRadius = isHighlighted
              ? Math.max(5.5, 6.5 * Math.sqrt(zoomFactor))
              : Math.max(3, 3.8 * Math.sqrt(zoomFactor));
            ctx.arc(pt[0], pt[1], pinRadius, 0, 2 * Math.PI);
            ctx.fillStyle = isHighlighted ? '#FF1801' : '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = isHighlighted ? 2.2 : 0.8;
            ctx.stroke();

            // Floating Label on Globe for selected / hovered
            if (isHighlighted) {
              const labelX = pt[0] + 14;
              const labelY = pt[1] - 4;

              // Backplate pill
              ctx.fillStyle = 'rgba(7, 10, 16, 0.88)';
              ctx.strokeStyle = '#FF1801';
              ctx.lineWidth = 1;
              const textWidth = Math.max(120, circuit.circuit_name.length * 6.5);
              ctx.beginPath();
              ctx.roundRect(labelX - 4, labelY - 12, textWidth, 26, 4);
              ctx.fill();
              ctx.stroke();

              // Track name
              ctx.font = '700 11px -apple-system, monospace';
              ctx.fillStyle = '#FFFFFF';
              ctx.fillText(circuit.circuit_name, labelX + 4, labelY);

              // Country & spec
              ctx.font = '600 9px monospace';
              ctx.fillStyle = '#FF1801';
              ctx.fillText(`${circuit.location}, ${circuit.country_code} • ${circuit.length_km}km`, labelX + 4, labelY + 10);
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    }

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [land, defaultScale]);

  // Accurate Hit-Testing accounting for canvas resolution scaling & current zoom
  const findCircuitAtPoint = (clientX: number, clientY: number): Circuit | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const width = canvas.width;
    const height = canvas.height;

    const projection = d3
      .geoOrthographic()
      .scale(zoomScaleRef.current)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate(rotationRef.current);

    const zoomRatio = zoomScaleRef.current / defaultScale;
    const hitRadius = Math.max(16, 22 * Math.sqrt(zoomRatio));

    for (const circuit of circuitsRef.current) {
      const coords: [number, number] = [circuit.lng, circuit.lat];
      const isVisible = d3.geoDistance(coords, [-rotationRef.current[0], -rotationRef.current[1]]) < 1.55;

      if (isVisible) {
        const pt = projection(coords);
        if (pt) {
          const dist = Math.hypot(pt[0] - x, pt[1] - y);
          if (dist <= hitRadius) {
            return circuit;
          }
        }
      }
    }
    return null;
  };

  // Pointer Handlers (Drag, Grab, and Click)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Interrupt any ongoing fly animation if user grabs globe
    if (isFlyingRef.current && flyAnimationIdRef.current) {
      cancelAnimationFrame(flyAnimationIdRef.current);
      flyAnimationIdRef.current = null;
      isFlyingRef.current = false;
    }

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartPosRef.current = [e.clientX, e.clientY];
    lastMousePosRef.current = [e.clientX, e.clientY];
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current[0];
      const dy = e.clientY - lastMousePosRef.current[1];
      const totalDist = Math.hypot(
        e.clientX - dragStartPosRef.current[0],
        e.clientY - dragStartPosRef.current[1]
      );

      if (totalDist > 5) {
        hasMovedRef.current = true;
      }

      lastMousePosRef.current = [e.clientX, e.clientY];

      // Drag sensitivity inversely proportional to zoom
      const zoomRatio = defaultScale / zoomScaleRef.current;
      const sensitivity = 0.38 * Math.min(1.2, Math.max(0.4, zoomRatio));

      rotationRef.current[0] += dx * sensitivity;
      rotationRef.current[1] = Math.max(-78, Math.min(78, rotationRef.current[1] - dy * sensitivity));

      // Clear hover while actively rotating
      if (hoveredCircuitRef.current) {
        hoveredCircuitRef.current = null;
        setHoveredCircuit(null);
      }
    } else {
      // Hit-test on hover
      const found = findCircuitAtPoint(e.clientX, e.clientY);
      hoveredCircuitRef.current = found;
      setHoveredCircuit(found);
      const rect = canvas.getBoundingClientRect();
      setTooltipPos(found ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasDragging = isDraggingRef.current;
    const moved = hasMovedRef.current;

    isDraggingRef.current = false;
    hasMovedRef.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore if pointer capture already released
    }

    // If movement was minimal, treat as tap / click
    if (wasDragging && !moved) {
      const clicked = findCircuitAtPoint(e.clientX, e.clientY);
      if (clicked) {
        onSelectCircuit(clicked);
        flyToCircuit(clicked);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] flex items-center justify-center select-none overflow-hidden rounded-lg bg-[#07090E] border border-white/[0.08] shadow-2xl"
    >
      {/* 3D Earth Canvas */}
      <canvas
        ref={canvasRef}
        width={720}
        height={460}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full max-w-[720px] max-h-[460px] block touch-none ${
          hoveredCircuit ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
        }`}
      />

      {/* Top Left: Floating Instructions HUD */}
      <div className="absolute top-4 left-4 f1-pill px-3 py-1.5 flex items-center gap-2 text-xs border border-white/[0.1] shadow-lg">
        <Globe className="w-3.5 h-3.5 text-[#FF1801] animate-pulse" />
        <span className="font-bold text-white font-mono">Interactive 3D Earth</span>
        <span className="text-neutral-400 font-mono text-[11px] hidden sm:inline">
          • Drag to orbit • Pinch / Scroll to zoom • Tap pin to select
        </span>
      </div>

      {/* Top Right: Tactile Zoom & Auto-Rotate Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 rounded-md bg-[#0D111A]/90 border border-white/[0.12] backdrop-blur-md shadow-xl z-10">
        <button
          onClick={handleZoomIn}
          title="Zoom In (or pinch trackpad)"
          className="w-7 h-7 rounded flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#FF1801] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out (or pinch trackpad)"
          className="w-7 h-7 rounded flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#FF1801] transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          title="Reset Zoom & Center View"
          className="w-7 h-7 rounded flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-white/[0.15] mx-0.5" />
        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          title={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
            autoRotate
              ? 'text-[#FF1801] bg-[#FF1801]/10 hover:bg-[#FF1801]/20'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.1]'
          }`}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[10px] font-mono text-neutral-400 px-1.5 hidden sm:inline">
          {isNaN(zoomPercent) ? 100 : zoomPercent}%
        </span>
      </div>

      {/* Interactive Floating Hover Card at Cursor */}
      {hoveredCircuit && tooltipPos && (
        <div
          className="absolute p-3 rounded-lg pointer-events-none text-xs space-y-1 z-20 shadow-2xl animate-fadeIn border-l-2 border-[#FF1801] bg-[#0A0D15]/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_0_25px_rgba(255,24,1,0.25)]"
          style={{
            left: `${Math.min(520, Math.max(20, tooltipPos.x + 16))}px`,
            top: `${Math.min(340, Math.max(20, tooltipPos.y - 24))}px`,
          }}
        >
          <div className="font-bold text-white flex items-center gap-1.5 font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#FF1801]" />
            {hoveredCircuit.circuit_name}
          </div>
          <div className="text-[10px] text-neutral-300 font-mono">
            {hoveredCircuit.location}, {hoveredCircuit.country} • {hoveredCircuit.length_km} km
          </div>
          <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 pt-1 border-t border-white/[0.08]">
            <span>Tap to inspect track layout</span>
            <ChevronRight className="w-3 h-3 text-[#FF1801]" />
          </div>
        </div>
      )}

      {/* Selected Target Circuit Coordinates Badge */}
      {selectedCircuit && (
        <div className="absolute bottom-4 left-4 p-3.5 rounded-lg flex items-center gap-3 border-l-2 border-[#FF1801] bg-[#0A0E17]/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl animate-fadeIn">
          <div className="p-2 rounded-md bg-[#FF1801]/15 text-[#FF1801] border border-[#FF1801]/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-white font-mono">{selectedCircuit.circuit_name}</div>
            <div className="text-[10px] font-mono text-neutral-400">
              {selectedCircuit.lat.toFixed(4)}° N, {selectedCircuit.lng.toFixed(4)}° E • {selectedCircuit.country}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
