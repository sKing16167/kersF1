from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.db import models
from app.schemas.race import RaceOut, LapTimeOut, CircuitOut

from app.services import jolpica_service

router = APIRouter()


@router.get("/current/next")
def get_current_next_race():
    """Fetch the next scheduled Formula 1 Grand Prix weekend."""
    next_race = jolpica_service.get_next_race()
    if next_race:
        return next_race
    return {
        "season": "2026",
        "round": "15",
        "raceName": "Azerbaijan Grand Prix",
        "Circuit": {"circuitName": "Baku City Circuit", "Location": {"country": "Azerbaijan"}},
        "date": "2026-09-26",
    }


@router.get("/{season}/{round_num}/results")
def get_official_race_results(season: int, round_num: int):
    """Fetch official FIA race classification for any round and season."""
    res = jolpica_service.get_race_result(season, round_num)
    if res:
        return res
    raise HTTPException(status_code=404, detail="Race result not found or pending session")


@router.get("/", response_model=List[RaceOut])
def list_races(season: Optional[int] = Query(None), db: Session = Depends(get_db)):
    q = db.query(models.Race).options(joinedload(models.Race.circuit), joinedload(models.Race.sessions))
    if season:
        q = q.filter(models.Race.season_year == season)
    return q.order_by(models.Race.round).all()


@router.get("/{race_id}", response_model=RaceOut)
def get_race(race_id: int, db: Session = Depends(get_db)):
    race = db.query(models.Race).options(
        joinedload(models.Race.circuit), joinedload(models.Race.sessions)
    ).get(race_id)
    if not race:
        raise HTTPException(status_code=404, detail="Race not found")
    return race


@router.get("/sessions/{session_id}/laps", response_model=List[LapTimeOut])
def get_session_laps(session_id: int, driver_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.LapTime).filter(models.LapTime.session_id == session_id)
    if driver_id:
        q = q.filter(models.LapTime.driver_id == driver_id)
    return q.order_by(models.LapTime.lap_number).all()


@router.get("/circuits/", response_model=List[CircuitOut])
def list_circuits(db: Session = Depends(get_db)):
    """Historical Track Encyclopedia listing."""
    return db.query(models.Circuit).all()


@router.get("/circuits/{circuit_id}", response_model=CircuitOut)
def get_circuit(circuit_id: int, db: Session = Depends(get_db)):
    circuit = db.query(models.Circuit).get(circuit_id)
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return circuit
