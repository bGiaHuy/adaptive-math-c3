import json
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

m = json.load(open('outputs/thpt-300-papers/pdf_answer_map.json', encoding='utf-8'))
for g, prefix in [(10, 'THPT-10'), (11, 'THPT-11'), (12, 'THPT-12')]:
    items = [x for x in m if x['hasAnswer'] and x['file'].startswith(prefix)]
    print(f"=== Grade {g}: {len(items)} papers with answers ===")
    for item in items[:5]:
        doc = fitz.open('outputs/thpt-300-papers/sources/' + item['file'])
        txt0 = doc[0].get_text()[:200].replace('\n', ' ')
        print(f"  {item['file']}: {item['totalPages']}p, ans: {item['answerPages']} | {txt0[:120]}")
