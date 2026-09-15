import re

s = "q.505.038.995.038h.005"
tokens = re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', s)
print("Tokens for s:", tokens)

s2 = "M462.85 365.784 329.224 131.432c-4.038-7.082"
tokens2 = re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?', s2)
print("Tokens for s2:", tokens2)
