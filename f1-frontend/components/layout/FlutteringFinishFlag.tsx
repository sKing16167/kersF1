'use client';

import React, { useEffect, useRef } from 'react';

interface FlutteringFinishFlagProps {
  className?: string;
  opacity?: number;
}

export function FlutteringFinishFlag({
  className = '',
  opacity = 0.42,
}: FlutteringFinishFlagProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Grid resolution for checkered squares
    const COLS = 46;
    const ROWS = 28;
    const TOTAL_VERTICES = (COLS + 1) * (ROWS + 1);

    // Preallocated Float32Arrays for zero garbage collection
    const vX = new Float32Array(TOTAL_VERTICES);
    const vY = new Float32Array(TOTAL_VERTICES);
    const vLight = new Float32Array(TOTAL_VERTICES);

    // Interactive Drag State
    let isPointerDown = false;
    let dragEnergy = 0.0; // 0.0 = completely still, 1.0 = maximum flutter
    let accumulatedPhase = 0.0;
    let lastTime = performance.now();
    let isLoopRunning = false;
    let isVisible = !document.hidden;

    // Cursor tracking
    let cursorX = -1000;
    let cursorY = -1000;
    let prevCursorX = -1000;
    let prevCursorY = -1000;

    function render(now: number) {
      if (!isVisible) {
        isLoopRunning = false;
        return;
      }

      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Smooth decay when drag is released
      if (!isPointerDown) {
        dragEnergy *= 0.965; // Soft, smooth deceleration that gently calms down
        if (dragEnergy < 0.002) {
          dragEnergy = 0.0;
        }
      }

      // Advance wave phase smoothly and slowly according to drag energy
      accumulatedPhase += delta * (0.6 + 1.2 * dragEnergy) * (dragEnergy > 0 ? 1 : 0);

      ctx!.clearRect(0, 0, width, height);

      const cellW = width / COLS;
      const cellH = height / ROWS;

      // 1. Calculate vertex grid positions & wave displacement
      for (let r = 0; r <= ROWS; r++) {
        const v = r / ROWS;
        for (let c = 0; c <= COLS; c++) {
          const u = c / COLS;
          const idx = r * (COLS + 1) + c;

          const baseX = c * cellW;
          const baseY = r * cellH;

          if (dragEnergy <= 0.0001) {
            // Calm resting state: smooth checkered drape
            vX[idx] = baseX;
            vY[idx] = baseY;
            vLight[idx] = 1.0;
          } else {
            // Soothing, slow fluttering state: gentle rolling silk waves
            const wave1 = Math.sin(u * 4.2 + v * 1.5 - accumulatedPhase * 1.4);
            const wave2 = Math.sin(u * 7.5 - accumulatedPhase * 1.8 + v * 2.2) * 0.22;
            const wave3 = Math.cos(v * 3.8 - accumulatedPhase * 0.9 + u * 1.5) * 0.15;

            // Wide, smooth cursor disturbance swell
            let cursorDisturbance = 0;
            const distToCursor = Math.hypot(baseX - cursorX, baseY - cursorY);
            const rippleRadius = 450;
            if (distToCursor < rippleRadius) {
              const falloff = Math.cos((distToCursor / rippleRadius) * (Math.PI / 2));
              cursorDisturbance = Math.sin(distToCursor * 0.018 - accumulatedPhase * 1.6) * falloff * 0.38;
            }

            const totalZ = (wave1 + wave2 + wave3 + cursorDisturbance) * dragEnergy;

            // Soft physical cloth displacement (gentle stretch & ripple)
            const dx = Math.cos(u * 4.2 - accumulatedPhase * 1.4) * (6 * (0.3 + 0.7 * u)) * dragEnergy;
            const dy = totalZ * 13 * (0.4 + 0.6 * v);

            vX[idx] = baseX + dx;
            vY[idx] = baseY + dy;

            // Gentle slope derivative for subtle, silky lighting
            const slope =
              (Math.cos(u * 4.2 + v * 1.5 - accumulatedPhase * 1.4) * 0.45 +
                Math.cos(u * 7.5 - accumulatedPhase * 1.8 + v * 2.2) * 0.20) *
              dragEnergy;
            vLight[idx] = Math.max(0.6, Math.min(1.4, 1.0 + slope * 0.35));
          }
        }
      }

      // 2. Render checkered flag quad mesh
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const isWhiteSquare = (c + r) % 2 === 0;

          const idxTopLeft = r * (COLS + 1) + c;
          const idxTopRight = idxTopLeft + 1;
          const idxBottomLeft = (r + 1) * (COLS + 1) + c;
          const idxBottomRight = idxBottomLeft + 1;

          const avgLight =
            (vLight[idxTopLeft] +
              vLight[idxTopRight] +
              vLight[idxBottomLeft] +
              vLight[idxBottomRight]) *
            0.25;

          ctx!.beginPath();
          ctx!.moveTo(vX[idxTopLeft], vY[idxTopLeft]);
          ctx!.lineTo(vX[idxTopRight], vY[idxTopRight]);
          ctx!.lineTo(vX[idxBottomRight], vY[idxBottomRight]);
          ctx!.lineTo(vX[idxBottomLeft], vY[idxBottomLeft]);
          ctx!.closePath();

          if (isWhiteSquare) {
            // Fluid White/Silver Finish Line Silk
            const brightness = Math.min(255, Math.floor(215 * avgLight));
            const blueTint = Math.min(255, Math.floor(230 * avgLight));
            const alpha = 0.28 + 0.12 * dragEnergy;
            ctx!.fillStyle = `rgba(${brightness}, ${brightness}, ${blueTint}, ${alpha})`;
          } else {
            // Deep Carbon / Obsidian Squares
            const carbonLum = Math.min(65, Math.floor(18 * avgLight * 1.6));
            const alpha = 0.45 + 0.12 * dragEnergy;
            ctx!.fillStyle = `rgba(${carbonLum}, ${carbonLum + 3}, ${carbonLum + 8}, ${alpha})`;
          }

          ctx!.fill();
        }
      }

      // 3. Dynamic Sheen Overlay when dragging
      if (dragEnergy > 0.01) {
        const sheenGrad = ctx!.createLinearGradient(0, 0, width, height);
        sheenGrad.addColorStop(0, `rgba(255, 255, 255, ${0.05 * dragEnergy})`);
        sheenGrad.addColorStop(0.5, `rgba(255, 24, 1, ${0.04 * dragEnergy})`); // F1 red sheen
        sheenGrad.addColorStop(1, `rgba(0, 0, 0, ${0.12 * dragEnergy})`);
        ctx!.fillStyle = sheenGrad;
        ctx!.fillRect(0, 0, width, height);
      }

      // Continue loop only if energy is still dissipating
      if (dragEnergy > 0.0 || isPointerDown) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isLoopRunning = false;
      }
    }

    function ensureLoopRunning() {
      if (!isLoopRunning) {
        isLoopRunning = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Trigger redraw when resized
      ensureLoopRunning();
    }

    // Interaction handlers
    function startDrag(clientX: number, clientY: number) {
      isPointerDown = true;
      cursorX = clientX;
      cursorY = clientY;
      prevCursorX = clientX;
      prevCursorY = clientY;
      dragEnergy = Math.min(0.7, dragEnergy + 0.15);
      ensureLoopRunning();
    }

    function updateDrag(clientX: number, clientY: number, buttons: number) {
      const isDragging = isPointerDown || buttons > 0;
      
      const dx = clientX - (prevCursorX === -1000 ? clientX : prevCursorX);
      const dy = clientY - (prevCursorY === -1000 ? clientY : prevCursorY);
      const dist = Math.hypot(dx, dy);

      cursorX = clientX;
      cursorY = clientY;
      prevCursorX = clientX;
      prevCursorY = clientY;

      if (isDragging) {
        // Active mouse/touch drag: smooth, soothing flutter injection
        dragEnergy = Math.min(0.75, dragEnergy + dist * 0.005 + 0.03);
        ensureLoopRunning();
      } else if (dist > 20) {
        // Fast cursor swipe across background: gentle ambient ripple
        dragEnergy = Math.min(0.35, dragEnergy + dist * 0.002 + 0.01);
        ensureLoopRunning();
      }
    }

    function endDrag() {
      isPointerDown = false;
    }

    function onPointerDown(e: PointerEvent) {
      startDrag(e.clientX, e.clientY);
    }

    function onPointerMove(e: PointerEvent) {
      updateDrag(e.clientX, e.clientY, e.buttons);
    }

    function onPointerUp() {
      endDrag();
    }

    function handleVisibilityChange() {
      isVisible = !document.hidden;
      if (isVisible && dragEnergy > 0.001) {
        ensureLoopRunning();
      }
    }

    // Initial sizing and event listeners
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          filter: 'contrast(1.15) saturate(1.1)',
        }}
      />
      {/* Soft Vignette Mask to blend edges into deep background for glass card contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(6, 8, 12, 0.6) 70%, rgba(6, 8, 12, 0.95) 100%)',
        }}
      />
    </div>
  );
}
