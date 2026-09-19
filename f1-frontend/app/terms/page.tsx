'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, AlertTriangle, Scale, Cpu, ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header Bar */}
      <div className="f1-glass-card p-6 md:p-8 rounded-xl border border-white/[0.08] space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#FF1801]/15 border border-[#FF1801]/30 flex items-center justify-center text-[#FF1801]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              Last Revised: September 2026 | Non-Commercial Telemetry Research Project
            </p>
          </div>
        </div>
      </div>

      {/* Critical Trademark Alert Banner */}
      <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs">
          <div className="font-bold uppercase tracking-wider text-amber-300 font-mono">
            Mandatory Formula 1 Trademark & Non-Affiliation Disclaimer
          </div>
          <p className="leading-relaxed text-neutral-300">
            This platform, <strong>KERS F1 (Kinetic Energy Recovery System)</strong>, is an independent, open-source educational 
            telemetry analysis hub developed strictly for research, non-commercial software demonstration, and enthusiast analysis.
          </p>
          <p className="leading-relaxed text-neutral-400">
            <strong>FORMULA 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX</strong>, team names, driver names, 
            and circuit marks are registered trademarks of Formula One Licensing B.V. and the Fédération Internationale de l&apos;Automobile (FIA). 
            This website is <strong>not associated, affiliated, endorsed, sponsored, or approved</strong> by Formula One Licensing B.V., Formula One Management, the FIA, or any affiliated team or driver.
          </p>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-4">
        {/* Section 1: Acceptance */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <Scale className="w-4 h-4 text-[#FF1801]" />
            <h2>1. Agreement to Terms</h2>
          </div>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            By accessing or interacting with the KERS F1 application, including the Ghosting Arena, Micro-Sector velocity maps, 
            3D Globe circuit views, or race strategy simulations, you agree to be bound by these Terms & Conditions. 
            If you disagree with any portion of these terms, your sole remedy is to discontinue use of the platform.
          </p>
        </div>

        {/* Section 2: Telemetry Data Accuracy */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <Cpu className="w-4 h-4 text-[#00E5FF]" />
            <h2>2. Telemetry Simulations & &ldquo;As-Is&rdquo; Warranty Disclaimer</h2>
          </div>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            All telemetry streams, velocity graphs, tire wear degradation models, throttle/brake overlays, and ghosting simulations are mathematical approximations calculated using public timing feeds and physics interpolation models.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-300 pl-1">
            <li><strong>No Betting or Financial Use:</strong> Data must not be relied upon for sports wagering, betting odds, or financial speculation.</li>
            <li><strong>No Automotive Engineering Reliance:</strong> Models are not engineered for real-world track driving or physical automotive safety decisions.</li>
            <li><strong>Availability:</strong> The platform is provided strictly on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind.</li>
          </ul>
        </div>

        {/* Section 3: Acceptable Use */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <ShieldCheck className="w-4 h-4 text-[#39FF14]" />
            <h2>3. Acceptable Use & Prohibited Actions</h2>
          </div>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            Users agree to interact with the platform ethically and responsibly. The following behaviors are strictly prohibited and subject to firewall blocking:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-red-400 font-bold">Automated Abuse</span>
              <p className="text-[11px] text-neutral-400">Launching aggressive scrapers, bot flooding, or denial-of-service attempts against our endpoints.</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-red-400 font-bold">Commercial Resale</span>
              <p className="text-[11px] text-neutral-400">Sub-licensing, packaging, or selling access to KERS telemetry visualizations for commercial profit.</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-red-400 font-bold">Exploit Probing</span>
              <p className="text-[11px] text-neutral-400">Probing server infrastructure, attempting SQL injection, or scanning for unintended vulnerabilities.</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-red-400 font-bold">Trademark Infringement</span>
              <p className="text-[11px] text-neutral-400">Misrepresenting KERS as an official Formula 1 application or attempting trademark squatting.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Intellectual Property */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <h2 className="text-white font-display font-bold text-base">4. Proprietary Software Architecture</h2>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            The source code, custom SVG turnwise calibration algorithms, WebGL cloth physics engines, and user interface designs of KERS are the intellectual property of the project contributors and licensed under the MIT Open Source License. Third-party logos, team trademarks, and circuit silhouettes remain the property of their respective trademark holders.
          </p>
        </div>

        {/* Section 5: Limitation of Liability */}
        <div className="f1-glass-card p-6 rounded-xl border border-white/[0.08] space-y-3">
          <h2 className="text-white font-display font-bold text-base">5. Limitation of Liability</h2>
          <p className="text-xs font-sans text-neutral-300 leading-relaxed">
            To the maximum extent permitted by applicable law, neither the developers nor project contributors shall be held liable for any direct, indirect, incidental, or consequential damages resulting from your access to or inability to access this service, data inaccuracies, or service interruptions.
          </p>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Questions regarding these terms?</span>
            <Link
              href="/privacy"
              className="text-[#FF1801] hover:underline flex items-center gap-1 font-bold"
            >
              <span>View Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
