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

def analyze_track_ordering(track_name):
    fp = rf"C:\KERS\f1-frontend\public\circuits-svg\{track_name}.svg"
    tree = ET.parse(fp)
    root = tree.getroot()
    paths = root.findall('.//{http://www.w3.org/2000/svg}path')
    track_d = paths[0].get('d', '')
    sf_d = paths[1].get('d', '')
    arrow_d = paths[2].get('d', '')
    
    pts = parse_svg_path(track_d)
    sf_pts = parse_svg_path(sf_d)
    arrow_pts = parse_svg_path(arrow_d)
    
    sf_center = (np.mean([p[0] for p in sf_pts]), np.mean([p[1] for p in sf_pts]))
    arrow_center = (np.mean([p[0] for p in arrow_pts]), np.mean([p[1] for p in arrow_pts]))
    
    # Find closest point on track to SF
    pts_arr = np.array(pts)
    dists_to_sf = np.hypot(pts_arr[:, 0] - sf_center[0], pts_arr[:, 1] - sf_center[1])
    sf_idx = np.argmin(dists_to_sf)
    
    # Check direction: is path progressing towards arrow or away?
    # Roll pts so sf_idx is at index 0
    rolled_pts = np.roll(pts_arr, -sf_idx, axis=0)
    
    # Find distance from rolled_pts[5] to arrow vs rolled_pts[-5] to arrow
    d_forward = np.hypot(rolled_pts[10, 0] - arrow_center[0], rolled_pts[10, 1] - arrow_center[1])
    d_backward = np.hypot(rolled_pts[-10, 0] - arrow_center[0], rolled_pts[-10, 1] - arrow_center[1])
    
    print(f"{track_name}: SF Center=({sf_center[0]:.1f}, {sf_center[1]:.1f}), Arrow Center=({arrow_center[0]:.1f}, {arrow_center[1]:.1f})")
    print(f"  Forward dist={d_forward:.1f}, Backward dist={d_backward:.1f}")

for name in ['monza', 'spa', 'silverstone', 'monaco', 'spielberg']:
    analyze_track_ordering(name)
