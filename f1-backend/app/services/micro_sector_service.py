"""
Micro-Sector Track Map (USP #2): splits a lap into 50+ evenly-spaced
distance segments (vs. the standard 3 timing sectors) and, for each
segment, determines which driver carried the highest MINIMUM speed
through it (the minimum, not average/max, is what actually indicates
who carried the most apex/corner speed — a driver can have a higher
average by braking later and exiting faster, but the minimum is the
true "corner speed" metric).

This runs once per session as a Celery task after all drivers' lap
telemetry has been ingested, and the result is cached in
MicroSectorResult so the API endpoint is a simple read.
"""
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd

DEFAULT_MICRO_SECTOR_COUNT = 60


def compute_micro_sectors(
    driver_telemetry: Dict[int, pd.DataFrame],
    lap_length_m: float,
    micro_sector_count: int = DEFAULT_MICRO_SECTOR_COUNT,
) -> List[dict]:
    """
    driver_telemetry: {driver_id: normalized telemetry DataFrame with
        columns ['Distance', 'Speed', 'X', 'Y']} — one fastest/representative
        lap per driver for this session (typically each driver's fastest lap).
    Returns a list of dicts ready to bulk-insert into MicroSectorResult.
    """
    boundaries = np.linspace(0, lap_length_m, micro_sector_count + 1)
    results = []

    for i in range(micro_sector_count):
        seg_start, seg_end = boundaries[i], boundaries[i + 1]
        best_driver_id = None
        best_min_speed = -1.0
        geometry = None

        for driver_id, tel in driver_telemetry.items():
            mask = (tel["Distance"] >= seg_start) & (tel["Distance"] < seg_end)
            segment = tel.loc[mask]
            if segment.empty:
                continue

            min_speed_in_segment = float(segment["Speed"].min())
            if min_speed_in_segment > best_min_speed:
                best_min_speed = min_speed_in_segment
                best_driver_id = driver_id
                if {"X", "Y"}.issubset(segment.columns):
                    geometry = segment[["X", "Y"]].round(1).values.tolist()

        results.append({
            "micro_sector_index": i,
            "distance_start_m": float(seg_start),
            "distance_end_m": float(seg_end),
            "best_driver_id": best_driver_id,
            "min_apex_speed_kph": best_min_speed if best_min_speed >= 0 else None,
            "geometry": geometry,
        })

    return results
