import { create } from 'zustand';
import { Driver, Race, Session, Circuit } from './types';
import { MOCK_DRIVERS, MOCK_RACES, f1Api, parseLapTimeToMs } from './api';

export type ThemeType = 'obsidian' | 'scuderia' | 'petronas' | 'monaco';

export interface LapRecordData {
  lap_record: string;
  lap_record_driver: string;
  lap_record_year: number;
  lap_record_team?: string;
  updated_at?: string;
}

const STORAGE_KEY = 'kers_circuit_records';

function loadStoredOverrides(): Record<number, LapRecordData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to load circuit records from localStorage:', err);
    return {};
  }
}

function saveStoredOverrides(overrides: Record<number, LapRecordData>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (err) {
    console.error('Failed to save circuit records to localStorage:', err);
  }
}

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

  // Dynamic / Real-Time Circuit Lap Records
  circuitRecordOverrides: Record<number, LapRecordData>;

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

  // Lap Record Actions
  updateCircuitRecord: (circuitId: number, record: LapRecordData) => void;
  checkAndRecordFastestLap: (circuitId: number, lapTime: string, driverName: string, year: number, teamName?: string) => boolean;
  resetCircuitRecords: () => void;
  getCircuitWithRecord: (circuit: Circuit) => Circuit;

  // Backup & Restore Profile Actions
  exportTelemetryProfile: () => string;
  importTelemetryProfile: (jsonStr: string) => boolean;
}

const initialOverrides = loadStoredOverrides();

function mergeCircuitWithOverride(circuit: Circuit, overrides: Record<number, LapRecordData>): Circuit {
  const override = overrides[circuit.id];
  if (!override) return circuit;
  return {
    ...circuit,
    lap_record: override.lap_record,
    lap_record_driver: override.lap_record_driver,
    lap_record_year: override.lap_record_year,
    lap_record_team: override.lap_record_team || circuit.lap_record_team,
  };
}

function mergeRacesWithOverrides(races: Race[], overrides: Record<number, LapRecordData>): Race[] {
  return races.map((r) => ({
    ...r,
    circuit: mergeCircuitWithOverride(r.circuit, overrides),
  }));
}

export const useTelemetryStore = create<TelemetryStoreState>((set, get) => {
  const initialRaces = mergeRacesWithOverrides(MOCK_RACES, initialOverrides);
  const initialSelectedRace = initialRaces.find((r) => r.status === 'UPCOMING') || initialRaces[16] || initialRaces[0];

  return {
    season: 2026,
    races: initialRaces,
    selectedRace: initialSelectedRace,
    selectedSession: initialSelectedRace?.sessions?.[3] || null,
    drivers: MOCK_DRIVERS,

    driverA: MOCK_DRIVERS[0], // Lando Norris (McLaren #FF8000)
    driverB: MOCK_DRIVERS[5], // Lewis Hamilton (Ferrari #E80020)

    activeDistanceM: 650, // Starts at Rettifilo apex
    circuitLengthM: initialSelectedRace ? Math.round(initialSelectedRace.circuit.length_km * 1000) : 5793,
    isPlaying: false,
    playbackSpeed: 1,

    circuitRecordOverrides: initialOverrides,

    theme: 'obsidian',
    showIntro: true,

    setSeason: async (season) => {
      set({ season });
      try {
        const fetchedRaces = await f1Api.getRaces(season);
        if (fetchedRaces && fetchedRaces.length > 0) {
          const overrides = get().circuitRecordOverrides;
          const merged = mergeRacesWithOverrides(fetchedRaces, overrides);
          const nextRace = merged.find((r) => r.status === 'UPCOMING') || merged[0];
          set({
            races: merged,
            selectedRace: nextRace,
            selectedSession: nextRace?.sessions?.[0] || null,
            circuitLengthM: nextRace ? Math.round(nextRace.circuit.length_km * 1000) : 5793,
            activeDistanceM: 0,
          });
        }
      } catch (err) {
        console.error('Error updating races for season:', err);
      }
    },

    setShowIntro: (showIntro) => set({ showIntro }),
    setRaces: (races) => {
      const overrides = get().circuitRecordOverrides;
      const merged = mergeRacesWithOverrides(races, overrides);
      set({ races: merged, selectedRace: merged[0] || null });
    },
    setSelectedRace: (selectedRace) => {
      const overrides = get().circuitRecordOverrides;
      const mergedCircuit = mergeCircuitWithOverride(selectedRace.circuit, overrides);
      const mergedRace = { ...selectedRace, circuit: mergedCircuit };
      set({
        selectedRace: mergedRace,
        selectedSession: mergedRace.sessions?.[0] || null,
        circuitLengthM: Math.round(mergedCircuit.length_km * 1000),
        activeDistanceM: 0,
      });
    },
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

    // Real-Time Lap Record Engine
    updateCircuitRecord: (circuitId: number, record: LapRecordData) => {
      const currentOverrides = get().circuitRecordOverrides;
      const updatedOverrides = {
        ...currentOverrides,
        [circuitId]: record,
      };
      saveStoredOverrides(updatedOverrides);

      set((state) => {
        const updatedRaces = mergeRacesWithOverrides(state.races, updatedOverrides);
        const updatedSelectedRace = state.selectedRace
          ? {
              ...state.selectedRace,
              circuit: mergeCircuitWithOverride(state.selectedRace.circuit, updatedOverrides),
            }
          : null;

        return {
          circuitRecordOverrides: updatedOverrides,
          races: updatedRaces,
          selectedRace: updatedSelectedRace,
        };
      });
    },

    checkAndRecordFastestLap: (circuitId: number, lapTime: string, driverName: string, year: number, teamName?: string) => {
      const state = get();
      const currentCircuit = state.races.find((r) => r.circuit.id === circuitId)?.circuit;
      const standingTime = state.circuitRecordOverrides[circuitId]?.lap_record || currentCircuit?.lap_record;

      const standingMs = parseLapTimeToMs(standingTime);
      const newMs = parseLapTimeToMs(lapTime);

      if (newMs !== Infinity && newMs < standingMs) {
        state.updateCircuitRecord(circuitId, {
          lap_record: lapTime,
          lap_record_driver: driverName,
          lap_record_year: year,
          lap_record_team: teamName || 'Formula 1',
          updated_at: new Date().toISOString(),
        });
        return true;
      }
      return false;
    },

    resetCircuitRecords: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      set((state) => ({
        circuitRecordOverrides: {},
        races: MOCK_RACES,
        selectedRace: MOCK_RACES.find((r) => r.status === 'UPCOMING') || MOCK_RACES[16] || MOCK_RACES[0],
      }));
    },

    getCircuitWithRecord: (circuit: Circuit) => {
      const overrides = get().circuitRecordOverrides;
      return mergeCircuitWithOverride(circuit, overrides);
    },

    exportTelemetryProfile: () => {
      const state = get();
      const profile = {
        version: '2.4.0',
        exported_at: new Date().toISOString(),
        circuitRecordOverrides: state.circuitRecordOverrides,
        preferredSeason: state.season,
        driverA: state.driverA.id,
        driverB: state.driverB.id,
      };
      return JSON.stringify(profile, null, 2);
    },

    importTelemetryProfile: (jsonStr: string) => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.circuitRecordOverrides && typeof parsed.circuitRecordOverrides === 'object') {
          saveStoredOverrides(parsed.circuitRecordOverrides);
          set((state) => {
            const updatedRaces = mergeRacesWithOverrides(state.races, parsed.circuitRecordOverrides);
            return {
              circuitRecordOverrides: parsed.circuitRecordOverrides,
              races: updatedRaces,
              selectedRace: state.selectedRace ? mergeRacesWithOverrides([state.selectedRace], parsed.circuitRecordOverrides)[0] : null,
            };
          });
          return true;
        }
      } catch (err) {
        console.error('[KERS Store] Failed to import telemetry profile:', err);
      }
      return false;
    },
  };
});
