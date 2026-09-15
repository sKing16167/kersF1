"""
Wrapper around FastF1 — the primary source for lap timing, session
results, and per-lap car telemetry (car data + position data merged and
interpolated onto a common time axis by FastF1 itself).

FastF1 caches raw responses to disk (FASTF1_CACHE_DIR) so re-runs and
retries don't hammer the upstream timing API — this is mandatory, not
optional, per FastF1's own usage guidance.
"""
import os
import fastf1
import pandas as pd

from app.core.config import settings

_cache_initialized = False


def _ensure_cache():
    global _cache_initialized
    if not _cache_initialized:
        os.makedirs(settings.FASTF1_CACHE_DIR, exist_ok=True)
        fastf1.Cache.enable_cache(settings.FASTF1_CACHE_DIR)
        _cache_initialized = True


def load_session(year: int, gp: str, session_type: str):
    """
    session_type: 'FP1' | 'FP2' | 'FP3' | 'Q' | 'SQ' | 'R'
    Returns a loaded fastf1.core.Session with laps + telemetry available.
    """
    _ensure_cache()
    session = fastf1.get_session(year, gp, session_type)
    session.load(laps=True, telemetry=True, weather=True, messages=True)
    return session


def get_event_schedule(year: int) -> pd.DataFrame:
    _ensure_cache()
    return fastf1.get_event_schedule(year)


def get_lap_dataframe(session) -> pd.DataFrame:
    """Standard lap-by-lap table: LapTime, Sector1Time, Compound, TyreLife, etc."""
    return session.laps


def get_driver_lap_telemetry(session, driver_code: str, lap_number: int) -> pd.DataFrame:
    """
    Returns car telemetry (Speed, Throttle, Brake, nGear, RPM, DRS, X, Y, Z)
    for a single lap, already merged with position data via FastF1's
    `.get_telemetry()`. This is the raw, full-frequency data — pass it to
    telemetry_compression.build_lap_parquet() before storing, never store
    this directly.
    """
    laps = session.laps.pick_drivers(driver_code)
    lap = laps[laps["LapNumber"] == lap_number].iloc[0]
    return lap.get_telemetry()


def get_race_control_messages(session) -> pd.DataFrame:
    """Flags, safety car periods, track limits deletions — used for LapTime.track_status."""
    return session.race_control_messages
