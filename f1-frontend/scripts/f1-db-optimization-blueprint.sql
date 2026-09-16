-- =========================================================================
-- KERS F1 PRODUCTION DATABASE SCHEMA & INDEXING BLUEPRINT (PostgreSQL 16+)
-- =========================================================================
-- Optimized for millisecond-latency telemetry ingestion, driver head-to-head
-- comparisons, and real-time fastest lap leaderboards.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- 2. SEASONS TABLE
CREATE TABLE IF NOT EXISTS seasons (
    year INT PRIMARY KEY,
    rounds_count INT NOT NULL DEFAULT 24,
    technical_regulations_era VARCHAR(64),
    is_active BOOLEAN DEFAULT false
);

-- 3. CIRCUITS TABLE
CREATE TABLE IF NOT EXISTS circuits (
    id SERIAL PRIMARY KEY,
    circuit_name VARCHAR(128) NOT NULL,
    country VARCHAR(64) NOT NULL,
    city VARCHAR(64) NOT NULL,
    length_km NUMERIC(5,3) NOT NULL,
    corners_count INT NOT NULL,
    drs_zones_count INT NOT NULL,
    lap_record_time VARCHAR(16) NOT NULL,
    lap_record_driver VARCHAR(64) NOT NULL,
    lap_record_year INT NOT NULL,
    lap_record_team VARCHAR(64) NOT NULL,
    geometry_svg_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Circuit Index: Instant query by name / country
CREATE INDEX IF NOT EXISTS idx_circuits_country_city ON circuits(country, city);

-- 4. RACES TABLE
CREATE TABLE IF NOT EXISTS races (
    id SERIAL PRIMARY KEY,
    season INT NOT NULL REFERENCES seasons(year) ON DELETE CASCADE,
    round_number INT NOT NULL,
    race_name VARCHAR(128) NOT NULL,
    circuit_id INT NOT NULL REFERENCES circuits(id),
    status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
    race_date DATE NOT NULL,
    weather_condition VARCHAR(64) DEFAULT 'Dry',
    air_temp_celsius NUMERIC(4,1),
    track_temp_celsius NUMERIC(4,1),
    UNIQUE (season, round_number)
);

-- Composite Index for fast calendar lookups
CREATE INDEX IF NOT EXISTS idx_races_season_round ON races(season, round_number);
CREATE INDEX IF NOT EXISTS idx_races_circuit ON races(circuit_id);

-- 5. DRIVERS & CONSTRUCTORS
CREATE TABLE IF NOT EXISTS constructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    full_name VARCHAR(128) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    country_code VARCHAR(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    driver_number INT NOT NULL UNIQUE,
    broadcast_name VARCHAR(32) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    team_id INT NOT NULL REFERENCES constructors(id),
    country_code VARCHAR(3) NOT NULL,
    active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_drivers_team ON drivers(team_id);

-- 6. RACE RESULTS TABLE
CREATE TABLE IF NOT EXISTS race_results (
    id BIGSERIAL PRIMARY KEY,
    race_id INT NOT NULL REFERENCES races(id) ON DELETE CASCADE,
    driver_id INT NOT NULL REFERENCES drivers(id),
    constructor_id INT NOT NULL REFERENCES constructors(id),
    grid_position INT NOT NULL,
    finish_position INT,
    status VARCHAR(32) NOT NULL DEFAULT 'Finished',
    points NUMERIC(5,2) NOT NULL DEFAULT 0,
    laps_completed INT NOT NULL DEFAULT 0,
    time_millis INT,
    fastest_lap_rank INT,
    fastest_lap_time VARCHAR(16),
    fastest_lap_speed_kmh NUMERIC(6,3),
    UNIQUE (race_id, driver_id)
);

-- Critical High-Performance Indexes
-- 1) Covering index for Standings aggregation
CREATE INDEX IF NOT EXISTS idx_results_race_driver_points 
ON race_results (race_id, driver_id) INCLUDE (points, finish_position);

-- 2) Covering index for fastest lap leaderboards
CREATE INDEX IF NOT EXISTS idx_results_fastest_lap 
ON race_results (race_id, fastest_lap_rank) INCLUDE (driver_id, fastest_lap_time)
WHERE fastest_lap_rank = 1;

-- 7. PARTITIONED TELEMETRY LAPS TABLE (Timeseries / high volume)
CREATE TABLE IF NOT EXISTS lap_telemetry (
    id BIGSERIAL,
    race_id INT NOT NULL,
    driver_id INT NOT NULL,
    lap_number INT NOT NULL,
    distance_m NUMERIC(7,2) NOT NULL,
    speed_kmh NUMERIC(5,1) NOT NULL,
    throttle_pct NUMERIC(4,1) NOT NULL,
    brake_active BOOLEAN NOT NULL,
    gear INT NOT NULL,
    drs_status INT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (id, race_id)
) PARTITION BY RANGE (race_id);

-- Partition indexing
CREATE INDEX IF NOT EXISTS idx_telemetry_query 
ON lap_telemetry (race_id, driver_id, lap_number, distance_m);
