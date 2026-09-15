from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db import models
from app.schemas.telemetry import (
    TelemetryAssetOut, GhostComparisonRequest, GhostComparisonOut,
)
from app.services import s3_client

router = APIRouter()


def _asset_to_schema(asset: models.TelemetryAsset) -> TelemetryAssetOut:
    return TelemetryAssetOut(
        session_id=asset.session_id,
        driver_id=asset.driver_id,
        lap_number=asset.lap_number,
        format=asset.format,
        point_count=asset.point_count,
        file_size_bytes=asset.file_size_bytes,
        download_url=s3_client.generate_presigned_url(asset.storage_key),
    )


@router.get("/lap", response_model=TelemetryAssetOut)
def get_lap_telemetry(session_id: int, driver_id: int, lap_number: int, db: Session = Depends(get_db)):
    """
    Returns a presigned download URL for one normalized lap's telemetry
    parquet — NOT the raw data itself. The frontend fetches `download_url`
    directly from storage.
    """
    asset = (
        db.query(models.TelemetryAsset)
        .filter_by(session_id=session_id, driver_id=driver_id, lap_number=lap_number)
        .first()
    )
    if not asset:
        raise HTTPException(status_code=404, detail="Telemetry not found for this lap")
    return _asset_to_schema(asset)


@router.post("/ghost", response_model=GhostComparisonOut)
def compare_ghost_laps(payload: GhostComparisonRequest, db: Session = Depends(get_db)):
    """
    The Telemetry 'Ghosting' Arena (USP #1). Returns two telemetry asset
    pointers, both already normalized onto the same 0..lap_length distance
    axis at ingestion time (see telemetry_compression.py) — the frontend
    overlays them with no further math required.
    """
    asset_a = (
        db.query(models.TelemetryAsset)
        .filter_by(session_id=payload.session_id, driver_id=payload.driver_a_id, lap_number=payload.driver_a_lap)
        .first()
    )
    asset_b = (
        db.query(models.TelemetryAsset)
        .filter_by(session_id=payload.session_id, driver_id=payload.driver_b_id, lap_number=payload.driver_b_lap)
        .first()
    )
    if not asset_a or not asset_b:
        raise HTTPException(status_code=404, detail="Telemetry not found for one or both laps")

    from app.services.telemetry_compression import NORMALIZED_DISTANCE_POINTS

    return GhostComparisonOut(
        driver_a_asset=_asset_to_schema(asset_a),
        driver_b_asset=_asset_to_schema(asset_b),
        normalized_distance_points=NORMALIZED_DISTANCE_POINTS,
    )
