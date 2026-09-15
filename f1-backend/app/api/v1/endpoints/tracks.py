from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db import models
from app.schemas.telemetry import MicroSectorMapOut, MicroSectorOut

router = APIRouter()


@router.get("/micro-sectors/{session_id}", response_model=MicroSectorMapOut)
def get_micro_sector_map(session_id: int, db: Session = Depends(get_db)):
    """
    Micro-Sector Track Map (USP #2). Precomputed by
    app.tasks.ingestion_tasks.compute_micro_sectors_for_session — this
    endpoint is a cheap read, no on-request computation.
    """
    rows = (
        db.query(models.MicroSectorResult)
        .filter(models.MicroSectorResult.session_id == session_id)
        .order_by(models.MicroSectorResult.micro_sector_index)
        .all()
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Micro-sector map not yet computed for this session")

    return MicroSectorMapOut(
        session_id=session_id,
        total_micro_sectors=len(rows),
        sectors=[MicroSectorOut.model_validate(r) for r in rows],
    )
