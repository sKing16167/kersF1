"""
This is the piece that makes the "Ghosting" Arena and Micro-Sector maps
viable at all: raw 4Hz telemetry for a single lap is small per-lap, but
across every driver/lap/session in a season it is far too much to ever
put in a JSON API response. Instead we:

  1. Normalize each lap onto a fixed lap-distance axis (0..1, or
     0..lap_length_m) via interpolation, instead of raw timestamps — this
     is what lets the frontend directly overlay two different drivers'
     laps (different lap times) on the same X axis with zero client-side
     math.
  2. Downsample/select only the columns the frontend actually charts
     (Speed, Throttle, Brake, nGear, DRS, X, Y, Distance) — drop RPM-level
     noise unless specifically requested.
  3. Write as Parquet (columnar + compressed — typically 5-10x smaller
     than equivalent JSON, and natively readable by pandas/duckdb and by
     JS parquet readers like hyparquet on the frontend).
"""
import io
from typing import Optional

import numpy as np
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
from scipy.interpolate import interp1d

from app.services import s3_client

# Columns kept for the standard "ghosting" payload. Extend per-feature if needed.
DEFAULT_COLUMNS = ["Distance", "Speed", "Throttle", "Brake", "nGear", "DRS", "X", "Y"]
NORMALIZED_DISTANCE_POINTS = 500   # resolution of the shared X axis for overlay comparisons


def normalize_and_compress_lap(
    raw_telemetry: pd.DataFrame,
    columns: Optional[list] = None,
) -> bytes:
    """
    raw_telemetry: FastF1's per-lap telemetry dataframe (must include a
    'Distance' column — FastF1 provides this natively via add_distance()).
    Returns parquet bytes ready to upload.
    """
    columns = columns or DEFAULT_COLUMNS
    df = raw_telemetry.copy()

    if "Distance" not in df.columns:
        # FastF1 telemetry objects support this helper directly when called
        # on the actual Telemetry object; if a plain DataFrame reaches here
        # without it, that's a caller bug — fail loudly rather than silently
        # producing an unusable file.
        raise ValueError("raw_telemetry must include a 'Distance' column (call .add_distance() first)")

    df = df[[c for c in columns if c in df.columns]].dropna(subset=["Distance"])
    df = df.drop_duplicates(subset=["Distance"]).sort_values("Distance")

    lap_length = df["Distance"].iloc[-1]
    target_distance = np.linspace(0, lap_length, NORMALIZED_DISTANCE_POINTS)

    normalized = {"Distance": target_distance}
    for col in columns:
        if col == "Distance" or col not in df.columns:
            continue
        # nGear/DRS are step functions — nearest-neighbor holds the value
        # correctly; continuous channels (Speed/Throttle/Brake/X/Y) use
        # linear interpolation.
        if col in ("nGear", "DRS"):
            # Step-function channels — nearest-neighbor holds the correct
            # discrete value instead of blending between gears/DRS states.
            f = interp1d(
                df["Distance"], df[col], kind="nearest",
                bounds_error=False, fill_value=(df[col].iloc[0], df[col].iloc[-1]),
            )
            normalized[col] = f(target_distance)
        else:
            normalized[col] = np.interp(target_distance, df["Distance"], df[col])

    out_df = pd.DataFrame(normalized)

    table = pa.Table.from_pandas(out_df, preserve_index=False)
    buf = io.BytesIO()
    pq.write_table(table, buf, compression="zstd")
    return buf.getvalue()


import re

def build_and_upload_lap_asset(
    raw_telemetry: pd.DataFrame,
    season_year: int,
    circuit_ref: str,
    session_type: str,
    driver_code: str,
    lap_number: int,
) -> dict:
    """
    Full pipeline: normalize -> compress -> upload -> return metadata to
    persist in TelemetryAsset. Called from the Celery ingestion task, never
    from a request handler.
    """
    safe_circuit = re.sub(r"[^a-zA-Z0-9_-]", "", str(circuit_ref))
    safe_session = re.sub(r"[^a-zA-Z0-9_-]", "", str(session_type))
    safe_driver = re.sub(r"[^a-zA-Z0-9_-]", "", str(driver_code))
    safe_year = int(season_year)
    safe_lap = int(lap_number)

    parquet_bytes = normalize_and_compress_lap(raw_telemetry)
    key = (
        f"telemetry/{safe_year}/{safe_circuit}/{safe_session}/"
        f"{safe_driver}/lap_{safe_lap:03d}.parquet"
    )
    s3_client.upload_bytes(key, parquet_bytes, content_type="application/octet-stream")

    return {
        "storage_key": key,
        "format": "parquet",
        "point_count": NORMALIZED_DISTANCE_POINTS,
        "file_size_bytes": len(parquet_bytes),
    }
