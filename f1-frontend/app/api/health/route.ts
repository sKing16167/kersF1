import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'kersF1 Telemetry Hub',
      circuits_catalog_count: 39,
      championship_seasons_supported: '1998-2026',
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
