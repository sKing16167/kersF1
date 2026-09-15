from svg_full_parser import parse_svg_path_full
import xml.etree.ElementTree as ET
import numpy as np

tree = ET.parse(r"C:\KERS\f1-frontend\public\circuits-svg\bahrain.svg")
d = tree.getroot().findall('.//{http://www.w3.org/2000/svg}path')[0].get('d')
pts = parse_svg_path_full(d)

print(f"Points start: {pts[:3]}")
print(f"Points end: {pts[-3:]}")
print(f"Total pts: {len(pts)}")

# Find points with y > 380
bottom_pts = [p for p in pts if p[1] > 380]
print(f"Points with y > 380: {len(bottom_pts)}")
if bottom_pts:
    print(f"Sample bottom pts: {bottom_pts[::max(1, len(bottom_pts)//5)]}")
