import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Known malicious vulnerability scanners, automated exploit frameworks, and aggressive scrapers
const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'masscan',
  'wpscan',
  'dirbuster',
  'nmap',
  'nessus',
  'acunetix',
  'havij',
  'zgrab',
  'morfeus',
  'flicky',
  'libwww-perl',
  'openvas',
  'whatweb',
  'gau',
  'ffuf',
  'gobuster',
  'metasploit',
];

// Common attack probe path signatures to block immediately
const PROBE_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/wp-login\.php/i,
  /\/wp-admin/i,
  /\/xmlrpc\.php/i,
  /\/phpinfo\.php/i,
  /\/cgi-bin\//i,
  /\/eval-stdin\.php/i,
  /\/actuator\//i,
  /\/vendor\/\.env/i,
  /\/phpunit\//i,
  /\/autodiscover\//i,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // 1. Block common attack & reconnaissance probes with HTTP 403 Forbidden
  for (const pattern of PROBE_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Access Denied: Malicious probe detected by kersF1 Security Firewall.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      });
    }
  }

  // 2. Block known malicious vulnerability scanner User-Agents
  for (const badAgent of BLOCKED_USER_AGENTS) {
    if (userAgent.includes(badAgent)) {
      return new NextResponse('Access Denied: Automated security scanner blocked.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      });
    }
  }

  // 3. Clone the response and attach protective security headers
  const response = NextResponse.next();

  response.headers.set('X-kersF1-Firewall', 'active-v2');

  // Prevent MIME-sniffing and cross-origin framing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, etc. (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|icon.png|apple-touch-icon.png|manifest.json).*)',
  ],
};
