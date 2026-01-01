from pathlib import Path
path = Path('D:/Users/0dot1/Documents/Github/dot/shunya/index/ehh_template-v1.1.0-active-KW-wonderAgent.yaml')
for i,line in enumerate(path.read_text().splitlines(),1):
    if 'index:' in line:
        print(f"{i}: {line.strip()}")
