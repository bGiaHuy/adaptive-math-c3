import json
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

m = json.load(open('outputs/thpt-300-papers/pdf_answer_map.json', encoding='utf-8'))
g12_items = [x for x in m if x['hasAnswer'] and x['file'].startswith('THPT-12')]

print(f"Total G12 papers with answers: {len(g12_items)}")
for it in g12_items:
    fname = it['file']
    doc = fitz.open(f"outputs/thpt-300-papers/sources/{fname}")
    ans_pages = it['answerPages']
    print(f"\n--- {fname} ({it['totalPages']} pages, ans: {ans_pages}) ---")
    p0 = doc[0].get_text().split('\n')
    header = ' | '.join([l.strip() for l in p0[:6] if l.strip()])
    print(f"Header: {header}")
    # Inspect first answer page
    ans_start = int(ans_pages.split('-')[0]) - 1
    if ans_start < len(doc):
        ans_txt = doc[ans_start].get_text()[:300].replace('\n', ' ')
        print(f"Ans snippet (p{ans_start+1}): {ans_txt}")
