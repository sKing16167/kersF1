"""
Small internal trigger so you (or a cron/webhook) can kick off ingestion
for a specific session right after it finishes, instead of waiting on the
beat schedule's 30-minute poll. Lock this down (e.g. an internal-only
network rule, or an API-key header check) before exposing it publicly —
it is not authenticated by default.
"""
from fastapi import APIRouter
from pydantic import BaseModel

from app.tasks.ingestion_tasks import ingest_session_weekend

router = APIRouter()


class TriggerIngestionRequest(BaseModel):
    year: int
    gp_name: str            # e.g. "Italian Grand Prix" or "Monza"
    session_type: str       # FP1 | FP2 | FP3 | Q | SQ | R


@router.post("/trigger-ingestion")
def trigger_ingestion(payload: TriggerIngestionRequest):
    task = ingest_session_weekend.delay(
        year=payload.year, gp_name=payload.gp_name, session_type=payload.session_type
    )
    return {"task_id": task.id, "status": "queued"}
