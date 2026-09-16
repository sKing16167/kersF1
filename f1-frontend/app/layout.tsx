import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TopHeader } from '@/components/layout/TopHeader';
import { BackgroundAtmosphere } from '@/components/layout/BackgroundAtmosphere';
import { KersIntroExperience } from '@/components/intro/KersIntroExperience';
import { GlassRefractionDefs } from '@/components/ui/GlassRefractionDefs';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
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
    <html lang="en" data-theme="obsidian" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
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

        {/* Top Header & Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
          <TopHeader />
          <main className="flex-1 p-3 md:p-6 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
