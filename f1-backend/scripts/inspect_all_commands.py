import os, glob, re, xml.etree.ElementTree as ET

files = glob.glob(r'C:\KERS\f1-frontend\public\circuits-svg\*.svg')
for fp in sorted(files):
    name = os.path.basename(fp)
    tree = ET.parse(fp)
    root = tree.getroot()
    paths = root.findall('.//{http://www.w3.org/2000/svg}path')
    cmds = set()
    for p in paths:
        d = p.get('d', '')
        found = re.findall(r'[a-zA-Z]', d)
        cmds.update(found)
        trans = p.get('transform')
        if trans:
            print(f"  {name} has transform: {trans}")
    print(f"{name}: commands = {sorted(list(cmds))}")
