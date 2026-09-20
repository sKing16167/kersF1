import { NextResponse } from 'next/server';

export function GET() {
  return new NextResponse('google-site-verification: google88992bcd95212f5c.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
