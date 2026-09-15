import os, glob

frontend_dir = r'C:\KERS\f1-frontend'
for root, dirs, files in os.walk(frontend_dir):
    if 'node_modules' in root or '.next' in root:
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx', '.js', '.jsx')):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as file:
                content = file.read()
                if 'MOCK_CIRCUITS' in content or 'circuits' in content.lower():
                    matches = [line.strip() for line in content.split('\n') if 'MOCK_CIRCUITS' in line]
                    if matches:
                        rel = os.path.relpath(fp, frontend_dir)
                        print(f"{rel}: {matches}")
