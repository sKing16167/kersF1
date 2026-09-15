import os, glob, re, xml.etree.ElementTree as ET
import numpy as np

def parse_svg_path(d):
    tokens = re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', d)
    points = []
    curr_x, curr_y = 0.0, 0.0
    start_x, start_y = 0.0, 0.0
    i = 0
    cmd = ''
    while i < len(tokens):
        if tokens[i].isalpha():
            cmd = tokens[i]
            i += 1
            if i >= len(tokens): break
            
        if cmd == 'M':
            curr_x = float(tokens[i])
            curr_y = float(tokens[i+1])
            start_x, start_y = curr_x, curr_y
            points.append((curr_x, curr_y))
            i += 2
            cmd = 'L'
        elif cmd == 'm':
            curr_x += float(tokens[i])
            curr_y += float(tokens[i+1])
            start_x, start_y = curr_x, curr_y
            points.append((curr_x, curr_y))
            i += 2
            cmd = 'l'
        elif cmd == 'L':
            curr_x = float(tokens[i])
            curr_y = float(tokens[i+1])
            points.append((curr_x, curr_y))
            i += 2
        elif cmd == 'l':
            curr_x += float(tokens[i])
            curr_y += float(tokens[i+1])
            points.append((curr_x, curr_y))
            i += 2
        elif cmd == 'C':
            x1, y1 = float(tokens[i]), float(tokens[i+1])
            x2, y2 = float(tokens[i+2]), float(tokens[i+3])
            x, y = float(tokens[i+4]), float(tokens[i+5])
            for t in np.linspace(0.05, 1.0, 20):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd == 'c':
            x1, y1 = curr_x + float(tokens[i]), curr_y + float(tokens[i+1])
            x2, y2 = curr_x + float(tokens[i+2]), curr_y + float(tokens[i+3])
            x, y = curr_x + float(tokens[i+4]), curr_y + float(tokens[i+5])
            for t in np.linspace(0.05, 1.0, 20):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd in ['Z', 'z']:
            curr_x, curr_y = start_x, start_y
            points.append((curr_x, curr_y))
        elif cmd in ['H']:
            curr_x = float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd in ['h']:
            curr_x += float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd in ['V']:
            curr_y = float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd in ['v']:
            curr_y += float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd in ['S', 's']:
            i += 4
        elif cmd in ['Q', 'q']:
            i += 4
        else:
            i += 1
            
    return points

def find_curvature_apexes(pts, n_corners):
    # Resample pts along cumulative arc length
    pts = np.array(pts)
    # Remove consecutive duplicates
    diffs = np.diff(pts, axis=0)
    dists = np.hypot(diffs[:, 0], diffs[:, 1])
    keep = np.insert(dists > 1e-4, 0, True)
    pts = pts[keep]
    
    diffs = np.diff(pts, axis=0)
    dists = np.hypot(diffs[:, 0], diffs[:, 1])
    cum_dist = np.insert(np.cumsum(dists), 0, 0.0)
    total_len = cum_dist[-1]
    
    # Resample evenly at 1000 points
    s_even = np.linspace(0, total_len, 1000)
    x_even = np.interp(s_even, cum_dist, pts[:, 0])
    y_even = np.interp(s_even, cum_dist, pts[:, 1])
    
    # First and second derivatives with periodic boundary or central diff
    dx = np.gradient(x_even)
    dy = np.gradient(y_even)
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    
    # Curvature kappa
    denom = (dx**2 + dy**2)**1.5
    denom[denom < 1e-6] = 1e-6
    curvature = np.abs(dx * ddy - dy * ddx) / denom
    
    # Find local maxima of curvature
    from scipy.signal import find_peaks
    # We can smooth curvature slightly
    window = 15
    kernel = np.ones(window)/window
    curv_smooth = np.convolve(np.tile(curvature, 3), kernel, mode='same')[1000:2000]
    
    peaks, props = find_peaks(curv_smooth, distance=1000 // (n_corners * 2 + 5), prominence=0.005)
    
    # If peaks count doesn't match n_corners, sort by prominence or evenly space
    if len(peaks) > n_corners:
        # Select highest prominence or best distributed
        prominences = props['prominences']
        top_idx = np.argsort(prominences)[-n_corners:]
        selected_peaks = np.sort(peaks[top_idx])
    elif len(peaks) < n_corners:
        # Interpolate additional points along track
        selected_peaks = peaks
    else:
        selected_peaks = peaks
        
    return [(float(x_even[idx]), float(y_even[idx])) for idx in selected_peaks]

print("Script template ready")
