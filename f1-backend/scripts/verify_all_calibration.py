import os, json
from build_mock_circuits import CIRCUITS_META
from calibrate_corners import calibrate_circuit_corners
from track_spline import get_track_spline
import numpy as np

def test_all_23_calibration():
    svg_dir = r'C:\KERS\f1-frontend\public\circuits-svg'
    issues = []
    
    for c_meta in CIRCUITS_META:
        svg_file = c_meta["svg_file"]
        corner_defs = c_meta["corner_names"]
        sf_center, corners = calibrate_circuit_corners(svg_file, corner_defs)
        
        # Check consecutive distances
        coords = np.array([(c['x'], c['y']) for c in corners])
        dists = np.hypot(np.diff(coords[:, 0]), np.diff(coords[:, 1]))
        min_dist = np.min(dists)
        
        # Check s_frac progression
        s_fracs = [c['s_frac'] for c in corners]
        is_monotonic = all(s_fracs[i] < s_fracs[i+1] for i in range(len(s_fracs)-1))
        
        status = "OK"
        if min_dist < 8.0:
            status = f"WARNING: min_dist={min_dist:.1f}px"
            issues.append((c_meta['circuit_name'], status))
        if not is_monotonic:
            status = f"ERROR: not monotonic {s_fracs}"
            issues.append((c_meta['circuit_name'], status))
            
        print(f"ID {c_meta['id']:02d} | {c_meta['circuit_name']:<35} | {len(corners)} turns | min_dist={min_dist:4.1f}px | monotonic={is_monotonic} -> {status}")

    print(f"\nTotal issues: {len(issues)}")
    for name, iss in issues:
        print(f"  {name}: {iss}")

test_all_23_calibration()
