import numpy as np
from track_spline import get_track_spline
from scipy.signal import find_peaks

def segment_calibrate(svg_file, corner_defs):
    track_d, sf_center, x_pts, y_pts = get_track_spline(svg_file)
    N = len(x_pts)
    n = len(corner_defs)
    
    # Curvature
    dx = np.gradient(x_pts)
    dy = np.gradient(y_pts)
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    denom = (dx**2 + dy**2)**1.5
    denom[denom < 1e-6] = 1e-6
    curvature = np.abs(dx * ddy - dy * ddx) / denom
    
    window = 7
    kernel = np.ones(window)/window
    curv_smooth = np.convolve(np.tile(curvature, 3), kernel, mode='same')[N:2*N]
    
    # We define n sequential non-overlapping search windows around the lap
    # window k is [ (k/n)*N + 5, ((k+1)/n)*N - 5 ]
    corners = []
    selected_indices = []
    last_idx = 0
    
    # Partition the track into n sectors proportional to corner density
    step = N / n
    for k in range(n):
        w_start = int(k * step + 5)
        w_end = int((k + 1) * step - 5)
        w_start = max(last_idx + 8, w_start)
        w_end = min(N - (n - 1 - k) * 8 - 1, max(w_start + 1, w_end))
        
        # In this window, find the index of max curvature
        if w_end > w_start:
            window_curv = curv_smooth[w_start:w_end]
            best_in_window = w_start + int(np.argmax(window_curv))
        else:
            best_in_window = w_start
            
        selected_indices.append(best_in_window)
        last_idx = best_in_window
        
    for i, c_info in enumerate(corner_defs):
        name, gear, min_spd, lat_g, is_brake, is_drs, notes = c_info
        p_idx = selected_indices[i]
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
        sf, crs = segment_calibrate(c_meta['svg_file'], c_meta['corner_names'])
        coords = np.array([(c['x'], c['y']) for c in crs])
        dists = np.hypot(np.diff(coords[:, 0]), np.diff(coords[:, 1]))
        min_dist = np.min(dists)
        max_dist = np.max(dists)
        s_fracs = [c['s_frac'] for c in crs]
        is_mono = all(s_fracs[i] < s_fracs[i+1] for i in range(len(s_fracs)-1))
        print(f"ID {c_meta['id']:02d}: min_dist={min_dist:4.1f}px, max_dist={max_dist:5.1f}px | monotonic={is_mono} | {c_meta['circuit_name']}")
