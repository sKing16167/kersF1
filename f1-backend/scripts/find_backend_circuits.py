import os

backend_dir = r'C:\KERS\f1-backend'
for root, dirs, files in os.walk(backend_dir):
    if '__pycache__' in root or '.venv' in root:
        continue
    for f in files:
        if f.endswith('.py'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as file:
                content = file.read()
                if 'circuit' in content.lower():
                    rel = os.path.relpath(fp, backend_dir)
                    print(f"Backend file with circuit: {rel}")
