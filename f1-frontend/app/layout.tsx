import type { Metadata } from 'next';
import './globals.css';
import { TopHeader } from '@/components/layout/TopHeader';
import { BackgroundAtmosphere } from '@/components/layout/BackgroundAtmosphere';
import { KersIntroExperience } from '@/components/intro/KersIntroExperience';

export const metadata: Metadata = {
  title: 'KERS F1 | Telemetry & Race Analytics Hub',
  description: 'Precision Formula 1 telemetry ghosting arena, micro-sector velocity maps, and race strategy prediction.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="obsidian">
      <body className="antialiased min-h-screen flex flex-col text-white selection:bg-white/20 selection:text-white relative bg-[#07080B]">
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
