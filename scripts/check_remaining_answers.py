import json
import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

papers = [
    # G10
    ('THPT-10-CUOI_HK1-035.pdf', 10, '101', 7),
    ('THPT-10-CUOI_HK1-041.pdf', 10, '101', 9),
    ('THPT-10-CUOI_HK1-042.pdf', 10, '1001', 7),
    ('THPT-10-CUOI_HK1-045.pdf', 10, '0101', 17),
    ('THPT-10-CUOI_HK1-048.pdf', 10, '101', 7),
    ('THPT-10-CUOI_HK2-076.pdf', 10, '1001', 7),
    ('THPT-10-CUOI_HK2-084.pdf', 10, 'A', 7),
    ('THPT-10-CUOI_HK2-085.pdf', 10, '101', 8),
    # G11
    ('THPT-11-CUOI_HK1-136.pdf', 11, '111', 9),
    ('THPT-11-CUOI_HK1-137.pdf', 11, '101', 4),
    ('THPT-11-CUOI_HK1-138.pdf', 11, '111', 7),
    ('THPT-11-CUOI_HK1-139.pdf', 11, '111', 5),
    ('THPT-11-CUOI_HK1-141.pdf', 11, '1101', 6),
    ('THPT-11-CUOI_HK1-147.pdf', 11, '1101', 14),
    ('THPT-11-CUOI_HK2-176.pdf', 11, '1101', 9),
    ('THPT-11-CUOI_HK2-182.pdf', 11, '101', 9),
    # G12
    ('THPT-12-CUOI_HK1-235.pdf', 12, '1101', 9),
    ('THPT-12-CUOI_HK1-236.pdf', 12, '0101', 5),
    ('THPT-12-CUOI_HK1-241.pdf', 12, '0121', 9),
    ('THPT-12-CUOI_HK1-247.pdf', 12, '1211', 21),
    ('THPT-12-CUOI_HK2-281.pdf', 12, 'A', 9),
    ('THPT-12-GIUA_HK1-206.pdf', 12, '101', 9),
    ('THPT-12-GIUA_HK1-208.pdf', 12, '001', 9),
    ('THPT-12-GIUA_HK1-225.pdf', 12, '1001', 9),
]

for f, g, code, ans_p in papers:
    pid = f.replace('.pdf', '')
    doc = fitz.open(f"outputs/thpt-300-papers/sources/{f}")
    ans_txt = doc[ans_p - 1].get_text()
    has_code = code in ans_txt or f"Mã {code}" in ans_txt or f"MÃ ĐỀ {code}" in ans_txt
    print(f"[{pid}] Gr {g} | AnsP {ans_p}/{len(doc)} | Code {code} found: {has_code}")
