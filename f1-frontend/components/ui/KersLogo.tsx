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
  const markWidth = Math.round(size * (84 / 46));

  const getMarkFill = () => {
    if (colorScheme === 'white') return '#FFFFFF';
    if (colorScheme === 'gradient') return 'url(#kersSpeedGrad)';
    return 'url(#kersRedGrad)';
  };

  const renderEmblem = () => {
    const viewBox = "0 0 84 46";
    const width = markWidth;
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
            @keyframes kersStripeFadeIn {
              0% {
                opacity: 0;
                transform: translateX(-32px);
              }
              25% {
                opacity: 0.25;
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes kersBodyFadeIn {
              0% {
                opacity: 0;
                transform: scale(0.96);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }

            .kers-line-1 {
              animation: ${animated ? 'kersStripeFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both' : 'none'};
            }
            .kers-line-2 {
              animation: ${animated ? 'kersStripeFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both' : 'none'};
            }
            .kers-line-3 {
              animation: ${animated ? 'kersStripeFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.36s both' : 'none'};
            }
            .kers-line-4 {
              animation: ${animated ? 'kersStripeFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.48s both' : 'none'};
            }
            .kers-line-5 {
              animation: ${animated ? 'kersStripeFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.60s both' : 'none'};
            }
            .kers-k-body {
              animation: ${animated ? 'kersBodyFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both' : 'none'};
            }
          `}
        </style>

        {/* Forward-Raked 16° Aerodynamic Trajectory */}
        <g transform="skewX(-16) translate(12, 0)">
          {/* 
            The Letter K and 5 Horizontal Speed Bars
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
            <g className="kers-k-body">
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
          </g>
        </g>
      </svg>
    );
  };

  const f1BadgeStyle =
    colorScheme === 'white'
      ? 'text-white bg-black/35 border border-white/40 shadow-sm'
      : 'text-[#FF1801] bg-[#FF1801]/15 border border-[#FF1801]/30';

  const ersTextElement = (
    <span
      className={`inline-flex items-center gap-1.5 select-none ${
        animated ? 'animate-kersErs' : ''
      }`}
    >
      <span
        className={`font-mono font-black italic tracking-[0.14em] text-white ${textClassName}`}
        style={{
          fontSize: `${Math.round(size * 0.74)}px`,
          lineHeight: 1,
          marginLeft: `-${Math.round(size * 0.08)}px`,
        }}
      >
        ERS
      </span>
      <span
        className={`font-mono font-black italic tracking-tight px-1 py-0.5 rounded leading-none select-none inline-block ${f1BadgeStyle}`}
        style={{
          fontSize: `${Math.max(9, Math.round(size * 0.54))}px`,
        }}
      >
        F1
      </span>
    </span>
  );

  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="relative p-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-md flex items-center justify-center">
          {renderEmblem()}
        </div>
        {showText && (
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className={`font-mono font-black italic tracking-[0.16em] text-white text-base ${textClassName}`}>
                ERS
              </span>
              <span className={`text-[9px] font-mono font-black italic tracking-tight px-1 py-0.5 rounded uppercase ${f1BadgeStyle}`}>
                F1
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

  if (variant === 'full' || showText) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        {renderEmblem()}
        {ersTextElement}
        {subtitle && (
          <span className="text-[8px] font-mono text-neutral-400 tracking-wider ml-2 uppercase">
            {subtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {renderEmblem()}
    </div>
  );
}

