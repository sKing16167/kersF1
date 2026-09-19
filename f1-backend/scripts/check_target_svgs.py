import urllib.request
import json

with open('julesr0y_circuits.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# The circuits after Yas Marina in our app:
target_circuits = {
    24: ('sepang', 'Sepang International Circuit', 'sepang-1'),
    25: ('sochi', 'Sochi Autodrom', 'sochi-1'),
    26: ('hockenheimring', 'Hockenheimring', 'hockenheimring-4'),
    27: ('imola', 'Autodromo Enzo e Dino Ferrari', 'imola-3'),
    28: ('istanbul', 'Istanbul Park', 'istanbul-1'),
    29: ('nurburgring', 'Nürburgring', 'nurburgring-4'),
    30: ('paul-ricard', 'Circuit Paul Ricard', 'paul-ricard-1'),
    31: ('magny-cours', 'Circuit de Nevers Magny-Cours', 'magny-cours-3'),
    32: ('indianapolis', 'Indianapolis Motor Speedway', 'indianapolis-1'),
    33: ('portimao', 'Autódromo Internacional do Algarve', 'portimao-1'),
    34: ('buddh', 'Buddh International Circuit', 'buddh-1'),
    35: ('yeongam', 'Korean International Circuit', 'yeongam-1'),
    36: ('valencia', 'Valencia Street Circuit', 'valencia-1'),
    37: ('mugello', 'Autodromo Internazionale del Mugello', 'mugello-1'),
    38: ('fuji', 'Fuji Speedway', 'fuji-2'),
}

base_url = "https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits/detailed/white-outline/"

for cid, (slug, name, layout) in target_circuits.items():
    url = f"{base_url}{layout}.svg"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8')
            print(f"ID {cid:2d} | {layout:20s} | Found! Size: {len(content)} bytes")
    except Exception as e:
        print(f"ID {cid:2d} | {layout:20s} | Not found in white-outline: {e}")
        # Check if another layout exists or in other folders
