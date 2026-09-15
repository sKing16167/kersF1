import os, json, xml.etree.ElementTree as ET
import numpy as np
from svg_full_parser import parse_svg_path_full, parse_transform, apply_transform_to_points
from build_mock_circuits import CIRCUITS_META
from scipy.signal import find_peaks

def build_dense_spline(svg_filename):
    fp = os.path.join(r'C:\KERS\f1-frontend\public\circuits-svg', svg_filename)
    tree = ET.parse(fp)
    root = tree.getroot()
    paths = root.findall('.//{http://www.w3.org/2000/svg}path')
    
    # Path 0: Track
    track_d = paths[0].get('d', '')
    raw_pts = parse_svg_path_full(track_d)
    
    # Path 1: Start/Finish
    sf_d = paths[1].get('d', '') if len(paths) > 1 else ''
    sf_trans = paths[1].get('transform', '') if len(paths) > 1 else ''
    T_sf = parse_transform(sf_trans)
    sf_raw = parse_svg_path_full(sf_d) if sf_d else []
    sf_pts = apply_transform_to_points(sf_raw, T_sf)
    
    if sf_pts:
        sf_center = (float(np.mean([p[0] for p in sf_pts])), float(np.mean([p[1] for p in sf_pts])))
    else:
        sf_center = raw_pts[0]
        
    # Path 2: Arrow
    arrow_d = paths[2].get('d', '') if len(paths) > 2 else ''
    arrow_trans = paths[2].get('transform', '') if len(paths) > 2 else ''
    T_arrow = parse_transform(arrow_trans)
    arrow_raw = parse_svg_path_full(arrow_d) if arrow_d else []
    arrow_pts = apply_transform_to_points(arrow_raw, T_arrow)
    
    # High-density arc length resampling
    pts = np.array(raw_pts)
    diffs = np.diff(pts, axis=0)
    dists = np.hypot(diffs[:, 0], diffs[:, 1])
    keep = np.insert(dists > 1e-4, 0, True)
    pts = pts[keep]
    
    diffs = np.diff(pts, axis=0)
    dists = np.hypot(diffs[:, 0], diffs[:, 1])
    cum_dist = np.insert(np.cumsum(dists), 0, 0.0)
    total_len = cum_dist[-1]
    
    N_SAMPLES = 5000
    s_even = np.linspace(0, total_len, N_SAMPLES, endpoint=False)
    x_even = np.interp(s_even, cum_dist, pts[:, 0])
    y_even = np.interp(s_even, cum_dist, pts[:, 1])
    
    dists_to_sf = np.hypot(x_even - sf_center[0], y_even - sf_center[1])
    sf_idx = int(np.argmin(dists_to_sf))
    
    # Check direction with arrow
    forward = True
    if len(arrow_pts) >= 3:
        p0 = np.array(arrow_pts[0])
        p_tip = np.array(arrow_pts[len(arrow_pts)//2])
        p_end = np.array(arrow_pts[-1])
        base_mid = 0.5 * (p0 + p_end)
        arrow_vec = p_tip - base_mid
        arrow_norm = np.linalg.norm(arrow_vec)
        if arrow_norm > 1e-4:
            arrow_vec = arrow_vec / arrow_norm
            tan_fwd = np.array([x_even[(sf_idx + 20) % N_SAMPLES] - x_even[sf_idx], y_even[(sf_idx + 20) % N_SAMPLES] - y_even[sf_idx]])
            tan_fwd_norm = np.linalg.norm(tan_fwd)
            if tan_fwd_norm > 1e-4:
                tan_fwd = tan_fwd / tan_fwd_norm
                if np.dot(tan_fwd, arrow_vec) < 0:
                    forward = False
                    
    if not forward:
        x_even = x_even[::-1]
        y_even = y_even[::-1]
        dists_to_sf = np.hypot(x_even - sf_center[0], y_even - sf_center[1])
        sf_idx = int(np.argmin(dists_to_sf))
        
    x_track = np.roll(x_even, -sf_idx)
    y_track = np.roll(y_even, -sf_idx)
    
    return track_d, sf_center, x_track, y_track

def place_corners_flawlessly(x_track, y_track, corner_defs):
    N = len(x_track)
    n = len(corner_defs)
    
    # Curvature calculation
    dx = np.gradient(x_track)
    dy = np.gradient(y_track)
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    denom = (dx**2 + dy**2)**1.5
    denom[denom < 1e-6] = 1e-6
    curvature = np.abs(dx * ddy - dy * ddx) / denom
    
    # Smooth curvature
    window = 15
    kernel = np.ones(window)/window
    curv_smooth = np.convolve(np.tile(curvature, 3), kernel, mode='same')[N:2*N]
    
    # Partition track into n sectors
    # Each sector k gets window [start, end]
    # In each sector, we find the apex (max curvature)
    selected_indices = []
    last_idx = 0
    step = N / n
    
    for k in range(n):
        w_start = int(k * step + 10)
        w_end = int((k + 1) * step - 10)
        
        # Ensure minimum index separation from previous corner
        w_start = max(last_idx + 25, w_start)
        w_end = min(N - (n - 1 - k) * 25 - 1, max(w_start + 1, w_end))
        
        if w_end > w_start:
            sub_curv = curv_smooth[w_start:w_end]
            best_p = w_start + int(np.argmax(sub_curv))
        else:
            best_p = w_start
            
        selected_indices.append(best_p)
        last_idx = best_p
        
    corners = []
    for i, c_info in enumerate(corner_defs):
        name, gear, min_spd, lat_g, is_brake, is_drs, notes = c_info
        p_idx = selected_indices[i]
        cx = round(float(x_track[p_idx]), 1)
        cy = round(float(y_track[p_idx]), 1)
        
        corners.append({
            "corner_number": i + 1,
            "corner_name": name,
            "gear": gear,
            "min_speed_kmh": min_spd,
            "lateral_g": lat_g,
            "brake_zone": is_brake,
            "drs_zone": is_drs,
            "notes": notes,
            "x": cx,
            "y": cy,
            "s_frac": round(p_idx / N, 3)
        })
        
    return corners

def generate_perfect_circuits():
    circuits_out = []
    for c_meta in CIRCUITS_META:
        track_d, sf_center, x_track, y_track = build_dense_spline(c_meta["svg_file"])
        corners = place_corners_flawlessly(x_track, y_track, c_meta["corner_names"])
        
        coords = np.array([(c['x'], c['y']) for c in corners])
        dists = np.hypot(np.diff(coords[:, 0]), np.diff(coords[:, 1]))
        min_dist = np.min(dists)
        s_fracs = [c['s_frac'] for c in corners]
        is_mono = all(s_fracs[i] < s_fracs[i+1] for i in range(len(s_fracs)-1))
        
        print(f"ID {c_meta['id']:02d}: {c_meta['circuit_name']:<35} | {len(corners)} turns | min_dist={min_dist:4.1f}px | monotonic={is_mono}")
        
        circuit_dict = {
            "id": c_meta["id"],
            "circuit_name": c_meta["circuit_name"],
            "location": c_meta["location"],
            "country": c_meta["country"],
            "country_code": c_meta["country_code"],
            "lat": c_meta["lat"],
            "lng": c_meta["lng"],
            "length_km": c_meta["length_km"],
            "corners_count": c_meta["corners_count"],
            "drs_zones": c_meta["drs_zones"],
            "lap_record": c_meta["lap_record"],
            "lap_record_driver": c_meta["lap_record_driver"],
            "lap_record_year": c_meta["lap_record_year"],
            "lap_record_team": c_meta["lap_record_team"],
            "full_throttle_pct": c_meta["full_throttle_pct"],
            "downforce_level": c_meta["downforce_level"],
            "tyre_stress_level": c_meta["tyre_stress_level"],
            "brake_wear_index": c_meta["brake_wear_index"],
            "gear_shifts_per_lap": c_meta["gear_shifts_per_lap"],
            "pit_loss_time_sec": c_meta["pit_loss_time_sec"],
            "first_grand_prix_year": c_meta["first_grand_prix_year"],
            "elevation_gain_m": c_meta["elevation_gain_m"],
            "view_box": "0 0 500 500",
            "start_finish": {
                "x": round(sf_center[0], 1),
                "y": round(sf_center[1], 1),
                "label_x": 20,
                "label_y": 4
            },
            "description": c_meta["description"],
            "svg_path": track_d,
            "optimal_line_svg": track_d,
            "corners": corners
        }
        circuits_out.append(circuit_dict)
        
    return circuits_out

if __name__ == '__main__':
    data = generate_perfect_circuits()
    with open(r'C:\KERS\f1-backend\scripts\perfect_circuits.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Saved perfect_circuits.json successfully!")
