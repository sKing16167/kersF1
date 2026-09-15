'use client';

import React from 'react';

interface KersLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  variant?: 'mark-only' | 'full' | 'badge';
  colorScheme?: 'gradient' | 'white' | 'f1-red';
  subtitle?: string;
  animated?: boolean;
}

export function KersLogo({
  size = 28,
  className = '',
  showText = true,
  textClassName = '',
  variant = 'mark-only',
  colorScheme = 'f1-red',
  subtitle,
  animated = false,
}: KersLogoProps) {
  const markWidth = Math.round(size * 1.7);
  const fullWidth = Math.round(size * 3.6);

  const getMarkFill = () => {
    if (colorScheme === 'white') return '#FFFFFF';
    if (colorScheme === 'gradient') return 'url(#kersSpeedGrad)';
    return 'url(#kersRedGrad)';
  };

  const renderEmblem = (isFull: boolean = false) => {
    const viewBox = isFull ? "0 0 170 46" : "0 0 84 46";
    const width = isFull ? fullWidth : markWidth;
    const height = size;

    return (
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none block ${animated ? 'animate-kersLogo' : ''}`}
      >
        <defs>
          {/* F1 Precision Motorsport Red Gradient for the K Mark */}
          <linearGradient id="kersRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3333" />
            <stop offset="40%" stopColor="#FF1801" />
            <stop offset="100%" stopColor="#E10600" />
          </linearGradient>

          {/* Supersonic Speed Gradient (Cyan -> Blue -> Purple -> Magenta) */}
          <linearGradient id="kersSpeedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B4D8" />
            <stop offset="30%" stopColor="#4361EE" />
            <stop offset="70%" stopColor="#7209B7" />
            <stop offset="100%" stopColor="#B5179E" />
          </linearGradient>

          {/* Subtle aero drop shadow glow for the red K */}
          <filter id="kersRedGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#E10600" floodOpacity="0.45" />
          </filter>
        </defs>

        <style>
          {`
            @keyframes speedLineSlide {
              0% { opacity: 0; transform: translateX(-14px); }
              100% { opacity: 1; transform: translateX(0); }
            }
            .kers-line-1 { animation: ${animated ? 'speedLineSlide 0.5s ease-out forwards' : 'none'}; }
            .kers-line-2 { animation: ${animated ? 'speedLineSlide 0.6s ease-out forwards' : 'none'}; }
            .kers-line-3 { animation: ${animated ? 'speedLineSlide 0.7s ease-out forwards' : 'none'}; }
            .kers-line-4 { animation: ${animated ? 'speedLineSlide 0.8s ease-out forwards' : 'none'}; }
            .kers-line-5 { animation: ${animated ? 'speedLineSlide 0.9s ease-out forwards' : 'none'}; }
          `}
        </style>

        {/* Forward-Raked 18° Aerodynamic Trajectory */}
        <g transform="skewX(-16) translate(12, 0)">
          {/* 
            The Letter K and 5 Horizontal Speed Bars in Precision F1 Red
            Top bar is longest & tapered, bottom bar is shortest.
          */}
          <g fill={getMarkFill()} filter={colorScheme === 'f1-red' ? 'url(#kersRedGlow)' : undefined}>
            {/* Speed Bar 1 (Top / Longest / Sharp Tapered Tip) */}
            <path
              d="M 2 5 L 40 5 L 40 9 L 14 9 Z"
              className="kers-line-1"
            />

            {/* Speed Bar 2 */}
            <path
              d="M 12 12.5 L 40 12.5 L 40 16.5 L 18 16.5 Z"
              className="kers-line-2"
            />

            {/* Speed Bar 3 (Middle) */}
            <path
              d="M 18 20 L 40 20 L 40 24 L 23 24 Z"
              className="kers-line-3"
            />

            {/* Speed Bar 4 */}
            <path
              d="M 23 27.5 L 40 27.5 L 40 31.5 L 28 31.5 Z"
              className="kers-line-4"
            />

            {/* Speed Bar 5 (Bottom / Shortest) */}
            <path
              d="M 27 35 L 40 35 L 40 39 L 32 39 Z"
              className="kers-line-5"
            />

            {/* 
              The Letter K Body:
              - Solid Vertical Stem
              - Upper High-Downforce Arm
              - Lower Traction Leg
            */}
            {/* Vertical Spine */}
            <path
              d="M 39 5 L 47 5 L 47 41 L 39 41 Z"
            />

            {/* Upper Diagonal Arm */}
            <path
              d="M 47 25 L 61 5 L 72 5 L 52 30 Z"
            />

            {/* Lower Diagonal Leg */}
            <path
              d="M 50 23 L 73 41 L 62 41 L 44 28 Z"
            />
          </g>

          {/* Full Wordmark for E, R, S if isFull */}
          {isFull && (
            <g fill={colorScheme === 'white' ? '#FFFFFF' : '#FFFFFF'}>
              {/* Solid Motorsport E */}
              <path
                d="M 78 5 L 102 5 L 102 12.5 L 86 12.5 L 86 19 L 100 19 L 100 26.5 L 86 26.5 L 86 33.5 L 102 33.5 L 102 41 L 78 41 Z"
              />

              {/* Solid Motorsport R */}
              <path
                d="M 108 5 L 126 5 C 131 5 134 7.5 134 12 L 134 18 C 134 22.5 131 24.5 126 24.5 L 116 24.5 L 116 41 L 108 41 Z M 116 12.5 L 125 12.5 C 126.5 12.5 127 13.5 127 15 L 127 16 C 127 17.5 126.5 18.5 125 18.5 L 116 18.5 Z"
              />
              <path
                d="M 121 22.5 L 135 41 L 125 41 L 114 26 Z"
              />

              {/* Solid Motorsport S */}
              <path
                d="M 141 5 L 165 5 L 165 12.5 L 149 12.5 L 149 19 L 165 19 L 165 37 C 165 40 162 41 158 41 L 139 41 L 139 33.5 L 157 33.5 L 157 26.5 L 141 26.5 L 141 9 C 141 6 144 5 148 5 Z"
              />
            </g>
          )}
        </g>
      </svg>
    );
  };

  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="relative p-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-md flex items-center justify-center">
          {renderEmblem(false)}
        </div>
        {showText && (
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className={`font-mono font-black italic tracking-[0.18em] text-white text-base ${textClassName}`}>
                KERS
              </span>
              <span className="text-[8px] font-mono font-bold tracking-widest text-neutral-400 px-1 py-0.2 rounded bg-white/[0.08] border border-white/[0.08] uppercase">
                PRO
              </span>
            </div>
            {subtitle && (
              <span className="text-[9px] font-mono text-neutral-400 tracking-wider mt-0.5 uppercase">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem(true)}
      </div>
    );
  }

  if (showText) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {renderEmblem(false)}
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-mono font-black italic tracking-[0.2em] text-white text-sm ${textClassName}`}>
              KERS
            </span>
          </div>
          {subtitle && (
            <span className="text-[8px] font-mono text-neutral-400 tracking-wider mt-0.5 uppercase">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {renderEmblem(false)}
    </div>
  );
}
