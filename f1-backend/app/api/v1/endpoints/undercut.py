import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db import models
from app.schemas.telemetry import UndercutRequest, UndercutWindowOut
from app.services.undercut_predictor import fit_degradation_model, predict_optimal_pit_lap

router = APIRouter()


def _historical_laps_df(db: Session, circuit_id: int, driver_id: int) -> pd.DataFrame:
    rows = (
        db.query(models.LapTime)
        .join(models.RaceSession, models.LapTime.session_id == models.RaceSession.id)
        .join(models.Race, models.RaceSession.race_id == models.Race.id)
        .filter(models.Race.circuit_id == circuit_id)
        .filter(models.LapTime.driver_id == driver_id)
        .filter(models.RaceSession.session_type == "R")
        .filter(models.LapTime.is_deleted.is_(False))
        .all()
    )
    return pd.DataFrame([{
        "compound": r.compound, "tyre_life": r.tyre_life, "lap_time_ms": r.lap_time_ms,
    } for r in rows if r.compound and r.tyre_life is not None and r.lap_time_ms])


@router.post("/predict", response_model=UndercutWindowOut)
def predict_undercut(payload: UndercutRequest, db: Session = Depends(get_db)):
    session = db.query(models.RaceSession).get(payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    circuit_id = session.race.circuit_id

    attacker_current = (
        db.query(models.LapTime)
        .filter_by(session_id=payload.session_id, driver_id=payload.attacking_driver_id,
                   lap_number=payload.attacking_driver_current_lap)
        .first()
    )
    defender_current = (
        db.query(models.LapTime)
        .filter(models.LapTime.session_id == payload.session_id,
                models.LapTime.driver_id == payload.defending_driver_id)
        .order_by(models.LapTime.lap_number.desc())
        .first()
    )
    if not attacker_current or not defender_current or not attacker_current.compound or not defender_current.compound:
        raise HTTPException(status_code=422, detail="Not enough current-session data for these drivers/laps")

    attacker_hist = _historical_laps_df(db, circuit_id, payload.attacking_driver_id)
    defender_hist = _historical_laps_df(db, circuit_id, payload.defending_driver_id)

    attacker_model = fit_degradation_model(attacker_hist, attacker_current.compound)
    defender_model = fit_degradation_model(defender_hist, defender_current.compound)

    if not attacker_model or not defender_model:
        raise HTTPException(
            status_code=422,
            detail="Not enough historical race-pace data at this circuit to fit a degradation model yet",
        )

    result = predict_optimal_pit_lap(
        attacker_current_lap=payload.attacking_driver_current_lap,
        gap_to_defender_seconds=payload.gap_seconds,
        attacker_model=attacker_model,
        defender_model=defender_model,
        attacker_current_tyre_life=attacker_current.tyre_life or 0,
        defender_current_tyre_life=defender_current.tyre_life or 0,
    )
    return UndercutWindowOut(**result)
