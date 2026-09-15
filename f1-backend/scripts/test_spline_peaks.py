from track_spline import get_track_spline
import numpy as np
from scipy.signal import find_peaks

def test_circuit(svg_file, expected_corners):
    track_d, sf_center, x_pts, y_pts = get_track_spline(svg_file)
    N = len(x_pts)
    
    # Curvature
    dx = np.gradient(x_pts)
    dy = np.gradient(y_pts)
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    denom = (dx**2 + dy**2)**1.5
    denom[denom < 1e-6] = 1e-6
    curvature = np.abs(dx * ddy - dy * ddx) / denom
    
    window = 25
    kernel = np.ones(window)/window
    curv_smooth = np.convolve(np.tile(curvature, 3), kernel, mode='same')[N:2*N]
    
    min_dist = max(20, N // (expected_corners * 3))
    peaks, props = find_peaks(curv_smooth, distance=min_dist, prominence=0.001)
    
    # If more peaks than corners, select by prominence while keeping order
    if len(peaks) > expected_corners:
        proms = props['prominences']
        top_idx = np.argsort(proms)[-expected_corners:]
        chosen_peaks = np.sort(peaks[top_idx])
    elif len(peaks) == expected_corners:
        chosen_peaks = peaks
    else:
        chosen_peaks = np.linspace(50, N-50, expected_corners, dtype=int)
        
    print(f"\n=== {svg_file} ({expected_corners} turns, peaks found: {len(peaks)}) ===")
    print(f"SF: ({sf_center[0]:.1f}, {sf_center[1]:.1f})")
    for i, p in enumerate(chosen_peaks):
        frac = p / N
        print(f"  T{i+1:02d}: frac={frac:.3f}, x={x_pts[p]:.1f}, y={y_pts[p]:.1f}")

for f, c in [
    ('monza.svg', 11),
    ('spa.svg', 19),
    ('silverstone.svg', 18),
    ('monaco.svg', 19),
    ('suzuka.svg', 18),
    ('interlagos.svg', 15),
    ('spielberg.svg', 10),
]:
    test_circuit(f, c)
