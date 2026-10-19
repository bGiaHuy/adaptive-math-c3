import json
import os
import hashlib
import sys
import re
import csv


sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
rev_dir = os.path.join(root, '04_Trich_xuat_Gemini', 'revision-01')
sources_path = os.path.join(rev_dir, 'sources.json')
questions_path = os.path.join(rev_dir, 'questions.jsonl')
review_csv_path = os.path.join(rev_dir, 'review.csv')

errors = []
warnings = []

print("=== 1. KIỂM TRA SOURCES.JSON ===")
if not os.path.exists(sources_path):
    errors.append("Không tìm thấy sources.json")
else:
    with open(sources_path, 'r', encoding='utf-8') as f:
        sources = json.load(f)
    print(f"Tổng số nguồn: {len(sources)}")
    
    source_map = {}
    for s in sources:
        sid = s['sourceId']
        if sid in source_map:
            errors.append(f"Trùng sourceId: {sid}")
        source_map[sid] = s
        
        # Kiểm tra file trên đĩa
        abs_p = os.path.join(root, s['relativePath'])
        if not os.path.exists(abs_p):
            errors.append(f"File không tồn tại trên đĩa: {abs_p}")
        else:
            with open(abs_p, 'rb') as fp:
                actual_h = hashlib.sha256(fp.read()).hexdigest()
            if actual_h != s['sha256']:
                errors.append(f"SHA-256 không khớp cho {sid}: ghi {s['sha256']}, thực tế {actual_h}")
                
        # Kiểm tra không còn 'Ban chuyên môn'
        if s.get('schoolOrAuthor') == 'Ban chuyên môn':
            errors.append(f"{sid} vẫn còn gán nhãn 'Ban chuyên môn'")

print("=== 2. KIỂM TRA QUESTIONS.JSONL ===")
if not os.path.exists(questions_path):
    errors.append("Không tìm thấy questions.jsonl")
else:
    with open(questions_path, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]
    
    print(f"Tổng số câu hỏi: {len(lines)}")
    if len(lines) != 10:
        warnings.append(f"Số lượng câu là {len(lines)}, kỳ vọng 10 câu mẫu")

    seen_ids = set()
    for idx, line in enumerate(lines, 1):
        try:
            q = json.loads(line)
        except Exception as e:
            errors.append(f"Dòng {idx}: Lỗi cú pháp JSON: {e}")
            continue

        qid = q.get('id')
        if not qid:
            errors.append(f"Dòng {idx}: Thiếu trường 'id'")
        elif qid in seen_ids:
            errors.append(f"Dòng {idx}: Trùng id {qid}")
        seen_ids.add(qid)

        # sourceId
        sid = q.get('sourceId')
        if sid not in source_map:
            errors.append(f"Câu {qid}: sourceId {sid} không tồn tại trong sources.json")
        else:
            src = source_map[sid]
            max_pages = src.get('pages', 9999)
            for p in q.get('questionPages', []):
                if not (1 <= p <= max_pages):
                    errors.append(f"Câu {qid}: questionPage {p} vượt quá số trang PDF ({max_pages})")
            for p in q.get('answerPages', []):
                if not (1 <= p <= max_pages):
                    errors.append(f"Câu {qid}: answerPage {p} vượt quá số trang PDF ({max_pages})")

        # Required new fields
        if q.get('examCode') != '101':
            errors.append(f"Câu {qid}: examCode phải là '101', nhận được {q.get('examCode')}")
        if q.get('section') not in ['I', 'II', 'III']:
            errors.append(f"Câu {qid}: section không hợp lệ: {q.get('section')}")
        if q.get('explanationOrigin') not in ['SOURCE_SOLUTION', 'MODEL_GENERATED', 'MISSING']:
            errors.append(f"Câu {qid}: explanationOrigin không hợp lệ: {q.get('explanationOrigin')}")
        if not isinstance(q.get('explanationPages'), list):
            errors.append(f"Câu {qid}: explanationPages phải là list")
        if not q.get('verificationNotes'):
            errors.append(f"Câu {qid}: verificationNotes không được để trống")
        if q.get('reviewStatus') != 'NEEDS_REVIEW':
            errors.append(f"Câu {qid}: reviewStatus phải giữ là 'NEEDS_REVIEW'")

        # Asset path check
        for asset in q.get('assets', []):
            asset_full = os.path.join(rev_dir, asset)
            if not os.path.exists(asset_full):
                errors.append(f"Câu {qid}: File ảnh asset không tồn tại: {asset_full}")

        # Type specific check
        qtype = q.get('type')
        if qtype == 'MULTIPLE_CHOICE':
            opts = q.get('options')
            if not isinstance(opts, list) or len(opts) != 4:
                errors.append(f"Câu {qid}: MULTIPLE_CHOICE phải có 4 options")
            else:
                keys = [o.get('key') for o in opts]
                if keys != ['A', 'B', 'C', 'D']:
                    errors.append(f"Câu {qid}: Keys của options phải là ['A', 'B', 'C', 'D'], thực tế: {keys}")
            if q.get('statements') is not None:
                errors.append(f"Câu {qid}: MULTIPLE_CHOICE phải có statements là null")
            ans = q.get('answer')
            if not isinstance(ans, dict) or 'correctOption' not in ans or ans['correctOption'] not in ['A', 'B', 'C', 'D']:
                errors.append(f"Câu {qid}: answer của MULTIPLE_CHOICE không hợp lệ: {ans}")

        elif qtype == 'TRUE_FALSE':
            stmts = q.get('statements')
            if not isinstance(stmts, list) or len(stmts) != 4:
                errors.append(f"Câu {qid}: TRUE_FALSE phải có 4 statements")
            else:
                keys = [s.get('key') for s in stmts]
                if keys != ['a', 'b', 'c', 'd']:
                    errors.append(f"Câu {qid}: Keys của statements phải là ['a', 'b', 'c', 'd'], thực tế: {keys}")
            if q.get('options') is not None:
                errors.append(f"Câu {qid}: TRUE_FALSE phải có options là null")
            ans = q.get('answer')
            if not isinstance(ans, dict) or sorted(ans.keys()) != ['a', 'b', 'c', 'd']:
                errors.append(f"Câu {qid}: answer của TRUE_FALSE phải có đủ keys a, b, c, d: {ans}")
            else:
                for k in ['a', 'b', 'c', 'd']:
                    if not isinstance(ans[k], bool):
                        errors.append(f"Câu {qid}: answer[{k}] phải là kiểu boolean, thực tế: {type(ans[k])}")

        elif qtype == 'SHORT_ANSWER':
            if q.get('options') is not None or q.get('statements') is not None:
                errors.append(f"Câu {qid}: SHORT_ANSWER phải có options và statements là null")
            ans = q.get('answer')
            if not isinstance(ans, dict) or 'raw' not in ans or 'normalized' not in ans:
                errors.append(f"Câu {qid}: answer của SHORT_ANSWER phải có raw và normalized: {ans}")

        else:
            errors.append(f"Câu {qid}: Type không hợp lệ: {qtype}")

        # LaTeX balance check
        texts = [q.get('stem', '')]
        if q.get('options'):
            texts.extend([o.get('text', '') for o in q['options']])
        if q.get('statements'):
            texts.extend([s.get('text', '') for s in q['statements']])
        if q.get('explanation'):
            texts.append(q['explanation'])

        for t in texts:
            # Count unescaped dollars
            # Replace \$ with empty
            t_no_esc = t.replace(r'\$', '')
            c = t_no_esc.count('$')
            if c % 2 != 0:
                errors.append(f"Câu {qid}: Lỗi mất cân bằng dấu $ trong đoạn: {t[:60]}... (số lượng $: {c})")

print("=== 3. KIỂM TRA REVIEW.CSV ===")
if not os.path.exists(review_csv_path):
    errors.append("Không tìm thấy review.csv")
else:
    with open(review_csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        csv_rows = list(reader)
    print(f"Tổng số dòng trong review.csv: {len(csv_rows)}")
    if len(csv_rows) != len(lines):
        errors.append(f"Số dòng trong review.csv ({len(csv_rows)}) khác số câu hỏi ({len(lines)})")

print("\n================ KẾT QUẢ KIỂM TRA ================")
if errors:
    print(f"❌ CÓ {len(errors)} LỖI CẦN SỬA:")
    for e in errors:
        print("  -", e)
else:
    print("✅ TOÀN BỘ CẤU TRÚC ĐẠT CHUẨN 100%, KHÔNG CÓ LỖI NÀO!")

if warnings:
    print(f"⚠️ CÓ {len(warnings)} CẢNH BÁO:")
    for w in warnings:
        print("  -", w)
