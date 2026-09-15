import xml.etree.ElementTree as ET
import glob, os

files = glob.glob(r'C:\KERS\f1-frontend\public\circuits-svg\*.svg')
for fp in sorted(files)[:5]:
    name = os.path.basename(fp)
    print(f"=== {name} ===")
    tree = ET.parse(fp)
    root = tree.getroot()
    for i, p in enumerate(root.findall('.//{http://www.w3.org/2000/svg}path')):
        d = p.get('d', '')
        style = p.get('style', '')
        print(f"  Path {i}: len={len(d)}, style={style[:60]}, d_start={d[:40]}")
