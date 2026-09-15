import os, glob
import numpy as np
from dense_track_utils import get_dense_track
from scipy.signal import find_peaks

def analyze_track_corners(name, expected_count):
    fp = rf"C:\KERS\f1-frontend\public\circuits-svg\{name}.svg"
    track_d, sf_center, x_track, y_track = get_dense_track(fp)
    N = len(x_track)
    
    # Calculate curvature
    dx = np.gradient(x_track)
    dy = np.gradient(y_track)
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    denom = (dx**2 + dy**2)**1.5
    denom[denom < 1e-6] = 1e-6
    curvature = np.abs(dx * ddy - dy * ddx) / denom
    
    # Gaussian/moving average smoothing
    window = 50
    kernel = np.ones(window)/window
    curv_smooth = np.convolve(np.tile(curvature, 3), kernel, mode='same')[N:2*N]
    
    # Find all significant peaks
    min_dist = max(30, N // (expected_count * 3))
    peaks, props = find_peaks(curv_smooth, distance=min_dist, prominence=0.0005)
    
    print(f"\n==========================================")
    print(f"Track: {name.upper()} | Expected Corners: {expected_count} | Found Peaks: {len(peaks)}")
    print(f"Start/Finish: ({sf_center[0]:.1f}, {sf_center[1]:.1f})")
    
    for i, p in enumerate(peaks):
        frac = p / N
        print(f"  Peak {i+1:02d}: frac={frac:.3f}, x={x_track[p]:.1f}, y={y_track[p]:.1f}, curv={curv_smooth[p]:.4f}")

for name, count in [
    ('monza', 11),
    ('spa', 19),
    ('silverstone', 18),
    ('monaco', 19),
    ('suzuka', 18),
    ('interlagos', 15),
    ('marina_bay', 19),
    ('baku', 20),
    ('cota', 20),
    ('spielberg', 10),
    ('montreal', 14),
    ('zandvoort', 14),
]:
    analyze_track_corners(name, count)
