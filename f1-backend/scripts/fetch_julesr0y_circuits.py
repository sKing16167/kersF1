import urllib.request
import json
import os

url = 'https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/circuits.json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
    print(f"Total circuits in julesr0y/f1-circuits-svg: {len(data)}")
    
    with open('julesr0y_circuits.json', 'w', encoding='utf-8') as out:
        json.dump(data, out, indent=2)
        
    for c in data:
        layouts = [l['layoutId'] for l in c.get('layouts', [])]
        print(f"{c['id']:20s} | {c['name']:35s} | {c['countryId']:20s} | {layouts}")
except Exception as e:
    print("Error:", e)
