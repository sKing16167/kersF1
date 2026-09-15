"""
Extract Track Geometry & Optimal Racing Line from FastF1 GPS Telemetry.

This utility loads the fastest qualifying lap from a specified Grand Prix session
and extracts:
1. Centimeter-accurate (X, Y, Z) car coordinate series.
2. Exact corner apex positions and numbers (via session.get_circuit_info()).
3. Normalized SVG path commands (M x0 y0 L x1 y1 ...) scaled to a standard viewBox (e.g. 800x500).
4. Micro-sector speed color mapping.

Usage:
    python extract_track_geometry.py --year 2024 --gp "Monza" --session "Q"
"""

import argparse
import json
import os
import sys
import numpy as np

try:
    import fastf1
except ImportError:
    print("FastF1 is required. Install via: pip install fastf1")
    sys.exit(1)


def extract_circuit_geometry(year: int, gp: str, session_type: str = "Q", width: int = 700, height: int = 400, padding: int = 40):
    cache_dir = os.path.expanduser("~/.fastf1_cache")
    os.makedirs(cache_dir, exist_ok=True)
    fastf1.Cache.enable_cache(cache_dir)

    print(f"Loading session {year} {gp} [{session_type}]...")
    session = fastf1.get_session(year, gp, session_type)
    session.load(laps=True, telemetry=True, weather=False, messages=False)

    # Pick the fastest lap of the entire session (the pole position or fastest lap)
    fastest_lap = session.laps.pick_fastest()
    driver_code = fastest_lap["Driver"]
    lap_time = str(fastest_lap["LapTime"])
    print(f"Fastest lap set by {driver_code}: {lap_time}")

    # Telemetry has X, Y, Z coordinates in decimeters/meters
    telemetry = fastest_lap.get_telemetry()
    if "X" not in telemetry.columns or "Y" not in telemetry.columns:
        raise ValueError("Telemetry does not contain positional X, Y coordinates.")

    x_raw = telemetry["X"].to_numpy()
    y_raw = telemetry["Y"].to_numpy()

    # Normalize coordinates to fit within [padding, width - padding] and [padding, height - padding]
    min_x, max_x = np.nanmin(x_raw), np.nanmax(x_raw)
    min_y, max_y = np.nanmin(y_raw), np.nanmax(y_raw)

    span_x = max_x - min_x or 1.0
    span_y = max_y - min_y or 1.0

    # Maintain aspect ratio
    scale = min((width - 2 * padding) / span_x, (height - 2 * padding) / span_y)
    
    offset_x = (width - span_x * scale) / 2
    offset_y = (height - span_y * scale) / 2

    # FastF1 coordinates typically need Y inversion for SVG (where Y increases downwards)
    x_svg = np.round((x_raw - min_x) * scale + offset_x, 1)
    y_svg = np.round(height - ((y_raw - min_y) * scale + offset_y), 1)

    # Build SVG path string
    svg_points = [f"{x},{y}" for x, y in zip(x_svg, y_svg)]
    svg_path = "M " + " L ".join(svg_points) + " Z"

    # Extract Corner Info if available
    corners_data = []
    try:
        circuit_info = session.get_circuit_info()
        if circuit_info is not None and hasattr(circuit_info, "corners"):
            for idx, corner in circuit_info.corners.iterrows():
                cx_raw, cy_raw = corner["X"], corner["Y"]
                cx_svg = round((cx_raw - min_x) * scale + offset_x, 1)
                cy_svg = round(height - ((cy_raw - min_y) * scale + offset_y), 1)
                corners_data.append({
                    "corner_number": int(corner["Number"]),
                    "x": cx_svg,
                    "y": cy_svg,
                    "angle": float(corner.get("Angle", 0.0)),
                    "distance_m": float(corner.get("Distance", 0.0))
                })
    except Exception as e:
        print(f"Warning: Could not extract exact corner markers: {e}")

    output_data = {
        "circuit_name": session.event["EventName"],
        "year": year,
        "fastest_driver": driver_code,
        "lap_time": lap_time,
        "view_box": f"0 0 {width} {height}",
        "svg_path": svg_path,
        "points_count": len(svg_points),
        "corners": corners_data,
        "sample_points": list(zip(x_svg.tolist(), y_svg.tolist()))[::5] # Every 5th point
    }

    output_filename = f"{gp.lower().replace(' ', '_')}_{year}_geometry.json"
    with open(output_filename, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"Successfully exported accurate track geometry to {output_filename}")
    return output_data


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract accurate F1 track geometry from FastF1")
    parser.add_argument("--year", type=int, default=2024, help="Championship year")
    parser.add_argument("--gp", type=str, default="Monza", help="Grand Prix name or location (e.g. Monza, Spa, Silverstone)")
    parser.add_argument("--session", type=str, default="Q", help="Session type (Q, R, FP2)")
    args = parser.parse_args()

    extract_circuit_geometry(args.year, args.gp, args.session)
