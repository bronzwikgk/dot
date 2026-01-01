import pathlib
path=pathlib.Path('D:/Users/0dot1/Documents/Github/dot/shunya/index/ehh-manifest-index.yml')
lines=path.read_text().splitlines()
for i,l in enumerate(lines,1):
    if 'ActionLoader responsibilities' in l:
        for j in range(max(0,i-2), min(len(lines), i+3)):
            print(f"{j+1}: {lines[j]}")
        break
