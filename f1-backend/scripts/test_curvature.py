import urllib.request
import re
import xml.etree.ElementTree as ET
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
        elif cmd == 'H':
            curr_x = float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd == 'h':
            curr_x += float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd == 'V':
            curr_y = float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd == 'v':
            curr_y += float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd in ['S', 's']:
            x2 = float(tokens[i]) if cmd == 'S' else curr_x + float(tokens[i])
            y2 = float(tokens[i+1]) if cmd == 'S' else curr_y + float(tokens[i+1])
            x = float(tokens[i+2]) if cmd == 'S' else curr_x + float(tokens[i+2])
            y = float(tokens[i+3]) if cmd == 'S' else curr_y + float(tokens[i+3])
            for t in np.linspace(0.1, 1.0, 10):
                bx = (1-t)**2 * curr_x + 2*(1-t)*t * x2 + t**2 * x
                by = (1-t)**2 * curr_y + 2*(1-t)*t * y2 + t**2 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 4
        else:
            i += 1
            
    return points

# Test on Sepang
url = 'https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed/white-outline/sepang-1.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    content = resp.read().decode('utf-8')

root = ET.fromstring(content)
paths = root.findall('.//{http://www.w3.org/2000/svg}path')
track_d = paths[0].attrib['d']
pts = parse_svg_path(track_d)
print(f"Sepang points: {len(pts)}")

# Compute curvature
arr = np.array(pts)
# remove consecutive duplicates
mask = np.ones(len(arr), dtype=bool)
mask[1:] = np.hypot(np.diff(arr[:, 0]), np.diff(arr[:, 1])) > 0.5
arr = arr[mask]

# calculate curvature
dx = np.gradient(arr[:, 0])
dy = np.gradient(arr[:, 1])
ddx = np.gradient(dx)
ddy = np.gradient(dy)
curvature = np.abs(dx * ddy - dy * ddx) / (dx**2 + dy**2)**1.5

# find peaks
from scipy.signal import find_peaks
peaks, props = find_peaks(curvature, distance=15, prominence=0.005)
print(f"Found {len(peaks)} corner peaks for Sepang!")
for idx, p in enumerate(peaks[:15]):
    print(f"  Turn {idx+1}: x={arr[p,0]:.1f}, y={arr[p,1]:.1f}, curvature={curvature[p]:.4f}")
