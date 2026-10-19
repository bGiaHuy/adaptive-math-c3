import csv
import json
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
csv_path = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'candidates.csv')
rev01_jsonl = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'revision-01', 'questions.jsonl')

rev01_dict = {}
with open(rev01_jsonl, 'r', encoding='utf-8') as f:
    for line in f:
        q = json.loads(line)
        rev01_dict[q['id']] = q

with open(csv_path, 'r', encoding='utf-8-sig') as f:
    candidates = list(csv.DictReader(f))

slot_counts = {}
for c in candidates:
    s = int(c['slot'])
    slot_counts[s] = slot_counts.get(s, 0) + 1
    c['id'] = f"CAND-SLOT{s:02d}-{slot_counts[s]:02d}"

print("ID | Slot | Status in Rev01 vs Real Source")
print("-" * 60)

for c in candidates:
    cid = c['id']
    q_rev = rev01_dict.get(cid, {})
    fn = c['filename']
    doc = fitz.open(os.path.join(base, fn))
    p_num = int(c['pdfPage']) - 1
    sec = c['section']
    qnum = c['questionNumber']
    
    # Check text around qnum on page p_num
    p_text = doc[p_num].get_text()
    
    rev_stem = q_rev.get('stem', '')
    rev_ans = q_rev.get('answer', {})
    
    print(f"\n[{cid}] (Slot {c['slot']}) - {fn} p.{c['pdfPage']} Sec {sec} Q{qnum}")
    print(f"  Rev01 Stem: {rev_stem[:70]}...")
    print(f"  Rev01 Ans:  {rev_ans}")
    
    # Find in PDF
    idx = p_text.find(f"Câu {qnum}")
    if idx != -1:
        snippet = p_text[idx:idx+250].replace('\n', ' ')
        print(f"  Real PDF:   {snippet[:100]}...")
    else:
        print(f"  Real PDF:   NOT FOUND on page {c['pdfPage']}! (Checking adjacent pages)")
        for delta in [-1, 1, -2, 2]:
            adj = p_num + delta
            if 0 <= adj < len(doc):
                adj_text = doc[adj].get_text()
                if f"Câu {qnum}" in adj_text:
                    idx_adj = adj_text.find(f"Câu {qnum}")
                    print(f"    -> Found on page {adj+1}: {adj_text[idx_adj:idx_adj+100].replace(chr(10), ' ')}...")
                    break
