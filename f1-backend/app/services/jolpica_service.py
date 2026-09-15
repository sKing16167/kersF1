"""
Jolpica Ergast-compatible API client for verified official Formula One championship data.
Fetches official driver standings, constructor standings, season schedules, and race results.
Includes in-memory TTL caching to prevent rate-limiting and maximize response performance.
"""
import time
from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings

_CACHE: Dict[str, Dict[str, Any]] = {}
_DEFAULT_TTL = 3600  # 1 hour cache


def _get_cached(key: str) -> Optional[Any]:
    entry = _CACHE.get(key)
    if entry and (time.time() - entry["timestamp"] < entry["ttl"]):
        return entry["data"]
    return None


def _set_cached(key: str, data: Any, ttl: int = _DEFAULT_TTL) -> None:
    _CACHE[key] = {"data": data, "timestamp": time.time(), "ttl": ttl}


def _fetch_jolpica(path: str, params: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    cache_key = f"{path}:{str(params)}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    base_url = getattr(settings, "JOLPICA_BASE_URL", "http://api.jolpi.ca/ergast/f1")
    urls_to_try = [
        f"{base_url}{path}",
        f"http://api.jolpi.ca/ergast/f1{path}",
        f"https://api.jolpi.ca/ergast/f1{path}",
    ]

    for url in urls_to_try:
        try:
            with httpx.Client(timeout=15.0) as client:
                resp = client.get(url, params=params or {})
                if resp.status_code == 200:
                    data = resp.json()
                    _set_cached(cache_key, data)
                    return data
        except Exception:
            continue

    return None


def get_driver_standings(season: int) -> List[Dict[str, Any]]:
    """Fetch official FIA World Drivers Championship standings for any season."""
    data = _fetch_jolpica(f"/{season}/driverStandings.json")
    if not data:
        return []
    try:
        standings_lists = data["MRData"]["StandingsTable"]["StandingsLists"]
        if not standings_lists:
            return []
        drivers = standings_lists[0]["DriverStandings"]
        return [
            {
                "position": int(d["position"]),
                "points": float(d["points"]),
                "wins": int(d.get("wins", 0)),
                "driver": {
                    "id": d["Driver"]["driverId"],
                    "driver_number": int(d["Driver"].get("permanentNumber", 0)),
                    "code": d["Driver"].get("code", d["Driver"]["familyName"][:3].upper()),
                    "full_name": f"{d['Driver']['givenName']} {d['Driver']['familyName']}",
                    "broadcast_name": f"{d['Driver']['givenName'][0]}. {d['Driver']['familyName'].upper()}",
                    "nationality": d["Driver"].get("nationality", ""),
                    "team_name": d["Constructors"][0]["name"] if d.get("Constructors") else "Unknown",
                },
                "constructor": {
                    "id": d["Constructors"][0]["constructorId"] if d.get("Constructors") else "unknown",
                    "name": d["Constructors"][0]["name"] if d.get("Constructors") else "Unknown",
                } if d.get("Constructors") else None,
            }
            for d in drivers
        ]
    except Exception:
        return []


def get_constructor_standings(season: int) -> List[Dict[str, Any]]:
    """Fetch official FIA World Constructors Championship standings for any season."""
    data = _fetch_jolpica(f"/{season}/constructorStandings.json")
    if not data:
        return []
    try:
        standings_lists = data["MRData"]["StandingsTable"]["StandingsLists"]
        if not standings_lists:
            return []
        constructors = standings_lists[0]["ConstructorStandings"]
        return [
            {
                "position": int(c["position"]),
                "points": float(c["points"]),
                "wins": int(c.get("wins", 0)),
                "constructor": {
                    "id": c["Constructor"]["constructorId"],
                    "name": c["Constructor"]["name"],
                    "nationality": c["Constructor"].get("nationality", ""),
                },
            }
            for c in constructors
        ]
    except Exception:
        return []


def get_season_races(season: int) -> List[Dict[str, Any]]:
    """Fetch complete official Grand Prix calendar for any season."""
    data = _fetch_jolpica(f"/{season}.json")
    if not data:
        return []
    try:
        races = data["MRData"]["RaceTable"]["Races"]
        return races
    except Exception:
        return []


def get_next_race() -> Optional[Dict[str, Any]]:
    """Fetch the next scheduled Formula One Grand Prix."""
    data = _fetch_jolpica("/current/next.json")
    if not data:
        return None
    try:
        races = data["MRData"]["RaceTable"]["Races"]
        return races[0] if races else None
    except Exception:
        return None


def get_race_result(season: int, round_number: int) -> Optional[Dict[str, Any]]:
    """Fetch official race classification and podium for a specific Grand Prix round."""
    data = _fetch_jolpica(f"/{season}/{round_number}/results.json")
    if not data:
        return None
    try:
        races = data["MRData"]["RaceTable"]["Races"]
        return races[0] if races else None
    except Exception:
        return None
