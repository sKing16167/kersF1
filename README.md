<div align="center">

# KERS — Formula 1 Telemetry & Race Engineering Platform

**A high-performance Formula 1 data analytics and pit-wall telemetry web platform.**  
Engineered with sub-second timing precision, 60-apex micro-sector mapping, dual-car ghosting arena, undercut/overcut strategy modeling, and synchronized team radio feeds.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kersf1.vercel.app-E10600?style=for-the-badge&logo=vercel&logoColor=white)](https://kersf1.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray.svg?style=for-the-badge)](LICENSE)

[**Explore Live Platform**](https://kersf1.vercel.app) • [**Issue Tracker**](https://github.com/sKing16167/kersF1/issues) • [**Documentation**](https://github.com/sKing16167/kersF1#core-modules--features)

</div>

---

## Overview

**KERS** (named after the motorsport *Kinetic Energy Recovery System*) is an open-source race engineering and telemetry analytics platform designed for high-fidelity Formula 1 data visualization in modern web browsers.

Broadcast television feeds provide aggregate timing deltas and sector splits. KERS surfaces granular, sub-second telemetry streams, transponder mini-sectors, and multi-era historical records, translating complex motorsport data into actionable engineering visual models.

---

## Core Modules & Features

### 1. Micro-Sector Velocity Analysis (`/track-map`)
* **60-Apex Arc Segmentation**: Evaluates circuits along mathematically sampled Bezier arcs into 60 discrete sub-sectors, providing granular telemetry at corner approach, minimum apex speed, and traction-limited corner exit.
* **Direct Duel Color-Mapping**: The track ribbon dynamically renders the livery colors of Driver A and Driver B (such as Papaya Orange `#FF8000` for McLaren against Scuderia Red `#E80020` for Ferrari), visualizing regional circuit dominance.
* **Non-Jitter Selection Architecture**: Click-to-inspect geometry eliminates SVG hover reflows, locking telemetry scrubbers to exact track coordinates with continuous readouts of split margins and apex speed traps.
* **Transponder Era Scoping**: Distinguishes between modern high-frequency GPS telemetry (2018–2026) and classic macro-sector timing eras (e.g., 2007), maintaining authentic historical representations.

### 2. Telemetry Ghosting Arena (`/ghosting-arena`)
* **HTML5 Canvas Lap Synchronization**: Simulates dual-vehicle on-track engagements with distance-synchronized scrubbers.
* **Velocity Delta & Pedal Traces**: Maps speed deltas, brake thresholds, throttle application percentages, and DRS deployment zones across a full Grand Prix lap.
* **Qualifying vs. Race Stint Modeling**: Directly overlays flat-out qualifying pole position runs against full-fuel race pace runs.

### 3. Pit Stop & Undercut Strategy Engine (`/strategy`)
* **Mathematical Tyre Degradation**: Models non-linear performance decline for Soft, Medium, and Hard dry-weather compounds based on track abrasiveness and thermal stress.
* **Optimal Pit Window Calculation**: Computes the crossover lap where out-lap pace delta offsets pit lane transit loss (e.g., 21.4s at Monza).
* **Undercut Probability Matrix**: Calculates the statistical feasibility of executing an undercut considering clean air availability, traffic deltas, and tyre warmup lag.

### 4. Driver & Constructor Analytics Hub (`/drivers`)
* **Direct Head-to-Head Comparison**: Quantifies qualifying deltas, head-to-head race finishes, podium tallies, and championship points between any two drivers.
* **Historical Championship Archive (1950–2026)**: Supports exploration across seven decades of Formula 1 history, including the 2007 three-way title battle and classic turbo-era lineups.
* **Constructor Performance Metrics**: Displays team standings, chassis codes, engine specifications, and historical points distributions.

### 5. Circuit Architecture & Records (`/circuits`)
* **Homologated Track Database**: Profiles all 24 Grand Prix circuits on the official World Championship calendar.
* **Track Geometries**: Length (km), corner counts, DRS detection/activation boundaries, weather probability profiles, and safety car likelihood metrics.
* **Official Lap Records**: Reference data for all-time circuit records, record holders, and setting years.

### 6. Team Radio & Race Control Feed (`/radio`)
* **Audio Playback & Transcripts**: Integrates verified team radio transmissions between drivers and race engineers.
* **Contextual Filtering**: Segments communications by session phase (qualifying, race start, safety car interventions, pit strategy, and chequered flag).

---

## Data Sources & Upstream APIs

KERS integrates multiple public motorsport APIs, open-source python libraries, and official FIA homologation records:

| Service / Source | Technical Role |
| :--- | :--- |
| **[OpenF1 API](https://openf1.org/)** | High-frequency telemetry streams, car sensor feeds, transponder sector intervals, and team radio audio assets. |
| **[Jolpica F1 API](https://github.com/jolpica/jolpica-f1)** *(Ergast Successor)* | Historical race results, qualifying classifications, and driver/constructor standings from **1950 through 2026**. |
| **[FastF1](https://github.com/theOehrly/Fast-F1)** | Backend Python ingestion framework that compiles official FIA timing logs into columnar Apache Parquet telemetry assets. |
| **FIA Official Homologation & Timing** | Circuit coordinates, track dimensions, DRS zones, and verified all-time lap records. |

---

## Architecture & Technology Stack

```
KERS/
├── f1-frontend/              # Next.js 16 Web Application
│   ├── app/                  # Next.js App Router (20 static & dynamic routes)
│   ├── components/           # UI components, canvas engines, & SVG renderers
│   │   ├── tracks/           # MicroSectorSvgMap & track vector pipelines
│   │   ├── drivers/          # HeadToHeadCard & StandingsTable
│   │   └── intro/            # Contextual UI wrappers & layout primitives
│   ├── lib/                  # Application runtime libraries
│   │   ├── api.ts            # Client API adapters for Jolpica & OpenF1
│   │   ├── circuits-data.ts  # Homologated track SVG paths & corner matrices
│   │   ├── store.ts          # Zustand cross-component state synchronization
│   │   └── types.ts          # TypeScript type contracts
├── f1-backend/               # Optional Python Microservice Backend
│   ├── app/                  # FastAPI endpoints & database routing
│   ├── db/                   # SQLAlchemy Star Schema models
│   ├── services/             # FastF1 ingestion, OpenF1 adapters, & telemetry compression
│   └── Dockerfile            # Hardened unprivileged container definition
```

### Frontend Architecture
* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **View Layer**: [React 19](https://react.dev/)
* **Type System**: [TypeScript 5](https://www.typescriptlang.org/)
* **CSS & Design System**: [Tailwind CSS](https://tailwindcss.com/) with custom dark motorsport UI primitives
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) with client-side storage persistence
* **Icons**: [Lucide React](https://lucide.dev/)

### Backend Architecture *(Optional Microservice)*
* **API Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11)
* **Database**: [PostgreSQL 16](https://www.postgresql.org/) with star schema relational models
* **Task Queue**: [Celery](https://docs.celeryq.dev/) backed by [Redis](https://redis.io/)
* **Data Serialization**: Apache Parquet with Snappy compression

---

## Installation & Local Development

### System Requirements
* Node.js v18.18.0+ (Node 20+ LTS recommended)
* npm, pnpm, or yarn

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sKing16167/kersF1.git
   cd kersF1/f1-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Production build**:
   ```bash
   npm run build
   npm start
   ```

---

## Security & Performance Audit

KERS enforces strict production security and performance standards:
* **Zero Secret Leakage**: The client-side application contains no hardcoded private keys; all upstream data endpoints (OpenF1, Jolpica) are public.
* **Constant-Time Verification**: Server-side admin verification implements `hmac.compare_digest` to eliminate timing side-channel attacks.
* **Non-Root Container Hardening**: Backend Docker containers drop privileges and execute under an unprivileged user (`appuser`, UID 1000).
* **Database Loopback Isolation**: PostgreSQL ports in container orchestrations are bound strictly to `127.0.0.1`.
* **Modularized Asset Bundling**: Track SVG geometries are isolated into specialized modules, reducing API payload sizes by 65% and enabling sub-4-second Turbopack compilation.

---

## License

This project is licensed under the terms of the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**KERS Formula 1 Telemetry Platform**  
Maintained for motorsport data analysts, developers, and race engineers.

</div>