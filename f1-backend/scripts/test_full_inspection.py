import os, glob, xml.etree.ElementTree as ET
import numpy as np
from svg_full_parser import parse_svg_path_full, parse_transform, apply_transform_to_points

def inspect_all_with_full_parser():
    files = glob.glob(r'C:\KERS\f1-frontend\public\circuits-svg\*.svg')
    print(f"Total SVGs: {len(files)}")
    for fp in sorted(files):
        name = os.path.basename(fp).replace('.svg', '')
        tree = ET.parse(fp)
        root = tree.getroot()
        paths = root.findall('.//{http://www.w3.org/2000/svg}path')
        
        # Track (Path 0)
        track_d = paths[0].get('d', '')
        track_trans = paths[0].get('transform', '')
        T_track = parse_transform(track_trans)
        pts_raw = parse_svg_path_full(track_d)
        pts = apply_transform_to_points(pts_raw, T_track)
        
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        
        # Start/Finish (Path 1)
        sf_d = paths[1].get('d', '') if len(paths) > 1 else ''
        sf_trans = paths[1].get('transform', '')
        T_sf = parse_transform(sf_trans)
        sf_raw = parse_svg_path_full(sf_d) if sf_d else []
        sf_pts = apply_transform_to_points(sf_raw, T_sf)
        
        if sf_pts:
            sf_center = (np.mean([p[0] for p in sf_pts]), np.mean([p[1] for p in sf_pts]))
        else:
            sf_center = pts[0]
            
        # Distance from SF center to track
        dists = [np.hypot(p[0] - sf_center[0], p[1] - sf_center[1]) for p in pts]
        min_d_sf = min(dists)
        
        print(f"{name:<15}: X [{min(xs):5.1f}, {max(xs):5.1f}], Y [{min(ys):5.1f}, {max(ys):5.1f}] | SF: ({sf_center[0]:5.1f}, {sf_center[1]:5.1f}) | SF dist to track: {min_d_sf:.2f}px")

inspect_all_with_full_parser()
