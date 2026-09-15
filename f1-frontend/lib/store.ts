import { create } from 'zustand';
import { Driver, Race, Session } from './types';
import { MOCK_DRIVERS, MOCK_RACES } from './api';

export type ThemeType = 'obsidian' | 'scuderia' | 'petronas' | 'monaco';

interface TelemetryStoreState {
  // Season & Session
  season: number;
  races: Race[];
  selectedRace: Race | null;
  selectedSession: Session | null;
  drivers: Driver[];

  // Drivers for Telemetry Ghosting & Comparison
  driverA: Driver;
  driverB: Driver;

  // Cross-Component Telemetry Scrubber Sync
  activeDistanceM: number;
  circuitLengthM: number;
  isPlaying: boolean;
  playbackSpeed: number;

  // Intro Screen
  showIntro: boolean;
  setShowIntro: (showIntro: boolean) => void;

  // Visual Theme
  theme: ThemeType;

  // Actions
  setSeason: (season: number) => void;
  setRaces: (races: Race[]) => void;
  setSelectedRace: (race: Race) => void;
  setSelectedSession: (session: Session) => void;
  setDrivers: (drivers: Driver[]) => void;
  setDriverA: (driver: Driver) => void;
  setDriverB: (driver: Driver) => void;
  setActiveDistanceM: (distanceM: number) => void;
  setCircuitLengthM: (lengthM: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setTheme: (theme: ThemeType) => void;
  togglePlayback: () => void;
}

export const useTelemetryStore = create<TelemetryStoreState>((set) => ({
  season: 2026,
  races: MOCK_RACES,
  selectedRace: MOCK_RACES.find((r) => r.status === 'UPCOMING') || MOCK_RACES[16] || MOCK_RACES[0],
  selectedSession: (MOCK_RACES.find((r) => r.status === 'UPCOMING') || MOCK_RACES[16])?.sessions?.[3] || null,
  drivers: MOCK_DRIVERS,

  driverA: MOCK_DRIVERS[0], // Lando Norris (McLaren #FF8000)
  driverB: MOCK_DRIVERS[5], // Lewis Hamilton (Ferrari #E80020)

  activeDistanceM: 650, // Starts at Rettifilo apex
  circuitLengthM: 5793,
  isPlaying: false,
  playbackSpeed: 1,

  theme: 'obsidian',
  showIntro: true,

  setSeason: (season) => set({ season }),
  setShowIntro: (showIntro) => set({ showIntro }),
  setRaces: (races) => set({ races, selectedRace: races[0] || null }),
  setSelectedRace: (selectedRace) =>
    set({
      selectedRace,
      selectedSession: selectedRace.sessions?.[0] || null,
      circuitLengthM: Math.round(selectedRace.circuit.length_km * 1000),
      activeDistanceM: 0,
    }),
  setSelectedSession: (selectedSession) => set({ selectedSession }),
  setDrivers: (drivers) => set({ drivers }),
  setDriverA: (driverA) => set({ driverA }),
  setDriverB: (driverB) => set({ driverB }),
  setActiveDistanceM: (activeDistanceM) => set({ activeDistanceM }),
  setCircuitLengthM: (circuitLengthM) => set({ circuitLengthM }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setTheme: (theme) => set({ theme }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
