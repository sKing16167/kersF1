<div align="center">

# 🏎️ KERS — Formula 1 Telemetry & Race Engineering Platform

**A professional, high-performance Formula 1 analytics and pit-wall telemetry web platform.**  
Featuring 60-apex micro-sector mapping, dual-car ghosting arena, undercut/overcut race strategy modeling, and synchronized team radio feeds.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kersf1.vercel.app-E10600?style=for-the-badge&logo=vercel&logoColor=white)](https://kersf1.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[**Explore Live Platform**](https://kersf1.vercel.app) • [**Report Bug**](https://github.com/sKing16167/kersF1/issues) • [**Request Feature**](https://github.com/sKing16167/kersF1/issues)

</div>

---

## 📖 Overview

**KERS** (named after Formula 1's legendary *Kinetic Energy Recovery System*) is a modern motorsport data platform designed to bring professional F1 race engineering and telemetry analytics directly to the browser. 

Traditional Formula 1 broadcasts provide limited high-level timing intervals. KERS bridges this gap by transforming raw telemetry streams, transponder mini-sectors, and historical race logs into interactive, beautiful, and actionable visualizations with sub-second precision.

---

## ⚡ Key Sections & Features

### 1. 🗺️ Micro-Sector Velocity Analysis (`/track-map`)
* **60-Apex Dynamic Sub-Sectors**: Each circuit is sampled along its true homologated SVG Bezier spline into 60 discrete micro-sectors, highlighting corner entry, apex apex minimum velocity, and exit acceleration.
* **Direct Duel Color-Mapping**: The circuit is dynamically painted in the official livery colors of Driver A and Driver B (e.g., Papaya Orange `#FF8000` for McLaren vs. Scuderia Red `#E80020` for Ferrari), visualizing instant sector dominance.
* **Rock-Solid Click-to-Inspect**: Click any track segment or corner node (e.g., Monza's *Variante del Rettifilo* or *Curva Grande*) to jump the distance scrubber and inspect telemetry delta speeds, braking zones, and split margins.
* **Multi-Era Transponder Scope**: Includes intelligent historical scope detection, distinguishing between modern high-frequency GPS telemetry (2018–2026) and classic 3-macro-sector timing eras (e.g., 2007).

### 2. 🎮 Telemetry Ghosting Arena (`/ghosting-arena`)
* **Interactive HTML5 Canvas Duel**: Simulates two cars battling on track in real-time with synchronized distance scrubbers.
* **Speed Delta & Throttle Telemetry**: Visualizes telemetry curves, gear shifts, DRS activation zones, and braking traces across an entire Grand Prix lap.
* **Pole Lap vs. Race Pace Comparison**: Compare a driver’s flat-out qualifying pole position lap against simulated full-fuel race stints.

### 3. ⏱️ Pit Stop & Undercut / Overcut Predictor (`/strategy`)
* **Compound Degradation Curves**: Mathematical tyre wear modeling for Soft (C5–C4), Medium (C3–C2), and Hard (C1–C0) compounds.
* **Optimal Pit Window Calculation**: Computes the crossover lap where fresher rubber offsets pit lane transit loss (e.g., 21.4s at Monza).
* **Undercut Probability Matrix**: Calculates the real-time probability of executing a successful undercut based on out-lap delta, tyre warmup characteristics, and traffic windows.

### 4. 🏎️ Driver & Constructor Hub (`/drivers`)
* **Head-to-Head Duel Matrix**: In-depth side-by-side comparison between any two drivers covering qualifying pace gaps, race head-to-head finishes, podium tallies, and points.
* **Full Historical Season Archive (1950–2026)**: Switch between modern 2026 championship rosters and iconic classic seasons (such as the 2007 Räikkönen vs. Hamilton vs. Alonso title showdown).
* **Constructor Championship Profiles**: Real-time team standings, official chassis codes, power unit suppliers, and historical milestone tracking.

### 5. 🏁 Circuit Encyclopedia (`/circuits`)
* **Full World Championship Calendar**: Detailed architectural profiles for all 24 Grand Prix circuits on the official calendar.
* **Homologated Track Data**: Track length (km), number of turns, DRS detection and activation zones, historical weather probability, and safety car likelihood.
* **Official Lap Records**: Verified all-time lap records, record holders, and recorded year.

### 6. 📻 Team Radio & Transponder Hub (`/radio`)
* **Synchronized Audio & Transcripts**: Listen to authentic team radio transmissions between drivers and race engineers.
* **Session Phase Tagging**: Filter communications by qualifying, race start, safety car periods, strategy changes, and post-race cooldown laps.

---

## 🌐 APIs & Data Sources

KERS leverages a combination of public motorsport APIs, open-source python data frameworks, and FIA homologation archives:

| API / Service | Purpose in KERS |
| :--- | :--- |
| **[OpenF1 API](https://openf1.org/)** | High-frequency telemetry streams, real-time car transponder data, lap intervals, and synchronized team radio audio feeds. |
| **[Jolpica F1 API](https://github.com/jolpica/jolpica-f1)** *(Ergast Successor)* | Verified historical Grand Prix race results, qualifying classifications, driver standings, and constructor points dating from **1950 through 2026**. |
| **[FastF1](https://github.com/theOehrly/Fast-F1)** | Python data processing framework used on the backend to ingest, synchronize, and serialize official FIA timing logs and car sensor arrays into Parquet telemetry files. |
| **FIA Official Homologation & Timing** | Official track geometries, turn coordinates, DRS zone boundaries, and official all-time lap records. |

---

## 🛠️ Architecture & Tech Stack

```
KERS/
├── f1-frontend/              # Next.js 16 Web Application
│   ├── app/                  # Next.js App Router (20 routes: track-map, ghosting-arena, drivers, strategy, radio, etc.)
│   ├── components/           # Reusable UI components & interactive canvases
│   │   ├── tracks/           # MicroSectorSvgMap & SVG track renderers
│   │   ├── drivers/          # HeadToHeadCard & StandingsTable
│   │   └── intro/            # Ambient background & layout components
│   ├── lib/                  # Core client libraries
│   │   ├── api.ts            # Client API connector & Jolpica/OpenF1 services
│   │   ├── circuits-data.ts  # True-to-scale SVG geometries & apex coordinates
│   │   ├── store.ts          # Zustand cross-component state synchronization
│   │   └── types.ts          # Strict TypeScript domain models
├── f1-backend/               # Optional Python Microservice Backend
│   ├── app/                  # FastAPI REST endpoints & star schema
│   ├── db/                   # SQLAlchemy PostgreSQL models
│   ├── services/             # FastF1 ingestion, OpenF1 adapters, & telemetry compression
│   └── Dockerfile            # Hardened unprivileged container specification
```

### Frontend
* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Library**: [React 19](https://react.dev/)
* **Language**: [TypeScript 5](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom motorsport design tokens (`f1-glass-card`, `f1-pill`)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) with client storage persistence
* **Icons**: [Lucide React](https://lucide.dev/)

### Backend *(Optional Microservice)*
* **Web Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11)
* **Database**: [PostgreSQL 16](https://www.postgresql.org/) with star schema relational models
* **Task Worker**: [Celery](https://docs.celeryq.dev/) + [Redis](https://redis.io/)
* **Telemetry Serialization**: Apache Parquet with Snappy compression

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.18.0 or higher (Node 20+ recommended)
* **npm**, **pnpm**, or **yarn**

### Quickstart (Frontend)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sKing16167/kersF1.git
   cd kersF1/f1-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to explore KERS.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🛡️ Security & Performance

KERS undergoes strict security and performance auditing:
* **Zero Secret Exposure**: Public client architecture requires zero floating API keys; all external data APIs (OpenF1, Jolpica) are public endpoints.
* **Timing-Attack Immune**: Backend authentication utilizes `hmac.compare_digest` for constant-time API token evaluation.
* **Hardened Containerization**: Backend Docker containers drop root privileges and run under a dedicated unprivileged user (`appuser`, UID 1000).
* **Modularized Bundling**: Track SVG geometries are split from the API client, reducing initial parse times by **~65%** and achieving sub-4s Next.js Turbopack compilation.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

**Crafted for Formula 1 fans, data analysts, and race engineers.**  
🏁 *Keep pushing on the out-lap!*

</div>