import xml.etree.ElementTree as ET
import numpy as np
from test_arrow_vectors import parse_svg_path

def trace_monza():
    tree = ET.parse(r"C:\KERS\f1-frontend\public\circuits-svg\monza.svg")
    root = tree.getroot()
    paths = root.findall('.//{http://www.w3.org/2000/svg}path')
    d = paths[0].get('d', '')
    pts = parse_svg_path(d)
    
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    print(f"Monza bounds: X [{min(xs):.1f}, {max(xs):.1f}], Y [{min(ys):.1f}, {max(ys):.1f}]")
    print(f"SF path d={paths[1].get('d')}")
    print(f"Arrow path d={paths[2].get('d')}")
    
    # Print commands in d
    import re
    commands = re.findall(r'([A-Za-z])([^A-Za-z]*)', d)
    print("Commands summary:")
    for cmd, args in commands:
        nums = [float(n) for n in re.findall(r'[-+]?(?:\d*\.\d+|\d+)', args)]
        print(f"  {cmd}: {nums[:4]}... (len {len(nums)})")

trace_monza()
