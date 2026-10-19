import csv
import sys
import fitz
import os

sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
csv_path = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'candidates.csv')

with open(csv_path, 'r', encoding='utf-8-sig') as f:
    candidates = list(csv.DictReader(f))

# Let's map slot ID prefix
slot_counts = {}
for c in candidates:
    s = int(c['slot'])
    slot_counts[s] = slot_counts.get(s, 0) + 1
    c_id = f"CAND-SLOT{s:02d}-{slot_counts[s]:02d}"
    c['id'] = c_id

print("Checking presence of each question on its page...")
missing = []
for c in candidates:
    fn = os.path.join(base, c['filename'])
    doc = fitz.open(fn)
    p_num = int(c['pdfPage']) - 1 # 0-indexed
    page = doc[p_num]
    text = page.get_text()
    qnum = c['questionNumber']
    
    # Check for question header patterns: 'Câu {qnum}.', 'Câu {qnum}:', 'Câu {qnum} '
    patterns = [f"Câu {qnum}.", f"Câu {qnum}:", f"Câu {qnum} ", f"Câu {qnum}\n", f"câu {qnum}.", f"CÂU {qnum}."]
    found = any(p in text for p in patterns)
    if not found:
        # Check next page or prev page
        found_prev = (p_num > 0) and any(p in doc[p_num-1].get_text() for p in patterns)
        found_next = (p_num + 1 < len(doc)) and any(p in doc[p_num+1].get_text() for p in patterns)
        print(f"WARN: {c['id']} ({c['filename']} p.{c['pdfPage']}) Q{qnum} not found directly! (prev: {found_prev}, next: {found_next})")
        missing.append((c['id'], c['filename'], c['pdfPage'], qnum))
    else:
        # print first 60 chars of question
        for pat in patterns:
            if pat in text:
                idx = text.find(pat)
                print(f"[FOUND] {c['id']} | p.{c['pdfPage']} | {text[idx:idx+80].replace(chr(10), ' ')}")
                break

print(f"\nTotal missing: {len(missing)}")
