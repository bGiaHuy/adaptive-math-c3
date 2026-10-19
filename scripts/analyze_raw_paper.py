import fitz
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

def analyze_paper_questions(pdf_path, max_q_pages=4):
    doc = fitz.open(pdf_path)
    full_text = ""
    for p in range(min(max_q_pages, len(doc))):
        full_text += f"\n--- PAGE {p+1} ---\n" + doc[p].get_text()
    return full_text

# Let's inspect raw text of G10-028, G11-129, G12-228
for pid, f in [('G10-028', 'THPT-10-CUOI_HK1-028.pdf'), ('G11-129', 'THPT-11-CUOI_HK1-129.pdf'), ('G12-228', 'THPT-12-CUOI_HK1-228.pdf')]:
    print(f"==================== {pid} ====================")
    txt = analyze_paper_questions(f"outputs/thpt-300-papers/sources/{f}")
    print(txt[:2500])
