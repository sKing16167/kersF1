"""
Import all models here so Alembic's autogenerate (and scripts/init_db.py)
can see every table via Base.metadata.
"""
from app.db.session import Base  # noqa: F401
from app.db.models import (  # noqa: F401
    Circuit,
    Constructor,
    Driver,
    Season,
    Race,
    RaceSession,
    DriverConstructorEntry,
    LapTime,
    TelemetryAsset,
    MicroSectorResult,
    RadioMessage,
    ChampionshipStanding,
)
