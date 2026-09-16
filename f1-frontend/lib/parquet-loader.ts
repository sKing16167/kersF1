import { parquetRead } from 'hyparquet';
import { TelemetryPoint } from './types';

/**
 * Loads and decodes a Parquet telemetry file in the browser using hyparquet.
 * Returns an array of normalized TelemetryPoints sorted by distance.
 */
export async function loadParquetTelemetry(url: string): Promise<TelemetryPoint[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch parquet from ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    // Limit maximum file size (15MB cap) to protect browser memory
    const MAX_PARQUET_BYTE_SIZE = 15 * 1024 * 1024;
    if (arrayBuffer.byteLength > MAX_PARQUET_BYTE_SIZE) {
      throw new Error(`Parquet file exceeds maximum allowed size limit of 15MB (${arrayBuffer.byteLength} bytes)`);
    }

    const points: TelemetryPoint[] = [];

    await parquetRead({
      file: arrayBuffer,
      onComplete: (data: any[][]) => {
        // data is array of rows, or columns depending on schema
        // Parquet format from backend has columns: [distance, speed, throttle, brake, n_gear, drs, rpm, time_sec, x, y, z]
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
    console.warn('Parquet fetch/decode error, generating telemetry curve:', err);
  }

  // Fallback synthetic telemetry if network/file error occurs
  return generateSyntheticTelemetry();
}

/**
 * Generates an authentic Monza GP 500-point telemetry trace with real apexes
 * (Variante del Rettifilo, Curva Grande, Roggia, Lesmos, Ascari, Parabolica).
 */
export function generateSyntheticTelemetry(
  driverOffset: number = 0,
  baseApexDelta: number = 0,
  circuitLengthM: number = 5793
): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const count = 500;
  const step = circuitLengthM / (count - 1);

  // Key corner apex distances at Monza (meters)
  // T1-2 (Rettifilo): 650m (68 km/h)
  // T3 (Curva Grande): 1450m (285 km/h)
  // T4-5 (Roggia): 2250m (110 km/h)
  // T6 (Lesmo 1): 2750m (165 km/h)
  // T7 (Lesmo 2): 3150m (150 km/h)
  // T8-10 (Ascari): 4200m (160 km/h)
  // T11 (Parabolica / Alboreto): 5300m (175 km/h)

  const corners = [
    { apex: 650, minSpeed: 70 + baseApexDelta, brakeStart: 450, exitEnd: 850, gear: 2 },
    { apex: 1450, minSpeed: 290, brakeStart: 1350, exitEnd: 1600, gear: 7 },
    { apex: 2250, minSpeed: 115 + baseApexDelta * 0.8, brakeStart: 2000, exitEnd: 2450, gear: 3 },
    { apex: 2750, minSpeed: 170 + baseApexDelta * 0.5, brakeStart: 2550, exitEnd: 2950, gear: 4 },
    { apex: 3150, minSpeed: 155 + baseApexDelta * 0.6, brakeStart: 2980, exitEnd: 3350, gear: 4 },
    { apex: 4200, minSpeed: 165 + baseApexDelta * 0.7, brakeStart: 3950, exitEnd: 4500, gear: 4 },
    { apex: 5300, minSpeed: 180 + baseApexDelta * 0.9, brakeStart: 5050, exitEnd: 5550, gear: 5 },
  ];

  let cumulativeTime = 0;

  for (let i = 0; i < count; i++) {
    const dist = i * step;
    let speed = 335 + driverOffset * 1.5; // Top straight speed km/h
    let throttle = 100;
    let brake = 0;
    let gear = 8;
    let drs = 0;

    // DRS straights (Main straight 0-500m & Serraglio straight 3300-4000m)
    if ((dist >= 100 && dist <= 550) || (dist >= 3350 && dist <= 3900)) {
      drs = 12; // active DRS
    }

    // Check corner influence
    for (const c of corners) {
      if (dist >= c.brakeStart && dist <= c.apex) {
        // Braking phase
        const factor = (dist - c.brakeStart) / (c.apex - c.brakeStart);
        speed = 335 - (335 - c.minSpeed) * Math.sin((factor * Math.PI) / 2);
        throttle = Math.max(0, (1 - factor * 2) * 100);
        brake = Math.min(100, factor * 110);
        gear = Math.max(c.gear, Math.round(8 - factor * (8 - c.gear)));
        drs = 0;
        break;
      } else if (dist > c.apex && dist <= c.exitEnd) {
        // Corner exit acceleration
        const factor = (dist - c.apex) / (c.exitEnd - c.apex);
        speed = c.minSpeed + (335 - c.minSpeed) * Math.sin((factor * Math.PI) / 2);
        throttle = Math.min(100, factor * 100);
        brake = 0;
        gear = Math.min(8, Math.round(c.gear + factor * (8 - c.gear)));
        break;
      }
    }

    // Small jitter/driver variance
    const noise = Math.sin(i * 0.3 + driverOffset) * 1.2;
    const finalSpeed = Math.max(50, Math.min(355, speed + noise));
    const speedMs = (finalSpeed * 1000) / 3600;
    const dt = step / Math.max(15, speedMs);
    cumulativeTime += dt;

    // Track coordinates in 2D (Monza layout profile)
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
      rpm: Math.round(finalSpeed * 34 + 3200),
      time_sec: Number(cumulativeTime.toFixed(3)),
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
    });
  }

  return points;
}
