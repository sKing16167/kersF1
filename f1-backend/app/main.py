import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.api import api_router
from app.services.s3_client import LOCAL_STORAGE_DIR

app = FastAPI(
    title="F1 Data Platform API",
    description=(
        "Backend for the Telemetry Ghosting Arena, Micro-Sector Track Maps, "
        "Undercut/Overcut Predictor, Radio-Sync Timeline, Track Encyclopedia "
        "and Driver/Constructor Hub."
    ),
    version="0.1.0",
    default_response_class=ORJSONResponse,   # faster JSON encoding for larger list responses
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(LOCAL_STORAGE_DIR, exist_ok=True)
app.mount("/telemetry-files", StaticFiles(directory=LOCAL_STORAGE_DIR), name="telemetry-files")

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
def health_check():
    return {"status": "ok", "env": settings.APP_ENV}
