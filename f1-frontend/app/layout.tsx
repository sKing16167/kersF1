import type { Metadata, Viewport } from 'next';
import {
  Orbitron,
  Chakra_Petch,
  Share_Tech_Mono,
  Plus_Jakarta_Sans,
  Syne,
  Space_Mono,
  Inter,
} from 'next/font/google';
import './globals.css';
import { TopHeader } from '@/components/layout/TopHeader';
import { Footer } from '@/components/ui/Footer';
import { CookieConsentBanner } from '@/components/ui/CookieConsentBanner';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { Analytics } from '@vercel/analytics/react';
import { BackgroundAtmosphere } from '@/components/layout/BackgroundAtmosphere';
import { KersIntroExperience } from '@/components/intro/KersIntroExperience';
import { GlassRefractionDefs } from '@/components/ui/GlassRefractionDefs';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  variable: '--font-chakra',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  variable: '--font-share-mono',
  weight: ['400'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['700', '800'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#07080B',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kersf1.vercel.app'),
  title: 'kersF1 | Formula 1 Telemetry & Precision Race Analytics Hub',
  description: 'kersF1 is the advanced Formula 1 telemetry platform featuring real-time driver ghosting comparison, 39 calibrated FIA circuits, micro-sector velocity maps, and undercut strategy predictions.',
  keywords: [
    'kersF1',
    'F1',
    'Formula 1',
    'F1 telemetry',
    'Formula 1 telemetry',
    'F1 live timing',
    'F1 telemetry analysis',
    'F1 telemetry comparison',
    'F1 ghosting arena',
    'F1 circuit apex speed',
    'F1 tire strategy',
    'F1 undercut prediction',
    'Formula 1 2026',
    'Formula 1 2025',
  ],
  authors: [{ name: 'kersF1' }],
  verification: {
    google: 'google88992bcd95212f5c',
  },
  applicationName: 'kersF1',
  openGraph: {
    title: 'kersF1 | Formula 1 Telemetry & Precision Race Analytics Hub',
    description: 'Advanced Formula 1 telemetry platform: real-time driver ghosting, 39 calibrated circuits, micro-sector velocity maps, and undercut race strategy predictions.',
    url: 'https://kersf1.vercel.app',
    siteName: 'kersF1',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'kersF1 Motorsport Telemetry Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kersF1 | Formula 1 Telemetry & Precision Race Analytics Hub',
    description: 'Precision Formula 1 telemetry ghosting arena, 39 calibrated circuits, micro-sector velocity maps, and live race strategy predictions.',
  },
  icons: {
    icon: [
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="obsidian"
      className={`${orbitron.variable} ${chakraPetch.variable} ${shareTechMono.variable} ${plusJakarta.variable} ${syne.variable} ${spaceMono.variable} ${inter.variable}`}
    >
      <head>
        {/* Google Official Favicon Specification (Multiple of 48px square) */}
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/icon-96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icon.png" sizes="512x512" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

        {/* Google Official Site Name Structured Data (Schema.org WebSite) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'kersF1',
              alternateName: ['KERS', 'kersF1 Telemetry', 'kersF1 | Formula 1 Telemetry'],
              url: 'https://kersf1.vercel.app/',
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col text-white selection:bg-white/20 selection:text-white relative bg-[#07080B]">
        {/* Optical Glass Refraction & Light-Bending SVG Filter Pipeline */}
        <GlassRefractionDefs />

        {/* Continuous Background Atmosphere with Speed Particles & Ambient Lights */}
        <BackgroundAtmosphere />

        {/* Fullscreen F1 Car & KERS Starting Application Intro */}
        <KersIntroExperience />

        {/* Top Header, Main Content & Universal Footer */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
          <TopHeader />
          <main className="flex-1 p-3 md:p-6 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
          <Footer />
        </div>

        {/* Telemetry & Performance Cookie Consent Banner */}
        <CookieConsentBanner />

        {/* Consent-Gated Privacy-Preserving Analytics */}
        <AnalyticsProvider />

        {/* Vercel Native Cookieless Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
