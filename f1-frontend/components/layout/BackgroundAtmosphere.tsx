'use client';

import React, { useMemo } from 'react';

import { FlutteringFinishFlag } from './FlutteringFinishFlag';

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function BackgroundAtmosphere() {
  // Generate deterministic particles for ambient racing atmosphere
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.3 + 2) % 100}%`,
      top: `${(i * 7.9 + 5) % 100}%`,
      size: (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5),
      duration: 10 + (i % 6) * 3,
      delay: (i * 0.7) % 8,
      color: i % 4 === 0 ? 'rgba(225, 6, 0, 0.4)' : i % 3 === 0 ? 'rgba(39, 244, 210, 0.3)' : 'rgba(255, 255, 255, 0.25)',
    }));
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Active Fluttering F1 Race Finish Flag (Cloth Physics & 3D Wave Shading on Laptop/Desktop) */}
      <div className="hidden sm:block">
        <FlutteringFinishFlag opacity={0.36} />
      </div>

      {/* Subtle Atmospheric Ambient Red & Cyan Radial Flares (GPU accelerated) */}
      <div
        className="absolute -top-[15%] left-[10%] w-[500px] h-[400px] rounded-full blur-[60px] opacity-25 pointer-events-none transform-gpu will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(225,6,0,0.45) 0%, rgba(225,6,0,0) 70%)',
        }}
      />
      <div
        className="absolute top-[40%] -right-[10%] w-[450px] h-[350px] rounded-full blur-[60px] opacity-20 pointer-events-none transform-gpu will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(39,244,210,0.35) 0%, rgba(39,244,210,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-[20%] left-[30%] w-[550px] h-[350px] rounded-full blur-[60px] opacity-20 pointer-events-none transform-gpu will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(225,6,0,0.3) 0%, rgba(225,6,0,0) 70%)',
        }}
      />

      {/* Speed Particle Layer */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full animate-speed-particle pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle Racing Apex Speed Streaks */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
        <defs>
          <linearGradient id="speedStreakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#E10600" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M -100 200 Q 400 350 1200 100"
          stroke="url(#speedStreakGrad)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="120 400"
          className="animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <path
          d="M 200 800 Q 800 600 1800 900"
          stroke="url(#speedStreakGrad)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="180 500"
          className="animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
      </svg>
    </div>
  );
}
