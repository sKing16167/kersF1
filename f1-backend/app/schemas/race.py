import datetime as dt
from typing import Any, Dict, List, Optional

from app.schemas.common import ORMBase


class CircuitOut(ORMBase):
    id: int
    ref: str
    name: str
    location: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    first_gp_year: Optional[int] = None
    lap_record_time_ms: Optional[int] = None
    lap_record_holder: Optional[str] = None
    lap_record_year: Optional[int] = None
    layout_history: Optional[List[Dict[str, Any]]] = None
    weather_history: Optional[Dict[str, Any]] = None
    safety_car_probability: Optional[float] = None


class RaceSessionOut(ORMBase):
    id: int
    session_type: str
    start_time: Optional[dt.datetime] = None
    is_fully_ingested: bool


class RaceOut(ORMBase):
    id: int
    season_year: int
    round: int
    name: str
    date: Optional[dt.date] = None
    is_sprint_weekend: bool
    circuit: CircuitOut
    sessions: List[RaceSessionOut] = []


class LapTimeOut(ORMBase):
    id: int
    lap_number: int
    lap_time_ms: Optional[int] = None
    sector1_ms: Optional[int] = None
    sector2_ms: Optional[int] = None
    sector3_ms: Optional[int] = None
    compound: Optional[str] = None
    tyre_life: Optional[int] = None
    stint_number: Optional[int] = None
    position: Optional[int] = None
    is_personal_best: bool
    is_deleted: bool
    driver_id: int
