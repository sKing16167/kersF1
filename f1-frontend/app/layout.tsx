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
  title: 'KERS F1 | Telemetry & Race Analytics Hub',
  description: 'Precision Formula 1 telemetry ghosting arena, micro-sector velocity maps, and race strategy prediction.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=kers2', sizes: 'any' },
      { url: '/icon.svg?v=kers2', type: 'image/svg+xml' },
      { url: '/icon.png?v=kers2', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico?v=kers2'],
    apple: [
      { url: '/apple-touch-icon.png?v=kers2', sizes: '180x180', type: 'image/png' },
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
        <link rel="icon" href="/favicon.ico?v=kers2" sizes="any" />
        <link rel="icon" href="/icon.svg?v=kers2" type="image/svg+xml" />
        <link rel="icon" href="/icon.png?v=kers2" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=kers2" />
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
      </body>
    </html>
  );
}
