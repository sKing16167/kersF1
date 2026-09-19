import re

with open(r'C:\KERS\f1-frontend\lib\api.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const MOCK_CIRCUITS: Circuit[] = [')
end = text.find('export const CIRCUIT_MAP_BY_ID', start)
circuits_text = text[start:end]

# Find all circuit names and IDs with or without quotes around key
entries = re.findall(r'["\']?id["\']?\s*:\s*(\d+)\s*,\s*["\']?circuit_name["\']?\s*:\s*["\']([^"\']+)["\']', circuits_text)
print(f"Total circuits in MOCK_CIRCUITS: {len(entries)}")
for cid, cname in entries:
    print(f"ID {int(cid):2d}: {cname}")
