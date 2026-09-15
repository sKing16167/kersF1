from svg_full_parser import parse_svg_path_full
import xml.etree.ElementTree as ET
import numpy as np

tree = ET.parse(r"C:\KERS\f1-frontend\public\circuits-svg\bahrain.svg")
d = tree.getroot().findall('.//{http://www.w3.org/2000/svg}path')[0].get('d')
pts = parse_svg_path_full(d)

print(f"Bahrain total pts: {len(pts)}")
sf = (295.3, 401.2)
dists = [np.hypot(p[0] - sf[0], p[1] - sf[1]) for p in pts]
print(f"Min dist to SF: {min(dists):.2f}px at index {np.argmin(dists)}")
p_min = pts[np.argmin(dists)]
print(f"Closest point on track: ({p_min[0]:.2f}, {p_min[1]:.2f})")
