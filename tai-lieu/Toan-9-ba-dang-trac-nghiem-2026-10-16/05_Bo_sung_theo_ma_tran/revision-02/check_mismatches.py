import json
import csv
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
csv_path = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'candidates.csv')
rev01_jsonl = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'revision-01', 'questions.jsonl')

rev01_questions = {}
with open(rev01_jsonl, 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        rev01_questions[obj['id']] = obj

with open(csv_path, 'r', encoding='utf-8-sig') as f:
    candidates = list(csv.DictReader(f))

slot_counts = {}
for c in candidates:
    s = int(c['slot'])
    slot_counts[s] = slot_counts.get(s, 0) + 1
    c['id'] = f"CAND-SLOT{s:02d}-{slot_counts[s]:02d}"

print("=== DETAILED COMPARISON OF REV-01 VS ACTUAL PDF ===")

for idx, c in enumerate(candidates, 1):
    cid = c['id']
    q_rev01 = rev01_questions.get(cid)
    fn = c['filename']
    doc = fitz.open(os.path.join(base, fn))
    p_num = int(c['pdfPage']) - 1
    sec = c['section']
    qnum = c['questionNumber']
    
    # Text on the specified page
    p_text = doc[p_num].get_text()
    
    stem_rev01 = q_rev01['stem'] if q_rev01 else "MISSING"
    
    # Check if stem words appear in p_text
    # Extract significant words (len > 4) from stem
    sig_words = [w for w in stem_rev01.replace('$', '').replace('\\', '').split() if len(w) > 4 and w.isalpha()]
    matches = [w for w in sig_words if w.lower() in p_text.lower()]
    ratio = len(matches) / len(sig_words) if sig_words else 0
    
    print(f"[{idx:02d}] {cid} | Slot {c['slot']:2s} | p.{c['pdfPage']} Sec {sec} Q{qnum} | Sig words matched: {len(matches)}/{len(sig_words)} ({ratio:.0%})")
    if ratio < 0.3:
        print(f"    ALERT MISMATCH! Rev01 stem: {stem_rev01[:60]}...")
        # Show first 150 chars of page around Câu {qnum}
        idx_q = p_text.find(f"Câu {qnum}")
        if idx_q != -1:
            print(f"    Actual PDF: {p_text[idx_q:idx_q+120].replace(chr(10), ' ')}")
        else:
            print(f"    'Câu {qnum}' not even found on page {c['pdfPage']}!")
