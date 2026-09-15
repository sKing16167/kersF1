import os, glob, re, json, xml.etree.ElementTree as ET
import numpy as np
from scipy.signal import find_peaks

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
            for t in np.linspace(0.02, 1.0, 50):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd == 'c':
            x1, y1 = curr_x + float(tokens[i]), curr_y + float(tokens[i+1])
            x2, y2 = curr_x + float(tokens[i+2]), curr_y + float(tokens[i+3])
            x, y = curr_x + float(tokens[i+4]), curr_y + float(tokens[i+5])
            for t in np.linspace(0.02, 1.0, 50):
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

def extract_track_points_and_sf(svg_path):
    tree = ET.parse(svg_path)
    root = tree.getroot()
    paths = root.findall('.//{http://www.w3.org/2000/svg}path')
    track_d = paths[0].get('d', '')
    sf_d = paths[1].get('d', '') if len(paths) > 1 else ''
    
    raw_pts = parse_svg_path(track_d)
    sf_pts = parse_svg_path(sf_d) if sf_d else []
    
    if sf_pts:
        sf_center = (float(np.mean([p[0] for p in sf_pts])), float(np.mean([p[1] for p in sf_pts])))
    else:
        sf_center = (raw_pts[0][0], raw_pts[0][1])
        
    pts = np.array(raw_pts)
    diffs = np.diff(pts, axis=0)
    dists = np.hypot(diffs[:, 0], diffs[:, 1])
    keep = np.insert(dists > 1e-4, 0, True)
    pts = pts[keep]
    
    diffs = np.diff(pts, axis=0)
    dists = np.hypot(diffs[:, 0], diffs[:, 1])
    cum_dist = np.insert(np.cumsum(dists), 0, 0.0)
    total_len = cum_dist[-1]
    
    N_SAMPLES = 2000
    s_even = np.linspace(0, total_len, N_SAMPLES, endpoint=False)
    x_even = np.interp(s_even, cum_dist, pts[:, 0])
    y_even = np.interp(s_even, cum_dist, pts[:, 1])
    
    # Distance to SF
    dists_to_sf = np.hypot(x_even - sf_center[0], y_even - sf_center[1])
    sf_idx = int(np.argmin(dists_to_sf))
    
    # Check direction with arrow if present
    arrow_d = paths[2].get('d', '') if len(paths) > 2 else ''
    arrow_pts = parse_svg_path(arrow_d) if arrow_d else []
    forward = True
    if arrow_pts:
        arrow_center = (np.mean([p[0] for p in arrow_pts]), np.mean([p[1] for p in arrow_pts]))
        # Test forward vs backward roll
        x_fwd = np.roll(x_even, -sf_idx)
        y_fwd = np.roll(y_even, -sf_idx)
        d_fwd = np.hypot(x_fwd[20] - arrow_center[0], y_fwd[20] - arrow_center[1])
        d_bwd = np.hypot(x_fwd[-20] - arrow_center[0], y_fwd[-20] - arrow_center[1])
        if d_bwd < d_fwd:
            forward = False
            
    if not forward:
        x_even = x_even[::-1]
        y_even = y_even[::-1]
        dists_to_sf = np.hypot(x_even - sf_center[0], y_even - sf_center[1])
        sf_idx = int(np.argmin(dists_to_sf))
        
    x_reordered = np.roll(x_even, -sf_idx)
    y_reordered = np.roll(y_even, -sf_idx)
    
    return track_d, sf_center, x_reordered, y_reordered

print("Helper defined.")
