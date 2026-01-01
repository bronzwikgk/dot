from pathlib import Path
path=Path('D:/Users/0dot1/Documents/Github/dot/shunya/index/ehh_template-v1.1.8-active-KW-wonderAgent.yaml')
for idx,line in enumerate(path.read_text(encoding='utf-8').splitlines(),1):
    if 60<=idx<=90:
        print(idx, line)
