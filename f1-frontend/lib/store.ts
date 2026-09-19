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

function loadStoredDriverA(): Driver {
  if (typeof window === 'undefined') return MOCK_DRIVERS[0];
  try {
    const rawId = localStorage.getItem('kers_driver_a_id');
    if (rawId) {
      const id = Number(rawId);
      const matched = MOCK_DRIVERS.find((d) => d.id === id);
      if (matched) return matched;
    }
  } catch {}
  return MOCK_DRIVERS[0];
}

function loadStoredDriverB(): Driver {
  if (typeof window === 'undefined') return MOCK_DRIVERS[5];
  try {
    const rawId = localStorage.getItem('kers_driver_b_id');
    if (rawId) {
      const id = Number(rawId);
      const matched = MOCK_DRIVERS.find((d) => d.id === id);
      if (matched) return matched;
    }
  } catch {}
  return MOCK_DRIVERS[5];
}

function loadStoredSeason(): number {
  if (typeof window === 'undefined') return 2026;
  try {
    const raw = localStorage.getItem('kers_season');
    if (raw) return Number(raw);
  } catch {}
  return 2026;
}

function loadStoredRaceId(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('kers_race_id');
    if (raw) return Number(raw);
  } catch {}
  return null;
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

  // Hydration from Client Storage
  hydrateFromStorage: () => void;
}

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
  const defaultSelectedRace =
    MOCK_RACES.find((r) => r.status === 'UPCOMING') ||
    MOCK_RACES[16] ||
    MOCK_RACES[0];

  return {
    season: 2026,
    races: MOCK_RACES,
    selectedRace: defaultSelectedRace,
    selectedSession: defaultSelectedRace?.sessions?.[3] || null,
    drivers: MOCK_DRIVERS,

    driverA: MOCK_DRIVERS[0],
    driverB: MOCK_DRIVERS[5],

    activeDistanceM: 650, // Starts at Rettifilo apex
    circuitLengthM: defaultSelectedRace ? Math.round(defaultSelectedRace.circuit.length_km * 1000) : 5793,
    isPlaying: false,
    playbackSpeed: 1,

    circuitRecordOverrides: {},

    theme: 'obsidian',
    showIntro: true,

    hydrateFromStorage: () => {
      if (typeof window === 'undefined') return;
      try {
        const storedOverrides = loadStoredOverrides();
        const storedA = loadStoredDriverA();
        const storedB = loadStoredDriverB();
        const storedSeason = loadStoredSeason();
        const storedRaceId = loadStoredRaceId();

        const currentRaces = get().races;
        const mergedRaces = mergeRacesWithOverrides(currentRaces, storedOverrides);
        const matchedRace = storedRaceId ? mergedRaces.find((r) => r.id === storedRaceId) : null;

        set((state) => ({
          ...state,
          driverA: storedA,
          driverB: storedB,
          season: storedSeason,
          races: mergedRaces,
          circuitRecordOverrides: storedOverrides,
          ...(matchedRace
            ? {
                selectedRace: matchedRace,
                selectedSession: matchedRace.sessions?.[0] || state.selectedSession,
                circuitLengthM: Math.round(matchedRace.circuit.length_km * 1000),
              }
            : {}),
        }));
      } catch (err) {
        console.error('Failed to hydrate store from localStorage:', err);
      }
    },

    setSeason: async (season) => {
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('kers_season', String(season)); } catch {}
      }
      set({ season });
      try {
        const [fetchedRaces, fetchedStandings] = await Promise.all([
          f1Api.getRaces(season),
          f1Api.getDriverStandings(season),
        ]);

        const newDrivers = fetchedStandings && fetchedStandings.length > 0
          ? fetchedStandings.map((s) => s.driver)
          : MOCK_DRIVERS;
        const newDriverA = newDrivers[0] || MOCK_DRIVERS[0];
        const newDriverB = newDrivers[1] || MOCK_DRIVERS[1];

        if (fetchedRaces && fetchedRaces.length > 0) {
          const overrides = get().circuitRecordOverrides;
          const merged = mergeRacesWithOverrides(fetchedRaces, overrides);
          const nextRace = merged.find((r) => r.status === 'UPCOMING') || merged[0];
          set({
            drivers: newDrivers,
            driverA: newDriverA,
            driverB: newDriverB,
            races: merged,
            selectedRace: nextRace,
            selectedSession: nextRace?.sessions?.[0] || null,
            circuitLengthM: nextRace ? Math.round(nextRace.circuit.length_km * 1000) : 5793,
            activeDistanceM: 0,
          });
        } else {
          set({
            drivers: newDrivers,
            driverA: newDriverA,
            driverB: newDriverB,
          });
        }
      } catch (err) {
        console.error('Error updating races and drivers for season:', err);
      }
    },

    setShowIntro: (showIntro) => set({ showIntro }),
    setRaces: (races) => {
      const overrides = get().circuitRecordOverrides;
      const merged = mergeRacesWithOverrides(races, overrides);
      set({ races: merged, selectedRace: merged[0] || null });
    },
    setSelectedRace: (selectedRace) => {
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('kers_race_id', String(selectedRace.id)); } catch {}
        if (selectedRace.season && selectedRace.season !== get().season) {
          try { localStorage.setItem('kers_season', String(selectedRace.season)); } catch {}
        }
      }
      const overrides = get().circuitRecordOverrides;
      const mergedCircuit = mergeCircuitWithOverride(selectedRace.circuit, overrides);
      const mergedRace = { ...selectedRace, circuit: mergedCircuit };
      const newSeason = selectedRace.season || get().season;
      set({
        season: newSeason,
        selectedRace: mergedRace,
        selectedSession: mergedRace.sessions?.[0] || null,
        circuitLengthM: Math.round(mergedCircuit.length_km * 1000),
        activeDistanceM: 0,
      });
    },
    setSelectedSession: (selectedSession) => {
      if (typeof window !== 'undefined' && selectedSession) {
        try { localStorage.setItem('kers_session_id', String(selectedSession.id)); } catch {}
      }
      set({ selectedSession });
    },
    setDrivers: (drivers) => set({ drivers }),
    setDriverA: (driverA) => {
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('kers_driver_a_id', String(driverA.id)); } catch {}
      }
      set({ driverA });
    },
    setDriverB: (driverB) => {
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('kers_driver_b_id', String(driverB.id)); } catch {}
      }
      set({ driverB });
    },
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
        if (
          parsed &&
          typeof parsed === 'object' &&
          parsed.circuitRecordOverrides &&
          typeof parsed.circuitRecordOverrides === 'object' &&
          !Array.isArray(parsed.circuitRecordOverrides)
        ) {
          const sanitized: Record<number, LapRecordData> = {};
          const forbiddenKeys = new Set(['__proto__', 'constructor', 'prototype']);

          for (const [key, val] of Object.entries(parsed.circuitRecordOverrides)) {
            if (forbiddenKeys.has(key)) continue;
            const circuitId = Number(key);
            if (!Number.isInteger(circuitId) || circuitId <= 0 || circuitId > 1000) continue;
            if (!val || typeof val !== 'object' || Array.isArray(val)) continue;

            const rec = val as Record<string, any>;
            if (typeof rec.lap_record === 'string' && typeof rec.lap_record_driver === 'string') {
              const cleanRecord = rec.lap_record.trim().slice(0, 16);
              const cleanDriver = rec.lap_record_driver.trim().slice(0, 64);
              const numYear = Number(rec.lap_record_year);
              const cleanYear = Number.isInteger(numYear) && numYear >= 1950 && numYear <= 2100 ? numYear : new Date().getFullYear();
              const cleanTeam = typeof rec.lap_record_team === 'string' ? rec.lap_record_team.trim().slice(0, 64) : 'Formula 1';

              sanitized[circuitId] = {
                lap_record: cleanRecord,
                lap_record_driver: cleanDriver,
                lap_record_year: cleanYear,
                lap_record_team: cleanTeam,
                updated_at: new Date().toISOString(),
              };
            }
          }

          saveStoredOverrides(sanitized);
          set((state) => {
            const updatedRaces = mergeRacesWithOverrides(state.races, sanitized);
            return {
              circuitRecordOverrides: sanitized,
              races: updatedRaces,
              selectedRace: state.selectedRace ? mergeRacesWithOverrides([state.selectedRace], sanitized)[0] : null,
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
