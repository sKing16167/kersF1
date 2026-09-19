"""
Small internal trigger so you (or a cron/webhook) can kick off ingestion
for a specific session right after it finishes, instead of waiting on the
beat schedule's 30-minute poll. Lock this down (e.g. an internal-only
network rule, or an API-key header check) before exposing it publicly —
it is not authenticated by default.
"""
from enum import Enum
from fastapi import APIRouter, Depends, HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel, Field

from app.core.config import settings
from app.tasks.ingestion_tasks import ingest_session_weekend

router = APIRouter()
api_key_header = APIKeyHeader(name="X-Admin-API-Key", auto_error=False)


def verify_admin_key(key: str = Security(api_key_header)):
    if not key or key != settings.SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing administrative API key"
        )
    return key


class SessionTypeEnum(str, Enum):
    FP1 = "FP1"
    FP2 = "FP2"
    FP3 = "FP3"
    Q = "Q"
    SQ = "SQ"
    R = "R"


class TriggerIngestionRequest(BaseModel):
    year: int = Field(..., ge=1950, le=2100)
    gp_name: str = Field(..., min_length=1, max_length=100)
    session_type: SessionTypeEnum


@router.post("/trigger-ingestion", dependencies=[Depends(verify_admin_key)])
def trigger_ingestion(payload: TriggerIngestionRequest):
    task = ingest_session_weekend.delay(
        year=payload.year, gp_name=payload.gp_name, session_type=payload.session_type.value
    )
    return {"task_id": task.id, "status": "queued"}
