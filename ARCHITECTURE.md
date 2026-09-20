# KERS — Technical Architecture, System Design & Implementation Specification

This document provides a comprehensive technical breakdown of **KERS** (Kinetic Energy Recovery System), covering system architecture, mathematical models, telemetry pipelines, security hardening, and social post soundbites.

---

## 1. Executive Summary & System Overview

**KERS** is a full-stack Formula 1 telemetry and race engineering web platform built to bring professional pit-wall analytics directly to modern browsers. 

Standard motorsport broadcasts only surface high-level intervals (e.g., sector times and second gaps). KERS captures and reconstructs raw telemetry, high-frequency transponder pulses, and historical Grand Prix records into interactive, sub-second visual models:
* **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript 5, Tailwind CSS, HTML5 Canvas, SVG Bezier Arc Sampling, Zustand.
* **Data Sources**: OpenF1 (real-time car sensors, radio audio), Jolpica / Ergast (historical archives 1950–2026), FastF1 (FIA telemetry ingestion).
* **Backend Services**: Python 3.11, FastAPI, SQLAlchemy Star Schema, PostgreSQL 16, Celery, Redis, Apache Parquet.
* **Infrastructure & Hosting**: Vercel (Edge-optimized frontend), Docker Compose (containerized microservices).

---

## 2. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                      Next.js 16 (App Router) + React 19                           |
|                                                                                   |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
|  | Micro-Sector SVG Map  |  |  Ghosting Arena (2D)  |  | Pit Strategy Matrix   |  |
|  | Bezier Spline Arc     |  |  HTML5 Canvas 60fps   |  | Tyre Degradation &    |  |
|  | 60-Apex Velocity Mesh |  |  Scrubber Synced      |  | Undercut Crossover    |  |
|  +-----------------------+  +-----------------------+  +-----------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |              Cross-Component State Store (Zustand + Storage)                |  |
|  |      Active Distance (m), Circuit Records, Driver Duel State, Season Sync   |  |
|  +-----------------------------------------------------------------------------+  |
+----------------------------------------+------------------------------------------+
                                         |
                       REST / Streaming Telemetry Queries
                                         |
+----------------------------------------v------------------------------------------+
|                            DATA INGESTION & BACKEND                               |
|                                                                                   |
|  +---------------------------+                      +--------------------------+  |
|  |    Public Upstream APIs   |                      |    FastAPI Microservice  |  |
|  |  - OpenF1 (Live GPS)      |                      |  - Async Route Handlers  |  |
|  |  - Jolpica F1 (1950-2026) |                      |  - Constant-time HMAC    |  |
|  |  - FIA Timing Logs        |                      |  - Batched SQL Queries   |  |
|  +-------------+-------------+                      +------------+-------------+  |
|                |                                                 |                |
|                +-----------------------+-------------------------+                |
|                                        |                                          |
|                                        v                                          |
|                         +------------------------------+                          |
|                         |    PostgreSQL Star Schema    |                          |
|                         |  - Dim Circuits / Drivers    |                          |
|                         |  - Fact Lap Times & Records  |                          |
|                         |  - Telemetry Asset Pointers  |                          |
|                         +------------------------------+                          |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Feature Engineering & Mathematical Formulations

### 3.1. 60-Apex Micro-Sector Velocity Mapping
* **Problem**: Official timing splits circuits into only 3 macro-sectors (S1, S2, S3), concealing where drivers gain or lose time through complex corners.
* **Solution**: A client-side curve-sampling pipeline evaluates the raw SVG track path ($S$) of any circuit:
  $$\text{length}(S) = \int_{0}^{1} \left\| S'(t) \right\| dt$$
* The path is divided into $N = 60$ equidistant curvilinear segments:
  $$\Delta s = \frac{\text{length}(S)}{60}$$
* Each micro-sector calculates apex entry, minimum apex speed, and exit traction. Slices are colored according to driver advantage:
  $$\text{Winner} = \begin{cases} \text{Driver A} & \text{if } v_A \ge v_B \\ \text{Driver B} & \text{if } v_B > v_A \end{cases}$$
* **Non-Jitter UX Architecture**: Hover state thrashing was eliminated by replacing dynamic SVG stroke-expansion and filter drop shadows with stable, click-to-inspect geometry locking.

### 3.2. Telemetry Ghosting Arena (HTML5 Canvas)
* Synchronizes two independent telemetry arrays using absolute circuit displacement ($d \in [0, D_{\max}]$) instead of elapsed time ($t$).
* **Advantage**: Allows comparing a qualifying lap against a race lap regardless of different lap times.
* Renders at continuous 60fps on a hardware-accelerated canvas, rendering trailing ghost tails, throttle trace percentages, brake triggers, and speed deltas.

### 3.3. Pit Stop Undercut / Overcut Predictive Modeling
* Simulates non-linear tyre wear using an exponential thermal degradation decay function:
  $$T_{\text{lap}}(n) = T_{\text{base}} + \alpha \cdot e^{\beta \cdot n}$$
  where $n$ is tyre age (laps), $\alpha$ is compound wear coefficient, and $\beta$ is track abrasiveness factor.
* Computes the crossover lap where the delta between worn rubber and fresh out-lap compound exceeds pit lane transit loss ($T_{\text{pit}} \approx 20\text{s} - 25\text{s}$):
  $$\Delta_{\text{undercut}} = (T_{\text{old}} - T_{\text{new\_outlap}}) - T_{\text{delta\_target}}$$
* If $\Delta_{\text{undercut}} > 0$, the undercut probability reaches $> 80\%$.

### 3.4. Multi-Era Telemetry Scoping
* **Modern Hybrid Era (2018–2026)**: Supports high-resolution GPS mini-sectors, car transponders, and live streams via OpenF1.
* **Historical Era (1950–2017)**: Handles legacy seasons (such as 2007) where FIA transponders only measured Macro-Sectors 1, 2, and 3. KERS detects the season timestamp and switches to calibrated historical lap pace simulations, preventing fallback errors.

---

## 4. Frontend Engineering & Bundle Optimization

### 4.1. Technology Stack
* **Framework**: Next.js 16 (App Router) with Turbopack compilation.
* **UI & Rendering**: React 19 with strict client/server boundary separation (`'use client'`).
* **Styling**: Tailwind CSS with custom motorsport tokens (`f1-glass-card`, `f1-pill`).
* **State Management**: Zustand lightweight store with selective hydration from `localStorage` for cross-page driver/circuit persistence.

### 4.2. Performance Optimization
* **Static Vector Decoupling**: Extracted 1,900 lines of static track SVG coordinates from `lib/api.ts` into a modular `lib/circuits-data.ts`.
* **Build Impact**: Reduced API file size by **65%** (from 423KB to 129KB), accelerating Next.js production compilation time to **3.6 seconds**.
* **Zero Layout Shift**: Fixed-ratio SVG viewport calculations prevent layout reflows during circuit switches.

---

## 5. Backend & Data Pipeline Architecture

### 5.1. Star Schema Relational Database (PostgreSQL)
PostgreSQL handles small, relational, indexed records:
* `circuits`: Homologated GPS coordinates, lengths, corner counts, lap records.
* `drivers`: Official numbers, codes, broadcast names, nationality, liveries.
* `constructors`: Team references, color hex codes, manufacturer history.
* `races` & `race_sessions`: Season rounds, sprint weekend flags, session timestamps.
* `lap_times`: Granular relational laps, sector splits, tyre life, and track flags.

### 5.2. Out-of-Band High-Frequency Storage (Apache Parquet)
* Rather than storing millions of high-frequency sensor readings (speed, throttle, brake, RPM) as JSON rows in PostgreSQL, sensor arrays are compressed into columnar **Apache Parquet** files stored in S3/Cloudflare R2.
* PostgreSQL retains an indexed pointer (`TelemetryAsset`), allowing client queries to stream compressed Parquet blocks directly.

### 5.3. Query Batching & N+1 Elimination
* Converted per-session loop queries in driver head-to-head comparisons into single batch queries utilizing `func.min()`, `func.avg()`, and subquery joins.
* Result: Reduced query count from $\sim 150+$ database round-trips to **3 constant queries** per analysis.

---

## 6. Security Hardening Audit

The codebase underwent a comprehensive security review:
1. **Timing-Attack Immune Authentication**: Replaced standard string equality in admin API authentication with constant-time verification:
   ```python
   hmac.compare_digest(provided_key, settings.SECRET_KEY)
   ```
2. **Container Privilege Drop**: Hardened `Dockerfile` to create an unprivileged user (`appuser`, UID 1000) and dropped root execution before launching Uvicorn.
3. **Loopback Network Isolation**: Bound PostgreSQL ports strictly to loopback (`127.0.0.1:5432:5432`) in `docker-compose.yml` to prevent public host port exposure.
4. **Build Context Isolation**: Configured `.dockerignore` to prevent `.env`, secrets, git history, and caches from entering container layers.
5. **Zero Client Secret Exposure**: Verified that no private tokens or API keys exist in client-side bundles; all data feeds (OpenF1, Jolpica) run over public endpoints.

---

## 7. Social Post & Showcase Cheat Sheet

Use these bullet points, statistics, and soundbites when drafting posts for **LinkedIn, X/Twitter, Reddit, or Dev.to**:

### Elevator Pitch
> *"I built KERS — an open-source Formula 1 Telemetry and Race Engineering web platform that brings real-time pit-wall analytics to the browser using Next.js 16, React 19, and Tailwind CSS."*

### Key Technical Talking Points
* **Mathematical SVG Modeling**: *"Sampled true FIA circuit paths into 60 discrete micro-sectors using Bezier arc integrals to map apex speeds and corner exit acceleration."*
* **Real-Time Canvas Telemetry**: *"Engineered a 60fps HTML5 Canvas dual-car ghosting arena that synchronizes laps by distance displacement rather than elapsed time."*
* **Predictive Pit Strategy**: *"Modeled tyre degradation decay curves and pit lane transit losses to compute live undercut and overcut success probabilities."*
* **Multi-Era Historical Archive**: *"Integrated OpenF1 for modern live telemetry and Jolpica for historical championships from 1950 to 2026."*
* **Performance & Architecture**: *"Optimized Next.js bundle times to 3.6s with asset modularization and audited backend queries to eliminate N+1 bottlenecks."*

### Quick Links to Share
* **Live Web App**: [https://kersf1.vercel.app](https://kersf1.vercel.app)
* **GitHub Repository**: [https://github.com/sKing16167/kersF1](https://github.com/sKing16167/kersF1)
* **Tech Stack**: Next.js 16 • React 19 • TypeScript • Tailwind CSS • FastAPI • PostgreSQL • FastF1 • OpenF1
