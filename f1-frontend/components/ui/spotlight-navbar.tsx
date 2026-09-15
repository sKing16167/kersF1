'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
}

export interface SpotlightNavbarProps {
  items?: NavItem[];
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
  activeIndex?: number;
}

export function SpotlightNavbar({
  items = [
    { label: 'Overview', href: '/' },
    { label: 'Circuits & Globe', href: '/circuits' },
    { label: 'Track Map', href: '/track-map' },
    { label: 'Ghosting Arena', href: '/ghosting-arena' },
    { label: 'Strategy', href: '/strategy' },
    { label: 'Radio', href: '/radio' },
    { label: 'Drivers', href: '/drivers' },
  ],
  className,
  onItemClick,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;
  const [hoverX, setHoverX] = useState<number | null>(null);

  // Refs for the light positions so we animate them imperatively
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty('--spotlight-x', `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty('--spotlight-x', `${v}px`);
          },
        });
      }
    };

    nav.addEventListener('mousemove', handleMouseMove);
    nav.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      nav.removeEventListener('mousemove', handleMouseMove);
      nav.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty('--ambience-x', `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    setInternalActiveIndex(index);
    onItemClick?.(item, index);
  };

  return (
    <div className={cn('relative flex justify-center', className)}>
      <nav
        ref={navRef}
        className={cn(
          'relative h-10 rounded-full transition-all duration-300 overflow-hidden',
          'bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl shadow-lg shadow-black/40'
        )}
      >
        {/* Content */}
        <ul className="relative flex items-center h-full px-2 gap-0.5 z-[10]">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <li key={idx} className="relative h-full flex items-center justify-center">
                <a
                  href={item.href}
                  data-index={idx}
                  onClick={(e) => {
                    handleItemClick(item, idx);
                  }}
                  className={cn(
                    'px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 rounded-full',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50',
                    isActive
                      ? 'text-white bg-white/[0.08] shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* 1. Moving Spotlight (Follows Mouse) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `radial-gradient(120px circle at var(--spotlight-x) 100%, rgba(225,6,0,0.2) 0%, transparent 60%)`,
          }}
        />

        {/* 2. Active State Ambience (Under Active Item) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
          style={{
            background: `radial-gradient(60px circle at var(--ambience-x) 0%, #E10600 0%, transparent 100%)`,
          }}
        />
      </nav>
    </div>
  );
}
