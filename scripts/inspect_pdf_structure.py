import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    ('Lớp 10', 'outputs/thpt-300-papers/sources/THPT-10-GIUA_HK1-001.pdf'),
    ('Lớp 11', 'outputs/thpt-300-papers/sources/THPT-11-GIUA_HK1-101.pdf'),
    ('Lớp 12', 'outputs/thpt-300-papers/sources/THPT-12-GIUA_HK1-201.pdf'),
]

for grade, path in files:
    print(f"=== {grade}: {path} ===")
    doc = fitz.open(path)
    print(f"Page count: {len(doc)}")
    for i in range(min(len(doc), 3)):
        page = doc[i]
        text = page.get_text()
        first_lines = text.strip().split('\n')[:10]
        print(f"--- Page {i+1} ({len(text)} chars) ---")
        print('\n'.join(first_lines))
        print()
