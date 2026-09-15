import json, re

with open(r'C:\KERS\f1-backend\scripts\perfect_circuits.json', 'r', encoding='utf-8') as f:
    circuits = json.load(f)

ts_lines = ['export const MOCK_CIRCUITS: Circuit[] = [']

for c in circuits:
    ts_lines.append('  {')
    ts_lines.append(f'    id: {c["id"]},')
    ts_lines.append(f'    circuit_name: {json.dumps(c["circuit_name"], ensure_ascii=False)},')
    ts_lines.append(f'    location: {json.dumps(c["location"], ensure_ascii=False)},')
    ts_lines.append(f'    country: {json.dumps(c["country"], ensure_ascii=False)},')
    ts_lines.append(f'    country_code: {json.dumps(c["country_code"], ensure_ascii=False)},')
    ts_lines.append(f'    lat: {c["lat"]},')
    ts_lines.append(f'    lng: {c["lng"]},')
    ts_lines.append(f'    length_km: {c["length_km"]},')
    ts_lines.append(f'    corners_count: {c["corners_count"]},')
    ts_lines.append(f'    drs_zones: {c["drs_zones"]},')
    ts_lines.append(f'    lap_record: {json.dumps(c["lap_record"], ensure_ascii=False)},')
    ts_lines.append(f'    lap_record_driver: {json.dumps(c["lap_record_driver"], ensure_ascii=False)},')
    ts_lines.append(f'    lap_record_year: {c["lap_record_year"]},')
    ts_lines.append(f'    lap_record_team: {json.dumps(c["lap_record_team"], ensure_ascii=False)},')
    ts_lines.append(f'    full_throttle_pct: {c["full_throttle_pct"]},')
    ts_lines.append(f'    downforce_level: {json.dumps(c["downforce_level"], ensure_ascii=False)},')
    ts_lines.append(f'    tyre_stress_level: {c["tyre_stress_level"]},')
    ts_lines.append(f'    brake_wear_index: {json.dumps(c["brake_wear_index"], ensure_ascii=False)},')
    ts_lines.append(f'    gear_shifts_per_lap: {c["gear_shifts_per_lap"]},')
    ts_lines.append(f'    pit_loss_time_sec: {c["pit_loss_time_sec"]},')
    ts_lines.append(f'    first_grand_prix_year: {c["first_grand_prix_year"]},')
    ts_lines.append(f'    elevation_gain_m: {c["elevation_gain_m"]},')
    ts_lines.append(f'    view_box: {json.dumps(c["view_box"], ensure_ascii=False)},')
    
    sf = c["start_finish"]
    ts_lines.append(f'    start_finish: {{ x: {sf["x"]}, y: {sf["y"]}, label_x: {sf.get("label_x", 20)}, label_y: {sf.get("label_y", 4)} }},')
    ts_lines.append(f'    description: {json.dumps(c["description"], ensure_ascii=False)},')
    ts_lines.append(f'    svg_path: {json.dumps(c["svg_path"], ensure_ascii=False)},')
    ts_lines.append(f'    optimal_line_svg: {json.dumps(c["optimal_line_svg"], ensure_ascii=False)},')
    
    ts_lines.append('    corners: [')
    for cr in c["corners"]:
        brake_str = 'true' if cr['brake_zone'] else 'false'
        drs_str = 'true' if cr['drs_zone'] else 'false'
        ts_lines.append(f'      {{ corner_number: {cr["corner_number"]}, corner_name: {json.dumps(cr["corner_name"], ensure_ascii=False)}, gear: {cr["gear"]}, min_speed_kmh: {cr["min_speed_kmh"]}, lateral_g: {cr["lateral_g"]}, brake_zone: {brake_str}, drs_zone: {drs_str}, notes: {json.dumps(cr["notes"], ensure_ascii=False)}, x: {cr["x"]}, y: {cr["y"]} }},')
    ts_lines.append('    ],')
    ts_lines.append('  },')

ts_lines.append('];')
mock_circuits_ts = '\n'.join(ts_lines)

# Read api.ts
with open(r'C:\KERS\f1-frontend\lib\api.ts', 'r', encoding='utf-8') as f:
    api_content = f.read()

# Replace MOCK_CIRCUITS block
start_marker = 'export const MOCK_CIRCUITS: Circuit[] = ['
end_marker = 'export const MOCK_RACES: Race[] = ['

start_idx = api_content.find(start_marker)
end_idx = api_content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_api_content = api_content[:start_idx] + mock_circuits_ts + '\n\n' + api_content[end_idx:]
    with open(r'C:\KERS\f1-frontend\lib\api.ts', 'w', encoding='utf-8') as f:
        f.write(new_api_content)
    print(f"Successfully replaced MOCK_CIRCUITS in lib/api.ts with {len(circuits)} perfectly calibrated circuits!")
else:
    print(f"Markers not found: start={start_idx}, end={end_idx}")
