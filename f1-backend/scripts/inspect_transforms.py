import xml.etree.ElementTree as ET

for name in ['bahrain', 'baku', 'cota', 'shanghai', 'spielberg']:
    fp = rf"C:\KERS\f1-frontend\public\circuits-svg\{name}.svg"
    tree = ET.parse(fp)
    root = tree.getroot()
    print(f"\n=== {name}.svg ===")
    for i, elem in enumerate(root.iter()):
        tag = elem.tag.split('}')[-1]
        if tag in ['path', 'g', 'rect']:
            print(f"  {tag} {i}: attribs={elem.attrib.keys()}, trans={elem.attrib.get('transform')}, d_len={len(elem.attrib.get('d', ''))}")
