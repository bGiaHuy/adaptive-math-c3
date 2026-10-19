import csv
import sys
import fitz
import os

base = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
csv_path = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'candidates.csv')

with open(csv_path, 'r', encoding='utf-8-sig') as f:
    candidates = list(csv.DictReader(f))

print(f"Total candidates: {len(candidates)}")
for i, c in enumerate(candidates):
    slot = c['slot']
    fn = c['filename']
    p = c['pdfPage']
    sec = c['section']
    qnum = c['questionNumber']
    ans_p = c['answerPage']
    print(f"[{i+1:02d}] Slot {slot} | {fn} | p.{p} | Sec {sec} | Q{qnum} | Ans_p {ans_p}")
