'use client';

import React from 'react';

/**
 * Optical Glass Refraction & Light-Bending SVG Filter Definitions
 * Provides physical caustics and light-bending displacement maps
 * exactly mimicking the user's reference snippet:
 * backdrop-filter: url(#lg) blur(3px) saturate(180%);
 */
export function GlassRefractionDefs() {
  return (
    <svg
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        clip: 'rect(1px, 1px, 1px, 1px)',
        clipPath: 'inset(50%)',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Physical Optical Glass Refraction Filter (id="lg") */}
        <filter id="lg" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.024"
            numOctaves={3}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={20}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        {/* High-Definition Motorsport Caustics & Grid Warping (id="kers-refract") */}
        <filter id="kers-refract" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008 0.016"
            numOctaves={2}
            result="wave"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wave"
            scale={24}
            xChannelSelector="R"
            yChannelSelector="G"
            result="warped"
          />
        </filter>

        {/* Subtle Lens Refraction for Smaller UI Cards */}
        <filter id="kers-refract-subtle" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.04"
            numOctaves={2}
            result="fineNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="fineNoise"
            scale={12}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
