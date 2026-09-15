import io
import logging
from datetime import datetime, timezone
import pandas as pd
import pyarrow.parquet as pq

from sqlalchemy.orm import Session as DBSession

from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.db import models
from app.services import fastf1_service, openf1_service, s3_client
from app.services.telemetry_compression import build_and_upload_lap_asset
from app.services.micro_sector_service import compute_micro_sectors

logger = logging.getLogger(__name__)


def _get_db() -> DBSession:
    return SessionLocal()


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def check_for_new_sessions(self):
    """
    Beat-scheduled task (every 30 min, see celery_app.py). Lightweight:
    checks whether any session in the current season is marked
    is_fully_ingested=False and enqueues the heavy ingest_session task.
    """
    db = _get_db()
    try:
        from datetime import date
        current_year = date.today().year
        schedule = fastf1_service.get_event_schedule(current_year)

        pending = (
            db.query(models.RaceSession)
            .join(models.Race)
            .filter(models.RaceSession.is_fully_ingested.is_(False))
            .filter(models.Race.season_year == current_year)
            .all()
        )
        for session_row in pending:
            race = session_row.race
            ingest_session_weekend.delay(
                year=race.season_year,
                gp_name=race.name,
                session_type=session_row.session_type,
            )
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3, default_retry_delay=120)
def ingest_session_weekend(self, year: int, gp_name: str, session_type: str):
    """
    Full pipeline for one session (e.g. 2024 Italian GP, 'R'):
      1. Load session via FastF1 (cached).
      2. Upsert Race/Circuit/Drivers/Constructors with team colors and full names.
      3. Bulk-write LapTime rows.
      4. For each driver's laps, build+upload normalized telemetry parquet.
      5. Kick off micro-sector computation once telemetry is in.
      6. Pull team radio via OpenF1 and write RadioMessage rows with session offsets.
    """
    db = _get_db()
    try:
        session = fastf1_service.load_session(year, gp_name, session_type)
        laps_df = fastf1_service.get_lap_dataframe(session)

        race_session = _upsert_race_and_session(db, session, year, gp_name, session_type)
        _upsert_drivers_and_constructors(db, session, year)

        # --- Lap times ---
        for _, lap in laps_df.iterrows():
            code = lap["Driver"]
            driver = db.query(models.Driver).filter_by(code=code).first()
            if not driver:
                driver = _get_or_create_driver(db, lap)
            _upsert_lap_time(db, race_session.id, driver.id, lap)
        db.commit()

        # --- Telemetry (one asset per driver per lap) ---
        for driver_code in laps_df["Driver"].unique():
            driver_laps = laps_df.pick_drivers(driver_code)
            driver = db.query(models.Driver).filter_by(code=driver_code).first()
            if not driver:
                continue

            for _, lap in driver_laps.iterrows():
                try:
                    telemetry = lap.get_telemetry()
                    if "Distance" not in telemetry.columns:
                        telemetry = telemetry.add_distance()

                    meta = build_and_upload_lap_asset(
                        telemetry,
                        season_year=year,
                        circuit_ref=race_session.race.circuit.ref,
                        session_type=session_type,
                        driver_code=driver_code,
                        lap_number=int(lap["LapNumber"]),
                    )
                    _upsert_telemetry_asset(db, race_session.id, driver.id, int(lap["LapNumber"]), meta)
                except Exception as exc:
                    logger.warning("Telemetry failed for %s lap %s: %s", driver_code, lap.get("LapNumber"), exc)
            db.commit()

        # --- Micro-sectors (runs over the ingested telemetry) ---
        compute_micro_sectors_for_session.delay(race_session.id)

        # --- Team radio (OpenF1) ---
        ingest_team_radio.delay(year=year, gp_name=gp_name, session_type=session_type, race_session_id=race_session.id)

        race_session.is_fully_ingested = True
        race_session.ingested_at = datetime.utcnow()
        db.commit()

    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc)
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def compute_micro_sectors_for_session(self, race_session_id: int):
    """
    Calculates the 60 track micro-sectors based on highest minimum apex speed
    across all drivers' fastest laps in this session.
    """
    db = _get_db()
    try:
        race_session = db.query(models.RaceSession).get(race_session_id)
        if not race_session:
            return

        assets = (
            db.query(models.TelemetryAsset)
            .filter(models.TelemetryAsset.session_id == race_session_id)
            .all()
        )
        if not assets:
            logger.warning("No telemetry assets found for micro-sectors session %s", race_session_id)
            return

        # Find best lap per driver in this session
        best_laps = (
            db.query(models.LapTime)
            .filter(models.LapTime.session_id == race_session_id, models.LapTime.lap_time_ms.isnot(None))
            .order_by(models.LapTime.driver_id, models.LapTime.lap_time_ms.asc())
            .all()
        )
        best_lap_by_driver = {}
        for l in best_laps:
            if l.driver_id not in best_lap_by_driver:
                best_lap_by_driver[l.driver_id] = l.lap_number

        driver_telemetry = {}
        max_lap_length = 5000.0

        for asset in assets:
            if asset.driver_id in best_lap_by_driver and asset.lap_number == best_lap_by_driver[asset.driver_id]:
                try:
                    raw_bytes = s3_client.read_bytes(asset.storage_key)
                    df = pq.read_table(io.BytesIO(raw_bytes)).to_pandas()
                    if not df.empty and "Distance" in df.columns and "Speed" in df.columns:
                        driver_telemetry[asset.driver_id] = df
                        max_lap_length = max(max_lap_length, float(df["Distance"].max()))
                except Exception as e:
                    logger.warning("Failed to read telemetry for micro-sector asset %s: %s", asset.storage_key, e)

        if not driver_telemetry:
            logger.warning("No readable driver telemetry for micro-sectors session %s", race_session_id)
            return

        sectors = compute_micro_sectors(driver_telemetry, lap_length_m=max_lap_length, micro_sector_count=60)

        # Clear existing micro-sectors for this session before inserting
        db.query(models.MicroSectorResult).filter_by(session_id=race_session_id).delete()

        for s in sectors:
            db.add(models.MicroSectorResult(
                session_id=race_session_id,
                micro_sector_index=s["micro_sector_index"],
                distance_start_m=s["distance_start_m"],
                distance_end_m=s["distance_end_m"],
                best_driver_id=s["best_driver_id"],
                min_apex_speed_kph=s["min_apex_speed_kph"],
                geometry=s["geometry"],
            ))
        db.commit()
        logger.info("Successfully computed and saved %d micro-sectors for session %s", len(sectors), race_session_id)
    except Exception as exc:
        db.rollback()
        logger.error("Error computing micro-sectors: %s", exc)
        raise self.retry(exc=exc)
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def ingest_team_radio(self, year: int, gp_name: str, session_type: str, race_session_id: int):
    """
    Fetches team radio audio clips from OpenF1 and computes session offsets.
    """
    db = _get_db()
    try:
        race_session = db.query(models.RaceSession).get(race_session_id)
        sessions = openf1_service.get_sessions(year=year)
        matching = [s for s in sessions if gp_name.lower() in s.get("location", "").lower()
                    or gp_name.lower() in s.get("circuit_short_name", "").lower()
                    or gp_name.lower() in s.get("country_name", "").lower()]
        if not matching:
            logger.warning("No OpenF1 session match for %s %s %s", year, gp_name, session_type)
            return

        session_key = matching[0]["session_key"]
        radio_clips = openf1_service.get_team_radio(session_key)

        session_start_dt = None
        if matching[0].get("date_start"):
            try:
                session_start_dt = datetime.fromisoformat(matching[0]["date_start"].replace("Z", "+00:00"))
            except Exception:
                pass

        for clip in radio_clips:
            driver = db.query(models.Driver).filter_by(permanent_number=clip.get("driver_number")).first()
            if not driver:
                continue

            exists = (
                db.query(models.RadioMessage)
                .filter_by(session_id=race_session_id, driver_id=driver.id, audio_url=clip.get("recording_url"))
                .first()
            )
            if exists:
                continue

            offset_sec = 0.0
            if clip.get("date") and session_start_dt:
                try:
                    clip_dt = datetime.fromisoformat(clip["date"].replace("Z", "+00:00"))
                    offset_sec = max(0.0, (clip_dt - session_start_dt).total_seconds())
                except Exception:
                    offset_sec = 0.0

            db.add(models.RadioMessage(
                session_id=race_session_id,
                driver_id=driver.id,
                session_time_seconds=round(offset_sec, 2),
                transcript_text=None,
                audio_url=clip.get("recording_url"),
            ))
        db.commit()
    finally:
        db.close()


# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------

def _upsert_race_and_session(db: DBSession, fastf1_session, year: int, gp_name: str, session_type: str) -> models.RaceSession:
    circuit_ref = fastf1_session.event["Location"].lower().replace(" ", "_")
    circuit = db.query(models.Circuit).filter_by(ref=circuit_ref).first()
    if not circuit:
        circuit = models.Circuit(
            ref=circuit_ref,
            name=fastf1_session.event["Location"],
            country=fastf1_session.event.get("Country"),
        )
        db.add(circuit)
        db.flush()

    if not db.query(models.Season).filter_by(year=year).first():
        db.add(models.Season(year=year))
        db.flush()

    race = db.query(models.Race).filter_by(season_year=year, round=int(fastf1_session.event["RoundNumber"])).first()
    if not race:
        race = models.Race(
            season_year=year,
            round=int(fastf1_session.event["RoundNumber"]),
            circuit_id=circuit.id,
            name=fastf1_session.event["EventName"],
            date=fastf1_session.event["EventDate"].date(),
        )
        db.add(race)
        db.flush()

    race_session = db.query(models.RaceSession).filter_by(race_id=race.id, session_type=session_type).first()
    if not race_session:
        race_session = models.RaceSession(race_id=race.id, session_type=session_type)
        db.add(race_session)
        db.flush()

    return race_session


def _upsert_drivers_and_constructors(db: DBSession, session, year: int):
    """Enriches drivers with real full names, numbers, headshots, and constructor team colors."""
    if hasattr(session, "results") and session.results is not None and not session.results.empty:
        for _, row in session.results.iterrows():
            code = str(row.get("Abbreviation", "")).strip()
            if not code or code == "nan":
                continue

            # 1. Upsert Constructor
            team_name = str(row.get("TeamName", "")).strip() if not pd.isnull(row.get("TeamName")) else None
            team_color = str(row.get("TeamColor", "")).strip() if not pd.isnull(row.get("TeamColor")) else None
            constructor = None
            if team_name and team_name != "nan":
                cref = team_name.lower().replace(" ", "_")
                color_hex = f"#{team_color}" if team_color and team_color != "nan" and not team_color.startswith("#") else team_color
                constructor = db.query(models.Constructor).filter_by(ref=cref).first()
                if not constructor:
                    constructor = models.Constructor(ref=cref, name=team_name, color_hex=color_hex)
                    db.add(constructor)
                    db.flush()
                else:
                    if color_hex:
                        constructor.color_hex = color_hex

            # 2. Upsert Driver
            first_name = str(row.get("FirstName", "")).strip() if not pd.isnull(row.get("FirstName")) else code
            last_name = str(row.get("LastName", "")).strip() if not pd.isnull(row.get("LastName")) else ""
            full_name = str(row.get("FullName", "")).strip() if not pd.isnull(row.get("FullName")) else None
            if full_name and not last_name and " " in full_name:
                parts = full_name.split(" ", 1)
                first_name, last_name = parts[0], parts[1]

            p_num = None
            if not pd.isnull(row.get("DriverNumber")):
                try:
                    p_num = int(row.get("DriverNumber"))
                except (ValueError, TypeError):
                    pass

            headshot = str(row.get("HeadshotUrl", "")).strip() if not pd.isnull(row.get("HeadshotUrl")) else None
            country = str(row.get("CountryCode", "")).strip() if not pd.isnull(row.get("CountryCode")) else None

            driver = db.query(models.Driver).filter_by(code=code).first()
            if not driver:
                driver = models.Driver(
                    ref=code.lower(),
                    code=code,
                    first_name=first_name,
                    last_name=last_name,
                    permanent_number=p_num,
                    headshot_url=headshot,
                    nationality=country,
                )
                db.add(driver)
                db.flush()
            else:
                if first_name and first_name != code:
                    driver.first_name = first_name
                if last_name:
                    driver.last_name = last_name
                if p_num is not None:
                    driver.permanent_number = p_num
                if headshot:
                    driver.headshot_url = headshot
                if country:
                    driver.nationality = country

            # 3. Upsert DriverConstructorEntry
            if constructor:
                entry = db.query(models.DriverConstructorEntry).filter_by(
                    season_year=year, driver_id=driver.id
                ).first()
                if not entry:
                    db.add(models.DriverConstructorEntry(
                        season_year=year,
                        driver_id=driver.id,
                        constructor_id=constructor.id,
                        car_number=p_num,
                    ))
        db.flush()


def _get_or_create_driver(db: DBSession, lap_row) -> models.Driver:
    code = lap_row["Driver"]
    driver = db.query(models.Driver).filter_by(code=code).first()
    if not driver:
        driver = models.Driver(ref=code.lower(), code=code, first_name=code, last_name="")
        db.add(driver)
        db.flush()
    return driver


def _upsert_lap_time(db: DBSession, session_id: int, driver_id: int, lap_row):
    existing = (
        db.query(models.LapTime)
        .filter_by(session_id=session_id, driver_id=driver_id, lap_number=int(lap_row["LapNumber"]))
        .first()
    )
    if existing:
        return

    def to_ms(td):
        return int(td.total_seconds() * 1000) if td is not None and not pd.isnull(td) else None

    db.add(models.LapTime(
        session_id=session_id,
        driver_id=driver_id,
        lap_number=int(lap_row["LapNumber"]),
        lap_time_ms=to_ms(lap_row.get("LapTime")),
        sector1_ms=to_ms(lap_row.get("Sector1Time")),
        sector2_ms=to_ms(lap_row.get("Sector2Time")),
        sector3_ms=to_ms(lap_row.get("Sector3Time")),
        compound=lap_row.get("Compound"),
        tyre_life=int(lap_row["TyreLife"]) if not pd.isnull(lap_row.get("TyreLife")) else None,
        stint_number=int(lap_row["Stint"]) if not pd.isnull(lap_row.get("Stint")) else None,
        position=int(lap_row["Position"]) if not pd.isnull(lap_row.get("Position")) else None,
        is_personal_best=bool(lap_row.get("IsPersonalBest", False)),
    ))


def _upsert_telemetry_asset(db: DBSession, session_id: int, driver_id: int, lap_number: int, meta: dict):
    existing = (
        db.query(models.TelemetryAsset)
        .filter_by(session_id=session_id, driver_id=driver_id, lap_number=lap_number)
        .first()
    )
    if existing:
        existing.storage_key = meta["storage_key"]
        existing.point_count = meta["point_count"]
        existing.file_size_bytes = meta["file_size_bytes"]
        return

    db.add(models.TelemetryAsset(
        session_id=session_id,
        driver_id=driver_id,
        lap_number=lap_number,
        storage_key=meta["storage_key"],
        format=meta["format"],
        point_count=meta["point_count"],
        file_size_bytes=meta["file_size_bytes"],
    ))

