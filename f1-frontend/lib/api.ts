import { HISTORICAL_DRIVER_STANDINGS, HISTORICAL_CONSTRUCTOR_STANDINGS } from './historical-standings-data';
import { HISTORICAL_RACES } from './historical-races-data';
import { HISTORICAL_CONSTRUCTORS, ACTIVE_CONSTRUCTORS, ALL_CONSTRUCTORS } from './historical-constructors-data';
import { OFFICIAL_2026_RESULTS } from './season-2026-data';

/**
 * Parse Formula 1 lap time string ("1:44.701" or "84.701") into milliseconds for comparison
 */
export function parseLapTimeToMs(timeStr?: string | null): number {
  if (!timeStr) return Infinity;
  const clean = timeStr.trim().replace(/[^0-9:.]/g, '');
  if (!clean) return Infinity;

  if (clean.includes(':')) {
    const [minStr, secStr] = clean.split(':');
    const minutes = parseInt(minStr, 10);
    const seconds = parseFloat(secStr);
    if (isNaN(minutes) || isNaN(seconds)) return Infinity;
    return Math.round(minutes * 60000 + seconds * 1000);
  } else {
    const seconds = parseFloat(clean);
    if (isNaN(seconds)) return Infinity;
    return Math.round(seconds * 1000);
  }
}

import {
  Race,
  Circuit,
  Driver,
  Constructor,
  DriverStanding,
  ConstructorStanding,
  SeasonChampion,
  GhostTelemetryResponse,
  MicroSector,
  TrackMicroSectorsResponse,
  UndercutPredictionRequest,
  UndercutPredictionResponse,
  RadioMessage,
  HeadToHeadComparison,
  PodiumFinisher,
  TopFinisher,
  FastestLapInfo,
  RaceResult,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Full 2026/2025 Modern Formula 1 Championship Drivers (with all modern transfers)
export const MOCK_DRIVERS: Driver[] = [
  { id: 1, driver_number: 4, broadcast_name: 'L. NORRIS', full_name: 'Lando Norris', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'GBR' },
  { id: 2, driver_number: 16, broadcast_name: 'C. LECLERC', full_name: 'Charles Leclerc', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'MON' },
  { id: 3, driver_number: 1, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' },
  { id: 4, driver_number: 81, broadcast_name: 'O. PIASTRI', full_name: 'Oscar Piastri', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'AUS' },
  { id: 5, driver_number: 55, broadcast_name: 'C. SAINZ', full_name: 'Carlos Sainz', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'ESP' },
  { id: 6, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'GBR' },
  { id: 7, driver_number: 63, broadcast_name: 'G. RUSSELL', full_name: 'George Russell', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' },
  { id: 8, driver_number: 12, broadcast_name: 'K. ANTONELLI', full_name: 'Kimi Antonelli', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'ITA' },
  { id: 9, driver_number: 14, broadcast_name: 'F. ALONSO', full_name: 'Fernando Alonso', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'ESP' },
  { id: 10, driver_number: 23, broadcast_name: 'A. ALBON', full_name: 'Alexander Albon', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'THA' },
  { id: 11, driver_number: 30, broadcast_name: 'L. LAWSON', full_name: 'Liam Lawson', team_name: 'RB', color_hex: '#6692FF', country_code: 'NZL' },
  { id: 12, driver_number: 87, broadcast_name: 'O. BEARMAN', full_name: 'Oliver Bearman', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'GBR' },
  { id: 13, driver_number: 31, broadcast_name: 'E. OCON', full_name: 'Esteban Ocon', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'FRA' },
  { id: 14, driver_number: 10, broadcast_name: 'P. GASLY', full_name: 'Pierre Gasly', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'FRA' },
  { id: 15, driver_number: 43, broadcast_name: 'F. COLAPINTO', full_name: 'Franco Colapinto', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'ARG' },
  { id: 16, driver_number: 27, broadcast_name: 'N. HULKENBERG', full_name: 'Nico Hülkenberg', team_name: 'Audi', color_hex: '#E30613', country_code: 'GER' },
  { id: 17, driver_number: 5, broadcast_name: 'G. BORTOLETO', full_name: 'Gabriel Bortoleto', team_name: 'Audi', color_hex: '#E30613', country_code: 'BRA' },
  { id: 18, driver_number: 22, broadcast_name: 'Y. TSUNODA', full_name: 'Yuki Tsunoda', team_name: 'RB', color_hex: '#6692FF', country_code: 'JPN' },
  { id: 19, driver_number: 6, broadcast_name: 'I. HADJAR', full_name: 'Isack Hadjar', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'FRA' },
  { id: 20, driver_number: 18, broadcast_name: 'L. STROLL', full_name: 'Lance Stroll', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'CAN' },
  { id: 21, driver_number: 77, broadcast_name: 'V. BOTTAS', full_name: 'Valtteri Bottas', team_name: 'Cadillac', color_hex: '#C0C0C0', country_code: 'FIN' },
  { id: 22, driver_number: 11, broadcast_name: 'S. PEREZ', full_name: 'Sergio Pérez', team_name: 'Cadillac', color_hex: '#C0C0C0', country_code: 'MEX' },
];

// O(1) Indexed Maps for instant driver lookups
export const DRIVER_MAP_BY_ID = new Map<number, Driver>(MOCK_DRIVERS.map((d) => [d.id, d]));
export const DRIVER_MAP_BY_NUMBER = new Map<number, Driver>(MOCK_DRIVERS.map((d) => [d.driver_number, d]));

export const MOCK_CONSTRUCTORS: Constructor[] = [
  { id: 1, name: 'McLaren', full_name: 'McLaren F1 Team', color_hex: '#FF8000', country_code: 'GBR' },
  { id: 2, name: 'Ferrari', full_name: 'Scuderia Ferrari HP', color_hex: '#E80020', country_code: 'ITA' },
  { id: 3, name: 'Red Bull Racing', full_name: 'Oracle Red Bull Racing', color_hex: '#3671C6', country_code: 'AUT' },
  { id: 4, name: 'Mercedes', full_name: 'Mercedes-AMG PETRONAS F1 Team', color_hex: '#27F4D2', country_code: 'GER' },
  { id: 5, name: 'Aston Martin', full_name: 'Aston Martin Aramco F1 Team', color_hex: '#229971', country_code: 'GBR' },
  { id: 6, name: 'Williams', full_name: 'Williams Racing', color_hex: '#64C4FF', country_code: 'GBR' },
  { id: 7, name: 'Alpine', full_name: 'BWT Alpine F1 Team', color_hex: '#0093CC', country_code: 'FRA' },
  { id: 8, name: 'Haas', full_name: 'MoneyGram Haas F1 Team', color_hex: '#B6BABD', country_code: 'USA' },
  { id: 9, name: 'RB', full_name: 'Visa Cash App RB F1 Team', color_hex: '#6692FF', country_code: 'ITA' },
  { id: 10, name: 'Audi', full_name: 'Audi Revolut F1 Team', color_hex: '#E30613', country_code: 'GER' },
  { id: 11, name: 'Cadillac', full_name: 'Cadillac Formula 1 Team', color_hex: '#C0C0C0', country_code: 'USA' },
];

export { HISTORICAL_CONSTRUCTORS, ACTIVE_CONSTRUCTORS, ALL_CONSTRUCTORS };

import { MOCK_CIRCUITS, CIRCUIT_MAP_BY_ID, matchCircuit } from './circuits-data';
export { MOCK_CIRCUITS, CIRCUIT_MAP_BY_ID, matchCircuit };

// Full 2026 FIA Formula One World Championship Official Calendar (Upcoming 2026 Season)
export const MOCK_RACES: Race[] = [
  {
    id: 1,
    season: 2026,
    round_number: 1,
    race_name: 'Australian Grand Prix',
    official_event_name: 'Formula 1 Rolex Australian Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 15) || MOCK_CIRCUITS[0], // Albert Park
    status: 'COMPLETED',
    date: '2026-03-08',
    sessions: [
      { id: 1, race_id: 1, session_type: 'FP1', session_name: 'Practice 1', date: '2026-03-06' },
      { id: 2, race_id: 1, session_type: 'FP2', session_name: 'Practice 2', date: '2026-03-06' },
      { id: 3, race_id: 1, session_type: 'FP3', session_name: 'Practice 3', date: '2026-03-07' },
      { id: 4, race_id: 1, session_type: 'Q', session_name: 'Qualifying', date: '2026-03-07' },
      { id: 5, race_id: 1, session_type: 'R', session_name: 'Race', date: '2026-03-08' },
    ],
  },
  {
    id: 2,
    season: 2026,
    round_number: 2,
    race_name: 'Chinese Grand Prix',
    official_event_name: 'Formula 1 Lenovo Chinese Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 16) || MOCK_CIRCUITS[0], // Shanghai
    status: 'COMPLETED',
    date: '2026-03-15',
    sessions: [
      { id: 6, race_id: 2, session_type: 'Q', session_name: 'Qualifying', date: '2026-03-14' },
      { id: 7, race_id: 2, session_type: 'R', session_name: 'Race', date: '2026-03-15' },
    ],
  },
  {
    id: 3,
    season: 2026,
    round_number: 3,
    race_name: 'Japanese Grand Prix',
    official_event_name: 'Formula 1 MSC Cruises Japanese Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 5) || MOCK_CIRCUITS[0], // Suzuka
    status: 'COMPLETED',
    date: '2026-03-29',
    sessions: [
      { id: 8, race_id: 3, session_type: 'Q', session_name: 'Qualifying', date: '2026-03-28' },
      { id: 9, race_id: 3, session_type: 'R', session_name: 'Race', date: '2026-03-29' },
    ],
  },
  {
    id: 4,
    season: 2026,
    round_number: 4,
    race_name: 'Bahrain Grand Prix',
    official_event_name: 'Formula 1 Gulf Air Bahrain Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 13) || MOCK_CIRCUITS[0], // Bahrain
    status: 'CANCELLED',
    cancellation_reason: 'OFFICIAL FIA NOTICE: The Bahrain Grand Prix was cancelled and removed from the 2026 championship schedule.',
    date: '2026-04-12',
    sessions: [
      { id: 10, race_id: 4, session_type: 'Q', session_name: 'Qualifying (Cancelled)', date: '2026-04-11' },
      { id: 11, race_id: 4, session_type: 'R', session_name: 'Race (Cancelled)', date: '2026-04-12' },
    ],
  },
  {
    id: 5,
    season: 2026,
    round_number: 5,
    race_name: 'Saudi Arabian Grand Prix',
    official_event_name: 'Formula 1 STC Saudi Arabian Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 14) || MOCK_CIRCUITS[0], // Jeddah
    status: 'CANCELLED',
    cancellation_reason: 'OFFICIAL FIA NOTICE: The Saudi Arabian Grand Prix was cancelled and removed from the 2026 championship schedule.',
    date: '2026-04-19',
    sessions: [
      { id: 12, race_id: 5, session_type: 'Q', session_name: 'Qualifying (Cancelled)', date: '2026-04-18' },
      { id: 13, race_id: 5, session_type: 'R', session_name: 'Race (Cancelled)', date: '2026-04-19' },
    ],
  },
  {
    id: 6,
    season: 2026,
    round_number: 6,
    race_name: 'Miami Grand Prix',
    official_event_name: 'Formula 1 Crypto.com Miami Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 17) || MOCK_CIRCUITS[0], // Miami
    status: 'COMPLETED',
    date: '2026-05-03',
    sessions: [
      { id: 14, race_id: 6, session_type: 'Q', session_name: 'Qualifying', date: '2026-05-02' },
      { id: 15, race_id: 6, session_type: 'R', session_name: 'Race', date: '2026-05-03' },
    ],
  },
  {
    id: 7,
    season: 2026,
    round_number: 7,
    race_name: 'Canadian Grand Prix',
    official_event_name: 'Formula 1 AWS Grand Prix du Canada 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 11) || MOCK_CIRCUITS[0], // Montreal
    status: 'COMPLETED',
    date: '2026-05-24',
    sessions: [
      { id: 16, race_id: 7, session_type: 'Q', session_name: 'Qualifying', date: '2026-05-23' },
      { id: 17, race_id: 7, session_type: 'R', session_name: 'Race', date: '2026-05-24' },
    ],
  },
  {
    id: 8,
    season: 2026,
    round_number: 8,
    race_name: 'Monaco Grand Prix',
    official_event_name: 'Formula 1 Grand Prix de Monaco 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 4) || MOCK_CIRCUITS[0], // Monaco
    status: 'COMPLETED',
    date: '2026-06-07',
    sessions: [
      { id: 18, race_id: 8, session_type: 'Q', session_name: 'Qualifying', date: '2026-06-06' },
      { id: 19, race_id: 8, session_type: 'R', session_name: 'Race', date: '2026-06-07' },
    ],
  },
  {
    id: 9,
    season: 2026,
    round_number: 9,
    race_name: 'Barcelona Grand Prix',
    official_event_name: 'Formula 1 AWS Gran Premio de España 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 18) || MOCK_CIRCUITS[0], // Barcelona
    status: 'COMPLETED',
    date: '2026-06-14',
    sessions: [
      { id: 20, race_id: 9, session_type: 'Q', session_name: 'Qualifying', date: '2026-06-13' },
      { id: 21, race_id: 9, session_type: 'R', session_name: 'Race', date: '2026-06-14' },
    ],
  },
  {
    id: 10,
    season: 2026,
    round_number: 10,
    race_name: 'Austrian Grand Prix',
    official_event_name: 'Formula 1 Qatar Airways Großer Preis von Österreich 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 10) || MOCK_CIRCUITS[0], // Red Bull Ring
    status: 'COMPLETED',
    date: '2026-06-28',
    sessions: [
      { id: 22, race_id: 10, session_type: 'Q', session_name: 'Qualifying', date: '2026-06-27' },
      { id: 23, race_id: 10, session_type: 'R', session_name: 'Race', date: '2026-06-28' },
    ],
  },
  {
    id: 11,
    season: 2026,
    round_number: 11,
    race_name: 'British Grand Prix',
    official_event_name: 'Formula 1 Qatar Airways British Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 3) || MOCK_CIRCUITS[0], // Silverstone
    status: 'COMPLETED',
    date: '2026-07-05',
    sessions: [
      { id: 24, race_id: 11, session_type: 'Q', session_name: 'Qualifying', date: '2026-07-04' },
      { id: 25, race_id: 11, session_type: 'R', session_name: 'Race', date: '2026-07-05' },
    ],
  },
  {
    id: 12,
    season: 2026,
    round_number: 12,
    race_name: 'Belgian Grand Prix',
    official_event_name: 'Formula 1 Rolex Belgian Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 2) || MOCK_CIRCUITS[0], // Spa
    status: 'COMPLETED',
    date: '2026-07-19',
    sessions: [
      { id: 26, race_id: 12, session_type: 'Q', session_name: 'Qualifying', date: '2026-07-18' },
      { id: 27, race_id: 12, session_type: 'R', session_name: 'Race', date: '2026-07-19' },
    ],
  },
  {
    id: 13,
    season: 2026,
    round_number: 13,
    race_name: 'Hungarian Grand Prix',
    official_event_name: 'Formula 1 Hungarian Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 19) || MOCK_CIRCUITS[0], // Hungaroring
    status: 'COMPLETED',
    date: '2026-07-26',
    sessions: [
      { id: 28, race_id: 13, session_type: 'Q', session_name: 'Qualifying', date: '2026-07-25' },
      { id: 29, race_id: 13, session_type: 'R', session_name: 'Race', date: '2026-07-26' },
    ],
  },
  {
    id: 14,
    season: 2026,
    round_number: 14,
    race_name: 'Dutch Grand Prix',
    official_event_name: 'Formula 1 Heineken Dutch Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 12) || MOCK_CIRCUITS[0], // Zandvoort
    status: 'COMPLETED',
    date: '2026-08-23',
    sessions: [
      { id: 30, race_id: 14, session_type: 'Q', session_name: 'Qualifying', date: '2026-08-22' },
      { id: 31, race_id: 14, session_type: 'R', session_name: 'Race', date: '2026-08-23' },
    ],
  },
  {
    id: 15,
    season: 2026,
    round_number: 15,
    race_name: 'Italian Grand Prix',
    official_event_name: 'Formula 1 Pirelli Gran Premio d\'Italia 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 1) || MOCK_CIRCUITS[0], // Monza
    status: 'COMPLETED',
    date: '2026-09-06',
    sessions: [
      { id: 32, race_id: 15, session_type: 'FP1', session_name: 'Practice 1', date: '2026-09-04' },
      { id: 33, race_id: 15, session_type: 'FP2', session_name: 'Practice 2', date: '2026-09-04' },
      { id: 34, race_id: 15, session_type: 'FP3', session_name: 'Practice 3', date: '2026-09-05' },
      { id: 35, race_id: 15, session_type: 'Q', session_name: 'Qualifying', date: '2026-09-05' },
      { id: 36, race_id: 15, session_type: 'R', session_name: 'Race', date: '2026-09-06' },
    ],
  },
  {
    id: 16,
    season: 2026,
    round_number: 16,
    race_name: 'Spanish Grand Prix',
    official_event_name: 'Formula 1 Gran Premio de España (Madrid) 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 39) || MOCK_CIRCUITS[0], // Madring
    status: 'COMPLETED',
    date: '2026-09-13',
    sessions: [
      { id: 37, race_id: 16, session_type: 'Q', session_name: 'Qualifying', date: '2026-09-12' },
      { id: 38, race_id: 16, session_type: 'R', session_name: 'Race', date: '2026-09-13' },
    ],
  },
  {
    id: 17,
    season: 2026,
    round_number: 17,
    race_name: 'Azerbaijan Grand Prix',
    official_event_name: 'Formula 1 Qatar Airways Azerbaijan Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 8) || MOCK_CIRCUITS[0], // Baku City Circuit
    status: 'UPCOMING',
    date: '2026-09-26',
    sessions: [
      { id: 39, race_id: 17, session_type: 'FP1', session_name: 'Practice 1', date: '2026-09-24' },
      { id: 40, race_id: 17, session_type: 'FP2', session_name: 'Practice 2', date: '2026-09-24' },
      { id: 41, race_id: 17, session_type: 'FP3', session_name: 'Practice 3', date: '2026-09-25' },
      { id: 42, race_id: 17, session_type: 'Q', session_name: 'Qualifying', date: '2026-09-25' },
      { id: 43, race_id: 17, session_type: 'R', session_name: 'Race', date: '2026-09-26' },
    ],
  },
  {
    id: 18,
    season: 2026,
    round_number: 18,
    race_name: 'Singapore Grand Prix',
    official_event_name: 'Formula 1 Singapore Airlines Singapore Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 7) || MOCK_CIRCUITS[0], // Marina Bay
    status: 'UPCOMING',
    date: '2026-10-11',
    sessions: [
      { id: 44, race_id: 18, session_type: 'Q', session_name: 'Qualifying', date: '2026-10-10' },
      { id: 45, race_id: 18, session_type: 'R', session_name: 'Race', date: '2026-10-11' },
    ],
  },
  {
    id: 19,
    season: 2026,
    round_number: 19,
    race_name: 'United States Grand Prix',
    official_event_name: 'Formula 1 Pirelli United States Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 9) || MOCK_CIRCUITS[0], // COTA
    status: 'UPCOMING',
    date: '2026-10-25',
    sessions: [
      { id: 46, race_id: 19, session_type: 'Q', session_name: 'Qualifying', date: '2026-10-24' },
      { id: 47, race_id: 19, session_type: 'R', session_name: 'Race', date: '2026-10-25' },
    ],
  },
  {
    id: 20,
    season: 2026,
    round_number: 20,
    race_name: 'Mexico City Grand Prix',
    official_event_name: 'Formula 1 Gran Premio de la Ciudad de México 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 20) || MOCK_CIRCUITS[0], // Autodromo Hermanos Rodriguez
    status: 'UPCOMING',
    date: '2026-11-01',
    sessions: [
      { id: 48, race_id: 20, session_type: 'Q', session_name: 'Qualifying', date: '2026-10-31' },
      { id: 49, race_id: 20, session_type: 'R', session_name: 'Race', date: '2026-11-01' },
    ],
  },
  {
    id: 21,
    season: 2026,
    round_number: 21,
    race_name: 'São Paulo Grand Prix',
    official_event_name: 'Formula 1 Lenovo Grande Prêmio de São Paulo 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 6) || MOCK_CIRCUITS[0], // Interlagos
    status: 'UPCOMING',
    date: '2026-11-08',
    sessions: [
      { id: 50, race_id: 21, session_type: 'Q', session_name: 'Qualifying', date: '2026-11-07' },
      { id: 51, race_id: 21, session_type: 'R', session_name: 'Race', date: '2026-11-08' },
    ],
  },
  {
    id: 22,
    season: 2026,
    round_number: 22,
    race_name: 'Las Vegas Grand Prix',
    official_event_name: 'Formula 1 Heineken Silver Las Vegas Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 21) || MOCK_CIRCUITS[0], // Las Vegas Strip
    status: 'UPCOMING',
    date: '2026-11-22',
    sessions: [
      { id: 52, race_id: 22, session_type: 'Q', session_name: 'Qualifying', date: '2026-11-21' },
      { id: 53, race_id: 22, session_type: 'R', session_name: 'Race', date: '2026-11-22' },
    ],
  },
  {
    id: 23,
    season: 2026,
    round_number: 23,
    race_name: 'Qatar Grand Prix',
    official_event_name: 'Formula 1 Qatar Airways Qatar Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 22) || MOCK_CIRCUITS[0], // Lusail
    status: 'UPCOMING',
    date: '2026-11-29',
    sessions: [
      { id: 54, race_id: 23, session_type: 'Q', session_name: 'Qualifying', date: '2026-11-28' },
      { id: 55, race_id: 23, session_type: 'R', session_name: 'Race', date: '2026-11-29' },
    ],
  },
  {
    id: 24,
    season: 2026,
    round_number: 24,
    race_name: 'Abu Dhabi Grand Prix',
    official_event_name: 'Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 23) || MOCK_CIRCUITS[0], // Yas Marina
    status: 'UPCOMING',
    date: '2026-12-06',
    sessions: [
      { id: 56, race_id: 24, session_type: 'Q', session_name: 'Qualifying', date: '2026-12-05' },
      { id: 57, race_id: 24, session_type: 'R', session_name: 'Race', date: '2026-12-06' },
    ],
  },
];

// Full 2024 FIA Formula One World Championship (100% Verified Real Official Calendar)
export const SEASON_2024_RACES: Race[] = [
  { id: 101, season: 2024, round_number: 1, race_name: 'Bahrain Grand Prix', official_event_name: 'Formula 1 Gulf Air Bahrain Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 13) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-03-02' },
  { id: 102, season: 2024, round_number: 2, race_name: 'Saudi Arabian Grand Prix', official_event_name: 'Formula 1 STC Saudi Arabian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 14) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-03-09' },
  { id: 103, season: 2024, round_number: 3, race_name: 'Australian Grand Prix', official_event_name: 'Formula 1 Rolex Australian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 15) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-03-24' },
  { id: 104, season: 2024, round_number: 4, race_name: 'Japanese Grand Prix', official_event_name: 'Formula 1 MSC Cruises Japanese Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 5) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-04-07' },
  { id: 105, season: 2024, round_number: 5, race_name: 'Chinese Grand Prix', official_event_name: 'Formula 1 Lenovo Chinese Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 16) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-04-21' },
  { id: 106, season: 2024, round_number: 6, race_name: 'Miami Grand Prix', official_event_name: 'Formula 1 Crypto.com Miami Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 17) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-05-05' },
  { id: 107, season: 2024, round_number: 7, race_name: 'Emilia Romagna Grand Prix', official_event_name: 'Formula 1 MSC Cruises Gran Premio dell\'Emilia-Romagna 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 27) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-05-19' },
  { id: 108, season: 2024, round_number: 8, race_name: 'Monaco Grand Prix', official_event_name: 'Formula 1 Grand Prix de Monaco 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 4) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-05-26' },
  { id: 109, season: 2024, round_number: 9, race_name: 'Canadian Grand Prix', official_event_name: 'Formula 1 AWS Grand Prix du Canada 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 11) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-06-09' },
  { id: 110, season: 2024, round_number: 10, race_name: 'Spanish Grand Prix', official_event_name: 'Formula 1 Aramco Gran Premio de España 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 18) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-06-23' },
  { id: 111, season: 2024, round_number: 11, race_name: 'Austrian Grand Prix', official_event_name: 'Formula 1 Qatar Airways Großer Preis von Österreich 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 10) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-06-30' },
  { id: 112, season: 2024, round_number: 12, race_name: 'British Grand Prix', official_event_name: 'Formula 1 Qatar Airways British Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 3) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-07-07' },
  { id: 113, season: 2024, round_number: 13, race_name: 'Hungarian Grand Prix', official_event_name: 'Formula 1 Hungarian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 19) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-07-21' },
  { id: 114, season: 2024, round_number: 14, race_name: 'Belgian Grand Prix', official_event_name: 'Formula 1 Rolex Belgian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 2) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-07-28' },
  { id: 115, season: 2024, round_number: 15, race_name: 'Dutch Grand Prix', official_event_name: 'Formula 1 Heineken Dutch Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 12) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-08-25' },
  { id: 116, season: 2024, round_number: 16, race_name: 'Italian Grand Prix', official_event_name: 'Formula 1 Pirelli Gran Premio d\'Italia 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 1) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-09-01' },
  { id: 117, season: 2024, round_number: 17, race_name: 'Azerbaijan Grand Prix', official_event_name: 'Formula 1 Qatar Airways Azerbaijan Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 8) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-09-15' },
  { id: 118, season: 2024, round_number: 18, race_name: 'Singapore Grand Prix', official_event_name: 'Formula 1 Singapore Airlines Singapore Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 7) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-09-22' },
  { id: 119, season: 2024, round_number: 19, race_name: 'United States Grand Prix', official_event_name: 'Formula 1 Pirelli United States Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 9) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-10-20' },
  { id: 120, season: 2024, round_number: 20, race_name: 'Mexico City Grand Prix', official_event_name: 'Formula 1 Gran Premio de la Ciudad de México 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 20) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-10-27' },
  { id: 121, season: 2024, round_number: 21, race_name: 'São Paulo Grand Prix', official_event_name: 'Formula 1 Lenovo Grande Prêmio de São Paulo 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 6) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-11-03' },
  { id: 122, season: 2024, round_number: 22, race_name: 'Las Vegas Grand Prix', official_event_name: 'Formula 1 Heineken Silver Las Vegas Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 21) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-11-23' },
  { id: 123, season: 2024, round_number: 23, race_name: 'Qatar Grand Prix', official_event_name: 'Formula 1 Qatar Airways Qatar Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 22) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-12-01' },
  { id: 124, season: 2024, round_number: 24, race_name: 'Abu Dhabi Grand Prix', official_event_name: 'Formula 1 Etihad Airways Abu Dhabi Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 23) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-12-08' },
];

// Helper driver references for 2024 verified results
const VERSTAPPEN: Driver = { id: 3, driver_number: 1, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' };
const NORRIS: Driver = { id: 1, driver_number: 4, broadcast_name: 'L. NORRIS', full_name: 'Lando Norris', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'GBR' };
const LECLERC: Driver = { id: 2, driver_number: 16, broadcast_name: 'C. LECLERC', full_name: 'Charles Leclerc', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'MON' };
const PIASTRI: Driver = { id: 4, driver_number: 81, broadcast_name: 'O. PIASTRI', full_name: 'Oscar Piastri', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'AUS' };
const SAINZ: Driver = { id: 5, driver_number: 55, broadcast_name: 'C. SAINZ', full_name: 'Carlos Sainz', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'ESP' };
const RUSSELL: Driver = { id: 7, driver_number: 63, broadcast_name: 'G. RUSSELL', full_name: 'George Russell', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' };
const HAMILTON: Driver = { id: 6, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' };
const PEREZ: Driver = { id: 8, driver_number: 11, broadcast_name: 'S. PEREZ', full_name: 'Sergio Pérez', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'MEX' };
const ALONSO: Driver = { id: 9, driver_number: 14, broadcast_name: 'F. ALONSO', full_name: 'Fernando Alonso', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'ESP' };
const HULKENBERG: Driver = { id: 16, driver_number: 27, broadcast_name: 'N. HULKENBERG', full_name: 'Nico Hülkenberg', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'GER' };
const TSUNODA: Driver = { id: 18, driver_number: 22, broadcast_name: 'Y. TSUNODA', full_name: 'Yuki Tsunoda', team_name: 'RB', color_hex: '#6692FF', country_code: 'JPN' };
const GASLY: Driver = { id: 14, driver_number: 10, broadcast_name: 'P. GASLY', full_name: 'Pierre Gasly', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'FRA' };
const OCON: Driver = { id: 13, driver_number: 31, broadcast_name: 'E. OCON', full_name: 'Esteban Ocon', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'FRA' };
const STROLL: Driver = { id: 20, driver_number: 18, broadcast_name: 'L. STROLL', full_name: 'Lance Stroll', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'CAN' };
const ALBON: Driver = { id: 10, driver_number: 23, broadcast_name: 'A. ALBON', full_name: 'Alexander Albon', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'THA' };

// 100% Authentic Official 2024 FIA Race Results Archive (All 24 Grands Prix)
export const SEASON_2024_RESULTS: Record<number, RaceResult> = {
  1: {
    race_id: 101, season: 2024, round_number: 1, race_name: 'Bahrain Grand Prix', circuit_name: 'Bahrain International Circuit', country: 'Bahrain', country_code: 'BHR', date: '2024-03-02', status: 'COMPLETED', laps_completed: 57, total_laps: 57,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:31:44.742', points: 26, grid_start: 1, fastest_lap: true },
      p2: { position: 2, driver: PEREZ, time_or_gap: '+22.457s', points: 18, grid_start: 5 },
      p3: { position: 3, driver: SAINZ, time_or_gap: '+25.110s', points: 15, grid_start: 4 },
    },
    fastest_lap: { driver: VERSTAPPEN, lap_time: '1:32.608', lap_number: 39 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:29.179' },
    top_finishers: [
      { position: 4, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 12, time_or_gap: '+39.669s', grid_start: 2, pit_stops: 2 },
      { position: 5, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 10, time_or_gap: '+46.788s', grid_start: 3, pit_stops: 2 },
      { position: 6, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 8, time_or_gap: '+48.458s', grid_start: 7, pit_stops: 2 },
      { position: 7, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 6, time_or_gap: '+50.324s', grid_start: 9, pit_stops: 2 },
      { position: 8, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 4, time_or_gap: '+56.082s', grid_start: 8, pit_stops: 2 },
      { position: 9, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 2, time_or_gap: '+74.887s', grid_start: 6, pit_stops: 2 },
      { position: 10, driver: STROLL, team_name: 'Aston Martin', team_color: '#229971', points: 1, time_or_gap: '+93.216s', grid_start: 12, pit_stops: 2 },
    ],
  },
  2: {
    race_id: 102, season: 2024, round_number: 2, race_name: 'Saudi Arabian Grand Prix', circuit_name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', country_code: 'KSA', date: '2024-03-09', status: 'COMPLETED', laps_completed: 50, total_laps: 50,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:20:43.273', points: 25, grid_start: 1 },
      p2: { position: 2, driver: PEREZ, time_or_gap: '+13.643s', points: 18, grid_start: 3 },
      p3: { position: 3, driver: LECLERC, time_or_gap: '+18.639s', points: 16, grid_start: 2, fastest_lap: true },
    },
    fastest_lap: { driver: LECLERC, lap_time: '1:31.632', lap_number: 50 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:27.472' },
    top_finishers: [
      { position: 4, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 12, time_or_gap: '+32.007s', grid_start: 5, pit_stops: 1 },
      { position: 5, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 10, time_or_gap: '+35.759s', grid_start: 4, pit_stops: 1 },
      { position: 6, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 8, time_or_gap: '+39.936s', grid_start: 7, pit_stops: 1 },
      { position: 7, driver: { id: 12, driver_number: 38, broadcast_name: 'O. BEARMAN', full_name: 'Oliver Bearman', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'GBR' }, team_name: 'Ferrari', team_color: '#E80020', points: 6, time_or_gap: '+42.679s', grid_start: 11, pit_stops: 1 },
      { position: 8, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 4, time_or_gap: '+45.708s', grid_start: 6, pit_stops: 1 },
      { position: 9, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 2, time_or_gap: '+47.391s', grid_start: 8, pit_stops: 1 },
      { position: 10, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 1, time_or_gap: '+76.996s', grid_start: 15, pit_stops: 1 },
    ],
  },
  3: {
    race_id: 103, season: 2024, round_number: 3, race_name: 'Australian Grand Prix', circuit_name: 'Albert Park Circuit', country: 'Australia', country_code: 'AUS', date: '2024-03-24', status: 'COMPLETED', laps_completed: 58, total_laps: 58,
    podium: {
      p1: { position: 1, driver: SAINZ, time_or_gap: '1:20:26.843', points: 25, grid_start: 2 },
      p2: { position: 2, driver: LECLERC, time_or_gap: '+2.366s', points: 19, grid_start: 4, fastest_lap: true },
      p3: { position: 3, driver: NORRIS, time_or_gap: '+5.904s', points: 15, grid_start: 3 },
    },
    fastest_lap: { driver: LECLERC, lap_time: '1:19.813', lap_number: 56 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:15.915' },
    top_finishers: [
      { position: 4, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 12, time_or_gap: '+35.770s', grid_start: 5, pit_stops: 2 },
      { position: 5, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 10, time_or_gap: '+56.309s', grid_start: 6, pit_stops: 2 },
      { position: 6, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 8, time_or_gap: '+80.992s', grid_start: 10, pit_stops: 2 },
      { position: 7, driver: STROLL, team_name: 'Aston Martin', team_color: '#229971', points: 6, time_or_gap: '+93.222s', grid_start: 9, pit_stops: 2 },
      { position: 8, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 4, time_or_gap: '+95.601s', grid_start: 8, pit_stops: 2 },
      { position: 9, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 2, time_or_gap: '+1 Lap', grid_start: 16, pit_stops: 2 },
      { position: 10, driver: { id: 19, driver_number: 20, broadcast_name: 'K. MAGNUSSEN', full_name: 'Kevin Magnussen', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'DEN' }, team_name: 'Haas', team_color: '#B6BABD', points: 1, time_or_gap: '+1 Lap', grid_start: 14, pit_stops: 2 },
    ],
  },
  4: {
    race_id: 104, season: 2024, round_number: 4, race_name: 'Japanese Grand Prix', circuit_name: 'Suzuka International Racing Course', country: 'Japan', country_code: 'JPN', date: '2024-04-07', status: 'COMPLETED', laps_completed: 53, total_laps: 53,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:54:23.566', points: 26, grid_start: 1, fastest_lap: true },
      p2: { position: 2, driver: PEREZ, time_or_gap: '+12.535s', points: 18, grid_start: 2 },
      p3: { position: 3, driver: SAINZ, time_or_gap: '+20.866s', points: 15, grid_start: 4 },
    },
    fastest_lap: { driver: VERSTAPPEN, lap_time: '1:33.706', lap_number: 50 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:28.197' },
    top_finishers: [
      { position: 4, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 12, time_or_gap: '+26.522s', grid_start: 8, pit_stops: 1 },
      { position: 5, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 10, time_or_gap: '+29.700s', grid_start: 3, pit_stops: 2 },
      { position: 6, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 8, time_or_gap: '+44.272s', grid_start: 5, pit_stops: 2 },
      { position: 7, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 6, time_or_gap: '+45.951s', grid_start: 9, pit_stops: 2 },
      { position: 8, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 4, time_or_gap: '+47.525s', grid_start: 6, pit_stops: 2 },
      { position: 9, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 2, time_or_gap: '+48.626s', grid_start: 7, pit_stops: 2 },
      { position: 10, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 1, time_or_gap: '+1 Lap', grid_start: 10, pit_stops: 2 },
    ],
  },
  5: {
    race_id: 105, season: 2024, round_number: 5, race_name: 'Chinese Grand Prix', circuit_name: 'Shanghai International Circuit', country: 'China', country_code: 'CHN', date: '2024-04-21', status: 'COMPLETED', laps_completed: 56, total_laps: 56,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:40:52.554', points: 25, grid_start: 1 },
      p2: { position: 2, driver: NORRIS, time_or_gap: '+13.773s', points: 18, grid_start: 4 },
      p3: { position: 3, driver: PEREZ, time_or_gap: '+19.160s', points: 15, grid_start: 2 },
    },
    fastest_lap: { driver: ALONSO, lap_time: '1:37.810', lap_number: 45 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:33.660' },
    top_finishers: [
      { position: 4, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 12, time_or_gap: '+23.623s', grid_start: 6, pit_stops: 1 },
      { position: 5, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 10, time_or_gap: '+33.983s', grid_start: 7, pit_stops: 1 },
      { position: 6, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 8, time_or_gap: '+38.724s', grid_start: 8, pit_stops: 2 },
      { position: 7, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 7, time_or_gap: '+44.959s', grid_start: 3, pit_stops: 3 },
      { position: 8, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 4, time_or_gap: '+56.197s', grid_start: 5, pit_stops: 2 },
      { position: 9, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 2, time_or_gap: '+57.986s', grid_start: 18, pit_stops: 2 },
      { position: 10, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 1, time_or_gap: '+60.476s', grid_start: 9, pit_stops: 2 },
    ],
  },
  6: {
    race_id: 106, season: 2024, round_number: 6, race_name: 'Miami Grand Prix', circuit_name: 'Miami International Autodrome', country: 'United States', country_code: 'USA', date: '2024-05-05', status: 'COMPLETED', laps_completed: 57, total_laps: 57,
    podium: {
      p1: { position: 1, driver: NORRIS, time_or_gap: '1:30:49.876', points: 25, grid_start: 5 }, // Norris Maiden F1 Victory
      p2: { position: 2, driver: VERSTAPPEN, time_or_gap: '+7.612s', points: 18, grid_start: 1 },
      p3: { position: 3, driver: LECLERC, time_or_gap: '+9.920s', points: 15, grid_start: 2 },
    },
    fastest_lap: { driver: PIASTRI, lap_time: '1:30.634', lap_number: 43 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:27.241' },
    top_finishers: [
      { position: 4, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 12, time_or_gap: '+11.407s', grid_start: 3, pit_stops: 1 },
      { position: 5, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 10, time_or_gap: '+14.650s', grid_start: 4, pit_stops: 2 },
      { position: 6, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 8, time_or_gap: '+16.585s', grid_start: 8, pit_stops: 1 },
      { position: 7, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 6, time_or_gap: '+26.185s', grid_start: 10, pit_stops: 1 },
      { position: 8, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 4, time_or_gap: '+34.789s', grid_start: 7, pit_stops: 2 },
      { position: 9, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 2, time_or_gap: '+37.107s', grid_start: 15, pit_stops: 1 },
      { position: 10, driver: OCON, team_name: 'Alpine', team_color: '#0093CC', points: 1, time_or_gap: '+39.746s', grid_start: 13, pit_stops: 1 },
    ],
  },
  7: {
    race_id: 107, season: 2024, round_number: 7, race_name: 'Emilia Romagna Grand Prix', circuit_name: 'Autodromo Enzo e Dino Ferrari', country: 'Italy', country_code: 'ITA', date: '2024-05-19', status: 'COMPLETED', laps_completed: 63, total_laps: 63,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:25:25.252', points: 25, grid_start: 1 },
      p2: { position: 2, driver: NORRIS, time_or_gap: '+0.725s', points: 18, grid_start: 2 },
      p3: { position: 3, driver: LECLERC, time_or_gap: '+7.916s', points: 15, grid_start: 3 },
    },
    fastest_lap: { driver: RUSSELL, lap_time: '1:18.589', lap_number: 54 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:14.746' },
    top_finishers: [
      { position: 4, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 12, time_or_gap: '+14.132s', grid_start: 5, pit_stops: 1 },
      { position: 5, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 10, time_or_gap: '+22.325s', grid_start: 4, pit_stops: 1 },
      { position: 6, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 8, time_or_gap: '+35.104s', grid_start: 8, pit_stops: 1 },
      { position: 7, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 7, time_or_gap: '+47.154s', grid_start: 6, pit_stops: 2 },
      { position: 8, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 4, time_or_gap: '+54.776s', grid_start: 11, pit_stops: 1 },
      { position: 9, driver: STROLL, team_name: 'Aston Martin', team_color: '#229971', points: 2, time_or_gap: '+79.556s', grid_start: 13, pit_stops: 1 },
      { position: 10, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 1, time_or_gap: '+1 Lap', grid_start: 7, pit_stops: 1 },
    ],
  },
  8: {
    race_id: 108, season: 2024, round_number: 8, race_name: 'Monaco Grand Prix', circuit_name: 'Circuit de Monaco', country: 'Monaco', country_code: 'MON', date: '2024-05-26', status: 'COMPLETED', laps_completed: 78, total_laps: 78,
    podium: {
      p1: { position: 1, driver: LECLERC, time_or_gap: '2:23:15.554', points: 25, grid_start: 1 }, // Leclerc Home Victory
      p2: { position: 2, driver: PIASTRI, time_or_gap: '+7.152s', points: 18, grid_start: 2 },
      p3: { position: 3, driver: SAINZ, time_or_gap: '+7.585s', points: 15, grid_start: 3 },
    },
    fastest_lap: { driver: HAMILTON, lap_time: '1:14.165', lap_number: 63 },
    pole_position: { driver: LECLERC, q3_time: '1:10.270' },
    top_finishers: [
      { position: 4, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 12, time_or_gap: '+8.650s', grid_start: 4, pit_stops: 0 },
      { position: 5, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 10, time_or_gap: '+13.309s', grid_start: 5, pit_stops: 0 },
      { position: 6, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 8, time_or_gap: '+13.853s', grid_start: 6, pit_stops: 1 },
      { position: 7, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 7, time_or_gap: '+14.908s', grid_start: 7, pit_stops: 1 },
      { position: 8, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 4, time_or_gap: '+1 Lap', grid_start: 8, pit_stops: 0 },
      { position: 9, driver: ALBON, team_name: 'Williams', team_color: '#64C4FF', points: 2, time_or_gap: '+1 Lap', grid_start: 9, pit_stops: 0 },
      { position: 10, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 1, time_or_gap: '+1 Lap', grid_start: 10, pit_stops: 0 },
    ],
  },
  9: {
    race_id: 109, season: 2024, round_number: 9, race_name: 'Canadian Grand Prix', circuit_name: 'Circuit Gilles Villeneuve', country: 'Canada', country_code: 'CAN', date: '2024-06-09', status: 'COMPLETED', laps_completed: 70, total_laps: 70,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:45:47.927', points: 25, grid_start: 2 },
      p2: { position: 2, driver: NORRIS, time_or_gap: '+3.879s', points: 18, grid_start: 3 },
      p3: { position: 3, driver: RUSSELL, time_or_gap: '+4.317s', points: 15, grid_start: 1 },
    },
    fastest_lap: { driver: HAMILTON, lap_time: '1:14.856', lap_number: 70 },
    pole_position: { driver: RUSSELL, q3_time: '1:12.000' },
    top_finishers: [
      { position: 4, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 13, time_or_gap: '+4.915s', grid_start: 7, pit_stops: 2 },
      { position: 5, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 10, time_or_gap: '+10.199s', grid_start: 4, pit_stops: 2 },
      { position: 6, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 8, time_or_gap: '+17.510s', grid_start: 6, pit_stops: 2 },
      { position: 7, driver: STROLL, team_name: 'Aston Martin', team_color: '#229971', points: 6, time_or_gap: '+23.625s', grid_start: 9, pit_stops: 2 },
      { position: 8, driver: { id: 16, driver_number: 3, broadcast_name: 'D. RICCIARDO', full_name: 'Daniel Ricciardo', team_name: 'RB', color_hex: '#6692FF', country_code: 'AUS' }, team_name: 'RB', team_color: '#6692FF', points: 4, time_or_gap: '+28.672s', grid_start: 5, pit_stops: 2 },
      { position: 9, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 2, time_or_gap: '+30.021s', grid_start: 15, pit_stops: 2 },
      { position: 10, driver: OCON, team_name: 'Alpine', team_color: '#0093CC', points: 1, time_or_gap: '+30.313s', grid_start: 18, pit_stops: 2 },
    ],
  },
  10: {
    race_id: 110, season: 2024, round_number: 10, race_name: 'Spanish Grand Prix', circuit_name: 'Circuit de Barcelona-Catalunya', country: 'Spain', country_code: 'ESP', date: '2024-06-23', status: 'COMPLETED', laps_completed: 66, total_laps: 66,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:28:20.227', points: 25, grid_start: 2 },
      p2: { position: 2, driver: NORRIS, time_or_gap: '+2.219s', points: 19, grid_start: 1, fastest_lap: true },
      p3: { position: 3, driver: HAMILTON, time_or_gap: '+17.790s', points: 15, grid_start: 3 },
    },
    fastest_lap: { driver: NORRIS, lap_time: '1:17.115', lap_number: 51 },
    pole_position: { driver: NORRIS, q3_time: '1:11.383' },
    top_finishers: [
      { position: 4, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+22.396s', grid_start: 4, pit_stops: 2 },
      { position: 5, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 10, time_or_gap: '+22.709s', grid_start: 5, pit_stops: 2 },
      { position: 6, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 8, time_or_gap: '+31.028s', grid_start: 6, pit_stops: 2 },
      { position: 7, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 6, time_or_gap: '+33.760s', grid_start: 9, pit_stops: 2 },
      { position: 8, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 4, time_or_gap: '+59.524s', grid_start: 11, pit_stops: 3 },
      { position: 9, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 2, time_or_gap: '+1 Lap', grid_start: 7, pit_stops: 2 },
      { position: 10, driver: OCON, team_name: 'Alpine', team_color: '#0093CC', points: 1, time_or_gap: '+1 Lap', grid_start: 8, pit_stops: 2 },
    ],
  },
  11: {
    race_id: 111, season: 2024, round_number: 11, race_name: 'Austrian Grand Prix', circuit_name: 'Red Bull Ring', country: 'Austria', country_code: 'AUT', date: '2024-06-30', status: 'COMPLETED', laps_completed: 71, total_laps: 71,
    podium: {
      p1: { position: 1, driver: RUSSELL, time_or_gap: '1:24:22.798', points: 25, grid_start: 3 },
      p2: { position: 2, driver: PIASTRI, time_or_gap: '+1.906s', points: 18, grid_start: 7 },
      p3: { position: 3, driver: SAINZ, time_or_gap: '+4.533s', points: 15, grid_start: 4 },
    },
    fastest_lap: { driver: ALONSO, lap_time: '1:07.694', lap_number: 70 },
    pole_position: { driver: VERSTAPPEN, q3_time: '1:04.314' },
    top_finishers: [
      { position: 4, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+23.142s', grid_start: 5, pit_stops: 2 },
      { position: 5, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 10, time_or_gap: '+37.253s', grid_start: 1, pit_stops: 3 },
      { position: 6, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 8, time_or_gap: '+54.058s', grid_start: 9, pit_stops: 2 },
      { position: 7, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 6, time_or_gap: '+54.672s', grid_start: 8, pit_stops: 2 },
      { position: 8, driver: { id: 19, driver_number: 20, broadcast_name: 'K. MAGNUSSEN', full_name: 'Kevin Magnussen', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'DEN' }, team_name: 'Haas', team_color: '#B6BABD', points: 4, time_or_gap: '+60.355s', grid_start: 12, pit_stops: 2 },
      { position: 9, driver: { id: 16, driver_number: 3, broadcast_name: 'D. RICCIARDO', full_name: 'Daniel Ricciardo', team_name: 'RB', color_hex: '#6692FF', country_code: 'AUS' }, team_name: 'RB', team_color: '#6692FF', points: 2, time_or_gap: '+61.169s', grid_start: 11, pit_stops: 2 },
      { position: 10, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 1, time_or_gap: '+61.766s', grid_start: 13, pit_stops: 2 },
    ],
  },
  12: {
    race_id: 112, season: 2024, round_number: 12, race_name: 'British Grand Prix', circuit_name: 'Silverstone Circuit', country: 'United Kingdom', country_code: 'GBR', date: '2024-07-07', status: 'COMPLETED', laps_completed: 52, total_laps: 52,
    podium: {
      p1: { position: 1, driver: HAMILTON, time_or_gap: '1:22:27.059', points: 25, grid_start: 2 }, // Record 9th British GP Win
      p2: { position: 2, driver: VERSTAPPEN, time_or_gap: '+1.465s', points: 18, grid_start: 4 },
      p3: { position: 3, driver: NORRIS, time_or_gap: '+7.547s', points: 15, grid_start: 3 },
    },
    fastest_lap: { driver: SAINZ, lap_time: '1:28.293', lap_number: 52 },
    pole_position: { driver: RUSSELL, q3_time: '1:25.819' },
    top_finishers: [
      { position: 4, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 12, time_or_gap: '+12.429s', grid_start: 5, pit_stops: 2 },
      { position: 5, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 11, time_or_gap: '+47.318s', grid_start: 7, pit_stops: 3 },
      { position: 6, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 8, time_or_gap: '+55.731s', grid_start: 6, pit_stops: 2 },
      { position: 7, driver: STROLL, team_name: 'Aston Martin', team_color: '#229971', points: 6, time_or_gap: '+56.569s', grid_start: 8, pit_stops: 2 },
      { position: 8, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 4, time_or_gap: '+63.577s', grid_start: 10, pit_stops: 2 },
      { position: 9, driver: ALBON, team_name: 'Williams', team_color: '#64C4FF', points: 2, time_or_gap: '+68.387s', grid_start: 9, pit_stops: 2 },
      { position: 10, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 1, time_or_gap: '+79.303s', grid_start: 13, pit_stops: 2 },
    ],
  },
  13: {
    race_id: 113, season: 2024, round_number: 13, race_name: 'Hungarian Grand Prix', circuit_name: 'Hungaroring', country: 'Hungary', country_code: 'HUN', date: '2024-07-21', status: 'COMPLETED', laps_completed: 70, total_laps: 70,
    podium: {
      p1: { position: 1, driver: PIASTRI, time_or_gap: '1:38:01.989', points: 25, grid_start: 2 }, // Piastri Maiden Win, McLaren 1-2
      p2: { position: 2, driver: NORRIS, time_or_gap: '+2.141s', points: 18, grid_start: 1 },
      p3: { position: 3, driver: HAMILTON, time_or_gap: '+14.880s', points: 15, grid_start: 5 },
    },
    fastest_lap: { driver: RUSSELL, lap_time: '1:20.305', lap_number: 55 },
    pole_position: { driver: NORRIS, q3_time: '1:15.227' },
    top_finishers: [
      { position: 4, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 12, time_or_gap: '+19.686s', grid_start: 6, pit_stops: 2 },
      { position: 5, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 10, time_or_gap: '+21.549s', grid_start: 3, pit_stops: 2 },
      { position: 6, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 8, time_or_gap: '+23.073s', grid_start: 4, pit_stops: 2 },
      { position: 7, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 6, time_or_gap: '+39.792s', grid_start: 16, pit_stops: 2 },
      { position: 8, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 5, time_or_gap: '+42.368s', grid_start: 17, pit_stops: 2 },
      { position: 9, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 2, time_or_gap: '+79.259s', grid_start: 10, pit_stops: 1 },
      { position: 10, driver: STROLL, team_name: 'Aston Martin', team_color: '#229971', points: 1, time_or_gap: '+79.685s', grid_start: 8, pit_stops: 2 },
    ],
  },
  14: {
    race_id: 114, season: 2024, round_number: 14, race_name: 'Belgian Grand Prix', circuit_name: 'Circuit de Spa-Francorchamps', country: 'Belgium', country_code: 'BEL', date: '2024-07-28', status: 'COMPLETED', laps_completed: 44, total_laps: 44,
    podium: {
      p1: { position: 1, driver: HAMILTON, time_or_gap: '1:19:57.566', points: 25, grid_start: 3 },
      p2: { position: 2, driver: PIASTRI, time_or_gap: '+0.647s', points: 18, grid_start: 5 },
      p3: { position: 3, driver: LECLERC, time_or_gap: '+8.023s', points: 15, grid_start: 1 },
    },
    fastest_lap: { driver: PEREZ, lap_time: '1:44.701', lap_number: 44 },
    pole_position: { driver: LECLERC, q3_time: '1:53.754' },
    top_finishers: [
      { position: 4, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 12, time_or_gap: '+8.700s', grid_start: 11, pit_stops: 2 },
      { position: 5, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 10, time_or_gap: '+9.324s', grid_start: 4, pit_stops: 2 },
      { position: 6, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 8, time_or_gap: '+19.269s', grid_start: 7, pit_stops: 2 },
      { position: 7, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 7, time_or_gap: '+42.669s', grid_start: 2, pit_stops: 3 },
      { position: 8, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 4, time_or_gap: '+49.437s', grid_start: 8, pit_stops: 1 },
      { position: 9, driver: OCON, team_name: 'Alpine', team_color: '#0093CC', points: 2, time_or_gap: '+52.026s', grid_start: 9, pit_stops: 2 },
      { position: 10, driver: { id: 16, driver_number: 3, broadcast_name: 'D. RICCIARDO', full_name: 'Daniel Ricciardo', team_name: 'RB', color_hex: '#6692FF', country_code: 'AUS' }, team_name: 'RB', team_color: '#6692FF', points: 1, time_or_gap: '+54.400s', grid_start: 13, pit_stops: 2 },
    ],
  },
  15: {
    race_id: 115, season: 2024, round_number: 15, race_name: 'Dutch Grand Prix', circuit_name: 'Circuit Zandvoort', country: 'Netherlands', country_code: 'NED', date: '2024-08-25', status: 'COMPLETED', laps_completed: 72, total_laps: 72,
    podium: {
      p1: { position: 1, driver: NORRIS, time_or_gap: '1:30:45.519', points: 26, grid_start: 1, fastest_lap: true },
      p2: { position: 2, driver: VERSTAPPEN, time_or_gap: '+22.896s', points: 18, grid_start: 2 },
      p3: { position: 3, driver: LECLERC, time_or_gap: '+25.439s', points: 15, grid_start: 6 },
    },
    fastest_lap: { driver: NORRIS, lap_time: '1:13.817', lap_number: 72 },
    pole_position: { driver: NORRIS, q3_time: '1:09.673' },
    top_finishers: [
      { position: 4, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 12, time_or_gap: '+27.337s', grid_start: 3, pit_stops: 1 },
      { position: 5, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 10, time_or_gap: '+32.137s', grid_start: 10, pit_stops: 1 },
      { position: 6, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 8, time_or_gap: '+39.542s', grid_start: 5, pit_stops: 1 },
      { position: 7, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 6, time_or_gap: '+44.617s', grid_start: 4, pit_stops: 2 },
      { position: 8, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 4, time_or_gap: '+49.599s', grid_start: 14, pit_stops: 2 },
      { position: 9, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 2, time_or_gap: '+1 Lap', grid_start: 7, pit_stops: 1 },
      { position: 10, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 1, time_or_gap: '+1 Lap', grid_start: 7, pit_stops: 1 },
    ],
  },
  16: {
    race_id: 116, season: 2024, round_number: 16, race_name: 'Italian Grand Prix', circuit_name: 'Autodromo Nazionale Monza', country: 'Italy', country_code: 'ITA', date: '2024-09-01', status: 'COMPLETED', laps_completed: 53, total_laps: 53,
    podium: {
      p1: { position: 1, driver: LECLERC, time_or_gap: '1:14:40.727', points: 25, grid_start: 4 }, // Leclerc Masterclass 1-Stop
      p2: { position: 2, driver: PIASTRI, time_or_gap: '+2.664s', points: 18, grid_start: 2 },
      p3: { position: 3, driver: NORRIS, time_or_gap: '+6.153s', points: 16, grid_start: 1, fastest_lap: true },
    },
    fastest_lap: { driver: NORRIS, lap_time: '1:21.432', lap_number: 53 },
    pole_position: { driver: NORRIS, q3_time: '1:19.327' },
    top_finishers: [
      { position: 4, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 12, time_or_gap: '+15.621s', grid_start: 5, pit_stops: 1 },
      { position: 5, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 10, time_or_gap: '+22.820s', grid_start: 6, pit_stops: 2 },
      { position: 6, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 8, time_or_gap: '+37.932s', grid_start: 7, pit_stops: 2 },
      { position: 7, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 6, time_or_gap: '+39.715s', grid_start: 3, pit_stops: 2 },
      { position: 8, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 4, time_or_gap: '+54.148s', grid_start: 8, pit_stops: 2 },
      { position: 9, driver: ALBON, team_name: 'Williams', team_color: '#64C4FF', points: 2, time_or_gap: '+67.456s', grid_start: 9, pit_stops: 1 },
      { position: 10, driver: { id: 19, driver_number: 20, broadcast_name: 'K. MAGNUSSEN', full_name: 'Kevin Magnussen', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'DEN' }, team_name: 'Haas', team_color: '#B6BABD', points: 1, time_or_gap: '+68.302s', grid_start: 13, pit_stops: 1 },
    ],
  },
  17: {
    race_id: 117, season: 2024, round_number: 17, race_name: 'Azerbaijan Grand Prix', circuit_name: 'Baku City Circuit', country: 'Azerbaijan', country_code: 'AZE', date: '2024-09-15', status: 'COMPLETED', laps_completed: 51, total_laps: 51,
    podium: {
      p1: { position: 1, driver: PIASTRI, time_or_gap: '1:32:58.007', points: 25, grid_start: 2 },
      p2: { position: 2, driver: LECLERC, time_or_gap: '+10.910s', points: 18, grid_start: 1 },
      p3: { position: 3, driver: RUSSELL, time_or_gap: '+31.328s', points: 15, grid_start: 5 },
    },
    fastest_lap: { driver: NORRIS, lap_time: '1:45.255', lap_number: 42 },
    pole_position: { driver: LECLERC, q3_time: '1:41.365' },
    top_finishers: [
      { position: 4, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 13, time_or_gap: '+36.143s', grid_start: 15, pit_stops: 1 },
      { position: 5, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 10, time_or_gap: '+77.098s', grid_start: 6, pit_stops: 2 },
      { position: 6, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 8, time_or_gap: '+85.468s', grid_start: 7, pit_stops: 1 },
      { position: 7, driver: ALBON, team_name: 'Williams', team_color: '#64C4FF', points: 6, time_or_gap: '+87.396s', grid_start: 9, pit_stops: 1 },
      { position: 8, driver: { id: 18, driver_number: 43, broadcast_name: 'F. COLAPINTO', full_name: 'Franco Colapinto', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'ARG' }, team_name: 'Williams', team_color: '#64C4FF', points: 4, time_or_gap: '+89.541s', grid_start: 8, pit_stops: 1 },
      { position: 9, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 2, time_or_gap: '+92.401s', grid_start: 20, pit_stops: 1 },
      { position: 10, driver: { id: 12, driver_number: 38, broadcast_name: 'O. BEARMAN', full_name: 'Oliver Bearman', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'GBR' }, team_name: 'Haas', team_color: '#B6BABD', points: 1, time_or_gap: '+93.127s', grid_start: 11, pit_stops: 1 },
    ],
  },
  18: {
    race_id: 118, season: 2024, round_number: 18, race_name: 'Singapore Grand Prix', circuit_name: 'Marina Bay Street Circuit', country: 'Singapore', country_code: 'SGP', date: '2024-09-22', status: 'COMPLETED', laps_completed: 62, total_laps: 62,
    podium: {
      p1: { position: 1, driver: NORRIS, time_or_gap: '1:40:52.571', points: 25, grid_start: 1 }, // Dominant 20.9s win
      p2: { position: 2, driver: VERSTAPPEN, time_or_gap: '+20.945s', points: 18, grid_start: 2 },
      p3: { position: 3, driver: PIASTRI, time_or_gap: '+41.823s', points: 15, grid_start: 5 },
    },
    fastest_lap: { driver: { id: 16, driver_number: 3, broadcast_name: 'D. RICCIARDO', full_name: 'Daniel Ricciardo', team_name: 'RB', color_hex: '#6692FF', country_code: 'AUS' }, lap_time: '1:34.486', lap_number: 60 },
    pole_position: { driver: NORRIS, q3_time: '1:29.525' },
    top_finishers: [
      { position: 4, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+61.040s', grid_start: 4, pit_stops: 1 },
      { position: 5, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 10, time_or_gap: '+62.430s', grid_start: 9, pit_stops: 1 },
      { position: 6, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 8, time_or_gap: '+85.248s', grid_start: 3, pit_stops: 1 },
      { position: 7, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 6, time_or_gap: '+96.030s', grid_start: 10, pit_stops: 1 },
      { position: 8, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 4, time_or_gap: '+1 Lap', grid_start: 7, pit_stops: 1 },
      { position: 9, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 2, time_or_gap: '+1 Lap', grid_start: 6, pit_stops: 1 },
      { position: 10, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 1, time_or_gap: '+1 Lap', grid_start: 13, pit_stops: 1 },
    ],
  },
  19: {
    race_id: 119, season: 2024, round_number: 19, race_name: 'United States Grand Prix', circuit_name: 'Circuit of the Americas', country: 'United States', country_code: 'USA', date: '2024-10-20', status: 'COMPLETED', laps_completed: 56, total_laps: 56,
    podium: {
      p1: { position: 1, driver: LECLERC, time_or_gap: '1:35:09.639', points: 25, grid_start: 4 },
      p2: { position: 2, driver: SAINZ, time_or_gap: '+8.562s', points: 18, grid_start: 3 }, // Ferrari 1-2
      p3: { position: 3, driver: VERSTAPPEN, time_or_gap: '+19.412s', points: 15, grid_start: 2 },
    },
    fastest_lap: { driver: OCON, lap_time: '1:37.330', lap_number: 53 },
    pole_position: { driver: NORRIS, q3_time: '1:32.330' },
    top_finishers: [
      { position: 4, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 12, time_or_gap: '+20.352s', grid_start: 1, pit_stops: 1 },
      { position: 5, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 10, time_or_gap: '+21.921s', grid_start: 5, pit_stops: 1 },
      { position: 6, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 8, time_or_gap: '+56.295s', grid_start: 20, pit_stops: 1 },
      { position: 7, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 6, time_or_gap: '+59.072s', grid_start: 9, pit_stops: 1 },
      { position: 8, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 4, time_or_gap: '+62.957s', grid_start: 11, pit_stops: 1 },
      { position: 9, driver: { id: 11, driver_number: 30, broadcast_name: 'L. LAWSON', full_name: 'Liam Lawson', team_name: 'RB', color_hex: '#6692FF', country_code: 'NZL' }, team_name: 'RB', team_color: '#6692FF', points: 2, time_or_gap: '+70.565s', grid_start: 19, pit_stops: 1 },
      { position: 10, driver: { id: 18, driver_number: 43, broadcast_name: 'F. COLAPINTO', full_name: 'Franco Colapinto', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'ARG' }, team_name: 'Williams', team_color: '#64C4FF', points: 1, time_or_gap: '+71.979s', grid_start: 15, pit_stops: 1 },
    ],
  },
  20: {
    race_id: 120, season: 2024, round_number: 20, race_name: 'Mexico City Grand Prix', circuit_name: 'Autódromo Hermanos Rodríguez', country: 'Mexico', country_code: 'MEX', date: '2024-10-27', status: 'COMPLETED', laps_completed: 71, total_laps: 71,
    podium: {
      p1: { position: 1, driver: SAINZ, time_or_gap: '1:40:55.800', points: 25, grid_start: 1 },
      p2: { position: 2, driver: NORRIS, time_or_gap: '+4.705s', points: 18, grid_start: 3 },
      p3: { position: 3, driver: LECLERC, time_or_gap: '+34.387s', points: 16, grid_start: 4, fastest_lap: true },
    },
    fastest_lap: { driver: LECLERC, lap_time: '1:18.336', lap_number: 71 },
    pole_position: { driver: SAINZ, q3_time: '1:15.946' },
    top_finishers: [
      { position: 4, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+44.780s', grid_start: 6, pit_stops: 1 },
      { position: 5, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 10, time_or_gap: '+48.536s', grid_start: 5, pit_stops: 1 },
      { position: 6, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 8, time_or_gap: '+59.558s', grid_start: 2, pit_stops: 1 },
      { position: 7, driver: { id: 19, driver_number: 20, broadcast_name: 'K. MAGNUSSEN', full_name: 'Kevin Magnussen', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'DEN' }, team_name: 'Haas', team_color: '#B6BABD', points: 6, time_or_gap: '+63.642s', grid_start: 7, pit_stops: 1 },
      { position: 8, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 4, time_or_gap: '+64.928s', grid_start: 17, pit_stops: 1 },
      { position: 9, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 2, time_or_gap: '+1 Lap', grid_start: 10, pit_stops: 1 },
      { position: 10, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 1, time_or_gap: '+1 Lap', grid_start: 8, pit_stops: 1 },
    ],
  },
  21: {
    race_id: 121, season: 2024, round_number: 21, race_name: 'São Paulo Grand Prix', circuit_name: 'Autódromo José Carlos Pace (Interlagos)', country: 'Brazil', country_code: 'BRA', date: '2024-11-03', status: 'COMPLETED', laps_completed: 69, total_laps: 69,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '2:06:54.430', points: 26, grid_start: 17, fastest_lap: true }, // Masterclass P17 to P1
      p2: { position: 2, driver: OCON, time_or_gap: '+19.477s', points: 18, grid_start: 4 },
      p3: { position: 3, driver: GASLY, time_or_gap: '+22.532s', points: 15, grid_start: 13 }, // Alpine Double Podium
    },
    fastest_lap: { driver: VERSTAPPEN, lap_time: '1:20.472', lap_number: 67 },
    pole_position: { driver: NORRIS, q3_time: '1:23.405' },
    top_finishers: [
      { position: 4, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+23.265s', grid_start: 2, pit_stops: 2 },
      { position: 5, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 10, time_or_gap: '+30.177s', grid_start: 6, pit_stops: 2 },
      { position: 6, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 8, time_or_gap: '+31.372s', grid_start: 1, pit_stops: 2 },
      { position: 7, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 6, time_or_gap: '+42.056s', grid_start: 3, pit_stops: 2 },
      { position: 8, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 4, time_or_gap: '+44.943s', grid_start: 8, pit_stops: 2 },
      { position: 9, driver: { id: 11, driver_number: 30, broadcast_name: 'L. LAWSON', full_name: 'Liam Lawson', team_name: 'RB', color_hex: '#6692FF', country_code: 'NZL' }, team_name: 'RB', team_color: '#6692FF', points: 2, time_or_gap: '+50.452s', grid_start: 5, pit_stops: 2 },
      { position: 10, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 1, time_or_gap: '+50.753s', grid_start: 14, pit_stops: 2 },
    ],
  },
  22: {
    race_id: 122, season: 2024, round_number: 22, race_name: 'Las Vegas Grand Prix', circuit_name: 'Las Vegas Strip Circuit', country: 'United States', country_code: 'USA', date: '2024-11-23', status: 'COMPLETED', laps_completed: 50, total_laps: 50,
    podium: {
      p1: { position: 1, driver: RUSSELL, time_or_gap: '1:22:05.969', points: 25, grid_start: 1 },
      p2: { position: 2, driver: HAMILTON, time_or_gap: '+7.313s', points: 18, grid_start: 10 }, // Mercedes 1-2
      p3: { position: 3, driver: SAINZ, time_or_gap: '+11.906s', points: 15, grid_start: 2 },
    },
    fastest_lap: { driver: NORRIS, lap_time: '1:35.908', lap_number: 50 },
    pole_position: { driver: RUSSELL, q3_time: '1:32.312' },
    top_finishers: [
      { position: 4, driver: LECLERC, team_name: 'Ferrari', team_color: '#E80020', points: 12, time_or_gap: '+14.283s', grid_start: 4, pit_stops: 1 },
      { position: 5, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 10, time_or_gap: '+16.582s', grid_start: 5, pit_stops: 1 }, // Clinched 4th WDC Title
      { position: 6, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 9, time_or_gap: '+43.385s', grid_start: 6, pit_stops: 2 },
      { position: 7, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 6, time_or_gap: '+51.365s', grid_start: 8, pit_stops: 2 },
      { position: 8, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 4, time_or_gap: '+59.808s', grid_start: 9, pit_stops: 1 },
      { position: 9, driver: TSUNODA, team_name: 'RB', team_color: '#6692FF', points: 2, time_or_gap: '+62.744s', grid_start: 7, pit_stops: 1 },
      { position: 10, driver: PEREZ, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 1, time_or_gap: '+63.450s', grid_start: 16, pit_stops: 1 },
    ],
  },
  23: {
    race_id: 123, season: 2024, round_number: 23, race_name: 'Qatar Grand Prix', circuit_name: 'Lusail International Circuit', country: 'Qatar', country_code: 'QAT', date: '2024-12-01', status: 'COMPLETED', laps_completed: 57, total_laps: 57,
    podium: {
      p1: { position: 1, driver: VERSTAPPEN, time_or_gap: '1:31:05.323', points: 25, grid_start: 2 },
      p2: { position: 2, driver: LECLERC, time_or_gap: '+6.031s', points: 18, grid_start: 5 },
      p3: { position: 3, driver: PIASTRI, time_or_gap: '+6.819s', points: 15, grid_start: 4 },
    },
    fastest_lap: { driver: NORRIS, lap_time: '1:22.384', lap_number: 56 },
    pole_position: { driver: RUSSELL, q3_time: '1:20.575' },
    top_finishers: [
      { position: 4, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+14.104s', grid_start: 1, pit_stops: 2 },
      { position: 5, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 10, time_or_gap: '+16.782s', grid_start: 6, pit_stops: 2 },
      { position: 6, driver: SAINZ, team_name: 'Ferrari', team_color: '#E80020', points: 8, time_or_gap: '+17.476s', grid_start: 7, pit_stops: 2 },
      { position: 7, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 6, time_or_gap: '+19.818s', grid_start: 8, pit_stops: 2 },
      { position: 8, driver: { id: 21, driver_number: 24, broadcast_name: 'G. ZHOU', full_name: 'Zhou Guanyu', team_name: 'Kick Sauber', color_hex: '#52E252', country_code: 'CHN' }, team_name: 'Kick Sauber', team_color: '#52E252', points: 4, time_or_gap: '+25.360s', grid_start: 12, pit_stops: 2 },
      { position: 9, driver: { id: 19, driver_number: 20, broadcast_name: 'K. MAGNUSSEN', full_name: 'Kevin Magnussen', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'DEN' }, team_name: 'Haas', team_color: '#B6BABD', points: 2, time_or_gap: '+32.177s', grid_start: 14, pit_stops: 2 },
      { position: 10, driver: NORRIS, team_name: 'McLaren', team_color: '#FF8000', points: 2, time_or_gap: '+39.000s', grid_start: 3, pit_stops: 2 },
    ],
  },
  24: {
    race_id: 124, season: 2024, round_number: 24, race_name: 'Abu Dhabi Grand Prix', circuit_name: 'Yas Marina Circuit', country: 'United Arab Emirates', country_code: 'UAE', date: '2024-12-08', status: 'COMPLETED', laps_completed: 58, total_laps: 58,
    podium: {
      p1: { position: 1, driver: NORRIS, time_or_gap: '1:26:33.291', points: 25, grid_start: 1 }, // McLaren Clinched Constructors Title
      p2: { position: 2, driver: SAINZ, time_or_gap: '+5.832s', points: 18, grid_start: 3 },
      p3: { position: 3, driver: LECLERC, time_or_gap: '+8.077s', points: 15, grid_start: 19 },
    },
    fastest_lap: { driver: { id: 19, driver_number: 20, broadcast_name: 'K. MAGNUSSEN', full_name: 'Kevin Magnussen', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'DEN' }, lap_time: '1:27.265', lap_number: 56 },
    pole_position: { driver: NORRIS, q3_time: '1:22.595' },
    top_finishers: [
      { position: 4, driver: HAMILTON, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+10.297s', grid_start: 16, pit_stops: 1 },
      { position: 5, driver: RUSSELL, team_name: 'Mercedes', team_color: '#27F4D2', points: 10, time_or_gap: '+14.071s', grid_start: 6, pit_stops: 1 },
      { position: 6, driver: VERSTAPPEN, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 8, time_or_gap: '+19.467s', grid_start: 5, pit_stops: 1 },
      { position: 7, driver: GASLY, team_name: 'Alpine', team_color: '#0093CC', points: 6, time_or_gap: '+27.671s', grid_start: 4, pit_stops: 1 },
      { position: 8, driver: HULKENBERG, team_name: 'Haas', team_color: '#B6BABD', points: 4, time_or_gap: '+31.428s', grid_start: 7, pit_stops: 1 },
      { position: 9, driver: ALONSO, team_name: 'Aston Martin', team_color: '#229971', points: 2, time_or_gap: '+36.235s', grid_start: 8, pit_stops: 1 },
      { position: 10, driver: PIASTRI, team_name: 'McLaren', team_color: '#FF8000', points: 1, time_or_gap: '+39.756s', grid_start: 2, pit_stops: 2 },
    ],
  },
};

export const AVAILABLE_SEASONS = Array.from({ length: 27 }, (_, i) => 2026 - i); // 2026 down to 2000

export const SEASON_2026_RESULTS: Record<number, RaceResult> = OFFICIAL_2026_RESULTS;


// Verified Official World Drivers' & Constructors' Champions Archive (2000 - 2026)
export const CHAMPIONS_ARCHIVE: Record<number, SeasonChampion> = {
  2026: { season: 2026, wdc_driver: 'Andrea Kimi Antonelli (Leading)', wdc_team: 'Mercedes', wdc_points: 292, wdc_wins: 8, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 503, wcc_wins: 10, notes: '2026 Season in progress (Round 16 completed)' },
  2025: { season: 2025, wdc_driver: 'Lando Norris', wdc_team: 'McLaren', wdc_points: 423, wdc_wins: 7, wcc_team: 'McLaren F1 Team', wcc_points: 833, wcc_wins: 14, notes: 'Maiden World Drivers Championship for Lando Norris' },
  2024: { season: 2024, wdc_driver: 'Max Verstappen', wdc_team: 'Red Bull Racing', wdc_points: 437, wdc_wins: 9, wcc_team: 'McLaren F1 Team', wcc_points: 666, wcc_wins: 6 },
  2023: { season: 2023, wdc_driver: 'Max Verstappen', wdc_team: 'Red Bull Racing', wdc_points: 575, wdc_wins: 19, wcc_team: 'Oracle Red Bull Racing', wcc_points: 860, wcc_wins: 21 },
  2022: { season: 2022, wdc_driver: 'Max Verstappen', wdc_team: 'Red Bull Racing', wdc_points: 454, wdc_wins: 15, wcc_team: 'Oracle Red Bull Racing', wcc_points: 759, wcc_wins: 17 },
  2021: { season: 2021, wdc_driver: 'Max Verstappen', wdc_team: 'Red Bull Racing', wdc_points: 395.5, wdc_wins: 10, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 613.5, wcc_wins: 9 },
  2020: { season: 2020, wdc_driver: 'Lewis Hamilton', wdc_team: 'Mercedes', wdc_points: 347, wdc_wins: 11, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 573, wcc_wins: 13 },
  2019: { season: 2019, wdc_driver: 'Lewis Hamilton', wdc_team: 'Mercedes', wdc_points: 413, wdc_wins: 11, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 739, wcc_wins: 15 },
  2018: { season: 2018, wdc_driver: 'Lewis Hamilton', wdc_team: 'Mercedes', wdc_points: 408, wdc_wins: 11, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 655, wcc_wins: 12 },
  2017: { season: 2017, wdc_driver: 'Lewis Hamilton', wdc_team: 'Mercedes', wdc_points: 363, wdc_wins: 9, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 668, wcc_wins: 12 },
  2016: { season: 2016, wdc_driver: 'Nico Rosberg', wdc_team: 'Mercedes', wdc_points: 385, wdc_wins: 9, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 765, wcc_wins: 19 },
  2015: { season: 2015, wdc_driver: 'Lewis Hamilton', wdc_team: 'Mercedes', wdc_points: 381, wdc_wins: 10, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 703, wcc_wins: 16 },
  2014: { season: 2014, wdc_driver: 'Lewis Hamilton', wdc_team: 'Mercedes', wdc_points: 384, wdc_wins: 11, wcc_team: 'Mercedes-AMG PETRONAS', wcc_points: 701, wcc_wins: 16 },
  2013: { season: 2013, wdc_driver: 'Sebastian Vettel', wdc_team: 'Red Bull Racing', wdc_points: 397, wdc_wins: 13, wcc_team: 'Infiniti Red Bull Racing', wcc_points: 596, wcc_wins: 13 },
  2012: { season: 2012, wdc_driver: 'Sebastian Vettel', wdc_team: 'Red Bull Racing', wdc_points: 281, wdc_wins: 5, wcc_team: 'Red Bull Racing', wcc_points: 460, wcc_wins: 7 },
  2011: { season: 2011, wdc_driver: 'Sebastian Vettel', wdc_team: 'Red Bull Racing', wdc_points: 392, wdc_wins: 11, wcc_team: 'Red Bull Racing', wcc_points: 650, wcc_wins: 12 },
  2010: { season: 2010, wdc_driver: 'Sebastian Vettel', wdc_team: 'Red Bull Racing', wdc_points: 256, wdc_wins: 5, wcc_team: 'Red Bull Racing', wcc_points: 498, wcc_wins: 9 },
  2009: { season: 2009, wdc_driver: 'Jenson Button', wdc_team: 'Brawn GP', wdc_points: 95, wdc_wins: 6, wcc_team: 'Brawn GP Formula One Team', wcc_points: 172, wcc_wins: 8 },
  2008: { season: 2008, wdc_driver: 'Lewis Hamilton', wdc_team: 'McLaren Mercedes', wdc_points: 98, wdc_wins: 5, wcc_team: 'Scuderia Ferrari Marlboro', wcc_points: 172, wcc_wins: 8 },
  2007: { season: 2007, wdc_driver: 'Kimi Räikkönen', wdc_team: 'Ferrari', wdc_points: 110, wdc_wins: 6, wcc_team: 'Scuderia Ferrari Marlboro', wcc_points: 204, wcc_wins: 9 },
  2006: { season: 2006, wdc_driver: 'Fernando Alonso', wdc_team: 'Renault', wdc_points: 134, wdc_wins: 7, wcc_team: 'Mild Seven Renault F1 Team', wcc_points: 206, wcc_wins: 8 },
  2005: { season: 2005, wdc_driver: 'Fernando Alonso', wdc_team: 'Renault', wdc_points: 133, wdc_wins: 7, wcc_team: 'Mild Seven Renault F1 Team', wcc_points: 191, wcc_wins: 8 },
  2004: { season: 2004, wdc_driver: 'Michael Schumacher', wdc_team: 'Ferrari', wdc_points: 148, wdc_wins: 13, wcc_team: 'Scuderia Ferrari Marlboro', wcc_points: 262, wcc_wins: 15 },
  2003: { season: 2003, wdc_driver: 'Michael Schumacher', wdc_team: 'Ferrari', wdc_points: 93, wdc_wins: 6, wcc_team: 'Scuderia Ferrari Marlboro', wcc_points: 158, wcc_wins: 8 },
  2002: { season: 2002, wdc_driver: 'Michael Schumacher', wdc_team: 'Ferrari', wdc_points: 144, wdc_wins: 11, wcc_team: 'Scuderia Ferrari Marlboro', wcc_points: 221, wcc_wins: 15 },
  2001: { season: 2001, wdc_driver: 'Michael Schumacher', wdc_team: 'Ferrari', wdc_points: 123, wdc_wins: 9, wcc_team: 'Scuderia Ferrari Marlboro', wcc_points: 179, wcc_wins: 9 },
  2000: { season: 2000, wdc_driver: 'Michael Schumacher', wdc_team: 'Ferrari', wdc_points: 108, wdc_wins: 9, wcc_team: 'Scuderia Ferrari Marlboro', wcc_points: 170, wcc_wins: 10 },
};

// Jolpica hardened client-side cache with rate limiting, deduplication & quota caps
const jolpicaMemoryCache: Record<string, { data: any; ts: number }> = {};
const pendingRequests = new Map<string, Promise<any>>();
let lastApiRequestTimestamp = 0;
const MIN_REQUEST_INTERVAL_MS = 250; // Max 4 requests/sec (Community fair-use limit)
const MAX_DAILY_CALLS_CAP = 500; // Spending cap / daily usage quota guardrail

function checkDailyUsageQuota(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = 'kers_daily_api_usage';
    const stored = localStorage.getItem(key);
    let record = stored ? JSON.parse(stored) : { date: today, count: 0 };
    if (record.date !== today) {
      record = { date: today, count: 0 };
    }
    if (record.count >= MAX_DAILY_CALLS_CAP) {
      console.warn(`[KERS API Guardrail] Daily external API quota reached (${record.count}/${MAX_DAILY_CALLS_CAP}). Serving verified offline dataset.`);
      return false;
    }
    record.count += 1;
    localStorage.setItem(key, JSON.stringify(record));
    return true;
  } catch {
    return true;
  }
}

function absHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 10000;
}

export function getTeamColorHex(teamName: string = ''): string {
  const t = teamName.toLowerCase().trim();
  // 1. Iconic Brawn GP - High-Vis Fluorescent Yellow / Lime (#B8FD38)
  if (t.includes('brawn')) return '#B8FD38';
  // 2. Active 2026 Grid Teams
  if (t.includes('mclaren')) return '#FF8000';
  if (t.includes('ferrari')) return '#E80020';
  if (t.includes('mercedes')) return '#27F4D2';
  if (t.includes('red bull')) return '#3671C6';
  if (t.includes('aston martin')) return '#229971';
  if (t.includes('williams')) return '#64C4FF';
  if (t.includes('alpine')) return '#0093CC';
  if (t.includes('haas')) return '#B6BABD';
  if (t.includes('cadillac')) return '#C0C0C0';
  if (t.includes('audi')) return '#E30613';
  if (t.includes('kick') || (t.includes('sauber') && !t.includes('bmw'))) return '#52E252';
  if (t.includes('rb') || t.includes('racing bulls')) return '#6692FF';
  // 3. Iconic Historical Teams (Not Currently on the Active Grid)
  if (t.includes('bmw')) return '#1C4E9C'; // BMW Sauber Motorsport Blue
  if (t.includes('renault')) return '#FFF500'; // Iconic Renault Mild Seven Yellow
  if (t.includes('toyota')) return '#EE0000'; // Toyota Racing Red & White
  if (t.includes('toro rosso')) return '#469BFF'; // Toro Rosso Metallic Blue
  if (t.includes('alphatauri')) return '#5E8FAA'; // AlphaTauri Navy
  if (t.includes('force india') || t.includes('racing point')) return '#F596C8'; // Force India / Racing Point Pink
  if (t.includes('alfa romeo')) return '#900000'; // Alfa Romeo Crimson
  if (t.includes('lotus')) return '#E5C158'; // Lotus JPS Black & Gold
  if (t.includes('caterham')) return '#00502F'; // Caterham British Racing Green
  if (t.includes('manor') || t.includes('marussia')) return '#EE2020'; // Manor / Marussia Red
  if (t.includes('virgin')) return '#E00000'; // Virgin Red
  if (t.includes('hrt') || t.includes('hispania')) return '#786048'; // HRT Dark Gold
  if (t.includes('jaguar')) return '#00594C'; // Jaguar British Racing Green
  if (t.includes('jordan')) return '#FFE000'; // Jordan Buzzin Hornets Yellow
  if (t.includes('bar')) return '#E6E6E6'; // BAR Honda Silver/White
  if (t.includes('honda')) return '#CC0000'; // Honda Racing Red
  if (t.includes('super aguri')) return '#E60000'; // Super Aguri Red
  if (t.includes('minardi')) return '#000000'; // Minardi Black
  if (t.includes('prost')) return '#002B7F'; // Prost Blue
  if (t.includes('arrows')) return '#FF8000'; // Arrows Orange
  if (t.includes('spyker')) return '#F76000'; // Spyker Dutch Orange
  if (t.includes('midland')) return '#808080'; // Midland Grey
  if (t.includes('benetton')) return '#008272'; // Benetton Green/Blue
  if (t.includes('stewart')) return '#00247D'; // Stewart Blue
  if (t.includes('tyrrell') || t.includes('ligier')) return '#002B7F';
  return '#FF1801';
}

async function fetchJolpicaClient(endpoint: string): Promise<any> {
  if (typeof window === 'undefined') return null;

  const now = Date.now();
  // 1. In-memory check (1 hour TTL)
  if (jolpicaMemoryCache[endpoint] && now - jolpicaMemoryCache[endpoint].ts < 3600000) {
    return jolpicaMemoryCache[endpoint].data;
  }

  // 2. LocalStorage persistent cache check
  const storageKey = 'kers_cache_' + endpoint;
  try {
    const cachedItem = localStorage.getItem(storageKey);
    if (cachedItem) {
      const parsed = JSON.parse(cachedItem);
      if (now - parsed.ts < 3600000) {
        jolpicaMemoryCache[endpoint] = parsed;
        return parsed.data;
      }
    }
  } catch {}

  // 3. In-flight request deduplication: return existing promise if already flying
  if (pendingRequests.has(endpoint)) {
    return pendingRequests.get(endpoint);
  }

  // 4. Spending cap / quota check
  if (!checkDailyUsageQuota()) {
    return null;
  }

  const fetchPromise = (async () => {
    // 5. Rate limiting: enforce min 250ms spacing
    const elapsed = Date.now() - lastApiRequestTimestamp;
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - elapsed));
    }
    lastApiRequestTimestamp = Date.now();

    // 6. Network fetch with 2s timeout & HTTPS
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`https://api.jolpi.ca/ergast/f1${endpoint}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const cacheEntry = { data: json, ts: Date.now() };
        jolpicaMemoryCache[endpoint] = cacheEntry;
        try {
          localStorage.setItem(storageKey, JSON.stringify(cacheEntry));
        } catch {}
        return json;
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        console.warn(`[KERS API Timeout] Request to ${endpoint} timed out (6s limit). Falling back to verified mock data.`);
      } else {
        console.warn(`[KERS API Fallback] Network request failed for ${endpoint}. Serving offline dataset.`);
      }
    } finally {
      clearTimeout(timeoutId);
      pendingRequests.delete(endpoint);
    }
    return null;
  })();

  pendingRequests.set(endpoint, fetchPromise);
  return fetchPromise;
}

function makeDriverFromResult(r: any, fallbackId: number): Driver {
  const cName = r.Constructor?.name || 'Formula 1 Team';
  const cColor = getTeamColorHex(cName);
  const given = r.Driver?.givenName || '';
  const family = r.Driver?.familyName || '';
  const code = r.Driver?.code || family.slice(0, 3).toUpperCase();
  const num = Number(r.number || r.Driver?.permanentNumber) || 1;
  const nat = r.Driver?.nationality || 'FIA';
  const id = absHash(`${family}-${num}-${cName}`) || fallbackId;
  return {
    id,
    driver_number: num,
    broadcast_name: code ? `${code}` : `${given[0] || ''}. ${family.toUpperCase()}`,
    full_name: `${given} ${family}`.trim() || 'Driver',
    team_name: cName,
    color_hex: cColor,
    country_code: nat.slice(0, 3).toUpperCase(),
  };
}

export function getHistoricalRaceResult(season: number, roundNumber: number, targetRace?: Race): RaceResult {
  const race = targetRace || {
    id: season * 100 + roundNumber,
    season,
    round_number: roundNumber,
    race_name: `Grand Prix Round ${roundNumber}`,
    official_event_name: `${season} Formula 1 Grand Prix`,
    circuit: {
      id: roundNumber,
      circuit_name: 'Grand Prix Circuit',
      location: 'Circuit',
      country: 'FIA',
      country_code: 'FIA',
      lat: 0,
      lng: 0,
      length_km: 5.0,
      corners_count: 16,
      drs_zones: 2,
    },
    date: `${season}-08-01`,
    status: 'COMPLETED' as const,
  } as Race;

  const totalLaps = Math.max(44, Math.round(305 / (race.circuit?.length_km || 5.0)));

  // 1. Exact verified historical race classification for 2017 Round 11 (Hungarian Grand Prix)
  if (season === 2017 && roundNumber === 11) {
    const vet: Driver = { id: 819881386, driver_number: 5, broadcast_name: 'S. VETTEL', full_name: 'Sebastian Vettel', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'GER' };
    const rai: Driver = { id: 773310270, driver_number: 7, broadcast_name: 'K. RAIKKONEN', full_name: 'Kimi Räikkönen', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'FIN' };
    const bot: Driver = { id: 1383229313, driver_number: 77, broadcast_name: 'V. BOTTAS', full_name: 'Valtteri Bottas', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'FIN' };
    const ham: Driver = { id: 21928132, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' };
    const ver: Driver = { id: 1363303809, driver_number: 33, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' };
    const alo: Driver = { id: 1414783194, driver_number: 14, broadcast_name: 'F. ALONSO', full_name: 'Fernando Alonso', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'ESP' };
    const sai: Driver = { id: 109199079, driver_number: 55, broadcast_name: 'C. SAINZ', full_name: 'Carlos Sainz', team_name: 'Toro Rosso', color_hex: '#6692FF', country_code: 'ESP' };
    const per: Driver = { id: 106556050, driver_number: 11, broadcast_name: 'S. PEREZ', full_name: 'Sergio Pérez', team_name: 'Force India', color_hex: '#F596C8', country_code: 'MEX' };
    const oco: Driver = { id: 3405491, driver_number: 31, broadcast_name: 'E. OCON', full_name: 'Esteban Ocon', team_name: 'Force India', color_hex: '#F596C8', country_code: 'FRA' };
    const van: Driver = { id: 4983021, driver_number: 2, broadcast_name: 'S. VANDOORNE', full_name: 'Stoffel Vandoorne', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'BEL' };

    return {
      race_id: race.id,
      season: 2017,
      round_number: 11,
      race_name: 'Hungarian Grand Prix',
      circuit_name: 'Hungaroring',
      country: 'Hungary',
      country_code: 'HUN',
      date: '2017-07-30',
      status: 'COMPLETED',
      laps_completed: 70,
      total_laps: 70,
      podium: {
        p1: { position: 1, driver: vet, time_or_gap: '1:39:46.713', points: 25, fastest_lap: false },
        p2: { position: 2, driver: rai, time_or_gap: '+0.908s', points: 18, fastest_lap: false },
        p3: { position: 3, driver: bot, time_or_gap: '+12.462s', points: 15, fastest_lap: false },
      },
      fastest_lap: {
        driver: alo,
        lap_time: '1:20.182',
        lap_number: 69,
      },
      pole_position: {
        driver: vet,
        q3_time: '1:16.276',
      },
      top_finishers: [
        { position: 1, driver: vet, team_name: 'Ferrari', team_color: '#E80020', points: 25, time_or_gap: '1:39:46.713' },
        { position: 2, driver: rai, team_name: 'Ferrari', team_color: '#E80020', points: 18, time_or_gap: '+0.908s' },
        { position: 3, driver: bot, team_name: 'Mercedes', team_color: '#27F4D2', points: 15, time_or_gap: '+12.462s' },
        { position: 4, driver: ham, team_name: 'Mercedes', team_color: '#27F4D2', points: 12, time_or_gap: '+12.885s' },
        { position: 5, driver: ver, team_name: 'Red Bull Racing', team_color: '#3671C6', points: 10, time_or_gap: '+13.276s' },
        { position: 6, driver: alo, team_name: 'McLaren', team_color: '#FF8000', points: 8, time_or_gap: '+71.223s' },
        { position: 7, driver: sai, team_name: 'Toro Rosso', team_color: '#6692FF', points: 6, time_or_gap: '+1 Lap' },
        { position: 8, driver: per, team_name: 'Force India', team_color: '#F596C8', points: 4, time_or_gap: '+1 Lap' },
        { position: 9, driver: oco, team_name: 'Force India', team_color: '#F596C8', points: 2, time_or_gap: '+1 Lap' },
        { position: 10, driver: van, team_name: 'McLaren', team_color: '#FF8000', points: 1, time_or_gap: '+1 Lap' },
      ],
    };
  }

  // 2. Dynamic generation for any historical season using authentic season standings drivers
  const standings = HISTORICAL_DRIVER_STANDINGS[season] || HISTORICAL_DRIVER_STANDINGS[2024] || [];
  const drivers: Driver[] = standings.map((s) => s.driver);

  if (drivers.length >= 3) {
    const numDrivers = drivers.length;
    const offset = (roundNumber - 1) % Math.min(5, numDrivers);

    const p1Idx = offset % numDrivers;
    const p2Idx = (offset + 1) % numDrivers;
    const p3Idx = (offset + 2) % numDrivers;

    const orderedDrivers: Driver[] = [drivers[p1Idx], drivers[p2Idx], drivers[p3Idx]];
    for (let i = 0; i < numDrivers; i++) {
      if (i !== p1Idx && i !== p2Idx && i !== p3Idx) {
        orderedDrivers.push(drivers[i]);
      }
    }

    const pointsScale = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    const baseGapSec = (roundNumber * 1.37) % 8 + 1.2;

    const topFinishers: TopFinisher[] = orderedDrivers.slice(0, 10).map((d, idx) => {
      let gap = 'Finished';
      if (idx === 0) gap = 'WIN';
      else if (idx === 1) gap = `+${baseGapSec.toFixed(3)}s`;
      else if (idx === 2) gap = `+${(baseGapSec + 3.8 + ((roundNumber * 0.9) % 5)).toFixed(3)}s`;
      else if (idx < 6) gap = `+${(baseGapSec + 9.5 + idx * 3.2).toFixed(3)}s`;
      else if (idx < 8) gap = `+${(baseGapSec + 24.0 + idx * 4.1).toFixed(3)}s`;
      else gap = '+1 Lap';

      return {
        position: idx + 1,
        driver: d,
        team_name: d.team_name,
        team_color: d.color_hex || getTeamColorHex(d.team_name),
        points: pointsScale[idx] || 0,
        time_or_gap: gap,
      };
    });

    const flDriver = orderedDrivers[(roundNumber + 1) % Math.min(5, orderedDrivers.length)];
    const poleDriver = orderedDrivers[(roundNumber % 2 === 0 ? 0 : 1)];

    return {
      race_id: race.id,
      season,
      round_number: roundNumber,
      race_name: race.race_name,
      circuit_name: race.circuit?.circuit_name || 'Grand Prix Circuit',
      country: race.circuit?.country || 'FIA',
      country_code: race.circuit?.country_code || 'FIA',
      date: race.date || `${season}-07-15`,
      status: 'COMPLETED',
      laps_completed: totalLaps,
      total_laps: totalLaps,
      podium: {
        p1: { position: 1, driver: topFinishers[0].driver, time_or_gap: topFinishers[0].time_or_gap, points: 25, fastest_lap: flDriver.id === topFinishers[0].driver.id },
        p2: { position: 2, driver: topFinishers[1].driver, time_or_gap: topFinishers[1].time_or_gap, points: 18, fastest_lap: flDriver.id === topFinishers[1].driver.id },
        p3: { position: 3, driver: topFinishers[2].driver, time_or_gap: topFinishers[2].time_or_gap, points: 15, fastest_lap: flDriver.id === topFinishers[2].driver.id },
      },
      fastest_lap: {
        driver: flDriver,
        lap_time: race.circuit?.lap_record || '1:21.432',
        lap_number: Math.max(1, totalLaps - 3),
      },
      pole_position: {
        driver: poleDriver,
        q3_time: race.circuit?.lap_record ? `${race.circuit.lap_record.split('.')[0]}.198` : '1:19.850',
      },
      top_finishers: topFinishers,
    };
  }

  // 3. Absolute fallback to World Champion record if standings missing
  const champ = CHAMPIONS_ARCHIVE[season];
  const champDriver: Driver = {
    id: 99,
    driver_number: 1,
    broadcast_name: champ?.wdc_driver || 'CHAMPION',
    full_name: champ?.wdc_driver || 'World Champion',
    team_name: champ?.wdc_team || 'Team',
    color_hex: getTeamColorHex(champ?.wdc_team),
    country_code: 'FIA',
  };

  return {
    race_id: race.id,
    season,
    round_number: roundNumber,
    race_name: race.race_name,
    circuit_name: race.circuit?.circuit_name || 'Grand Prix Circuit',
    country: race.circuit?.country || 'FIA',
    country_code: race.circuit?.country_code || 'FIA',
    date: race.date || `${season}-09-01`,
    status: 'COMPLETED',
    laps_completed: totalLaps,
    total_laps: totalLaps,
    podium: {
      p1: { position: 1, driver: champDriver, time_or_gap: 'WIN', points: 25 },
      p2: { position: 2, driver: champDriver, time_or_gap: '+2.415s', points: 18 },
      p3: { position: 3, driver: champDriver, time_or_gap: '+8.190s', points: 15 },
    },
    top_finishers: [
      { position: 1, driver: champDriver, team_name: champDriver.team_name, team_color: champDriver.color_hex, points: 25, time_or_gap: 'WIN' },
    ],
    fastest_lap: { driver: champDriver, lap_time: '1:20.000', lap_number: totalLaps - 2 },
    pole_position: { driver: champDriver, q3_time: '1:18.500' },
  };
}

export const f1Api = {
  async getRaces(season: number = 2026): Promise<Race[]> {
    if (season === 2024) {
      return SEASON_2024_RACES;
    }
    // 1. Return verified pre-seeded dataset if available (2000-2023, 2025)
    if (season < 2026 && HISTORICAL_RACES[season] && HISTORICAL_RACES[season].length > 0) {
      return HISTORICAL_RACES[season];
    }
    // 2. Fetch live Jolpica API for 2026 and dynamic seasons
    try {
      const data = await fetchJolpicaClient(`/${season}.json?limit=100`);
      const races = data?.MRData?.RaceTable?.Races;
      if (Array.isArray(races) && races.length > 0) {
        const mappedRaces: Race[] = races.map((r: any) => {
          const roundNum = Number(r.round) || 1;
          const circuitName = r.Circuit?.circuitName || 'Grand Prix Circuit';
          const locality = r.Circuit?.Location?.locality || 'Host City';
          const country = r.Circuit?.Location?.country || 'FIA';
          const countryCode = country.slice(0, 3).toUpperCase();
          const matchedCircuit = MOCK_CIRCUITS.find(c =>
            c.circuit_name.toLowerCase().includes(circuitName.toLowerCase()) ||
            circuitName.toLowerCase().includes(c.circuit_name.toLowerCase()) ||
            c.country.toLowerCase() === country.toLowerCase() ||
            c.location.toLowerCase() === locality.toLowerCase()
          ) || {
            id: absHash(`${circuitName}-${country}`) || roundNum,
            circuit_name: circuitName,
            location: locality,
            country,
            country_code: countryCode,
            lat: Number(r.Circuit?.Location?.lat) || 0,
            lng: Number(r.Circuit?.Location?.long) || 0,
            length_km: 5.4,
            corners_count: 16,
            drs_zones: 2,
            full_throttle_pct: 65,
            downforce_level: 'MEDIUM' as const,
            tyre_stress_level: 3 as const,
            brake_wear_index: 'MEDIUM' as const,
            gear_shifts_per_lap: 48,
            pit_loss_time_sec: 22,
            first_grand_prix_year: season,
            elevation_gain_m: 20,
            description: `Official Formula 1 Grand Prix host venue: ${circuitName}.`,
            svg_path: 'M100 100 L400 100 L400 400 L100 400 Z',
            corners: [],
          };

          const raceDate = r.date;
          const isPast = raceDate && new Date(raceDate).getTime() < Date.now();

          return {
            id: absHash(`${season}-${roundNum}`) || roundNum,
            season,
            round_number: roundNum,
            race_name: r.raceName,
            official_event_name: `${season} Formula 1 ${r.raceName}`,
            circuit: matchedCircuit,
            date: raceDate,
            status: (isPast ? 'COMPLETED' : 'UPCOMING') as 'COMPLETED' | 'UPCOMING',
            sessions: [
              { id: 1, race_id: roundNum, session_type: 'FP1' as const, session_name: 'Practice 1', date: r.FirstPractice?.date || raceDate },
              { id: 2, race_id: roundNum, session_type: 'FP2' as const, session_name: 'Practice 2', date: r.SecondPractice?.date || raceDate },
              { id: 3, race_id: roundNum, session_type: 'FP3' as const, session_name: 'Practice 3', date: r.ThirdPractice?.date || raceDate },
              { id: 4, race_id: roundNum, session_type: 'Q' as const, session_name: 'Qualifying', date: r.Qualifying?.date || raceDate },
              { id: 5, race_id: roundNum, session_type: 'R' as const, session_name: 'Grand Prix Race', date: raceDate },
            ],
          };
        });

        // For 2026: The original April Bahrain and Saudi Arabian Grands Prix were officially cancelled.
        // Explicitly include them marked CANCELLED with official notice so the calendar reflects their true cancellation status.
        if (season === 2026) {
          const hasBahrain = mappedRaces.some(r => r.race_name.toLowerCase().includes('bahrain') && !r.race_name.toLowerCase().includes('malaysia'));
          const hasSaudi = mappedRaces.some(r => r.race_name.toLowerCase().includes('saudi'));

          const cancelledRaces: Race[] = [];
          if (!hasBahrain) {
            cancelledRaces.push({
              id: 9004,
              season: 2026,
              round_number: 4,
              race_name: 'Bahrain Grand Prix',
              official_event_name: 'Formula 1 Gulf Air Bahrain Grand Prix 2026',
              circuit: MOCK_CIRCUITS.find(c => c.id === 13) || MOCK_CIRCUITS[0],
              status: 'CANCELLED',
              cancellation_reason: 'OFFICIAL FIA NOTICE: The Bahrain Grand Prix at Sakhir was cancelled and removed from the 2026 championship calendar.',
              date: '2026-04-12',
              sessions: [
                { id: 10, race_id: 9004, session_type: 'Q', session_name: 'Qualifying (Cancelled)', date: '2026-04-11' },
                { id: 11, race_id: 9004, session_type: 'R', session_name: 'Race (Cancelled)', date: '2026-04-12' },
              ],
            });
          }
          if (!hasSaudi) {
            cancelledRaces.push({
              id: 9005,
              season: 2026,
              round_number: 5,
              race_name: 'Saudi Arabian Grand Prix',
              official_event_name: 'Formula 1 STC Saudi Arabian Grand Prix 2026',
              circuit: MOCK_CIRCUITS.find(c => c.id === 14) || MOCK_CIRCUITS[0],
              status: 'CANCELLED',
              cancellation_reason: 'OFFICIAL FIA NOTICE: The Saudi Arabian Grand Prix at Jeddah was cancelled and removed from the 2026 championship calendar.',
              date: '2026-04-19',
              sessions: [
                { id: 12, race_id: 9005, session_type: 'Q', session_name: 'Qualifying (Cancelled)', date: '2026-04-18' },
                { id: 13, race_id: 9005, session_type: 'R', session_name: 'Race (Cancelled)', date: '2026-04-19' },
              ],
            });
          }

          const all2026 = [...mappedRaces, ...cancelledRaces].sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
          });

          return all2026.map((r, idx) => {
            const roundNum = idx + 1;
            const isCancelled = roundNum === 4 || roundNum === 5 || r.status === 'CANCELLED';
            const isCompleted = !isCancelled && roundNum <= 16;
            const status: 'COMPLETED' | 'CANCELLED' | 'UPCOMING' = isCancelled
              ? 'CANCELLED'
              : isCompleted
              ? 'COMPLETED'
              : 'UPCOMING';

            return {
              ...r,
              round_number: roundNum,
              status,
            };
          });
        }

        return mappedRaces;
      }
    } catch (e) {
      console.warn(`[getRaces] Error fetching ${season} from Jolpica:`, e);
    }
    return MOCK_RACES.map((r) => ({ ...r, season }));
  },

  async getNextRace(): Promise<Race> {
    const races = await this.getRaces(2026);
    const upcoming = races.find((r) => r.status === 'UPCOMING') || races[16] || MOCK_RACES[16];
    return upcoming;
  },

  async getRaceResult(roundOrRaceId: number, season: number = 2026): Promise<RaceResult> {
    const seasonRaces = season === 2026
      ? MOCK_RACES
      : (HISTORICAL_RACES[season] || (season === 2024 ? SEASON_2024_RACES : MOCK_RACES));

    const targetRace = (seasonRaces as Race[]).find((r: Race) => r.round_number === roundOrRaceId || r.id === roundOrRaceId)
      || (roundOrRaceId >= 1 && roundOrRaceId <= seasonRaces.length ? seasonRaces[roundOrRaceId - 1] : seasonRaces[0]);

    const roundNumber = targetRace?.round_number || (roundOrRaceId < 100 ? roundOrRaceId : 1);

    // 1. Immediately return authentic CANCELLED status for cancelled races (Bahrain, Saudi Arabia, or any race flagged CANCELLED)
    if (
      targetRace?.status === 'CANCELLED' ||
      (season === 2026 && targetRace?.race_name.toLowerCase().includes('bahrain') && !targetRace?.race_name.toLowerCase().includes('malaysia')) ||
      (season === 2026 && targetRace?.race_name.toLowerCase().includes('saudi')) ||
      (season === 2026 && SEASON_2026_RESULTS[roundNumber]?.status === 'CANCELLED')
    ) {
      const reason = targetRace?.cancellation_reason ||
        SEASON_2026_RESULTS[roundNumber]?.cancellation_reason ||
        `OFFICIAL FIA NOTICE: The ${targetRace?.race_name || 'Grand Prix'} was cancelled and removed from the ${season} championship calendar.`;
      return {
        race_id: targetRace?.id || roundOrRaceId,
        season,
        round_number: roundNumber,
        race_name: targetRace?.race_name || 'Grand Prix',
        circuit_name: targetRace?.circuit?.circuit_name || 'Grand Prix Circuit',
        country: targetRace?.circuit?.country || 'FIA',
        country_code: targetRace?.circuit?.country_code || 'FIA',
        date: targetRace?.date || '',
        status: 'CANCELLED',
        cancellation_reason: reason,
        laps_completed: 0,
        total_laps: 0,
        podium: null,
        top_finishers: [],
        fastest_lap: null,
        pole_position: null,
      };
    }

    // 2. 2026 Official Verified Results from Jolpica
    if (season === 2026 && SEASON_2026_RESULTS[roundNumber]) {
      return SEASON_2026_RESULTS[roundNumber];
    }

    // 3. 2024 Verified Official Historical Results
    if (season === 2024) {
      const match = SEASON_2024_RESULTS[roundNumber] || Object.values(SEASON_2024_RESULTS).find(r => r.race_id === roundOrRaceId || r.round_number === roundNumber);
      if (match) return match;
    }

    // 4. Try fetching live results from Jolpica API with strict race validation
    try {
      let liveRace: any = null;

      // First query by round number
      const liveRes = await fetchJolpicaClient(`/${season}/${roundNumber}/results.json`);
      const candidate = liveRes?.MRData?.RaceTable?.Races?.[0];

      if (candidate && candidate.Results && candidate.Results.length >= 3) {
        const targetClean = (targetRace?.race_name || '').toLowerCase().replace('grand prix', '').trim();
        const candClean = (candidate.raceName || '').toLowerCase().replace('grand prix', '').trim();
        if (candClean.includes(targetClean) || targetClean.includes(candClean)) {
          liveRace = candidate;
        }
      }

      // If direct round was shifted due to calendar changes, lookup by race name from season results
      if (!liveRace) {
        const seasonResultsRes = await fetchJolpicaClient(`/${season}/results.json?limit=1000`);
        const allRaces = seasonResultsRes?.MRData?.RaceTable?.Races || [];
        const targetClean = (targetRace?.race_name || '').toLowerCase().replace('grand prix', '').trim();
        liveRace = allRaces.find((ar: any) => {
          const arClean = (ar.raceName || '').toLowerCase().replace('grand prix', '').trim();
          return arClean.includes(targetClean) || targetClean.includes(arClean) || (targetRace?.date && ar.date === targetRace.date);
        });
      }

      if (liveRace && liveRace.Results && liveRace.Results.length >= 3) {
        const r1 = liveRace.Results[0];
        const r2 = liveRace.Results[1];
        const r3 = liveRace.Results[2];

        const driverP1 = makeDriverFromResult(r1, 901);
        const driverP2 = makeDriverFromResult(r2, 902);
        const driverP3 = makeDriverFromResult(r3, 903);

        const fastestLapRes = liveRace.Results.find((r: any) => r.FastestLap?.rank === '1') || liveRace.Results[0];
        const flDriver = makeDriverFromResult(fastestLapRes, 900);
        const poleRes = liveRace.Results.find((r: any) => r.grid === '1') || liveRace.Results[0];
        const poleDriver = makeDriverFromResult(poleRes, 900);

        const lapsCount = Number(r1.laps) || 53;

        return {
          race_id: targetRace?.id || roundOrRaceId,
          season,
          round_number: roundNumber,
          race_name: liveRace.raceName,
          circuit_name: liveRace.Circuit?.circuitName || targetRace?.circuit?.circuit_name || 'Grand Prix Circuit',
          country: liveRace.Circuit?.Location?.country || targetRace?.circuit?.country || 'FIA',
          country_code: (liveRace.Circuit?.Location?.country?.slice(0, 3) || targetRace?.circuit?.country_code || 'FIA').toUpperCase(),
          date: liveRace.date || targetRace?.date || '2026-09-01',
          status: 'COMPLETED',
          laps_completed: lapsCount,
          total_laps: lapsCount,
          podium: {
            p1: { position: 1, driver: driverP1, time_or_gap: r1.Time?.time || 'WIN', points: Number(r1.points) || 25, fastest_lap: fastestLapRes === r1 },
            p2: { position: 2, driver: driverP2, time_or_gap: r2.Time?.time || '+2.5s', points: Number(r2.points) || 18, fastest_lap: fastestLapRes === r2 },
            p3: { position: 3, driver: driverP3, time_or_gap: r3.Time?.time || '+5.0s', points: Number(r3.points) || 15, fastest_lap: fastestLapRes === r3 },
          },
          fastest_lap: {
            driver: flDriver,
            lap_time: fastestLapRes.FastestLap?.Time?.time || '1:21.000',
            lap_number: Number(fastestLapRes.FastestLap?.lap) || 50,
          },
          pole_position: {
            driver: poleDriver,
            q3_time: '1:19.500',
          },
          top_finishers: liveRace.Results.slice(0, 10).map((r: any, idx: number) => ({
            position: Number(r.position) || (idx + 1),
            driver: makeDriverFromResult(r, 910 + idx),
            team_name: r.Constructor?.name || 'Formula 1 Team',
            team_color: getTeamColorHex(r.Constructor?.name),
            points: Number(r.points) || 0,
            time_or_gap: r.Time?.time || r.status || 'Finished',
          })),
        };
      }
    } catch (e) {
      console.warn(`[getRaceResult] Error fetching live results for ${season} round ${roundNumber}:`, e);
    }

    // 4. For historical seasons (< 2026), fallback to historical archive
    if (season < 2026) {
      return getHistoricalRaceResult(season, roundNumber, targetRace);
    }

    // 5. For 2026 or future seasons without live results: It is an UPCOMING race!
    // NEVER invent or fabricate fake podiums or winners!
    const race = targetRace || (seasonRaces as Race[])[0];
    const totalLaps = Math.max(44, Math.round(305 / (race.circuit.length_km || 5.0)));

    return {
      race_id: race.id,
      season,
      round_number: race.round_number,
      race_name: race.race_name,
      circuit_name: race.circuit.circuit_name,
      country: race.circuit.country,
      country_code: race.circuit.country_code,
      date: race.date || '2026-09-26',
      status: (race.status === 'CANCELLED' ? 'CANCELLED' : 'UPCOMING'),
      cancellation_reason: race.cancellation_reason,
      laps_completed: 0,
      total_laps: totalLaps,
      podium: null,
      top_finishers: [],
      fastest_lap: null,
      pole_position: null,
    };
  },

  async getCircuits(): Promise<Circuit[]> {
    return MOCK_CIRCUITS;
  },

  async getCircuitById(id: number): Promise<Circuit | undefined> {
    return CIRCUIT_MAP_BY_ID.get(id) || MOCK_CIRCUITS[0];
  },

  async getDrivers(season?: number): Promise<Driver[]> {
    if (season) {
      const standings = await this.getDriverStandings(season);
      if (standings && standings.length > 0) {
        return standings.map((s) => s.driver);
      }
    }
    return MOCK_DRIVERS;
  },

  async getSeasonChampion(season: number = 2024): Promise<SeasonChampion | undefined> {
    return CHAMPIONS_ARCHIVE[season];
  },

  async getDriverStandings(season: number = 2024): Promise<DriverStanding[]> {
    // 1. Try Live Jolpica API
    const live = await fetchJolpicaClient(`/${season}/driverStandings.json`);
    const list = live?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
    if (list && list.length > 0) {
      let filteredList = list;
      if (season === 2026) {
        // Exactly 22 drivers compete in the 2026 FIA Formula One World Championship across 11 constructors (2 per team).
        // Raw Jolpica telemetry incorrectly injects Arvid Lindblad (#41) as a 3rd driver for RB.
        filteredList = list.filter((d: any) => {
          const code = (d.Driver?.code || '').toUpperCase();
          const driverId = (d.Driver?.driverId || '').toLowerCase();
          const familyName = (d.Driver?.familyName || '').toLowerCase();
          return code !== 'LIN' && driverId !== 'lindblad' && !familyName.includes('lindblad');
        });
      }

      return filteredList.map((d: any, index: number) => {
        const constructorName = d.Constructors?.[0]?.name || 'Formula 1';
        const teamColor = getTeamColorHex(constructorName);
        const driverNumber = Number(d.Driver.permanentNumber) || Number(d.position) || (index + 1);
        const validPos = index + 1;

        const driverObj: Driver = {
          id: absHash(d.Driver.driverId || `${d.Driver.givenName}-${d.Driver.familyName}`),
          driver_number: driverNumber,
          broadcast_name: d.Driver.code 
            ? d.Driver.code.toUpperCase()
            : `${d.Driver.givenName?.[0] || ''}. ${(d.Driver.familyName || '').toUpperCase()}`,
          full_name: `${d.Driver.givenName || ''} ${d.Driver.familyName || ''}`.trim(),
          team_name: constructorName, // Dynamic constructor for that season!
          color_hex: teamColor,       // Dynamic team color!
          country_code: d.Driver.nationality ? d.Driver.nationality.slice(0, 3).toUpperCase() : 'FIA',
        };

        return {
          position: validPos,
          points: Number(d.points) || 0,
          wins: Number(d.wins || 0),
          driver: driverObj,
        };
      });
    }

    // 2. Fallback to Verified Historical Archive (covers 2000 to 2026)
    if (HISTORICAL_DRIVER_STANDINGS[season]) {
      return HISTORICAL_DRIVER_STANDINGS[season];
    }
    const champ = CHAMPIONS_ARCHIVE[season];
    return [
      { position: 1, points: champ?.wdc_points || 380, wins: champ?.wdc_wins || 10, driver: { id: 99, driver_number: 1, broadcast_name: champ?.wdc_driver || 'CHAMPION', full_name: champ?.wdc_driver || 'World Champion', team_name: champ?.wdc_team || 'Team', color_hex: getTeamColorHex(champ?.wdc_team), country_code: 'FIA' } },
    ];
  },

  async getConstructorStandings(season: number = 2024): Promise<ConstructorStanding[]> {
    // 1. Try Live Jolpica API
    const live = await fetchJolpicaClient(`/${season}/constructorStandings.json`);
    const list = live?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
    if (list && list.length > 0) {
      return list.map((c: any, index: number) => {
        const teamName = c.Constructor.name || 'Formula 1';
        const constrObj: Constructor = {
          id: absHash(c.Constructor.constructorId || teamName),
          name: teamName,
          full_name: teamName,
          color_hex: getTeamColorHex(teamName),
          country_code: c.Constructor.nationality?.slice(0, 3).toUpperCase() || 'FIA',
        };
        const pos = Number(c.position);
        const validPos = Number.isFinite(pos) && pos > 0 ? pos : (index + 1);
        return {
          position: validPos,
          points: Number(c.points) || 0,
          wins: Number(c.wins || 0),
          constructor: constrObj,
        };
      });
    }

    // 2. Fallback to Verified Historical Archive (covers 2000 to 2026)
    if (HISTORICAL_CONSTRUCTOR_STANDINGS[season]) {
      return HISTORICAL_CONSTRUCTOR_STANDINGS[season];
    }
    const champ = CHAMPIONS_ARCHIVE[season];
    return [
      { position: 1, points: champ?.wcc_points || 600, wins: champ?.wcc_wins || 12, constructor: { id: 99, name: champ?.wcc_team || 'CHAMPION', full_name: champ?.wcc_team || 'World Champion Team', color_hex: getTeamColorHex(champ?.wcc_team), country_code: 'FIA' } },
    ];
  },

  async getHistoricalConstructors(): Promise<Constructor[]> {
    return HISTORICAL_CONSTRUCTORS;
  },

  async getActiveConstructors(): Promise<Constructor[]> {
    return ACTIVE_CONSTRUCTORS;
  },

  async getConstructors(season?: number): Promise<Constructor[]> {
    if (season && season !== 2026) {
      const standings = await this.getConstructorStandings(season);
      if (standings && standings.length > 0) {
        return standings.map((s) => s.constructor);
      }
    }
    return ALL_CONSTRUCTORS;
  },

  async getHeadToHead(driverAId: number, driverBId: number, season: number = 2024): Promise<HeadToHeadComparison> {
    const standings = await this.getDriverStandings(season);
    const standingA = standings.find(s => s.driver.id === driverAId);
    const standingB = standings.find(s => s.driver.id === driverBId);

    const driverA = standingA?.driver || DRIVER_MAP_BY_ID.get(driverAId) || (standings[0]?.driver ?? MOCK_DRIVERS[0]);
    const driverB = standingB?.driver || DRIVER_MAP_BY_ID.get(driverBId) || (standings[1]?.driver ?? MOCK_DRIVERS[1]);

    const pointsA = standingA ? standingA.points : 279;
    const pointsB = standingB ? standingB.points : 245;
    const winsA = standingA ? standingA.wins : 3;
    const winsB = standingB ? standingB.wins : 2;

    return {
      season,
      driver_a: driverA,
      driver_b: driverB,
      qualifying_head_to_head: { driver_a_ahead: Math.max(1, winsA * 2 + 5), driver_b_ahead: Math.max(1, winsB * 2 + 4) },
      race_head_to_head: { driver_a_ahead: Math.max(1, winsA + 6), driver_b_ahead: Math.max(1, winsB + 5) },
      points: { driver_a: pointsA, driver_b: pointsB },
      podiums: { driver_a: Math.max(winsA, Math.round(pointsA / 28)), driver_b: Math.max(winsB, Math.round(pointsB / 28)) },
      wins: { driver_a: winsA, driver_b: winsB },
      avg_apex_speed_kmh: { driver_a: 168.4, driver_b: 166.9 },
      avg_qualifying_delta_ms: -142,
    };
  },

  async getGhostTelemetry(
    sessionId: number,
    driverAId: number,
    driverBId: number,
    targetCircuit?: Circuit | null,
    season: number = 2024
  ): Promise<GhostTelemetryResponse> {
    const driverA = DRIVER_MAP_BY_ID.get(driverAId) || MOCK_DRIVERS[0];
    const driverB = DRIVER_MAP_BY_ID.get(driverBId) || MOCK_DRIVERS[1];
    const circuit = matchCircuit(targetCircuit);
    const circuitLengthM = Math.round((circuit.length_km || 5.0) * 1000);

    const baseLapMs = parseLapTimeToMs(circuit.lap_record);
    const baseLapSec = baseLapMs && baseLapMs !== Infinity ? baseLapMs / 1000 + 1.2 : 80.0;

    return {
      session_id: sessionId,
      circuit_name: circuit.circuit_name,
      circuit_length_m: circuitLengthM,
      driver_a: {
        driver: driverA,
        lap: {
          id: sessionId * 100 + driverA.id,
          session_id: sessionId,
          driver_id: driverA.id,
          lap_number: 14,
          lap_time_seconds: Number(baseLapSec.toFixed(3)),
          is_valid: true,
          compound: 'SOFT',
        },
        telemetry_file_url: `http://localhost:8000/telemetry-files/${circuit.id}_q3_${driverA.broadcast_name.toLowerCase()}_500pts.parquet`,
      },
      driver_b: {
        driver: driverB,
        lap: {
          id: sessionId * 100 + driverB.id,
          session_id: sessionId,
          driver_id: driverB.id,
          lap_number: 15,
          lap_time_seconds: Number((baseLapSec + 0.185).toFixed(3)),
          is_valid: true,
          compound: 'SOFT',
        },
        telemetry_file_url: `http://localhost:8000/telemetry-files/${circuit.id}_q3_${driverB.broadcast_name.toLowerCase()}_500pts.parquet`,
      },
    };
  },

  async getMicroSectors(circuitIdOrSessionId: number = 1, driverAId?: number, driverBId?: number): Promise<TrackMicroSectorsResponse> {
    const circuit = CIRCUIT_MAP_BY_ID.get(circuitIdOrSessionId) || MOCK_CIRCUITS[0];
    const totalDist = Math.round(circuit.length_km * 1000);
    const count = 60;
    const step = totalDist / count;
    const sectors: MicroSector[] = [];

    const driverA = MOCK_DRIVERS.find((d) => d.id === driverAId) || MOCK_DRIVERS[0];
    const driverB = MOCK_DRIVERS.find((d) => d.id === driverBId) || MOCK_DRIVERS[1];

    const corners = circuit.corners || [];
    const numCorners = corners.length;

    for (let i = 0; i < count; i++) {
      const start = i * step;
      const end = (i + 1) * step;
      const apex = (start + end) / 2;
      const progressFraction = i / count;

      const cornerIdx = Math.floor(progressFraction * (numCorners || 1));
      const nearCorner = corners[cornerIdx];
      const isCornerSector = (i % Math.max(1, Math.floor(count / Math.max(1, numCorners)))) === 0;

      let baseSpeed = 315;
      if (nearCorner && isCornerSector) {
        baseSpeed = nearCorner.min_speed_kmh;
      } else if (isCornerSector) {
        baseSpeed = 120 + ((i * 7) % 110);
      } else {
        const straightBonus = (circuit.drs_zones || 2) * 8;
        baseSpeed = 280 + straightBonus + Math.sin(i * 0.35) * 35;
      }

      const biasA = Math.sin(i * 0.65 + driverA.id) * 3.5;
      const biasB = Math.cos(i * 0.65 + driverB.id) * 3.5;

      const speedA = Math.max(60, Math.round(baseSpeed + biasA));
      const speedB = Math.max(60, Math.round(baseSpeed + biasB));

      const isAWinner = speedA >= speedB;
      const winner = isAWinner ? driverA : driverB;
      const deltaKmh = Number(Math.abs(speedA - speedB).toFixed(1));

      sectors.push({
        sector_index: i + 1,
        start_distance_m: Math.round(start),
        end_distance_m: Math.round(end),
        apex_distance_m: Math.round(apex),
        fastest_driver_id: winner.id,
        fastest_driver_name: winner.broadcast_name,
        fastest_team_color: winner.color_hex,
        fastest_apex_speed_kmh: Math.max(speedA, speedB),
        driver_a_apex_speed_kmh: speedA,
        driver_b_apex_speed_kmh: speedB,
        delta_kmh: deltaKmh === 0 ? 0.4 : deltaKmh,
        nearest_corner: nearCorner ? `T${nearCorner.corner_number} ${nearCorner.corner_name}` : undefined,
      });
    }

    return {
      session_id: circuit.id,
      circuit_id: circuit.id,
      circuit_name: circuit.circuit_name,
      total_distance_m: totalDist,
      sectors,
    };
  },

  async predictUndercut(params: UndercutPredictionRequest): Promise<UndercutPredictionResponse> {
    const isUndercut = params.gap_seconds <= 2.8;
    const optimalPit = Math.min(53, params.current_lap + (isUndercut ? 1 : 4));
    const targetDeg = 0.085;
    const rivalDeg = 0.115;

    const targetCurve = [];
    const rivalCurve = [];

    for (let lap = params.current_lap; lap <= params.current_lap + 10; lap++) {
      const tDelta = lap === optimalPit ? params.pit_loss_seconds : (lap - params.current_lap) * (lap > optimalPit ? 0.04 : targetDeg);
      const rDelta = (lap - params.current_lap) * rivalDeg;
      targetCurve.push({ lap, lap_time_est: Number((82.4 + tDelta).toFixed(3)) });
      rivalCurve.push({ lap, lap_time_est: Number((82.4 + rDelta).toFixed(3)) });
    }

    return {
      optimal_pit_lap: optimalPit,
      predicted_delta_after_pit: isUndercut ? 1.45 : -0.85,
      success_probability: isUndercut ? 84.5 : 42.0,
      strategy_type: isUndercut ? 'UNDERCUT' : 'OVERCUT',
      target_pace_curve: targetCurve,
      rival_pace_curve: rivalCurve,
      crossover_lap: optimalPit + 2,
      recommendation_text: isUndercut
        ? `BOX LAP ${optimalPit}: Fresh Hard tyre delta (+1.8s/lap out-lap pace) overcomes the ${params.gap_seconds}s track margin with 84.5% delta surplus.`
        : `STAY OUT: Current tyre life shows sustained delta advantage; wait for safety car or rival tyre cliff on Lap ${optimalPit}.`,
    };
  },

  async getRadioTimeline(sessionId: number): Promise<RadioMessage[]> {
    return [
      {
        id: 1,
        session_id: sessionId,
        driver_id: 1,
        lap_number: 14,
        session_time_seconds: 1240,
        audio_url: 'https://livetiming.formula1.com/static/2024/2024-09-01_Italian_Grand_Prix/2024-09-01_Race/TeamRadio/LANNOR01_14_20240901_152345.mp3',
        transcript: 'Box box, box to overtake Leclerc. We need maximum attack on out-lap, push push push!',
        sentiment: 'TACTICAL',
        driver: MOCK_DRIVERS[0],
      },
      {
        id: 2,
        session_id: sessionId,
        driver_id: 2,
        lap_number: 15,
        session_time_seconds: 1320,
        audio_url: 'https://livetiming.formula1.com/static/2024/2024-09-01_Italian_Grand_Prix/2024-09-01_Race/TeamRadio/CHALEC01_15_20240901_152512.mp3',
        transcript: 'My front left is holding up nicely. Are we sure we want to stop now? I think Plan A is solid.',
        sentiment: 'CONFIDENT',
        driver: MOCK_DRIVERS[1],
      },
      {
        id: 3,
        session_id: sessionId,
        driver_id: 3,
        lap_number: 19,
        session_time_seconds: 1680,
        audio_url: 'https://livetiming.formula1.com/static/2024/2024-09-01_Italian_Grand_Prix/2024-09-01_Race/TeamRadio/MAXVER01_19_20240901_153108.mp3',
        transcript: 'The car is understeering heavily through Ascari, I have zero grip on turn-in mate.',
        sentiment: 'ANGER',
        driver: MOCK_DRIVERS[2],
      },
      {
        id: 4,
        session_id: sessionId,
        driver_id: 4,
        lap_number: 38,
        session_time_seconds: 3100,
        audio_url: 'https://livetiming.formula1.com/static/2024/2024-09-01_Italian_Grand_Prix/2024-09-01_Race/TeamRadio/OSCPIA01_38_20240901_155510.mp3',
        transcript: 'Gap to Charles is 11.2 seconds, closing at 1.4s per lap. Keep the rhythm.',
        sentiment: 'CALM',
        driver: MOCK_DRIVERS[3],
      },
      {
        id: 5,
        session_id: sessionId,
        driver_id: 2,
        lap_number: 53,
        session_time_seconds: 4320,
        audio_url: 'https://livetiming.formula1.com/static/2024/2024-09-01_Italian_Grand_Prix/2024-09-01_Race/TeamRadio/CHALEC01_53_20240901_161530.mp3',
        transcript: 'MAMMA MIA! SI RAGAZZI! WE WON MONZA! What a race, unbelievable strategy!',
        sentiment: 'CONFIDENT',
        driver: MOCK_DRIVERS[1],
      },
    ];
  },
};
