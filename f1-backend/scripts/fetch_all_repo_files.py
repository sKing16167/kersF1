import urllib.request
import json

# Fetch git tree of julesr0y/f1-circuits-svg
tree_url = 'https://api.github.com/repos/julesr0y/f1-circuits-svg/git/trees/main?recursive=1'
req = urllib.request.Request(tree_url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    tree = data.get('tree', [])
    print(f"Total files in repo: {len(tree)}")
    svgs = [item['path'] for item in tree if item['path'].endswith('.svg')]
    print(f"Total SVGs in repo: {len(svgs)}")
    
    with open('all_repo_svgs.json', 'w', encoding='utf-8') as f:
        json.dump(svgs, f, indent=2)
        
    for p in svgs:
        print(p)
except Exception as e:
    print("Error:", e)
