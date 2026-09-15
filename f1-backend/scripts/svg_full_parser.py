import re, math
import numpy as np

def parse_transform(transform_str):
    if not transform_str:
        return np.eye(3)
    
    # Combined transformation matrix
    T_total = np.eye(3)
    
    # Find all operations
    ops = re.findall(r'([a-zA-Z]+)\s*\(([^)]+)\)', transform_str)
    for op, args_str in ops:
        args = [float(x) for x in re.findall(r'[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', args_str)]
        T = np.eye(3)
        if op == 'matrix' and len(args) >= 6:
            a, b, c, d, e, f = args[:6]
            T = np.array([[a, c, e], [b, d, f], [0, 0, 1]], dtype=float)
        elif op == 'translate':
            tx = args[0]
            ty = args[1] if len(args) > 1 else 0.0
            T = np.array([[1, 0, tx], [0, 1, ty], [0, 0, 1]], dtype=float)
        elif op == 'scale':
            sx = args[0]
            sy = args[1] if len(args) > 1 else sx
            T = np.array([[sx, 0, 0], [0, sy, 0], [0, 0, 1]], dtype=float)
        elif op == 'rotate':
            ang = math.radians(args[0])
            cos_a = math.cos(ang)
            sin_a = math.sin(ang)
            if len(args) >= 3:
                cx, cy = args[1], args[2]
                T_trans1 = np.array([[1, 0, cx], [0, 1, cy], [0, 0, 1]], dtype=float)
                T_rot = np.array([[cos_a, -sin_a, 0], [sin_a, cos_a, 0], [0, 0, 1]], dtype=float)
                T_trans2 = np.array([[1, 0, -cx], [0, 1, -cy], [0, 0, 1]], dtype=float)
                T = T_trans1 @ T_rot @ T_trans2
            else:
                T = np.array([[cos_a, -sin_a, 0], [sin_a, cos_a, 0], [0, 0, 1]], dtype=float)
        T_total = T_total @ T
        
    return T_total

def apply_transform_to_points(points, T):
    if len(points) == 0:
        return []
    pts_hom = np.hstack([points, np.ones((len(points), 1))])
    transformed = (T @ pts_hom.T).T
    return [(float(p[0]), float(p[1])) for p in transformed[:, :2]]

def parse_svg_path_full(d):
    tokens = re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', d)
    points = []
    curr_x, curr_y = 0.0, 0.0
    start_x, start_y = 0.0, 0.0
    last_ctrl_x, last_ctrl_y = 0.0, 0.0
    i = 0
    cmd = ''
    
    while i < len(tokens):
        if tokens[i].isalpha():
            cmd = tokens[i]
            i += 1
            if i >= len(tokens): break
            
        if cmd == 'M':
            curr_x = float(tokens[i])
            curr_y = float(tokens[i+1])
            start_x, start_y = curr_x, curr_y
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 2
            cmd = 'L' # Subsequent coordinates are L
        elif cmd == 'm':
            curr_x += float(tokens[i])
            curr_y += float(tokens[i+1])
            start_x, start_y = curr_x, curr_y
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 2
            cmd = 'l'
        elif cmd == 'L':
            curr_x = float(tokens[i])
            curr_y = float(tokens[i+1])
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 2
        elif cmd == 'l':
            curr_x += float(tokens[i])
            curr_y += float(tokens[i+1])
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 2
        elif cmd == 'H':
            curr_x = float(tokens[i])
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 1
        elif cmd == 'h':
            curr_x += float(tokens[i])
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 1
        elif cmd == 'V':
            curr_y = float(tokens[i])
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 1
        elif cmd == 'v':
            curr_y += float(tokens[i])
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
            i += 1
        elif cmd == 'C':
            x1, y1 = float(tokens[i]), float(tokens[i+1])
            x2, y2 = float(tokens[i+2]), float(tokens[i+3])
            x, y = float(tokens[i+4]), float(tokens[i+5])
            for t in np.linspace(0.02, 1.0, 50):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x2, y2
            i += 6
        elif cmd == 'c':
            x1, y1 = curr_x + float(tokens[i]), curr_y + float(tokens[i+1])
            x2, y2 = curr_x + float(tokens[i+2]), curr_y + float(tokens[i+3])
            x, y = curr_x + float(tokens[i+4]), curr_y + float(tokens[i+5])
            for t in np.linspace(0.02, 1.0, 50):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x2, y2
            i += 6
        elif cmd == 'S':
            x1 = 2*curr_x - last_ctrl_x
            y1 = 2*curr_y - last_ctrl_y
            x2, y2 = float(tokens[i]), float(tokens[i+1])
            x, y = float(tokens[i+2]), float(tokens[i+3])
            for t in np.linspace(0.02, 1.0, 50):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x2, y2
            i += 4
        elif cmd == 's':
            x1 = 2*curr_x - last_ctrl_x
            y1 = 2*curr_y - last_ctrl_y
            x2 = curr_x + float(tokens[i])
            y2 = curr_y + float(tokens[i+1])
            x = curr_x + float(tokens[i+2])
            y = curr_y + float(tokens[i+3])
            for t in np.linspace(0.02, 1.0, 50):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x2, y2
            i += 4
        elif cmd == 'Q':
            x1, y1 = float(tokens[i]), float(tokens[i+1])
            x, y = float(tokens[i+2]), float(tokens[i+3])
            for t in np.linspace(0.02, 1.0, 50):
                bx = (1-t)**2 * curr_x + 2*(1-t)*t * x1 + t**2 * x
                by = (1-t)**2 * curr_y + 2*(1-t)*t * y1 + t**2 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x1, y1
            i += 4
        elif cmd == 'q':
            x1, y1 = curr_x + float(tokens[i]), curr_y + float(tokens[i+1])
            x, y = curr_x + float(tokens[i+2]), curr_y + float(tokens[i+3])
            for t in np.linspace(0.02, 1.0, 50):
                bx = (1-t)**2 * curr_x + 2*(1-t)*t * x1 + t**2 * x
                by = (1-t)**2 * curr_y + 2*(1-t)*t * y1 + t**2 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x1, y1
            i += 4
        elif cmd == 'A':
            # rx ry x-axis-rotation large-arc-flag sweep-flag x y
            rx, ry = float(tokens[i]), float(tokens[i+1])
            x, y = float(tokens[i+5]), float(tokens[i+6])
            # Linear approximation for arc
            for t in np.linspace(0.05, 1.0, 20):
                points.append((curr_x + t*(x - curr_x), curr_y + t*(y - curr_y)))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x, y
            i += 7
        elif cmd == 'a':
            rx, ry = float(tokens[i]), float(tokens[i+1])
            dx, dy = float(tokens[i+5]), float(tokens[i+6])
            x, y = curr_x + dx, curr_y + dy
            for t in np.linspace(0.05, 1.0, 20):
                points.append((curr_x + t*(x - curr_x), curr_y + t*(y - curr_y)))
            curr_x, curr_y = x, y
            last_ctrl_x, last_ctrl_y = x, y
            i += 7
        elif cmd in ['Z', 'z']:
            curr_x, curr_y = start_x, start_y
            points.append((curr_x, curr_y))
            last_ctrl_x, last_ctrl_y = curr_x, curr_y
        else:
            i += 1
            
    return points

print("Full SVG parser ready")
