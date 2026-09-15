"""
Wrapper around the OpenF1 REST API — used as a supplement/fallback to
FastF1, primarily for: team radio audio clips (FastF1 doesn't carry the
audio itself), and live-session polling during a race weekend before
FastF1's own timing archive is available.

No API key is required for OpenF1's public tier.
"""
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

_TIMEOUT = 30.0


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _get(path: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    url = f"{settings.OPENF1_BASE_URL}{path}"
    with httpx.Client(timeout=_TIMEOUT) as client:
        resp = client.get(url, params=params or {})
        resp.raise_for_status()
        return resp.json()


def get_sessions(year: int, country_name: Optional[str] = None) -> List[Dict[str, Any]]:
    params = {"year": year}
    if country_name:
        params["country_name"] = country_name
    return _get("/sessions", params)


def get_team_radio(session_key: int, driver_number: Optional[int] = None) -> List[Dict[str, Any]]:
    """Returns [{date, driver_number, recording_url, ...}] — used for RadioMessage.audio_url."""
    params = {"session_key": session_key}
    if driver_number is not None:
        params["driver_number"] = driver_number
    return _get("/team_radio", params)


def get_car_data(session_key: int, driver_number: int, date_gte: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Raw 4Hz car telemetry (speed, throttle, brake, drs, rpm, n_gear) keyed
    by UTC timestamp. Useful as a cross-check / fallback against FastF1's
    telemetry for the same lap, or for near-real-time data during a
    live session.
    """
    params = {"session_key": session_key, "driver_number": driver_number}
    if date_gte:
        params["date>="] = date_gte
    return _get("/car_data", params)


def get_location(session_key: int, driver_number: int) -> List[Dict[str, Any]]:
    """X/Y/Z position data at 3.7Hz — used to build/refresh circuit geometry for track maps."""
    return _get("/location", {"session_key": session_key, "driver_number": driver_number})


def get_race_control(session_key: int) -> List[Dict[str, Any]]:
    return _get("/race_control", {"session_key": session_key})
