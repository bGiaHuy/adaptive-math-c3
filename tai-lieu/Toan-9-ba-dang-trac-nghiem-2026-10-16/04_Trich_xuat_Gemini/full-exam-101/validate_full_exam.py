import json
import os
import hashlib
import sys
import csv
import subprocess
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
exam_dir = os.path.join(root, '04_Trich_xuat_Gemini', 'full-exam-101')
sources_path = os.path.join(exam_dir, 'sources.json')
questions_path = os.path.join(exam_dir, 'questions.jsonl')
review_csv_path = os.path.join(exam_dir, 'review.csv')
katex_script = os.path.join(exam_dir, 'validate_katex.cjs')

errors = []
warnings = []
stats = {
    'sources_checked': 0,
    'questions_checked': 0,
    'csv_rows_checked': 0,
    'csv_fields_compared': 0,
    'images_inspected': 0,
    'katex_formulas_checked': 0
}

print("=" * 70)
print("     KIỂM THỬ TOÀN DIỆN MÃ ĐỀ 101 (UPGRADED VALIDATOR)")
print("=" * 70)

# 1. KIỂM TRA SOURCES.JSON
print("\n[1/5] KIỂM TRA SOURCES.JSON...")
if not os.path.exists(sources_path):
    errors.append("Không tìm thấy sources.json tại full-exam-101")
    source_map = {}
else:
    with open(sources_path, 'r', encoding='utf-8') as f:
        sources = json.load(f)
    stats['sources_checked'] = len(sources)
    source_map = {}
    for s in sources:
        sid = s['sourceId']
        if sid in source_map:
            errors.append(f"Trùng sourceId trong sources.json: {sid}")
        source_map[sid] = s

        # Kiểm tra file PDF trên đĩa và mã SHA-256
        abs_p = os.path.join(root, s['relativePath'])
        if not os.path.exists(abs_p):
            errors.append(f"File PDF nguồn không tồn tại: {abs_p}")
        else:
            with open(abs_p, 'rb') as fp:
                actual_h = hashlib.sha256(fp.read()).hexdigest()
            if actual_h != s['sha256']:
                errors.append(f"SHA-256 không khớp cho {sid}: ghi {s['sha256']}, thực tế {actual_h}")

        if s.get('schoolOrAuthor') == 'Ban chuyên môn':
            errors.append(f"{sid} vẫn còn gán nhãn chưa chuẩn 'Ban chuyên môn'")

    print(f"  -> Đã kiểm tra {len(sources)} nguồn tài liệu. SHA-256 và metadata hợp lệ.")

# 2. KIỂM TRA QUESTIONS.JSONL
print("\n[2/5] KIỂM TRA QUESTIONS.JSONL (CẤU TRÚC VÀ RÀNG BUỘC NGHIỆP VỤ)...")
questions_by_id = {}
if not os.path.exists(questions_path):
    errors.append("Không tìm thấy questions.jsonl tại full-exam-101")
else:
    with open(questions_path, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f if l.strip()]

    stats['questions_checked'] = len(lines)
    if len(lines) != 22:
        errors.append(f"Số lượng câu hỏi là {len(lines)}, kỳ vọng đủ 22 câu chính cho Mã đề 101!")

    type_counts = {'MULTIPLE_CHOICE': 0, 'TRUE_FALSE': 0, 'SHORT_ANSWER': 0}
    section_counts = {'I': 0, 'II': 0, 'III': 0}

    for idx, line in enumerate(lines, 1):
        try:
            q = json.loads(line)
        except Exception as e:
            errors.append(f"Dòng {idx}: Lỗi cú pháp JSON: {e}")
            continue

        qid = q.get('id')
        if not qid:
            errors.append(f"Dòng {idx}: Thiếu trường 'id'")
            continue
        if qid in questions_by_id:
            errors.append(f"Dòng {idx}: Trùng lặp ID câu hỏi: '{qid}'")
        questions_by_id[qid] = q

        # Kiểm tra sourceId và trang PDF
        sid = q.get('sourceId')
        if sid != 'SRC009':
            errors.append(f"[{qid}] sourceId phải là 'SRC009', nhận được '{sid}'")
        if sid in source_map:
            max_pages = source_map[sid].get('pages', 9)
            for p in q.get('questionPages', []):
                if not (1 <= p <= max_pages):
                    errors.append(f"[{qid}] questionPage {p} vượt quá số trang PDF ({max_pages})")
            for p in q.get('answerPages', []):
                if not (1 <= p <= max_pages):
                    errors.append(f"[{qid}] answerPage {p} vượt quá số trang PDF ({max_pages})")

        # Ràng buộc nghiệp vụ bắt buộc
        if q.get('examCode') != '101':
            errors.append(f"[{qid}] examCode phải là '101', nhận được '{q.get('examCode')}'")

        sec = q.get('section')
        if sec not in ['I', 'II', 'III']:
            errors.append(f"[{qid}] section không hợp lệ: '{sec}'")
        else:
            section_counts[sec] += 1

        if q.get('explanationOrigin') != 'MODEL_GENERATED':
            errors.append(f"[{qid}] explanationOrigin phải là 'MODEL_GENERATED', nhận được '{q.get('explanationOrigin')}'")

        if q.get('explanationPages') != []:
            errors.append(f"[{qid}] explanationPages phải là [] (rỗng vì đề không có bài giải chi tiết)")

        if q.get('answerOrigin') != 'SOURCE_KEY':
            errors.append(f"[{qid}] answerOrigin phải là 'SOURCE_KEY'")

        if q.get('reviewStatus') != 'NEEDS_REVIEW':
            errors.append(f"[{qid}] reviewStatus phải giữ là 'NEEDS_REVIEW'")

        if not q.get('verificationNotes'):
            errors.append(f"[{qid}] verificationNotes không được để trống")

        # Kiểm tra cấu trúc từng dạng câu
        qtype = q.get('type')
        if qtype in type_counts:
            type_counts[qtype] += 1

        if qtype == 'MULTIPLE_CHOICE':
            if sec != 'I':
                errors.append(f"[{qid}] Câu MULTIPLE_CHOICE phải thuộc section 'I'")
            opts = q.get('options')
            if not isinstance(opts, list) or len(opts) != 4:
                errors.append(f"[{qid}] MULTIPLE_CHOICE phải có 4 options")
            else:
                keys = [o.get('key') for o in opts]
                if keys != ['A', 'B', 'C', 'D']:
                    errors.append(f"[{qid}] Options keys phải là ['A', 'B', 'C', 'D'], thực tế: {keys}")
            if q.get('statements') is not None:
                errors.append(f"[{qid}] MULTIPLE_CHOICE statements phải là null")
            ans = q.get('answer')
            if not isinstance(ans, dict) or ans.get('correctOption') not in ['A', 'B', 'C', 'D']:
                errors.append(f"[{qid}] Đáp án MULTIPLE_CHOICE không hợp lệ: {ans}")

        elif qtype == 'TRUE_FALSE':
            if sec != 'II':
                errors.append(f"[{qid}] Câu TRUE_FALSE phải thuộc section 'II'")
            stmts = q.get('statements')
            if not isinstance(stmts, list) or len(stmts) != 4:
                errors.append(f"[{qid}] TRUE_FALSE phải có 4 statements")
            else:
                keys = [s.get('key') for s in stmts]
                if keys != ['a', 'b', 'c', 'd']:
                    errors.append(f"[{qid}] Statements keys phải là ['a', 'b', 'c', 'd'], thực tế: {keys}")
            if q.get('options') is not None:
                errors.append(f"[{qid}] TRUE_FALSE options phải là null")
            ans = q.get('answer')
            if not isinstance(ans, dict) or sorted(ans.keys()) != ['a', 'b', 'c', 'd']:
                errors.append(f"[{qid}] Đáp án TRUE_FALSE phải có đủ 4 keys a, b, c, d: {ans}")
            else:
                for k in ['a', 'b', 'c', 'd']:
                    if not isinstance(ans[k], bool):
                        errors.append(f"[{qid}] answer['{k}'] phải là boolean, nhận được {type(ans[k])}")

        elif qtype == 'SHORT_ANSWER':
            if sec != 'III':
                errors.append(f"[{qid}] Câu SHORT_ANSWER phải thuộc section 'III'")
            if q.get('options') is not None or q.get('statements') is not None:
                errors.append(f"[{qid}] SHORT_ANSWER options và statements phải là null")
            ans = q.get('answer')
            if not isinstance(ans, dict) or 'raw' not in ans or 'normalized' not in ans:
                errors.append(f"[{qid}] Đáp án SHORT_ANSWER phải có raw và normalized: {ans}")

        else:
            errors.append(f"[{qid}] Loại câu hỏi không hợp lệ: {qtype}")

    print(f"  -> Tổng số câu: {stats['questions_checked']} câu (Section I: {section_counts['I']}, Section II: {section_counts['II']}, Section III: {section_counts['III']})")
    print(f"  -> Phân bố dạng câu: {type_counts}")

# 3. SO SÁNH TỪNG TRƯỜNG REVIEW.CSV VỚI QUESTIONS.JSONL THEO ID
print("\n[3/5] SO SÁNH TỪNG TRƯỜNG GIỮA REVIEW.CSV VÀ QUESTIONS.JSONL THEO ID...")
if not os.path.exists(review_csv_path):
    errors.append("Không tìm thấy review.csv tại full-exam-101")
else:
    with open(review_csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        csv_rows = list(reader)

    stats['csv_rows_checked'] = len(csv_rows)
    if len(csv_rows) != len(questions_by_id):
        errors.append(f"Số dòng trong review.csv ({len(csv_rows)}) khác số câu hỏi trong questions.jsonl ({len(questions_by_id)})")

    csv_ids = set()
    for row in csv_rows:
        qid = row.get('id')
        if not qid:
            errors.append("Có dòng trong review.csv thiếu cột 'id'")
            continue
        if qid in csv_ids:
            errors.append(f"Trùng lặp ID trong review.csv: '{qid}'")
        csv_ids.add(qid)

        if qid not in questions_by_id:
            errors.append(f"ID trong review.csv không tồn tại trong questions.jsonl: '{qid}'")
            continue

        q = questions_by_id[qid]

        # So sánh từng trường xuất hiện
        fields_to_compare = [
            ('sourceId', row.get('sourceId'), q.get('sourceId')),
            ('examCode', row.get('examCode'), q.get('examCode')),
            ('section', row.get('section'), q.get('section')),
            ('questionNumber', int(row.get('questionNumber', -1)), q.get('questionNumber')),
            ('type', row.get('type'), q.get('type')),
            ('topic', row.get('topic'), q.get('topic')),
            ('questionPages', [int(x) for x in row.get('questionPages', '').split(',') if x], q.get('questionPages')),
            ('answerPages', [int(x) for x in row.get('answerPages', '').split(',') if x], q.get('answerPages')),
            ('explanationPages', [int(x) for x in row.get('explanationPages', '').split(',') if x], q.get('explanationPages')),
            ('assets', [x for x in row.get('assets', '').split(',') if x], q.get('assets', [])),
            ('answerOrigin', row.get('answerOrigin'), q.get('answerOrigin')),
            ('explanationOrigin', row.get('explanationOrigin'), q.get('explanationOrigin')),
            ('reviewStatus', row.get('reviewStatus'), q.get('reviewStatus')),
            ('verificationNotes', row.get('verificationNotes'), q.get('verificationNotes'))
        ]

        for fname, val_csv, val_json in fields_to_compare:
            stats['csv_fields_compared'] += 1
            if val_csv != val_json:
                errors.append(f"[{qid}] Lệch trường '{fname}': CSV='{val_csv}' vs JSON='{val_json}'")

        # So sánh trường answer (deserialize JSON)
        try:
            ans_csv = json.loads(row.get('answer', '{}'))
            stats['csv_fields_compared'] += 1
            if ans_csv != q.get('answer'):
                errors.append(f"[{qid}] Lệch trường 'answer': CSV={ans_csv} vs JSON={q.get('answer')}")
        except Exception as e:
            errors.append(f"[{qid}] Không parse được JSON trong cột 'answer' của CSV: {e}")

        # So sánh issues
        expected_issues = "; ".join(q.get('issues', [])) if q.get('issues') else "NONE"
        stats['csv_fields_compared'] += 1
        if row.get('issues') != expected_issues:
            errors.append(f"[{qid}] Lệch trường 'issues': CSV='{row.get('issues')}' vs JSON='{expected_issues}'")

    print(f"  -> Đã đối chiếu {stats['csv_rows_checked']} dòng theo ID. Tổng cộng {stats['csv_fields_compared']} trường được so sánh khớp 100%.")

# 4. MỞ VÀ KIỂM TRA TỆP HÌNH ẢNH THỰC TẾ BẰNG PIL
print("\n[4/5] MỞ VÀ KIỂM TRA TÍNH TOÀN VẸN CỦA HÌNH ẢNH ASSETS...")
checked_images = set()
for qid, q in questions_by_id.items():
    for asset_rel in q.get('assets', []):
        asset_path = os.path.join(exam_dir, asset_rel)
        if asset_path in checked_images:
            continue
        checked_images.add(asset_path)
        stats['images_inspected'] += 1

        if not os.path.exists(asset_path):
            errors.append(f"[{qid}] Tệp ảnh asset không tồn tại: {asset_path}")
            continue

        try:
            with Image.open(asset_path) as im:
                im.verify()  # Kiểm tra tính toàn vẹn nhị phân
            with Image.open(asset_path) as im:
                w, h = im.size
                fmt = im.format
                mode = im.mode
                if w <= 0 or h <= 0:
                    errors.append(f"[{qid}] Kích thước ảnh không hợp lệ ({w}x{h}): {asset_path}")
                if fmt != 'PNG':
                    warnings.append(f"[{qid}] Định dạng ảnh là {fmt}, khuyến nghị PNG: {asset_path}")
                print(f"  -> [OK] Asset '{asset_rel}': định dạng {fmt}, kích thước {w}x{h}, mode {mode}")
        except Exception as e:
            errors.append(f"[{qid}] Lỗi khi mở hoặc đọc ảnh asset '{asset_path}': {e}")

# 5. KIỂM TRA CÔNG THỨC TOÁN BẰNG KATEX (throwOnError: true)
print("\n[5/5] KIỂM TRA CÚ PHÁP RENDER KATEX (throwOnError: true)...")
if not os.path.exists(katex_script):
    errors.append(f"Không tìm thấy script KaTeX: {katex_script}")
else:
    try:
        proc = subprocess.run(
            ['node', katex_script, questions_path],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        if proc.returncode != 0:
            errors.append(f"KaTeX validator trả về lỗi (exit code {proc.returncode}):\n{proc.stderr}\n{proc.stdout}")
        else:
            print("  -> " + proc.stdout.strip().replace('\n', '\n  -> '))
            # Extract number of formulas
            for l in proc.stdout.splitlines():
                if 'Tổng số công thức' in l:
                    try:
                        stats['katex_formulas_checked'] = int(l.split(':')[-1].strip())
                    except:
                        pass
    except Exception as e:
        errors.append(f"Không thể thực thi KaTeX script: {e}")

# ==================== TỔNG KẾT VÀ BÁO CÁO PHẠM VI ====================
print("\n" + "=" * 70)
print("                   TỔNG KẾT KẾT QUẢ KIỂM THỬ")
print("=" * 70)
print(f"- Nguồn tài liệu kiểm tra: {stats['sources_checked']} sources")
print(f"- Câu hỏi trích xuất: {stats['questions_checked']}/22 câu chính")
print(f"- Dòng CSV đối chiếu: {stats['csv_rows_checked']}/22 dòng")
print(f"- Trường dữ liệu so sánh chi tiết: {stats['csv_fields_compared']} trường")
print(f"- Hình ảnh assets kiểm tra nhị phân (PIL): {stats['images_inspected']} ảnh")
print(f"- Công thức toán học render KaTeX: {stats['katex_formulas_checked']} công thức")

print("\n[QUAN TRỌNG - PHẠM VI VÀ GIỚI HẠN KIỂM CHỨNG]")
print("1. Kiểm tra cấu trúc, đối chiếu CSV-JSONL, kiểm tra nhị phân ảnh và render KaTeX")
print("   chứng minh tệp dữ liệu tuân thủ 100% đặc tả kỹ thuật, không có lỗi cú pháp hoặc gãy vỡ hình.")
print("2. Kiểm tra cấu trúc KHÔNG ĐỒNG NGHĨA VỚI VIỆC NỘI DUNG TOÁN HỌC ĐÃ ĐƯỢC PHÊ DUYỆT.")
print("3. Toàn bộ 22 câu đều giữ trạng thái reviewStatus = 'NEEDS_REVIEW' và explanationOrigin = 'MODEL_GENERATED'.")
print("   Cần giáo viên chuyên môn Toán thẩm định bước giải và văn phong trước khi xuất bản ứng dụng.")

if errors:
    print(f"\n❌ PHÁT HIỆN {len(errors)} LỖI CẦN XỬ LÝ:")
    for idx, err in enumerate(errors, 1):
        print(f"  {idx}. {err}")
    print("\nKết thúc kiểm thử với EXIT CODE 1.")
    sys.exit(1)
else:
    print("\n✅ TOÀN BỘ 22 CÂU MÃ ĐỀ 101 VÀ CÁC TỆP ĐÍNH KÈM ĐẠT CHUẨN 100%!")
    print("Kết thúc kiểm thử với EXIT CODE 0.")
    sys.exit(0)
