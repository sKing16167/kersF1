# F1 Data Platform — Backend

FastAPI + Celery + PostgreSQL + S3/R2 backend for the Telemetry Ghosting
Arena, Micro-Sector Track Maps, Undercut/Overcut Predictor, Radio-Sync
Timeline, Track Encyclopedia, and Driver/Constructor Hub.

## What changed vs. your original plan, and why

Your original stack was already solid. Two adjustments:

1. **Cloudflare R2 as a first-class option alongside S3.** It's
   S3-API-compatible (same `boto3` client, just a different endpoint URL),
   has zero egress fees, and telemetry-serving to a frontend is
   egress-heavy. Either works out of the box here — `STORAGE_ENDPOINT_URL`
   in `.env` is the only difference.
2. **Alembic added for schema migrations.** `Base.metadata.create_all()`
   (via `scripts/init_db.py`) is fine to get moving today, but the moment
   you touch the schema after you have real data, you'll want tracked,
   reversible migrations instead of hand-editing tables. It's wired up
   and ready.

Everything else (FastAPI, Celery+Redis, PostgreSQL, FastF1, OpenF1,
Next.js/Tailwind/D3 on the frontend) is unchanged — it's the right stack
for this project.

## Project layout

```
app/
  core/          settings (config.py) + Celery app (celery_app.py)
  db/            SQLAlchemy models (models.py) — the Star Schema — and session handling
  schemas/       Pydantic request/response models
  services/      s3_client, fastf1_service, openf1_service,
                 telemetry_compression, micro_sector_service, undercut_predictor
  tasks/         Celery tasks — ALL data ingestion happens here, never in a request handler
  api/v1/        FastAPI routers, one file per feature area
alembic/         DB migrations
scripts/init_db.py   quick local table creation (dev only)
docker-compose.yml   postgres + redis + api + celery worker + celery beat + flower
```

### Where each USP lives

| Feature | Model(s) | Service | Endpoint |
|---|---|---|---|
| Telemetry Ghosting Arena | `TelemetryAsset` | `telemetry_compression.py` | `POST /api/v1/telemetry/ghost` |
| Micro-Sector Track Maps | `MicroSectorResult` | `micro_sector_service.py` | `GET /api/v1/tracks/micro-sectors/{session_id}` |
| Undercut/Overcut Predictor | `LapTime` (historical) | `undercut_predictor.py` | `POST /api/v1/undercut/predict` |
| Radio-Sync Timeline | `RadioMessage` | `openf1_service.py` | `GET /api/v1/radio/session/{session_id}` |
| Track Encyclopedia | `Circuit` | — | `GET /api/v1/races/circuits/` |
| Driver/Constructor Hub | `Driver`, `Constructor`, `ChampionshipStanding` | — | `GET /api/v1/drivers/`, `/drivers/constructors/` |

**The critical design decision** (per your own note): telemetry never
goes through a JSON API response. `TelemetryAsset` rows only store a
*pointer* (an object-storage key); the API hands back a presigned
download URL and the frontend fetches the Parquet file directly from
S3/R2. Use a JS Parquet reader on the frontend — **hyparquet** (lightest,
no WASM) or **duckdb-wasm** (if you want to run SQL queries over the
telemetry client-side, e.g. filtering by distance range) both work well
with Next.js.

## 1. Local setup

```bash
cp .env.example .env      # then fill in the real values — see section 2 below
docker compose up --build
```

That starts: Postgres, Redis, the FastAPI server (`localhost:8000`,
docs at `localhost:8000/docs`), a Celery worker, Celery beat (the
scheduler), and Flower (Celery monitoring UI at `localhost:5555`).

Create the tables (first run only):

```bash
docker compose exec api python -m scripts.init_db
# OR, once you're using Alembic:
docker compose exec api alembic revision --autogenerate -m "init"
docker compose exec api alembic upgrade head
```

Trigger your first real ingestion (FastF1 downloads real historical data —
no API key needed, see below):

```bash
curl -X POST http://localhost:8000/api/v1/admin/trigger-ingestion \
  -H "Content-Type: application/json" \
  -d '{"year": 2024, "gp_name": "Italian Grand Prix", "session_type": "R"}'
```

Watch it run in Flower (`localhost:5555`) or the worker logs
(`docker compose logs -f celery_worker`).

## 2. API keys & credentials — what you actually need

Good news: **the two data sources need zero API keys.**

| Service | Key required? | Notes |
|---|---|---|
| FastF1 | **No** | Pulls from the F1 live timing API + Ergast mirror. Just needs the disk cache directory (`FASTF1_CACHE_DIR`) — already configured. |
| OpenF1 | **No** | Public REST API, no auth on the free tier. |
| Jolpica (Ergast replacement) | **No** | Only needed if you outgrow FastF1's bundled historical data; same no-auth model. |

What you **do** need to create/configure:

### PostgreSQL
- **Fastest to start:** the `docker-compose.yml` Postgres container — no
  external account needed, just set `POSTGRES_USER`/`POSTGRES_PASSWORD`/`POSTGRES_DB`
  in `.env`.
- **For a hosted DB (recommended before deploying the frontend):**
  create a free [Supabase](https://supabase.com) project → Project Settings →
  Database → copy the "Connection string" (URI, use the **Session
  pooler** variant for Celery workers, **Transaction pooler** for the
  FastAPI app if you enable pgbouncer-style pooling) → paste into
  `DATABASE_URL` in `.env`.

### Redis
- Local Docker container needs no setup.
- For production, [Upstash](https://upstash.com) (serverless Redis) or a
  managed Redis add-on on Render/Railway both work — copy the connection
  URL into `REDIS_URL`.

### Object storage (S3 or R2) — required for telemetry
Pick one:

**Option A — AWS S3**
1. AWS Console → S3 → Create bucket (e.g. `f1-telemetry`) → block public
   access **ON** (we use presigned URLs, not a public bucket).
2. AWS Console → IAM → Users → Create user → Attach policy
   `AmazonS3FullAccess` (or scope a custom policy to just this bucket —
   recommended for production).
3. IAM → that user → Security credentials → Create access key.
4. Put the values in `.env`:
   ```
   STORAGE_PROVIDER=s3
   STORAGE_BUCKET=f1-telemetry
   STORAGE_REGION=us-east-1
   STORAGE_ACCESS_KEY_ID=<access key id>
   STORAGE_SECRET_ACCESS_KEY=<secret access key>
   STORAGE_ENDPOINT_URL=          # leave blank for real S3
   ```

**Option B — Cloudflare R2 (recommended — no egress fees)**
1. Cloudflare dashboard → R2 → Create bucket (e.g. `f1-telemetry`).
2. R2 → Manage API Tokens → Create API Token → permissions: Object
   Read & Write, scoped to that bucket.
3. Note your Account ID (shown in the R2 dashboard URL / sidebar).
4. Put the values in `.env`:
   ```
   STORAGE_PROVIDER=r2
   STORAGE_BUCKET=f1-telemetry
   STORAGE_REGION=auto
   STORAGE_ACCESS_KEY_ID=<R2 access key id>
   STORAGE_SECRET_ACCESS_KEY=<R2 secret access key>
   STORAGE_ENDPOINT_URL=https://<account_id>.r2.cloudflarestorage.com
   ```
5. Optional but recommended: connect a custom domain / public bucket in
   R2 settings, then set `STORAGE_PUBLIC_BASE_URL` so downloads go
   through a CDN-cached URL instead of a presigned one on every request.

### SECRET_KEY
Any long random string — used later if/when you add JWT auth for a
"save my favorite driver" type feature. Generate one with:
```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### CORS_ORIGINS
Comma-separated list of frontend origins allowed to call this API —
e.g. `http://localhost:3000,https://your-app.vercel.app`.

## 3. Handing this to other agents/devs for frontend work

To keep frontend work fully decoupled and avoid distress mid-build:

1. **Run `docker compose up` once and keep it running** — the frontend
   agent needs a live API to hit. Share `http://localhost:8000/docs`
   (interactive Swagger UI, auto-generated from the Pydantic schemas —
   every endpoint, request/response shape, and example is there).
2. **Give them the OpenAPI schema directly** if they want to codegen a
   typed client:
   ```bash
   curl http://localhost:8000/openapi.json -o openapi.json
   ```
   Tools like `openapi-typescript` turn this into TypeScript types for
   the Next.js app in one command — removes an entire class of
   frontend/backend mismatch bugs.
3. **Seed real data first.** Run a few `trigger-ingestion` calls for
   recent races before frontend work starts, so every endpoint returns
   real (not empty) data immediately.
4. **Point out the telemetry download pattern explicitly**: frontend
   fetches `download_url` from `/telemetry/lap` or `/telemetry/ghost`
   directly from object storage, parses Parquet client-side (hyparquet
   or duckdb-wasm) — it should never ask the FastAPI server to proxy
   telemetry bytes.
5. **Micro-sector maps and radio-sync need ingestion to finish first**
   (they're computed after telemetry lands) — if those endpoints 404,
   check `docker compose logs -f celery_worker` before assuming it's a
   frontend bug.

## 4. Known stubs / next implementation steps

Being upfront about what's scaffolded vs. fully wired, so the next work
session knows exactly where to pick up:

- `compute_micro_sectors_for_session` (in `ingestion_tasks.py`) has the
  fetch/parse/compute/store pattern laid out but the parquet-loading loop
  is a stub — wire it to `micro_sector_service.compute_micro_sectors()`.
- `RadioMessage.session_time_seconds` / `transcript_text`: OpenF1 gives
  audio clips with a UTC timestamp, not session-relative seconds or a
  transcript. You'll need (a) a timestamp-to-session-time conversion
  against the session's start time, and (b) a transcription step
  (Whisper API or similar) if you want searchable transcripts rather
  than just audio playback.
- `ChampionshipStanding` table exists but nothing populates it yet — add
  a small ingestion step that snapshots standings after each race
  (FastF1's `Ergast` interface or ergast/jolpica's `/driverStandings`
  endpoint both have this data already computed).
- Auth: none yet. Fine for a public read-only API; add it before any
  "save favorites" / personalized feature.
