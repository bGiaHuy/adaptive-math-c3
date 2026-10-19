import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

sample_files = [
    'outputs/thpt-300-papers/sources/THPT-10-GIUA_HK1-001.pdf',
    'outputs/thpt-300-papers/sources/THPT-10-GIUA_HK1-002.pdf',
    'outputs/thpt-300-papers/sources/THPT-10-CUOI_HK1-026.pdf',
    'outputs/thpt-300-papers/sources/THPT-11-GIUA_HK1-101.pdf',
    'outputs/thpt-300-papers/sources/THPT-11-CUOI_HK1-126.pdf',
    'outputs/thpt-300-papers/sources/THPT-12-GIUA_HK1-201.pdf',
    'outputs/thpt-300-papers/sources/THPT-12-CUOI_HK1-226.pdf',
]

for p in sample_files:
    doc = fitz.open(p)
    print(f"\n=== File: {p} ({len(doc)} pages) ===")
    has_answer = False
    answer_page = -1
    for idx, page in enumerate(doc):
        text = page.get_text()
        if 'ĐÁP ÁN' in text.upper() or 'HƯỚNG DẪN CHẤM' in text.upper() or 'LỜI GIẢI CHI TIẾT' in text.upper() or 'BẢNG ĐÁP ÁN' in text.upper():
            has_answer = True
            answer_page = idx + 1
            print(f" -> Found answer section on Page {idx+1}")
            lines = [l.strip() for l in text.split('\n') if l.strip()][:5]
            print("    Sample:", ' | '.join(lines))
    if not has_answer:
        print(" -> No answer keyword found in PDF text.")
