"""
Postgres star schema.

Design rule: Postgres holds everything that is small, relational, and
queried with filters/joins (drivers, races, lap times, standings).
Anything high-frequency (telemetry arrays) lives in object storage as
Parquet, and Postgres only stores a *pointer* to it (TelemetryAsset).
This is what keeps API responses light — see app/services/s3_client.py
and app/services/telemetry_compression.py.
"""
from datetime import datetime

from sqlalchemy import (
    Column, Integer, BigInteger, String, Float, Boolean, ForeignKey,
    DateTime, Date, JSON, UniqueConstraint, Text, Index,
)
from sqlalchemy.orm import relationship

from app.db.session import Base


class Circuit(Base):
    __tablename__ = "circuits"

    id = Column(Integer, primary_key=True)
    ref = Column(String(50), unique=True, index=True)          # e.g. "monza", "silverstone"
    name = Column(String(150), nullable=False)
    location = Column(String(100))
    country = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    first_gp_year = Column(Integer)
    lap_record_time_ms = Column(Integer, nullable=True)
    lap_record_holder = Column(String(100), nullable=True)
    lap_record_year = Column(Integer, nullable=True)
    layout_history = Column(JSON, default=list)                 # [{year, change_description, geojson_url}]
    weather_history = Column(JSON, default=dict)                # {avg_temp_c, rain_probability, ...}
    safety_car_probability = Column(Float, nullable=True)       # historical %, precomputed by a task

    races = relationship("Race", back_populates="circuit")


class Constructor(Base):
    __tablename__ = "constructors"

    id = Column(Integer, primary_key=True)
    ref = Column(String(50), unique=True, index=True)           # e.g. "red_bull"
    name = Column(String(150), nullable=False)
    nationality = Column(String(100))
    logo_url = Column(String(500), nullable=True)
    color_hex = Column(String(7), nullable=True)                # for UI theming (dark-mode team colors)


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True)
    ref = Column(String(50), unique=True, index=True)           # e.g. "verstappen"
    code = Column(String(3), index=True)                        # "VER"
    permanent_number = Column(Integer, nullable=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    nationality = Column(String(100))
    date_of_birth = Column(Date, nullable=True)
    headshot_url = Column(String(500), nullable=True)


class Season(Base):
    __tablename__ = "seasons"

    year = Column(Integer, primary_key=True)


class Race(Base):
    """One Grand Prix weekend (a round within a season)."""
    __tablename__ = "races"

    id = Column(Integer, primary_key=True)
    season_year = Column(Integer, ForeignKey("seasons.year"), nullable=False, index=True)
    round = Column(Integer, nullable=False)
    circuit_id = Column(Integer, ForeignKey("circuits.id"), nullable=False)
    name = Column(String(150))                                  # "Italian Grand Prix"
    date = Column(Date)
    is_sprint_weekend = Column(Boolean, default=False)

    circuit = relationship("Circuit", back_populates="races")
    sessions = relationship("RaceSession", back_populates="race")

    __table_args__ = (UniqueConstraint("season_year", "round", name="uq_season_round"),)


class RaceSession(Base):
    """FP1/FP2/FP3/Q/Sprint/Race — an individual on-track session."""
    __tablename__ = "race_sessions"

    id = Column(Integer, primary_key=True)
    race_id = Column(Integer, ForeignKey("races.id"), nullable=False, index=True)
    session_type = Column(String(10), nullable=False)           # FP1, FP2, FP3, SQ, Q, R
    start_time = Column(DateTime, nullable=True)
    ingested_at = Column(DateTime, nullable=True)                # set once Celery finishes loading this session
    is_fully_ingested = Column(Boolean, default=False)

    race = relationship("Race", back_populates="sessions")
    lap_times = relationship("LapTime", back_populates="session")

    __table_args__ = (UniqueConstraint("race_id", "session_type", name="uq_race_session_type"),)


class DriverConstructorEntry(Base):
    """Which team a driver drove for, per season (drivers change teams)."""
    __tablename__ = "driver_constructor_entries"

    id = Column(Integer, primary_key=True)
    season_year = Column(Integer, ForeignKey("seasons.year"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    constructor_id = Column(Integer, ForeignKey("constructors.id"), nullable=False)
    car_number = Column(Integer, nullable=True)

    __table_args__ = (
        UniqueConstraint("season_year", "driver_id", name="uq_season_driver"),
    )


class LapTime(Base):
    """One lap, one driver, one session. Cheap relational data — safe for Postgres."""
    __tablename__ = "lap_times"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id"), nullable=False, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False, index=True)
    lap_number = Column(Integer, nullable=False)
    lap_time_ms = Column(Integer, nullable=True)                # null if lap not completed / no time
    sector1_ms = Column(Integer, nullable=True)
    sector2_ms = Column(Integer, nullable=True)
    sector3_ms = Column(Integer, nullable=True)
    compound = Column(String(20), nullable=True)                # SOFT, MEDIUM, HARD, INTERMEDIATE, WET
    tyre_life = Column(Integer, nullable=True)                  # laps on this tyre set
    stint_number = Column(Integer, nullable=True)
    position = Column(Integer, nullable=True)
    is_personal_best = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)                 # track-limits deletions etc.
    track_status = Column(String(10), nullable=True)            # flag/SC/VSC code at the time

    session = relationship("RaceSession", back_populates="lap_times")

    __table_args__ = (
        UniqueConstraint("session_id", "driver_id", "lap_number", name="uq_session_driver_lap"),
        Index("ix_laptime_session_driver", "session_id", "driver_id"),
    )


class TelemetryAsset(Base):
    """
    Pointer to a compressed telemetry payload in object storage — NOT the
    raw 4Hz arrays. See app/services/telemetry_compression.py for how the
    parquet file is built (normalized lap distance, downsampled columns).
    """
    __tablename__ = "telemetry_assets"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id"), nullable=False, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False, index=True)
    lap_number = Column(Integer, nullable=False)
    storage_key = Column(String(500), nullable=False)           # e.g. "telemetry/2024/monza/R/VER/lap_23.parquet"
    format = Column(String(10), default="parquet")
    source_frequency_hz = Column(Float, default=4.0)
    point_count = Column(Integer, nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("session_id", "driver_id", "lap_number", name="uq_telemetry_session_driver_lap"),
    )


class MicroSectorResult(Base):
    """
    Precomputed cache for the Micro-Sector Track Map USP — 50+ segments
    per circuit, each attributed to whichever driver carried the highest
    minimum apex speed through it in a given session. Computed once by a
    Celery task after ingestion so the map endpoint is a cheap read.
    """
    __tablename__ = "micro_sector_results"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id"), nullable=False, index=True)
    micro_sector_index = Column(Integer, nullable=False)        # 0..N along lap distance
    distance_start_m = Column(Float, nullable=False)
    distance_end_m = Column(Float, nullable=False)
    best_driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    min_apex_speed_kph = Column(Float, nullable=True)
    geometry = Column(JSON, nullable=True)                      # [[lat, lon], ...] polyline for this segment

    __table_args__ = (
        UniqueConstraint("session_id", "micro_sector_index", name="uq_session_microsector"),
    )


class RadioMessage(Base):
    """Team radio transcript pinned to an exact point in the session/telemetry timeline."""
    __tablename__ = "radio_messages"

    id = Column(BigInteger, primary_key=True)
    session_id = Column(Integer, ForeignKey("race_sessions.id"), nullable=False, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False, index=True)
    lap_number = Column(Integer, nullable=True)
    session_time_seconds = Column(Float, nullable=False)        # seconds since session start
    transcript_text = Column(Text, nullable=True)
    audio_url = Column(String(500), nullable=True)


class ChampionshipStanding(Base):
    """Snapshot of standings after each round — powers progression charts without recomputation."""
    __tablename__ = "championship_standings"

    id = Column(BigInteger, primary_key=True)
    season_year = Column(Integer, ForeignKey("seasons.year"), nullable=False, index=True)
    round = Column(Integer, nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    constructor_id = Column(Integer, ForeignKey("constructors.id"), nullable=True)
    points = Column(Float, nullable=False)
    position = Column(Integer, nullable=False)

    __table_args__ = (
        Index("ix_standings_season_round", "season_year", "round"),
    )
