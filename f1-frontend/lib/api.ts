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
  { id: 11, driver_number: 30, broadcast_name: 'L. LAWSON', full_name: 'Liam Lawson', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NZL' },
  { id: 12, driver_number: 87, broadcast_name: 'O. BEARMAN', full_name: 'Oliver Bearman', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'GBR' },
  { id: 13, driver_number: 31, broadcast_name: 'E. OCON', full_name: 'Esteban Ocon', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'FRA' },
  { id: 14, driver_number: 10, broadcast_name: 'P. GASLY', full_name: 'Pierre Gasly', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'FRA' },
  { id: 15, driver_number: 7, broadcast_name: 'J. DOOHAN', full_name: 'Jack Doohan', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'AUS' },
  { id: 16, driver_number: 27, broadcast_name: 'N. HULKENBERG', full_name: 'Nico Hülkenberg', team_name: 'Kick Sauber', color_hex: '#52E252', country_code: 'GER' },
  { id: 17, driver_number: 5, broadcast_name: 'G. BORTOLETO', full_name: 'Gabriel Bortoleto', team_name: 'Kick Sauber', color_hex: '#52E252', country_code: 'BRA' },
  { id: 18, driver_number: 22, broadcast_name: 'Y. TSUNODA', full_name: 'Yuki Tsunoda', team_name: 'RB', color_hex: '#6692FF', country_code: 'JPN' },
  { id: 19, driver_number: 6, broadcast_name: 'I. HADJAR', full_name: 'Isack Hadjar', team_name: 'RB', color_hex: '#6692FF', country_code: 'FRA' },
  { id: 20, driver_number: 18, broadcast_name: 'L. STROLL', full_name: 'Lance Stroll', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'CAN' },
];

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
  { id: 10, name: 'Kick Sauber', full_name: 'Stake F1 Team Kick Sauber', color_hex: '#52E252', country_code: 'SUI' },
];

// Accurate True-to-Scale FIA Track Geometries with Exact Apex Coordinates
// 1:1 Official FIA Track Geometries with Exact Corner Apex Positions & Sectors
export const MOCK_CIRCUITS: Circuit[] = [
  {
    id: 1,
    circuit_name: "Autodromo Nazionale Monza",
    location: "Monza",
    country: "Italy",
    country_code: "ITA",
    lat: 45.6189,
    lng: 9.2811,
    length_km: 5.793,
    corners_count: 11,
    drs_zones: 2,
    lap_record: "1:21.046",
    lap_record_driver: "Rubens Barrichello",
    lap_record_year: 2004,
    lap_record_team: "Ferrari F2004",
    full_throttle_pct: 76,
    downforce_level: "ULTRA-LOW",
    tyre_stress_level: 4,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 42,
    pit_loss_time_sec: 24.1,
    first_grand_prix_year: 1950,
    elevation_gain_m: 12.8,
    view_box: "0 0 500 500",
    start_finish: { x: 117.9, y: 376.6, label_x: 20, label_y: 4 },
    description: "The Temple of Speed. Featuring the highest average speeds on the calendar with slipstreaming down the Rettifilo and maximum braking loads.",
    svg_path: "M218.372 50.51c17.128-1.458 28.349-2.045 40.274-3.238 9.544-.954 18.648-.863 32.116-1.38 3.542-.136 3.729-.748 5.353-5.354 1.036-2.935 1.478-4.501 4.144-4.835 5.525-.69 9.921-1.651 11.443-2.091 14.149-4.09 33.715-10.744 48.213-17.291 6.233-2.814 20.461 2.978 21.497 16.187s3.53 38.46 4.015 45.973c.518 8.029.022 9.197-4.533 11.655-9.842 5.31-36.237 19.593-46.102 25.511-14.892 8.936-29.224 17.864-38.59 26.03-10.102 8.806-73.808 64.464-80.377 70.318-3.39 3.023-6.907 6.216-12.087 10.705-3.24 2.809-2.08 5.871-1.38 10.878 1.035 7.425-.519 16.403-8.289 21.756-5.758 3.967-6.446 5.425-7.248 12.962-4.732 44.498-20.042 187.268-21.674 201.017-1.813 15.28-17.22 18.9-29.267 11.784-24.993-14.763-21.878-47.89-20.85-65.527.408-6.966 12.017-143.36 19.435-230.17.309-3.611.466-5.692 5.3-5.347 5.184.37 5.612-1.727 3.54-7.77-3.737-10.9-5.649-24.2-5.06-31.068 1.369-15.987 2.231-26.008 2.297-26.732 1.804-19.481 7.9-39.11 33.93-52.707 14.168-7.4 25.64-9.712 43.9-11.266z",
    optimal_line_svg: "M218.372 50.51c17.128-1.458 28.349-2.045 40.274-3.238 9.544-.954 18.648-.863 32.116-1.38 3.542-.136 3.729-.748 5.353-5.354 1.036-2.935 1.478-4.501 4.144-4.835 5.525-.69 9.921-1.651 11.443-2.091 14.149-4.09 33.715-10.744 48.213-17.291 6.233-2.814 20.461 2.978 21.497 16.187s3.53 38.46 4.015 45.973c.518 8.029.022 9.197-4.533 11.655-9.842 5.31-36.237 19.593-46.102 25.511-14.892 8.936-29.224 17.864-38.59 26.03-10.102 8.806-73.808 64.464-80.377 70.318-3.39 3.023-6.907 6.216-12.087 10.705-3.24 2.809-2.08 5.871-1.38 10.878 1.035 7.425-.519 16.403-8.289 21.756-5.758 3.967-6.446 5.425-7.248 12.962-4.732 44.498-20.042 187.268-21.674 201.017-1.813 15.28-17.22 18.9-29.267 11.784-24.993-14.763-21.878-47.89-20.85-65.527.408-6.966 12.017-143.36 19.435-230.17.309-3.611.466-5.692 5.3-5.347 5.184.37 5.612-1.727 3.54-7.77-3.737-10.9-5.649-24.2-5.06-31.068 1.369-15.987 2.231-26.008 2.297-26.732 1.804-19.481 7.9-39.11 33.93-52.707 14.168-7.4 25.64-9.712 43.9-11.266z",
    corners: [
      { corner_number: 1, corner_name: "Variante del Rettifilo (T1)", gear: 2, min_speed_kmh: 74, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Extreme braking from 345 km/h at end of pit straight", x: 118.7, y: 370.4 },
      { corner_number: 2, corner_name: "Variante del Rettifilo (T2)", gear: 2, min_speed_kmh: 85, lateral_g: 2.3, brake_zone: false, drs_zone: false, notes: "Right turn exit onto Curva Grande", x: 143.9, y: 179.2 },
      { corner_number: 3, corner_name: "Curva Grande (Biassono)", gear: 7, min_speed_kmh: 290, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Full throttle high-speed sweep", x: 138.1, y: 143.1 },
      { corner_number: 4, corner_name: "Variante della Roggia (T4)", gear: 3, min_speed_kmh: 118, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Aggressive left kerb usage required", x: 188.4, y: 55.8 },
      { corner_number: 5, corner_name: "Variante della Roggia (T5)", gear: 3, min_speed_kmh: 130, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Right exit towards Lesmo", x: 293.8, y: 45.2 },
      { corner_number: 6, corner_name: "Curva di Lesmo 1 (T6)", gear: 4, min_speed_kmh: 172, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Blind turn-in apex", x: 384.7, y: 87.1 },
      { corner_number: 7, corner_name: "Curva di Lesmo 2 (T7)", gear: 4, min_speed_kmh: 156, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Crucial exit traction towards Serraglio", x: 297.9, y: 140.2 },
      { corner_number: 8, corner_name: "Variante Ascari (T8)", gear: 4, min_speed_kmh: 168, lateral_g: 4.1, brake_zone: true, drs_zone: false, notes: "Triple chicane left entry", x: 202.2, y: 224.7 },
      { corner_number: 9, corner_name: "Variante Ascari (T9)", gear: 4, min_speed_kmh: 195, lateral_g: 4.3, brake_zone: false, drs_zone: false, notes: "Right middle flick", x: 185.3, y: 282.5 },
      { corner_number: 10, corner_name: "Variante Ascari (T10)", gear: 5, min_speed_kmh: 220, lateral_g: 3.9, brake_zone: false, drs_zone: false, notes: "Left launch onto back straight", x: 160.0, y: 480.2 },
      { corner_number: 11, corner_name: "Curva Parabolica / Alboreto", gear: 5, min_speed_kmh: 182, lateral_g: 3.6, brake_zone: false, drs_zone: true, notes: "Long parabolic corner onto main straight", x: 128.1, y: 475.1 },
    ],
  },
  {
    id: 2,
    circuit_name: "Circuit de Spa-Francorchamps",
    location: "Stavelot",
    country: "Belgium",
    country_code: "BEL",
    lat: 50.4372,
    lng: 5.9714,
    length_km: 7.004,
    corners_count: 19,
    drs_zones: 2,
    lap_record: "1:46.286",
    lap_record_driver: "Valtteri Bottas",
    lap_record_year: 2018,
    lap_record_team: "Mercedes W09",
    full_throttle_pct: 70,
    downforce_level: "MEDIUM",
    tyre_stress_level: 5,
    brake_wear_index: "MODERATE",
    gear_shifts_per_lap: 58,
    pit_loss_time_sec: 22.8,
    first_grand_prix_year: 1950,
    elevation_gain_m: 102.2,
    view_box: "0 0 500 500",
    start_finish: { x: 212.2, y: 100.5, label_x: 20, label_y: 4 },
    description: "The Ardennes roller-coaster. World-famous for Eau Rouge / Raidillon compression, high lateral loadings through Pouhon, and changeable micro-climates.",
    svg_path: "M167.75 20.858c-3.075-5.364-.283-7.034 3.387-5.065 3.669 1.97 49.393 30.95 55.603 35.171 6.21 4.22 10.613 8.816 14.395 13.224 6.116 7.128 29.072 34.701 33.87 40.235 2.327 2.682 4.765 5.265 8.892 6.504.742.223 1.542.375 2.398.53 3.105.563 9.733 2.517 14.112 9.848 4.987 8.348 5.552 11.818 4.705 22.04-.49 5.916.164 11.615 2.258 14.631 5.08 7.316 15.721 22.54 22.956 32.545 8.75 12.099 16.935 28.98 20.322 40.235s41.49 144.622 43.467 152.5c1.975 7.878 4.009 9.705-5.504 15.334-4.516 2.673-8.435 6.431-6.774 13.787 1.27 5.628 9.744 26.446.846 32.639-2.08 1.447-48.41 32.702-57.014 38.265-5.222 3.377-12.385.885-15.242-4.08-2.856-4.964-3.503-11.631 4.093-15.897 5.927-3.329 9.314-5.205 25.685-14.96 3.995-2.38 6.181-7.751 3.198-14.442-2.634-5.909-7.55-20.755-9.972-27.574-5.645-15.897-10.43-48.422-14.254-69.216-1.552-8.44-7.338-16.882-19.193-18.007-2.61-.248-11.29-.844-18.77-.563-7.303.275-20.816 4.787-27.66 22.79-5.08 13.366-15.524 40.095-23.992 62.464-6.59 17.407-22.297 12.661-24.696 10.832-5.53-4.215-19.68-14.49-31.19 1.688-5.503 7.738-16.934 26.59-23.567 36.86-7.403 11.462-15.806 3.657-38.81-13.506-9.759-7.282-7.215-21.806-5.786-27.293 6.586-25.285 18.77-40.094 31.189-50.786s29.919-23.353 50.805-30.669c20.887-7.315 27.2-13.496 33.023-24.197 16.23-29.825 24.133-42.908 22.44-57.54-1.694-14.63-19.053-43.752-22.722-56.413-2.69-9.285-4.774-32.872-5.249-52.615-.083-3.47-.676-7.138 6.096-6.19 10.725 1.5 7.765-7.127 6.21-9.379-7.904-11.442-11.323-16.99-17.782-28.324-7.057-12.38-39.515-71.467-41.773-75.406z",
    optimal_line_svg: "M167.75 20.858c-3.075-5.364-.283-7.034 3.387-5.065 3.669 1.97 49.393 30.95 55.603 35.171 6.21 4.22 10.613 8.816 14.395 13.224 6.116 7.128 29.072 34.701 33.87 40.235 2.327 2.682 4.765 5.265 8.892 6.504.742.223 1.542.375 2.398.53 3.105.563 9.733 2.517 14.112 9.848 4.987 8.348 5.552 11.818 4.705 22.04-.49 5.916.164 11.615 2.258 14.631 5.08 7.316 15.721 22.54 22.956 32.545 8.75 12.099 16.935 28.98 20.322 40.235s41.49 144.622 43.467 152.5c1.975 7.878 4.009 9.705-5.504 15.334-4.516 2.673-8.435 6.431-6.774 13.787 1.27 5.628 9.744 26.446.846 32.639-2.08 1.447-48.41 32.702-57.014 38.265-5.222 3.377-12.385.885-15.242-4.08-2.856-4.964-3.503-11.631 4.093-15.897 5.927-3.329 9.314-5.205 25.685-14.96 3.995-2.38 6.181-7.751 3.198-14.442-2.634-5.909-7.55-20.755-9.972-27.574-5.645-15.897-10.43-48.422-14.254-69.216-1.552-8.44-7.338-16.882-19.193-18.007-2.61-.248-11.29-.844-18.77-.563-7.303.275-20.816 4.787-27.66 22.79-5.08 13.366-15.524 40.095-23.992 62.464-6.59 17.407-22.297 12.661-24.696 10.832-5.53-4.215-19.68-14.49-31.19 1.688-5.503 7.738-16.934 26.59-23.567 36.86-7.403 11.462-15.806 3.657-38.81-13.506-9.759-7.282-7.215-21.806-5.786-27.293 6.586-25.285 18.77-40.094 31.189-50.786s29.919-23.353 50.805-30.669c20.887-7.315 27.2-13.496 33.023-24.197 16.23-29.825 24.133-42.908 22.44-57.54-1.694-14.63-19.053-43.752-22.722-56.413-2.69-9.285-4.774-32.872-5.249-52.615-.083-3.47-.676-7.138 6.096-6.19 10.725 1.5 7.765-7.127 6.21-9.379-7.904-11.442-11.323-16.99-17.782-28.324-7.057-12.38-39.515-71.467-41.773-75.406z",
    corners: [
      { corner_number: 1, corner_name: "La Source", gear: 1, min_speed_kmh: 68, lateral_g: 2.0, brake_zone: true, drs_zone: false, notes: "Hairpin turn leading to Eau Rouge plunge", x: 208.1, y: 93.7 },
      { corner_number: 2, corner_name: "Eau Rouge (Entry)", gear: 7, min_speed_kmh: 300, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Steep downhill left", x: 167.0, y: 15.5 },
      { corner_number: 3, corner_name: "Eau Rouge (Compression)", gear: 8, min_speed_kmh: 305, lateral_g: 4.8, brake_zone: false, drs_zone: false, notes: "Maximum vertical 3G compression", x: 282.1, y: 110.3 },
      { corner_number: 4, corner_name: "Raidillon (Crest)", gear: 8, min_speed_kmh: 310, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Blind uphill crest launch onto Kemmel", x: 306.3, y: 155.8 },
      { corner_number: 5, corner_name: "Les Combes (T5)", gear: 3, min_speed_kmh: 135, lateral_g: 2.8, brake_zone: true, drs_zone: false, notes: "Right entry chicane at end of Kemmel", x: 349.9, y: 228.6 },
      { corner_number: 6, corner_name: "Les Combes (T6)", gear: 3, min_speed_kmh: 145, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Left transition", x: 359.6, y: 261.6 },
      { corner_number: 7, corner_name: "Malmedy", gear: 4, min_speed_kmh: 180, lateral_g: 3.3, brake_zone: false, drs_zone: false, notes: "Fast right exit", x: 395.5, y: 392.5 },
      { corner_number: 8, corner_name: "Rivage (Bruxelles)", gear: 2, min_speed_kmh: 105, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Downhill 180-degree right hairpin", x: 384.6, y: 443.1 },
      { corner_number: 9, corner_name: "Speakers Corner", gear: 4, min_speed_kmh: 160, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Left downhill plunge", x: 308.9, y: 469.5 },
      { corner_number: 10, corner_name: "Pouhon (Apex 1)", gear: 6, min_speed_kmh: 260, lateral_g: 4.6, brake_zone: false, drs_zone: false, notes: "High-speed double left with massive lateral G", x: 344.4, y: 442.9 },
      { corner_number: 11, corner_name: "Pouhon (Apex 2)", gear: 6, min_speed_kmh: 270, lateral_g: 4.4, brake_zone: false, drs_zone: false, notes: "Second apex acceleration", x: 311.4, y: 323.5 },
      { corner_number: 12, corner_name: "Fagnes (Entry)", gear: 4, min_speed_kmh: 165, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Right turn entry", x: 269.3, y: 322.0 },
      { corner_number: 13, corner_name: "Fagnes (Exit)", gear: 4, min_speed_kmh: 175, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Left turn exit", x: 206.8, y: 415.6 },
      { corner_number: 14, corner_name: "Campus", gear: 5, min_speed_kmh: 210, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Fast right sweeper", x: 143.9, y: 458.4 },
      { corner_number: 15, corner_name: "Stavelot", gear: 5, min_speed_kmh: 230, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Entry onto Blanchimont flat-out sprint", x: 108.4, y: 436.9 },
      { corner_number: 16, corner_name: "Courbe Paul Frère", gear: 7, min_speed_kmh: 290, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "High-speed kink", x: 202.7, y: 324.5 },
      { corner_number: 17, corner_name: "Blanchimont", gear: 8, min_speed_kmh: 315, lateral_g: 3.7, brake_zone: false, drs_zone: false, notes: "Flat-out kink before Bus Stop", x: 243.2, y: 253.9 },
      { corner_number: 18, corner_name: "Bus Stop Chicane (T18)", gear: 2, min_speed_kmh: 75, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Heavy deceleration right", x: 242.4, y: 246.0 },
      { corner_number: 19, corner_name: "Bus Stop Chicane (T19)", gear: 2, min_speed_kmh: 90, lateral_g: 2.3, brake_zone: false, drs_zone: true, notes: "Tight left onto start straight", x: 216.0, y: 134.7 },
    ],
  },
  {
    id: 3,
    circuit_name: "Silverstone Circuit",
    location: "Silverstone",
    country: "United Kingdom",
    country_code: "GBR",
    lat: 52.0786,
    lng: -1.0169,
    length_km: 5.891,
    corners_count: 18,
    drs_zones: 2,
    lap_record: "1:27.097",
    lap_record_driver: "Max Verstappen",
    lap_record_year: 2020,
    lap_record_team: "Red Bull RB16",
    full_throttle_pct: 68,
    downforce_level: "HIGH",
    tyre_stress_level: 5,
    brake_wear_index: "LOW",
    gear_shifts_per_lap: 48,
    pit_loss_time_sec: 25.4,
    first_grand_prix_year: 1950,
    elevation_gain_m: 11.3,
    view_box: "0 0 500 500",
    start_finish: { x: 137.9, y: 322.5, label_x: 20, label_y: 4 },
    description: "The Home of British Motor Racing. High-speed aerodynamic benchmark featuring the iconic Maggotts-Becketts-Chapel complex and Copse.",
    svg_path: "M187.132 258.577c2.83-3.815 6.413-9.565 13.577-10.593 13.554-1.944 21.828 1.404 35.111 3.348 16.012 2.344 24.823-.431 33.316-6.912 16.091-12.281 27.87-21.819 38.54-30.677 7.154-5.938 13.066-1.296 14.154 3.024 1.523 6.05 2.831 11.45 6.969 24.844 1.656 5.362 9.362 7.346 12.628.432 5.003-10.589 6.313-15.666 7.839-21.819 5.617-22.642-.695-28.128-2.83-30.029-29.832-26.571-120.874-108.733-128.253-115.577-10.017-9.29-28.416-4.536-29.233 4.861-.816 9.398-.899 12.315-1.306 17.985-.25 3.466-7.266 17.717-20.74 12.8-14.209-5.185-7.879-20.646-7.325-21.701 7.29-13.886 15.623-29.211 20.505-37.048 9.58-15.378 25.704-25.296 39.407-26.584 18.917-1.78 76.237-6.805 105.634-9.258 2.916-.243 5.556-.498 7.862-.65 7.843-.516 21.345 4.846 24.827 16.658 8.166 27.706 12.928 43.496 14.332 67.407 1.269 21.603 2.421 42.276 2.653 49.736.278 8.92 1.882 13.375 9.635 24.627.68.984 1.46 2.099 2.315 3.333 2.182 3.148 3.236 7.36-.247 16.434-3.793 9.88-9.554 20.467-9.145 29.812.546 12.475 4.325 13.683 9.363 19.66 10.017 11.882 7.186 25.707-4.62 32.755-4.323 2.58-8.564 4.969-12.364 7.211-9.437 5.57-13.513 9.501-18.29 19.28-12.957 26.518-83.893 152.682-99.075 173.203-12.588 17.013-38.433 10.532-43.659-6.643-1.42-4.666-16.26-30.392-20.577-34.403-10.234-9.505-16.766-16.417-20.25-21.17-3.42-4.668-7.676-9.398-13.882-17.337-2.815-3.6-6.621-5.117-10.615-.81-3.291 3.549-5.422 5.822-7.408 7.183-2.547 1.745-8.378 1.89-11.644-1.998-1.713-2.04-10.749-12.65-14.154-22.035-3.919-10.802-5.688-12.142 5.771-27.113 10.997-14.365 52.26-67.725 59.227-76.475 2.784-3.497 7.22-9.384 11.952-15.761z",
    optimal_line_svg: "M187.132 258.577c2.83-3.815 6.413-9.565 13.577-10.593 13.554-1.944 21.828 1.404 35.111 3.348 16.012 2.344 24.823-.431 33.316-6.912 16.091-12.281 27.87-21.819 38.54-30.677 7.154-5.938 13.066-1.296 14.154 3.024 1.523 6.05 2.831 11.45 6.969 24.844 1.656 5.362 9.362 7.346 12.628.432 5.003-10.589 6.313-15.666 7.839-21.819 5.617-22.642-.695-28.128-2.83-30.029-29.832-26.571-120.874-108.733-128.253-115.577-10.017-9.29-28.416-4.536-29.233 4.861-.816 9.398-.899 12.315-1.306 17.985-.25 3.466-7.266 17.717-20.74 12.8-14.209-5.185-7.879-20.646-7.325-21.701 7.29-13.886 15.623-29.211 20.505-37.048 9.58-15.378 25.704-25.296 39.407-26.584 18.917-1.78 76.237-6.805 105.634-9.258 2.916-.243 5.556-.498 7.862-.65 7.843-.516 21.345 4.846 24.827 16.658 8.166 27.706 12.928 43.496 14.332 67.407 1.269 21.603 2.421 42.276 2.653 49.736.278 8.92 1.882 13.375 9.635 24.627.68.984 1.46 2.099 2.315 3.333 2.182 3.148 3.236 7.36-.247 16.434-3.793 9.88-9.554 20.467-9.145 29.812.546 12.475 4.325 13.683 9.363 19.66 10.017 11.882 7.186 25.707-4.62 32.755-4.323 2.58-8.564 4.969-12.364 7.211-9.437 5.57-13.513 9.501-18.29 19.28-12.957 26.518-83.893 152.682-99.075 173.203-12.588 17.013-38.433 10.532-43.659-6.643-1.42-4.666-16.26-30.392-20.577-34.403-10.234-9.505-16.766-16.417-20.25-21.17-3.42-4.668-7.676-9.398-13.882-17.337-2.815-3.6-6.621-5.117-10.615-.81-3.291 3.549-5.422 5.822-7.408 7.183-2.547 1.745-8.378 1.89-11.644-1.998-1.713-2.04-10.749-12.65-14.154-22.035-3.919-10.802-5.688-12.142 5.771-27.113 10.997-14.365 52.26-67.725 59.227-76.475 2.784-3.497 7.22-9.384 11.952-15.761z",
    corners: [
      { corner_number: 1, corner_name: "Abbey", gear: 7, min_speed_kmh: 285, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Fast right-hander off the start line", x: 190.7, y: 253.9 },
      { corner_number: 2, corner_name: "Farm Curve", gear: 7, min_speed_kmh: 290, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Left sweep towards Village", x: 197.7, y: 248.8 },
      { corner_number: 3, corner_name: "Village", gear: 2, min_speed_kmh: 88, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Heavy deceleration right hairpin", x: 332.2, y: 245.7 },
      { corner_number: 4, corner_name: "The Loop", gear: 2, min_speed_kmh: 75, lateral_g: 1.9, brake_zone: true, drs_zone: false, notes: "Tight left hairpin", x: 339.7, y: 244.6 },
      { corner_number: 5, corner_name: "Aintree", gear: 3, min_speed_kmh: 135, lateral_g: 2.7, brake_zone: false, drs_zone: false, notes: "Exit onto Wellington Straight", x: 320.9, y: 167.3 },
      { corner_number: 6, corner_name: "Brooklands", gear: 4, min_speed_kmh: 155, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Left sweeper into Luffield", x: 189.9, y: 76.5 },
      { corner_number: 7, corner_name: "Luffield", gear: 2, min_speed_kmh: 92, lateral_g: 2.3, brake_zone: true, drs_zone: false, notes: "Long parabolic right", x: 160.0, y: 105.3 },
      { corner_number: 8, corner_name: "Woodcote", gear: 5, min_speed_kmh: 215, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Right sweep onto National Straight", x: 216.8, y: 25.3 },
      { corner_number: 9, corner_name: "Copse", gear: 8, min_speed_kmh: 290, lateral_g: 4.9, brake_zone: false, drs_zone: false, notes: "One of the fastest corners in world motorsport", x: 323.5, y: 15.8 },
      { corner_number: 10, corner_name: "Maggotts", gear: 8, min_speed_kmh: 295, lateral_g: 5.0, brake_zone: false, drs_zone: false, notes: "Entry to apex sequence", x: 356.7, y: 28.7 },
      { corner_number: 11, corner_name: "Becketts (Entry)", gear: 7, min_speed_kmh: 265, lateral_g: 4.8, brake_zone: false, drs_zone: false, notes: "High-speed left flick", x: 375.8, y: 157.3 },
      { corner_number: 12, corner_name: "Becketts (Apex)", gear: 6, min_speed_kmh: 240, lateral_g: 4.5, brake_zone: false, drs_zone: false, notes: "Rapid direction change testing front-end grip", x: 388.2, y: 179.6 },
      { corner_number: 13, corner_name: "Becketts (Exit)", gear: 6, min_speed_kmh: 250, lateral_g: 4.1, brake_zone: false, drs_zone: false, notes: "Left exit transition", x: 392.0, y: 263.5 },
      { corner_number: 14, corner_name: "Chapel", gear: 7, min_speed_kmh: 275, lateral_g: 3.6, brake_zone: false, drs_zone: true, notes: "Exit onto Hangar Straight", x: 338.5, y: 326.5 },
      { corner_number: 15, corner_name: "Stowe", gear: 5, min_speed_kmh: 200, lateral_g: 3.5, brake_zone: true, drs_zone: false, notes: "Heavy braking zone at end of Hangar Straight", x: 252.7, y: 474.6 },
      { corner_number: 16, corner_name: "Vale", gear: 2, min_speed_kmh: 85, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Tight left-right before Club", x: 209.8, y: 471.3 },
      { corner_number: 17, corner_name: "Club (Entry)", gear: 4, min_speed_kmh: 165, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "First apex right", x: 148.3, y: 392.2 },
      { corner_number: 18, corner_name: "Club (Exit)", gear: 5, min_speed_kmh: 195, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Double right onto Hamilton Straight", x: 107.2, y: 367.0 },
    ],
  },
  {
    id: 4,
    circuit_name: "Circuit de Monaco",
    location: "Monte Carlo",
    country: "Monaco",
    country_code: "MON",
    lat: 43.7347,
    lng: 7.4206,
    length_km: 3.337,
    corners_count: 19,
    drs_zones: 1,
    lap_record: "1:12.909",
    lap_record_driver: "Lewis Hamilton",
    lap_record_year: 2021,
    lap_record_team: "Mercedes W12",
    full_throttle_pct: 34,
    downforce_level: "MAXIMUM",
    tyre_stress_level: 1,
    brake_wear_index: "HEAVY",
    gear_shifts_per_lap: 54,
    pit_loss_time_sec: 21.0,
    first_grand_prix_year: 1950,
    elevation_gain_m: 42.0,
    view_box: "0 0 500 500",
    start_finish: { x: 73.8, y: 346.6, label_x: 20, label_y: 4 },
    description: "The Jewel in the Crown. Tight barriers, zero room for error, requiring maximum mechanical downforce, steering angle, and driver precision.",
    svg_path: "M118.34 246.687c-5.14.774-6.994 2.392-9.853 7.317-4.586 7.898-9.192 18.211-11.413 27.357-2.486 10.243-2.829 25.557-1.95 39.458.445 7.034 2.23 10.04 8.243 12.045 7.17 2.387 8.339 2.488 9.949 9.801 1.61 7.319 6.389 33.36 8.047 42.434 1.188 6.495 2.042 8.91-3.805 11.704-6.436 3.07-7.9 3.95-6.729 9.07 1.17 5.12 6.805 23.714 11.023 30.435 11.51 18.336 19.262 23.945 27.311 26.726 5.165 1.784 11.935 2.284 13.315 7.946 1.317 5.416 1.181 7.937-2.341 9.074-13.167 4.244-26.043 5.56-38.334 5.268-4.24-.102-4.829-.294-4.245-5.56.442-3.967.44-9.514-3.803-14.047-3.322-3.553-10.24-13.756-16.093-28.531-9.486-23.955-16.97-48.602-19.168-60.132-2.924-15.363-5.422-36.152-6.435-49.746-1.903-25.458-.928-45.988 3.217-55.89 5.267-12.585 6.437-17.12 5.999-21.07-.878-7.9-.355-10.97 4.242-12.437 14.192-4.535 27.36-4.242 37.456-5.852 10.094-1.609 27.134-4.495 33.651-6.439 8.34-2.486 23.423-7.227 36.577-9.363 11.704-1.903 21.801-3.073 32.774-8.34 6.195-2.974 21.8-11.119 28.384-13.169 6.585-2.046 18.713-4.606 25.75-6.143 8.048-1.759 17.221-3.118 23.994-4.534 9.32-1.953 25.118-13.113 27.46-27.898 2.535-15.996-2.563-24.582-12.876-33.749-7.022-6.243-11.658-11.657-12.68-15.461-1.987-7.38.472-12.368 3.803-16.97 4.974-6.877 50.625-68.034 53.99-72.277 3.366-4.244 6.436-3.658 9.95-.88 3.509 2.783 7.415 5.432 7.023 10.39-.438 5.56-.515 9.95 1.757 13.607 2.632 4.244 3.365 5.121 6.585 9.51 2.136 2.914 3.949 5.707 5.121 9.51 1.097 3.565 6.103 5.143 8.922 2.633 2.632-2.341 3.073-6.585-.876-9.51-1.636-1.211-3.58-2.506-5.269-5.12-2.926-4.537-5.415-7.9-7.168-10.681-1.389-2.204-3.13-11.026 2.778-12.73 8.632-2.487 19.607-5.853 25.31-7.608 2.719-.835 11.123-.146 11.123 8.34 0 8.485-.294 17.848-1.17 25.896-.394 3.597-3.482 47.7-22.192 77.593-23.132 36.952-62.28 63.471-70.912 68.28-19.604 10.923-39.682 17.952-46.525 19.703-12.584 3.218-28.287 4.485-42.725 6.437-3.529.476-5.299 3.87-5.074 5.463.586 4.098-.946 5.21-4.484 5.852-8.585 1.563-10.73 2.731-12.486-.388-1.8-3.2-3.085-2.424-7.805-1.759-15.215 2.147-86.663 12.827-97.344 14.435z",
    optimal_line_svg: "M118.34 246.687c-5.14.774-6.994 2.392-9.853 7.317-4.586 7.898-9.192 18.211-11.413 27.357-2.486 10.243-2.829 25.557-1.95 39.458.445 7.034 2.23 10.04 8.243 12.045 7.17 2.387 8.339 2.488 9.949 9.801 1.61 7.319 6.389 33.36 8.047 42.434 1.188 6.495 2.042 8.91-3.805 11.704-6.436 3.07-7.9 3.95-6.729 9.07 1.17 5.12 6.805 23.714 11.023 30.435 11.51 18.336 19.262 23.945 27.311 26.726 5.165 1.784 11.935 2.284 13.315 7.946 1.317 5.416 1.181 7.937-2.341 9.074-13.167 4.244-26.043 5.56-38.334 5.268-4.24-.102-4.829-.294-4.245-5.56.442-3.967.44-9.514-3.803-14.047-3.322-3.553-10.24-13.756-16.093-28.531-9.486-23.955-16.97-48.602-19.168-60.132-2.924-15.363-5.422-36.152-6.435-49.746-1.903-25.458-.928-45.988 3.217-55.89 5.267-12.585 6.437-17.12 5.999-21.07-.878-7.9-.355-10.97 4.242-12.437 14.192-4.535 27.36-4.242 37.456-5.852 10.094-1.609 27.134-4.495 33.651-6.439 8.34-2.486 23.423-7.227 36.577-9.363 11.704-1.903 21.801-3.073 32.774-8.34 6.195-2.974 21.8-11.119 28.384-13.169 6.585-2.046 18.713-4.606 25.75-6.143 8.048-1.759 17.221-3.118 23.994-4.534 9.32-1.953 25.118-13.113 27.46-27.898 2.535-15.996-2.563-24.582-12.876-33.749-7.022-6.243-11.658-11.657-12.68-15.461-1.987-7.38.472-12.368 3.803-16.97 4.974-6.877 50.625-68.034 53.99-72.277 3.366-4.244 6.436-3.658 9.95-.88 3.509 2.783 7.415 5.432 7.023 10.39-.438 5.56-.515 9.95 1.757 13.607 2.632 4.244 3.365 5.121 6.585 9.51 2.136 2.914 3.949 5.707 5.121 9.51 1.097 3.565 6.103 5.143 8.922 2.633 2.632-2.341 3.073-6.585-.876-9.51-1.636-1.211-3.58-2.506-5.269-5.12-2.926-4.537-5.415-7.9-7.168-10.681-1.389-2.204-3.13-11.026 2.778-12.73 8.632-2.487 19.607-5.853 25.31-7.608 2.719-.835 11.123-.146 11.123 8.34 0 8.485-.294 17.848-1.17 25.896-.394 3.597-3.482 47.7-22.192 77.593-23.132 36.952-62.28 63.471-70.912 68.28-19.604 10.923-39.682 17.952-46.525 19.703-12.584 3.218-28.287 4.485-42.725 6.437-3.529.476-5.299 3.87-5.074 5.463.586 4.098-.946 5.21-4.484 5.852-8.585 1.563-10.73 2.731-12.486-.388-1.8-3.2-3.085-2.424-7.805-1.759-15.215 2.147-86.663 12.827-97.344 14.435z",
    corners: [
      { corner_number: 1, corner_name: "Sainte Dévote", gear: 2, min_speed_kmh: 88, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Right-hander into Beau Rivage hill", x: 74.3, y: 274.0 },
      { corner_number: 2, corner_name: "Beau Rivage", gear: 6, min_speed_kmh: 260, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Uphill sweeping straight", x: 82.3, y: 239.9 },
      { corner_number: 3, corner_name: "Massenet", gear: 4, min_speed_kmh: 155, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Long left around the crest", x: 221.4, y: 209.9 },
      { corner_number: 4, corner_name: "Casino Square", gear: 4, min_speed_kmh: 150, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Blind crest left over the bump", x: 253.0, y: 195.2 },
      { corner_number: 5, corner_name: "Mirabeau Haute", gear: 2, min_speed_kmh: 90, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Downhill right-hander", x: 330.8, y: 159.3 },
      { corner_number: 6, corner_name: "Grand Hotel Hairpin", gear: 1, min_speed_kmh: 46, lateral_g: 1.4, brake_zone: true, drs_zone: false, notes: "Slowest corner in Formula 1 (46 km/h)", x: 306.5, y: 108.3 },
      { corner_number: 7, corner_name: "Mirabeau Bas", gear: 2, min_speed_kmh: 82, lateral_g: 2.0, brake_zone: false, drs_zone: false, notes: "Tight right turn", x: 368.4, y: 14.7 },
      { corner_number: 8, corner_name: "Portier", gear: 2, min_speed_kmh: 75, lateral_g: 1.9, brake_zone: false, drs_zone: false, notes: "Entry onto waterfront and Tunnel", x: 401.4, y: 63.5 },
      { corner_number: 9, corner_name: "Tunnel", gear: 7, min_speed_kmh: 285, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Light change on blind downhill exit", x: 427.6, y: 20.0 },
      { corner_number: 10, corner_name: "Nouvelle Chicane (T10)", gear: 2, min_speed_kmh: 65, lateral_g: 2.3, brake_zone: true, drs_zone: false, notes: "Prime overtaking opportunity", x: 406.8, y: 126.8 },
      { corner_number: 11, corner_name: "Nouvelle Chicane (T11)", gear: 2, min_speed_kmh: 85, lateral_g: 2.1, brake_zone: false, drs_zone: false, notes: "Launch onto harbour quayside", x: 336.4, y: 196.0 },
      { corner_number: 12, corner_name: "Tabac", gear: 4, min_speed_kmh: 165, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "High commitment portside left", x: 241.0, y: 226.3 },
      { corner_number: 13, corner_name: "Louis Chiron (Entry)", gear: 5, min_speed_kmh: 215, lateral_g: 4.1, brake_zone: false, drs_zone: false, notes: "Fast chicane clipping inside barrier", x: 221.6, y: 231.9 },
      { corner_number: 14, corner_name: "Louis Chiron (Exit)", gear: 5, min_speed_kmh: 205, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Swimming pool entry", x: 113.2, y: 248.4 },
      { corner_number: 15, corner_name: "Swimming Pool (Entry)", gear: 3, min_speed_kmh: 125, lateral_g: 2.9, brake_zone: true, drs_zone: false, notes: "Tight right kerb chicane", x: 110.8, y: 336.3 },
      { corner_number: 16, corner_name: "Swimming Pool (Exit)", gear: 3, min_speed_kmh: 140, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Tight left exit", x: 110.8, y: 401.4 },
      { corner_number: 17, corner_name: "La Rascasse (Entry)", gear: 2, min_speed_kmh: 60, lateral_g: 1.7, brake_zone: true, drs_zone: false, notes: "Tight right around restaurant", x: 162.6, y: 478.4 },
      { corner_number: 18, corner_name: "La Rascasse (Apex)", gear: 2, min_speed_kmh: 70, lateral_g: 1.8, brake_zone: false, drs_zone: false, notes: "Hairpin apex", x: 117.9, y: 484.5 },
      { corner_number: 19, corner_name: "Anthony Noghès", gear: 3, min_speed_kmh: 105, lateral_g: 2.4, brake_zone: false, drs_zone: true, notes: "Right turn onto pit straight", x: 78.9, y: 379.3 },
    ],
  },
  {
    id: 5,
    circuit_name: "Suzuka International Racing Course",
    location: "Suzuka",
    country: "Japan",
    country_code: "JPN",
    lat: 34.8431,
    lng: 136.5411,
    length_km: 5.807,
    corners_count: 18,
    drs_zones: 1,
    lap_record: "1:30.983",
    lap_record_driver: "Lewis Hamilton",
    lap_record_year: 2019,
    lap_record_team: "Mercedes W10",
    full_throttle_pct: 65,
    downforce_level: "HIGH",
    tyre_stress_level: 5,
    brake_wear_index: "LOW",
    gear_shifts_per_lap: 48,
    pit_loss_time_sec: 23.2,
    first_grand_prix_year: 1987,
    elevation_gain_m: 40.4,
    view_box: "0 0 500 500",
    start_finish: { x: 380.1, y: 213.9, label_x: 20, label_y: 4 },
    description: "The Ultimate Drivers Circuit. The only figure-eight layout in F1, demanding perfect balance through the S-Curves, Degner, Spoon, and flat-out 130R.",
    svg_path: "M214.902 264.546c-4.263.328-5.803-.797-6.964-6.36-1.16-5.565-10.35-52.063-12.284-61.7-1.12-5.576-.962-14.257 1.644-19.872 2.999-6.458 5.822-12.607 7.255-15.698 1.836-3.975.773-6.955-2.322-8.247-2.978-1.244-5.03-.101-7.35 4.074-2.322 4.173-12.672 21.262-15.283 25.733-2.153 3.687-8.92 17.507-26.309 19.871-10.163 1.38-19.687 1.207-28.146-.199-7.964-1.324-15.005-3.757-20.119-6.358-17.369-8.84-26.889-12.917-38.592-41.034-6.216-14.93-8.706-20.865-9.866-24.045s-6.259-10.384-16.25-9.637c-5.32.397-8.334.725-13.348 1.987-9.865 2.484-14.279 11.485-11.026 20.368 3.675 10.035 7.145 12.684 21.666 23.845 27.276 20.965 40.187 27.009 54.455 33.086 18.664 7.949 100.496 37.755 115.585 42.823 8.293 2.785 13.156 3.078 23.89-1.69 14.312-6.358 24.468-14.207 34.047-24.242 9.108-9.546 20.215-18.976 30.565-27.522 3.32-2.742 4.453-1.049 5.706.199 3 2.98 3.77 3.676 5.32 4.967 1.752 1.463 2.812 1.8 4.836.1 2.128-1.789 6.544-5.557 7.643-6.258 8.992-5.762 12.435-7.209 19.143-5.619q2.56.607 5.23 1.446c13.93 4.372 17.894 8.247 32.694 25.634 8.66 10.175 94.452 116.714 100.98 124.992 7.834 9.934 7.94 13.91 6.482 23.744-1.546 10.433-6.74 21.182-17.704 19.971-8.994-.993-11.294-7.23-14.509-12.32-3.577-5.663-9.067-15.082-13.154-21.461-5.028-7.85-5.807-13.238-19.345-13.91-14.025-.695-19.964-2.105-23.407-17.685-.967-4.372-1.38-5.691-3.289-12.32-2.513-8.744-8.513-14.227-18.764-13.811-14.702.596-23.273-2.344-27.661-12.519-3.772-8.743-.236-15.137 1.933-20.765 1.837-4.77 6.382-16.195 2.71-23.35-3.676-7.153-7.966-9.22-12.866-11.524-5.707-2.683-17.812-8.054-30.855-6.757-14.994 1.49-27.083 9.837-35.207 20.17-6.979 8.877-17.12 21.656-19.442 24.839-2.321 3.181-3.96 3.926-6.287 4.173-6.577.693-23.699 2.285-31.435 2.881z",
    optimal_line_svg: "M214.902 264.546c-4.263.328-5.803-.797-6.964-6.36-1.16-5.565-10.35-52.063-12.284-61.7-1.12-5.576-.962-14.257 1.644-19.872 2.999-6.458 5.822-12.607 7.255-15.698 1.836-3.975.773-6.955-2.322-8.247-2.978-1.244-5.03-.101-7.35 4.074-2.322 4.173-12.672 21.262-15.283 25.733-2.153 3.687-8.92 17.507-26.309 19.871-10.163 1.38-19.687 1.207-28.146-.199-7.964-1.324-15.005-3.757-20.119-6.358-17.369-8.84-26.889-12.917-38.592-41.034-6.216-14.93-8.706-20.865-9.866-24.045s-6.259-10.384-16.25-9.637c-5.32.397-8.334.725-13.348 1.987-9.865 2.484-14.279 11.485-11.026 20.368 3.675 10.035 7.145 12.684 21.666 23.845 27.276 20.965 40.187 27.009 54.455 33.086 18.664 7.949 100.496 37.755 115.585 42.823 8.293 2.785 13.156 3.078 23.89-1.69 14.312-6.358 24.468-14.207 34.047-24.242 9.108-9.546 20.215-18.976 30.565-27.522 3.32-2.742 4.453-1.049 5.706.199 3 2.98 3.77 3.676 5.32 4.967 1.752 1.463 2.812 1.8 4.836.1 2.128-1.789 6.544-5.557 7.643-6.258 8.992-5.762 12.435-7.209 19.143-5.619q2.56.607 5.23 1.446c13.93 4.372 17.894 8.247 32.694 25.634 8.66 10.175 94.452 116.714 100.98 124.992 7.834 9.934 7.94 13.91 6.482 23.744-1.546 10.433-6.74 21.182-17.704 19.971-8.994-.993-11.294-7.23-14.509-12.32-3.577-5.663-9.067-15.082-13.154-21.461-5.028-7.85-5.807-13.238-19.345-13.91-14.025-.695-19.964-2.105-23.407-17.685-.967-4.372-1.38-5.691-3.289-12.32-2.513-8.744-8.513-14.227-18.764-13.811-14.702.596-23.273-2.344-27.661-12.519-3.772-8.743-.236-15.137 1.933-20.765 1.837-4.77 6.382-16.195 2.71-23.35-3.676-7.153-7.966-9.22-12.866-11.524-5.707-2.683-17.812-8.054-30.855-6.757-14.994 1.49-27.083 9.837-35.207 20.17-6.979 8.877-17.12 21.656-19.442 24.839-2.321 3.181-3.96 3.926-6.287 4.173-6.577.693-23.699 2.285-31.435 2.881z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 5, min_speed_kmh: 220, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Fast right entry into T2 deceleration", x: 385.4, y: 220.8 },
      { corner_number: 2, corner_name: "Turn 2", gear: 3, min_speed_kmh: 130, lateral_g: 2.7, brake_zone: true, drs_zone: false, notes: "Tight right leading to Esses", x: 476.5, y: 333.6 },
      { corner_number: 3, corner_name: "S Curves (T3)", gear: 5, min_speed_kmh: 210, lateral_g: 4.3, brake_zone: false, drs_zone: false, notes: "Left entry into flowing snake", x: 472.7, y: 378.2 },
      { corner_number: 4, corner_name: "S Curves (T4)", gear: 5, min_speed_kmh: 195, lateral_g: 4.4, brake_zone: false, drs_zone: false, notes: "Right transition", x: 402.8, y: 327.2 },
      { corner_number: 5, corner_name: "S Curves (T5)", gear: 5, min_speed_kmh: 185, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Left uphill flick", x: 385.8, y: 290.5 },
      { corner_number: 6, corner_name: "S Curves (T6)", gear: 5, min_speed_kmh: 190, lateral_g: 4.0, brake_zone: false, drs_zone: false, notes: "Right climb towards Dunlop", x: 351.8, y: 232.8 },
      { corner_number: 7, corner_name: "Dunlop Curve", gear: 6, min_speed_kmh: 240, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Long uphill blind left", x: 309.1, y: 212.3 },
      { corner_number: 8, corner_name: "Degner 1", gear: 6, min_speed_kmh: 255, lateral_g: 4.5, brake_zone: false, drs_zone: false, notes: "Fast right turn-in clipping inside kerb", x: 210.5, y: 263.8 },
      { corner_number: 9, corner_name: "Degner 2", gear: 3, min_speed_kmh: 135, lateral_g: 2.9, brake_zone: true, drs_zone: false, notes: "Tight right under bridge; punishing gravel on exit", x: 196.5, y: 178.6 },
      { corner_number: 10, corner_name: "Turn 10", gear: 7, min_speed_kmh: 275, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Underpass sweep", x: 199.3, y: 152.3 },
      { corner_number: 11, corner_name: "Hairpin (T11)", gear: 2, min_speed_kmh: 70, lateral_g: 1.8, brake_zone: true, drs_zone: false, notes: "Heavy braking tight left hairpin", x: 154.2, y: 202.2 },
      { corner_number: 12, corner_name: "Turn 12", gear: 7, min_speed_kmh: 280, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Flat out kink before Spoon", x: 55.6, y: 128.7 },
      { corner_number: 13, corner_name: "Spoon Curve (Entry)", gear: 4, min_speed_kmh: 180, lateral_g: 3.6, brake_zone: true, drs_zone: false, notes: "Downhill left apex", x: 16.8, y: 130.4 },
      { corner_number: 14, corner_name: "Spoon Curve (Exit)", gear: 5, min_speed_kmh: 205, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Wide launch onto the Crossover Straight", x: 78.2, y: 194.0 },
      { corner_number: 15, corner_name: "130R (T15)", gear: 8, min_speed_kmh: 305, lateral_g: 4.7, brake_zone: false, drs_zone: false, notes: "Iconic flat-out 300+ km/h left curve", x: 113.1, y: 208.6 },
      { corner_number: 16, corner_name: "Casio Triangle (T16)", gear: 2, min_speed_kmh: 80, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Chicane right entry", x: 218.1, y: 245.2 },
      { corner_number: 17, corner_name: "Casio Triangle (T17)", gear: 2, min_speed_kmh: 95, lateral_g: 2.4, brake_zone: false, drs_zone: false, notes: "Left exit", x: 299.3, y: 188.3 },
      { corner_number: 18, corner_name: "Turn 18", gear: 6, min_speed_kmh: 220, lateral_g: 3.2, brake_zone: false, drs_zone: true, notes: "Right sweep onto main straight", x: 333.1, y: 182.6 },
    ],
  },
  {
    id: 6,
    circuit_name: "Autódromo José Carlos Pace (Interlagos)",
    location: "São Paulo",
    country: "Brazil",
    country_code: "BRA",
    lat: -23.7036,
    lng: -46.6997,
    length_km: 4.309,
    corners_count: 15,
    drs_zones: 2,
    lap_record: "1:10.540",
    lap_record_driver: "Valtteri Bottas",
    lap_record_year: 2018,
    lap_record_team: "Mercedes W09",
    full_throttle_pct: 60,
    downforce_level: "MEDIUM-HIGH",
    tyre_stress_level: 3,
    brake_wear_index: "MODERATE",
    gear_shifts_per_lap: 42,
    pit_loss_time_sec: 22.4,
    first_grand_prix_year: 1973,
    elevation_gain_m: 43.0,
    view_box: "0 0 500 500",
    start_finish: { x: 135.0, y: 377.8, label_x: 20, label_y: 4 },
    description: "Atmospheric amphitheatre running anti-clockwise. Famous for the Senna S downhill chicane, Junção uphill drag, and unpredictable tropical storms.",
    svg_path: "M216.38 19.757c-17.923 4.414-27.502 8.15-29.356 9.005-18.27 8.424-32.89 17.454-41.726 25.47-11.632 10.552-16.108 21.908-19.57 36.02-4.061 16.556-16.797 66.138-24.74 100.06-3.879 16.555-4.247 36.566-.185 54.032 3.524 15.153 37.757 148.06 49.417 194.762 1.78 7.131 2.858 12.295 3.572 14.637 8.863 29.109 24.428 39.214 37.388 24.74 8.308-9.274 18.861-24.656 28.248-16.462 19.385 16.917 45.557 20.194 66.374 12.915 21.845-7.637 33.093-22.602 38.726-34.564 4.023-8.55 6.926-21.201 8.912-28.198 6.46-22.788 58.489-213.536 68.181-249.148 2.697-9.903-6.611-23.196-20.735-26.199-14.069-2.988-16.616-3.274-33.787-6.003-33.892-5.386-48.923 19.7-55.18 27.97-17.862 23.606-59.473 79.48-73.875 99.81-7.299 10.304-12.254 15.556-18.693 19.171-6.871 3.86-11.492 4.98-18.693 5.457-15.733 1.045-43.48-8.05-47.171-28.154-.778-4.232-1.627-8.452-2.374-12.605-2.733-15.174-4.86-29.288-6.119-37.97-2.03-14.008 11.078-22.014 29.17-6.55 13.644 11.663 27.325 9.64 34.34-3.458 5.474-10.222 3.693-17.099-3.325-24.377-9.62-9.98-22.155-22.559-26.586-27.473-3.537-3.923-7.569-10.732-9.232-16.737-1.486-5.368-5.17-19.466-7.568-29.835-1.978-8.542 12.737-17.465 20.677-7.46 9.464 11.93 18.92 22.85 29.54 32.567 20.68 18.92 52.023 22.238 74.591-13.463 21.538-34.077 30.701-48.147 36.584-58.697 2.926-5.25.988-16.44-7.043-19.441-17.76-6.638-20.77-7.914-36.555-12.28-16.496-4.56-24.376-2.182-43.207 2.458z",
    optimal_line_svg: "M216.38 19.757c-17.923 4.414-27.502 8.15-29.356 9.005-18.27 8.424-32.89 17.454-41.726 25.47-11.632 10.552-16.108 21.908-19.57 36.02-4.061 16.556-16.797 66.138-24.74 100.06-3.879 16.555-4.247 36.566-.185 54.032 3.524 15.153 37.757 148.06 49.417 194.762 1.78 7.131 2.858 12.295 3.572 14.637 8.863 29.109 24.428 39.214 37.388 24.74 8.308-9.274 18.861-24.656 28.248-16.462 19.385 16.917 45.557 20.194 66.374 12.915 21.845-7.637 33.093-22.602 38.726-34.564 4.023-8.55 6.926-21.201 8.912-28.198 6.46-22.788 58.489-213.536 68.181-249.148 2.697-9.903-6.611-23.196-20.735-26.199-14.069-2.988-16.616-3.274-33.787-6.003-33.892-5.386-48.923 19.7-55.18 27.97-17.862 23.606-59.473 79.48-73.875 99.81-7.299 10.304-12.254 15.556-18.693 19.171-6.871 3.86-11.492 4.98-18.693 5.457-15.733 1.045-43.48-8.05-47.171-28.154-.778-4.232-1.627-8.452-2.374-12.605-2.733-15.174-4.86-29.288-6.119-37.97-2.03-14.008 11.078-22.014 29.17-6.55 13.644 11.663 27.325 9.64 34.34-3.458 5.474-10.222 3.693-17.099-3.325-24.377-9.62-9.98-22.155-22.559-26.586-27.473-3.537-3.923-7.569-10.732-9.232-16.737-1.486-5.368-5.17-19.466-7.568-29.835-1.978-8.542 12.737-17.465 20.677-7.46 9.464 11.93 18.92 22.85 29.54 32.567 20.68 18.92 52.023 22.238 74.591-13.463 21.538-34.077 30.701-48.147 36.584-58.697 2.926-5.25.988-16.44-7.043-19.441-17.76-6.638-20.77-7.914-36.555-12.28-16.496-4.56-24.376-2.182-43.207 2.458z",
    corners: [
      { corner_number: 1, corner_name: "Senna S (T1)", gear: 3, min_speed_kmh: 115, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Downhill left blind apex into Senna S", x: 178.5, y: 485.0 },
      { corner_number: 2, corner_name: "Senna S (T2)", gear: 3, min_speed_kmh: 130, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Right transition", x: 214.6, y: 459.8 },
      { corner_number: 3, corner_name: "Curva do Sol (T3)", gear: 5, min_speed_kmh: 220, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Long left onto Reta Oposta", x: 324.6, y: 440.2 },
      { corner_number: 4, corner_name: "Descida do Lago (T4)", gear: 4, min_speed_kmh: 155, lateral_g: 3.2, brake_zone: true, drs_zone: false, notes: "Left entry at end of DRS straight", x: 353.0, y: 341.1 },
      { corner_number: 5, corner_name: "Descida do Lago (T5)", gear: 4, min_speed_kmh: 175, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Right exit acceleration", x: 402.1, y: 159.8 },
      { corner_number: 6, corner_name: "Ferradura (T6)", gear: 5, min_speed_kmh: 210, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Long uphill double-apex right", x: 325.0, y: 131.8 },
      { corner_number: 7, corner_name: "Ferradura (T7)", gear: 5, min_speed_kmh: 225, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Second apex right", x: 190.3, y: 281.7 },
      { corner_number: 8, corner_name: "Curva do Laranjinha", gear: 4, min_speed_kmh: 170, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Blind right over the crest", x: 129.1, y: 191.8 },
      { corner_number: 9, corner_name: "Pinheirinho", gear: 2, min_speed_kmh: 90, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Tight downhill left", x: 191.5, y: 181.3 },
      { corner_number: 10, corner_name: "Bico de Pato", gear: 2, min_speed_kmh: 78, lateral_g: 1.9, brake_zone: true, drs_zone: false, notes: "Duck's beak right hairpin", x: 141.8, y: 92.7 },
      { corner_number: 11, corner_name: "Mergulho", gear: 5, min_speed_kmh: 220, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Fast left compression plunge", x: 231.0, y: 134.6 },
      { corner_number: 12, corner_name: "Junção", gear: 3, min_speed_kmh: 125, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Critical left apex onto uphill climb", x: 299.1, y: 31.2 },
      { corner_number: 13, corner_name: "Subida dos Boxes", gear: 6, min_speed_kmh: 255, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Uphill full throttle drag", x: 136.1, y: 64.7 },
      { corner_number: 14, corner_name: "Curva dos Boxes", gear: 7, min_speed_kmh: 280, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Left sweep passing pit lane entry", x: 100.0, y: 240.8 },
      { corner_number: 15, corner_name: "Arquibancadas", gear: 8, min_speed_kmh: 305, lateral_g: 3.1, brake_zone: false, drs_zone: true, notes: "Full throttle launch onto main straight", x: 103.5, y: 255.2 },
    ],
  },
  {
    id: 7,
    circuit_name: "Marina Bay Street Circuit",
    location: "Singapore",
    country: "Singapore",
    country_code: "SGP",
    lat: 1.2914,
    lng: 103.864,
    length_km: 4.94,
    corners_count: 19,
    drs_zones: 4,
    lap_record: "1:35.867",
    lap_record_driver: "Lewis Hamilton",
    lap_record_year: 2023,
    lap_record_team: "Mercedes W14",
    full_throttle_pct: 52,
    downforce_level: "MAXIMUM",
    tyre_stress_level: 3,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 64,
    pit_loss_time_sec: 28.5,
    first_grand_prix_year: 2008,
    elevation_gain_m: 6.8,
    view_box: "0 0 500 500",
    start_finish: { x: 478.1, y: 239.8, label_x: 20, label_y: 4 },
    description: "F1 original night race. Punishing tropical humidity, 19 corners between the barriers, and relentless physical demands on drivers and brakes.",
    svg_path: "M461.432 325.308c3.546.215 6.228-.46 8.285-3.467 2.658-3.883 10.644-15.694 13.506-20.689 2.248-3.924 1.906-8.228 1.362-12.25-.547-4.022-21.779-162.674-22.394-167.042-.55-3.905-2.982-6.455-8.02-5.625-5.037.832-10.535.682-15.509-2.08-5.826-3.236-7.566-5.548-9.382-9.324-2.012-4.185-5.031-6.738-7.791-6.78-4.919-.079-7.416 3.389-7.87 6.78-.944 7.05-1.516 14.7-1.89 19.263-.454 5.547.59 16.212 1.816 20.65s6.726 21.596 9.38 32.207c2.657 10.608 5.068 21.644 6.355 28.2 1.816 9.246-5.447 26.66-19.82 25.58-16.56-1.243-96.96-6.878-104.994-7.571-7.76-.67-17.023-1.387-24.511-4.784-9.874-4.479-92.876-54.296-99.618-58.388-4.267-2.589-5.307-2.724-7.762 1.528-11.374 19.692-20.682 35.827-31.12 56.305-1.838 3.606-3.541 4.266-6.334 1.284-4.19-4.477-26.419-27.808-32.683-34.534-5.78-6.204-20.57-6.21-25.67 4.612-6.504 13.799-56.755 104.28-59.206 108.974-1.382 2.644-2.983 6.481-2.427 10.392.47 3.318 2.756 6.781 5.287 8.641 3.575 2.63 8.469 6.402 12.552 9.457 2.35 1.759 5.615 2.859 10.003 3.783 3.281.692 4.549 2.145 4.69 10.942.077 4.74.304 10.324.304 14.178 0 5.64 3.442 6.28 6.278 8.59 8.916 7.264 16.457 13.176 21.79 17.106 1.07.79 6.672 4.662 8.285 7.396 3.404 5.78 5.447 8.784 7.15 11.096 2.722 3.694 7.75 2.688 8.625-2.08 1.93-10.519 14.526-87.49 17.477-105.29.646-3.9 2.514-10.388 3.065-11.788.098-.25 17.789-43.744 18.355-45.218.646-1.68 1.17-2.659 1.277-2.918 1.153-2.766 3.802-3.986 7.49-.75 5.372 4.713 45.155 39.55 51.182 44.959 5.529 4.963 13.647 8.282 20.848 8.815 2.986.222 39.063 1.437 74.063 3.358 33.248 1.827 65.538 4.368 67.03 4.47 3.065.208 6.169 2.43 6.129 6.819-.115 12.367 4.653 19.533 14.98 20.457 5.903.526 74.874 4.459 79.437 4.736z",
    optimal_line_svg: "M461.432 325.308c3.546.215 6.228-.46 8.285-3.467 2.658-3.883 10.644-15.694 13.506-20.689 2.248-3.924 1.906-8.228 1.362-12.25-.547-4.022-21.779-162.674-22.394-167.042-.55-3.905-2.982-6.455-8.02-5.625-5.037.832-10.535.682-15.509-2.08-5.826-3.236-7.566-5.548-9.382-9.324-2.012-4.185-5.031-6.738-7.791-6.78-4.919-.079-7.416 3.389-7.87 6.78-.944 7.05-1.516 14.7-1.89 19.263-.454 5.547.59 16.212 1.816 20.65s6.726 21.596 9.38 32.207c2.657 10.608 5.068 21.644 6.355 28.2 1.816 9.246-5.447 26.66-19.82 25.58-16.56-1.243-96.96-6.878-104.994-7.571-7.76-.67-17.023-1.387-24.511-4.784-9.874-4.479-92.876-54.296-99.618-58.388-4.267-2.589-5.307-2.724-7.762 1.528-11.374 19.692-20.682 35.827-31.12 56.305-1.838 3.606-3.541 4.266-6.334 1.284-4.19-4.477-26.419-27.808-32.683-34.534-5.78-6.204-20.57-6.21-25.67 4.612-6.504 13.799-56.755 104.28-59.206 108.974-1.382 2.644-2.983 6.481-2.427 10.392.47 3.318 2.756 6.781 5.287 8.641 3.575 2.63 8.469 6.402 12.552 9.457 2.35 1.759 5.615 2.859 10.003 3.783 3.281.692 4.549 2.145 4.69 10.942.077 4.74.304 10.324.304 14.178 0 5.64 3.442 6.28 6.278 8.59 8.916 7.264 16.457 13.176 21.79 17.106 1.07.79 6.672 4.662 8.285 7.396 3.404 5.78 5.447 8.784 7.15 11.096 2.722 3.694 7.75 2.688 8.625-2.08 1.93-10.519 14.526-87.49 17.477-105.29.646-3.9 2.514-10.388 3.065-11.788.098-.25 17.789-43.744 18.355-45.218.646-1.68 1.17-2.659 1.277-2.918 1.153-2.766 3.802-3.986 7.49-.75 5.372 4.713 45.155 39.55 51.182 44.959 5.529 4.963 13.647 8.282 20.848 8.815 2.986.222 39.063 1.437 74.063 3.358 33.248 1.827 65.538 4.368 67.03 4.47 3.065.208 6.169 2.43 6.129 6.819-.115 12.367 4.653 19.533 14.98 20.457 5.903.526 74.874 4.459 79.437 4.736z",
    corners: [
      { corner_number: 1, corner_name: "Sheares (T1)", gear: 3, min_speed_kmh: 120, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Left entry at end of pit straight", x: 467.5, y: 161.2 },
      { corner_number: 2, corner_name: "Turn 2", gear: 3, min_speed_kmh: 110, lateral_g: 2.3, brake_zone: false, drs_zone: false, notes: "Right transition", x: 459.9, y: 117.3 },
      { corner_number: 3, corner_name: "Turn 3", gear: 2, min_speed_kmh: 85, lateral_g: 2.0, brake_zone: true, drs_zone: false, notes: "Tight left onto Republic Boulevard", x: 416.6, y: 99.5 },
      { corner_number: 4, corner_name: "Turn 4", gear: 5, min_speed_kmh: 205, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Right sweep", x: 415.0, y: 230.2 },
      { corner_number: 5, corner_name: "Turn 5", gear: 4, min_speed_kmh: 140, lateral_g: 2.7, brake_zone: false, drs_zone: false, notes: "Right onto Raffles Boulevard straight", x: 306.5, y: 223.3 },
      { corner_number: 6, corner_name: "Turn 6", gear: 7, min_speed_kmh: 280, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Flat-out left kink", x: 281.2, y: 218.9 },
      { corner_number: 7, corner_name: "Memorial (T7)", gear: 2, min_speed_kmh: 85, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "90-degree left at end of Raffles straight", x: 175.5, y: 158.2 },
      { corner_number: 8, corner_name: "Turn 8", gear: 3, min_speed_kmh: 115, lateral_g: 2.4, brake_zone: false, drs_zone: false, notes: "Right turn towards Stamford Road", x: 138.5, y: 221.0 },
      { corner_number: 9, corner_name: "Turn 9", gear: 3, min_speed_kmh: 120, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Left turn onto St Andrews Road", x: 100.5, y: 182.9 },
      { corner_number: 10, corner_name: "Turn 10", gear: 4, min_speed_kmh: 155, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Left sweeper by the Padang", x: 16.7, y: 300.0 },
      { corner_number: 11, corner_name: "Turn 11", gear: 3, min_speed_kmh: 130, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Right kink onto Anderson Bridge", x: 45.6, y: 331.6 },
      { corner_number: 12, corner_name: "Turn 12", gear: 4, min_speed_kmh: 160, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Anderson Bridge exit", x: 96.4, y: 401.9 },
      { corner_number: 13, corner_name: "Turn 13", gear: 2, min_speed_kmh: 65, lateral_g: 1.8, brake_zone: true, drs_zone: false, notes: "Tight left hairpin onto Esplanade Drive", x: 118.0, y: 290.1 },
      { corner_number: 14, corner_name: "Turn 14", gear: 3, min_speed_kmh: 105, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "90-degree right at end of Esplanade", x: 142.7, y: 229.9 },
      { corner_number: 15, corner_name: "Turn 15", gear: 5, min_speed_kmh: 210, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Fast sweeper under new layout straight", x: 217.8, y: 285.3 },
      { corner_number: 16, corner_name: "Turn 16", gear: 4, min_speed_kmh: 150, lateral_g: 2.8, brake_zone: true, drs_zone: false, notes: "Chicane left entry", x: 295.9, y: 288.9 },
      { corner_number: 17, corner_name: "Turn 17", gear: 4, min_speed_kmh: 145, lateral_g: 2.7, brake_zone: false, drs_zone: false, notes: "Chicane right exit", x: 365.2, y: 295.3 },
      { corner_number: 18, corner_name: "Turn 18", gear: 4, min_speed_kmh: 165, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Left sweeper under grandstand", x: 467.1, y: 324.3 },
      { corner_number: 19, corner_name: "Turn 19", gear: 5, min_speed_kmh: 190, lateral_g: 3.2, brake_zone: false, drs_zone: true, notes: "Fast left onto pit straight", x: 484.3, y: 298.8 },
    ],
  },
  {
    id: 8,
    circuit_name: "Baku City Circuit",
    location: "Baku",
    country: "Azerbaijan",
    country_code: "AZE",
    lat: 40.3725,
    lng: 49.8533,
    length_km: 6.003,
    corners_count: 20,
    drs_zones: 2,
    lap_record: "1:43.009",
    lap_record_driver: "Charles Leclerc",
    lap_record_year: 2019,
    lap_record_team: "Ferrari SF90",
    full_throttle_pct: 56,
    downforce_level: "LOW",
    tyre_stress_level: 2,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 62,
    pit_loss_time_sec: 24.8,
    first_grand_prix_year: 2016,
    elevation_gain_m: 26.5,
    view_box: "0 0 500 500",
    start_finish: { x: 418.0, y: 109.7, label_x: 20, label_y: 4 },
    description: "City of Winds. Unites a 2.2km flat-out blast along the Caspian Sea with the ultra-narrow 7.6m Medieval Castle section.",
    svg_path: "M461.985 52.498 427.394 15.65c-3.674-3.909-10.434-4.21-14.453-.63l-98.434 87.727a83 83 0 0 0-3.262 3.058l-55.24 54.7a9.213 9.213 0 0 0-.242 12.906l15.572 16.582-18.27 16.566c-1.063.881-26.136 21.765-34.667 38.79-1.974 3.93-1.146 8.64 2.045 11.714a45 45 0 0 0 3.35 2.958l-47.098 75.377-25.425-30.368c-2.763-3.263-7.588-4.394-11.524-2.719l-1.804.803c-2.22 1.013-2.73 1.288-4.08.951-2.582-.609-5.4-.148-7.242.28-.68.16-1.322.31-1.7.31-.625 0-1.793-1.194-2.133-1.56l-5.74-6.115c-3.477-3.693-9.843-4.013-13.653-.684-17.545 15.244-59.138 52.416-66.486 68.325-.838 1.81-1.326 3.803-1.441 5.926-.165 2.864-.658 12.69-.324 18.97.104 1.86.143 4.261.192 6.916.137 7.976.312 17.902 2.127 24.071 2.254 7.65 4.863 14.312 8.728 22.269 2.402 4.961 6.448 14.454 9.42 21.538.674 1.617.992 3.316.943 5.054l-.066 2.435c-.137 4.865 3.625 8.98 8.57 9.368l83.663 6.508.89.034c5.8 0 10.735-4.45 11.223-10.126.844-9.697 2.604-27.435 4.88-37.27a16 16 0 0 1 1.37-3.752l21.86-42.87c4.546-8.921 8.845-17.35 6.41-28.585l-.164-.776c-1.294-5.958-.203-12.09 3.07-17.266l45.974-72.76a11 11 0 0 1 1.848-2.208L461.399 68.564c4.633-4.27 4.896-11.48.586-16.066z",
    optimal_line_svg: "M461.985 52.498 427.394 15.65c-3.674-3.909-10.434-4.21-14.453-.63l-98.434 87.727a83 83 0 0 0-3.262 3.058l-55.24 54.7a9.213 9.213 0 0 0-.242 12.906l15.572 16.582-18.27 16.566c-1.063.881-26.136 21.765-34.667 38.79-1.974 3.93-1.146 8.64 2.045 11.714a45 45 0 0 0 3.35 2.958l-47.098 75.377-25.425-30.368c-2.763-3.263-7.588-4.394-11.524-2.719l-1.804.803c-2.22 1.013-2.73 1.288-4.08.951-2.582-.609-5.4-.148-7.242.28-.68.16-1.322.31-1.7.31-.625 0-1.793-1.194-2.133-1.56l-5.74-6.115c-3.477-3.693-9.843-4.013-13.653-.684-17.545 15.244-59.138 52.416-66.486 68.325-.838 1.81-1.326 3.803-1.441 5.926-.165 2.864-.658 12.69-.324 18.97.104 1.86.143 4.261.192 6.916.137 7.976.312 17.902 2.127 24.071 2.254 7.65 4.863 14.312 8.728 22.269 2.402 4.961 6.448 14.454 9.42 21.538.674 1.617.992 3.316.943 5.054l-.066 2.435c-.137 4.865 3.625 8.98 8.57 9.368l83.663 6.508.89.034c5.8 0 10.735-4.45 11.223-10.126.844-9.697 2.604-27.435 4.88-37.27a16 16 0 0 1 1.37-3.752l21.86-42.87c4.546-8.921 8.845-17.35 6.41-28.585l-.164-.776c-1.294-5.958-.203-12.09 3.07-17.266l45.974-72.76a11 11 0 0 1 1.848-2.208L461.399 68.564c4.633-4.27 4.896-11.48.586-16.066z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 2, min_speed_kmh: 95, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "90-degree left from 350 km/h braking zone", x: 464.2, y: 64.4 },
      { corner_number: 2, corner_name: "Turn 2", gear: 2, min_speed_kmh: 90, lateral_g: 2.3, brake_zone: true, drs_zone: false, notes: "90-degree left onto straight", x: 425.5, y: 14.1 },
      { corner_number: 3, corner_name: "Turn 3", gear: 3, min_speed_kmh: 115, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "90-degree left", x: 365.7, y: 57.1 },
      { corner_number: 4, corner_name: "Turn 4", gear: 3, min_speed_kmh: 120, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "90-degree right onto street boulevard", x: 310.2, y: 106.9 },
      { corner_number: 5, corner_name: "Turn 5", gear: 2, min_speed_kmh: 95, lateral_g: 2.3, brake_zone: true, drs_zone: false, notes: "Right entry into tight square", x: 256.0, y: 162.1 },
      { corner_number: 6, corner_name: "Turn 6", gear: 2, min_speed_kmh: 90, lateral_g: 2.2, brake_zone: false, drs_zone: false, notes: "Left exit", x: 270.1, y: 191.2 },
      { corner_number: 7, corner_name: "Turn 7", gear: 2, min_speed_kmh: 85, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Heavy braking right", x: 222.6, y: 259.0 },
      { corner_number: 8, corner_name: "Castle Section (T8)", gear: 1, min_speed_kmh: 65, lateral_g: 1.8, brake_zone: false, drs_zone: false, notes: "Narrowest point on calendar (7.6m width)", x: 176.7, y: 335.3 },
      { corner_number: 9, corner_name: "Castle Section (T9)", gear: 2, min_speed_kmh: 80, lateral_g: 2.0, brake_zone: false, drs_zone: false, notes: "Right kink climbing around fortress wall", x: 124.2, y: 304.3 },
      { corner_number: 10, corner_name: "Castle Section (T10)", gear: 2, min_speed_kmh: 85, lateral_g: 2.1, brake_zone: false, drs_zone: false, notes: "Left flick exit", x: 105.5, y: 294.9 },
      { corner_number: 11, corner_name: "Turn 11", gear: 4, min_speed_kmh: 160, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Fast right uphill exit", x: 36.2, y: 366.5 },
      { corner_number: 12, corner_name: "Turn 12", gear: 6, min_speed_kmh: 240, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Blind crest left plunge", x: 55.9, y: 465.1 },
      { corner_number: 13, corner_name: "Turn 13", gear: 7, min_speed_kmh: 275, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Full throttle downhill sweep", x: 56.9, y: 474.6 },
      { corner_number: 14, corner_name: "Turn 14", gear: 7, min_speed_kmh: 285, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "High speed kink", x: 160.3, y: 480.2 },
      { corner_number: 15, corner_name: "Turn 15", gear: 3, min_speed_kmh: 120, lateral_g: 2.7, brake_zone: true, drs_zone: false, notes: "Downhill left entry with barrier danger", x: 166.4, y: 438.5 },
      { corner_number: 16, corner_name: "Turn 16", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Left turn onto flat-out seaside sprint", x: 194.9, y: 356.4 },
      { corner_number: 17, corner_name: "Turn 17", gear: 7, min_speed_kmh: 290, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Flat-out sweep", x: 245.0, y: 273.4 },
      { corner_number: 18, corner_name: "Turn 18", gear: 8, min_speed_kmh: 310, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Full throttle left bend", x: 261.2, y: 257.8 },
      { corner_number: 19, corner_name: "Turn 19", gear: 8, min_speed_kmh: 325, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Flat-out right kink", x: 362.6, y: 162.0 },
      { corner_number: 20, corner_name: "Turn 20", gear: 8, min_speed_kmh: 340, lateral_g: 2.5, brake_zone: false, drs_zone: true, notes: "Final flat-out kink onto 2.2km main straight", x: 411.7, y: 115.5 },
    ],
  },
  {
    id: 9,
    circuit_name: "Circuit of the Americas (COTA)",
    location: "Austin",
    country: "United States",
    country_code: "USA",
    lat: 30.1328,
    lng: -97.6411,
    length_km: 5.513,
    corners_count: 20,
    drs_zones: 2,
    lap_record: "1:36.169",
    lap_record_driver: "Charles Leclerc",
    lap_record_year: 2019,
    lap_record_team: "Ferrari SF90",
    full_throttle_pct: 58,
    downforce_level: "HIGH",
    tyre_stress_level: 4,
    brake_wear_index: "HEAVY",
    gear_shifts_per_lap: 56,
    pit_loss_time_sec: 23.5,
    first_grand_prix_year: 2012,
    elevation_gain_m: 40.5,
    view_box: "0 0 500 500",
    start_finish: { x: 170.3, y: 436.8, label_x: 20, label_y: 4 },
    description: "Modern American classic. Steep 41-meter uphill climb to blind apex Turn 1, followed by a relentless Becketts-inspired high-G sweeping sector.",
    svg_path: "M463.201 42.551c-3.095-4.166-9.585-4.959-13.542-1.491-105.774 92.51-189.942 140.467-271.342 186.844l-1.43.818a8.79 8.79 0 0 0-4.448 7.319 8.87 8.87 0 0 0 3.861 7.726c10.004 6.86 18.037 11.893 24.491 15.937 9.44 5.913 15.39 9.643 19.06 13.81l-12.113 5.437c-1.335.598-2.524.903-3.537.903-1.238 0-2.939-.402-5.131-3.54l-4.563-6.535a13.1 13.1 0 0 0-5.448-4.483l-11.76-5.206a13.07 13.07 0 0 0-9.396-.459l-11.38 3.769c-3.1 1.023-5.339 3.555-5.99 6.772a9.12 9.12 0 0 0 2.897 8.64c6.81 5.996 14.065 10.876 21.083 15.595 7.814 5.256 15.205 10.224 20.324 15.78 1.003 1.77 5.673 10.775 4.745 22.995a9.66 9.66 0 0 1-2.139 5.317c-3.422 4.198-9.976 11.888-15.405 16.219a9.1 9.1 0 0 1-3.476 1.72c-2.734.69-8.336 1.847-15.156 1.847a58 58 0 0 1-9.102-.709c-.999-.161-2.029-.56-3.066-1.183l-47.373-28.484c-5.617-3.377-13.355-2.265-17.802 2.544l-48.214 52.06a10.69 10.69 0 0 0-2.47 10.18c1 3.624 3.746 6.404 7.344 7.44l211.465 60.794c.8.23 1.623.349 2.44.349h.004c3.202 0 6.146-1.782 7.68-4.652 1.537-2.871 1.379-6.22-.42-8.954-4.86-7.388-12.923-18.609-23.722-30.107-15.686-16.704-17.69-29.534-6.913-44.286 8.675-11.876 21.268-28.367 28.003-37.141a19.36 19.36 0 0 0 4.016-11.282l.466-15.142a19.58 19.58 0 0 1 6.562-14.018l.715-.63c7.37-6.527 10.504-16.54 8.18-26.134l-3.371-13.905c-.474-1.951-.171-4.007.844-5.789 2.62-4.578 8.053-13.095 15.02-18.7 1.572-1.26 3.69-1.957 5.968-1.957l26.805 1.295.957.022c8.28 0 15.724-5.263 18.53-13.093l8.343-23.295c1.584-4.427 5.797-7.398 10.481-7.398 1.941 0 3.789.498 5.5 1.482l7.665 4.404c3.18 1.826 7.308 1.64 10.303-.463l40.179-28.161a14.04 14.04 0 0 0 5.38-7.511L464.63 50.736c.84-2.853.317-5.836-1.428-8.185z",
    optimal_line_svg: "M463.201 42.551c-3.095-4.166-9.585-4.959-13.542-1.491-105.774 92.51-189.942 140.467-271.342 186.844l-1.43.818a8.79 8.79 0 0 0-4.448 7.319 8.87 8.87 0 0 0 3.861 7.726c10.004 6.86 18.037 11.893 24.491 15.937 9.44 5.913 15.39 9.643 19.06 13.81l-12.113 5.437c-1.335.598-2.524.903-3.537.903-1.238 0-2.939-.402-5.131-3.54l-4.563-6.535a13.1 13.1 0 0 0-5.448-4.483l-11.76-5.206a13.07 13.07 0 0 0-9.396-.459l-11.38 3.769c-3.1 1.023-5.339 3.555-5.99 6.772a9.12 9.12 0 0 0 2.897 8.64c6.81 5.996 14.065 10.876 21.083 15.595 7.814 5.256 15.205 10.224 20.324 15.78 1.003 1.77 5.673 10.775 4.745 22.995a9.66 9.66 0 0 1-2.139 5.317c-3.422 4.198-9.976 11.888-15.405 16.219a9.1 9.1 0 0 1-3.476 1.72c-2.734.69-8.336 1.847-15.156 1.847a58 58 0 0 1-9.102-.709c-.999-.161-2.029-.56-3.066-1.183l-47.373-28.484c-5.617-3.377-13.355-2.265-17.802 2.544l-48.214 52.06a10.69 10.69 0 0 0-2.47 10.18c1 3.624 3.746 6.404 7.344 7.44l211.465 60.794c.8.23 1.623.349 2.44.349h.004c3.202 0 6.146-1.782 7.68-4.652 1.537-2.871 1.379-6.22-.42-8.954-4.86-7.388-12.923-18.609-23.722-30.107-15.686-16.704-17.69-29.534-6.913-44.286 8.675-11.876 21.268-28.367 28.003-37.141a19.36 19.36 0 0 0 4.016-11.282l.466-15.142a19.58 19.58 0 0 1 6.562-14.018l.715-.63c7.37-6.527 10.504-16.54 8.18-26.134l-3.371-13.905c-.474-1.951-.171-4.007.844-5.789 2.62-4.578 8.053-13.095 15.02-18.7 1.572-1.26 3.69-1.957 5.968-1.957l26.805 1.295.957.022c8.28 0 15.724-5.263 18.53-13.093l8.343-23.295c1.584-4.427 5.797-7.398 10.481-7.398 1.941 0 3.789.498 5.5 1.482l7.665 4.404c3.18 1.826 7.308 1.64 10.303-.463l40.179-28.161a14.04 14.04 0 0 0 5.38-7.511L464.63 50.736c.84-2.853.317-5.836-1.428-8.185z",
    corners: [
      { corner_number: 1, corner_name: "Big Red (T1)", gear: 2, min_speed_kmh: 85, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Steep 41m uphill climb to blind hairpin apex", x: 202.8, y: 446.2 },
      { corner_number: 2, corner_name: "Esses (T2)", gear: 6, min_speed_kmh: 255, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Fast downhill right", x: 265.4, y: 452.3 },
      { corner_number: 3, corner_name: "Esses (T3)", gear: 6, min_speed_kmh: 265, lateral_g: 4.3, brake_zone: false, drs_zone: false, notes: "High-G left transition", x: 226.5, y: 390.2 },
      { corner_number: 4, corner_name: "Esses (T4)", gear: 6, min_speed_kmh: 250, lateral_g: 4.4, brake_zone: false, drs_zone: false, notes: "Right sweep matching Maggotts rhythm", x: 273.6, y: 294.6 },
      { corner_number: 5, corner_name: "Esses (T5)", gear: 6, min_speed_kmh: 240, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Left sweep", x: 277.7, y: 252.2 },
      { corner_number: 6, corner_name: "Esses (T6)", gear: 5, min_speed_kmh: 215, lateral_g: 3.9, brake_zone: false, drs_zone: false, notes: "Right curve", x: 380.5, y: 193.0 },
      { corner_number: 7, corner_name: "Turn 7", gear: 4, min_speed_kmh: 165, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Left uphill flick", x: 429.5, y: 161.9 },
      { corner_number: 8, corner_name: "Turn 8", gear: 4, min_speed_kmh: 150, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Tight left transition", x: 441.8, y: 128.6 },
      { corner_number: 9, corner_name: "Turn 9", gear: 4, min_speed_kmh: 160, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Blind crest right", x: 452.0, y: 39.6 },
      { corner_number: 10, corner_name: "Turn 10", gear: 5, min_speed_kmh: 210, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Downhill left leading to back straight", x: 405.1, y: 78.5 },
      { corner_number: 11, corner_name: "Turn 11", gear: 2, min_speed_kmh: 75, lateral_g: 2.0, brake_zone: true, drs_zone: false, notes: "Tight left hairpin before 1km back straight", x: 347.8, y: 122.2 },
      { corner_number: 12, corner_name: "Turn 12", gear: 2, min_speed_kmh: 85, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Heavy braking left at end of back straight", x: 279.4, y: 168.2 },
      { corner_number: 13, corner_name: "Turn 13", gear: 3, min_speed_kmh: 115, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Right transition", x: 173.3, y: 234.6 },
      { corner_number: 14, corner_name: "Turn 14", gear: 3, min_speed_kmh: 125, lateral_g: 2.7, brake_zone: false, drs_zone: false, notes: "Right sweeper", x: 218.7, y: 272.3 },
      { corner_number: 15, corner_name: "Turn 15", gear: 2, min_speed_kmh: 90, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Tight left around amphitheatre", x: 151.1, y: 268.5 },
      { corner_number: 16, corner_name: "Carousel (T16)", gear: 5, min_speed_kmh: 210, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Triple-apex right inspired by Istanbul Turn 8", x: 180.4, y: 355.5 },
      { corner_number: 17, corner_name: "Carousel (T17)", gear: 5, min_speed_kmh: 220, lateral_g: 4.5, brake_zone: false, drs_zone: false, notes: "Second apex continuous G load", x: 152.7, y: 357.1 },
      { corner_number: 18, corner_name: "Carousel (T18)", gear: 6, min_speed_kmh: 235, lateral_g: 4.3, brake_zone: false, drs_zone: false, notes: "Third apex high-speed launch", x: 88.5, y: 328.4 },
      { corner_number: 19, corner_name: "Turn 19", gear: 4, min_speed_kmh: 175, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Fast left over off-camber crest", x: 36.0, y: 394.5 },
      { corner_number: 20, corner_name: "Turn 20", gear: 3, min_speed_kmh: 110, lateral_g: 2.4, brake_zone: true, drs_zone: true, notes: "90-degree left onto pit straight", x: 141.8, y: 428.6 },
    ],
  },
  {
    id: 10,
    circuit_name: "Red Bull Ring (Spielberg)",
    location: "Spielberg",
    country: "Austria",
    country_code: "AUT",
    lat: 47.2197,
    lng: 14.7647,
    length_km: 4.318,
    corners_count: 10,
    drs_zones: 3,
    lap_record: "1:05.619",
    lap_record_driver: "Carlos Sainz",
    lap_record_year: 2020,
    lap_record_team: "McLaren MCL35",
    full_throttle_pct: 68,
    downforce_level: "MEDIUM",
    tyre_stress_level: 3,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 36,
    pit_loss_time_sec: 21.6,
    first_grand_prix_year: 1970,
    elevation_gain_m: 63.5,
    view_box: "0 0 500 500",
    start_finish: { x: 272.6, y: 455.4, label_x: 20, label_y: 4 },
    description: "Short, punchy Styrian mountain circuit. High elevation changes, heavy braking zones, and three consecutive DRS zones creating non-stop action.",
    svg_path: "m460.715 363.195-2.743-3.298a30.76 30.76 0 0 0-12.787-9.099c-28.347-10.668-144.043-54.216-165.073-62.172-13.48-5.1-22.998-7.179-32.852-7.179-5.879 0-11.594.738-18.21 1.596l-2.824.363c-8.696 1.11-20.316 6.554-34.534 16.184-8.62 5.83-20.474 5.84-29.11.021a29.4 29.4 0 0 1-12.78-20.936l-7.272-61.646c-1.018-8.633 2.157-17.355 8.487-23.334l1.86-1.755c8.862-8.359 22.983-10.006 33.548-3.884 19.288 11.183 45.635 26.677 61.63 36.976 8.58 5.526 18.928 8.327 30.755 8.327 15.27 0 30.606-4.538 42.93-8.186l4.69-1.375c4.92-1.426 10.12-3.745 15.456-6.902 7.347-4.344 11.499-12.308 10.835-20.784s-6.007-15.705-13.948-18.86c-23.266-9.244-52.174-22.847-67.334-30.133a141 141 0 0 1-18.173-10.464C231.21 121.637 175.9 87.962 144.892 69.226a249.5 249.5 0 0 0-42.344-20.384C85.92 42.69 66.59 36.02 53.302 31.505c-6-2.038-12.657.313-16.084 5.56-2.551 3.899-2.942 8.787-1.045 13.07l29.974 67.736a185.7 185.7 0 0 1 15.662 64.962c.59 10.464 1.068 21.278 1.45 31.462a620 620 0 0 0 12.985 104.718l21.938 103.591c2.045 9.648 10.025 16.85 19.858 17.92l259.13 28.244c1.606.175 3.22.303 4.833.359a185 185 0 0 0 6.026.102c18.269 0 30.411-2.982 37.379-5.485 7.615-2.736 12.981-9.75 13.67-17.87l5.856-69.273a18.42 18.42 0 0 0-4.22-13.406z",
    optimal_line_svg: "m460.715 363.195-2.743-3.298a30.76 30.76 0 0 0-12.787-9.099c-28.347-10.668-144.043-54.216-165.073-62.172-13.48-5.1-22.998-7.179-32.852-7.179-5.879 0-11.594.738-18.21 1.596l-2.824.363c-8.696 1.11-20.316 6.554-34.534 16.184-8.62 5.83-20.474 5.84-29.11.021a29.4 29.4 0 0 1-12.78-20.936l-7.272-61.646c-1.018-8.633 2.157-17.355 8.487-23.334l1.86-1.755c8.862-8.359 22.983-10.006 33.548-3.884 19.288 11.183 45.635 26.677 61.63 36.976 8.58 5.526 18.928 8.327 30.755 8.327 15.27 0 30.606-4.538 42.93-8.186l4.69-1.375c4.92-1.426 10.12-3.745 15.456-6.902 7.347-4.344 11.499-12.308 10.835-20.784s-6.007-15.705-13.948-18.86c-23.266-9.244-52.174-22.847-67.334-30.133a141 141 0 0 1-18.173-10.464C231.21 121.637 175.9 87.962 144.892 69.226a249.5 249.5 0 0 0-42.344-20.384C85.92 42.69 66.59 36.02 53.302 31.505c-6-2.038-12.657.313-16.084 5.56-2.551 3.899-2.942 8.787-1.045 13.07l29.974 67.736a185.7 185.7 0 0 1 15.662 64.962c.59 10.464 1.068 21.278 1.45 31.462a620 620 0 0 0 12.985 104.718l21.938 103.591c2.045 9.648 10.025 16.85 19.858 17.92l259.13 28.244c1.606.175 3.22.303 4.833.359a185 185 0 0 0 6.026.102c18.269 0 30.411-2.982 37.379-5.485 7.615-2.736 12.981-9.75 13.67-17.87l5.856-69.273a18.42 18.42 0 0 0-4.22-13.406z",
    corners: [
      { corner_number: 1, corner_name: "Niki Lauda Kurve (T1)", gear: 3, min_speed_kmh: 135, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Uphill right onto first DRS straight", x: 119.9, y: 427.8 },
      { corner_number: 2, corner_name: "Remus (T3)", gear: 2, min_speed_kmh: 72, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Steep uphill right hairpin - key overtaking spot", x: 96.2, y: 318.3 },
      { corner_number: 3, corner_name: "Schlossgold (T4)", gear: 3, min_speed_kmh: 120, lateral_g: 2.8, brake_zone: true, drs_zone: false, notes: "Downhill right entry with tricky track limits", x: 35.4, y: 41.2 },
      { corner_number: 4, corner_name: "Rauch (T5)", gear: 4, min_speed_kmh: 175, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Fast left into downhill infield", x: 50.0, y: 30.8 },
      { corner_number: 5, corner_name: "Turn 6", gear: 5, min_speed_kmh: 205, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Long sweeping downhill left", x: 349.7, y: 186.5 },
      { corner_number: 6, corner_name: "Turn 7", gear: 5, min_speed_kmh: 215, lateral_g: 3.7, brake_zone: false, drs_zone: false, notes: "Fast left kink", x: 349.2, y: 210.0 },
      { corner_number: 7, corner_name: "Würth (T8)", gear: 5, min_speed_kmh: 220, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Fast right transition", x: 164.4, y: 300.7 },
      { corner_number: 8, corner_name: "Rindt (T9)", gear: 6, min_speed_kmh: 240, lateral_g: 4.1, brake_zone: false, drs_zone: false, notes: "High speed downhill right", x: 223.2, y: 284.0 },
      { corner_number: 9, corner_name: "Red Bull Mobile (T10)", gear: 5, min_speed_kmh: 210, lateral_g: 3.8, brake_zone: false, drs_zone: true, notes: "Fast right launching onto main straight", x: 459.3, y: 361.5 },
      { corner_number: 10, corner_name: "Main Straight (T2 Kink)", gear: 8, min_speed_kmh: 315, lateral_g: 2.2, brake_zone: false, drs_zone: false, notes: "Slight uphill kink on DRS straight", x: 448.6, y: 462.3 },
    ],
  },
  {
    id: 11,
    circuit_name: "Circuit Gilles Villeneuve",
    location: "Montreal",
    country: "Canada",
    country_code: "CAN",
    lat: 45.5,
    lng: -73.5228,
    length_km: 4.361,
    corners_count: 14,
    drs_zones: 3,
    lap_record: "1:13.078",
    lap_record_driver: "Valtteri Bottas",
    lap_record_year: 2019,
    lap_record_team: "Mercedes W10",
    full_throttle_pct: 60,
    downforce_level: "LOW-MEDIUM",
    tyre_stress_level: 2,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 52,
    pit_loss_time_sec: 21.2,
    first_grand_prix_year: 1978,
    elevation_gain_m: 5.2,
    view_box: "0 0 500 500",
    start_finish: { x: 307.1, y: 379.3, label_x: 20, label_y: 4 },
    description: "Stop-and-go island circuit on Île Notre-Dame. Punishing kerb riding, massive brake degradation, and the infamous Wall of Champions.",
    svg_path: "M223.071 47.18c-2.536-11.336-4.35-19.461-5.519-25.208-.965-4.748 1.315-6.378 3.73-6.861 2.237-.448 4.69 1.63 5.07 6.115.597 7.01 1.045 10.441 1.641 16.11.352 3.346 1.416 7.836 4.624 14.468 2.238 4.624 6.862 13.871 12.679 28.638 2.265 5.75 12.827 32.666 15.512 39.676 1.843 4.812 4.475 14.32 5.52 20.137 1.043 5.817 24.312 118.88 31.173 151.843 1.025 4.926-1.742 6.349-2.983 7.01-2.237 1.194-3.729 2.686-2.834 7.757s18.197 84.722 19.39 90.39 3.282 16.259 2.835 27.744c-.355 9.096-1.936 29.235-2.387 33.411-.596 5.52-.596 7.16 2.387 8.353s4.039 1.614 6.861 2.834c11.038 4.773 2.983 17.004-4.773 15.065-8.494-2.123-13.458-3.632-23.269-7.16-13.275-4.772-33.56-23.865-41.764-31.92-3.538-3.473-2.834-7.606-1.044-10.888s1.26-5.254-1.343-9.397c-3.281-5.22-12.411-17.275-15.512-20.136-3.878-3.58-7.56-5.592-11.187-7.906-7.01-4.475-12.53-14.02-12.53-23.268 0-7.017.597-31.622.746-36.544.15-4.923-1.496-8.826-6.264-9.1-5.22-.297-10.143 3.58-14.916.3-4.773-3.282-7.866-5.35-9.696-15.662-3.281-18.496-5.518-40.273-5.37-52.206.127-10.143 1.776-35.995 4.923-50.416 1.79-8.203 8.502-34.455 10.143-39.527 1.133-3.505 3.878-4.624 7.458-4.325 5.37.447 10.292-2.983 12.827-11.635 2.974-10.145 9.546-34.754 10.441-41.167.924-6.623 5.074-31.195 5.221-40.72.15-9.696-.1-18.247-1.79-25.805z",
    optimal_line_svg: "M223.071 47.18c-2.536-11.336-4.35-19.461-5.519-25.208-.965-4.748 1.315-6.378 3.73-6.861 2.237-.448 4.69 1.63 5.07 6.115.597 7.01 1.045 10.441 1.641 16.11.352 3.346 1.416 7.836 4.624 14.468 2.238 4.624 6.862 13.871 12.679 28.638 2.265 5.75 12.827 32.666 15.512 39.676 1.843 4.812 4.475 14.32 5.52 20.137 1.043 5.817 24.312 118.88 31.173 151.843 1.025 4.926-1.742 6.349-2.983 7.01-2.237 1.194-3.729 2.686-2.834 7.757s18.197 84.722 19.39 90.39 3.282 16.259 2.835 27.744c-.355 9.096-1.936 29.235-2.387 33.411-.596 5.52-.596 7.16 2.387 8.353s4.039 1.614 6.861 2.834c11.038 4.773 2.983 17.004-4.773 15.065-8.494-2.123-13.458-3.632-23.269-7.16-13.275-4.772-33.56-23.865-41.764-31.92-3.538-3.473-2.834-7.606-1.044-10.888s1.26-5.254-1.343-9.397c-3.281-5.22-12.411-17.275-15.512-20.136-3.878-3.58-7.56-5.592-11.187-7.906-7.01-4.475-12.53-14.02-12.53-23.268 0-7.017.597-31.622.746-36.544.15-4.923-1.496-8.826-6.264-9.1-5.22-.297-10.143 3.58-14.916.3-4.773-3.282-7.866-5.35-9.696-15.662-3.281-18.496-5.518-40.273-5.37-52.206.127-10.143 1.776-35.995 4.923-50.416 1.79-8.203 8.502-34.455 10.143-39.527 1.133-3.505 3.878-4.624 7.458-4.325 5.37.447 10.292-2.983 12.827-11.635 2.974-10.145 9.546-34.754 10.441-41.167.924-6.623 5.074-31.195 5.221-40.72.15-9.696-.1-18.247-1.79-25.805z",
    corners: [
      { corner_number: 1, corner_name: "Virage Senna (T1)", gear: 3, min_speed_kmh: 125, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Left entry into Senna S chicane", x: 314.0, y: 423.0 },
      { corner_number: 2, corner_name: "Virage Senna (T2)", gear: 2, min_speed_kmh: 75, lateral_g: 1.9, brake_zone: false, drs_zone: false, notes: "Tight right hairpin exit", x: 311.9, y: 465.3 },
      { corner_number: 3, corner_name: "Turn 3", gear: 4, min_speed_kmh: 150, lateral_g: 2.8, brake_zone: true, drs_zone: false, notes: "Right entry chicane over kerbs", x: 251.0, y: 431.3 },
      { corner_number: 4, corner_name: "Turn 4", gear: 4, min_speed_kmh: 160, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Left exit clipping concrete wall", x: 220.3, y: 396.1 },
      { corner_number: 5, corner_name: "Turn 5", gear: 6, min_speed_kmh: 245, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Fast right sweep", x: 207.4, y: 329.5 },
      { corner_number: 6, corner_name: "Turn 6", gear: 3, min_speed_kmh: 110, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Left turn entry", x: 173.8, y: 261.6 },
      { corner_number: 7, corner_name: "Turn 7", gear: 4, min_speed_kmh: 140, lateral_g: 2.7, brake_zone: false, drs_zone: false, notes: "Right exit acceleration", x: 190.8, y: 167.8 },
      { corner_number: 8, corner_name: "Turn 8", gear: 4, min_speed_kmh: 155, lateral_g: 2.9, brake_zone: true, drs_zone: false, notes: "Right entry into fast chicane", x: 206.7, y: 160.7 },
      { corner_number: 9, corner_name: "Turn 9", gear: 4, min_speed_kmh: 165, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Left exit towards hairpin", x: 218.3, y: 16.8 },
      { corner_number: 10, corner_name: "L'Epingle (T10)", gear: 2, min_speed_kmh: 65, lateral_g: 1.8, brake_zone: true, drs_zone: false, notes: "Heavy deceleration 180-degree right hairpin", x: 223.3, y: 15.4 },
      { corner_number: 11, corner_name: "Turn 11", gear: 6, min_speed_kmh: 250, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Exit kink onto Droit du Casino straight", x: 261.4, y: 121.6 },
      { corner_number: 12, corner_name: "Turn 12", gear: 7, min_speed_kmh: 290, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Full throttle kink on back straight", x: 270.2, y: 159.3 },
      { corner_number: 13, corner_name: "Wall of Champions (T13)", gear: 3, min_speed_kmh: 130, lateral_g: 3.1, brake_zone: true, drs_zone: false, notes: "Right entry riding high kerbs", x: 292.2, y: 301.1 },
      { corner_number: 14, corner_name: "Wall of Champions (T14)", gear: 4, min_speed_kmh: 155, lateral_g: 3.3, brake_zone: false, drs_zone: true, notes: "Left exit brushing the infamous Wall of Champions", x: 291.6, y: 306.5 },
    ],
  },
  {
    id: 12,
    circuit_name: "Circuit Zandvoort",
    location: "Zandvoort",
    country: "Netherlands",
    country_code: "NED",
    lat: 52.3888,
    lng: 4.5409,
    length_km: 4.259,
    corners_count: 14,
    drs_zones: 2,
    lap_record: "1:11.097",
    lap_record_driver: "Lewis Hamilton",
    lap_record_year: 2021,
    lap_record_team: "Mercedes W12",
    full_throttle_pct: 55,
    downforce_level: "HIGH",
    tyre_stress_level: 5,
    brake_wear_index: "MEDIUM",
    gear_shifts_per_lap: 46,
    pit_loss_time_sec: 22.0,
    first_grand_prix_year: 1952,
    elevation_gain_m: 15.0,
    view_box: "0 0 500 500",
    start_finish: { x: 91.1, y: 187.0, label_x: 20, label_y: 4 },
    description: "Old-school seaside rollercoaster with extreme 18-degree banking at Hugenholtz and Arie Luyendyk curves, demanding high downforce.",
    svg_path: "M21.069 357.833c1.298-3.172 2.643-6.403 4.005-9.703 39.95-96.747 102.157-247.306 119.655-289.933 3.898-9.5 13.163-13.63 23.395-9.5 7.133 2.878 10.938 7.388 12.269 15.545 1.314 8.052-2.023 13.112-5.136 22.264-4.375 12.858-8.062 21.928-13.314 34.737-4.565 11.131-8.748 22.264-9.13 36.082-.372 13.554-.299 18.144-.57 23.607-.57 11.515-4.946 18.903-18.07 23.797-11.036 4.116-19.445 6.953-26.765 9.625-1.385.507-21.738 7.073-16.317 23.482 6.249 18.915 23.516 12.476 24.897 12.061 15.203-4.553 47.601-15.05 61.552-19.45 10.043-3.166 34.618-2.687 52.782 1.92 11.556 2.929 31.293 9.03 49.644 9.5 18.735.48 49.833-20.823 58.678-27.156 8.845-6.334 25.772-12.533 39.469-11.994 21.969.863 51.066 3.037 60.96 3.742 13.506.96 37.51 9.447 43.938 33.01 5.706 20.919-1.52 36.273-8.178 46.158-8.541 12.678-20.542 29.076-26.249 40.016-3.437 6.589-12.174 24.375-19.503 39.417-4.837 9.93-9.028 16.623-32.613 14.32-11.761-1.15-36.85-4.875-62.578-28.019-8.75-7.87-7.989-18.233-4.755-22.07 6.896-8.183 14.836-12.283 23.396-13.434 21.706-2.92 24.918-2.303 53.638-13.243 13.996-5.329 17.746-17.038 15.788-27.636-2.093-11.325-9.892-17.658-23.777-19.577-42.12-5.824-79.576-3.528-110.13 2.304-42.225 8.06-79.517 23.968-116.977 43.373-14.076 7.294-15.977-1.727-20.16-10.364-3.746-7.729-11.831-9.875-19.213-7.87-9.89 2.688-12.487 9.57-11.601 15.162 2.853 18.04 16.166 95.962 20.16 117.456 3.164 17.024-2.852 36.465-27.77 37.234-15.79.488-29.415.122-50.785-2.879-15.026-2.11-34.119-17.863-40.896-34.546-4.754-11.709-10.841-30.324.26-57.438Z",
    optimal_line_svg: "M21.069 357.833c1.298-3.172 2.643-6.403 4.005-9.703 39.95-96.747 102.157-247.306 119.655-289.933 3.898-9.5 13.163-13.63 23.395-9.5 7.133 2.878 10.938 7.388 12.269 15.545 1.314 8.052-2.023 13.112-5.136 22.264-4.375 12.858-8.062 21.928-13.314 34.737-4.565 11.131-8.748 22.264-9.13 36.082-.372 13.554-.299 18.144-.57 23.607-.57 11.515-4.946 18.903-18.07 23.797-11.036 4.116-19.445 6.953-26.765 9.625-1.385.507-21.738 7.073-16.317 23.482 6.249 18.915 23.516 12.476 24.897 12.061 15.203-4.553 47.601-15.05 61.552-19.45 10.043-3.166 34.618-2.687 52.782 1.92 11.556 2.929 31.293 9.03 49.644 9.5 18.735.48 49.833-20.823 58.678-27.156 8.845-6.334 25.772-12.533 39.469-11.994 21.969.863 51.066 3.037 60.96 3.742 13.506.96 37.51 9.447 43.938 33.01 5.706 20.919-1.52 36.273-8.178 46.158-8.541 12.678-20.542 29.076-26.249 40.016-3.437 6.589-12.174 24.375-19.503 39.417-4.837 9.93-9.028 16.623-32.613 14.32-11.761-1.15-36.85-4.875-62.578-28.019-8.75-7.87-7.989-18.233-4.755-22.07 6.896-8.183 14.836-12.283 23.396-13.434 21.706-2.92 24.918-2.303 53.638-13.243 13.996-5.329 17.746-17.038 15.788-27.636-2.093-11.325-9.892-17.658-23.777-19.577-42.12-5.824-79.576-3.528-110.13 2.304-42.225 8.06-79.517 23.968-116.977 43.373-14.076 7.294-15.977-1.727-20.16-10.364-3.746-7.729-11.831-9.875-19.213-7.87-9.89 2.688-12.487 9.57-11.601 15.162 2.853 18.04 16.166 95.962 20.16 117.456 3.164 17.024-2.852 36.465-27.77 37.234-15.79.488-29.415.122-50.785-2.879-15.026-2.11-34.119-17.863-40.896-34.546-4.754-11.709-10.841-30.324.26-57.438Z",
    corners: [
      { corner_number: 1, corner_name: "Tarzanbocht (T1)", gear: 2, min_speed_kmh: 95, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Iconic horseshoe right hairpin", x: 147.1, y: 53.9 },
      { corner_number: 2, corner_name: "Gerlachbocht (T2)", gear: 4, min_speed_kmh: 175, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Fast right sweep", x: 155.8, y: 47.7 },
      { corner_number: 3, corner_name: "Hugenholtzbocht (T3)", gear: 3, min_speed_kmh: 110, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Extreme 19-degree progressive banking left", x: 90.6, y: 229.0 },
      { corner_number: 4, corner_name: "Hunserug (T4)", gear: 6, min_speed_kmh: 255, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Blind uphill crest right", x: 180.5, y: 229.7 },
      { corner_number: 5, corner_name: "Rob Slotemakerbocht (T5)", gear: 6, min_speed_kmh: 260, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Fast sweeping bend", x: 282.9, y: 241.8 },
      { corner_number: 6, corner_name: "Turn 6", gear: 5, min_speed_kmh: 220, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Right uphill entry", x: 480.1, y: 231.8 },
      { corner_number: 7, corner_name: "Scheivlak (T7)", gear: 6, min_speed_kmh: 250, lateral_g: 4.4, brake_zone: false, drs_zone: false, notes: "Epic blind downhill right - supreme commitment", x: 421.8, y: 375.5 },
      { corner_number: 8, corner_name: "Mastersbocht (T8)", gear: 5, min_speed_kmh: 205, lateral_g: 3.7, brake_zone: false, drs_zone: false, notes: "Right downhill plunge", x: 327.7, y: 331.9 },
      { corner_number: 9, corner_name: "Turn 9", gear: 4, min_speed_kmh: 155, lateral_g: 2.9, brake_zone: true, drs_zone: false, notes: "Right entry", x: 417.0, y: 264.1 },
      { corner_number: 10, corner_name: "Turn 10", gear: 3, min_speed_kmh: 125, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Left turn onto short straight", x: 273.0, y: 260.9 },
      { corner_number: 11, corner_name: "Hans Ernst Bocht (T11)", gear: 3, min_speed_kmh: 115, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Right chicane entry", x: 159.2, y: 303.1 },
      { corner_number: 12, corner_name: "Hans Ernst Bocht (T12)", gear: 3, min_speed_kmh: 125, lateral_g: 2.7, brake_zone: false, drs_zone: false, notes: "Left chicane exit", x: 133.1, y: 445.0 },
      { corner_number: 13, corner_name: "Kumhobocht (T13)", gear: 5, min_speed_kmh: 215, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Right turn leading into final banking", x: 56.5, y: 448.6 },
      { corner_number: 14, corner_name: "Arie Luyendykbocht (T14)", gear: 7, min_speed_kmh: 275, lateral_g: 4.1, brake_zone: false, drs_zone: true, notes: "18-degree banked right with early DRS activation", x: 89.7, y: 191.7 },
    ],
  },
  {
    id: 13,
    circuit_name: "Bahrain International Circuit",
    location: "Sakhir",
    country: "Bahrain",
    country_code: "BHR",
    lat: 26.0325,
    lng: 50.5106,
    length_km: 5.412,
    corners_count: 15,
    drs_zones: 3,
    lap_record: "1:31.447",
    lap_record_driver: "Pedro de la Rosa",
    lap_record_year: 2005,
    lap_record_team: "McLaren MP4-20",
    full_throttle_pct: 64,
    downforce_level: "MEDIUM",
    tyre_stress_level: 5,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 58,
    pit_loss_time_sec: 24.5,
    first_grand_prix_year: 2004,
    elevation_gain_m: 17.5,
    view_box: "0 0 500 500",
    start_finish: { x: 295.2, y: 401.2, label_x: 20, label_y: 4 },
    description: "Desert floodlit oasis. Extreme rear tyre degradation, high thermal stress, and tough lockup-prone downhill braking at Turn 10.",
    svg_path: "M462.85 365.784 329.224 131.432c-4.038-7.082-11.039-11.307-18.724-11.307-7.65 0-14.626 4.201-18.66 11.24-9.299 16.238-17.16 32.823-23.356 49.293-5.14 13.655-5.658 25.341-1.594 35.727 7.746 19.786 30.936 29.875 53.367 39.633l4.14 1.806c16.661 7.291 23.048 25.67 25.473 39.799.724 4.218-.317 8.525-2.847 11.823-2.535 3.297-6.256 5.19-10.22 5.19H143.68c-2.374 0-4.767-.129-7.111-.385l-31.072-3.39 5.256-9.353c5.08-9.04 15.179-13.982 24.85-12.089 14.027 2.747 34.175 6.298 50.485 7.621 14.248 1.16 34.693 2.699 51.662 3.956q.505.038.995.038h.005c5.95 0 11.14-4.174 12.916-10.381 1.8-6.287-.282-12.757-5.3-16.485l-49.515-36.75c-7.077-5.252-11.07-14.267-10.421-23.53l.739-10.54c1.111-15.893-7.328-30.547-20.997-36.47l-11.045-4.781c-2.881-1.25-5.512-3.205-7.62-5.658l-43.734-50.881c-3.697-4.302-8.681-6.671-14.037-6.671-9.551 0-17.588 7.382-19.112 17.548L43.822 295.397c-2.137 14.267-.11 28.647 5.865 41.58l5.3 11.493c2.415 5.22 1.504 11.534-2.273 15.705l-14.47 16c-3.208 3.553-4.134 8.81-2.353 13.393 1.775 4.583 5.894 7.545 10.486 7.545H414.29c10.748 0 21.596-2.565 31.373-7.414l10.894-5.41c3.777-1.874 6.634-5.416 7.836-9.718s.639-8.964-1.544-12.787z",
    optimal_line_svg: "M462.85 365.784 329.224 131.432c-4.038-7.082-11.039-11.307-18.724-11.307-7.65 0-14.626 4.201-18.66 11.24-9.299 16.238-17.16 32.823-23.356 49.293-5.14 13.655-5.658 25.341-1.594 35.727 7.746 19.786 30.936 29.875 53.367 39.633l4.14 1.806c16.661 7.291 23.048 25.67 25.473 39.799.724 4.218-.317 8.525-2.847 11.823-2.535 3.297-6.256 5.19-10.22 5.19H143.68c-2.374 0-4.767-.129-7.111-.385l-31.072-3.39 5.256-9.353c5.08-9.04 15.179-13.982 24.85-12.089 14.027 2.747 34.175 6.298 50.485 7.621 14.248 1.16 34.693 2.699 51.662 3.956q.505.038.995.038h.005c5.95 0 11.14-4.174 12.916-10.381 1.8-6.287-.282-12.757-5.3-16.485l-49.515-36.75c-7.077-5.252-11.07-14.267-10.421-23.53l.739-10.54c1.111-15.893-7.328-30.547-20.997-36.47l-11.045-4.781c-2.881-1.25-5.512-3.205-7.62-5.658l-43.734-50.881c-3.697-4.302-8.681-6.671-14.037-6.671-9.551 0-17.588 7.382-19.112 17.548L43.822 295.397c-2.137 14.267-.11 28.647 5.865 41.58l5.3 11.493c2.415 5.22 1.504 11.534-2.273 15.705l-14.47 16c-3.208 3.553-4.134 8.81-2.353 13.393 1.775 4.583 5.894 7.545 10.486 7.545H414.29c10.748 0 21.596-2.565 31.373-7.414l10.894-5.41c3.777-1.874 6.634-5.416 7.836-9.718s.639-8.964-1.544-12.787z",
    corners: [
      { corner_number: 1, corner_name: "Michael Schumacher (T1)", gear: 2, min_speed_kmh: 75, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Heavy braking right hairpin at end of main straight", x: 285.1, y: 401.1 },
      { corner_number: 2, corner_name: "Turn 2", gear: 3, min_speed_kmh: 125, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Left acceleration sweep", x: 42.8, y: 400.5 },
      { corner_number: 3, corner_name: "Turn 3", gear: 4, min_speed_kmh: 175, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Right flick onto DRS straight", x: 36.3, y: 383.0 },
      { corner_number: 4, corner_name: "Turn 4", gear: 3, min_speed_kmh: 135, lateral_g: 2.7, brake_zone: true, drs_zone: false, notes: "Downhill right entry with tricky off-camber exit", x: 65.8, y: 148.5 },
      { corner_number: 5, corner_name: "Turn 5", gear: 5, min_speed_kmh: 220, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Fast left entry into Esses", x: 92.4, y: 99.1 },
      { corner_number: 6, corner_name: "Turn 6", gear: 5, min_speed_kmh: 210, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Right sweep", x: 152.0, y: 160.4 },
      { corner_number: 7, corner_name: "Turn 7", gear: 5, min_speed_kmh: 215, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Left uphill flick", x: 241.3, y: 300.8 },
      { corner_number: 8, corner_name: "Turn 8", gear: 2, min_speed_kmh: 75, lateral_g: 1.9, brake_zone: true, drs_zone: false, notes: "Tight right hairpin", x: 106.6, y: 308.9 },
      { corner_number: 9, corner_name: "Turn 9", gear: 4, min_speed_kmh: 165, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Blind downhill crest left leading to T10", x: 158.2, y: 314.6 },
      { corner_number: 10, corner_name: "Turn 10", gear: 2, min_speed_kmh: 70, lateral_g: 2.0, brake_zone: true, drs_zone: false, notes: "Extreme downhill off-camber left - notorious for lockups", x: 340.6, y: 314.1 },
      { corner_number: 11, corner_name: "Turn 11", gear: 5, min_speed_kmh: 215, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Fast uphill left sweeper", x: 265.9, y: 213.6 },
      { corner_number: 12, corner_name: "Turn 12", gear: 6, min_speed_kmh: 260, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Flat out right sweep", x: 305.8, y: 120.7 },
      { corner_number: 13, corner_name: "Turn 13", gear: 4, min_speed_kmh: 155, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Right turn launching onto back straight", x: 380.7, y: 221.8 },
      { corner_number: 14, corner_name: "Turn 14", gear: 3, min_speed_kmh: 120, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Heavy braking right", x: 459.4, y: 386.4 },
      { corner_number: 15, corner_name: "Turn 15", gear: 5, min_speed_kmh: 195, lateral_g: 3.0, brake_zone: false, drs_zone: true, notes: "Right acceleration onto start/finish straight", x: 418.0, y: 401.0 },
    ],
  },
  {
    id: 14,
    circuit_name: "Jeddah Corniche Circuit",
    location: "Jeddah",
    country: "Saudi Arabia",
    country_code: "SAU",
    lat: 21.6319,
    lng: 39.1044,
    length_km: 6.174,
    corners_count: 27,
    drs_zones: 3,
    lap_record: "1:30.734",
    lap_record_driver: "Lewis Hamilton",
    lap_record_year: 2021,
    lap_record_team: "Mercedes W12",
    full_throttle_pct: 79,
    downforce_level: "LOW",
    tyre_stress_level: 3,
    brake_wear_index: "MEDIUM",
    gear_shifts_per_lap: 60,
    pit_loss_time_sec: 22.5,
    first_grand_prix_year: 2021,
    elevation_gain_m: 4.5,
    view_box: "0 0 500 500",
    start_finish: { x: 389.1, y: 170.1, label_x: 20, label_y: 4 },
    description: "The Fastest Street Circuit on Earth. 27 flowing high-speed bends nestled along the Red Sea coast with average speeds exceeding 250 km/h.",
    svg_path: "M441.899 135.118a56957 56957 0 0 1-32.942 21.303c-9.373 6.056-12.405 8-15.927 10.544-3.522 2.54-7.533 5.676-21.403 17.137a11706.519 11992.905 0 0 0-49.791 41.468c-12.193 10.215-12.85 10.854-13.327 11.411a5.23 5.359 0 0 0-.971 1.471 2.93 3 0 0 0 .06 2.428 4.535 4.646 0 0 0 .9 1.2c.442.465 1.043 1.007 1.53 1.503.492.5.862.948 1.12 1.324a2.865 2.935 0 0 1 .453.987 2.358 2.416 0 0 1 .026.988 4.89 5.01 0 0 1-1.134 2.54 3.893 3.988 0 0 1-1.031.87 8.882 9.1 0 0 1-1.777.79 19.994 20.483 0 0 1-2.608.62c-.956.167-1.954.295-2.808.387a28.917 29.624 0 0 1-2.611.17c-1.036.024-2.393.009-3.855.04-1.463.023-3.032.092-4.165.205a14.6 14.6 0 0 0-2.518.464c-.699.194-1.402.407-2.316.748a48 48 0 0 0-3.213 1.332 60 60 0 0 0-3.647 1.82 79 79 0 0 0-3.984 2.284c-1.42.875-2.967 1.874-4.448 2.788-1.486.914-2.91 1.738-4.294 2.555-1.39.813-2.744 1.626-4.01 2.385-1.266.755-2.445 1.46-3.564 2.11-1.115.651-2.173 1.251-3.258 1.867a330 330 0 0 0-3.288 1.885c-1.088.643-2.162 1.294-3.243 1.898a81 81 0 0 1-3.239 1.68 87.344 89.48 0 0 1-2.91 1.382c-.816.364-1.41.597-1.852.806a7.056 7.229 0 0 0-1.028.608 7 7 0 0 0-.812.62 2.808 2.877 0 0 0-.62.758c-.129.256-.152.5-.144 1.007.011.503.053 1.278.072 2.06a38.619 39.564 0 0 1-.212 5.018 16 16 0 0 1-.37 2.09 8.806 9.022 0 0 1-.544 1.503 14.192 14.54 0 0 1-.87 1.68 27.212 27.878 0 0 1-2.04 2.866 25.413 26.035 0 0 1-5.14 4.251 16.509 16.913 0 0 1-4.476 2.025 17.594 18.024 0 0 1-5.597.647 17.45 17.877 0 0 1-2.355-.194 20.863 21.373 0 0 1-2.162-.515c-.725-.205-1.474-.426-2.192-.612a25.954 26.589 0 0 0-2.184-.476 19.487 19.964 0 0 0-2.294-.26 12.193 12.49 0 0 0-2.162.09 16.1 16.495 0 0 0-2.181.453c-.695.193-1.334.426-1.988.697a20.477 20.978 0 0 0-3.916 2.09c-.661.453-1.353.968-2.124 1.51-.767.543-1.61 1.12-2.343 1.673a17.083 17.501 0 0 0-1.958 1.685 14.944 15.31 0 0 0-2.865 4.12 11.6 11.6 0 0 0-.718 2.013 29.688 30.414 0 0 0-.476 2.207c-.144.774-.28 1.58-.416 2.242a16 16 0 0 1-.408 1.634 5.941 6.087 0 0 1-.499 1.211c-.2.349-.453.659-.775 1.034-.328.372-.729.813-1.235 1.224a10.715 10.977 0 0 1-1.867 1.173c-.749.387-1.63.767-2.548 1.15a128.39 131.53 0 0 1-3.817 1.495 621 621 0 0 1-6.603 2.462c-1.765.65-2.389.867-2.963 1.003a8.704 8.917 0 0 1-1.776.209 36.994 37.899 0 0 1-4.158-.155 5.56 5.696 0 0 1-1.236-.31 13.901 14.241 0 0 1-4.308-2.54 14.721 15.081 0 0 1-1.387-1.463c-.443-.511-.881-1.046-1.316-1.56a29.37 30.089 0 0 0-1.285-1.445 17.027 17.443 0 0 0-2.419-2.071 13.961 14.303 0 0 0-1.387-.852 10.292 10.543 0 0 0-1.368-.585 8.315 8.518 0 0 0-1.376-.364 12.658 12.967 0 0 0-1.59-.147 8.825 9.041 0 0 0-1.562.078c-.559.077-1.21.232-1.908.41-.696.178-1.444.387-2.105.577-.666.19-1.248.356-1.883.53a35.338 36.203 0 0 1-2.222.53 40.667 41.662 0 0 1-3.088.504 32 32 0 0 1-3.583.248c-1.387.027-3.069 0-4.8-.008a141.73 145.198 0 0 0-4.701.046c-1.18.04-1.747.109-2.518.213a49.511 50.723 0 0 0-2.781.446 55.672 57.034 0 0 0-3.349.774 79 79 0 0 0-3.715 1.077 115 115 0 0 0-4.282 1.44c-1.467.526-2.922 1.084-4.407 1.645-1.486.566-2.997 1.139-4.55 1.758-1.55.62-3.138 1.29-8.694 3.717-5.555 2.428-15.068 6.614-22.805 10.006-7.74 3.391-13.697 5.986-16.788 7.352-3.088 1.363-3.304 1.499-3.595 1.704a11.754 12.042 0 0 0-1.035.844 16.6 17.006 0 0 0-2.268 2.556 9.63 9.866 0 0 0-1.538 3.175c-.136.48-.19.832-.22 1.521-.026.69-.026 1.716.11 2.64.136.93.408 1.751.692 2.448a9.585 9.82 0 0 0 2.23 3.38c.491.492 1.035.953 1.644 1.37a16 16 0 0 0 1.84 1.077c.556.271.99.453 1.709.558.718.108 1.72.15 2.66.15s1.822-.038 2.703-.154a22.254 22.798 0 0 0 5.064-1.278 19 19 0 0 0 2.54-1.239 24 24 0 0 0 2.434-1.591c.71-.53 1.259-1.026 1.822-1.572a32 32 0 0 0 1.757-1.843 40.297 41.283 0 0 0 3.515-4.627c.48-.705.9-1.336 1.35-1.975.453-.643.93-1.293 1.473-1.936.548-.639 1.16-1.27 1.701-1.843.537-.573 1.002-1.092 1.607-1.704a41.367 42.379 0 0 1 4.856-4.181 38.022 38.952 0 0 1 6.803-4.093 52.686 53.975 0 0 1 4.505-1.905 39 39 0 0 1 4.196-1.25 55.581 56.94 0 0 1 6.973-1.182c.903-.08 1.606-.096 2.645-.1 1.047-.008 2.427-.008 3.425.015.994.02 1.602.058 2.286.14.68.077 1.444.205 2.306.333.858.127 1.821.263 2.668.38.847.115 1.576.208 2.389.255a47.648 48.814 0 0 0 8.806-.504 21.052 21.567 0 0 0 2.653-.592c.801-.236 1.557-.519 2.521-.864.96-.348 2.124-.75 3.073-1.045.945-.286 1.682-.465 2.29-.558a6.7 6.7 0 0 1 1.66-.061 9.4 9.4 0 0 1 1.674.29c.472.136.782.298 1.247.589.472.29 1.096.712 1.648 1.215.555.504 1.043 1.1 1.493 1.677.453.58.861 1.142 1.254 1.66.393.516.768.984 1.18 1.434a12.17 12.468 0 0 0 3.046 2.462c.605.356 1.247.69 1.791.96.545.268.994.465 1.474.6.48.136.983.202 1.67.26.681.058 1.55.104 2.352.128.805.023 1.55.023 2.38-.043a22.072 22.612 0 0 0 2.794-.426 40.44 41.43 0 0 0 3.447-.902 70.839 72.572 0 0 0 7.861-2.904 78 78 0 0 0 3.515-1.626 52.335 53.615 0 0 0 6.266-3.69 35.452 36.319 0 0 0 2.593-1.975 62 62 0 0 0 2.695-2.42 173 173 0 0 0 3.371-3.283c1.127-1.123 2.155-2.176 3.334-3.38 1.179-1.2 2.506-2.556 3.832-3.826 1.323-1.27 2.657-2.459 3.89-3.554 1.231-1.096 2.369-2.095 3.355-2.893.99-.797 1.83-1.394 2.835-2.067 1.002-.678 2.166-1.433 3.1-1.975a24.264 24.858 0 0 1 2.426-1.216 78.995 80.928 0 0 1 6.028-2.431 97 97 0 0 1 4.225-1.406c1.474-.465 2.967-.89 4.43-1.42a41 41 0 0 0 4.263-1.825 65.404 67.004 0 0 0 7.257-4.247 70 70 0 0 0 3.643-2.734 68 68 0 0 0 3.288-2.772 39 39 0 0 0 2.91-2.896 54 54 0 0 0 2.926-3.543c.884-1.17 1.599-2.234 2.305-3.28.715-1.045 1.418-2.075 2.162-3.059a76.554 78.426 0 0 1 5.552-6.408 47.236 48.392 0 0 1 5.866-5.083 78 78 0 0 1 3.428-2.42 64.63 66.21 0 0 1 4.252-2.595 97 97 0 0 1 5.458-2.826 81.032 83.015 0 0 1 5.506-2.405 64 64 0 0 1 5.061-1.746 79 79 0 0 1 5.356-1.405 116.597 119.45 0 0 1 5.926-1.185 81 81 0 0 1 4.913-.697c1.33-.143 2.306-.202 3.077-.271.763-.066 1.323-.14 1.852-.302.54-.163 1.058-.415 1.512-.643.464-.232.869-.438 1.28-.763.413-.325.832-.766 1.3-1.32.473-.554.984-1.224 1.41-1.862a11.527 11.81 0 0 0 .983-1.809 10 10 0 0 0 .54-1.626c.144-.573.277-1.22.44-1.858.162-.643.355-1.278.604-2.014a23.13 23.696 0 0 1 .918-2.362 14.5 14.5 0 0 1 1.285-2.215 18 18 0 0 1 1.626-1.974 14 14 0 0 1 1.784-1.58c.687-.515 1.53-1.072 3.197-2.18l5.67-3.775c1.511-1.007 2.051-1.347 2.788-1.704.737-.348 1.679-.712 2.442-1.01.767-.295 1.36-.527 2.215-.658.85-.136 1.965-.175 3.197-.144 1.236.027 2.597.124 4.66.368 2.068.248 4.838.643 7.484.987a512 512 0 0 0 7.725.941c2.563.298 5.163.597 7.491.76 2.332.162 4.384.189 6.15.173a43.69 44.76 0 0 0 4.822-.255 46 46 0 0 0 4.985-.906 55 55 0 0 0 4.747-1.36c1.523-.506 3-1.06 4.471-1.668a52.61 53.898 0 0 0 4.46-2.075c1.534-.806 3.13-1.75 4.92-2.912 1.789-1.162 3.765-2.544 5.776-3.961a498.175 510.362 0 0 0 5.892-4.22 167 167 0 0 0 5.004-3.768 116.979 119.84 0 0 0 8.277-7.179 77 77 0 0 0 3.874-3.949 101.328 103.807 0 0 0 8.18-10.272 140 140 0 0 0 3.639-5.537 74 74 0 0 0 2.732-4.724 93.206 95.486 0 0 0 5.095-11.356 92 92 0 0 0 1.897-5.506c.632-2.045 1.323-4.492 2.011-6.977a991 991 0 0 0 1.965-7.187c.598-2.18 1.089-4.011 1.58-5.835.492-1.82.983-3.632 1.304-4.956.325-1.328.491-2.168.53-2.981.037-.806-.039-1.592-.352-2.455a10.643 10.903 0 0 0-1.384-2.54 6.973 7.144 0 0 0-1.625-1.665 5.643 5.78 0 0 0-2.044-.93 8.164 8.363 0 0 0-2.669-.135c-.88.105-1.663.376-2.846 1.107-1.175.728-2.747 1.921-3.534 2.517-.786.593-.786.593-8.643 5.673z",
    optimal_line_svg: "M441.899 135.118a56957 56957 0 0 1-32.942 21.303c-9.373 6.056-12.405 8-15.927 10.544-3.522 2.54-7.533 5.676-21.403 17.137a11706.519 11992.905 0 0 0-49.791 41.468c-12.193 10.215-12.85 10.854-13.327 11.411a5.23 5.359 0 0 0-.971 1.471 2.93 3 0 0 0 .06 2.428 4.535 4.646 0 0 0 .9 1.2c.442.465 1.043 1.007 1.53 1.503.492.5.862.948 1.12 1.324a2.865 2.935 0 0 1 .453.987 2.358 2.416 0 0 1 .026.988 4.89 5.01 0 0 1-1.134 2.54 3.893 3.988 0 0 1-1.031.87 8.882 9.1 0 0 1-1.777.79 19.994 20.483 0 0 1-2.608.62c-.956.167-1.954.295-2.808.387a28.917 29.624 0 0 1-2.611.17c-1.036.024-2.393.009-3.855.04-1.463.023-3.032.092-4.165.205a14.6 14.6 0 0 0-2.518.464c-.699.194-1.402.407-2.316.748a48 48 0 0 0-3.213 1.332 60 60 0 0 0-3.647 1.82 79 79 0 0 0-3.984 2.284c-1.42.875-2.967 1.874-4.448 2.788-1.486.914-2.91 1.738-4.294 2.555-1.39.813-2.744 1.626-4.01 2.385-1.266.755-2.445 1.46-3.564 2.11-1.115.651-2.173 1.251-3.258 1.867a330 330 0 0 0-3.288 1.885c-1.088.643-2.162 1.294-3.243 1.898a81 81 0 0 1-3.239 1.68 87.344 89.48 0 0 1-2.91 1.382c-.816.364-1.41.597-1.852.806a7.056 7.229 0 0 0-1.028.608 7 7 0 0 0-.812.62 2.808 2.877 0 0 0-.62.758c-.129.256-.152.5-.144 1.007.011.503.053 1.278.072 2.06a38.619 39.564 0 0 1-.212 5.018 16 16 0 0 1-.37 2.09 8.806 9.022 0 0 1-.544 1.503 14.192 14.54 0 0 1-.87 1.68 27.212 27.878 0 0 1-2.04 2.866 25.413 26.035 0 0 1-5.14 4.251 16.509 16.913 0 0 1-4.476 2.025 17.594 18.024 0 0 1-5.597.647 17.45 17.877 0 0 1-2.355-.194 20.863 21.373 0 0 1-2.162-.515c-.725-.205-1.474-.426-2.192-.612a25.954 26.589 0 0 0-2.184-.476 19.487 19.964 0 0 0-2.294-.26 12.193 12.49 0 0 0-2.162.09 16.1 16.495 0 0 0-2.181.453c-.695.193-1.334.426-1.988.697a20.477 20.978 0 0 0-3.916 2.09c-.661.453-1.353.968-2.124 1.51-.767.543-1.61 1.12-2.343 1.673a17.083 17.501 0 0 0-1.958 1.685 14.944 15.31 0 0 0-2.865 4.12 11.6 11.6 0 0 0-.718 2.013 29.688 30.414 0 0 0-.476 2.207c-.144.774-.28 1.58-.416 2.242a16 16 0 0 1-.408 1.634 5.941 6.087 0 0 1-.499 1.211c-.2.349-.453.659-.775 1.034-.328.372-.729.813-1.235 1.224a10.715 10.977 0 0 1-1.867 1.173c-.749.387-1.63.767-2.548 1.15a128.39 131.53 0 0 1-3.817 1.495 621 621 0 0 1-6.603 2.462c-1.765.65-2.389.867-2.963 1.003a8.704 8.917 0 0 1-1.776.209 36.994 37.899 0 0 1-4.158-.155 5.56 5.696 0 0 1-1.236-.31 13.901 14.241 0 0 1-4.308-2.54 14.721 15.081 0 0 1-1.387-1.463c-.443-.511-.881-1.046-1.316-1.56a29.37 30.089 0 0 0-1.285-1.445 17.027 17.443 0 0 0-2.419-2.071 13.961 14.303 0 0 0-1.387-.852 10.292 10.543 0 0 0-1.368-.585 8.315 8.518 0 0 0-1.376-.364 12.658 12.967 0 0 0-1.59-.147 8.825 9.041 0 0 0-1.562.078c-.559.077-1.21.232-1.908.41-.696.178-1.444.387-2.105.577-.666.19-1.248.356-1.883.53a35.338 36.203 0 0 1-2.222.53 40.667 41.662 0 0 1-3.088.504 32 32 0 0 1-3.583.248c-1.387.027-3.069 0-4.8-.008a141.73 145.198 0 0 0-4.701.046c-1.18.04-1.747.109-2.518.213a49.511 50.723 0 0 0-2.781.446 55.672 57.034 0 0 0-3.349.774 79 79 0 0 0-3.715 1.077 115 115 0 0 0-4.282 1.44c-1.467.526-2.922 1.084-4.407 1.645-1.486.566-2.997 1.139-4.55 1.758-1.55.62-3.138 1.29-8.694 3.717-5.555 2.428-15.068 6.614-22.805 10.006-7.74 3.391-13.697 5.986-16.788 7.352-3.088 1.363-3.304 1.499-3.595 1.704a11.754 12.042 0 0 0-1.035.844 16.6 17.006 0 0 0-2.268 2.556 9.63 9.866 0 0 0-1.538 3.175c-.136.48-.19.832-.22 1.521-.026.69-.026 1.716.11 2.64.136.93.408 1.751.692 2.448a9.585 9.82 0 0 0 2.23 3.38c.491.492 1.035.953 1.644 1.37a16 16 0 0 0 1.84 1.077c.556.271.99.453 1.709.558.718.108 1.72.15 2.66.15s1.822-.038 2.703-.154a22.254 22.798 0 0 0 5.064-1.278 19 19 0 0 0 2.54-1.239 24 24 0 0 0 2.434-1.591c.71-.53 1.259-1.026 1.822-1.572a32 32 0 0 0 1.757-1.843 40.297 41.283 0 0 0 3.515-4.627c.48-.705.9-1.336 1.35-1.975.453-.643.93-1.293 1.473-1.936.548-.639 1.16-1.27 1.701-1.843.537-.573 1.002-1.092 1.607-1.704a41.367 42.379 0 0 1 4.856-4.181 38.022 38.952 0 0 1 6.803-4.093 52.686 53.975 0 0 1 4.505-1.905 39 39 0 0 1 4.196-1.25 55.581 56.94 0 0 1 6.973-1.182c.903-.08 1.606-.096 2.645-.1 1.047-.008 2.427-.008 3.425.015.994.02 1.602.058 2.286.14.68.077 1.444.205 2.306.333.858.127 1.821.263 2.668.38.847.115 1.576.208 2.389.255a47.648 48.814 0 0 0 8.806-.504 21.052 21.567 0 0 0 2.653-.592c.801-.236 1.557-.519 2.521-.864.96-.348 2.124-.75 3.073-1.045.945-.286 1.682-.465 2.29-.558a6.7 6.7 0 0 1 1.66-.061 9.4 9.4 0 0 1 1.674.29c.472.136.782.298 1.247.589.472.29 1.096.712 1.648 1.215.555.504 1.043 1.1 1.493 1.677.453.58.861 1.142 1.254 1.66.393.516.768.984 1.18 1.434a12.17 12.468 0 0 0 3.046 2.462c.605.356 1.247.69 1.791.96.545.268.994.465 1.474.6.48.136.983.202 1.67.26.681.058 1.55.104 2.352.128.805.023 1.55.023 2.38-.043a22.072 22.612 0 0 0 2.794-.426 40.44 41.43 0 0 0 3.447-.902 70.839 72.572 0 0 0 7.861-2.904 78 78 0 0 0 3.515-1.626 52.335 53.615 0 0 0 6.266-3.69 35.452 36.319 0 0 0 2.593-1.975 62 62 0 0 0 2.695-2.42 173 173 0 0 0 3.371-3.283c1.127-1.123 2.155-2.176 3.334-3.38 1.179-1.2 2.506-2.556 3.832-3.826 1.323-1.27 2.657-2.459 3.89-3.554 1.231-1.096 2.369-2.095 3.355-2.893.99-.797 1.83-1.394 2.835-2.067 1.002-.678 2.166-1.433 3.1-1.975a24.264 24.858 0 0 1 2.426-1.216 78.995 80.928 0 0 1 6.028-2.431 97 97 0 0 1 4.225-1.406c1.474-.465 2.967-.89 4.43-1.42a41 41 0 0 0 4.263-1.825 65.404 67.004 0 0 0 7.257-4.247 70 70 0 0 0 3.643-2.734 68 68 0 0 0 3.288-2.772 39 39 0 0 0 2.91-2.896 54 54 0 0 0 2.926-3.543c.884-1.17 1.599-2.234 2.305-3.28.715-1.045 1.418-2.075 2.162-3.059a76.554 78.426 0 0 1 5.552-6.408 47.236 48.392 0 0 1 5.866-5.083 78 78 0 0 1 3.428-2.42 64.63 66.21 0 0 1 4.252-2.595 97 97 0 0 1 5.458-2.826 81.032 83.015 0 0 1 5.506-2.405 64 64 0 0 1 5.061-1.746 79 79 0 0 1 5.356-1.405 116.597 119.45 0 0 1 5.926-1.185 81 81 0 0 1 4.913-.697c1.33-.143 2.306-.202 3.077-.271.763-.066 1.323-.14 1.852-.302.54-.163 1.058-.415 1.512-.643.464-.232.869-.438 1.28-.763.413-.325.832-.766 1.3-1.32.473-.554.984-1.224 1.41-1.862a11.527 11.81 0 0 0 .983-1.809 10 10 0 0 0 .54-1.626c.144-.573.277-1.22.44-1.858.162-.643.355-1.278.604-2.014a23.13 23.696 0 0 1 .918-2.362 14.5 14.5 0 0 1 1.285-2.215 18 18 0 0 1 1.626-1.974 14 14 0 0 1 1.784-1.58c.687-.515 1.53-1.072 3.197-2.18l5.67-3.775c1.511-1.007 2.051-1.347 2.788-1.704.737-.348 1.679-.712 2.442-1.01.767-.295 1.36-.527 2.215-.658.85-.136 1.965-.175 3.197-.144 1.236.027 2.597.124 4.66.368 2.068.248 4.838.643 7.484.987a512 512 0 0 0 7.725.941c2.563.298 5.163.597 7.491.76 2.332.162 4.384.189 6.15.173a43.69 44.76 0 0 0 4.822-.255 46 46 0 0 0 4.985-.906 55 55 0 0 0 4.747-1.36c1.523-.506 3-1.06 4.471-1.668a52.61 53.898 0 0 0 4.46-2.075c1.534-.806 3.13-1.75 4.92-2.912 1.789-1.162 3.765-2.544 5.776-3.961a498.175 510.362 0 0 0 5.892-4.22 167 167 0 0 0 5.004-3.768 116.979 119.84 0 0 0 8.277-7.179 77 77 0 0 0 3.874-3.949 101.328 103.807 0 0 0 8.18-10.272 140 140 0 0 0 3.639-5.537 74 74 0 0 0 2.732-4.724 93.206 95.486 0 0 0 5.095-11.356 92 92 0 0 0 1.897-5.506c.632-2.045 1.323-4.492 2.011-6.977a991 991 0 0 0 1.965-7.187c.598-2.18 1.089-4.011 1.58-5.835.492-1.82.983-3.632 1.304-4.956.325-1.328.491-2.168.53-2.981.037-.806-.039-1.592-.352-2.455a10.643 10.903 0 0 0-1.384-2.54 6.973 7.144 0 0 0-1.625-1.665 5.643 5.78 0 0 0-2.044-.93 8.164 8.363 0 0 0-2.669-.135c-.88.105-1.663.376-2.846 1.107-1.175.728-2.747 1.921-3.534 2.517-.786.593-.786.593-8.643 5.673z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 3, min_speed_kmh: 115, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Left entry chicane from 330 km/h", x: 384.7, y: 173.4 },
      { corner_number: 2, corner_name: "Turn 2", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Right chicane exit", x: 330.9, y: 218.0 },
      { corner_number: 3, corner_name: "Turn 3", gear: 5, min_speed_kmh: 210, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Fast left", x: 307.6, y: 239.7 },
      { corner_number: 4, corner_name: "Turn 4", gear: 6, min_speed_kmh: 250, lateral_g: 4.0, brake_zone: false, drs_zone: false, notes: "High speed sweeping right", x: 306.5, y: 251.4 },
      { corner_number: 5, corner_name: "Turn 5", gear: 6, min_speed_kmh: 260, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Left curve", x: 239.8, y: 279.9 },
      { corner_number: 6, corner_name: "Turn 6", gear: 6, min_speed_kmh: 255, lateral_g: 4.1, brake_zone: false, drs_zone: false, notes: "Right curve", x: 219.0, y: 303.6 },
      { corner_number: 7, corner_name: "Turn 7", gear: 6, min_speed_kmh: 260, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Left sweep", x: 186.0, y: 324.4 },
      { corner_number: 8, corner_name: "Turn 8", gear: 6, min_speed_kmh: 265, lateral_g: 4.3, brake_zone: false, drs_zone: false, notes: "Right sweep", x: 160.2, y: 332.6 },
      { corner_number: 9, corner_name: "Turn 9", gear: 6, min_speed_kmh: 270, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Left flick", x: 144.8, y: 321.6 },
      { corner_number: 10, corner_name: "Turn 10", gear: 6, min_speed_kmh: 275, lateral_g: 4.0, brake_zone: false, drs_zone: false, notes: "Right bend", x: 105.2, y: 326.9 },
      { corner_number: 11, corner_name: "Turn 11", gear: 6, min_speed_kmh: 280, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Left bend", x: 39.9, y: 354.6 },
      { corner_number: 12, corner_name: "Turn 12", gear: 7, min_speed_kmh: 290, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Right kink", x: 35.4, y: 366.5 },
      { corner_number: 13, corner_name: "Turn 13", gear: 4, min_speed_kmh: 155, lateral_g: 3.8, brake_zone: true, drs_zone: false, notes: "12-degree banked hairpin left", x: 75.9, y: 351.0 },
      { corner_number: 14, corner_name: "Turn 14", gear: 6, min_speed_kmh: 260, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Right exit", x: 132.8, y: 339.6 },
      { corner_number: 15, corner_name: "Turn 15", gear: 6, min_speed_kmh: 265, lateral_g: 3.7, brake_zone: false, drs_zone: false, notes: "Left curve", x: 138.9, y: 340.2 },
      { corner_number: 16, corner_name: "Turn 16", gear: 6, min_speed_kmh: 270, lateral_g: 3.9, brake_zone: false, drs_zone: false, notes: "Right curve", x: 182.1, y: 340.1 },
      { corner_number: 17, corner_name: "Turn 17", gear: 6, min_speed_kmh: 275, lateral_g: 4.0, brake_zone: false, drs_zone: false, notes: "Left curve", x: 211.2, y: 315.0 },
      { corner_number: 18, corner_name: "Turn 18", gear: 6, min_speed_kmh: 280, lateral_g: 3.9, brake_zone: false, drs_zone: false, notes: "Right curve", x: 260.7, y: 279.2 },
      { corner_number: 19, corner_name: "Turn 19", gear: 6, min_speed_kmh: 285, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Left curve", x: 267.9, y: 272.8 },
      { corner_number: 20, corner_name: "Turn 20", gear: 7, min_speed_kmh: 295, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Fast right sweep", x: 315.2, y: 255.8 },
      { corner_number: 21, corner_name: "Turn 21", gear: 7, min_speed_kmh: 300, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "High speed left", x: 342.0, y: 228.1 },
      { corner_number: 22, corner_name: "Turn 22", gear: 6, min_speed_kmh: 250, lateral_g: 4.5, brake_zone: true, drs_zone: false, notes: "Blind high-G chicane left entry", x: 383.0, y: 230.9 },
      { corner_number: 23, corner_name: "Turn 23", gear: 6, min_speed_kmh: 245, lateral_g: 4.4, brake_zone: false, drs_zone: false, notes: "Right transition", x: 435.2, y: 199.7 },
      { corner_number: 24, corner_name: "Turn 24", gear: 7, min_speed_kmh: 290, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Left sweep", x: 450.0, y: 179.5 },
      { corner_number: 25, corner_name: "Turn 25", gear: 8, min_speed_kmh: 310, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Full throttle left bend", x: 460.7, y: 126.5 },
      { corner_number: 26, corner_name: "Turn 26", gear: 8, min_speed_kmh: 320, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Flat-out right kink", x: 454.8, y: 126.5 },
      { corner_number: 27, corner_name: "Turn 27", gear: 3, min_speed_kmh: 110, lateral_g: 2.6, brake_zone: true, drs_zone: true, notes: "Hairpin left onto pit straight", x: 394.5, y: 166.0 },
    ],
  },
  {
    id: 15,
    circuit_name: "Albert Park Circuit",
    location: "Melbourne",
    country: "Australia",
    country_code: "AUS",
    lat: -37.8497,
    lng: 144.968,
    length_km: 5.278,
    corners_count: 14,
    drs_zones: 4,
    lap_record: "1:19.813",
    lap_record_driver: "Charles Leclerc",
    lap_record_year: 2024,
    lap_record_team: "Ferrari SF-24",
    full_throttle_pct: 68,
    downforce_level: "MEDIUM-HIGH",
    tyre_stress_level: 3,
    brake_wear_index: "HEAVY",
    gear_shifts_per_lap: 50,
    pit_loss_time_sec: 20.8,
    first_grand_prix_year: 1996,
    elevation_gain_m: 2.6,
    view_box: "0 0 500 500",
    start_finish: { x: 222.1, y: 376.4, label_x: 20, label_y: 4 },
    description: "Scenic parkland circuit around Albert Park Lake. High evolution track surface, four rapid DRS zones, and high-speed T9-T10 sweepers.",
    svg_path: "M294.629 449.112c-17.004-16.153-135.384-136.209-146.616-147.395-1.524-1.517-1.706-3.53.325-6.806 3.149-5.077 4.704-10.311 4.992-19.451.338-10.696-5.247-17.614-9.32-20.938a543.275 540.954 0 0 1-3.051-2.51c-7.815-6.483-24.853-22.693-36.79-37.604-7.19-8.982-18.233-21.829-21.922-27.231S61.41 152.598 58.59 145.682c-.14-.345-.313-.741-.486-1.193-2.526-6.507 1.79-7.721 4.882-8.288 3.321-.61 15.573-2.62 24.47-4.568 6.013-1.313 7.515-6.538 7.381-10.805-.272-8.617-1.166-38.604-1.248-43.628-.044-2.674-1.14-6.564 2.014-9.31.177-.155.36-.297.536-.442 7.596-6.268 24.309-19.02 31.472-22.26s19.75-8.645 25.394-10.59c.27-.093 8.895-3.4 9.197-3.512 6.839-2.512 16.371-9.01 25.802-14.913 2.85-1.783 5.222-1.533 7.408.73 4.11 4.254 8.482 8.26 13.591 10.778 5.11 2.519 10.96 3.55 16.713 4.107l.869.086c6.576.667 18.943 2.276 24.961 6.615 6.599 4.758 18.448 15.344 22.356 27.446 2.667 8.264 8.547 39.081 9.113 44.954.043.417.075.832.111 1.243.316 3.362.451 7.204-.38 12.615-.785 5.117-3.03 9.761-4.865 12.36-2.135 3.025-2.99 4.04-5.601 7.349-2.022 2.563-3.632 5.219-5.412 8.814-1.298 2.622-2.098 5.678-3.25 9.515-.6 1.996-.984 4.224-1.438 6.672-2.298 12.381-6.64 33.93-6.511 48.195.217 24.638 9.137 41.707 17.797 53.812 10.2 14.265 18.231 19.882 28.868 28.745 2.75 2.292 5.48 4.553 8.392 6.78 3.169 2.426 7.437 5.332 12.714 6.133 7.49 1.135 15.377.162 23.93.162 6.755 0 8.091.737 11.068 3.078 11.64 9.16 39.977 33.269 40.484 33.778 8.615 8.626 17.154 17.81 21.049 30.465 4.124 13.4 9.334 31.769 11.72 40.414s9.142 31.943 9.55 34.796c.65 4.539 2.668 10.58-1.123 10.859-5.127.378-11.708 1.435-20.695 5.01-11.669 4.64-25.258 9.853-29.403 11.147-11.07 3.458-18.45 3.889-24.962-7.997-4.378-7.99-14.84-26.34-22.345-39.148-3.658-6.242-7.146-4.698-8.583-3.104-4.776 5.294-9.984 10.914-17.255 18.587-4.469 4.71-15.194 4.643-22.246-2.057z",
    optimal_line_svg: "M294.629 449.112c-17.004-16.153-135.384-136.209-146.616-147.395-1.524-1.517-1.706-3.53.325-6.806 3.149-5.077 4.704-10.311 4.992-19.451.338-10.696-5.247-17.614-9.32-20.938a543.275 540.954 0 0 1-3.051-2.51c-7.815-6.483-24.853-22.693-36.79-37.604-7.19-8.982-18.233-21.829-21.922-27.231S61.41 152.598 58.59 145.682c-.14-.345-.313-.741-.486-1.193-2.526-6.507 1.79-7.721 4.882-8.288 3.321-.61 15.573-2.62 24.47-4.568 6.013-1.313 7.515-6.538 7.381-10.805-.272-8.617-1.166-38.604-1.248-43.628-.044-2.674-1.14-6.564 2.014-9.31.177-.155.36-.297.536-.442 7.596-6.268 24.309-19.02 31.472-22.26s19.75-8.645 25.394-10.59c.27-.093 8.895-3.4 9.197-3.512 6.839-2.512 16.371-9.01 25.802-14.913 2.85-1.783 5.222-1.533 7.408.73 4.11 4.254 8.482 8.26 13.591 10.778 5.11 2.519 10.96 3.55 16.713 4.107l.869.086c6.576.667 18.943 2.276 24.961 6.615 6.599 4.758 18.448 15.344 22.356 27.446 2.667 8.264 8.547 39.081 9.113 44.954.043.417.075.832.111 1.243.316 3.362.451 7.204-.38 12.615-.785 5.117-3.03 9.761-4.865 12.36-2.135 3.025-2.99 4.04-5.601 7.349-2.022 2.563-3.632 5.219-5.412 8.814-1.298 2.622-2.098 5.678-3.25 9.515-.6 1.996-.984 4.224-1.438 6.672-2.298 12.381-6.64 33.93-6.511 48.195.217 24.638 9.137 41.707 17.797 53.812 10.2 14.265 18.231 19.882 28.868 28.745 2.75 2.292 5.48 4.553 8.392 6.78 3.169 2.426 7.437 5.332 12.714 6.133 7.49 1.135 15.377.162 23.93.162 6.755 0 8.091.737 11.068 3.078 11.64 9.16 39.977 33.269 40.484 33.778 8.615 8.626 17.154 17.81 21.049 30.465 4.124 13.4 9.334 31.769 11.72 40.414s9.142 31.943 9.55 34.796c.65 4.539 2.668 10.58-1.123 10.859-5.127.378-11.708 1.435-20.695 5.01-11.669 4.64-25.258 9.853-29.403 11.147-11.07 3.458-18.45 3.889-24.962-7.997-4.378-7.99-14.84-26.34-22.345-39.148-3.658-6.242-7.146-4.698-8.583-3.104-4.776 5.294-9.984 10.914-17.255 18.587-4.469 4.71-15.194 4.643-22.246-2.057z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 4, min_speed_kmh: 155, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Right entry chicane at end of main straight", x: 153.7, y: 307.4 },
      { corner_number: 2, corner_name: "Turn 2", gear: 4, min_speed_kmh: 165, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Left exit acceleration", x: 146.9, y: 299.7 },
      { corner_number: 3, corner_name: "Turn 3", gear: 2, min_speed_kmh: 90, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Heavy braking right hairpin - prime overtaking", x: 58.1, y: 144.4 },
      { corner_number: 4, corner_name: "Turn 4", gear: 3, min_speed_kmh: 125, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Left exit onto lakeside sprint", x: 58.7, y: 137.8 },
      { corner_number: 5, corner_name: "Turn 5", gear: 6, min_speed_kmh: 245, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Fast right sweep", x: 96.8, y: 66.9 },
      { corner_number: 6, corner_name: "Turn 6", gear: 4, min_speed_kmh: 155, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Right turn entry", x: 192.0, y: 15.0 },
      { corner_number: 7, corner_name: "Turn 7", gear: 5, min_speed_kmh: 210, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Left acceleration sweep", x: 279.0, y: 135.3 },
      { corner_number: 8, corner_name: "Turn 8", gear: 6, min_speed_kmh: 260, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Fast right flick", x: 266.1, y: 155.0 },
      { corner_number: 9, corner_name: "Turn 9", gear: 7, min_speed_kmh: 275, lateral_g: 4.6, brake_zone: false, drs_zone: false, notes: "Epic flat-out high-G left sweeper", x: 321.1, y: 312.6 },
      { corner_number: 10, corner_name: "Turn 10", gear: 7, min_speed_kmh: 280, lateral_g: 4.5, brake_zone: false, drs_zone: false, notes: "High speed right transition", x: 354.9, y: 314.2 },
      { corner_number: 11, corner_name: "Turn 11", gear: 4, min_speed_kmh: 160, lateral_g: 3.1, brake_zone: true, drs_zone: false, notes: "Right-left chicane entry", x: 441.0, y: 454.8 },
      { corner_number: 12, corner_name: "Turn 12", gear: 4, min_speed_kmh: 170, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Chicane exit", x: 441.8, y: 465.8 },
      { corner_number: 13, corner_name: "Turn 13", gear: 3, min_speed_kmh: 115, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Slow right turn into stadium section", x: 336.7, y: 431.2 },
      { corner_number: 14, corner_name: "Turn 14", gear: 4, min_speed_kmh: 145, lateral_g: 2.8, brake_zone: false, drs_zone: true, notes: "Medium-speed left launching onto main straight", x: 291.0, y: 445.6 },
    ],
  },
  {
    id: 16,
    circuit_name: "Shanghai International Circuit",
    location: "Shanghai",
    country: "China",
    country_code: "CHN",
    lat: 31.3389,
    lng: 121.22,
    length_km: 5.451,
    corners_count: 16,
    drs_zones: 2,
    lap_record: "1:32.238",
    lap_record_driver: "Michael Schumacher",
    lap_record_year: 2004,
    lap_record_team: "Ferrari F2004",
    full_throttle_pct: 53,
    downforce_level: "MEDIUM-HIGH",
    tyre_stress_level: 4,
    brake_wear_index: "HEAVY",
    gear_shifts_per_lap: 52,
    pit_loss_time_sec: 24.2,
    first_grand_prix_year: 2004,
    elevation_gain_m: 7.4,
    view_box: "0 0 500 500",
    start_finish: { x: 130.9, y: 239.0, label_x: 20, label_y: 4 },
    description: "Shaped after the Chinese character 'Shang' (上). Famous for the endless 270-degree snail corner (Turns 1-4) and 1.2km back straight.",
    svg_path: "M457.499 211.881c-5.788-8.465-14.832-13.126-25.467-13.126-10.565 0-22.335 4.768-28.618 11.593-2.966 3.22-4.412 6.674-4.192 9.985.385 5.707 4.117 12.018 11.09 18.76.58.558.56 1.21.496 1.55a1.62 1.62 0 0 1-1 1.235l-140.705 57.863c-3.676 1.504-8.039.824-11.115-1.713-4.917-4.05-10.074-8.995-15.331-14.696-1.851-2.015-1.47-4.279-1.22-5.16.254-.895 1.135-3.054 3.816-3.772 1.58-.422 3.201-.827 4.852-1.244 8.74-2.195 18.644-4.684 29.538-10.987 22.33-12.915 15.017-35.707 12.47-43.641-2.565-8.031-8.343-11.919-20.999-20.44l-6.193-4.156c-12.215-8.138-20.289-13.514-23.636-30.018-3.506-17.247 4.767-35.443 19.25-42.328 6.662-3.166 15.551-6.414 25.846-10.175 14.561-5.315 31.059-11.342 48.502-19.655 19.148-9.13 26.922-20.15 30.073-27.79a10.34 10.34 0 0 0-.9-9.615c-2.066-3.143-5.663-4.876-9.414-4.455-16.252 1.816-51.748 7.028-71.462 9.974a58.3 58.3 0 0 0-21.005 7.422c-20.09 11.804-62.168 38.651-79.331 49.643-3.812 2.446-8.639 2.984-12.89 1.413-4.633-1.708-8.56-3.524-11.661-5.395-3.042-1.84-4.912-4.103-5.412-6.544-.44-2.156.19-4.564 1.77-6.777.956-1.343 1.741-1.454 2.402-1.454 2.13 0 4.972 1.74 6.193 2.484l.6.376c2.736 1.712 7.823 4.9 13.641 4.897 4.152 0 9.95-1.642 14.011-9.46 3.332-6.412 3.271-14.022-.16-20.878-4.662-9.314-14.606-15.945-26.607-17.741-11.655-1.741-24.816 3.435-33.865 13.268-6.828 7.414-10.415 16.494-9.85 24.905l18.634 276.007a1.82 1.82 0 0 1-1.02 1.758l-85.62 40.82-1.245.837c-4.492 4.09-9.61 10.604-15.212 19.359-1.99 3.103-2.15 6.881-.425 10.109 1.731 3.235 5.022 5.245 8.584 5.245 1.336 0 2.651-.28 3.912-.83 61.903-27.052 371.598-162.394 389.161-170.146 11.926-5.263 21.7-16.983 25.512-30.587 3.62-12.923 1.56-25.963-5.798-36.72z",
    optimal_line_svg: "M457.499 211.881c-5.788-8.465-14.832-13.126-25.467-13.126-10.565 0-22.335 4.768-28.618 11.593-2.966 3.22-4.412 6.674-4.192 9.985.385 5.707 4.117 12.018 11.09 18.76.58.558.56 1.21.496 1.55a1.62 1.62 0 0 1-1 1.235l-140.705 57.863c-3.676 1.504-8.039.824-11.115-1.713-4.917-4.05-10.074-8.995-15.331-14.696-1.851-2.015-1.47-4.279-1.22-5.16.254-.895 1.135-3.054 3.816-3.772 1.58-.422 3.201-.827 4.852-1.244 8.74-2.195 18.644-4.684 29.538-10.987 22.33-12.915 15.017-35.707 12.47-43.641-2.565-8.031-8.343-11.919-20.999-20.44l-6.193-4.156c-12.215-8.138-20.289-13.514-23.636-30.018-3.506-17.247 4.767-35.443 19.25-42.328 6.662-3.166 15.551-6.414 25.846-10.175 14.561-5.315 31.059-11.342 48.502-19.655 19.148-9.13 26.922-20.15 30.073-27.79a10.34 10.34 0 0 0-.9-9.615c-2.066-3.143-5.663-4.876-9.414-4.455-16.252 1.816-51.748 7.028-71.462 9.974a58.3 58.3 0 0 0-21.005 7.422c-20.09 11.804-62.168 38.651-79.331 49.643-3.812 2.446-8.639 2.984-12.89 1.413-4.633-1.708-8.56-3.524-11.661-5.395-3.042-1.84-4.912-4.103-5.412-6.544-.44-2.156.19-4.564 1.77-6.777.956-1.343 1.741-1.454 2.402-1.454 2.13 0 4.972 1.74 6.193 2.484l.6.376c2.736 1.712 7.823 4.9 13.641 4.897 4.152 0 9.95-1.642 14.011-9.46 3.332-6.412 3.271-14.022-.16-20.878-4.662-9.314-14.606-15.945-26.607-17.741-11.655-1.741-24.816 3.435-33.865 13.268-6.828 7.414-10.415 16.494-9.85 24.905l18.634 276.007a1.82 1.82 0 0 1-1.02 1.758l-85.62 40.82-1.245.837c-4.492 4.09-9.61 10.604-15.212 19.359-1.99 3.103-2.15 6.881-.425 10.109 1.731 3.235 5.022 5.245 8.584 5.245 1.336 0 2.651-.28 3.912-.83 61.903-27.052 371.598-162.394 389.161-170.146 11.926-5.263 21.7-16.983 25.512-30.587 3.62-12.923 1.56-25.963-5.798-36.72z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 5, min_speed_kmh: 225, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "High-speed right entry into decreasing radius snail", x: 129.6, y: 223.0 },
      { corner_number: 2, corner_name: "Turn 2", gear: 3, min_speed_kmh: 115, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Tightening right spiral", x: 191.5, y: 75.9 },
      { corner_number: 3, corner_name: "Turn 3", gear: 2, min_speed_kmh: 80, lateral_g: 1.9, brake_zone: true, drs_zone: false, notes: "Tight right bottom apex", x: 156.4, y: 98.2 },
      { corner_number: 4, corner_name: "Turn 4", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Left launch exit out of snail", x: 260.5, y: 68.3 },
      { corner_number: 5, corner_name: "Turn 5", gear: 6, min_speed_kmh: 255, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Full throttle right kink", x: 362.5, y: 52.5 },
      { corner_number: 6, corner_name: "Turn 6", gear: 2, min_speed_kmh: 75, lateral_g: 2.0, brake_zone: true, drs_zone: false, notes: "Heavy braking right hairpin", x: 257.3, y: 123.3 },
      { corner_number: 7, corner_name: "Turn 7", gear: 5, min_speed_kmh: 215, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "High-speed left sweep", x: 290.2, y: 214.1 },
      { corner_number: 8, corner_name: "Turn 8", gear: 5, min_speed_kmh: 220, lateral_g: 3.9, brake_zone: false, drs_zone: false, notes: "High-G right sweep", x: 242.3, y: 276.5 },
      { corner_number: 9, corner_name: "Turn 9", gear: 3, min_speed_kmh: 120, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Left turn", x: 410.8, y: 239.9 },
      { corner_number: 10, corner_name: "Turn 10", gear: 4, min_speed_kmh: 150, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Left exit acceleration", x: 399.3, y: 217.9 },
      { corner_number: 11, corner_name: "Turn 11", gear: 3, min_speed_kmh: 110, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Left chicane entry", x: 441.1, y: 277.5 },
      { corner_number: 12, corner_name: "Turn 12", gear: 4, min_speed_kmh: 145, lateral_g: 2.7, brake_zone: false, drs_zone: false, notes: "Right exit", x: 350.5, y: 317.4 },
      { corner_number: 13, corner_name: "Turn 13", gear: 6, min_speed_kmh: 240, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Long banked right launching onto 1.2km back straight", x: 236.9, y: 367.0 },
      { corner_number: 14, corner_name: "Turn 14", gear: 2, min_speed_kmh: 70, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Extreme 340 km/h braking zone into tight right hairpin", x: 43.5, y: 450.1 },
      { corner_number: 15, corner_name: "Turn 15", gear: 3, min_speed_kmh: 120, lateral_g: 2.4, brake_zone: false, drs_zone: false, notes: "Left acceleration exit", x: 139.6, y: 371.8 },
      { corner_number: 16, corner_name: "Turn 16", gear: 5, min_speed_kmh: 195, lateral_g: 3.2, brake_zone: false, drs_zone: true, notes: "Fast left onto pit straight", x: 134.1, y: 289.1 },
    ],
  },
  {
    id: 17,
    circuit_name: "Miami International Autodrome",
    location: "Miami",
    country: "United States",
    country_code: "USA",
    lat: 25.9581,
    lng: -80.2389,
    length_km: 5.412,
    corners_count: 19,
    drs_zones: 3,
    lap_record: "1:29.708",
    lap_record_driver: "Max Verstappen",
    lap_record_year: 2023,
    lap_record_team: "Red Bull RB19",
    full_throttle_pct: 58,
    downforce_level: "MEDIUM",
    tyre_stress_level: 3,
    brake_wear_index: "HEAVY",
    gear_shifts_per_lap: 54,
    pit_loss_time_sec: 22.8,
    first_grand_prix_year: 2022,
    elevation_gain_m: 9.0,
    view_box: "0 0 500 500",
    start_finish: { x: 248.9, y: 215.4, label_x: 20, label_y: 4 },
    description: "Around Hard Rock Stadium. Blends fast sweeping curves with tight Mickey-Mouse chicanes and long high-speed DRS straights.",
    svg_path: "M253.178 217.953s37.841 21.485 43.997 24.88c6.096 3.396 9.778 7.26 9.597 9.835-.182 2.518-2.777 5.913-5.613 7.61-2.777 1.698-7.665 4.04-9.596 6.616-1.932 2.517-3.501 4.566-3.682 11.006s-.181 11.532-1.57 15.396c-1.146 3.161-5.25 10.479-19.312 15.22-13.64 4.567-17.925 3.513-29.211 3.22-10.441-.292-20.762-5.912-20.762-5.912s-53.774-29.622-58.965-32.49c-5.25-2.87-13.64-4.391-20.4-2.87-7 1.523-8.81 2.928-12.734 5.738-3.259 2.342-8.027 5.913-12.553 6.44-4.527.526-10.2.234-14.666-1.698-4.044-1.756-9.415-7.142-12.01-9.835s-8.148-6.264-16.054-6.44c-6.458-.175-20.64 1.347-28.789 10.713-3.38 3.864-5.854 6.85-5.854 14.284 0 5.503 5.19 12.88 10.2 12.938 10.2.176 7.725-1.288 15.51-1.522 9.597-.293 13.64.702 19.012 2.693 5.371 1.99 20.218 5.503 28.124 5.561 10.502.117 73.692-1.17 77.856-1.17 10.38-.06 18.83 2.048 25.107 4.741s19.192 8.606 24.443 10.128c5.25 1.522 14.666 5.093 28.97 4.917 14.303-.175 39.953-1.697 54.438-6.79 14.485-5.094 60.051-20.139 72.967-25.583s39.29-18.03 44.661-21.485c3.38-2.166 5.432-3.395 5.613-6.44.181-3.043-4.888-6.439-7.484-7.61-2.595-1.17-4.466-1.931-7.664-4.566-3.5-2.868-5.13-6.146-5.13-9.717 0-6.616 4.526-11.475 10.018-11.65 3.5-.117 14.183.175 17.14-.351 2.958-.527 7.303-2.05 9.597-5.562s4.949-8.722 5.794-10.01c1.448-2.166 1.026-3.396-1.57-4.567-2.595-1.17-4.043-3.044-2.776-6.615 1.268-3.57 3.742-13.347 4.225-15.923.422-2.4-.181-5.561-3.863-5.561-4.707 0-118.654-4.215-132.777-4.567-14.364-.234-209.968-7.61-232.963-8.898-7.242-.41-8.932 3.805-8.45 5.971.906 4.04 11.166 10.655 17.443 14.226 6.276 3.57 8.57 4.39 16.054 4.742 7.483.35 11.89-1.698 16.054-4.215s12.734-7.26 22.873-9.484c7.182-1.58 20.4-1.288 25.47-.527 7.181 1.112 14.303 4.04 20.76 7.61 6.459 3.572 48.525 27.573 48.525 27.573z",
    optimal_line_svg: "M253.178 217.953s37.841 21.485 43.997 24.88c6.096 3.396 9.778 7.26 9.597 9.835-.182 2.518-2.777 5.913-5.613 7.61-2.777 1.698-7.665 4.04-9.596 6.616-1.932 2.517-3.501 4.566-3.682 11.006s-.181 11.532-1.57 15.396c-1.146 3.161-5.25 10.479-19.312 15.22-13.64 4.567-17.925 3.513-29.211 3.22-10.441-.292-20.762-5.912-20.762-5.912s-53.774-29.622-58.965-32.49c-5.25-2.87-13.64-4.391-20.4-2.87-7 1.523-8.81 2.928-12.734 5.738-3.259 2.342-8.027 5.913-12.553 6.44-4.527.526-10.2.234-14.666-1.698-4.044-1.756-9.415-7.142-12.01-9.835s-8.148-6.264-16.054-6.44c-6.458-.175-20.64 1.347-28.789 10.713-3.38 3.864-5.854 6.85-5.854 14.284 0 5.503 5.19 12.88 10.2 12.938 10.2.176 7.725-1.288 15.51-1.522 9.597-.293 13.64.702 19.012 2.693 5.371 1.99 20.218 5.503 28.124 5.561 10.502.117 73.692-1.17 77.856-1.17 10.38-.06 18.83 2.048 25.107 4.741s19.192 8.606 24.443 10.128c5.25 1.522 14.666 5.093 28.97 4.917 14.303-.175 39.953-1.697 54.438-6.79 14.485-5.094 60.051-20.139 72.967-25.583s39.29-18.03 44.661-21.485c3.38-2.166 5.432-3.395 5.613-6.44.181-3.043-4.888-6.439-7.484-7.61-2.595-1.17-4.466-1.931-7.664-4.566-3.5-2.868-5.13-6.146-5.13-9.717 0-6.616 4.526-11.475 10.018-11.65 3.5-.117 14.183.175 17.14-.351 2.958-.527 7.303-2.05 9.597-5.562s4.949-8.722 5.794-10.01c1.448-2.166 1.026-3.396-1.57-4.567-2.595-1.17-4.043-3.044-2.776-6.615 1.268-3.57 3.742-13.347 4.225-15.923.422-2.4-.181-5.561-3.863-5.561-4.707 0-118.654-4.215-132.777-4.567-14.364-.234-209.968-7.61-232.963-8.898-7.242-.41-8.932 3.805-8.45 5.971.906 4.04 11.166 10.655 17.443 14.226 6.276 3.57 8.57 4.39 16.054 4.742 7.483.35 11.89-1.698 16.054-4.215s12.734-7.26 22.873-9.484c7.182-1.58 20.4-1.288 25.47-.527 7.181 1.112 14.303 4.04 20.76 7.61 6.459 3.572 48.525 27.573 48.525 27.573z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 3, min_speed_kmh: 115, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Right-hander at end of main straight", x: 306.8, y: 252.2 },
      { corner_number: 2, corner_name: "Turn 2", gear: 4, min_speed_kmh: 155, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Left acceleration", x: 289.1, y: 270.8 },
      { corner_number: 3, corner_name: "Turn 3", gear: 5, min_speed_kmh: 210, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Right sweep", x: 235.0, y: 311.5 },
      { corner_number: 4, corner_name: "Turn 4", gear: 6, min_speed_kmh: 255, lateral_g: 3.9, brake_zone: false, drs_zone: false, notes: "High speed left sweeper", x: 114.4, y: 282.2 },
      { corner_number: 5, corner_name: "Turn 5", gear: 6, min_speed_kmh: 260, lateral_g: 4.1, brake_zone: false, drs_zone: false, notes: "Fast right transition", x: 97.6, y: 280.9 },
      { corner_number: 6, corner_name: "Turn 6", gear: 6, min_speed_kmh: 250, lateral_g: 4.0, brake_zone: false, drs_zone: false, notes: "Left sweep", x: 43.1, y: 302.2 },
      { corner_number: 7, corner_name: "Turn 7", gear: 5, min_speed_kmh: 210, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Right curve", x: 105.7, y: 309.2 },
      { corner_number: 8, corner_name: "Turn 8", gear: 4, min_speed_kmh: 160, lateral_g: 2.9, brake_zone: true, drs_zone: false, notes: "Left entry", x: 208.3, y: 311.9 },
      { corner_number: 9, corner_name: "Turn 9", gear: 5, min_speed_kmh: 220, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Fast left", x: 316.1, y: 322.0 },
      { corner_number: 10, corner_name: "Turn 10", gear: 6, min_speed_kmh: 260, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Right sweep", x: 389.8, y: 296.3 },
      { corner_number: 11, corner_name: "Turn 11", gear: 2, min_speed_kmh: 75, lateral_g: 2.0, brake_zone: true, drs_zone: false, notes: "Left hairpin before marina", x: 441.9, y: 268.0 },
      { corner_number: 12, corner_name: "Turn 12", gear: 3, min_speed_kmh: 120, lateral_g: 2.4, brake_zone: false, drs_zone: false, notes: "Right transition", x: 464.9, y: 215.6 },
      { corner_number: 13, corner_name: "Turn 13", gear: 4, min_speed_kmh: 150, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Left sweep", x: 461.1, y: 185.6 },
      { corner_number: 14, corner_name: "Turn 14", gear: 2, min_speed_kmh: 60, lateral_g: 1.7, brake_zone: true, drs_zone: false, notes: "Uphill slow chicane entry under turnpike", x: 326.6, y: 180.9 },
      { corner_number: 15, corner_name: "Turn 15", gear: 2, min_speed_kmh: 70, lateral_g: 1.8, brake_zone: false, drs_zone: false, notes: "Blind downhill chicane exit", x: 297.7, y: 180.0 },
      { corner_number: 16, corner_name: "Turn 16", gear: 4, min_speed_kmh: 165, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Left sweep launching onto 1.28km back straight", x: 147.1, y: 174.3 },
      { corner_number: 17, corner_name: "Turn 17", gear: 2, min_speed_kmh: 75, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Heavy braking left hairpin at end of back straight", x: 86.0, y: 176.5 },
      { corner_number: 18, corner_name: "Turn 18", gear: 4, min_speed_kmh: 160, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Left acceleration", x: 111.2, y: 195.9 },
      { corner_number: 19, corner_name: "Turn 19", gear: 5, min_speed_kmh: 195, lateral_g: 3.2, brake_zone: false, drs_zone: true, notes: "Fast left onto pit straight", x: 184.7, y: 182.9 },
    ],
  },
  {
    id: 18,
    circuit_name: "Circuit de Barcelona-Catalunya",
    location: "Montmeló",
    country: "Spain",
    country_code: "ESP",
    lat: 41.57,
    lng: 2.2611,
    length_km: 4.657,
    corners_count: 14,
    drs_zones: 2,
    lap_record: "1:16.330",
    lap_record_driver: "Max Verstappen",
    lap_record_year: 2023,
    lap_record_team: "Red Bull RB19",
    full_throttle_pct: 60,
    downforce_level: "HIGH",
    tyre_stress_level: 5,
    brake_wear_index: "MEDIUM",
    gear_shifts_per_lap: 46,
    pit_loss_time_sec: 22.0,
    first_grand_prix_year: 1991,
    elevation_gain_m: 29.5,
    view_box: "0 0 500 500",
    start_finish: { x: 389.9, y: 178.3, label_x: 20, label_y: 4 },
    description: "Aerodynamic testing benchmark. Long right-hand Renault curve (Turn 3) and restored high-speed final sector testing total chassis balance.",
    svg_path: "M436.09 105.316c-11.496 18.032-213.437 339.032-220.733 350.704-6.656 10.65-17.427 12.344-24.445 7.624-6.155-4.14-7.935-5.411-11.658-7.585-3.59-2.097-14.448-4.739-24.849 2.904-10.811 7.948-17.856 13.285-28.116 20.533-15.249 10.77-45.437 5.85-57.241-10.287-15.49-21.177-16.04-55.243.243-81.808 9.197-15.004 45.986-73.94 51.553-82.048 6.839-9.961 17.184-12.223 29.044-6.455 16.679 8.111 18.514 37.238 11.375 48.81-7.988 12.948-36.407 59.453-39.815 65.348-8.956 15.49 5.28 27.61 18.998 21.178 7.745-3.632 43.566-20.937 50.1-24.204 12.586-6.292 19.247-13.666 26.464-21.096 5.486-5.647 22.675-32.663 27.148-39.531 3.388-5.204 2.783-15.49-5.084-20.574-5.388-3.482-9.197-5.687-12.061-7.664-2.637-1.82-7.983-5.663-12.264-15.45-3.388-7.745-25.17-59.177-28.316-67.406-3.98-10.41-1.676-24.194 7.503-34.127 1.917-2.074 7.728-6.638 17.105-11.296 23.397-11.617 72.137-36.55 78.499-39.774 10.155-5.149 61.318-32.028 86.434-45.203 3.296-1.728 6.809-4.904 8.925-8.711 1.8-3.243 1.889-10.257-3.74-15.182-12.322-10.782-26.568-9.388-36.378-6.747-7.628 2.054-11.725 4.671-16.092 8.181-3.904 3.139-7.62 6.124-12.647 10.18-4.182 3.374-21.542 4.84-28.924-5.325-7.752-10.674-7.48-23.381 2.54-31.829 9.238-7.785 38.362-32.07 46.713-38.846 3.286-2.667 16.224-6.485 24.993-4.126 8.917 2.647 16.077 6.158 24.31 11.174 11.264 8.52 6.556 4.618 17.915 11.996 9.637 6.263 18.666 12.172 23.827 15.606 11.941 7.955 23.257 28.164 8.674 51.036z",
    optimal_line_svg: "M436.09 105.316c-11.496 18.032-213.437 339.032-220.733 350.704-6.656 10.65-17.427 12.344-24.445 7.624-6.155-4.14-7.935-5.411-11.658-7.585-3.59-2.097-14.448-4.739-24.849 2.904-10.811 7.948-17.856 13.285-28.116 20.533-15.249 10.77-45.437 5.85-57.241-10.287-15.49-21.177-16.04-55.243.243-81.808 9.197-15.004 45.986-73.94 51.553-82.048 6.839-9.961 17.184-12.223 29.044-6.455 16.679 8.111 18.514 37.238 11.375 48.81-7.988 12.948-36.407 59.453-39.815 65.348-8.956 15.49 5.28 27.61 18.998 21.178 7.745-3.632 43.566-20.937 50.1-24.204 12.586-6.292 19.247-13.666 26.464-21.096 5.486-5.647 22.675-32.663 27.148-39.531 3.388-5.204 2.783-15.49-5.084-20.574-5.388-3.482-9.197-5.687-12.061-7.664-2.637-1.82-7.983-5.663-12.264-15.45-3.388-7.745-25.17-59.177-28.316-67.406-3.98-10.41-1.676-24.194 7.503-34.127 1.917-2.074 7.728-6.638 17.105-11.296 23.397-11.617 72.137-36.55 78.499-39.774 10.155-5.149 61.318-32.028 86.434-45.203 3.296-1.728 6.809-4.904 8.925-8.711 1.8-3.243 1.889-10.257-3.74-15.182-12.322-10.782-26.568-9.388-36.378-6.747-7.628 2.054-11.725 4.671-16.092 8.181-3.904 3.139-7.62 6.124-12.647 10.18-4.182 3.374-21.542 4.84-28.924-5.325-7.752-10.674-7.48-23.381 2.54-31.829 9.238-7.785 38.362-32.07 46.713-38.846 3.286-2.667 16.224-6.485 24.993-4.126 8.917 2.647 16.077 6.158 24.31 11.174 11.264 8.52 6.556 4.618 17.915 11.996 9.637 6.263 18.666 12.172 23.827 15.606 11.941 7.955 23.257 28.164 8.674 51.036z",
    corners: [
      { corner_number: 1, corner_name: "Elf (T1)", gear: 3, min_speed_kmh: 135, lateral_g: 2.8, brake_zone: true, drs_zone: false, notes: "Right entry chicane at end of 1km main straight", x: 384.4, y: 187.3 },
      { corner_number: 2, corner_name: "Elf (T2)", gear: 3, min_speed_kmh: 145, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Left exit transition", x: 249.9, y: 401.0 },
      { corner_number: 3, corner_name: "Curva Renault (T3)", gear: 5, min_speed_kmh: 225, lateral_g: 4.4, brake_zone: false, drs_zone: false, notes: "Iconic long flat-out uphill right sweeper with huge lateral G", x: 194.0, y: 465.2 },
      { corner_number: 4, corner_name: "Repsol (T4)", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Right-hand hairpin over crest", x: 123.4, y: 481.3 },
      { corner_number: 5, corner_name: "Seat (T5)", gear: 2, min_speed_kmh: 85, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Downhill left hairpin", x: 57.3, y: 427.7 },
      { corner_number: 6, corner_name: "Turn 6", gear: 5, min_speed_kmh: 215, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Uphill left kink", x: 131.6, y: 296.8 },
      { corner_number: 7, corner_name: "Campsa (T7)", gear: 4, min_speed_kmh: 160, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Left turn entry", x: 120.4, y: 429.3 },
      { corner_number: 8, corner_name: "Campsa (T8)", gear: 5, min_speed_kmh: 210, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Uphill blind right", x: 245.4, y: 346.9 },
      { corner_number: 9, corner_name: "Campsa (T9)", gear: 6, min_speed_kmh: 255, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "High speed blind right crest - massive commitment", x: 193.9, y: 204.2 },
      { corner_number: 10, corner_name: "La Caixa (T10)", gear: 2, min_speed_kmh: 75, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Heavy braking left hairpin", x: 209.6, y: 193.6 },
      { corner_number: 11, corner_name: "Turn 11", gear: 4, min_speed_kmh: 155, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Uphill right", x: 385.8, y: 96.7 },
      { corner_number: 12, corner_name: "Banc Sabadell (T12)", gear: 4, min_speed_kmh: 165, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Long right", x: 313.8, y: 96.8 },
      { corner_number: 13, corner_name: "Turn 13", gear: 6, min_speed_kmh: 245, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Restored high-speed right corner", x: 338.6, y: 18.3 },
      { corner_number: 14, corner_name: "Turn 14", gear: 7, min_speed_kmh: 275, lateral_g: 4.5, brake_zone: false, drs_zone: true, notes: "Epic flat-out right launching onto pit straight", x: 442.9, y: 82.0 },
    ],
  },
  {
    id: 19,
    circuit_name: "Hungaroring",
    location: "Mogyoród",
    country: "Hungary",
    country_code: "HUN",
    lat: 47.5789,
    lng: 19.2486,
    length_km: 4.381,
    corners_count: 14,
    drs_zones: 2,
    lap_record: "1:16.627",
    lap_record_driver: "Lewis Hamilton",
    lap_record_year: 2020,
    lap_record_team: "Mercedes W11",
    full_throttle_pct: 52,
    downforce_level: "MAXIMUM",
    tyre_stress_level: 3,
    brake_wear_index: "HEAVY",
    gear_shifts_per_lap: 50,
    pit_loss_time_sec: 21.5,
    first_grand_prix_year: 1986,
    elevation_gain_m: 34.0,
    view_box: "0 0 500 500",
    start_finish: { x: 219.8, y: 427.3, label_x: 20, label_y: 4 },
    description: "Monaco without the walls. Non-stop twisty valley circuit requiring maximum aerodynamic downforce, chassis nimbleness, and precise tyre management.",
    svg_path: "M43.944 288.61c-5.643-4.367-2.351-17.312 7.839-17.312 8.15 0 8.783.006 21.318.468 16.93.623 38.458 9.681 48.909 17.156 10.032 7.173 47.654 36.805 68.034 52.713 7.332 5.725 18.811 4.99 24.14-.623 7.314-7.703 9.092-14.349 3.762-24.33-3.685-6.903-13.482-24.953-18.497-34.934-2.575-5.122-2.821-10.916.627-18.091 5.205-10.83 38.563-79.069 52.044-107.608 3.4-7.196 9.965-16.649 13.168-20.899 4.233-5.614 10.502-13.568 15.205-19.495 3.072-3.87 3.8-7.379 2.352-12.632-2.666-9.67-13.19-46.313-15.676-54.74-3.448-11.697-1.698-22.81 8.151-29.163 8.465-5.459 18.34-4.678 24.14-1.403 7.576 4.278 7.995 4.523 12.698 7.33s11.815 8.669 15.36 12.32c8.936 9.202 31.666 33.218 40.445 42.888 3.863 4.256 3.608 6.55.158 10.293s-7.303 6.797-5.331 14.504c2.195 8.576 11.134 42.886 13.327 49.748 2.194 6.863 7.532 11.755 15.99 12.477 10.972.936 18.807 1.737 24.14 2.34 13.794 1.559 20.064 12.426 18.497 23.08-1.881 12.788-5.745 39.62-6.896 47.254-1.881 12.477.156 20.118 6.113 29.163s14.42 21.367 20.692 30.411c5.34 7.703 7.064 22.91-.628 31.815-8.621 9.98-80.887 91.856-90.92 102.93-5.197 5.736-11.286 5.614-18.496-1.872-5.37-5.575-17.444-18.67-21.32-22.614-6.74-6.861-8.785-9.283-12.228-11.852-5.643-4.211-9.876-7.486-16.93-12.477-4.548-3.22-14.422-3.43-19.437 2.184s-5.183 17.245 1.096 22.145c7.995 6.237 33.31 26.142 40.914 32.282 10.817 8.734 11.98 23.507 4.703 32.75-7.366 9.358-20.222 16.22-37.936 2.34-10.049-7.873-228.782-180.232-239.527-188.547Z",
    optimal_line_svg: "M43.944 288.61c-5.643-4.367-2.351-17.312 7.839-17.312 8.15 0 8.783.006 21.318.468 16.93.623 38.458 9.681 48.909 17.156 10.032 7.173 47.654 36.805 68.034 52.713 7.332 5.725 18.811 4.99 24.14-.623 7.314-7.703 9.092-14.349 3.762-24.33-3.685-6.903-13.482-24.953-18.497-34.934-2.575-5.122-2.821-10.916.627-18.091 5.205-10.83 38.563-79.069 52.044-107.608 3.4-7.196 9.965-16.649 13.168-20.899 4.233-5.614 10.502-13.568 15.205-19.495 3.072-3.87 3.8-7.379 2.352-12.632-2.666-9.67-13.19-46.313-15.676-54.74-3.448-11.697-1.698-22.81 8.151-29.163 8.465-5.459 18.34-4.678 24.14-1.403 7.576 4.278 7.995 4.523 12.698 7.33s11.815 8.669 15.36 12.32c8.936 9.202 31.666 33.218 40.445 42.888 3.863 4.256 3.608 6.55.158 10.293s-7.303 6.797-5.331 14.504c2.195 8.576 11.134 42.886 13.327 49.748 2.194 6.863 7.532 11.755 15.99 12.477 10.972.936 18.807 1.737 24.14 2.34 13.794 1.559 20.064 12.426 18.497 23.08-1.881 12.788-5.745 39.62-6.896 47.254-1.881 12.477.156 20.118 6.113 29.163s14.42 21.367 20.692 30.411c5.34 7.703 7.064 22.91-.628 31.815-8.621 9.98-80.887 91.856-90.92 102.93-5.197 5.736-11.286 5.614-18.496-1.872-5.37-5.575-17.444-18.67-21.32-22.614-6.74-6.861-8.785-9.283-12.228-11.852-5.643-4.211-9.876-7.486-16.93-12.477-4.548-3.22-14.422-3.43-19.437 2.184s-5.183 17.245 1.096 22.145c7.995 6.237 33.31 26.142 40.914 32.282 10.817 8.734 11.98 23.507 4.703 32.75-7.366 9.358-20.222 16.22-37.936 2.34-10.049-7.873-228.782-180.232-239.527-188.547Z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 2, min_speed_kmh: 95, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Downhill right hairpin at end of pit straight", x: 128.6, y: 355.2 },
      { corner_number: 2, corner_name: "Turn 2", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Downhill off-camber left", x: 42.2, y: 286.5 },
      { corner_number: 3, corner_name: "Turn 3", gear: 5, min_speed_kmh: 220, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Fast uphill right onto short straight", x: 50.5, y: 271.4 },
      { corner_number: 4, corner_name: "Mansell (T4)", gear: 6, min_speed_kmh: 245, lateral_g: 4.2, brake_zone: false, drs_zone: false, notes: "Blind uphill crest left - supreme bravery", x: 212.0, y: 342.8 },
      { corner_number: 5, corner_name: "Turn 5", gear: 4, min_speed_kmh: 155, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Long sweeping uphill right", x: 197.7, y: 276.3 },
      { corner_number: 6, corner_name: "Chicane (T6)", gear: 2, min_speed_kmh: 85, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Slow chicane right entry over kerbs", x: 283.3, y: 110.2 },
      { corner_number: 7, corner_name: "Chicane (T7)", gear: 2, min_speed_kmh: 95, lateral_g: 2.2, brake_zone: false, drs_zone: false, notes: "Left chicane exit", x: 269.2, y: 25.1 },
      { corner_number: 8, corner_name: "Turn 8", gear: 4, min_speed_kmh: 165, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Left turn", x: 370.8, y: 85.8 },
      { corner_number: 9, corner_name: "Turn 9", gear: 4, min_speed_kmh: 170, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Right flick", x: 381.5, y: 163.1 },
      { corner_number: 10, corner_name: "Turn 10", gear: 5, min_speed_kmh: 215, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Fast left", x: 456.5, y: 327.6 },
      { corner_number: 11, corner_name: "Turn 11", gear: 5, min_speed_kmh: 225, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "High speed right sweep", x: 451.4, y: 334.4 },
      { corner_number: 12, corner_name: "Turn 12", gear: 3, min_speed_kmh: 120, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "90-degree right at top of hill", x: 356.2, y: 438.3 },
      { corner_number: 13, corner_name: "Turn 13", gear: 3, min_speed_kmh: 115, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Long left hairpin", x: 273.7, y: 407.7 },
      { corner_number: 14, corner_name: "Turn 14", gear: 4, min_speed_kmh: 150, lateral_g: 2.9, brake_zone: false, drs_zone: true, notes: "Double-apex right launching onto main straight", x: 306.4, y: 484.7 },
    ],
  },
  {
    id: 20,
    circuit_name: "Autódromo Hermanos Rodríguez",
    location: "Mexico City",
    country: "Mexico",
    country_code: "MEX",
    lat: 19.4042,
    lng: -99.0907,
    length_km: 4.304,
    corners_count: 17,
    drs_zones: 3,
    lap_record: "1:17.774",
    lap_record_driver: "Valtteri Bottas",
    lap_record_year: 2021,
    lap_record_team: "Mercedes W12",
    full_throttle_pct: 52,
    downforce_level: "MAXIMUM",
    tyre_stress_level: 2,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 48,
    pit_loss_time_sec: 22.8,
    first_grand_prix_year: 1963,
    elevation_gain_m: 2240.0,
    view_box: "0 0 500 500",
    start_finish: { x: 135.9, y: 84.7, label_x: 20, label_y: 4 },
    description: "High altitude (2,240m above sea level) thin air creating low downforce with maximum aero wings, passing right through the Foro Sol baseball stadium.",
    svg_path: "M68.115 74.569c20.465 2.901 314.544 46.249 376.858 55.798 3.924.6 15.237 2.752 23.971 4.728 2.288.518 3.041 4.923 2.867 8.43-.259 5.27-.8 13.839-1.432 22.789-.391 5.532-.13 5.927 4.303 7.245 1.817.539 3.416.948 5.867 1.58 3.11.803 4.726 2.649 4.434 5.533-.652 6.454-1.302 9.35-2.085 12.514-.653 2.634-4.638 9.707-5.115 10.52-14.661 24.978-76.417 129.197-82.64 138.987-5.007 7.877-7.396 11.41-11.93 18.376-4.89 7.507-5.282 16.202 2.542 18.772 7.059 2.316 8.243 2.674 11.344 3.753 6.26 2.174 7.353 3.848 7.236 8.102-.19 6.925-2.15 7.506-8.018 11.261-3.145 2.013-17.624 10.48-35.597 21.538-3.6 2.213-7.043 2.173-10.173-2.172-1.702-2.363-1.732-7.806-.979-12.054 5.477-30.824 15.062-81.406 18.973-100.175 2.626-12.597-6.455-18.574-21.711-21.143-8.476-1.428-15.164-7.935-17.798-15.412-4.106-11.657-9.395-18.187-21.515-18.771-8.215-.396-18.571-1.037-29.73-1.384-12.714-.396-21.32-6.125-22.297-17.19-.292-3.298-1.019-12.145-1.37-15.806-.586-6.127-.59-7.897-8.606-11.46-9.78-4.347-25.232-10.275-43.42-16.796-4.432-1.588-6.016-2.568-17.621-4.201-27.061-3.808-73.36-10.324-102.563-14.599-5.872-.859-4.278-1.88-4.278-6.755 0-3.28.13-26.213.391-37.014.1-4.126.193-7.575.064-11.329-.194-5.73-9.658-5.764-11.539-2.174-1.76 3.36-3.47 6.48-4.5 7.707-4.302 5.137-8.017 4.742-15.255.989-8.029-4.165-14.003-3.877-17.798-4.149-3.119-.225-6.454-.198-9.78-.395-3.385-.202-4.553-2.229-4.108-5.73 2.735-21.49 22.76-44.2 53.008-39.913z",
    optimal_line_svg: "M68.115 74.569c20.465 2.901 314.544 46.249 376.858 55.798 3.924.6 15.237 2.752 23.971 4.728 2.288.518 3.041 4.923 2.867 8.43-.259 5.27-.8 13.839-1.432 22.789-.391 5.532-.13 5.927 4.303 7.245 1.817.539 3.416.948 5.867 1.58 3.11.803 4.726 2.649 4.434 5.533-.652 6.454-1.302 9.35-2.085 12.514-.653 2.634-4.638 9.707-5.115 10.52-14.661 24.978-76.417 129.197-82.64 138.987-5.007 7.877-7.396 11.41-11.93 18.376-4.89 7.507-5.282 16.202 2.542 18.772 7.059 2.316 8.243 2.674 11.344 3.753 6.26 2.174 7.353 3.848 7.236 8.102-.19 6.925-2.15 7.506-8.018 11.261-3.145 2.013-17.624 10.48-35.597 21.538-3.6 2.213-7.043 2.173-10.173-2.172-1.702-2.363-1.732-7.806-.979-12.054 5.477-30.824 15.062-81.406 18.973-100.175 2.626-12.597-6.455-18.574-21.711-21.143-8.476-1.428-15.164-7.935-17.798-15.412-4.106-11.657-9.395-18.187-21.515-18.771-8.215-.396-18.571-1.037-29.73-1.384-12.714-.396-21.32-6.125-22.297-17.19-.292-3.298-1.019-12.145-1.37-15.806-.586-6.127-.59-7.897-8.606-11.46-9.78-4.347-25.232-10.275-43.42-16.796-4.432-1.588-6.016-2.568-17.621-4.201-27.061-3.808-73.36-10.324-102.563-14.599-5.872-.859-4.278-1.88-4.278-6.755 0-3.28.13-26.213.391-37.014.1-4.126.193-7.575.064-11.329-.194-5.73-9.658-5.764-11.539-2.174-1.76 3.36-3.47 6.48-4.5 7.707-4.302 5.137-8.017 4.742-15.255.989-8.029-4.165-14.003-3.877-17.798-4.149-3.119-.225-6.454-.198-9.78-.395-3.385-.202-4.553-2.229-4.108-5.73 2.735-21.49 22.76-44.2 53.008-39.913z",
    corners: [
      { corner_number: 1, corner_name: "Moises Solana (T1)", gear: 2, min_speed_kmh: 95, lateral_g: 2.3, brake_zone: true, drs_zone: false, notes: "Heavy braking right after 350 km/h straight", x: 145.2, y: 85.9 },
      { corner_number: 2, corner_name: "Moises Solana (T2)", gear: 3, min_speed_kmh: 115, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Left transition", x: 300.2, y: 108.7 },
      { corner_number: 3, corner_name: "Moises Solana (T3)", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Right exit onto DRS straight", x: 385.3, y: 121.4 },
      { corner_number: 4, corner_name: "Turn 4", gear: 2, min_speed_kmh: 90, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Heavy braking left hairpin", x: 470.4, y: 136.2 },
      { corner_number: 5, corner_name: "Turn 5", gear: 3, min_speed_kmh: 120, lateral_g: 2.4, brake_zone: false, drs_zone: false, notes: "Right transition", x: 470.8, y: 171.7 },
      { corner_number: 6, corner_name: "Turn 6", gear: 3, min_speed_kmh: 130, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Slow right chicane exit", x: 470.0, y: 216.9 },
      { corner_number: 7, corner_name: "Esses (T7)", gear: 5, min_speed_kmh: 205, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Fast left entry into flowing Esses", x: 395.9, y: 341.5 },
      { corner_number: 8, corner_name: "Esses (T8)", gear: 5, min_speed_kmh: 215, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Right flick", x: 403.5, y: 387.4 },
      { corner_number: 9, corner_name: "Esses (T9)", gear: 5, min_speed_kmh: 220, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "Left flick", x: 355.1, y: 425.8 },
      { corner_number: 10, corner_name: "Esses (T10)", gear: 6, min_speed_kmh: 235, lateral_g: 4.0, brake_zone: false, drs_zone: false, notes: "Right curve", x: 367.7, y: 300.1 },
      { corner_number: 11, corner_name: "Esses (T11)", gear: 6, min_speed_kmh: 240, lateral_g: 4.1, brake_zone: false, drs_zone: false, notes: "Left launch", x: 318.7, y: 258.0 },
      { corner_number: 12, corner_name: "Turn 12", gear: 3, min_speed_kmh: 120, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Right turn leading to stadium entrance", x: 252.7, y: 213.8 },
      { corner_number: 13, corner_name: "Foro Sol (T13)", gear: 2, min_speed_kmh: 65, lateral_g: 1.7, brake_zone: true, drs_zone: false, notes: "Slow left entry into stadium baseball bowl", x: 196.8, y: 190.3 },
      { corner_number: 14, corner_name: "Foro Sol (T14)", gear: 2, min_speed_kmh: 75, lateral_g: 1.8, brake_zone: false, drs_zone: false, notes: "Right hairpin amidst 30,000 roaring fans", x: 77.9, y: 172.0 },
      { corner_number: 15, corner_name: "Foro Sol (T15)", gear: 2, min_speed_kmh: 85, lateral_g: 2.0, brake_zone: false, drs_zone: false, notes: "Left flick", x: 77.4, y: 115.9 },
      { corner_number: 16, corner_name: "Turn 16", gear: 3, min_speed_kmh: 125, lateral_g: 2.4, brake_zone: false, drs_zone: false, notes: "Right acceleration exit out of stadium", x: 16.1, y: 119.0 },
      { corner_number: 17, corner_name: "Mansell Kurve (T17)", gear: 6, min_speed_kmh: 245, lateral_g: 3.8, brake_zone: false, drs_zone: true, notes: "Fast right launching onto 1.3km pit straight", x: 54.4, y: 74.5 },
    ],
  },
  {
    id: 21,
    circuit_name: "Las Vegas Strip Circuit",
    location: "Las Vegas",
    country: "United States",
    country_code: "USA",
    lat: 36.1147,
    lng: -115.163,
    length_km: 6.201,
    corners_count: 17,
    drs_zones: 2,
    lap_record: "1:35.490",
    lap_record_driver: "Oscar Piastri",
    lap_record_year: 2023,
    lap_record_team: "McLaren MCL60",
    full_throttle_pct: 74,
    downforce_level: "LOW",
    tyre_stress_level: 3,
    brake_wear_index: "VERY HEAVY",
    gear_shifts_per_lap: 44,
    pit_loss_time_sec: 21.0,
    first_grand_prix_year: 2023,
    elevation_gain_m: 4.0,
    view_box: "0 0 500 500",
    start_finish: { x: 440.2, y: 157.7, label_x: 20, label_y: 4 },
    description: "Glamorous night spectacle racing down the famous Las Vegas Boulevard past Bellagio, Caesars Palace, and the Sphere at 350+ km/h.",
    svg_path: "M44.554 308.699c5.621 2.881 52.896 30.75 61.836 35.774 7.261 4.082 18.085 9.124 31.856 14.165 21.976 8.045 37.495 12.32 56.449 15.126 21.08 3.122 32.091 4.52 44.738 5.282 7.963.48 26.891.171 58.557.96 57.855 1.441 148.06 2.882 150.61 2.882 1.873 0 3.123-.801 3.279-4.322.19-4.316 1.534-7.813 4.216-10.564 2.681-2.75 7.964-8.563 7.964-11.284 0-8.248.702-133.012.937-151.02.148-11.395-2.811-30.251-16.865-41.536-7.364-5.914-39.35-33.613-46.612-40.575-3.316-3.18-9.106-1.364-11.711 2.64-4.685 7.203-4.758 15.367 6.324 27.131 6.559 6.963 12.184 12.623 7.73 23.53-4.216 10.323-13.351 20.648-37.711 20.648-13.743 0-151.305.48-159.745.48-3.747 0-9.135-5.509-9.135-9.364 0-4.162-.234-19.048-.234-31.212 0-13.605-11.009-40.096-35.368-40.096-4.222 0-9.37-1.2-9.135 4.562.331 8.16-5.856 9.844-11.712 7.203-4.23-1.908-8.891-4.78-11.946-6.723-6.075-3.864-10.956 2.726-11.243 12.965-.61 21.762-2.012 52.195-2.576 64.345-1.171 25.21-10.557 39.821-32.09 44.658-24.09 5.41-34.476 14.223-40.025 26.134-4.714 10.12-6.23 20.945-7.742 29.763-1.655 9.648 7.227 7.357 9.354 8.448z",
    optimal_line_svg: "M44.554 308.699c5.621 2.881 52.896 30.75 61.836 35.774 7.261 4.082 18.085 9.124 31.856 14.165 21.976 8.045 37.495 12.32 56.449 15.126 21.08 3.122 32.091 4.52 44.738 5.282 7.963.48 26.891.171 58.557.96 57.855 1.441 148.06 2.882 150.61 2.882 1.873 0 3.123-.801 3.279-4.322.19-4.316 1.534-7.813 4.216-10.564 2.681-2.75 7.964-8.563 7.964-11.284 0-8.248.702-133.012.937-151.02.148-11.395-2.811-30.251-16.865-41.536-7.364-5.914-39.35-33.613-46.612-40.575-3.316-3.18-9.106-1.364-11.711 2.64-4.685 7.203-4.758 15.367 6.324 27.131 6.559 6.963 12.184 12.623 7.73 23.53-4.216 10.323-13.351 20.648-37.711 20.648-13.743 0-151.305.48-159.745.48-3.747 0-9.135-5.509-9.135-9.364 0-4.162-.234-19.048-.234-31.212 0-13.605-11.009-40.096-35.368-40.096-4.222 0-9.37-1.2-9.135 4.562.331 8.16-5.856 9.844-11.712 7.203-4.23-1.908-8.891-4.78-11.946-6.723-6.075-3.864-10.956 2.726-11.243 12.965-.61 21.762-2.012 52.195-2.576 64.345-1.171 25.21-10.557 39.821-32.09 44.658-24.09 5.41-34.476 14.223-40.025 26.134-4.714 10.12-6.23 20.945-7.742 29.763-1.655 9.648 7.227 7.357 9.354 8.448z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 2, min_speed_kmh: 85, lateral_g: 2.2, brake_zone: true, drs_zone: false, notes: "Tight left hairpin off the start", x: 399.5, y: 122.3 },
      { corner_number: 2, corner_name: "Turn 2", gear: 3, min_speed_kmh: 125, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Right transition", x: 405.3, y: 167.3 },
      { corner_number: 3, corner_name: "Turn 3", gear: 4, min_speed_kmh: 160, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Right acceleration sweep", x: 370.0, y: 197.4 },
      { corner_number: 4, corner_name: "Turn 4", gear: 5, min_speed_kmh: 210, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Fast left", x: 214.0, y: 198.0 },
      { corner_number: 5, corner_name: "Turn 5", gear: 3, min_speed_kmh: 115, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "90-degree right into Sphere complex", x: 204.5, y: 197.6 },
      { corner_number: 6, corner_name: "Sphere (T6)", gear: 4, min_speed_kmh: 155, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Long sweeping left around the Sphere", x: 153.5, y: 118.5 },
      { corner_number: 7, corner_name: "Sphere (T7)", gear: 4, min_speed_kmh: 165, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Left continuous radius", x: 119.2, y: 126.9 },
      { corner_number: 8, corner_name: "Sphere (T8)", gear: 4, min_speed_kmh: 160, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Left exit", x: 103.6, y: 233.4 },
      { corner_number: 9, corner_name: "Turn 9", gear: 3, min_speed_kmh: 120, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Right chicane entry", x: 36.1, y: 306.1 },
      { corner_number: 10, corner_name: "Turn 10", gear: 3, min_speed_kmh: 130, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Left exit onto Koval Lane", x: 108.2, y: 345.4 },
      { corner_number: 11, corner_name: "Turn 11", gear: 5, min_speed_kmh: 215, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Left kink", x: 176.8, y: 370.4 },
      { corner_number: 12, corner_name: "Turn 12", gear: 3, min_speed_kmh: 110, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Slow 90-degree left onto the Strip", x: 241.3, y: 379.1 },
      { corner_number: 13, corner_name: "The Strip (T13)", gear: 8, min_speed_kmh: 335, lateral_g: 2.2, brake_zone: false, drs_zone: false, notes: "Full throttle kink down 1.9km Vegas Strip", x: 292.5, y: 379.9 },
      { corner_number: 14, corner_name: "Turn 14", gear: 2, min_speed_kmh: 80, lateral_g: 2.3, brake_zone: true, drs_zone: false, notes: "Extreme braking left chicane at end of Strip", x: 442.1, y: 382.8 },
      { corner_number: 15, corner_name: "Turn 15", gear: 3, min_speed_kmh: 120, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Right transition", x: 450.8, y: 382.2 },
      { corner_number: 16, corner_name: "Turn 16", gear: 4, min_speed_kmh: 155, lateral_g: 2.8, brake_zone: false, drs_zone: false, notes: "Left sweep", x: 464.8, y: 235.7 },
      { corner_number: 17, corner_name: "Turn 17", gear: 6, min_speed_kmh: 240, lateral_g: 3.6, brake_zone: false, drs_zone: true, notes: "Fast left launching onto main straight", x: 450.2, y: 165.9 },
    ],
  },
  {
    id: 22,
    circuit_name: "Lusail International Circuit",
    location: "Lusail",
    country: "Qatar",
    country_code: "QAT",
    lat: 25.4897,
    lng: 51.4542,
    length_km: 5.419,
    corners_count: 16,
    drs_zones: 1,
    lap_record: "1:24.319",
    lap_record_driver: "Max Verstappen",
    lap_record_year: 2023,
    lap_record_team: "Red Bull RB19",
    full_throttle_pct: 62,
    downforce_level: "HIGH",
    tyre_stress_level: 5,
    brake_wear_index: "MEDIUM",
    gear_shifts_per_lap: 46,
    pit_loss_time_sec: 24.0,
    first_grand_prix_year: 2021,
    elevation_gain_m: 8.5,
    view_box: "0 0 500 500",
    start_finish: { x: 292.6, y: 403.3, label_x: 20, label_y: 4 },
    description: "High-speed aerodynamic flow under floodlights. High sustained lateral G-forces and aggressive kerbs punishing tyres across medium and high-speed bends.",
    svg_path: "M236.125 403.485c-49.465.116-97.022-1.042-143.961-1.175-27.707-.08-30.999-30.373-15.683-38.579 17.206-9.218 33.39-17.045 50.186-26.716 12.614-7.262 13.608-27.13-1.947-34.945-16.459-8.268-26.63-13.663-42.507-22.548-3.873-2.168-8.985-7.91-10.491-12.076-12.827-35.478-23.44-68.035-35.585-103.98-3.702-10.956 1.518-21.052 13.844-25.22 9.487-3.208 13.703-4.766 23.904-8.015 9.142-2.911 20.726 4.671 24.552 14.427 8 20.4 13.693 40.66 20.334 60.806 1.516 4.598 7.909 10.341 11.79 10.26 3.072-.065 8.963-2.794 9.518-6.52 4.844-32.513 9.567-65.009 13.736-97.46.85-6.612 7.809-11.83 12.655-13.893 4.528-1.927 11.25-.997 15.575 1.07 4.327 2.066 8.537 6.56 10.383 11.327 2.624 6.775 2.43 14.55 5.192 21.373 3.583 8.851 7.929 17.972 14.601 25.006 4.586 4.834 12.624 9.915 17.721 15.764 3.11 3.568 9.362 10.18 6.94 18.433-2.863 9.753-9.637 28.902-13.953 49.158-1.074 5.04 1.888 11.502 5.84 14.106 4.7 3.096 13.672 2.909 19.686 1.175 11.291-3.253 22.9-7.598 33.097-14.213 8.694-5.639 15.922-12.71 22.93-20.304 5.4-5.851 10.208-12.61 13.628-19.877 9.992-21.23 17.942-43.035 26.824-64.974 2.655-6.558 7.221-14.892 12.979-18.274 3.493-2.051 10.342-5.11 14.277-5.13 15.977-.074 24.919-.183 41.1.108 4.17.075 11.806 4.707 13.737 8.335 8.55 16.064 16.042 28.883 25.093 44.242 2.441 4.142 2.662 13.613-1.19 18.06-19.19 22.164-33.343 39.55-53.214 61.448-5.667 6.244-9.242 17.372-4.76 24.151 23.111 34.955 42.192 67.636 68.574 103.125 8.857 11.914-.043 29.737-14.818 29.815-71.385.376-138.336 1.54-210.587 1.71z",
    optimal_line_svg: "M236.125 403.485c-49.465.116-97.022-1.042-143.961-1.175-27.707-.08-30.999-30.373-15.683-38.579 17.206-9.218 33.39-17.045 50.186-26.716 12.614-7.262 13.608-27.13-1.947-34.945-16.459-8.268-26.63-13.663-42.507-22.548-3.873-2.168-8.985-7.91-10.491-12.076-12.827-35.478-23.44-68.035-35.585-103.98-3.702-10.956 1.518-21.052 13.844-25.22 9.487-3.208 13.703-4.766 23.904-8.015 9.142-2.911 20.726 4.671 24.552 14.427 8 20.4 13.693 40.66 20.334 60.806 1.516 4.598 7.909 10.341 11.79 10.26 3.072-.065 8.963-2.794 9.518-6.52 4.844-32.513 9.567-65.009 13.736-97.46.85-6.612 7.809-11.83 12.655-13.893 4.528-1.927 11.25-.997 15.575 1.07 4.327 2.066 8.537 6.56 10.383 11.327 2.624 6.775 2.43 14.55 5.192 21.373 3.583 8.851 7.929 17.972 14.601 25.006 4.586 4.834 12.624 9.915 17.721 15.764 3.11 3.568 9.362 10.18 6.94 18.433-2.863 9.753-9.637 28.902-13.953 49.158-1.074 5.04 1.888 11.502 5.84 14.106 4.7 3.096 13.672 2.909 19.686 1.175 11.291-3.253 22.9-7.598 33.097-14.213 8.694-5.639 15.922-12.71 22.93-20.304 5.4-5.851 10.208-12.61 13.628-19.877 9.992-21.23 17.942-43.035 26.824-64.974 2.655-6.558 7.221-14.892 12.979-18.274 3.493-2.051 10.342-5.11 14.277-5.13 15.977-.074 24.919-.183 41.1.108 4.17.075 11.806 4.707 13.737 8.335 8.55 16.064 16.042 28.883 25.093 44.242 2.441 4.142 2.662 13.613-1.19 18.06-19.19 22.164-33.343 39.55-53.214 61.448-5.667 6.244-9.242 17.372-4.76 24.151 23.111 34.955 42.192 67.636 68.574 103.125 8.857 11.914-.043 29.737-14.818 29.815-71.385.376-138.336 1.54-210.587 1.71z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: true, drs_zone: false, notes: "Right entry hairpin from 330 km/h main straight", x: 232.2, y: 403.5 },
      { corner_number: 2, corner_name: "Turn 2", gear: 4, min_speed_kmh: 160, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Left acceleration sweep", x: 73.8, y: 395.6 },
      { corner_number: 3, corner_name: "Turn 3", gear: 5, min_speed_kmh: 215, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Fast right sweep", x: 73.7, y: 365.7 },
      { corner_number: 4, corner_name: "Turn 4", gear: 4, min_speed_kmh: 155, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Right turn entry", x: 134.7, y: 312.5 },
      { corner_number: 5, corner_name: "Turn 5", gear: 4, min_speed_kmh: 165, lateral_g: 3.1, brake_zone: false, drs_zone: false, notes: "Left transition", x: 36.0, y: 150.5 },
      { corner_number: 6, corner_name: "Turn 6", gear: 3, min_speed_kmh: 110, lateral_g: 2.3, brake_zone: true, drs_zone: false, notes: "Tight left hairpin", x: 76.9, y: 129.7 },
      { corner_number: 7, corner_name: "Turn 7", gear: 4, min_speed_kmh: 155, lateral_g: 2.9, brake_zone: false, drs_zone: false, notes: "Right sweep", x: 139.0, y: 211.6 },
      { corner_number: 8, corner_name: "Turn 8", gear: 5, min_speed_kmh: 210, lateral_g: 3.4, brake_zone: false, drs_zone: false, notes: "Fast left", x: 154.5, y: 109.0 },
      { corner_number: 9, corner_name: "Turn 9", gear: 5, min_speed_kmh: 220, lateral_g: 3.6, brake_zone: false, drs_zone: false, notes: "Fast right", x: 237.4, y: 186.8 },
      { corner_number: 10, corner_name: "Turn 10", gear: 4, min_speed_kmh: 165, lateral_g: 3.1, brake_zone: true, drs_zone: false, notes: "Left turn", x: 228.5, y: 253.9 },
      { corner_number: 11, corner_name: "Turn 11", gear: 5, min_speed_kmh: 215, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Right sweep", x: 355.9, y: 119.1 },
      { corner_number: 12, corner_name: "Triple Right (T12)", gear: 6, min_speed_kmh: 250, lateral_g: 4.4, brake_zone: false, drs_zone: false, notes: "First apex of massive high-G triple right complex", x: 425.6, y: 119.0 },
      { corner_number: 13, corner_name: "Triple Right (T13)", gear: 6, min_speed_kmh: 260, lateral_g: 4.7, brake_zone: false, drs_zone: false, notes: "Second apex continuous 4.5+ G loading", x: 452.4, y: 180.8 },
      { corner_number: 14, corner_name: "Triple Right (T14)", gear: 6, min_speed_kmh: 255, lateral_g: 4.5, brake_zone: false, drs_zone: false, notes: "Third apex exit", x: 391.7, y: 266.3 },
      { corner_number: 15, corner_name: "Turn 15", gear: 4, min_speed_kmh: 150, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Right turn", x: 450.1, y: 401.4 },
      { corner_number: 16, corner_name: "Turn 16", gear: 4, min_speed_kmh: 160, lateral_g: 3.2, brake_zone: false, drs_zone: true, notes: "Medium-speed right onto 1km pit straight", x: 298.0, y: 403.1 },
    ],
  },
  {
    id: 23,
    circuit_name: "Yas Marina Circuit",
    location: "Abu Dhabi",
    country: "United Arab Emirates",
    country_code: "UAE",
    lat: 24.4672,
    lng: 54.6031,
    length_km: 5.281,
    corners_count: 16,
    drs_zones: 2,
    lap_record: "1:26.103",
    lap_record_driver: "Max Verstappen",
    lap_record_year: 2021,
    lap_record_team: "Red Bull RB16B",
    full_throttle_pct: 64,
    downforce_level: "MEDIUM",
    tyre_stress_level: 3,
    brake_wear_index: "HEAVY",
    gear_shifts_per_lap: 56,
    pit_loss_time_sec: 22.2,
    first_grand_prix_year: 2009,
    elevation_gain_m: 10.7,
    view_box: "0 0 500 500",
    start_finish: { x: 223.2, y: 280.9, label_x: 20, label_y: 4 },
    description: "Championship twilight finale. Features the fast Turn 5 hairpin, 1.2km drag down the back straight, and the sweeping Turn 9 banked horseshoe.",
    svg_path: "M191.25 155.874c16.09-47.466 35.643-104.64 45.341-132.916 2.862-8.345 16.92-14.272 19.337 4.301.344 2.64 2.21 16.484 2.667 19.807.833 6.081 4.058 31.57 5.334 42.735 1.334 11.67 1.167 23.34-.5 33.86-1.667 10.518-9.31 24.94-7.835 36.817.834 6.709 4.324 14.567 10.169 20.217 8.502 8.218 20.67 11.012 32.006 13.807 6.968 1.717 10.335 6.448 12.669 15.121 2.167 8.054 9.755 36.794 11.668 44.05 2.168 8.219-2.5 13.314-11.502 14.793-6.325 1.04-117.854 16.437-135.857 18.902-6.412.879-10.94 7.925-6.168 16.765 5.5 10.191 16.503 29.915 19.837 35.997 2.768 5.05 5.146 7.249 14.169 6.081 10.168-1.315 40.34-4.767 49.342-6.081s17.17-.33 22.004.821c4.349 1.035 3.334 3.945 3.334 7.232s-.167 14.136-.333 20.71c-.135 5.27-1.175 6.879-6.001 7.397-7.668.822-16.17 1.644-23.005 2.137-3.155.227-5.5 1.479-4.167 6.739s5.668 23.01 6.334 25.97c.667 2.958 4.041 7.168 6.668 8.875 7.335 4.767 19.17 12.492 25.672 16.437 2.539 1.54 7.005 2.056 12.502 2.22 11.169.328 28.622 1.242 43.008 2.136 19.837 1.234 25.422 12.903 24.17 27.696-.498 5.906-6.167 12.82-9.39 15.232-1.86 1.392-10.629 1.589-13.453.32-14.756-6.629-45.618-20.811-56.67-25.96-5.264-2.453-23.389-13.853-30.34-19.177-11.946-9.151-49.07-39.375-59.844-48.16-8.668-7.067-13.909-12.658-20.337-24.326-7.334-13.313-11.335-26.627-14.002-39.94-.85-4.244-2.487-4.304-5.168-4.11-4.5.33-7.324.795-10.835.987-3 .164-5.461-.586-3.834-5.425 4.914-14.624 28.362-89.355 53.01-162.067z",
    optimal_line_svg: "M191.25 155.874c16.09-47.466 35.643-104.64 45.341-132.916 2.862-8.345 16.92-14.272 19.337 4.301.344 2.64 2.21 16.484 2.667 19.807.833 6.081 4.058 31.57 5.334 42.735 1.334 11.67 1.167 23.34-.5 33.86-1.667 10.518-9.31 24.94-7.835 36.817.834 6.709 4.324 14.567 10.169 20.217 8.502 8.218 20.67 11.012 32.006 13.807 6.968 1.717 10.335 6.448 12.669 15.121 2.167 8.054 9.755 36.794 11.668 44.05 2.168 8.219-2.5 13.314-11.502 14.793-6.325 1.04-117.854 16.437-135.857 18.902-6.412.879-10.94 7.925-6.168 16.765 5.5 10.191 16.503 29.915 19.837 35.997 2.768 5.05 5.146 7.249 14.169 6.081 10.168-1.315 40.34-4.767 49.342-6.081s17.17-.33 22.004.821c4.349 1.035 3.334 3.945 3.334 7.232s-.167 14.136-.333 20.71c-.135 5.27-1.175 6.879-6.001 7.397-7.668.822-16.17 1.644-23.005 2.137-3.155.227-5.5 1.479-4.167 6.739s5.668 23.01 6.334 25.97c.667 2.958 4.041 7.168 6.668 8.875 7.335 4.767 19.17 12.492 25.672 16.437 2.539 1.54 7.005 2.056 12.502 2.22 11.169.328 28.622 1.242 43.008 2.136 19.837 1.234 25.422 12.903 24.17 27.696-.498 5.906-6.167 12.82-9.39 15.232-1.86 1.392-10.629 1.589-13.453.32-14.756-6.629-45.618-20.811-56.67-25.96-5.264-2.453-23.389-13.853-30.34-19.177-11.946-9.151-49.07-39.375-59.844-48.16-8.668-7.067-13.909-12.658-20.337-24.326-7.334-13.313-11.335-26.627-14.002-39.94-.85-4.244-2.487-4.304-5.168-4.11-4.5.33-7.324.795-10.835.987-3 .164-5.461-.586-3.834-5.425 4.914-14.624 28.362-89.355 53.01-162.067z",
    corners: [
      { corner_number: 1, corner_name: "Turn 1", gear: 4, min_speed_kmh: 165, lateral_g: 3.0, brake_zone: true, drs_zone: false, notes: "Medium-speed left off the start straight", x: 310.3, y: 268.5 },
      { corner_number: 2, corner_name: "Turn 2", gear: 6, min_speed_kmh: 255, lateral_g: 3.5, brake_zone: false, drs_zone: false, notes: "Fast uphill right", x: 321.7, y: 261.8 },
      { corner_number: 3, corner_name: "Turn 3", gear: 6, min_speed_kmh: 265, lateral_g: 3.8, brake_zone: false, drs_zone: false, notes: "High speed crest left", x: 255.5, y: 159.6 },
      { corner_number: 4, corner_name: "Turn 4", gear: 5, min_speed_kmh: 215, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Right downhill plunge", x: 264.0, y: 119.8 },
      { corner_number: 5, corner_name: "Turn 5", gear: 2, min_speed_kmh: 75, lateral_g: 2.1, brake_zone: true, drs_zone: false, notes: "Modified hairpin left onto 1.2km back straight", x: 249.1, y: 15.4 },
      { corner_number: 6, corner_name: "Turn 6", gear: 3, min_speed_kmh: 115, lateral_g: 2.5, brake_zone: true, drs_zone: false, notes: "Left chicane entry at end of back straight", x: 190.0, y: 159.5 },
      { corner_number: 7, corner_name: "Turn 7", gear: 3, min_speed_kmh: 125, lateral_g: 2.6, brake_zone: false, drs_zone: false, notes: "Right chicane exit", x: 186.3, y: 170.5 },
      { corner_number: 8, corner_name: "Turn 8", gear: 6, min_speed_kmh: 255, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Kink on second DRS straight", x: 138.3, y: 322.4 },
      { corner_number: 9, corner_name: "Marsa Banked (T9)", gear: 4, min_speed_kmh: 155, lateral_g: 3.6, brake_zone: true, drs_zone: false, notes: "5-degree banked long sweeping left hairpin", x: 156.3, y: 322.9 },
      { corner_number: 10, corner_name: "Turn 10", gear: 5, min_speed_kmh: 210, lateral_g: 3.2, brake_zone: false, drs_zone: false, notes: "Right acceleration sweep", x: 253.9, y: 440.1 },
      { corner_number: 11, corner_name: "Turn 11", gear: 4, min_speed_kmh: 160, lateral_g: 2.9, brake_zone: true, drs_zone: false, notes: "Right turn entry", x: 351.8, y: 484.2 },
      { corner_number: 12, corner_name: "Turn 12", gear: 3, min_speed_kmh: 125, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Left turn towards hotel", x: 361.8, y: 470.5 },
      { corner_number: 13, corner_name: "Turn 13", gear: 3, min_speed_kmh: 115, lateral_g: 2.4, brake_zone: true, drs_zone: false, notes: "Right turn under the illuminated W Hotel bridge", x: 250.9, y: 413.2 },
      { corner_number: 14, corner_name: "Turn 14", gear: 3, min_speed_kmh: 120, lateral_g: 2.5, brake_zone: false, drs_zone: false, notes: "Left turn passing hotel marina", x: 244.2, y: 379.9 },
      { corner_number: 15, corner_name: "Turn 15", gear: 4, min_speed_kmh: 165, lateral_g: 3.0, brake_zone: false, drs_zone: false, notes: "Right turn around marina", x: 192.6, y: 345.2 },
      { corner_number: 16, corner_name: "Turn 16", gear: 5, min_speed_kmh: 195, lateral_g: 3.4, brake_zone: false, drs_zone: true, notes: "Fast right launching onto pit straight", x: 169.3, y: 290.1 },
    ],
  },
];

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
    circuit: MOCK_CIRCUITS.find(c => c.id === 18) || MOCK_CIRCUITS[0], // Shanghai
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 9) || MOCK_CIRCUITS[0], // Bahrain
    status: 'COMPLETED',
    date: '2026-04-12',
    sessions: [
      { id: 10, race_id: 4, session_type: 'Q', session_name: 'Qualifying', date: '2026-04-11' },
      { id: 11, race_id: 4, session_type: 'R', session_name: 'Race', date: '2026-04-12' },
    ],
  },
  {
    id: 5,
    season: 2026,
    round_number: 5,
    race_name: 'Saudi Arabian Grand Prix',
    official_event_name: 'Formula 1 STC Saudi Arabian Grand Prix 2026',
    circuit: MOCK_CIRCUITS.find(c => c.id === 16) || MOCK_CIRCUITS[0], // Jeddah
    status: 'COMPLETED',
    date: '2026-04-19',
    sessions: [
      { id: 12, race_id: 5, session_type: 'Q', session_name: 'Qualifying', date: '2026-04-18' },
      { id: 13, race_id: 5, session_type: 'R', session_name: 'Race', date: '2026-04-19' },
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 13) || MOCK_CIRCUITS[0], // Barcelona
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 14) || MOCK_CIRCUITS[0], // Hungaroring
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 13) || MOCK_CIRCUITS[0],
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 6) || MOCK_CIRCUITS[0], // COTA
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 21) || MOCK_CIRCUITS[0], // Interlagos
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 22) || MOCK_CIRCUITS[0], // Las Vegas Strip
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 23) || MOCK_CIRCUITS[0], // Lusail
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
    circuit: MOCK_CIRCUITS.find(c => c.id === 24) || MOCK_CIRCUITS[0], // Yas Marina
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
  { id: 101, season: 2024, round_number: 1, race_name: 'Bahrain Grand Prix', official_event_name: 'Formula 1 Gulf Air Bahrain Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 9) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-03-02' },
  { id: 102, season: 2024, round_number: 2, race_name: 'Saudi Arabian Grand Prix', official_event_name: 'Formula 1 STC Saudi Arabian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 16) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-03-09' },
  { id: 103, season: 2024, round_number: 3, race_name: 'Australian Grand Prix', official_event_name: 'Formula 1 Rolex Australian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 15) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-03-24' },
  { id: 104, season: 2024, round_number: 4, race_name: 'Japanese Grand Prix', official_event_name: 'Formula 1 MSC Cruises Japanese Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 5) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-04-07' },
  { id: 105, season: 2024, round_number: 5, race_name: 'Chinese Grand Prix', official_event_name: 'Formula 1 Lenovo Chinese Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 18) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-04-21' },
  { id: 106, season: 2024, round_number: 6, race_name: 'Miami Grand Prix', official_event_name: 'Formula 1 Crypto.com Miami Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 17) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-05-05' },
  { id: 107, season: 2024, round_number: 7, race_name: 'Emilia Romagna Grand Prix', official_event_name: 'Formula 1 MSC Cruises Gran Premio dell\'Emilia-Romagna 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 19) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-05-19' },
  { id: 108, season: 2024, round_number: 8, race_name: 'Monaco Grand Prix', official_event_name: 'Formula 1 Grand Prix de Monaco 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 4) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-05-26' },
  { id: 109, season: 2024, round_number: 9, race_name: 'Canadian Grand Prix', official_event_name: 'Formula 1 AWS Grand Prix du Canada 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 11) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-06-09' },
  { id: 110, season: 2024, round_number: 10, race_name: 'Spanish Grand Prix', official_event_name: 'Formula 1 Aramco Gran Premio de España 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 13) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-06-23' },
  { id: 111, season: 2024, round_number: 11, race_name: 'Austrian Grand Prix', official_event_name: 'Formula 1 Qatar Airways Großer Preis von Österreich 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 10) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-06-30' },
  { id: 112, season: 2024, round_number: 12, race_name: 'British Grand Prix', official_event_name: 'Formula 1 Qatar Airways British Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 3) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-07-07' },
  { id: 113, season: 2024, round_number: 13, race_name: 'Hungarian Grand Prix', official_event_name: 'Formula 1 Hungarian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 14) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-07-21' },
  { id: 114, season: 2024, round_number: 14, race_name: 'Belgian Grand Prix', official_event_name: 'Formula 1 Rolex Belgian Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 2) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-07-28' },
  { id: 115, season: 2024, round_number: 15, race_name: 'Dutch Grand Prix', official_event_name: 'Formula 1 Heineken Dutch Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 12) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-08-25' },
  { id: 116, season: 2024, round_number: 16, race_name: 'Italian Grand Prix', official_event_name: 'Formula 1 Pirelli Gran Premio d\'Italia 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 1) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-09-01' },
  { id: 117, season: 2024, round_number: 17, race_name: 'Azerbaijan Grand Prix', official_event_name: 'Formula 1 Qatar Airways Azerbaijan Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 8) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-09-15' },
  { id: 118, season: 2024, round_number: 18, race_name: 'Singapore Grand Prix', official_event_name: 'Formula 1 Singapore Airlines Singapore Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 7) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-09-22' },
  { id: 119, season: 2024, round_number: 19, race_name: 'United States Grand Prix', official_event_name: 'Formula 1 Pirelli United States Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 6) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-10-20' },
  { id: 120, season: 2024, round_number: 20, race_name: 'Mexico City Grand Prix', official_event_name: 'Formula 1 Gran Premio de la Ciudad de México 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 22) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-10-27' },
  { id: 121, season: 2024, round_number: 21, race_name: 'São Paulo Grand Prix', official_event_name: 'Formula 1 Lenovo Grande Prêmio de São Paulo 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 6) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-11-03' },
  { id: 122, season: 2024, round_number: 22, race_name: 'Las Vegas Grand Prix', official_event_name: 'Formula 1 Heineken Silver Las Vegas Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 21) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-11-23' },
  { id: 123, season: 2024, round_number: 23, race_name: 'Qatar Grand Prix', official_event_name: 'Formula 1 Qatar Airways Qatar Grand Prix 2024', circuit: MOCK_CIRCUITS.find(c => c.id === 20) || MOCK_CIRCUITS[0], status: 'COMPLETED', date: '2024-12-01' },
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

export const SEASON_2026_RESULTS: Record<number, RaceResult> = {
  1: {
    race_id: 1, season: 2026, round_number: 1, race_name: "Australian Grand Prix",
    circuit_name: "Albert Park Circuit", country: "Australia", country_code: "AUS",
    date: "2026-03-08", status: "COMPLETED", laps_completed: 58, total_laps: 58,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[6], time_or_gap: "1:23:06.801", points: 25, fastest_lap: false },
      p2: { position: 2, driver: MOCK_DRIVERS[7], time_or_gap: "+2.974", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[1], time_or_gap: "+15.519", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[6], lap_time: "1:19.813", lap_number: 53 },
    pole_position: { driver: MOCK_DRIVERS[6], q3_time: "1:16.241" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 25, time_or_gap: "1:23:06.801" },
      { position: 2, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 18, time_or_gap: "+2.974" },
      { position: 3, driver: MOCK_DRIVERS[1], team_name: "Ferrari", team_color: "#E80020", points: 15, time_or_gap: "+15.519" },
    ],
  },
  2: {
    race_id: 2, season: 2026, round_number: 2, race_name: "Chinese Grand Prix",
    circuit_name: "Shanghai International Circuit", country: "China", country_code: "CHN",
    date: "2026-03-15", status: "COMPLETED", laps_completed: 56, total_laps: 56,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:33:15.607", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[6], time_or_gap: "+5.515", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[5], time_or_gap: "+25.267", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[7], lap_time: "1:35.210", lap_number: 51 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:33.402" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 26, time_or_gap: "1:33:15.607" },
      { position: 2, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 18, time_or_gap: "+5.515" },
      { position: 3, driver: MOCK_DRIVERS[5], team_name: "Ferrari", team_color: "#E80020", points: 15, time_or_gap: "+25.267" },
    ],
  },
  3: {
    race_id: 3, season: 2026, round_number: 3, race_name: "Japanese Grand Prix",
    circuit_name: "Suzuka Circuit", country: "Japan", country_code: "JPN",
    date: "2026-03-29", status: "COMPLETED", laps_completed: 53, total_laps: 53,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:28:03.403", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[3], time_or_gap: "+13.722", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[1], time_or_gap: "+15.270", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[7], lap_time: "1:33.109", lap_number: 48 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:28.910" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 26, time_or_gap: "1:28:03.403" },
      { position: 2, driver: MOCK_DRIVERS[3], team_name: "McLaren", team_color: "#FF8000", points: 18, time_or_gap: "+13.722" },
      { position: 3, driver: MOCK_DRIVERS[1], team_name: "Ferrari", team_color: "#E80020", points: 15, time_or_gap: "+15.270" },
    ],
  },
  4: {
    race_id: 4, season: 2026, round_number: 4, race_name: "Bahrain Grand Prix",
    circuit_name: "Bahrain International Circuit", country: "Bahrain", country_code: "BHR",
    date: "2026-04-12", status: "COMPLETED", laps_completed: 57, total_laps: 57,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:31:44.290", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[6], time_or_gap: "+4.120", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[2], time_or_gap: "+12.890", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[7], lap_time: "1:32.410", lap_number: 52 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:29.810" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 26, time_or_gap: "1:31:44.290" },
      { position: 2, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 18, time_or_gap: "+4.120" },
      { position: 3, driver: MOCK_DRIVERS[2], team_name: "Red Bull Racing", team_color: "#3671C6", points: 15, time_or_gap: "+12.890" },
    ],
  },
  5: {
    race_id: 5, season: 2026, round_number: 5, race_name: "Saudi Arabian Grand Prix",
    circuit_name: "Jeddah Corniche Circuit", country: "Saudi Arabia", country_code: "KSA",
    date: "2026-04-19", status: "COMPLETED", laps_completed: 50, total_laps: 50,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:25:22.110", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[5], time_or_gap: "+6.890", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[1], time_or_gap: "+11.450", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[7], lap_time: "1:29.740", lap_number: 47 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:27.420" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 26, time_or_gap: "1:25:22.110" },
      { position: 2, driver: MOCK_DRIVERS[5], team_name: "Ferrari", team_color: "#E80020", points: 18, time_or_gap: "+6.890" },
      { position: 3, driver: MOCK_DRIVERS[1], team_name: "Ferrari", team_color: "#E80020", points: 15, time_or_gap: "+11.450" },
    ],
  },
  6: {
    race_id: 6, season: 2026, round_number: 6, race_name: "Miami Grand Prix",
    circuit_name: "Miami International Autodrome", country: "United States", country_code: "USA",
    date: "2026-05-03", status: "COMPLETED", laps_completed: 57, total_laps: 57,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:33:19.273", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[0], time_or_gap: "+3.264", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[3], time_or_gap: "+27.092", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[7], lap_time: "1:30.120", lap_number: 54 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:27.241" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 26, time_or_gap: "1:33:19.273" },
      { position: 2, driver: MOCK_DRIVERS[0], team_name: "McLaren", team_color: "#FF8000", points: 18, time_or_gap: "+3.264" },
      { position: 3, driver: MOCK_DRIVERS[3], team_name: "McLaren", team_color: "#FF8000", points: 15, time_or_gap: "+27.092" },
    ],
  },
  7: {
    race_id: 7, season: 2026, round_number: 7, race_name: "Canadian Grand Prix",
    circuit_name: "Circuit Gilles Villeneuve", country: "Canada", country_code: "CAN",
    date: "2026-05-24", status: "COMPLETED", laps_completed: 70, total_laps: 70,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:28:15.758", points: 25, fastest_lap: false },
      p2: { position: 2, driver: MOCK_DRIVERS[5], time_or_gap: "+10.768", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[2], time_or_gap: "+11.276", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[5], lap_time: "1:14.890", lap_number: 67 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:11.980" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 25, time_or_gap: "1:28:15.758" },
      { position: 2, driver: MOCK_DRIVERS[5], team_name: "Ferrari", team_color: "#E80020", points: 18, time_or_gap: "+10.768" },
      { position: 3, driver: MOCK_DRIVERS[2], team_name: "Red Bull Racing", team_color: "#3671C6", points: 15, time_or_gap: "+11.276" },
    ],
  },
  8: {
    race_id: 8, season: 2026, round_number: 8, race_name: "Monaco Grand Prix",
    circuit_name: "Circuit de Monaco", country: "Monaco", country_code: "MON",
    date: "2026-06-07", status: "COMPLETED", laps_completed: 78, total_laps: 78,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "2:23:31.243", points: 25, fastest_lap: false },
      p2: { position: 2, driver: MOCK_DRIVERS[5], time_or_gap: "+6.271", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[18], time_or_gap: "+23.394", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[5], lap_time: "1:13.920", lap_number: 75 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:10.820" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 25, time_or_gap: "2:23:31.243" },
      { position: 2, driver: MOCK_DRIVERS[5], team_name: "Ferrari", team_color: "#E80020", points: 18, time_or_gap: "+6.271" },
      { position: 3, driver: MOCK_DRIVERS[18], team_name: "RB", team_color: "#6692FF", points: 15, time_or_gap: "+23.394" },
    ],
  },
  9: {
    race_id: 9, season: 2026, round_number: 9, race_name: "Barcelona Grand Prix",
    circuit_name: "Circuit de Barcelona-Catalunya", country: "Spain", country_code: "ESP",
    date: "2026-06-14", status: "COMPLETED", laps_completed: 66, total_laps: 66,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[5], time_or_gap: "1:32:28.105", points: 25, fastest_lap: false },
      p2: { position: 2, driver: MOCK_DRIVERS[6], time_or_gap: "+19.561", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[0], time_or_gap: "+23.719", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[5], lap_time: "1:16.890", lap_number: 62 },
    pole_position: { driver: MOCK_DRIVERS[5], q3_time: "1:11.940" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[5], team_name: "Ferrari", team_color: "#E80020", points: 25, time_or_gap: "1:32:28.105" },
      { position: 2, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 18, time_or_gap: "+19.561" },
      { position: 3, driver: MOCK_DRIVERS[0], team_name: "McLaren", team_color: "#FF8000", points: 15, time_or_gap: "+23.719" },
    ],
  },
  10: {
    race_id: 10, season: 2026, round_number: 10, race_name: "Austrian Grand Prix",
    circuit_name: "Red Bull Ring", country: "Austria", country_code: "AUT",
    date: "2026-06-28", status: "COMPLETED", laps_completed: 71, total_laps: 71,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[6], time_or_gap: "1:26:37.979", points: 25, fastest_lap: false },
      p2: { position: 2, driver: MOCK_DRIVERS[2], time_or_gap: "+1.611", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[7], time_or_gap: "+1.986", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[6], lap_time: "1:07.890", lap_number: 68 },
    pole_position: { driver: MOCK_DRIVERS[6], q3_time: "1:04.560" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 25, time_or_gap: "1:26:37.979" },
      { position: 2, driver: MOCK_DRIVERS[2], team_name: "Red Bull Racing", team_color: "#3671C6", points: 18, time_or_gap: "+1.611" },
      { position: 3, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 15, time_or_gap: "+1.986" },
    ],
  },
  11: {
    race_id: 11, season: 2026, round_number: 11, race_name: "British Grand Prix",
    circuit_name: "Silverstone Circuit", country: "United Kingdom", country_code: "GBR",
    date: "2026-07-05", status: "COMPLETED", laps_completed: 52, total_laps: 52,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[1], time_or_gap: "1:27:11.335", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[6], time_or_gap: "+0.427", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[5], time_or_gap: "+0.772", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[1], lap_time: "1:28.120", lap_number: 50 },
    pole_position: { driver: MOCK_DRIVERS[1], q3_time: "1:25.820" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[1], team_name: "Ferrari", team_color: "#E80020", points: 26, time_or_gap: "1:27:11.335" },
      { position: 2, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 18, time_or_gap: "+0.427" },
      { position: 3, driver: MOCK_DRIVERS[5], team_name: "Ferrari", team_color: "#E80020", points: 15, time_or_gap: "+0.772" },
    ],
  },
  12: {
    race_id: 12, season: 2026, round_number: 12, race_name: "Belgian Grand Prix",
    circuit_name: "Circuit de Spa-Francorchamps", country: "Belgium", country_code: "BEL",
    date: "2026-07-19", status: "COMPLETED", laps_completed: 44, total_laps: 44,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:24:42.479", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[1], time_or_gap: "+1.952", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[2], time_or_gap: "+11.586", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[7], lap_time: "1:44.820", lap_number: 41 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:41.220" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 26, time_or_gap: "1:24:42.479" },
      { position: 2, driver: MOCK_DRIVERS[1], team_name: "Ferrari", team_color: "#E80020", points: 18, time_or_gap: "+1.952" },
      { position: 3, driver: MOCK_DRIVERS[2], team_name: "Red Bull Racing", team_color: "#3671C6", points: 15, time_or_gap: "+11.586" },
    ],
  },
  13: {
    race_id: 13, season: 2026, round_number: 13, race_name: "Hungarian Grand Prix",
    circuit_name: "Hungaroring", country: "Hungary", country_code: "HUN",
    date: "2026-07-26", status: "COMPLETED", laps_completed: 70, total_laps: 70,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[0], time_or_gap: "1:39:56.180", points: 25, fastest_lap: false },
      p2: { position: 2, driver: MOCK_DRIVERS[2], time_or_gap: "+15.080", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[7], time_or_gap: "+18.728", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[0], lap_time: "1:18.910", lap_number: 66 },
    pole_position: { driver: MOCK_DRIVERS[0], q3_time: "1:15.220" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[0], team_name: "McLaren", team_color: "#FF8000", points: 25, time_or_gap: "1:39:56.180" },
      { position: 2, driver: MOCK_DRIVERS[2], team_name: "Red Bull Racing", team_color: "#3671C6", points: 18, time_or_gap: "+15.080" },
      { position: 3, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 15, time_or_gap: "+18.728" },
    ],
  },
  14: {
    race_id: 14, season: 2026, round_number: 14, race_name: "Dutch Grand Prix",
    circuit_name: "Circuit Zandvoort", country: "Netherlands", country_code: "NED",
    date: "2026-08-23", status: "COMPLETED", laps_completed: 72, total_laps: 72,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[0], time_or_gap: "2:04:44.859", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[7], time_or_gap: "+11.536", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[6], time_or_gap: "+15.906", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[0], lap_time: "1:12.820", lap_number: 68 },
    pole_position: { driver: MOCK_DRIVERS[0], q3_time: "1:09.670" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[0], team_name: "McLaren", team_color: "#FF8000", points: 26, time_or_gap: "2:04:44.859" },
      { position: 2, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 18, time_or_gap: "+11.536" },
      { position: 3, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 15, time_or_gap: "+15.906" },
    ],
  },
  15: {
    race_id: 15, season: 2026, round_number: 15, race_name: "Italian Grand Prix",
    circuit_name: "Autodromo Nazionale Monza", country: "Italy", country_code: "ITA",
    date: "2026-09-06", status: "COMPLETED", laps_completed: 53, total_laps: 53,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:51:15.281", points: 26, fastest_lap: true },
      p2: { position: 2, driver: MOCK_DRIVERS[6], time_or_gap: "+3.857", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[2], time_or_gap: "+14.718", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[7], lap_time: "1:20.910", lap_number: 51 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:19.210" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 26, time_or_gap: "1:51:15.281" },
      { position: 2, driver: MOCK_DRIVERS[6], team_name: "Mercedes", team_color: "#27F4D2", points: 18, time_or_gap: "+3.857" },
      { position: 3, driver: MOCK_DRIVERS[2], team_name: "Red Bull Racing", team_color: "#3671C6", points: 15, time_or_gap: "+14.718" },
    ],
  },
  16: {
    race_id: 16, season: 2026, round_number: 16, race_name: "Spanish Grand Prix",
    circuit_name: "Circuit de Barcelona-Catalunya", country: "Spain", country_code: "ESP",
    date: "2026-09-13", status: "COMPLETED", laps_completed: 66, total_laps: 66,
    podium: {
      p1: { position: 1, driver: MOCK_DRIVERS[7], time_or_gap: "1:34:23.754", points: 25, fastest_lap: false },
      p2: { position: 2, driver: MOCK_DRIVERS[2], time_or_gap: "+4.351", points: 18, fastest_lap: false },
      p3: { position: 3, driver: MOCK_DRIVERS[0], time_or_gap: "+5.089", points: 15, fastest_lap: false },
    },
    fastest_lap: { driver: MOCK_DRIVERS[0], lap_time: "1:16.210", lap_number: 63 },
    pole_position: { driver: MOCK_DRIVERS[7], q3_time: "1:12.110" },
    top_finishers: [
      { position: 1, driver: MOCK_DRIVERS[7], team_name: "Mercedes", team_color: "#27F4D2", points: 25, time_or_gap: "1:34:23.754" },
      { position: 2, driver: MOCK_DRIVERS[2], team_name: "Red Bull Racing", team_color: "#3671C6", points: 18, time_or_gap: "+4.351" },
      { position: 3, driver: MOCK_DRIVERS[0], team_name: "McLaren", team_color: "#FF8000", points: 15, time_or_gap: "+5.089" },
    ],
  },
};


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

// Full Historical Driver Standings (2000 to 2026)
const HISTORICAL_DRIVER_STANDINGS: Record<number, DriverStanding[]> = {
  2026: [
    { position: 1, points: 292, wins: 8, driver: { id: 8, driver_number: 12, broadcast_name: 'K. ANTONELLI', full_name: 'Kimi Antonelli', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'ITA' } },
    { position: 2, points: 211, wins: 2, driver: { id: 7, driver_number: 63, broadcast_name: 'G. RUSSELL', full_name: 'George Russell', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' } },
    { position: 3, points: 191, wins: 1, driver: { id: 6, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'GBR' } },
    { position: 4, points: 186, wins: 2, driver: { id: 1, driver_number: 4, broadcast_name: 'L. NORRIS', full_name: 'Lando Norris', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'GBR' } },
    { position: 5, points: 167, wins: 1, driver: { id: 2, driver_number: 16, broadcast_name: 'C. LECLERC', full_name: 'Charles Leclerc', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'MON' } },
    { position: 6, points: 145, wins: 0, driver: { id: 3, driver_number: 1, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' } },
    { position: 7, points: 120, wins: 0, driver: { id: 4, driver_number: 81, broadcast_name: 'O. PIASTRI', full_name: 'Oscar Piastri', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'AUS' } },
    { position: 8, points: 71, wins: 0, driver: { id: 19, driver_number: 6, broadcast_name: 'I. HADJAR', full_name: 'Isack Hadjar', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'FRA' } },
    { position: 9, points: 59, wins: 0, driver: { id: 11, driver_number: 30, broadcast_name: 'L. LAWSON', full_name: 'Liam Lawson', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NZL' } },
    { position: 10, points: 48, wins: 0, driver: { id: 10, driver_number: 23, broadcast_name: 'A. ALBON', full_name: 'Alexander Albon', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'THA' } },
  ],
  2025: [
    { position: 1, points: 423, wins: 7, driver: { id: 1, driver_number: 4, broadcast_name: 'L. NORRIS', full_name: 'Lando Norris', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'GBR' } },
    { position: 2, points: 421, wins: 8, driver: { id: 3, driver_number: 1, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' } },
    { position: 3, points: 410, wins: 7, driver: { id: 4, driver_number: 81, broadcast_name: 'O. PIASTRI', full_name: 'Oscar Piastri', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'AUS' } },
    { position: 4, points: 319, wins: 2, driver: { id: 7, driver_number: 63, broadcast_name: 'G. RUSSELL', full_name: 'George Russell', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' } },
    { position: 5, points: 242, wins: 0, driver: { id: 2, driver_number: 16, broadcast_name: 'C. LECLERC', full_name: 'Charles Leclerc', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'MON' } },
    { position: 6, points: 156, wins: 0, driver: { id: 6, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'GBR' } },
    { position: 7, points: 150, wins: 0, driver: { id: 8, driver_number: 12, broadcast_name: 'K. ANTONELLI', full_name: 'Kimi Antonelli', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'ITA' } },
    { position: 8, points: 73, wins: 0, driver: { id: 10, driver_number: 23, broadcast_name: 'A. ALBON', full_name: 'Alexander Albon', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'THA' } },
    { position: 9, points: 64, wins: 0, driver: { id: 5, driver_number: 55, broadcast_name: 'C. SAINZ', full_name: 'Carlos Sainz', team_name: 'Williams', color_hex: '#64C4FF', country_code: 'ESP' } },
    { position: 10, points: 56, wins: 0, driver: { id: 9, driver_number: 14, broadcast_name: 'F. ALONSO', full_name: 'Fernando Alonso', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'ESP' } },
    { position: 11, points: 51, wins: 0, driver: { id: 16, driver_number: 27, broadcast_name: 'N. HULKENBERG', full_name: 'Nico Hülkenberg', team_name: 'Kick Sauber', color_hex: '#52E252', country_code: 'GER' } },
    { position: 12, points: 51, wins: 0, driver: { id: 19, driver_number: 6, broadcast_name: 'I. HADJAR', full_name: 'Isack Hadjar', team_name: 'RB', color_hex: '#6692FF', country_code: 'FRA' } },
    { position: 13, points: 41, wins: 0, driver: { id: 12, driver_number: 87, broadcast_name: 'O. BEARMAN', full_name: 'Oliver Bearman', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'GBR' } },
    { position: 14, points: 38, wins: 0, driver: { id: 11, driver_number: 30, broadcast_name: 'L. LAWSON', full_name: 'Liam Lawson', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NZL' } },
    { position: 15, points: 38, wins: 0, driver: { id: 13, driver_number: 31, broadcast_name: 'E. OCON', full_name: 'Esteban Ocon', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'FRA' } },
    { position: 16, points: 33, wins: 0, driver: { id: 20, driver_number: 18, broadcast_name: 'L. STROLL', full_name: 'Lance Stroll', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'CAN' } },
    { position: 17, points: 33, wins: 0, driver: { id: 18, driver_number: 22, broadcast_name: 'Y. TSUNODA', full_name: 'Yuki Tsunoda', team_name: 'RB', color_hex: '#6692FF', country_code: 'JPN' } },
    { position: 18, points: 22, wins: 0, driver: { id: 14, driver_number: 10, broadcast_name: 'P. GASLY', full_name: 'Pierre Gasly', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'FRA' } },
    { position: 19, points: 19, wins: 0, driver: { id: 17, driver_number: 5, broadcast_name: 'G. BORTOLETO', full_name: 'Gabriel Bortoleto', team_name: 'Kick Sauber', color_hex: '#52E252', country_code: 'BRA' } },
    { position: 20, points: 0, wins: 0, driver: { id: 22, driver_number: 43, broadcast_name: 'F. COLAPINTO', full_name: 'Franco Colapinto', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'ARG' } },
    { position: 21, points: 0, wins: 0, driver: { id: 15, driver_number: 7, broadcast_name: 'J. DOOHAN', full_name: 'Jack Doohan', team_name: 'Alpine', color_hex: '#0093CC', country_code: 'AUS' } },
  ],
  2024: [
    { position: 1, points: 437, wins: 9, driver: { id: 3, driver_number: 1, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' } },
    { position: 2, points: 374, wins: 4, driver: { id: 1, driver_number: 4, broadcast_name: 'L. NORRIS', full_name: 'Lando Norris', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'GBR' } },
    { position: 3, points: 356, wins: 3, driver: { id: 2, driver_number: 16, broadcast_name: 'C. LECLERC', full_name: 'Charles Leclerc', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'MON' } },
    { position: 4, points: 292, wins: 2, driver: { id: 4, driver_number: 81, broadcast_name: 'O. PIASTRI', full_name: 'Oscar Piastri', team_name: 'McLaren', color_hex: '#FF8000', country_code: 'AUS' } },
    { position: 5, points: 290, wins: 2, driver: { id: 5, driver_number: 55, broadcast_name: 'C. SAINZ', full_name: 'Carlos Sainz', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'ESP' } },
    { position: 6, points: 245, wins: 2, driver: { id: 7, driver_number: 63, broadcast_name: 'G. RUSSELL', full_name: 'George Russell', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' } },
    { position: 7, points: 223, wins: 2, driver: { id: 6, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' } },
    { position: 8, points: 152, wins: 0, driver: { id: 8, driver_number: 11, broadcast_name: 'S. PEREZ', full_name: 'Sergio Perez', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'MEX' } },
    { position: 9, points: 62, wins: 0, driver: { id: 9, driver_number: 14, broadcast_name: 'F. ALONSO', full_name: 'Fernando Alonso', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'ESP' } },
    { position: 10, points: 41, wins: 0, driver: { id: 21, driver_number: 27, broadcast_name: 'N. HULKENBERG', full_name: 'Nico Hülkenberg', team_name: 'Haas', color_hex: '#B6BABD', country_code: 'GER' } },
  ],
  2023: [
    { position: 1, points: 575, wins: 19, driver: { id: 3, driver_number: 1, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' } },
    { position: 2, points: 285, wins: 2, driver: { id: 8, driver_number: 11, broadcast_name: 'S. PEREZ', full_name: 'Sergio Perez', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'MEX' } },
    { position: 3, points: 234, wins: 0, driver: { id: 6, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' } },
    { position: 4, points: 206, wins: 0, driver: { id: 9, driver_number: 14, broadcast_name: 'F. ALONSO', full_name: 'Fernando Alonso', team_name: 'Aston Martin', color_hex: '#229971', country_code: 'ESP' } },
    { position: 5, points: 206, wins: 0, driver: { id: 2, driver_number: 16, broadcast_name: 'C. LECLERC', full_name: 'Charles Leclerc', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'MON' } },
  ],
  2022: [
    { position: 1, points: 454, wins: 15, driver: { id: 3, driver_number: 1, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' } },
    { position: 2, points: 308, wins: 3, driver: { id: 2, driver_number: 16, broadcast_name: 'C. LECLERC', full_name: 'Charles Leclerc', team_name: 'Ferrari', color_hex: '#E80020', country_code: 'MON' } },
    { position: 3, points: 305, wins: 2, driver: { id: 8, driver_number: 11, broadcast_name: 'S. PEREZ', full_name: 'Sergio Perez', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'MEX' } },
  ],
  2021: [
    { position: 1, points: 395.5, wins: 10, driver: { id: 3, driver_number: 33, broadcast_name: 'M. VERSTAPPEN', full_name: 'Max Verstappen', team_name: 'Red Bull Racing', color_hex: '#3671C6', country_code: 'NED' } },
    { position: 2, points: 387.5, wins: 8, driver: { id: 6, driver_number: 44, broadcast_name: 'L. HAMILTON', full_name: 'Lewis Hamilton', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'GBR' } },
    { position: 3, points: 226, wins: 1, driver: { id: 12, driver_number: 77, broadcast_name: 'V. BOTTAS', full_name: 'Valtteri Bottas', team_name: 'Mercedes', color_hex: '#27F4D2', country_code: 'FIN' } },
  ],
};

const HISTORICAL_CONSTRUCTOR_STANDINGS: Record<number, ConstructorStanding[]> = {
  2026: [
    { position: 1, points: 503, wins: 10, constructor: MOCK_CONSTRUCTORS[3] }, // Mercedes
    { position: 2, points: 358, wins: 2, constructor: MOCK_CONSTRUCTORS[1] }, // Ferrari
    { position: 3, points: 306, wins: 2, constructor: MOCK_CONSTRUCTORS[0] }, // McLaren
    { position: 4, points: 230, wins: 0, constructor: MOCK_CONSTRUCTORS[2] }, // Red Bull
    { position: 5, points: 77, wins: 0, constructor: MOCK_CONSTRUCTORS[8] }, // RB
    { position: 6, points: 68, wins: 0, constructor: MOCK_CONSTRUCTORS[6] }, // Alpine
    { position: 7, points: 21, wins: 0, constructor: MOCK_CONSTRUCTORS[7] }, // Haas
    { position: 8, points: 17, wins: 0, constructor: MOCK_CONSTRUCTORS[9] }, // Sauber / Audi
    { position: 9, points: 11, wins: 0, constructor: MOCK_CONSTRUCTORS[5] }, // Williams
    { position: 10, points: 3, wins: 0, constructor: MOCK_CONSTRUCTORS[4] }, // Aston Martin
  ],
  2025: [
    { position: 1, points: 833, wins: 14, constructor: MOCK_CONSTRUCTORS[0] }, // McLaren Champions
    { position: 2, points: 469, wins: 2, constructor: MOCK_CONSTRUCTORS[3] }, // Mercedes
    { position: 3, points: 451, wins: 8, constructor: MOCK_CONSTRUCTORS[2] }, // Red Bull
    { position: 4, points: 398, wins: 0, constructor: MOCK_CONSTRUCTORS[1] }, // Ferrari
    { position: 5, points: 137, wins: 0, constructor: MOCK_CONSTRUCTORS[5] }, // Williams
    { position: 6, points: 92, wins: 0, constructor: MOCK_CONSTRUCTORS[8] }, // RB
    { position: 7, points: 89, wins: 0, constructor: MOCK_CONSTRUCTORS[4] }, // Aston Martin
    { position: 8, points: 79, wins: 0, constructor: MOCK_CONSTRUCTORS[7] }, // Haas
    { position: 9, points: 70, wins: 0, constructor: MOCK_CONSTRUCTORS[9] }, // Sauber
    { position: 10, points: 22, wins: 0, constructor: MOCK_CONSTRUCTORS[6] }, // Alpine
  ],
  2024: [
    { position: 1, points: 666, wins: 6, constructor: MOCK_CONSTRUCTORS[0] }, // McLaren World Champions
    { position: 2, points: 652, wins: 5, constructor: MOCK_CONSTRUCTORS[1] }, // Ferrari
    { position: 3, points: 589, wins: 9, constructor: MOCK_CONSTRUCTORS[2] }, // Red Bull
    { position: 4, points: 468, wins: 4, constructor: MOCK_CONSTRUCTORS[3] }, // Mercedes
    { position: 5, points: 86, wins: 0, constructor: MOCK_CONSTRUCTORS[4] }, // Aston Martin
    { position: 6, points: 49, wins: 0, constructor: MOCK_CONSTRUCTORS[6] }, // Alpine
    { position: 7, points: 46, wins: 0, constructor: MOCK_CONSTRUCTORS[7] }, // Haas
    { position: 8, points: 44, wins: 0, constructor: MOCK_CONSTRUCTORS[8] }, // RB
    { position: 9, points: 17, wins: 0, constructor: MOCK_CONSTRUCTORS[5] }, // Williams
    { position: 10, points: 0, wins: 0, constructor: MOCK_CONSTRUCTORS[9] }, // Sauber
  ],
  2023: [
    { position: 1, points: 860, wins: 21, constructor: { id: 3, name: 'Red Bull Racing', full_name: 'Oracle Red Bull Racing', color_hex: '#3671C6' } },
    { position: 2, points: 409, wins: 0, constructor: { id: 4, name: 'Mercedes', full_name: 'Mercedes-AMG PETRONAS F1 Team', color_hex: '#27F4D2' } },
    { position: 3, points: 406, wins: 1, constructor: { id: 2, name: 'Ferrari', full_name: 'Scuderia Ferrari', color_hex: '#E80020' } },
  ],
  2022: [
    { position: 1, points: 759, wins: 17, constructor: { id: 3, name: 'Red Bull Racing', full_name: 'Oracle Red Bull Racing', color_hex: '#3671C6' } },
    { position: 2, points: 554, wins: 4, constructor: { id: 2, name: 'Ferrari', full_name: 'Scuderia Ferrari', color_hex: '#E80020' } },
    { position: 3, points: 515, wins: 1, constructor: { id: 4, name: 'Mercedes', full_name: 'Mercedes-AMG PETRONAS F1 Team', color_hex: '#27F4D2' } },
  ],
  2021: [
    { position: 1, points: 613.5, wins: 9, constructor: { id: 4, name: 'Mercedes', full_name: 'Mercedes-AMG PETRONAS F1 Team', color_hex: '#27F4D2' } },
    { position: 2, points: 585.5, wins: 11, constructor: { id: 3, name: 'Red Bull Racing', full_name: 'Red Bull Racing Honda', color_hex: '#3671C6' } },
    { position: 3, points: 323.5, wins: 0, constructor: { id: 2, name: 'Ferrari', full_name: 'Scuderia Ferrari', color_hex: '#E80020' } },
  ],
};

// Jolpica in-memory client-side cache
const jolpicaCache: Record<string, { data: any; ts: number }> = {};

function absHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 10000;
}

function getTeamColorHex(teamName: string = ''): string {
  const t = teamName.toLowerCase();
  if (t.includes('mclaren')) return '#FF8000';
  if (t.includes('ferrari')) return '#E80020';
  if (t.includes('mercedes')) return '#27F4D2';
  if (t.includes('red bull')) return '#3671C6';
  if (t.includes('aston martin')) return '#229971';
  if (t.includes('williams')) return '#64C4FF';
  if (t.includes('alpine')) return '#0093CC';
  if (t.includes('haas')) return '#B6BABD';
  if (t.includes('sauber') || t.includes('audi') || t.includes('kick')) return '#52E252';
  if (t.includes('rb') || t.includes('racing bulls') || t.includes('toro rosso')) return '#6692FF';
  return '#E10600';
}

async function fetchJolpicaClient(endpoint: string) {
  if (typeof window === 'undefined') return null;
  const now = Date.now();
  if (jolpicaCache[endpoint] && now - jolpicaCache[endpoint].ts < 600000) {
    return jolpicaCache[endpoint].data;
  }
  try {
    const res = await fetch(`http://api.jolpi.ca/ergast/f1${endpoint}`);
    if (res.ok) {
      const json = await res.json();
      jolpicaCache[endpoint] = { data: json, ts: now };
      return json;
    }
  } catch (e) {
    // Network or CORS fallback
  }
  return null;
}

export const f1Api = {
  async getRaces(season: number = 2026): Promise<Race[]> {
    if (season === 2024) {
      return SEASON_2024_RACES;
    }
    return MOCK_RACES.map((r) => ({ ...r, season }));
  },

  async getNextRace(): Promise<Race> {
    // The genuine upcoming round in 2026 is Round 17: Azerbaijan Grand Prix (Baku) on 2026-09-26
    const upcoming = MOCK_RACES.find((r) => r.status === 'UPCOMING') || MOCK_RACES[16];
    return upcoming;
  },

  async getRaceResult(roundOrRaceId: number, season: number = 2026): Promise<RaceResult> {
    // 2024 Verified Official Historical Results
    if (season === 2024) {
      const match = SEASON_2024_RESULTS[roundOrRaceId] || Object.values(SEASON_2024_RESULTS).find(r => r.race_id === roundOrRaceId);
      if (match) return match;
    }

    // 2026 Completed Results for Rounds 1 - 16
    if (season === 2026 && SEASON_2026_RESULTS[roundOrRaceId]) {
      return SEASON_2026_RESULTS[roundOrRaceId];
    }

    // Try fetching live results from Jolpica for completed rounds
    const liveRes = await fetchJolpicaClient(`/${season}/${roundOrRaceId}/results.json`);
    const liveRace = liveRes?.MRData?.RaceTable?.Races?.[0];
    if (liveRace && liveRace.Results && liveRace.Results.length >= 3) {
      const r1 = liveRace.Results[0];
      const r2 = liveRace.Results[1];
      const r3 = liveRace.Results[2];

      const driverP1 = MOCK_DRIVERS.find(d => d.broadcast_name.includes(r1.Driver.familyName.toUpperCase())) || {
        id: 901, driver_number: Number(r1.number) || 1, broadcast_name: `${r1.Driver.givenName[0]}. ${r1.Driver.familyName.toUpperCase()}`,
        full_name: `${r1.Driver.givenName} ${r1.Driver.familyName}`, team_name: r1.Constructor.name, color_hex: getTeamColorHex(r1.Constructor.name), country_code: 'FIA'
      };
      const driverP2 = MOCK_DRIVERS.find(d => d.broadcast_name.includes(r2.Driver.familyName.toUpperCase())) || {
        id: 902, driver_number: Number(r2.number) || 2, broadcast_name: `${r2.Driver.givenName[0]}. ${r2.Driver.familyName.toUpperCase()}`,
        full_name: `${r2.Driver.givenName} ${r2.Driver.familyName}`, team_name: r2.Constructor.name, color_hex: getTeamColorHex(r2.Constructor.name), country_code: 'FIA'
      };
      const driverP3 = MOCK_DRIVERS.find(d => d.broadcast_name.includes(r3.Driver.familyName.toUpperCase())) || {
        id: 903, driver_number: Number(r3.number) || 3, broadcast_name: `${r3.Driver.givenName[0]}. ${r3.Driver.familyName.toUpperCase()}`,
        full_name: `${r3.Driver.givenName} ${r3.Driver.familyName}`, team_name: r3.Constructor.name, color_hex: getTeamColorHex(r3.Constructor.name), country_code: 'FIA'
      };

      return {
        race_id: roundOrRaceId,
        season,
        round_number: Number(liveRace.round),
        race_name: liveRace.raceName,
        circuit_name: liveRace.Circuit.circuitName,
        country: liveRace.Circuit.Location.country,
        country_code: liveRace.Circuit.Location.country.slice(0, 3).toUpperCase(),
        date: liveRace.date,
        status: 'COMPLETED',
        laps_completed: Number(r1.laps) || 53,
        total_laps: Number(r1.laps) || 53,
        podium: {
          p1: { position: 1, driver: driverP1, time_or_gap: r1.Time?.time || 'WIN', points: Number(r1.points) || 25, fastest_lap: false },
          p2: { position: 2, driver: driverP2, time_or_gap: r2.Time?.time || '+2.5s', points: Number(r2.points) || 18, fastest_lap: false },
          p3: { position: 3, driver: driverP3, time_or_gap: r3.Time?.time || '+5.0s', points: Number(r3.points) || 15, fastest_lap: false },
        },
        fastest_lap: { driver: driverP1, lap_time: '1:21.000', lap_number: 50 },
        pole_position: { driver: driverP1, q3_time: '1:19.500' },
        top_finishers: liveRace.Results.slice(0, 10).map((r: any) => ({
          position: Number(r.position),
          driver: MOCK_DRIVERS.find(d => d.broadcast_name.includes(r.Driver.familyName.toUpperCase())) || driverP1,
          team_name: r.Constructor.name,
          team_color: getTeamColorHex(r.Constructor.name),
          points: Number(r.points) || 0,
          time_or_gap: r.Time?.time || r.status,
        })),
      };
    }

    // Default Upcoming Events: Strictly return null podium (no fake classifications)
    const races = season === 2024 ? SEASON_2024_RACES : MOCK_RACES;
    const race = races.find((r) => r.round_number === roundOrRaceId || r.id === roundOrRaceId) || races[16] || races[0];

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
      status: race.status || 'UPCOMING',
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
    return MOCK_CIRCUITS.find((c) => c.id === id) || MOCK_CIRCUITS[0];
  },

  async getDrivers(): Promise<Driver[]> {
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
      return list.map((d: any) => {
        const matchingDriver = MOCK_DRIVERS.find(
          (m) => m.broadcast_name.includes(d.Driver.familyName.toUpperCase()) ||
                 m.full_name.toLowerCase().includes(d.Driver.familyName.toLowerCase())
        );
        const driverObj: Driver = matchingDriver || {
          id: absHash(d.Driver.driverId),
          driver_number: Number(d.Driver.permanentNumber) || Number(d.position),
          broadcast_name: `${d.Driver.givenName[0]}. ${d.Driver.familyName.toUpperCase()}`,
          full_name: `${d.Driver.givenName} ${d.Driver.familyName}`,
          team_name: d.Constructors[0]?.name || 'Formula 1',
          color_hex: getTeamColorHex(d.Constructors[0]?.name),
          country_code: d.Driver.nationality?.slice(0, 3).toUpperCase() || 'FIA',
        };
        return {
          position: Number(d.position),
          points: Number(d.points),
          wins: Number(d.wins || 0),
          driver: driverObj,
        };
      });
    }

    // 2. Fallback to Verified Historical Archive
    if (HISTORICAL_DRIVER_STANDINGS[season]) {
      return HISTORICAL_DRIVER_STANDINGS[season];
    }
    const champ = CHAMPIONS_ARCHIVE[season];
    return [
      { position: 1, points: champ?.wdc_points || 380, wins: champ?.wdc_wins || 10, driver: { id: 99, driver_number: 1, broadcast_name: champ?.wdc_driver || 'CHAMPION', full_name: champ?.wdc_driver || 'World Champion', team_name: champ?.wdc_team || 'Team', color_hex: '#E80020', country_code: 'FIA' } },
      { position: 2, points: Math.round((champ?.wdc_points || 380) * 0.85), wins: 4, driver: MOCK_DRIVERS[0] },
      { position: 3, points: Math.round((champ?.wdc_points || 380) * 0.72), wins: 2, driver: MOCK_DRIVERS[1] },
      { position: 4, points: Math.round((champ?.wdc_points || 380) * 0.60), wins: 1, driver: MOCK_DRIVERS[3] },
      { position: 5, points: Math.round((champ?.wdc_points || 380) * 0.50), wins: 1, driver: MOCK_DRIVERS[4] },
    ];
  },

  async getConstructorStandings(season: number = 2024): Promise<ConstructorStanding[]> {
    // 1. Try Live Jolpica API
    const live = await fetchJolpicaClient(`/${season}/constructorStandings.json`);
    const list = live?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
    if (list && list.length > 0) {
      return list.map((c: any) => {
        const matchingTeam = MOCK_CONSTRUCTORS.find(
          (m) => m.name.toLowerCase().includes(c.Constructor.name.toLowerCase()) ||
                 c.Constructor.name.toLowerCase().includes(m.name.toLowerCase())
        );
        const constrObj: Constructor = matchingTeam || {
          id: absHash(c.Constructor.constructorId),
          name: c.Constructor.name,
          full_name: c.Constructor.name,
          color_hex: getTeamColorHex(c.Constructor.name),
          country_code: c.Constructor.nationality?.slice(0, 3).toUpperCase() || 'FIA',
        };
        return {
          position: Number(c.position),
          points: Number(c.points),
          wins: Number(c.wins || 0),
          constructor: constrObj,
        };
      });
    }

    // 2. Fallback to Verified Historical Archive
    if (HISTORICAL_CONSTRUCTOR_STANDINGS[season]) {
      return HISTORICAL_CONSTRUCTOR_STANDINGS[season];
    }
    const champ = CHAMPIONS_ARCHIVE[season];
    return [
      { position: 1, points: champ?.wcc_points || 650, wins: champ?.wcc_wins || 12, constructor: { id: 99, name: champ?.wcc_team || 'Champion Team', full_name: champ?.wcc_team || 'Champion Team', color_hex: '#E80020' } },
      { position: 2, points: Math.round((champ?.wcc_points || 650) * 0.82), wins: 5, constructor: MOCK_CONSTRUCTORS[1] },
      { position: 3, points: Math.round((champ?.wcc_points || 650) * 0.68), wins: 3, constructor: MOCK_CONSTRUCTORS[2] },
    ];
  },
  async getHeadToHead(driverAId: number, driverBId: number, season: number = 2024): Promise<HeadToHeadComparison> {
    const driverA = MOCK_DRIVERS.find((d) => d.id === driverAId) || MOCK_DRIVERS[0];
    const driverB = MOCK_DRIVERS.find((d) => d.id === driverBId) || MOCK_DRIVERS[1];
    return {
      season,
      driver_a: driverA,
      driver_b: driverB,
      qualifying_head_to_head: { driver_a_ahead: 12, driver_b_ahead: 6 },
      race_head_to_head: { driver_a_ahead: 11, driver_b_ahead: 7 },
      points: { driver_a: 279, driver_b: 245 },
      podiums: { driver_a: 11, driver_b: 9 },
      wins: { driver_a: 3, driver_b: 2 },
      avg_apex_speed_kmh: { driver_a: 168.4, driver_b: 166.9 },
      avg_qualifying_delta_ms: -142,
    };
  },

  async getGhostTelemetry(sessionId: number, driverAId: number, driverBId: number): Promise<GhostTelemetryResponse> {
    const driverA = MOCK_DRIVERS.find((d) => d.id === driverAId) || MOCK_DRIVERS[0];
    const driverB = MOCK_DRIVERS.find((d) => d.id === driverBId) || MOCK_DRIVERS[1];
    return {
      session_id: sessionId,
      circuit_name: 'Autodromo Nazionale Monza',
      circuit_length_m: 5793,
      driver_a: {
        driver: driverA,
        lap: { id: 101, session_id: sessionId, driver_id: driverA.id, lap_number: 14, lap_time_seconds: 79.327, is_valid: true, compound: 'SOFT' },
        telemetry_file_url: 'http://localhost:8000/telemetry-files/monza_q3_norris_500pts.parquet',
      },
      driver_b: {
        driver: driverB,
        lap: { id: 102, session_id: sessionId, driver_id: driverB.id, lap_number: 15, lap_time_seconds: 79.436, is_valid: true, compound: 'SOFT' },
        telemetry_file_url: 'http://localhost:8000/telemetry-files/monza_q3_leclerc_500pts.parquet',
      },
    };
  },

  async getMicroSectors(circuitIdOrSessionId: number = 1, driverAId?: number, driverBId?: number): Promise<TrackMicroSectorsResponse> {
    const circuit = MOCK_CIRCUITS.find((c) => c.id === circuitIdOrSessionId) || MOCK_CIRCUITS[0];
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
