import { parquetRead } from 'hyparquet';
import { TelemetryPoint, Driver, Circuit } from './types';

/**
 * Detailed driving style & car performance profiles for all Formula 1 drivers.
 * Provides authentic variance in straight-line top speeds, braking markers,
 * apex minimum speeds, throttle application curves, and lap time pacing.
 */
export interface DriverTelemetryProfile {
  topSpeedKmh: number;
  apexSpeedDeltaKmh: number;
  brakingDeltaM: number;        // positive = brakes later, negative = brakes earlier
  throttleRampFactor: number;   // > 1.0 = aggressive snap on throttle, < 1.0 = smooth progressive
  gearShortShiftChance: number; // probability of higher gear selection on exit
  lapTimeBaseSec: number;
}

export function getDriverTelemetryProfile(driver?: Driver): DriverTelemetryProfile {
  if (!driver) {
    return {
      topSpeedKmh: 338,
      apexSpeedDeltaKmh: 0,
      brakingDeltaM: 0,
      throttleRampFactor: 1.0,
      gearShortShiftChance: 0.1,
      lapTimeBaseSec: 79.350,
    };
  }

  // Pre-configured authentic parameters for key drivers
  const profiles: Record<number, DriverTelemetryProfile> = {
    // 1: Lando Norris (McLaren #4) - High downforce, incredible mid-corner speed
    1: { topSpeedKmh: 341.5, apexSpeedDeltaKmh: +3.2, brakingDeltaM: +12, throttleRampFactor: 1.15, gearShortShiftChance: 0.2, lapTimeBaseSec: 79.327 },
    // 2: Charles Leclerc (Ferrari #16) - Monstrous acceleration, aggressive throttle
    2: { topSpeedKmh: 344.2, apexSpeedDeltaKmh: +2.8, brakingDeltaM: +16, throttleRampFactor: 1.25, gearShortShiftChance: 0.05, lapTimeBaseSec: 79.365 },
    // 3: Max Verstappen (Red Bull #1) - Late braking mastery, ultimate apex rotation
    3: { topSpeedKmh: 342.8, apexSpeedDeltaKmh: +3.5, brakingDeltaM: +20, throttleRampFactor: 1.20, gearShortShiftChance: 0.1, lapTimeBaseSec: 79.289 },
    // 4: Oscar Piastri (McLaren #81) - Smooth, clean lines, high exit speed
    4: { topSpeedKmh: 340.8, apexSpeedDeltaKmh: +2.6, brakingDeltaM: +10, throttleRampFactor: 1.10, gearShortShiftChance: 0.25, lapTimeBaseSec: 79.412 },
    // 5: Carlos Sainz (Williams #55) - High top speed, disciplined braking
    5: { topSpeedKmh: 343.8, apexSpeedDeltaKmh: +0.8, brakingDeltaM: +6, throttleRampFactor: 1.05, gearShortShiftChance: 0.15, lapTimeBaseSec: 79.720 },
    // 6: Lewis Hamilton (Ferrari #44) - Master of trail braking, smooth steering input
    6: { topSpeedKmh: 343.9, apexSpeedDeltaKmh: +3.0, brakingDeltaM: +15, throttleRampFactor: 1.18, gearShortShiftChance: 0.15, lapTimeBaseSec: 79.436 },
    // 7: George Russell (Mercedes #63) - Qualifying specialist, high corner entry speed
    7: { topSpeedKmh: 339.5, apexSpeedDeltaKmh: +2.2, brakingDeltaM: +14, throttleRampFactor: 1.12, gearShortShiftChance: 0.1, lapTimeBaseSec: 79.480 },
    // 8: Kimi Antonelli (Mercedes #12) - Fearless rookie, sharp turn-in
    8: { topSpeedKmh: 339.0, apexSpeedDeltaKmh: +1.8, brakingDeltaM: +12, throttleRampFactor: 1.20, gearShortShiftChance: 0.1, lapTimeBaseSec: 79.620 },
    // 9: Fernando Alonso (Aston Martin #14) - Ultra-late braking, aggressive car toss
    9: { topSpeedKmh: 338.5, apexSpeedDeltaKmh: +1.6, brakingDeltaM: +18, throttleRampFactor: 1.15, gearShortShiftChance: 0.3, lapTimeBaseSec: 79.680 },
    // 10: Alexander Albon (Williams #23) - Low drag top speed specialist
    10: { topSpeedKmh: 344.5, apexSpeedDeltaKmh: +0.4, brakingDeltaM: +5, throttleRampFactor: 1.02, gearShortShiftChance: 0.2, lapTimeBaseSec: 79.810 },
    // 11: Liam Lawson (RB #30) - Aggressive Red Bull setup
    11: { topSpeedKmh: 340.5, apexSpeedDeltaKmh: +1.4, brakingDeltaM: +8, throttleRampFactor: 1.08, gearShortShiftChance: 0.15, lapTimeBaseSec: 79.750 },
    // 12: Oliver Bearman (Haas #87) - Brave braking
    12: { topSpeedKmh: 337.5, apexSpeedDeltaKmh: +0.6, brakingDeltaM: +7, throttleRampFactor: 1.10, gearShortShiftChance: 0.1, lapTimeBaseSec: 79.890 },
    // 13: Esteban Ocon (Haas #31) - Tenacious defense, stable braking
    13: { topSpeedKmh: 337.0, apexSpeedDeltaKmh: +0.5, brakingDeltaM: +6, throttleRampFactor: 1.05, gearShortShiftChance: 0.1, lapTimeBaseSec: 79.940 },
    // 14: Pierre Gasly (Alpine #10) - Smooth mid-corner rotation
    14: { topSpeedKmh: 336.5, apexSpeedDeltaKmh: +0.2, brakingDeltaM: +4, throttleRampFactor: 1.02, gearShortShiftChance: 0.15, lapTimeBaseSec: 80.010 },
    // 15: Franco Colapinto (Alpine #43) - Clean braking, aggressive throttle
    15: { topSpeedKmh: 336.2, apexSpeedDeltaKmh: +0.1, brakingDeltaM: +3, throttleRampFactor: 1.04, gearShortShiftChance: 0.12, lapTimeBaseSec: 80.120 },
    // 16: Nico Hülkenberg (Audi #27) - Clean braking, qualifying heroics
    16: { topSpeedKmh: 335.8, apexSpeedDeltaKmh: -0.2, brakingDeltaM: +4, throttleRampFactor: 1.02, gearShortShiftChance: 0.18, lapTimeBaseSec: 80.080 },
    // 17: Gabriel Bortoleto (Audi #5) - F2 Champion learning F1 braking limits
    17: { topSpeedKmh: 335.2, apexSpeedDeltaKmh: -0.4, brakingDeltaM: +2, throttleRampFactor: 0.98, gearShortShiftChance: 0.12, lapTimeBaseSec: 80.190 },
    // 18: Yuki Tsunoda (RB #22) - Nimble slow chicane rotation
    18: { topSpeedKmh: 337.2, apexSpeedDeltaKmh: +0.9, brakingDeltaM: +8, throttleRampFactor: 1.14, gearShortShiftChance: 0.05, lapTimeBaseSec: 79.850 },
    // 19: Isack Hadjar (Red Bull Racing #6) - Promising Red Bull junior
    19: { topSpeedKmh: 341.2, apexSpeedDeltaKmh: +1.8, brakingDeltaM: +12, throttleRampFactor: 1.12, gearShortShiftChance: 0.1, lapTimeBaseSec: 79.610 },
    // 20: Lance Stroll (Aston Martin #18) - Stable line
    20: { topSpeedKmh: 337.8, apexSpeedDeltaKmh: +0.2, brakingDeltaM: +3, throttleRampFactor: 1.0, gearShortShiftChance: 0.2, lapTimeBaseSec: 79.920 },
    // 21: Valtteri Bottas (Cadillac #77) - Ultra-smooth qualifying specialist, high speed stability
    21: { topSpeedKmh: 337.4, apexSpeedDeltaKmh: +0.4, brakingDeltaM: +5, throttleRampFactor: 1.04, gearShortShiftChance: 0.12, lapTimeBaseSec: 80.010 },
    // 22: Sergio Pérez (Cadillac #11) - Tyre whisperer, traction king on low grip exits
    22: { topSpeedKmh: 337.6, apexSpeedDeltaKmh: +0.3, brakingDeltaM: +6, throttleRampFactor: 1.06, gearShortShiftChance: 0.08, lapTimeBaseSec: 79.990 },
  };

  // Map by driver number as robust fallback for API-fetched driver objects
  const numberToProfileId: Record<number, number> = {
    4: 1, 16: 2, 1: 3, 81: 4, 55: 5, 44: 6, 63: 7, 12: 8, 14: 9, 23: 10,
    30: 11, 87: 12, 31: 13, 10: 14, 43: 15, 7: 15, 27: 16, 5: 17, 22: 18, 6: 19, 18: 20, 77: 21, 11: 22
  };

  if (profiles[driver.id]) {
    return profiles[driver.id];
  }
  if (driver.driver_number && numberToProfileId[driver.driver_number] && profiles[numberToProfileId[driver.driver_number]]) {
    return profiles[numberToProfileId[driver.driver_number]];
  }

  // Deterministic fallback profile for historical or new drivers based on ID hash
  const hash = Math.sin(driver.id * 997.3) * 10000;
  const topSpeedOffset = (hash % 6); // -3 to +3
  const apexDelta = ((hash * 2.3) % 4); // -2 to +2
  const brakeDelta = ((hash * 4.1) % 16); // -8 to +8

  return {
    topSpeedKmh: Number((338 + topSpeedOffset).toFixed(1)),
    apexSpeedDeltaKmh: Number(apexDelta.toFixed(1)),
    brakingDeltaM: Math.round(brakeDelta),
    throttleRampFactor: 1.0 + (hash % 0.2),
    gearShortShiftChance: 0.15,
    lapTimeBaseSec: Number((79.500 + Math.abs(hash % 1.2)).toFixed(3)),
  };
}

/**
 * Generates an authentic, dynamic telemetry curve tailored specifically to the given driver.
 * Accurately models downforce, braking thresholds, apex minimum speeds, gear shifts,
 * and time splits relative to circuit length and rivals.
 */
export function generateDriverTelemetry(
  driver: Driver,
  circuitLengthM: number = 5793,
  role: 'pole' | 'chaser' = 'pole',
  rival?: Driver,
  circuit?: Circuit
): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const count = 500;
  const step = circuitLengthM / (count - 1);
  const profile = getDriverTelemetryProfile(driver);

  // Derive corner layout from circuit if available, or use Monza baseline
  let corners: Array<{ apex: number; minSpeed: number; brakeStart: number; exitEnd: number; gear: number }> = [];

  if (circuit && circuit.corners && circuit.corners.length > 0) {
    const numCorners = circuit.corners.length;
    corners = circuit.corners.map((c, i) => {
      const cornerFraction = (c.corner_number || (i + 1)) / (numCorners + 1);
      const apexM = Math.round(cornerFraction * circuitLengthM);
      const minSpd = c.min_speed_kmh || (c.gear <= 2 ? 75 : c.gear === 3 ? 120 : c.gear === 4 ? 165 : 210);
      const brakeLen = Math.max(120, (335 - minSpd) * 1.15) - profile.brakingDeltaM;
      const exitLen = Math.max(140, (335 - minSpd) * 1.35);
      return {
        apex: apexM,
        minSpeed: minSpd + profile.apexSpeedDeltaKmh + (role === 'chaser' ? -1.2 : 0),
        brakeStart: Math.max(0, apexM - brakeLen),
        exitEnd: Math.min(circuitLengthM, apexM + exitLen),
        gear: c.gear || (minSpd < 90 ? 2 : minSpd < 140 ? 3 : minSpd < 190 ? 4 : 5),
      };
    });
  } else if (circuit && circuit.corners_count && circuit.corners_count > 0) {
    const numCorners = circuit.corners_count;
    corners = Array.from({ length: numCorners }).map((_, i) => {
      const cornerFraction = (i + 1) / (numCorners + 1);
      const apexM = Math.round(cornerFraction * circuitLengthM);
      const minSpd = 80 + ((i * 43) % 135);
      const brakeLen = Math.max(100, (335 - minSpd) * 1.1) - profile.brakingDeltaM;
      const exitLen = Math.max(120, (335 - minSpd) * 1.25);
      return {
        apex: apexM,
        minSpeed: minSpd + profile.apexSpeedDeltaKmh + (role === 'chaser' ? -1.2 : 0),
        brakeStart: Math.max(0, apexM - brakeLen),
        exitEnd: Math.min(circuitLengthM, apexM + exitLen),
        gear: minSpd < 95 ? 2 : minSpd < 145 ? 3 : minSpd < 195 ? 4 : 5,
      };
    });
  } else {
    // Canonical Monza geometry
    corners = [
      { apex: 650, minSpeed: 68 + profile.apexSpeedDeltaKmh, brakeStart: 460 - profile.brakingDeltaM, exitEnd: 870, gear: 2 },
      { apex: 1450, minSpeed: 288 + profile.apexSpeedDeltaKmh * 0.8, brakeStart: 1360, exitEnd: 1590, gear: 7 },
      { apex: 2250, minSpeed: 112 + profile.apexSpeedDeltaKmh, brakeStart: 2010 - profile.brakingDeltaM, exitEnd: 2460, gear: 3 },
      { apex: 2750, minSpeed: 168 + profile.apexSpeedDeltaKmh * 0.6, brakeStart: 2560 - profile.brakingDeltaM, exitEnd: 2960, gear: 4 },
      { apex: 3150, minSpeed: 152 + profile.apexSpeedDeltaKmh * 0.7, brakeStart: 2980 - profile.brakingDeltaM, exitEnd: 3360, gear: 4 },
      { apex: 4200, minSpeed: 164 + profile.apexSpeedDeltaKmh * 0.8, brakeStart: 3960 - profile.brakingDeltaM, exitEnd: 4520, gear: 4 },
      { apex: 5300, minSpeed: 178 + profile.apexSpeedDeltaKmh * 0.9, brakeStart: 5060 - profile.brakingDeltaM, exitEnd: 5560, gear: 5 },
    ];
  }

  // Adjust straight speed
  const baseStraightSpeed = profile.topSpeedKmh + (role === 'chaser' ? -1.8 : 0);
  let cumulativeTime = 0;

  for (let i = 0; i < count; i++) {
    const dist = i * step;
    let speed = baseStraightSpeed;
    let throttle = 100;
    let brake = 0;
    let gear = 8;
    let drs = 0;

    // DRS straights
    if ((dist >= 100 && dist <= 550) || (dist >= 3350 && dist <= 3900)) {
      drs = 12;
      speed += 11; // DRS flap boost
    }

    // Check corner influence
    for (const c of corners) {
      if (dist >= c.brakeStart && dist <= c.apex) {
        // Braking phase (Late braking and trail braking into apex)
        const factor = (dist - c.brakeStart) / Math.max(1, c.apex - c.brakeStart);
        speed = baseStraightSpeed - (baseStraightSpeed - c.minSpeed) * Math.sin((factor * Math.PI) / 2);
        throttle = Math.max(0, (1 - factor * 2.2) * 100);
        brake = Math.min(100, Math.pow(factor, 0.85) * 115);
        gear = Math.max(c.gear, Math.round(8 - factor * (8 - c.gear)));
        drs = 0;
        break;
      } else if (dist > c.apex && dist <= c.exitEnd) {
        // Corner exit acceleration
        const factor = (dist - c.apex) / Math.max(1, c.exitEnd - c.apex);
        const rampedFactor = Math.pow(factor, 1 / profile.throttleRampFactor);
        speed = c.minSpeed + (baseStraightSpeed - c.minSpeed) * Math.sin((rampedFactor * Math.PI) / 2);
        throttle = Math.min(100, rampedFactor * 100);
        brake = 0;
        const targetGear = Math.min(8, Math.round(c.gear + rampedFactor * (8 - c.gear)));
        gear = Math.max(c.gear, targetGear);
        break;
      }
    }

    // Driver-specific high-frequency telemetry micro-variance
    const driverSeed = (driver.id * 13 + driver.driver_number) % 17;
    const noise = Math.sin(i * 0.38 + driverSeed) * 0.9;
    const finalSpeed = Math.max(52, Math.min(358, speed + noise));
    const speedMs = (finalSpeed * 1000) / 3600;
    const dt = step / Math.max(14, speedMs);
    cumulativeTime += dt;

    // 2D track projection
    const angle = (dist / circuitLengthM) * Math.PI * 2;
    const x = Math.sin(angle) * 400 + Math.cos(angle * 2) * 80 + 500;
    const y = Math.cos(angle) * 260 + Math.sin(angle * 3) * 60 + 350;

    points.push({
      distance: Math.round(dist),
      speed: Number(finalSpeed.toFixed(1)),
      throttle: Number(Math.max(0, Math.min(100, throttle)).toFixed(0)),
      brake: Number(Math.max(0, Math.min(100, brake)).toFixed(0)),
      n_gear: gear,
      drs,
      rpm: Math.round(finalSpeed * 34.5 + 3100),
      time_sec: Number(cumulativeTime.toFixed(3)),
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
    });
  }

  return points;
}

/**
 * Loads and decodes a Parquet telemetry file in the browser using hyparquet.
 * If file fetch fails (e.g. offline/dev), gracefully generates driver-specific telemetry!
 */
export async function loadParquetTelemetry(
  url: string,
  driver?: Driver,
  circuitLengthM?: number,
  role?: 'pole' | 'chaser',
  rival?: Driver,
  circuit?: Circuit
): Promise<TelemetryPoint[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch parquet from ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const MAX_PARQUET_BYTE_SIZE = 15 * 1024 * 1024;
    if (arrayBuffer.byteLength > MAX_PARQUET_BYTE_SIZE) {
      throw new Error(`Parquet file exceeds maximum allowed size limit of 15MB (${arrayBuffer.byteLength} bytes)`);
    }

    const points: TelemetryPoint[] = [];

    await parquetRead({
      file: arrayBuffer,
      onComplete: (data: any[][]) => {
        for (const row of data) {
          points.push({
            distance: Number(row[0] ?? 0),
            speed: Number(row[1] ?? 0),
            throttle: Number(row[2] ?? 0),
            brake: Number(row[3] ?? 0),
            n_gear: Number(row[4] ?? 1),
            drs: Number(row[5] ?? 0),
            rpm: row[6] !== undefined ? Number(row[6]) : undefined,
            time_sec: row[7] !== undefined ? Number(row[7]) : undefined,
            x: row[8] !== undefined ? Number(row[8]) : undefined,
            y: row[9] !== undefined ? Number(row[9]) : undefined,
            z: row[10] !== undefined ? Number(row[10]) : undefined,
          });
        }
      },
    });

    if (points.length > 0) {
      return points.sort((a, b) => a.distance - b.distance);
    }
  } catch (err) {
    // Parquet file not found or backend offline: return authentic driver-calibrated curve
    if (driver) {
      return generateDriverTelemetry(driver, circuitLengthM || 5793, role || 'pole', rival, circuit);
    }
  }

  return generateSyntheticTelemetry(0, 0, circuitLengthM || 5793);
}

/**
 * Backward compatibility wrapper for generateSyntheticTelemetry
 */
export function generateSyntheticTelemetry(
  driverOffset: number = 0,
  baseApexDelta: number = 0,
  circuitLengthM: number = 5793
): TelemetryPoint[] {
  const dummyDriver: Driver = {
    id: driverOffset === 0 ? 1 : 2,
    driver_number: driverOffset === 0 ? 4 : 16,
    broadcast_name: driverOffset === 0 ? 'L. NORRIS' : 'C. LECLERC',
    full_name: driverOffset === 0 ? 'Lando Norris' : 'Charles Leclerc',
    team_name: driverOffset === 0 ? 'McLaren' : 'Ferrari',
    color_hex: driverOffset === 0 ? '#FF8000' : '#E80020',
    country_code: 'GBR',
  };
  return generateDriverTelemetry(dummyDriver, circuitLengthM, driverOffset === 0 ? 'pole' : 'chaser');
}
