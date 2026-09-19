import urllib.request
import re
import xml.etree.ElementTree as ET

svg_names = [
    "austin-1.svg", "bahrain-1.svg", "baku-1.svg", "catalunya-6.svg",
    "hungaroring-3.svg", "interlagos-2.svg", "jeddah-1.svg", "las-vegas-1.svg",
    "lusail-1.svg", "madring-1.svg", "marina-bay-4.svg", "melbourne-2.svg",
    "mexico-city-3.svg", "miami-1.svg", "monaco-6.svg", "montreal-6.svg",
    "monza-7.svg", "sepang-1.svg", "shanghai-1.svg", "silverstone-8.svg",
    "spa-francorchamps-4.svg", "spielberg-3.svg", "suzuka-2.svg",
    "yas-marina-2.svg", "zandvoort-5.svg"
]

base_url = "https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed/white-outline/"

print(f"Total SVGs in white-outline: {len(svg_names)}")
for name in svg_names[:5]:
    try:
        url = base_url + name
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8')
            root = ET.fromstring(content)
            viewbox = root.attrib.get('viewBox', root.attrib.get('viewbox', ''))
            width = root.attrib.get('width', '')
            height = root.attrib.get('height', '')
            paths = root.findall('.//{http://www.w3.org/2000/svg}path')
            if not paths:
                paths = root.findall('.//path')
            print(f"{name:25s} | viewBox: {viewbox:20s} | w: {width:6s} | h: {height:6s} | paths: {len(paths)}")
            for idx, p in enumerate(paths):
                d = p.attrib.get('d', '')
                pid = p.attrib.get('id', '')
                pclass = p.attrib.get('class', '')
                print(f"   path {idx}: id={pid}, class={pclass}, d_len={len(d)}")
    except Exception as e:
        print(f"{name:25s} | Error: {e}")
