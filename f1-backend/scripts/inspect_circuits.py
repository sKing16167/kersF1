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
            for t in np.linspace(0.1, 1.0, 10):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd == 'c':
            x1, y1 = curr_x + float(tokens[i]), curr_y + float(tokens[i+1])
            x2, y2 = curr_x + float(tokens[i+2]), curr_y + float(tokens[i+3])
            x, y = curr_x + float(tokens[i+4]), curr_y + float(tokens[i+5])
            for t in np.linspace(0.1, 1.0, 10):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd in ['Z', 'z']:
            curr_x, curr_y = start_x, start_y
            points.append((curr_x, curr_y))
        elif cmd in ['S', 's', 'Q', 'q', 'T', 't', 'A', 'a', 'H', 'h', 'V', 'v']:
            if cmd in ['H']:
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
        else:
            i += 1
            
    return points

def inspect_all():
    svg_dir = r'C:\KERS\f1-frontend\public\circuits-svg'
    files = glob.glob(os.path.join(svg_dir, '*.svg'))
    print(f"Total SVGs: {len(files)}")
    for fp in sorted(files):
        name = os.path.basename(fp).replace('.svg', '')
        tree = ET.parse(fp)
        root = tree.getroot()
        paths = root.findall('.//{http://www.w3.org/2000/svg}path')
        print(f"\n--- {name} (paths: {len(paths)}) ---")
        if paths:
            d = paths[0].get('d', '')
            pts = parse_svg_path(d)
            if pts:
                xs = [p[0] for p in pts]
                ys = [p[1] for p in pts]
                print(f"  Track bounds: X [{min(xs):.1f}, {max(xs):.1f}], Y [{min(ys):.1f}, {max(ys):.1f}], Points: {len(pts)}")
            if len(paths) > 1:
                sf_d = paths[1].get('d', '')
                sf_pts = parse_svg_path(sf_d)
                if sf_pts:
                    sf_xs = [p[0] for p in sf_pts]
                    sf_ys = [p[1] for p in sf_pts]
                    print(f"  SF bounds: X [{min(sf_xs):.1f}, {max(sf_xs):.1f}], Y [{min(sf_ys):.1f}, {max(sf_ys):.1f}]")

if __name__ == '__main__':
    inspect_all()
