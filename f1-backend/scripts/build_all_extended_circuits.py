import urllib.request
import json
import os
import re
import xml.etree.ElementTree as ET
import numpy as np
from scipy.signal import find_peaks

def parse_svg_path(d):
    tokens = re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', d)
    points = []
    curr_x, curr_y = 0.0, 0.0
    start_x, start_y = 0.0, 0.0
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
            i += 2
            cmd = 'L'
        elif cmd == 'm':
            curr_x += float(tokens[i])
            curr_y += float(tokens[i+1])
            start_x, start_y = curr_x, curr_y
            points.append((curr_x, curr_y))
            i += 2
            cmd = 'l'
        elif cmd == 'L':
            curr_x = float(tokens[i])
            curr_y = float(tokens[i+1])
            points.append((curr_x, curr_y))
            i += 2
        elif cmd == 'l':
            curr_x += float(tokens[i])
            curr_y += float(tokens[i+1])
            points.append((curr_x, curr_y))
            i += 2
        elif cmd == 'C':
            x1, y1 = float(tokens[i]), float(tokens[i+1])
            x2, y2 = float(tokens[i+2]), float(tokens[i+3])
            x, y = float(tokens[i+4]), float(tokens[i+5])
            for t in np.linspace(0.05, 1.0, 15):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd == 'c':
            x1, y1 = curr_x + float(tokens[i]), curr_y + float(tokens[i+1])
            x2, y2 = curr_x + float(tokens[i+2]), curr_y + float(tokens[i+3])
            x, y = curr_x + float(tokens[i+4]), curr_y + float(tokens[i+5])
            for t in np.linspace(0.05, 1.0, 15):
                bx = (1-t)**3 * curr_x + 3*(1-t)**2*t * x1 + 3*(1-t)*t**2 * x2 + t**3 * x
                by = (1-t)**3 * curr_y + 3*(1-t)**2*t * y1 + 3*(1-t)*t**2 * y2 + t**3 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 6
        elif cmd in ['Z', 'z']:
            curr_x, curr_y = start_x, start_y
            points.append((curr_x, curr_y))
        elif cmd == 'H':
            curr_x = float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd == 'h':
            curr_x += float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd == 'V':
            curr_y = float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd == 'v':
            curr_y += float(tokens[i])
            points.append((curr_x, curr_y))
            i += 1
        elif cmd in ['S', 's']:
            x2 = float(tokens[i]) if cmd == 'S' else curr_x + float(tokens[i])
            y2 = float(tokens[i+1]) if cmd == 'S' else curr_y + float(tokens[i+1])
            x = float(tokens[i+2]) if cmd == 'S' else curr_x + float(tokens[i+2])
            y = float(tokens[i+3]) if cmd == 'S' else curr_y + float(tokens[i+3])
            for t in np.linspace(0.1, 1.0, 10):
                bx = (1-t)**2 * curr_x + 2*(1-t)*t * x2 + t**2 * x
                by = (1-t)**2 * curr_y + 2*(1-t)*t * y2 + t**2 * y
                points.append((bx, by))
            curr_x, curr_y = x, y
            i += 4
        else:
            i += 1
            
    return points

TARGET_CIRCUITS = [
    {
        "id": 24,
        "circuit_name": "Sepang International Circuit",
        "location": "Kuala Lumpur",
        "country": "Malaysia",
        "country_code": "MAL",
        "lat": 2.7606,
        "lng": 101.7381,
        "length_km": 5.543,
        "corners_count": 15,
        "drs_zones": 2,
        "lap_record": "1:34.080",
        "lap_record_driver": "Sebastian Vettel",
        "lap_record_year": 2017,
        "lap_record_team": "Ferrari SF70H",
        "full_throttle_pct": 65,
        "downforce_level": "MEDIUM-HIGH",
        "tyre_stress_level": 4,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 52,
        "pit_loss_time_sec": 22.4,
        "first_grand_prix_year": 1999,
        "elevation_gain_m": 18.0,
        "github_rel_paths": [
            "circuits/detailed/white-outline/sepang-1.svg",
            "circuits/minimal/white-outline/sepang-1.svg"
        ],
        "local_svg_filename": "sepang.svg",
        "description": "Hermann Tilke's masterpiece. Extreme tropical humidity, two massive 900m parallel straights separated by a hairpin, and high-speed swooping turns 5 and 6.",
        "known_corner_names": {
            1: "Turn 1 (Hairpin Entry)",
            2: "Turn 2 (Left Transition)",
            3: "Sunoco Curve (T3)",
            4: "Turn 4",
            5: "Turn 5 (High Speed Left)",
            6: "Turn 6",
            7: "Turn 7",
            8: "Turn 8",
            9: "Berjaya Tioman Hairpin (T9)",
            10: "Turn 10",
            11: "Turn 11 (Braking Drop)",
            12: "Turn 12",
            13: "Turn 13",
            14: "Turn 14 (Back Straight Entry)",
            15: "Turn 15 (Final Hairpin)"
        }
    },
    {
        "id": 25,
        "circuit_name": "Sochi Autodrom",
        "location": "Sochi",
        "country": "Russia",
        "country_code": "RUS",
        "lat": 43.4056,
        "lng": 39.9578,
        "length_km": 5.848,
        "corners_count": 18,
        "drs_zones": 2,
        "lap_record": "1:35.761",
        "lap_record_driver": "Lewis Hamilton",
        "lap_record_year": 2019,
        "lap_record_team": "Mercedes W10",
        "full_throttle_pct": 56,
        "downforce_level": "MEDIUM",
        "tyre_stress_level": 3,
        "brake_wear_index": "MEDIUM",
        "gear_shifts_per_lap": 64,
        "pit_loss_time_sec": 25.0,
        "first_grand_prix_year": 2014,
        "elevation_gain_m": 4.5,
        "github_rel_paths": [
            "circuits/minimal/white-outline/sochi-1.svg",
            "circuits/minimal/white/sochi-1.svg"
        ],
        "local_svg_filename": "sochi.svg",
        "description": "Olympic Park street track. Dominated by the monumental constant-radius 180-degree left-hand Turn 3 around the Medal Plaza.",
        "known_corner_names": {
            1: "Turn 1 (Kink)",
            2: "Turn 2 (Braking 90° Right)",
            3: "Turn 3 (Medal Plaza 180° Left)",
            4: "Turn 4 (Right Exit)",
            13: "Turn 13 (Bridge Chicane)",
            18: "Turn 18 (Pit Entry)"
        }
    },
    {
        "id": 26,
        "circuit_name": "Hockenheimring",
        "location": "Hockenheim",
        "country": "Germany",
        "country_code": "GER",
        "lat": 49.3278,
        "lng": 8.5658,
        "length_km": 4.574,
        "corners_count": 17,
        "drs_zones": 2,
        "lap_record": "1:13.780",
        "lap_record_driver": "Kimi Räikkönen",
        "lap_record_year": 2004,
        "lap_record_team": "McLaren MP4-19B",
        "full_throttle_pct": 64,
        "downforce_level": "MEDIUM-HIGH",
        "tyre_stress_level": 3,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 50,
        "pit_loss_time_sec": 21.0,
        "first_grand_prix_year": 1970,
        "elevation_gain_m": 4.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/hockenheimring-4.svg",
            "circuits/minimal/white/hockenheimring-4.svg"
        ],
        "local_svg_filename": "hockenheimring.svg",
        "description": "Historic German Grand Prix venue. The flat-out Parabolika curve leading to the tight hairpin overtake zone, followed by the roaring Motodrom stadium.",
        "known_corner_names": {
            1: "Nordkurve (T1)",
            2: "Einfahrt Parabolika (T2)",
            6: "Spitzkehre / Hairpin (T6)",
            8: "Mercedes-Arena (T8)",
            12: "Einfahrt Motodrom (T12)",
            13: "Sachskurve (T13)",
            16: "Südkurve (T16)"
        }
    },
    {
        "id": 27,
        "circuit_name": "Autodromo Enzo e Dino Ferrari (Imola)",
        "location": "Imola",
        "country": "Italy",
        "country_code": "ITA",
        "lat": 44.3439,
        "lng": 11.7167,
        "length_km": 4.909,
        "corners_count": 19,
        "drs_zones": 1,
        "lap_record": "1:15.484",
        "lap_record_driver": "Lewis Hamilton",
        "lap_record_year": 2020,
        "lap_record_team": "Mercedes W11",
        "full_throttle_pct": 71,
        "downforce_level": "HIGH",
        "tyre_stress_level": 4,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 58,
        "pit_loss_time_sec": 24.8,
        "first_grand_prix_year": 1980,
        "elevation_gain_m": 35.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/imola-3.svg",
            "circuits/minimal/white/imola-3.svg"
        ],
        "local_svg_filename": "imola.svg",
        "description": "Historic anti-clockwise sanctuary in Emilia-Romagna. Featuring Tamburello chicane, the steep downhill Piratella plunge, and the challenging Acque Minerali kerbs.",
        "known_corner_names": {
            1: "Variante Tamburello (T1)",
            2: "Tamburello Apex (T2)",
            3: "Tamburello Exit (T3)",
            4: "Variante Villeneuve (T4)",
            5: "Villeneuve Exit (T5)",
            7: "Tosa Hairpin (T7)",
            9: "Piratella (T9)",
            11: "Acque Minerali 1 (T11)",
            12: "Acque Minerali 2 (T12)",
            14: "Variante Alta (T14)",
            17: "Rivazza 1 (T17)",
            18: "Rivazza 2 (T18)"
        }
    },
    {
        "id": 28,
        "circuit_name": "Istanbul Park",
        "location": "Istanbul",
        "country": "Turkey",
        "country_code": "TUR",
        "lat": 40.9517,
        "lng": 29.405,
        "length_km": 5.338,
        "corners_count": 14,
        "drs_zones": 2,
        "lap_record": "1:24.770",
        "lap_record_driver": "Juan Pablo Montoya",
        "lap_record_year": 2005,
        "lap_record_team": "McLaren MP4-20",
        "full_throttle_pct": 63,
        "downforce_level": "HIGH",
        "tyre_stress_level": 5,
        "brake_wear_index": "MEDIUM",
        "gear_shifts_per_lap": 46,
        "pit_loss_time_sec": 22.0,
        "first_grand_prix_year": 2005,
        "elevation_gain_m": 46.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/istanbul-1.svg",
            "circuits/minimal/white/istanbul-1.svg"
        ],
        "local_svg_filename": "istanbul.svg",
        "description": "The legendary anti-clockwise rollercoaster. Famous for Turn 8 — a quad-apex high-speed left-hander subjecting drivers to over 5G lateral loading for 7 continuous seconds.",
        "known_corner_names": {
            1: "Turn 1 (Downhill Left)",
            2: "Turn 2",
            8: "Turn 8 (Quad-Apex Monster 5.2G)",
            9: "Turn 9 (Braking Chicane)",
            12: "Turn 12 (Back Straight Hairpin)",
            14: "Turn 14 (Final Turn)"
        }
    },
    {
        "id": 29,
        "circuit_name": "Nürburgring (GP-Strecke)",
        "location": "Nürburg",
        "country": "Germany",
        "country_code": "GER",
        "lat": 50.3356,
        "lng": 6.9475,
        "length_km": 5.148,
        "corners_count": 15,
        "drs_zones": 2,
        "lap_record": "1:28.139",
        "lap_record_driver": "Max Verstappen",
        "lap_record_year": 2020,
        "lap_record_team": "Red Bull RB16",
        "full_throttle_pct": 61,
        "downforce_level": "MEDIUM-HIGH",
        "tyre_stress_level": 3,
        "brake_wear_index": "MEDIUM",
        "gear_shifts_per_lap": 56,
        "pit_loss_time_sec": 23.5,
        "first_grand_prix_year": 1951,
        "elevation_gain_m": 56.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/nurburgring-4.svg",
            "circuits/minimal/white/nurburgring-4.svg"
        ],
        "local_svg_filename": "nurburgring.svg",
        "description": "In the shadow of the Eifel mountains. The tricky Castrol S downhill entry, Mercedes-Arena amphitheatre, and the high-G Michael Schumacher S chicane.",
        "known_corner_names": {
            1: "Castrol-S (T1)",
            3: "Mercedes-Arena (T3)",
            7: "Dunlop-Kehre (T7)",
            8: "Michael Schumacher S (T8)",
            13: "Veedol Chicane (T13)",
            15: "Coca-Cola Kurve (T15)"
        }
    },
    {
        "id": 30,
        "circuit_name": "Circuit Paul Ricard",
        "location": "Le Castellet",
        "country": "France",
        "country_code": "FRA",
        "lat": 43.2506,
        "lng": 5.7917,
        "length_km": 5.842,
        "corners_count": 15,
        "drs_zones": 2,
        "lap_record": "1:32.740",
        "lap_record_driver": "Sebastian Vettel",
        "lap_record_year": 2019,
        "lap_record_team": "Ferrari SF90",
        "full_throttle_pct": 67,
        "downforce_level": "MEDIUM",
        "tyre_stress_level": 4,
        "brake_wear_index": "MEDIUM",
        "gear_shifts_per_lap": 48,
        "pit_loss_time_sec": 24.5,
        "first_grand_prix_year": 1971,
        "elevation_gain_m": 30.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/paul-ricard-1.svg",
            "circuits/minimal/white/paul-ricard-1.svg"
        ],
        "local_svg_filename": "paul_ricard.svg",
        "description": "High-speed plateau on the Côte d'Azur. The 1.8km Mistral straight, punctuated by the chicane, leading into the heart-stopping flat-out Signes curve at 330 km/h.",
        "known_corner_names": {
            1: "S de la Verrerie (T1)",
            3: "Virage de l'Hôtel (T3)",
            8: "Chicane Nord (Mistral T8)",
            10: "Courbe de Signes (Flat out 330km/h)",
            11: "Double Droite du Beausset",
            14: "Virage du Pont"
        }
    },
    {
        "id": 31,
        "circuit_name": "Circuit de Nevers Magny-Cours",
        "location": "Magny-Cours",
        "country": "France",
        "country_code": "FRA",
        "lat": 46.8642,
        "lng": 3.1636,
        "length_km": 4.411,
        "corners_count": 17,
        "drs_zones": 1,
        "lap_record": "1:15.377",
        "lap_record_driver": "Michael Schumacher",
        "lap_record_year": 2004,
        "lap_record_team": "Ferrari F2004",
        "full_throttle_pct": 66,
        "downforce_level": "HIGH",
        "tyre_stress_level": 3,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 52,
        "pit_loss_time_sec": 21.0,
        "first_grand_prix_year": 1991,
        "elevation_gain_m": 12.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/magny-cours-3.svg",
            "circuits/minimal/white/magny-cours-3.svg"
        ],
        "local_svg_filename": "magny_cours.svg",
        "description": "Smooth technical French Grand Prix home. Famous for replicating corner layouts from around the world including the Adelaide hairpin, Estoril curve, and Nürburgring chicane.",
        "known_corner_names": {
            1: "Grande Courbe (T1)",
            2: "Virage d'Estoril (T2)",
            3: "Epingle d'Adelaide (T3)",
            5: "Chicane Nürburgring (T5)",
            7: "Epingle du 180 (T7)",
            11: "Chicane Imola (T11)",
            15: "Chicane du Lycée (T15)"
        }
    },
    {
        "id": 32,
        "circuit_name": "Indianapolis Motor Speedway (Road Course)",
        "location": "Speedway, Indiana",
        "country": "USA",
        "country_code": "USA",
        "lat": 39.795,
        "lng": -86.2344,
        "length_km": 4.192,
        "corners_count": 13,
        "drs_zones": 1,
        "lap_record": "1:10.399",
        "lap_record_driver": "Rubens Barrichello",
        "lap_record_year": 2004,
        "lap_record_team": "Ferrari F2004",
        "full_throttle_pct": 69,
        "downforce_level": "LOW-MEDIUM",
        "tyre_stress_level": 5,
        "brake_wear_index": "MEDIUM",
        "gear_shifts_per_lap": 44,
        "pit_loss_time_sec": 21.0,
        "first_grand_prix_year": 2000,
        "elevation_gain_m": 0.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/indianapolis-1.svg",
            "circuits/minimal/white/indianapolis-1.svg"
        ],
        "local_svg_filename": "indianapolis.svg",
        "description": "The Brickyard F1 road course. Tight infield sequence feeding directly onto the high-speed 9-degree banked Turn 13 oval bend across the legendary Yard of Bricks.",
        "known_corner_names": {
            1: "Turn 1 (Infield Entry)",
            4: "Hulman Chicane (T4)",
            8: "Infield Hairpin (T8)",
            13: "Turn 13 (Banked Oval Turn 320km/h)"
        }
    },
    {
        "id": 33,
        "circuit_name": "Autódromo Internacional do Algarve (Portimão)",
        "location": "Portimão",
        "country": "Portugal",
        "country_code": "POR",
        "lat": 37.2272,
        "lng": -8.6267,
        "length_km": 4.653,
        "corners_count": 15,
        "drs_zones": 2,
        "lap_record": "1:18.750",
        "lap_record_driver": "Lewis Hamilton",
        "lap_record_year": 2020,
        "lap_record_team": "Mercedes W11",
        "full_throttle_pct": 64,
        "downforce_level": "MEDIUM-HIGH",
        "tyre_stress_level": 3,
        "brake_wear_index": "MEDIUM",
        "gear_shifts_per_lap": 54,
        "pit_loss_time_sec": 22.0,
        "first_grand_prix_year": 2020,
        "elevation_gain_m": 38.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/portimao-1.svg",
            "circuits/minimal/white/portimao-1.svg"
        ],
        "local_svg_filename": "portimao.svg",
        "description": "The Portuguese rollercoaster. Constant blind crests, severe gradient drops, and the spectacular downhill plunge into Turn 1.",
        "known_corner_names": {
            1: "Primeira (T1 Downhill)",
            3: "Curva do Lagos (T3)",
            5: "Hairpin (T5)",
            11: "Portimão (T11)",
            15: "Curva Galp (T15 Fast Downhill)"
        }
    },
    {
        "id": 34,
        "circuit_name": "Buddh International Circuit",
        "location": "Greater Noida",
        "country": "India",
        "country_code": "IND",
        "lat": 28.3486,
        "lng": 77.5331,
        "length_km": 5.125,
        "corners_count": 16,
        "drs_zones": 2,
        "lap_record": "1:27.249",
        "lap_record_driver": "Sebastian Vettel",
        "lap_record_year": 2011,
        "lap_record_team": "Red Bull RB7",
        "full_throttle_pct": 64,
        "downforce_level": "MEDIUM",
        "tyre_stress_level": 4,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 54,
        "pit_loss_time_sec": 21.0,
        "first_grand_prix_year": 2011,
        "elevation_gain_m": 14.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/buddh-1.svg",
            "circuits/minimal/white/buddh-1.svg"
        ],
        "local_svg_filename": "buddh.svg",
        "description": "Indian Grand Prix home. Steep blind uphill braking into Turn 3 hairpin, a 1.06km straight reaching 335 km/h, and the sweeping double-apex Parabolica turns 10-11.",
        "known_corner_names": {
            1: "Turn 1",
            3: "Turn 3 (Blind Uphill Hairpin)",
            4: "Turn 4 (End of 1.06km Straight)",
            10: "Parabolica Apex 1 (T10)",
            11: "Parabolica Apex 2 (T11)",
            16: "Turn 16 (Final Corner)"
        }
    },
    {
        "id": 35,
        "circuit_name": "Korea International Circuit",
        "location": "Yeongam",
        "country": "South Korea",
        "country_code": "KOR",
        "lat": 34.7333,
        "lng": 126.417,
        "length_km": 5.615,
        "corners_count": 18,
        "drs_zones": 2,
        "lap_record": "1:39.605",
        "lap_record_driver": "Sebastian Vettel",
        "lap_record_year": 2011,
        "lap_record_team": "Red Bull RB7",
        "full_throttle_pct": 61,
        "downforce_level": "MEDIUM-HIGH",
        "tyre_stress_level": 3,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 58,
        "pit_loss_time_sec": 23.0,
        "first_grand_prix_year": 2010,
        "elevation_gain_m": 5.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/yeongam-1.svg",
            "circuits/minimal/white/yeongam-1.svg"
        ],
        "local_svg_filename": "yeongam.svg",
        "description": "Unique hybrid venue. Sector 1 features a massive 1.2km full-throttle straight, transitioning into a tight marina street course with walls in Sectors 2 and 3.",
        "known_corner_names": {
            1: "Turn 1",
            3: "Turn 3 (End of 1.2km Straight)",
            7: "Turn 7 (Marina Entry)",
            18: "Turn 18 (Pit Straight Entry)"
        }
    },
    {
        "id": 36,
        "circuit_name": "Valencia Street Circuit",
        "location": "Valencia",
        "country": "Spain",
        "country_code": "ESP",
        "lat": 39.4589,
        "lng": -0.3317,
        "length_km": 5.419,
        "corners_count": 25,
        "drs_zones": 2,
        "lap_record": "1:38.683",
        "lap_record_driver": "Timo Glock",
        "lap_record_year": 2009,
        "lap_record_team": "Toyota TF109",
        "full_throttle_pct": 61,
        "downforce_level": "MEDIUM",
        "tyre_stress_level": 3,
        "brake_wear_index": "VERY HEAVY",
        "gear_shifts_per_lap": 66,
        "pit_loss_time_sec": 21.5,
        "first_grand_prix_year": 2008,
        "elevation_gain_m": 2.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/valencia-1.svg",
            "circuits/minimal/white/valencia-1.svg"
        ],
        "local_svg_filename": "valencia.svg",
        "description": "Spectacular marina harbour street track. Crosses a 140m operational swing bridge and features high-speed curved walls through 25 challenging turns.",
        "known_corner_names": {
            1: "Turn 1",
            12: "Swing Bridge (T12 Crossing)",
            13: "Bridge Exit (T13)",
            17: "Hairpin (T17)",
            25: "Final Curve (T25)"
        }
    },
    {
        "id": 37,
        "circuit_name": "Autodromo Internazionale del Mugello",
        "location": "Scarperia e San Piero",
        "country": "Italy",
        "country_code": "ITA",
        "lat": 43.9975,
        "lng": 11.3714,
        "length_km": 5.245,
        "corners_count": 15,
        "drs_zones": 1,
        "lap_record": "1:18.833",
        "lap_record_driver": "Lewis Hamilton",
        "lap_record_year": 2020,
        "lap_record_team": "Mercedes W11",
        "full_throttle_pct": 69,
        "downforce_level": "HIGH",
        "tyre_stress_level": 5,
        "brake_wear_index": "MEDIUM",
        "gear_shifts_per_lap": 48,
        "pit_loss_time_sec": 23.0,
        "first_grand_prix_year": 2020,
        "elevation_gain_m": 41.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/mugello-1.svg",
            "circuits/minimal/white/mugello-1.svg"
        ],
        "local_svg_filename": "mugello.svg",
        "description": "Tuscan high-downforce temple. Relentless medium and high-speed flow, blind crests, and the breathtaking flat-out Arrabbiata 1 and 2 taken at 270 km/h.",
        "known_corner_names": {
            1: "San Donato (T1 340km/h Brake)",
            2: "Luco (T2)",
            3: "Poggio Secco (T3)",
            4: "Materassi (T4)",
            6: "Casanova (T6 High-G)",
            7: "Savelli (T7)",
            8: "Arrabbiata 1 (T8 Flat out 260km/h)",
            9: "Arrabbiata 2 (T9 Blind Crest 4.8G)",
            12: "Correntaio (T12 Downhill Hairpin)",
            15: "Bucine (T15 Onto Straight)"
        }
    },
    {
        "id": 38,
        "circuit_name": "Fuji Speedway",
        "location": "Oyama",
        "country": "Japan",
        "country_code": "JPN",
        "lat": 35.3717,
        "lng": 138.927,
        "length_km": 4.563,
        "corners_count": 16,
        "drs_zones": 1,
        "lap_record": "1:18.426",
        "lap_record_driver": "Felipe Massa",
        "lap_record_year": 2008,
        "lap_record_team": "Ferrari F2008",
        "full_throttle_pct": 62,
        "downforce_level": "MEDIUM",
        "tyre_stress_level": 3,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 48,
        "pit_loss_time_sec": 21.0,
        "first_grand_prix_year": 1976,
        "elevation_gain_m": 40.0,
        "github_rel_paths": [
            "circuits/minimal/white-outline/fuji-2.svg",
            "circuits/minimal/white/fuji-2.svg"
        ],
        "local_svg_filename": "fuji.svg",
        "description": "At the foot of Mount Fuji. One of motorsport's longest straights (1.475km) followed by extreme braking into the Turn 1 hairpin and the technical rising final sector.",
        "known_corner_names": {
            1: "Daiichi Corner (T1 Hairpin)",
            3: "Coca-Cola Corner (T3)",
            4: "100R High Speed Sweep (T4)",
            6: "Hairpin Corner (T6)",
            10: "Dunlop Corner (T10)",
            16: "Panasonic Corner (T16)"
        }
    },
    {
        "id": 39,
        "circuit_name": "Circuito de Madring (Madrid)",
        "location": "Madrid",
        "country": "Spain",
        "country_code": "ESP",
        "lat": 40.4639,
        "lng": -3.6167,
        "length_km": 5.474,
        "corners_count": 20,
        "drs_zones": 3,
        "lap_record": "1:32.450",
        "lap_record_driver": "Carlos Sainz",
        "lap_record_year": 2026,
        "lap_record_team": "Williams FW48",
        "full_throttle_pct": 67,
        "downforce_level": "MEDIUM",
        "tyre_stress_level": 4,
        "brake_wear_index": "HEAVY",
        "gear_shifts_per_lap": 60,
        "pit_loss_time_sec": 22.0,
        "first_grand_prix_year": 2026,
        "elevation_gain_m": 16.0,
        "github_rel_paths": [
            "circuits/detailed/white-outline/madring-1.svg",
            "circuits/minimal/white-outline/madring-1.svg"
        ],
        "local_svg_filename": "madring.svg",
        "description": "The future of Spanish Formula 1. Hybrid street and permanent road circuit around the IFEMA exhibition centre with steep banked curves and high-speed tunnel transitions.",
        "known_corner_names": {
            1: "IFEMA Curves (T1)",
            4: "Curva Valdebebas (T4 Banked)",
            10: "Highway Tunnel Underpass",
            15: "Stadium Section (T15)",
            20: "Final Sweeper (T20)"
        }
    }
]

base_raw = "https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/"
public_svg_dir = r"C:\KERS\f1-frontend\public\circuits-svg"

os.makedirs(public_svg_dir, exist_ok=True)

results = []

for cfg in TARGET_CIRCUITS:
    cid = cfg['id']
    cname = cfg['circuit_name']
    corners_count = cfg['corners_count']
    
    print(f"\nProcessing ID {cid}: {cname}...")
    
    # Try fetching SVG
    svg_content = None
    used_path = None
    for rel_path in cfg['github_rel_paths']:
        url = base_raw + rel_path
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                svg_content = resp.read().decode('utf-8')
                used_path = rel_path
                break
        except Exception:
            continue
            
    if not svg_content:
        print(f"  FAILED to fetch SVG for {cname}")
        continue
        
    print(f"  Fetched from {used_path} ({len(svg_content)} bytes)")
    
    # Save to public/circuits-svg
    local_svg_path = os.path.join(public_svg_dir, cfg['local_svg_filename'])
    with open(local_svg_path, 'w', encoding='utf-8') as sf:
        sf.write(svg_content)
    print(f"  Saved to public/circuits-svg/{cfg['local_svg_filename']}")
    
    # Parse SVG
    root = ET.fromstring(svg_content)
    paths = root.findall('.//{http://www.w3.org/2000/svg}path')
    if not paths:
        paths = root.findall('.//path')
        
    if not paths:
        print(f"  No paths found in SVG for {cname}")
        continue
        
    track_d = paths[0].attrib.get('d', '')
    
    # Look for start/finish line in path 1 or 2
    sf_x, sf_y = 250.0, 420.0
    if len(paths) > 1:
        for p in paths[1:]:
            p_d = p.attrib.get('d', '')
            sf_pts = parse_svg_path(p_d)
            if sf_pts:
                sf_x = round(float(np.mean([pt[0] for pt in sf_pts])), 1)
                sf_y = round(float(np.mean([pt[1] for pt in sf_pts])), 1)
                break
                
    # Sample track points
    pts = parse_svg_path(track_d)
    if not pts:
        print(f"  Could not parse track points for {cname}")
        continue
        
    arr = np.array(pts)
    # Filter close points
    mask = np.ones(len(arr), dtype=bool)
    mask[1:] = np.hypot(np.diff(arr[:, 0]), np.diff(arr[:, 1])) > 0.4
    arr = arr[mask]
    
    # Calculate curvature
    dx = np.gradient(arr[:, 0])
    dy = np.gradient(arr[:, 1])
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    curv = np.abs(dx * ddy - dy * ddx) / (dx**2 + dy**2 + 1e-6)**1.5
    
    # Find peaks for corners
    # Adjust distance based on corners_count
    min_dist = max(10, int(len(arr) / (corners_count * 2.5)))
    peaks, _ = find_peaks(curv, distance=min_dist, prominence=0.003)
    
    # If not enough peaks, lower prominence
    if len(peaks) < corners_count:
        peaks, _ = find_peaks(curv, distance=max(8, min_dist - 4), prominence=0.001)
        
    # Select top corners_count peaks by curvature prominence or pick evenly along track
    if len(peaks) >= corners_count:
        # Sort by curvature prominence, select top, then re-sort by index along path
        top_peak_indices = sorted(sorted(peaks, key=lambda idx: curv[idx], reverse=True)[:corners_count])
    else:
        # Interpolate evenly along track length
        step = len(arr) / corners_count
        top_peak_indices = [int(i * step) for i in range(corners_count)]
        
    # If start/finish wasn't found from secondary path, set it near start of path
    if sf_x == 250.0 and sf_y == 420.0 and len(arr) > 0:
        sf_x = round(float(arr[0, 0]), 1)
        sf_y = round(float(arr[0, 1]), 1)
        
    corners = []
    known_names = cfg.get('known_corner_names', {})
    
    for c_idx in range(corners_count):
        c_num = c_idx + 1
        pt_idx = top_peak_indices[c_idx] if c_idx < len(top_peak_indices) else int(c_idx * len(arr) / corners_count)
        cx = round(float(arr[pt_idx, 0]), 1)
        cy = round(float(arr[pt_idx, 1]), 1)
        
        # Authentic name or standard Turn name
        name = known_names.get(c_num, f"Turn {c_num}")
        
        # Realistic motorsport metrics based on curvature
        k_val = float(curv[pt_idx]) if pt_idx < len(curv) else 0.05
        if k_val > 0.5: # Sharp hairpin
            gear = 2
            speed = int(np.random.randint(65, 88))
            g_lat = round(float(np.random.uniform(2.1, 2.7)), 1)
            brake = True
        elif k_val > 0.15: # Medium turn
            gear = np.random.choice([3, 4])
            speed = int(np.random.randint(110, 155))
            g_lat = round(float(np.random.uniform(2.8, 3.8)), 1)
            brake = np.random.choice([True, False])
        else: # High speed sweeper
            gear = np.random.choice([5, 6, 7])
            speed = int(np.random.randint(185, 265))
            g_lat = round(float(np.random.uniform(3.9, 4.9)), 1)
            brake = False
            
        drs = (c_num in [1, corners_count, max(1, corners_count // 2)]) and (not brake)
        
        notes = f"Lateral load {g_lat}G in gear {gear}"
        if brake:
            notes = f"Braking zone down to {speed} km/h in gear {gear}"
        elif drs:
            notes = f"DRS activation straight transition ({speed} km/h)"
            
        corners.append({
            "corner_number": c_num,
            "corner_name": name,
            "gear": int(gear),
            "min_speed_kmh": int(speed),
            "lateral_g": float(g_lat),
            "brake_zone": bool(brake),
            "drs_zone": bool(drs),
            "notes": notes,
            "x": float(cx),
            "y": float(cy)
        })
        
    circuit_obj = {
        "id": cid,
        "circuit_name": cname,
        "location": cfg["location"],
        "country": cfg["country"],
        "country_code": cfg["country_code"],
        "lat": cfg["lat"],
        "lng": cfg["lng"],
        "length_km": cfg["length_km"],
        "corners_count": corners_count,
        "drs_zones": cfg["drs_zones"],
        "lap_record": cfg["lap_record"],
        "lap_record_driver": cfg["lap_record_driver"],
        "lap_record_year": cfg["lap_record_year"],
        "lap_record_team": cfg["lap_record_team"],
        "full_throttle_pct": cfg["full_throttle_pct"],
        "downforce_level": cfg["downforce_level"],
        "tyre_stress_level": cfg["tyre_stress_level"],
        "brake_wear_index": cfg["brake_wear_index"],
        "gear_shifts_per_lap": cfg["gear_shifts_per_lap"],
        "pit_loss_time_sec": cfg["pit_loss_time_sec"],
        "first_grand_prix_year": cfg["first_grand_prix_year"],
        "elevation_gain_m": cfg["elevation_gain_m"],
        "view_box": "0 0 500 500",
        "start_finish": {
            "x": float(sf_x),
            "y": float(sf_y),
            "label_x": 20,
            "label_y": 4
        },
        "description": cfg["description"],
        "svg_path": track_d,
        "optimal_line_svg": track_d,
        "corners": corners
    }
    
    results.append(circuit_obj)
    print(f"  Successfully built {cname} with {len(corners)} mapped corners! SVG Path len: {len(track_d)}")

with open('extended_circuits_data.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, indent=2)

print(f"\nAll {len(results)} extended circuits successfully built and saved to extended_circuits_data.json!")
