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
            for t in np.linspace(0.01, 1.0, 100):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd == 'c':
            x1, y1 = curr_x + float(tokens[i]), curr_y + float(tokens[i+1])
            x2, y2 = curr_x + float(tokens[i+2]), curr_y + float(tokens[i+3])
            x, y = curr_x + float(tokens[i+4]), curr_y + float(tokens[i+5])
            for t in np.linspace(0.01, 1.0, 100):
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
        else:
            i += 1
            
    return points

def test_arrow_vectors():
    files = glob.glob(r'C:\KERS\f1-frontend\public\circuits-svg\*.svg')
    for fp in sorted(files):
        name = os.path.basename(fp).replace('.svg', '')
        tree = ET.parse(fp)
        root = tree.getroot()
        paths = root.findall('.//{http://www.w3.org/2000/svg}path')
        if len(paths) < 3: continue
        arrow_d = paths[2].get('d', '')
        arrow_pts = parse_svg_path(arrow_d)
        if len(arrow_pts) >= 3:
            # Let's inspect points
            print(f"{name}: arrow_pts={[(round(p[0], 1), round(p[1], 1)) for p in arrow_pts]}")

test_arrow_vectors()
