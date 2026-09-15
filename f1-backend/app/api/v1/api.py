from fastapi import APIRouter

from app.api.v1.endpoints import drivers, races, telemetry, tracks, undercut, radio, admin

api_router = APIRouter()

api_router.include_router(admin.router, prefix="/admin", tags=["Admin / Ingestion Triggers"])

api_router.include_router(drivers.router, prefix="/drivers", tags=["Drivers & Constructors"])
api_router.include_router(races.router, prefix="/races", tags=["Races & Circuits"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["Telemetry (Ghosting Arena)"])
api_router.include_router(tracks.router, prefix="/tracks", tags=["Micro-Sector Track Maps"])
api_router.include_router(undercut.router, prefix="/undercut", tags=["Undercut/Overcut Predictor"])
api_router.include_router(radio.router, prefix="/radio", tags=["Radio-Sync Timeline"])
