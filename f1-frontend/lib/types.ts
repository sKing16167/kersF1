export interface CornerDetail {
  corner_number: number;
  corner_name?: string;
  gear: number;
  min_speed_kmh: number;
  lateral_g: number;
  brake_zone?: boolean;
  drs_zone?: boolean;
  notes?: string;
  x?: number;
  y?: number;
}

export interface Circuit {
  id: number;
  circuit_name: string;
  location: string;
  country: string;
  country_code: string;
  lat: number;
  lng: number;
  length_km: number;
  corners_count: number;
  drs_zones: number;
  lap_record?: string;
  lap_record_driver?: string;
  lap_record_year?: number;
  lap_record_team?: string;
  full_throttle_pct: number;
  downforce_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'MAXIMUM' | 'ULTRA-LOW' | 'MEDIUM-HIGH' | 'LOW-MEDIUM';
  tyre_stress_level: 1 | 2 | 3 | 4 | 5;
  brake_wear_index: 'LOW' | 'MODERATE' | 'MEDIUM' | 'HEAVY' | 'VERY HEAVY';
  gear_shifts_per_lap: number;
  pit_loss_time_sec: number;
  first_grand_prix_year: number;
  elevation_gain_m: number;
  description: string;
  svg_path: string;
  optimal_line_svg?: string;
  view_box?: string;
  start_finish?: { x: number; y: number; label_x?: number; label_y?: number };
  corners: CornerDetail[];
}

export interface Driver {
  id: number;
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  team_name: string;
  color_hex: string;
  country_code: string;
  headshot_url?: string;
}

export interface Constructor {
  id: number;
  name: string;
  full_name: string;
  color_hex: string;
  country_code?: string;
}

export interface DriverStanding {
  position: number;
  points: number;
  wins: number;
  driver: Driver;
}

export interface ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  constructor: Constructor;
}

export interface SeasonChampion {
  season: number;
  wdc_driver: string;
  wdc_team: string;
  wdc_points: number;
  wdc_wins: number;
  wcc_team: string;
  wcc_points: number;
  wcc_wins: number;
  notes?: string;
}

export interface Session {
  id: number;
  race_id: number;
  session_type: 'FP1' | 'FP2' | 'FP3' | 'Q' | 'SQ' | 'S' | 'R';
  session_name: string;
  date?: string;
}

export interface Race {
  id: number;
  season: number;
  round_number: number;
  race_name: string;
  official_event_name?: string;
  circuit: Circuit;
  sessions?: Session[];
  status?: 'COMPLETED' | 'UPCOMING' | 'LIVE';
  date?: string;
}

export interface PodiumFinisher {
  position: 1 | 2 | 3;
  driver: Driver;
  time_or_gap: string;
  points: number;
  grid_start?: number;
  fastest_lap?: boolean;
}

export interface TopFinisher {
  position: number;
  driver: Driver;
  team_name: string;
  team_color: string;
  points: number;
  time_or_gap: string;
  grid_start?: number;
  pit_stops?: number;
}

export interface FastestLapInfo {
  driver: Driver;
  lap_time: string;
  lap_number: number;
  avg_speed_kmh?: number;
}

export interface RaceResult {
  race_id: number;
  season: number;
  round_number: number;
  race_name: string;
  circuit_name: string;
  country: string;
  country_code: string;
  date: string;
  status: 'COMPLETED' | 'UPCOMING' | 'LIVE';
  laps_completed: number;
  total_laps: number;
  podium?: {
    p1: PodiumFinisher;
    p2: PodiumFinisher;
    p3: PodiumFinisher;
  } | null;
  top_finishers?: TopFinisher[];
  fastest_lap?: FastestLapInfo | null;
  pole_position?: {
    driver: Driver;
    q3_time: string;
  } | null;
  dnf_count?: number;
  safety_cars?: number;
}

export interface Lap {
  id: number;
  session_id: number;
  driver_id: number;
  lap_number: number;
  lap_time_seconds: number;
  is_valid: boolean;
  compound?: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';
  tyre_age?: number;
  sector1_time?: number;
  sector2_time?: number;
  sector3_time?: number;
}

export interface TelemetryPoint {
  distance: number;       // Normalized track distance (0..circuit_length)
  speed: number;          // km/h
  throttle: number;       // 0..100
  brake: number;          // 0 or 1, or 0..100
  n_gear: number;         // 1..8
  drs: number;            // 0..14 (drs active > 0)
  rpm?: number;
  time_sec?: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface GhostTelemetryResponse {
  session_id: number;
  circuit_name: string;
  circuit_length_m: number;
  driver_a: {
    driver: Driver;
    lap: Lap;
    telemetry_file_url: string;
  };
  driver_b: {
    driver: Driver;
    lap: Lap;
    telemetry_file_url: string;
  };
}

export interface MicroSector {
  sector_index: number;
  start_distance_m: number;
  end_distance_m: number;
  apex_distance_m: number;
  fastest_driver_id: number;
  fastest_driver_name: string;
  fastest_team_color: string;
  fastest_apex_speed_kmh: number;
  driver_a_apex_speed_kmh?: number;
  driver_b_apex_speed_kmh?: number;
  delta_kmh?: number;
  svg_path_segment?: string;
  nearest_corner?: string;
}

export interface TrackMicroSectorsResponse {
  session_id: number;
  circuit_id?: number;
  circuit_name: string;
  total_distance_m: number;
  sectors: MicroSector[];
}

export interface UndercutPredictionRequest {
  session_id: number;
  target_driver_id: number;
  rival_driver_id: number;
  current_lap: number;
  gap_seconds: number;
  pit_loss_seconds: number;
  target_compound_in: string;
  target_compound_out: string;
  rival_compound_in: string;
}

export interface UndercutPredictionResponse {
  optimal_pit_lap: number;
  predicted_delta_after_pit: number;
  success_probability: number;
  strategy_type: 'UNDERCUT' | 'OVERCUT';
  target_pace_curve: Array<{ lap: number; lap_time_est: number }>;
  rival_pace_curve: Array<{ lap: number; lap_time_est: number }>;
  crossover_lap: number;
  recommendation_text: string;
}

export interface RadioMessage {
  id: number;
  session_id: number;
  driver_id: number;
  lap_number: number;
  session_time_seconds: number;
  audio_url: string;
  transcript: string;
  sentiment?: 'PANIC' | 'CONFIDENT' | 'ANGER' | 'CALM' | 'TACTICAL';
  driver?: Driver;
}

export interface HeadToHeadComparison {
  season: number;
  driver_a: Driver;
  driver_b: Driver;
  qualifying_head_to_head: { driver_a_ahead: number; driver_b_ahead: number };
  race_head_to_head: { driver_a_ahead: number; driver_b_ahead: number };
  points: { driver_a: number; driver_b: number };
  podiums: { driver_a: number; driver_b: number };
  wins: { driver_a: number; driver_b: number };
  avg_apex_speed_kmh: { driver_a: number; driver_b: number };
  avg_qualifying_delta_ms: number;
}
