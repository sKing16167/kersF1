from datetime import date
from typing import Optional

from app.schemas.common import ORMBase


class DriverOut(ORMBase):
    id: int
    ref: str
    code: Optional[str] = None
    permanent_number: Optional[int] = None
    first_name: str
    last_name: str
    nationality: Optional[str] = None
    date_of_birth: Optional[date] = None
    headshot_url: Optional[str] = None


class ConstructorOut(ORMBase):
    id: int
    ref: str
    name: str
    nationality: Optional[str] = None
    logo_url: Optional[str] = None
    color_hex: Optional[str] = None


class HeadToHeadStat(ORMBase):
    """Aggregated comparison used by the Driver & Constructor Hub."""
    driver_a: DriverOut
    driver_b: DriverOut
    sessions_compared: int
    driver_a_wins: int
    driver_b_wins: int
    avg_qualifying_gap_ms: float
    avg_race_pace_gap_ms: float


class DriverStandingOut(ORMBase):
    position: int
    points: float
    driver: DriverOut
    constructor: Optional[ConstructorOut] = None


class ConstructorStandingOut(ORMBase):
    position: int
    points: float
    constructor: ConstructorOut

