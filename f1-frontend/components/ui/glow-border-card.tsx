'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlowBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  aspectRatio?: string;
  borderRadius?: string;
  animationDuration?: number;
  gradientColors?: string[];
  borderWidth?: string;
  blurAmount?: string;
  inset?: string;
  colorPreset?: 'nature' | 'ocean' | 'sunset' | 'aurora' | 'f1_red' | 'custom';
  paused?: boolean;
}

const colorPresets: Record<string, string[]> = {
  f1_red: ['#E10600', '#FF2800', '#FF5500', '#FFAA00', '#FF1801', '#E10600', '#900000', '#FF2800', '#FF5000', '#E10600'],
  sunset: ['#ff6600', '#ff7711', '#ff8822', '#ff9900', '#ffaa22', '#ffbb44', '#ffcc00', '#ff9933', '#ff7722', '#ff6600'],
  aurora: ['#00ff87', '#22ffaa', '#44ffcc', '#60efff', '#88ddff', '#bb99ff', '#dd77ee', '#ff68f0', '#ff55cc', '#00ff87'],
  ocean: ['#006699', '#1177aa', '#2288bb', '#3399cc', '#44aadd', '#55bbee', '#66ccff', '#44bbee', '#2299cc', '#006699'],
  nature: ['#669900', '#88bb22', '#99cc33', '#aaddaa', '#ccee66', '#006699', '#228888', '#3399cc', '#55aacc', '#669900'],
  custom: ['#E10600', '#FF2800', '#FF5500', '#FFAA00', '#FF1801', '#E10600', '#900000', '#FF2800', '#FF5000', '#E10600'],
};

export const GlowBorderCard = React.forwardRef<HTMLDivElement, GlowBorderCardProps>(
  (
    {
      children,
      className,
      width = '100%',
      height,
      aspectRatio,
      borderRadius = '1.5rem',
      animationDuration = 5,
      gradientColors,
      borderWidth = '1.25em',
      blurAmount = '0.85em',
      inset = '-1em',
      colorPreset = 'f1_red',
      paused = false,
      style,
      ...props
    },
    ref
  ) => {
    const colors = gradientColors || colorPresets[colorPreset] || colorPresets.f1_red;

    const colorVars: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      colorVars[`--glow-color-${i + 1}`] = colors[i % colors.length];
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden grid place-content-center isolate',
          'bg-[#080B11]/90 backdrop-blur-2xl border border-white/[0.08]',
          className
        )}
        style={
          {
            width: width,
            height: height || 'auto',
            aspectRatio: height ? 'unset' : aspectRatio || 'unset',
            borderRadius: borderRadius,
            '--glow-animation-duration': `${animationDuration}s`,
            ...colorVars,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Glow Pseudo-Element Replacer */}
        <div
          className={cn(
            'absolute -z-10 border-solid rounded-[inherit]',
            'glow-conic',
            paused && '[animation-play-state:paused]'
          )}
          style={{
            inset: inset,
            borderWidth: borderWidth,
            filter: `blur(${blurAmount})`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 w-full h-full bg-transparent flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    );
  }
);

GlowBorderCard.displayName = 'GlowBorderCard';

export default GlowBorderCard;
