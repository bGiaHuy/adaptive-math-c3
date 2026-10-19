import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

for label, path in [
    ('GRADE 11', 'outputs/thpt-300-papers/sources/THPT-11-CUOI_HK1-126.pdf'),
    ('GRADE 12', 'outputs/thpt-300-papers/sources/THPT-12-CUOI_HK1-227.pdf')
]:
    print(f"\n==================== {label} ====================")
    doc = fitz.open(path)
    # Print pages 1, 2, 3 (questions) and answer pages
    for p in range(min(len(doc), 3)):
        print(f"\n--- PAGE {p+1} ---")
        print(doc[p].get_text()[:1500])

    for p in range(len(doc)):
        t = doc[p].get_text()
        if 'HƯỚNG DẪN CHẤM' in t.upper() or 'BẢNG ĐÁP ÁN' in t.upper():
            print(f"\n--- ANSWER PAGE {p+1} ---")
            print(t[:2000])
            break
