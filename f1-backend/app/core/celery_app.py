"""
Celery app instance. Workers run this after every race weekend (via beat
schedule below, or triggered manually/via webhook) to pull, clean, and
store new session data. Nothing here should ever run synchronously inside
an API request handler.
"""
from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

celery_app = Celery(
    "f1_platform",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.ingestion_tasks"],
)
celery_app.set_default()

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    broker_connection_retry_on_startup=True,
    task_time_limit=60 * 30,          # hard limit: 30 min per task
    task_soft_time_limit=60 * 25,
    worker_prefetch_multiplier=1,      # telemetry jobs are heavy; don't over-fetch
    result_expires=60 * 60 * 24,       # 1 day
)

# F1 race weekends are known well in advance; a simple polling schedule is
# fine and far simpler than wiring a calendar webhook. Adjust cadence around
# each GP weekend as needed, or trigger `ingest_latest_completed_session`
# manually/from an admin endpoint right after a session ends.
celery_app.conf.beat_schedule = {
    "poll-for-new-sessions-every-30-min": {
        "task": "app.tasks.ingestion_tasks.check_for_new_sessions",
        "schedule": crontab(minute="*/30"),
    },
}
