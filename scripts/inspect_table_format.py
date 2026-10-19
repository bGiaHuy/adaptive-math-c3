import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

for f, ans_p, code in [
    ('THPT-10-CUOI_HK2-085.pdf', 8, '1001'),
    ('THPT-10-CUOI_HK2-089.pdf', 7, '1001'),
    ('THPT-11-CUOI_HK1-138.pdf', 7, '111'),
    ('THPT-11-CUOI_HK1-147.pdf', 14, '1101'),
    ('THPT-11-CUOI_HK2-182.pdf', 9, '111'),
    ('THPT-12-CUOI_HK1-235.pdf', 9, '1101')
]:
    doc = fitz.open(f"outputs/thpt-300-papers/sources/{f}")
    txt = doc[ans_p - 1].get_text()
    print(f"=== {f} (Ans page {ans_p}, code {code}) ===")
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    for l in lines[:25]:
        print("  ", l)
