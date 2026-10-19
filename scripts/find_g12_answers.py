import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
d = json.load(open('outputs/thpt-300-papers/pdf_answer_map.json', encoding='utf-8'))
g12 = [r for r in d if '-12-' in r['file'] and r['hasAnswer']]
for r in g12[:10]:
    print(f"{r['file']}: total {r['totalPages']} pages | Q: {r['questionPages']} | Ans: {r['answerPages']}")
