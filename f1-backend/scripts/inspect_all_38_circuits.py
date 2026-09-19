import re

with open(r'C:\KERS\f1-frontend\lib\api.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const MOCK_CIRCUITS: Circuit[] = [')
end = text.find('export const CIRCUIT_MAP_BY_ID', start)
circuits_text = text[start:end]

# Extract each circuit block
blocks = re.split(r'\n\s*\{\s*["\']?id["\']?\s*:', circuits_text)[1:]

for b in blocks:
    cid_m = re.match(r'\s*(\d+)', b)
    cid = int(cid_m.group(1)) if cid_m else 0
    name_m = re.search(r'["\']?circuit_name["\']?\s*:\s*["\']([^"\']+)["\']', b)
    name = name_m.group(1) if name_m else 'Unknown'
    
    svg_m = re.search(r'["\']?svg_path["\']?\s*:\s*["\']([^"\']+)["\']', b)
    svg = svg_m.group(1) if svg_m else ''
    
    corners_count_m = re.search(r'["\']?corners_count["\']?\s*:\s*(\d+)', b)
    corners_count = int(corners_count_m.group(1)) if corners_count_m else 0
    
    corner_objs = re.findall(r'["\']?corner_number["\']?\s*:\s*(\d+)', b)
    
    print(f"ID {cid:2d}: {name:<35} | svg_len: {len(svg):4d} | svg_snippet: {svg[:35]}... | corners_count: {corners_count:2d} | corner_objs: {len(corner_objs):2d}")
