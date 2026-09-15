from typing import List, Optional

from pydantic import BaseModel

from app.schemas.common import ORMBase


class TelemetryAssetOut(ORMBase):
    """
    What the API actually returns for a telemetry request: a pointer, not
    the data itself. The frontend fetches `download_url` directly (S3/R2,
    optionally via CDN) and parses the parquet file with a JS parquet
    reader (e.g. hyparquet) or duckdb-wasm — never proxy the bytes through
    FastAPI.
    """
    session_id: int
    driver_id: int
    lap_number: int
    format: str
    point_count: Optional[int] = None
    file_size_bytes: Optional[int] = None
    download_url: str  # presigned URL, generated at request time


class GhostComparisonRequest(BaseModel):
    session_id: int
    driver_a_id: int
    driver_a_lap: int
    driver_b_id: int
    driver_b_lap: int


class GhostComparisonOut(BaseModel):
    """
    Two telemetry pointers, already normalized onto the same lap-distance
    axis by the ingestion task, so the frontend just overlays them —
    no client-side interpolation needed.
    """
    driver_a_asset: TelemetryAssetOut
    driver_b_asset: TelemetryAssetOut
    normalized_distance_points: int


class MicroSectorOut(ORMBase):
    micro_sector_index: int
    distance_start_m: float
    distance_end_m: float
    best_driver_id: Optional[int] = None
    min_apex_speed_kph: Optional[float] = None
    geometry: Optional[list] = None


class MicroSectorMapOut(BaseModel):
    session_id: int
    total_micro_sectors: int
    sectors: List[MicroSectorOut]


class RadioMessageOut(ORMBase):
    id: int
    driver_id: int
    lap_number: Optional[int] = None
    session_time_seconds: float
    transcript_text: Optional[str] = None
    audio_url: Optional[str] = None
    # Offset into the *normalized* telemetry trace this driver's lap asset
    # uses, computed by matching session_time_seconds against lap timing —
    # lets the frontend drop a marker directly on the telemetry chart.
    telemetry_lap_number: Optional[int] = None
    telemetry_distance_m: Optional[float] = None


class UndercutRequest(BaseModel):
    session_id: int
    attacking_driver_id: int
    defending_driver_id: int
    attacking_driver_current_lap: int
    gap_seconds: float  # current gap, attacker behind defender


class UndercutWindowOut(BaseModel):
    optimal_pit_lap: int
    projected_gap_after_pit_seconds: float
    confidence: str  # "high" | "medium" | "low" based on sample size of historical deg curves
    tyre_degradation_model: dict
    notes: str
