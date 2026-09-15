import os, json, xml.etree.ElementTree as ET
import numpy as np
from track_spline import get_track_spline
from scipy.signal import find_peaks

def calibrate_circuit_corners(svg_file, corner_defs):
    track_d, sf_center, x_pts, y_pts = get_track_spline(svg_file)
    N = len(x_pts)
    n_corners = len(corner_defs)
    
    # Calculate curvature at high resolution
    dx = np.gradient(x_pts)
    dy = np.gradient(y_pts)
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    denom = (dx**2 + dy**2)**1.5
    denom[denom < 1e-6] = 1e-6
    curvature = np.abs(dx * ddy - dy * ddx) / denom
    
    # Mild smoothing
    window = 9
    kernel = np.ones(window)/window
    curv_smooth = np.convolve(np.tile(curvature, 3), kernel, mode='same')[N:2*N]
    
    # Peak finding
    min_dist_idx = max(8, N // (n_corners * 5))
    peaks, props = find_peaks(curv_smooth, distance=min_dist_idx, prominence=0.0002)
    
    target_s = np.linspace(0.02, 0.98, n_corners) * N
    selected_peaks = []
    last_p = 0
    
    MIN_PIXEL_DIST = 10.0
    
    for i, ts in enumerate(target_s):
        rem = n_corners - 1 - i
        max_allowed_p = N - 1 - rem * 6
        
        # Candidate peaks that are at least MIN_PIXEL_DIST away from last_p
        cands = []
        for p in peaks:
            if p > last_p and p <= max_allowed_p:
                if len(selected_peaks) == 0:
                    cands.append(p)
                else:
                    prev_p = selected_peaks[-1]
                    d_px = np.hypot(x_pts[p] - x_pts[prev_p], y_pts[p] - y_pts[prev_p])
                    if d_px >= MIN_PIXEL_DIST:
                        cands.append(p)
                        
        if cands:
            cand_proms = np.array([props['prominences'][np.where(peaks == c)[0][0]] for c in cands])
            cand_dists = np.abs(np.array(cands) - ts)
            scores = cand_dists / N - 0.25 * (cand_proms / (np.max(props['prominences']) + 1e-6))
            best_cand = cands[np.argmin(scores)]
            selected_peaks.append(best_cand)
            last_p = best_cand
        else:
            # Step forward along track until we have MIN_PIXEL_DIST
            fallback_p = last_p + 8
            while fallback_p < max_allowed_p:
                prev_p = selected_peaks[-1] if selected_peaks else 0
                d_px = np.hypot(x_pts[fallback_p] - x_pts[prev_p], y_pts[fallback_p] - y_pts[prev_p])
                if d_px >= MIN_PIXEL_DIST:
                    break
                fallback_p += 4
            fallback_p = min(fallback_p, max_allowed_p)
            selected_peaks.append(fallback_p)
            last_p = fallback_p
            
    corners = []
    for i, c_info in enumerate(corner_defs):
        name, gear, min_spd, lat_g, is_brake, is_drs, notes = c_info
        p_idx = min(selected_peaks[i], N - 1)
        cx = round(float(x_pts[p_idx]), 1)
        cy = round(float(y_pts[p_idx]), 1)
        
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
        
    return sf_center, corners

if __name__ == '__main__':
    from build_mock_circuits import CIRCUITS_META
    for c_meta in CIRCUITS_META:
        sf, crs = calibrate_circuit_corners(c_meta['svg_file'], c_meta['corner_names'])
        coords = np.array([(c['x'], c['y']) for c in crs])
        dists = np.hypot(np.diff(coords[:, 0]), np.diff(coords[:, 1]))
        min_dist = np.min(dists)
        s_fracs = [c['s_frac'] for c in crs]
        is_mono = all(s_fracs[i] < s_fracs[i+1] for i in range(len(s_fracs)-1))
        print(f"ID {c_meta['id']:02d}: min_dist={min_dist:4.1f}px | monotonic={is_mono} | {c_meta['circuit_name']}")
