'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import countriesData from 'world-atlas/countries-110m.json';
import { Circuit } from '@/lib/types';
import { Compass, RotateCw, MapPin, Globe, ChevronRight, Activity } from 'lucide-react';

interface GlobeViewProps {
  circuits: Circuit[];
  selectedCircuit: Circuit | null;
  onSelectCircuit: (circuit: Circuit) => void;
}

export function GlobeView({ circuits, selectedCircuit, onSelectCircuit }: GlobeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<[number, number]>([0, -20]);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<[number, number]>([0, 0]);
  const lastMousePosRef = useRef<[number, number]>([0, 0]);
  const animationFrameRef = useRef<number | null>(null);
  const [hoveredCircuit, setHoveredCircuit] = useState<Circuit | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Convert TopoJSON to GeoJSON
  const land = feature(countriesData as any, countriesData.objects.countries as any);

  // Smoothly rotate globe to target circuit coordinates
  const flyToCircuit = useCallback((target: Circuit) => {
    const targetRotation: [number, number] = [-target.lng, -target.lat];
    const startRotation = rotationRef.current;
    const interpolator = d3.interpolate(startRotation, targetRotation);

    const startTime = performance.now();
    const duration = 1200; // 1.2s smooth fly-in

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      rotationRef.current = interpolator(ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (selectedCircuit) {
      flyToCircuit(selectedCircuit);
    }
  }, [selectedCircuit, flyToCircuit]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    const projection = d3
      .geoOrthographic()
      .scale(width / 2.3)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath(projection, ctx);
    const graticule = d3.geoGraticule10();

    let autoRotate = true;

    function render(time: number) {
      if (!ctx || !canvas) return;

      // Auto rotation when idle
      if (!isDraggingRef.current && autoRotate && !selectedCircuit && !hoveredCircuit) {
        rotationRef.current[0] += 0.2;
      }

      projection.rotate(rotationRef.current);

      ctx.clearRect(0, 0, width, height);

      // 1. Globe Ambient Shadow & Atmosphere Glow
      const center = projection.translate();
      const radius = projection.scale();

      const glowGrad = ctx.createRadialGradient(
        center[0],
        center[1],
        radius * 0.85,
        center[0],
        center[1],
        radius * 1.05
      );
      glowGrad.addColorStop(0, 'rgba(225, 6, 0, 0.0)');
      glowGrad.addColorStop(0.8, 'rgba(225, 6, 0, 0.08)');
      glowGrad.addColorStop(1, 'rgba(225, 6, 0, 0.25)');

      ctx.beginPath();
      ctx.arc(center[0], center[1], radius * 1.04, 0, 2 * Math.PI);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // 2. Globe Sphere (Ocean Base)
      const oceanGrad = ctx.createRadialGradient(
        center[0] - radius * 0.3,
        center[1] - radius * 0.3,
        radius * 0.1,
        center[0],
        center[1],
        radius
      );
      oceanGrad.addColorStop(0, '#0D1420');
      oceanGrad.addColorStop(1, '#05070A');

      ctx.beginPath();
      ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
      ctx.fillStyle = oceanGrad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // 3. Graticule Lines (Lat/Long grid)
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // 4. Landmass Polygons
      ctx.beginPath();
      path(land);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // 5. Draw Interactive Circuit Pins on the Globe
      const pulseSize = 4 + Math.sin(time * 0.005) * 3;

      for (const circuit of circuits) {
        const coords: [number, number] = [circuit.lng, circuit.lat];
        const isVisible = d3.geoDistance(coords, [-rotationRef.current[0], -rotationRef.current[1]]) < Math.PI / 2;

        if (isVisible) {
          const pt = projection(coords);
          if (pt) {
            const isSelected = selectedCircuit?.id === circuit.id;
            const isHovered = hoveredCircuit?.id === circuit.id;

            // Pulsating Radar Ring
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], isSelected || isHovered ? pulseSize * 2.4 : 5, 0, 2 * Math.PI);
            ctx.fillStyle = isSelected || isHovered
              ? 'rgba(225, 6, 0, 0.35)'
              : 'rgba(255, 255, 255, 0.15)';
            ctx.fill();

            // Core Pin Dot
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], isSelected || isHovered ? 5.5 : 3, 0, 2 * Math.PI);
            ctx.fillStyle = isSelected || isHovered ? '#E10600' : '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = isSelected || isHovered ? 2 : 0.75;
            ctx.stroke();

            // Floating Label on Globe for selected / hovered
            if (isSelected || isHovered) {
              ctx.font = '600 11px -apple-system, sans-serif';
              ctx.fillStyle = '#FFFFFF';
              ctx.fillText(circuit.circuit_name, pt[0] + 12, pt[1] - 4);
              ctx.font = '500 9px monospace';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.fillText(`${circuit.location}, ${circuit.country_code}`, pt[0] + 12, pt[1] + 8);
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
  }, [land, circuits, selectedCircuit, hoveredCircuit]);

  // Hit-Testing: Find circuit under mouse/touch
  const findCircuitAtPoint = (clientX: number, clientY: number): Circuit | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    const projection = d3
      .geoOrthographic()
      .scale(width / 2.3)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate(rotationRef.current);

    for (const circuit of circuits) {
      const coords: [number, number] = [circuit.lng, circuit.lat];
      const isVisible = d3.geoDistance(coords, [-rotationRef.current[0], -rotationRef.current[1]]) < Math.PI / 2;

      if (isVisible) {
        const pt = projection(coords);
        if (pt) {
          const dist = Math.hypot(pt[0] - x, pt[1] - y);
          if (dist <= 18) {
            return circuit;
          }
        }
      }
    }
    return null;
  };

  // Pointer Handlers with Drag & Click Discrimination
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
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
      lastMousePosRef.current = [e.clientX, e.clientY];

      rotationRef.current[0] += dx * 0.4;
      rotationRef.current[1] = Math.max(-80, Math.min(80, rotationRef.current[1] - dy * 0.4));
      setHoveredCircuit(null);
    } else {
      // Hit-test on hover
      const found = findCircuitAtPoint(e.clientX, e.clientY);
      setHoveredCircuit(found);
      const rect = canvas.getBoundingClientRect();
      setTooltipPos(found ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Calculate total drag displacement
    const dx = Math.abs(e.clientX - dragStartPosRef.current[0]);
    const dy = Math.abs(e.clientY - dragStartPosRef.current[1]);

    // If movement < 6px, treat as click / tap
    if (dx < 6 && dy < 6) {
      const clicked = findCircuitAtPoint(e.clientX, e.clientY);
      if (clicked) {
        onSelectCircuit(clicked);
      }
    }
  };

  return (
    <div className="relative w-full h-[440px] flex items-center justify-center select-none overflow-hidden rounded-3xl bg-black/30 border border-white/[0.06]">
      {/* 3D Earth Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={440}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-full h-full max-w-[640px] max-h-[440px] block ${
          hoveredCircuit ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
        }`}
      />

      {/* Floating Instructions HUD */}
      <div className="absolute top-4 left-4 ios-pill px-3 py-1.5 flex items-center gap-2 text-xs">
        <Globe className="w-3.5 h-3.5 text-[#E10600]" />
        <span className="font-semibold text-white">Interactive 3D Earth</span>
        <span className="text-neutral-500">• Tap any red pin to inspect track</span>
      </div>

      {/* Interactive Floating Hover Card at Cursor */}
      {hoveredCircuit && tooltipPos && (
        <div
          className="absolute ios-glass p-3 rounded-2xl pointer-events-none text-xs space-y-1 z-20 shadow-2xl animate-fadeIn border-l-2 border-[#E10600]"
          style={{
            left: `${Math.min(480, Math.max(20, tooltipPos.x + 15))}px`,
            top: `${Math.min(320, Math.max(20, tooltipPos.y - 20))}px`,
          }}
        >
          <div className="font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E10600]" />
            {hoveredCircuit.circuit_name}
          </div>
          <div className="text-[10px] text-neutral-400 font-mono">
            {hoveredCircuit.location}, {hoveredCircuit.country} • {hoveredCircuit.length_km} km
          </div>
          <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 pt-1 border-t border-white/[0.06]">
            <span>Tap to inspect optimal line</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Selected Target Circuit Coordinates Badge */}
      {selectedCircuit && (
        <div className="absolute bottom-4 left-4 ios-glass p-3.5 rounded-2xl flex items-center gap-3 border-l-2 border-[#E10600] animate-fadeIn">
          <div className="p-2 rounded-xl bg-red-600/20 text-[#E10600] border border-red-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-xs text-white">{selectedCircuit.circuit_name}</div>
            <div className="text-[10px] font-mono text-neutral-400">
              {selectedCircuit.lat.toFixed(4)}° N, {selectedCircuit.lng.toFixed(4)}° E • {selectedCircuit.country}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
