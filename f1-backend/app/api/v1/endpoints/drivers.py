from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.db import models
from app.schemas.driver import DriverOut, ConstructorOut, HeadToHeadStat, DriverStandingOut, ConstructorStandingOut

from app.services import jolpica_service

router = APIRouter()


@router.get("/", response_model=List[DriverOut])
def list_drivers(db: Session = Depends(get_db)):
    return db.query(models.Driver).all()


@router.get("/head-to-head", response_model=HeadToHeadStat)
def compare_drivers_head_to_head(
    driver_a_id: int = Query(..., description="Driver A ID"),
    driver_b_id: int = Query(..., description="Driver B ID"),
    season: Optional[int] = Query(None, description="Season year filter"),
    db: Session = Depends(get_db),
):
    """
    Head-to-head comparison matrix for the Driver & Constructor Hub.
    Calculates qualifying delta, race pace gap, and direct finishing head-to-head.
    """
    driver_a = db.query(models.Driver).get(driver_a_id)
    driver_b = db.query(models.Driver).get(driver_b_id)
    if not driver_a or not driver_b:
        raise HTTPException(status_code=404, detail="One or both drivers not found")

    q_sessions = (
        db.query(models.RaceSession)
        .join(models.Race)
        .filter(models.RaceSession.session_type.in_(["Q", "SQ"]))
    )
    r_sessions = (
        db.query(models.RaceSession)
        .join(models.Race)
        .filter(models.RaceSession.session_type == "R")
    )
    if season:
        q_sessions = q_sessions.filter(models.Race.season_year == season)
        r_sessions = r_sessions.filter(models.Race.season_year == season)

    # Qualifying gap
    q_diffs = []
    for s in q_sessions.all():
        best_a = db.query(func.min(models.LapTime.lap_time_ms)).filter_by(session_id=s.id, driver_id=driver_a_id).scalar()
        best_b = db.query(func.min(models.LapTime.lap_time_ms)).filter_by(session_id=s.id, driver_id=driver_b_id).scalar()
        if best_a and best_b:
            q_diffs.append(best_a - best_b)

    # Race head-to-head & pace delta
    driver_a_wins = 0
    driver_b_wins = 0
    race_pace_diffs = []
    sessions_compared = 0

    for s in r_sessions.all():
        last_a = (
            db.query(models.LapTime)
            .filter_by(session_id=s.id, driver_id=driver_a_id)
            .order_by(models.LapTime.lap_number.desc())
            .first()
        )
        last_b = (
            db.query(models.LapTime)
            .filter_by(session_id=s.id, driver_id=driver_b_id)
            .order_by(models.LapTime.lap_number.desc())
            .first()
        )
        if last_a and last_b and last_a.position and last_b.position:
            sessions_compared += 1
            if last_a.position < last_b.position:
                driver_a_wins += 1
            elif last_b.position < last_a.position:
                driver_b_wins += 1

            # Average race lap pace
            avg_a = db.query(func.avg(models.LapTime.lap_time_ms)).filter_by(session_id=s.id, driver_id=driver_a_id).filter(models.LapTime.is_deleted.is_(False)).scalar()
            avg_b = db.query(func.avg(models.LapTime.lap_time_ms)).filter_by(session_id=s.id, driver_id=driver_b_id).filter(models.LapTime.is_deleted.is_(False)).scalar()
            if avg_a and avg_b:
                race_pace_diffs.append(float(avg_a - avg_b))

    return HeadToHeadStat(
        driver_a=DriverOut.model_validate(driver_a),
        driver_b=DriverOut.model_validate(driver_b),
        sessions_compared=sessions_compared,
        driver_a_wins=driver_a_wins,
        driver_b_wins=driver_b_wins,
        avg_qualifying_gap_ms=round(sum(q_diffs) / len(q_diffs), 2) if q_diffs else 0.0,
        avg_race_pace_gap_ms=round(sum(race_pace_diffs) / len(race_pace_diffs), 2) if race_pace_diffs else 0.0,
    )


POINTS_SYSTEM = {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1}


@router.get("/standings", response_model=List[DriverStandingOut])
def get_driver_standings(season: int = 2024, db: Session = Depends(get_db)):
    """Championship standings snapshot computed from completed Grand Prix sessions."""
    # Check if ChampionshipStanding rows exist
    standings = (
        db.query(models.ChampionshipStanding)
        .filter(models.ChampionshipStanding.season_year == season, models.ChampionshipStanding.driver_id.isnot(None))
        .order_by(models.ChampionshipStanding.points.desc())
        .all()
    )
    if standings:
        out = []
        for s in standings:
            driver = db.query(models.Driver).get(s.driver_id)
            if driver:
                entry = db.query(models.DriverConstructorEntry).filter_by(season_year=season, driver_id=driver.id).first()
                constructor = db.query(models.Constructor).get(entry.constructor_id) if entry else None
                out.append(DriverStandingOut(
                    position=s.position,
                    points=s.points,
                    driver=DriverOut.model_validate(driver),
                    constructor=ConstructorOut.model_validate(constructor) if constructor else None,
                ))
        return out

    # Compute from race finish positions dynamically
    driver_points = {}
    r_sessions = (
        db.query(models.RaceSession)
        .join(models.Race)
        .filter(models.Race.season_year == season, models.RaceSession.session_type == "R")
        .all()
    )
    for s in r_sessions:
        drivers = db.query(models.Driver).all()
        for d in drivers:
            last_lap = (
                db.query(models.LapTime)
                .filter_by(session_id=s.id, driver_id=d.id)
                .order_by(models.LapTime.lap_number.desc())
                .first()
            )
            if last_lap and last_lap.position:
                pts = POINTS_SYSTEM.get(last_lap.position, 0)
                driver_points[d.id] = driver_points.get(d.id, 0.0) + pts

    sorted_drivers = sorted(driver_points.items(), key=lambda x: x[1], reverse=True)
    results = []
    for pos, (d_id, pts) in enumerate(sorted_drivers, start=1):
        driver = db.query(models.Driver).get(d_id)
        if driver:
            entry = db.query(models.DriverConstructorEntry).filter_by(season_year=season, driver_id=driver.id).first()
            constructor = db.query(models.Constructor).get(entry.constructor_id) if entry else None
            results.append(DriverStandingOut(
                position=pos,
                points=pts,
                driver=DriverOut.model_validate(driver),
                constructor=ConstructorOut.model_validate(constructor) if constructor else None,
            ))
    if results:
        return results

    # Fetch verified live/historical standings from Jolpica F1 API
    live_standings = jolpica_service.get_driver_standings(season)
    if live_standings:
        api_results = []
        for d in live_standings:
            first_name = d["driver"]["full_name"].split(" ")[0]
            last_name = " ".join(d["driver"]["full_name"].split(" ")[1:]) if " " in d["driver"]["full_name"] else d["driver"]["full_name"]
            driver_obj = DriverOut(
                id=abs(hash(d["driver"]["id"])) % 100000,
                ref=d["driver"]["id"],
                code=d["driver"].get("code"),
                permanent_number=d["driver"].get("driver_number"),
                first_name=first_name,
                last_name=last_name,
                nationality=d["driver"].get("nationality"),
            )
            const_obj = None
            if d.get("constructor"):
                const_obj = ConstructorOut(
                    id=abs(hash(d["constructor"]["id"])) % 100000,
                    ref=d["constructor"]["id"],
                    name=d["constructor"]["name"],
                )
            api_results.append(DriverStandingOut(
                position=d["position"],
                points=d["points"],
                driver=driver_obj,
                constructor=const_obj,
            ))
        return api_results

    return []


@router.get("/constructors/", response_model=List[ConstructorOut])
def list_constructors(db: Session = Depends(get_db)):
    return db.query(models.Constructor).all()


@router.get("/constructors/standings", response_model=List[ConstructorStandingOut])
def get_constructor_standings(season: int = 2024, db: Session = Depends(get_db)):
    """Constructor championship standings for the season."""
    # First try fetching from jolpica for official standings
    live_c_standings = jolpica_service.get_constructor_standings(season)
    if live_c_standings:
        return [
            ConstructorStandingOut(
                position=c["position"],
                points=c["points"],
                constructor=ConstructorOut(
                    id=abs(hash(c["constructor"]["id"])) % 100000,
                    ref=c["constructor"]["id"],
                    name=c["constructor"]["name"],
                    nationality=c["constructor"].get("nationality"),
                ),
            )
            for c in live_c_standings
        ]

    driver_standings = get_driver_standings(season=season, db=db)
    team_points = {}
    team_map = {}

    for ds in driver_standings:
        if ds.constructor:
            c_id = ds.constructor.id
            team_points[c_id] = team_points.get(c_id, 0.0) + ds.points
            team_map[c_id] = ds.constructor

    sorted_teams = sorted(team_points.items(), key=lambda x: x[1], reverse=True)
    return [
        ConstructorStandingOut(
            position=pos,
            points=pts,
            constructor=team_map[c_id],
        )
        for pos, (c_id, pts) in enumerate(sorted_teams, start=1)
    ]


@router.get("/{driver_id}", response_model=DriverOut)
def get_driver(driver_id: int, db: Session = Depends(get_db)):
    driver = db.query(models.Driver).get(driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver
