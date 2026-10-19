import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

for name, path in [
    ('Grade 10', 'outputs/thpt-300-papers/sources/THPT-10-CUOI_HK1-026.pdf'),
    ('Grade 11', 'outputs/thpt-300-papers/sources/THPT-11-CUOI_HK1-126.pdf'),
    ('Grade 12', 'outputs/thpt-300-papers/sources/THPT-12-CUOI_HK1-227.pdf')
]:
    print(f"\n==================== {name}: {path} ====================")
    doc = fitz.open(path)
    print(f"Total pages: {len(doc)}")
    
    # Check page 1 text
    print("--- Page 1: ---")
    p1 = doc[0].get_text()
    print('\n'.join(p1.strip().split('\n')[:20]))

    # Find where answer starts and print sample
    for idx, page in enumerate(doc):
        t = page.get_text()
        if 'HƯỚNG DẪN CHẤM' in t.upper() or 'BẢNG ĐÁP ÁN' in t.upper() or 'ĐÁP ÁN' in t.upper():
            print(f"\n--- Answer Page {idx+1}: ---")
            print('\n'.join(t.strip().split('\n')[:25]))
            break
