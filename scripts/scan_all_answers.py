import fitz
import sys
import json
import os

sys.stdout.reconfigure(encoding='utf-8')

sources_dir = 'outputs/thpt-300-papers/sources'
files = [f for f in os.listdir(sources_dir) if f.endswith('.pdf')]
files.sort()

results = []
print(f"Scanning {len(files)} PDFs for Question & Answer pages...")

for f in files:
    path = os.path.join(sources_dir, f)
    try:
        doc = fitz.open(path)
    except Exception as e:
        continue

    total_pages = len(doc)
    question_start = -1
    question_end = -1
    answer_start = -1
    answer_end = -1

    for idx, page in enumerate(doc):
        text = page.get_text()
        text_upper = text.upper()
        
        # Look for question section
        if ('PHẦN I' in text_upper or 'CÂU 1:' in text_upper or 'CÂU 1.' in text_upper) and question_start == -1 and 'HƯỚNG DẪN CHẤM' not in text_upper and 'ĐÁP ÁN' not in text_upper:
            question_start = idx + 1

        # Look for answer section
        if ('HƯỚNG DẪN CHẤM' in text_upper or 'BẢNG ĐÁP ÁN' in text_upper or 'ĐÁP ÁN VÀ THANG ĐIỂM' in text_upper or 'LỜI GIẢI CHI TIẾT' in text_upper or 'ĐÁP ÁN TRẮC NGHIỆM' in text_upper):
            if answer_start == -1:
                answer_start = idx + 1
            answer_end = idx + 1

    if question_start != -1 and answer_start != -1:
        question_end = answer_start - 1
    elif question_start != -1:
        question_end = total_pages

    results.append({
        'file': f,
        'totalPages': total_pages,
        'questionPages': f"{question_start}-{question_end}" if question_start != -1 else "unknown",
        'answerPages': f"{answer_start}-{answer_end}" if answer_start != -1 else "none",
        'hasAnswer': answer_start != -1
    })

with_answers = [r for r in results if r['hasAnswer']]
print(f"Total PDFs with full answer section detected: {len(with_answers)} / {len(results)}")

# Group by grade
for g in [10, 11, 12]:
    g_with = [r for r in with_answers if f"-{g}-" in r['file']]
    print(f" - Grade {g}: {len(g_with)} files with answer keys")

with open('outputs/thpt-300-papers/pdf_answer_map.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)
