"""
Unified object storage client supporting AWS S3, Cloudflare R2, and local filesystem fallback.

- If STORAGE_PROVIDER == "local" or STORAGE_ACCESS_KEY_ID is empty:
  Saves files to LOCAL_STORAGE_DIR (/data/telemetry_storage) and generates /telemetry-files/{key} URLs.
- If AWS / R2 credentials are provided:
  Uploads to S3/R2 and generates presigned URLs.
"""
import io
import os
from typing import Optional

import boto3
from botocore.client import Config as BotoConfig

from app.core.config import settings

LOCAL_STORAGE_DIR = "/data/telemetry_storage"


def is_local_storage() -> bool:
    return settings.STORAGE_PROVIDER == "local" or not settings.STORAGE_ACCESS_KEY_ID


def _build_client():
    kwargs = dict(
        service_name="s3",
        region_name=settings.STORAGE_REGION,
        aws_access_key_id=settings.STORAGE_ACCESS_KEY_ID,
        aws_secret_access_key=settings.STORAGE_SECRET_ACCESS_KEY,
        config=BotoConfig(signature_version="s3v4"),
    )
    if settings.STORAGE_ENDPOINT_URL:
        # Cloudflare R2 (or any other S3-compatible endpoint)
        kwargs["endpoint_url"] = settings.STORAGE_ENDPOINT_URL
    return boto3.client(**kwargs)


_client = None


def get_client():
    global _client
    if _client is None:
        _client = _build_client()
    return _client


def _resolve_safe_local_path(key: str) -> str:
    base_dir = os.path.abspath(LOCAL_STORAGE_DIR)
    sanitized_key = key.lstrip("/\\")
    file_path = os.path.abspath(os.path.join(base_dir, sanitized_key))
    if os.path.commonpath([base_dir, file_path]) != base_dir:
        raise ValueError(f"Path traversal attempt detected in storage key: {key}")
    return file_path


def upload_bytes(key: str, data: bytes, content_type: str = "application/octet-stream") -> None:
    if is_local_storage():
        file_path = _resolve_safe_local_path(key)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(data)
        return

    get_client().put_object(
        Bucket=settings.STORAGE_BUCKET,
        Key=key,
        Body=data,
        ContentType=content_type,
    )


def upload_fileobj(key: str, fileobj: io.BytesIO, content_type: str = "application/octet-stream") -> None:
    if is_local_storage():
        fileobj.seek(0)
        upload_bytes(key, fileobj.read(), content_type=content_type)
        return

    fileobj.seek(0)
    get_client().upload_fileobj(
        fileobj,
        settings.STORAGE_BUCKET,
        key,
        ExtraArgs={"ContentType": content_type},
    )


def read_bytes(key: str) -> bytes:
    if is_local_storage():
        file_path = _resolve_safe_local_path(key)
        with open(file_path, "rb") as f:
            return f.read()

    resp = get_client().get_object(Bucket=settings.STORAGE_BUCKET, Key=key)
    return resp["Body"].read()


def generate_presigned_url(key: str, expires_in: int = 3600) -> str:
    """
    Presigned GET URL or local static URL — the frontend downloads the parquet
    directly from storage.
    """
    if settings.STORAGE_PUBLIC_BASE_URL:
        return f"{settings.STORAGE_PUBLIC_BASE_URL.rstrip('/')}/{key}"

    if is_local_storage():
        # In local dev, serve from the FastAPI static mount
        return f"/telemetry-files/{key}"

    return get_client().generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.STORAGE_BUCKET, "Key": key},
        ExpiresIn=expires_in,
    )


def object_exists(key: str) -> bool:
    if is_local_storage():
        try:
            file_path = _resolve_safe_local_path(key)
            return os.path.exists(file_path)
        except ValueError:
            return False

    try:
        get_client().head_object(Bucket=settings.STORAGE_BUCKET, Key=key)
        return True
    except Exception:
        return False
