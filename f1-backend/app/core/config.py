"""
Central settings object. Everything is loaded from environment variables
(.env in local dev, real env vars in production) — never hardcode secrets.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = "changeme"
    CORS_ORIGINS: str = "http://localhost:3000"

    # Postgres
    DATABASE_URL: str

    # Redis / Celery
    REDIS_URL: str = "redis://localhost:6379/0"

    # Object storage
    STORAGE_PROVIDER: str = "s3"
    STORAGE_BUCKET: str
    STORAGE_REGION: str = "us-east-1"
    STORAGE_ACCESS_KEY_ID: str = ""
    STORAGE_SECRET_ACCESS_KEY: str = ""
    STORAGE_ENDPOINT_URL: str = ""
    STORAGE_PUBLIC_BASE_URL: str = ""

    # External data sources
    OPENF1_BASE_URL: str = "https://api.openf1.org/v1"
    FASTF1_CACHE_DIR: str = "/data/fastf1_cache"
    JOLPICA_BASE_URL: str = "https://api.jolpi.ca/ergast/f1"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    def validate_security(self) -> None:
        if self.APP_ENV == "production" and self.SECRET_KEY in (
            "changeme",
            "changeme-generate-a-long-random-string",
            "",
        ):
            raise ValueError(
                "CRITICAL SECURITY CONFIGURATION ERROR: SECRET_KEY must be set to a "
                "strong random secret in production mode. Refusing to start with insecure default."
            )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
settings.validate_security()
