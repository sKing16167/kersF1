from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db import models
from app.schemas.telemetry import RadioMessageOut

router = APIRouter()


@router.get("/session/{session_id}", response_model=List[RadioMessageOut])
def get_session_radio(session_id: int, driver_id: int | None = None, db: Session = Depends(get_db)):
    """
    Radio-Sync Timeline (USP #4). Returns radio messages ordered by session
    time; `telemetry_lap_number`/`telemetry_distance_m` (when populated by
    the ingestion pipeline's timestamp-matching step) let the frontend drop
    a marker directly onto the corresponding point in the telemetry chart.
    """
    q = db.query(models.RadioMessage).filter(models.RadioMessage.session_id == session_id)
    if driver_id:
        q = q.filter(models.RadioMessage.driver_id == driver_id)
    rows = q.order_by(models.RadioMessage.session_time_seconds).all()

    return [
        RadioMessageOut(
            id=r.id,
            driver_id=r.driver_id,
            lap_number=r.lap_number,
            session_time_seconds=r.session_time_seconds,
            transcript_text=r.transcript_text,
            audio_url=r.audio_url,
            telemetry_lap_number=r.lap_number,
            telemetry_distance_m=None,
        )
        for r in rows
    ]
