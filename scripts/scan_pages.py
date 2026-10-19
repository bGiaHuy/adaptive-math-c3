import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = 'outputs/thpt-300-papers/sources/THPT-10-GIUA_HK1-001.pdf'
doc = fitz.open(path)
print(f"Total pages: {len(doc)}")
for idx, page in enumerate(doc):
    text = page.get_text()
    lines = [l.strip() for l in text.strip().split('\n') if l.strip()]
    header = ' | '.join(lines[:3]) if lines else 'EMPTY'
    print(f"Page {idx+1}: {header[:120]}")
