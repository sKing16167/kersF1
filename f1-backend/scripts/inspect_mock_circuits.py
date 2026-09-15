import re

with open(r'C:\KERS\f1-frontend\lib\api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

circuits_match = re.search(r'export const MOCK_CIRCUITS: Circuit\[\] = \[(.*?)\];', content, re.DOTALL)
if circuits_match:
    circuits_str = circuits_match.group(1)
    # find each circuit block
    names = re.findall(r'circuit_name:\s*[\'\"](.*?)[\'\"]', circuits_str)
    countries = re.findall(r'country:\s*[\'\"](.*?)[\'\"]', circuits_str)
    corners = re.findall(r'corners_count:\s*(\d+)', circuits_str)
    view_boxes = re.findall(r'view_box:\s*[\'\"](.*?)[\'\"]', circuits_str)
    for i in range(len(names)):
        print(f"ID {i+1}: {names[i]} ({countries[i]}) - Corners: {corners[i] if i < len(corners) else '?'}, ViewBox: {view_boxes[i] if i < len(view_boxes) else '?'}")
