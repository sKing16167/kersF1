import numpy as np
from dense_track_utils import get_dense_track

def check_monza():
    track_d, sf_center, x_track, y_track = get_dense_track(r"C:\KERS\f1-frontend\public\circuits-svg\monza.svg")
    N = len(x_track)
    print(f"Monza N={N}, SF={sf_center}")
    # Print 20 samples around the lap
    for i in range(0, N, N//15):
        frac = i / N
        print(f"  frac={frac:.2f} (idx={i}): x={x_track[i]:.1f}, y={y_track[i]:.1f}")

check_monza()
