import xml.etree.ElementTree as ET
import numpy as np
from test_arrow_vectors import parse_svg_path

tree = ET.parse(r"C:\KERS\f1-frontend\public\circuits-svg\monza.svg")
d = tree.getroot().findall('.//{http://www.w3.org/2000/svg}path')[0].get('d')
pts = parse_svg_path(d)

print(f"Total points parsed from d: {len(pts)}")
for i in range(0, len(pts), len(pts)//12):
    print(f"  pt[{i}]: x={pts[i][0]:.1f}, y={pts[i][1]:.1f}")
