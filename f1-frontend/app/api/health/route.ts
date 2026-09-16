import { NextResponse } from 'next/server';

export async function GET() {
  const uptimeSeconds = process.uptime();
  const memUsage = process.memoryUsage();

  return NextResponse.json(
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'KERS F1 Telemetry Hub',
      uptime_seconds: Math.round(uptimeSeconds),
      memory: {
        rss_mb: Math.round(memUsage.rss / 1024 / 1024),
        heap_used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
      },
      circuits_catalog_count: 23,
      championship_seasons_supported: '1998-2026',
      cache_mode: 'Hybrid Memory + IndexedDB/LocalStorage',
      api_version: '2.4.0',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
