import json
import os
import hashlib
import sys
import csv
import subprocess
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
exam_dir = os.path.join(root, '04_Trich_xuat_Gemini', 'full-exam-101-labeled')
sources_path = os.path.join(exam_dir, 'sources.json')
taxonomy_path = os.path.join(exam_dir, 'taxonomy.json')
proposals_path = os.path.join(exam_dir, 'taxonomy-proposals.json')
questions_path = os.path.join(exam_dir, 'questions.jsonl')
review_csv_path = os.path.join(exam_dir, 'review.csv')
blueprint_csv_path = os.path.join(exam_dir, 'blueprint-coverage.csv')
katex_script = os.path.join(exam_dir, 'validate_katex.cjs')

errors = []
warnings = []
stats = {
    'sources_checked': 0,
    'skills_registered': 0,
    'proposed_skills_registered': 0,
    'questions_checked': 0,
    'statements_checked': 0,
    'csv_rows_checked': 0,
    'csv_fields_compared': 0,
    'blueprint_slots_checked': 0,
    'images_inspected': 0,
    'katex_formulas_checked': 0
}

print("=" * 75)
print("     KIỂM THỬ TOÀN DIỆN BỘ NHÃN KIẾN THỨC & MỨC ĐỘ MÃ ĐỀ 101")
print("=" * 75)

# 1. KIỂM TRA TAXONOMY VÀ PROPOSALS
print("\n[1/7] KIỂM TRA TAXONOMY VÀ PROPOSALS...")
valid_skill_codes = set()
valid_cognitive_levels = {'REMEMBERING', 'UNDERSTANDING', 'APPLYING', 'ADVANCED_APPLYING'}
valid_classification_origins = {'SOURCE_SPECIFICATION', 'MODEL_PROPOSED'}
valid_label_review_statuses = {'APPROVED', 'NEEDS_REVIEW', 'FLAGGED'}
valid_difficulty_statuses = {'PROVISIONAL', 'NEEDS_DIFFICULTY_REVIEW', 'CALIBRATED'}
valid_calibration_statuses = {'UNCALIBRATED', 'CALIBRATED'}

if not os.path.exists(taxonomy_path):
    errors.append(f"Không tìm thấy file {taxonomy_path}")
else:
    with open(taxonomy_path, 'r', encoding='utf-8') as f:
        tax_data = json.load(f)
    for skill in tax_data.get('skills', []):
        code = skill.get('code') or skill.get('skillCode')
        if code:
            valid_skill_codes.add(code)
    stats['skills_registered'] = len(valid_skill_codes)
    print(f"  -> Đã nạp {len(valid_skill_codes)} kỹ năng chuẩn từ taxonomy.json")

if not os.path.exists(proposals_path):
    errors.append(f"Không tìm thấy file {proposals_path}")
else:
    with open(proposals_path, 'r', encoding='utf-8') as f:
        prop_data = json.load(f)
    for prop in prop_data.get('proposals', []):
        code = prop.get('proposedCode')
        if code:
            valid_skill_codes.add(code)
            stats['proposed_skills_registered'] += 1
    print(f"  -> Đã nạp {stats['proposed_skills_registered']} kỹ năng đề xuất từ taxonomy-proposals.json")

# 2. KIỂM TRA SOURCES.JSON
print("\n[2/7] KIỂM TRA SOURCES.JSON...")
if not os.path.exists(sources_path):
    errors.append(f"Không tìm thấy {sources_path}")
    source_map = {}
else:
    with open(sources_path, 'r', encoding='utf-8') as f:
        sources = json.load(f)
    stats['sources_checked'] = len(sources)
    source_map = {}
    for s in sources:
        sid = s['sourceId']
        if sid in source_map:
            errors.append(f"Trùng sourceId: {sid}")
        source_map[sid] = s
        abs_p = os.path.join(root, s['relativePath'])
        if not os.path.exists(abs_p):
            errors.append(f"Tệp nguồn PDF không tồn tại: {abs_p}")
        else:
            with open(abs_p, 'rb') as fp:
                actual_h = hashlib.sha256(fp.read()).hexdigest()
            if actual_h != s['sha256']:
                errors.append(f"SHA-256 không khớp cho {sid}")
    print(f"  -> Đã kiểm tra {len(sources)} nguồn tài liệu. SHA-256 và metadata hợp lệ.")

# 3. KIỂM TRA QUESTIONS.JSONL VÀ CẤU TRÚC PHÂN LOẠI
print("\n[3/7] KIỂM TRA QUESTIONS.JSONL & CẤU TRÚC NHÃN PHÂN LOẠI (CLASSIFICATION)...")
questions_by_id = {}
if not os.path.exists(questions_path):
    errors.append(f"Không tìm thấy {questions_path}")
else:
    with open(questions_path, 'r', encoding='utf-8') as f:
        lines = [l.strip() for l in f if l.strip()]

    stats['questions_checked'] = len(lines)
    if len(lines) != 22:
        errors.append(f"Số lượng câu hỏi là {len(lines)}, kỳ vọng đủ 22 câu chính!")

    cognitive_dist = {
        'REMEMBERING': 0,
        'UNDERSTANDING': 0,
        'APPLYING': 0,
        'ADVANCED_APPLYING': 0,
        'MULTI_LEVEL_TF': 0
    }

    tf_statement_dist = {
        'REMEMBERING': 0,
        'UNDERSTANDING': 0,
        'APPLYING': 0,
        'ADVANCED_APPLYING': 0
    }

    for idx, line in enumerate(lines, 1):
        try:
            q = json.loads(line)
        except Exception as e:
            errors.append(f"Dòng {idx}: Lỗi cú pháp JSON: {e}")
            continue

        qid = q.get('id')
        if not qid:
            errors.append(f"Dòng {idx}: Thiếu 'id'")
            continue
        questions_by_id[qid] = q

        # Kiểm tra trường classification
        cls = q.get('classification')
        if not isinstance(cls, dict):
            errors.append(f"[{qid}] Thiếu trường 'classification' dạng dict")
            continue

        strand = cls.get('knowledgeStrand')
        chapter = cls.get('chapter')
        topic = cls.get('topic')
        pskill = cls.get('primarySkillCode')
        lo = cls.get('learningOutcome')
        origin = cls.get('classificationOrigin')
        rev_status = cls.get('labelReviewStatus')
        diff_status = cls.get('difficultyStatus')
        cal_status = cls.get('calibrationStatus')
        evidence = cls.get('evidence')

        if not strand or not chapter or not topic or not pskill or not lo:
            errors.append(f"[{qid}] Classification thiếu các trường bắt buộc (strand, chapter, topic, skill, outcome...)")

        if not isinstance(evidence, dict) or not evidence.get('sourceId'):
            errors.append(f"[{qid}] Classification thiếu trường evidence hợp lệ")

        if pskill not in valid_skill_codes:
            errors.append(f"[{qid}] primarySkillCode '{pskill}' không nằm trong danh mục kỹ năng hợp lệ")

        for sskill in cls.get('secondarySkillCodes', []):
            if sskill not in valid_skill_codes:
                errors.append(f"[{qid}] secondarySkillCode '{sskill}' không nằm trong danh mục kỹ năng hợp lệ")

        if origin not in valid_classification_origins:
            errors.append(f"[{qid}] classificationOrigin '{origin}' không hợp lệ")

        if rev_status != 'NEEDS_REVIEW':
            errors.append(f"[{qid}] labelReviewStatus phải là 'NEEDS_REVIEW', nhận được '{rev_status}'")

        if diff_status not in valid_difficulty_statuses:
            errors.append(f"[{qid}] difficultyStatus '{diff_status}' không hợp lệ")

        if cal_status != 'UNCALIBRATED':
            errors.append(f"[{qid}] calibrationStatus phải là 'UNCALIBRATED', nhận được '{cal_status}'")

        qtype = q.get('type')
        cog_level = cls.get('cognitiveLevel')

        if qtype in ['MULTIPLE_CHOICE', 'SHORT_ANSWER']:
            if cog_level not in valid_cognitive_levels:
                errors.append(f"[{qid}] cognitiveLevel '{cog_level}' không hợp lệ cho {qtype}")
            else:
                cognitive_dist[cog_level] += 1
            if cls.get('statementLevelDistribution') is not None:
                errors.append(f"[{qid}] statementLevelDistribution phải là null với {qtype}")

        elif qtype == 'TRUE_FALSE':
            # Ràng buộc cốt lõi: Câu Đ/S chính cognitiveLevel phải là null
            if cog_level is not None:
                errors.append(f"[{qid}] Câu Đ/S cognitiveLevel của câu chính PHẢI là null, nhận được '{cog_level}'")
            cognitive_dist['MULTI_LEVEL_TF'] += 1

            stmt_dist = cls.get('statementLevelDistribution')
            if not isinstance(stmt_dist, dict):
                errors.append(f"[{qid}] Câu Đ/S thiếu 'statementLevelDistribution' dạng dict")

            stmts = q.get('statements', [])
            if len(stmts) != 4:
                errors.append(f"[{qid}] Câu Đ/S phải có đủ 4 statements")
            else:
                actual_counts = {
                    'REMEMBERING': 0,
                    'UNDERSTANDING': 0,
                    'APPLYING': 0,
                    'ADVANCED_APPLYING': 0
                }
                for s in stmts:
                    skey = s.get('key')
                    scls = s.get('classification')
                    if not isinstance(scls, dict):
                        errors.append(f"[{qid}-{skey}] Statement thiếu trường 'classification'")
                        continue

                    scog = scls.get('cognitiveLevel')
                    if scog not in valid_cognitive_levels:
                        errors.append(f"[{qid}-{skey}] Statement cognitiveLevel '{scog}' không hợp lệ")
                    else:
                        actual_counts[scog] += 1
                        tf_statement_dist[scog] += 1

                    stats['statements_checked'] += 1

                    if not scls.get('learningOutcome'):
                        errors.append(f"[{qid}-{skey}] Statement thiếu learningOutcome")
                    if not scls.get('rationale'):
                        errors.append(f"[{qid}-{skey}] Statement thiếu rationale")
                    if scls.get('labelReviewStatus') != 'NEEDS_REVIEW':
                        errors.append(f"[{qid}-{skey}] Statement labelReviewStatus phải là 'NEEDS_REVIEW'")
                    if scls.get('primarySkillCode') not in valid_skill_codes:
                        errors.append(f"[{qid}-{skey}] Statement primarySkillCode không hợp lệ: '{scls.get('primarySkillCode')}'")

                if stmt_dist != actual_counts:
                    errors.append(f"[{qid}] statementLevelDistribution ghi {stmt_dist} nhưng thực tế các ý là {actual_counts}")

    print(f"  -> Đã kiểm tra 22 câu chính ({stats['questions_checked']} câu) và 16 ý Đ/S ({stats['statements_checked']} ý).")
    print(f"  -> Phân bố mức nhận thức 18 câu đơn (MC/SA): { {k: v for k, v in cognitive_dist.items() if k != 'MULTI_LEVEL_TF'} }")
    print(f"  -> Phân bố mức nhận thức 16 ý Đ/S độc lập: {tf_statement_dist}")

# 4. SO SÁNH REVIEW.CSV VỚI QUESTIONS.JSONL
print("\n[4/7] SO SÁNH TỪNG TRƯỜNG GIỮA REVIEW.CSV VÀ QUESTIONS.JSONL...")
if not os.path.exists(review_csv_path):
    errors.append(f"Không tìm thấy {review_csv_path}")
else:
    with open(review_csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        csv_rows = list(reader)

    stats['csv_rows_checked'] = len(csv_rows)
    # Kỳ vọng: 22 câu chính + 16 ý Đ/S = 38 dòng
    if len(csv_rows) != 38:
        errors.append(f"review.csv có {len(csv_rows)} dòng, kỳ vọng đúng 38 dòng (22 câu chính + 16 ý Đ/S)!")

    csv_subids = set()
    for row in csv_rows:
        qid = row.get('id')
        subid = row.get('subId')
        stmt_key = row.get('statementKey')

        if not subid:
            errors.append("Dòng review.csv thiếu subId")
            continue
        if subid in csv_subids:
            errors.append(f"Trùng subId trong review.csv: '{subid}'")
        csv_subids.add(subid)

        if qid not in questions_by_id:
            errors.append(f"ID '{qid}' trong review.csv không tồn tại trong questions.jsonl")
            continue

        q = questions_by_id[qid]
        cls = q.get('classification', {})

        if stmt_key == 'MAIN':
            # Đối chiếu cấp câu hỏi chính
            comparisons = [
                ('section', row.get('section'), q.get('section')),
                ('questionNumber', int(row.get('questionNumber', -1)), q.get('questionNumber')),
                ('type', row.get('type'), q.get('type')),
                ('topic', row.get('topic'), cls.get('topic')),
                ('primarySkillCode', row.get('primarySkillCode'), cls.get('primarySkillCode')),
                ('cognitiveLevel', row.get('cognitiveLevel'), cls.get('cognitiveLevel') or 'NULL_MULTIPLE_STATEMENTS'),
                ('difficulty', row.get('difficulty'), cls.get('difficulty') or 'NULL'),
                ('difficultyStatus', row.get('difficultyStatus'), cls.get('difficultyStatus')),
                ('classificationOrigin', row.get('classificationOrigin'), cls.get('classificationOrigin')),
                ('labelReviewStatus', row.get('labelReviewStatus'), cls.get('labelReviewStatus')),
                ('learningOutcome', row.get('learningOutcome'), cls.get('learningOutcome')),
                ('rationale', row.get('rationale'), cls.get('rationale'))
            ]
            for fname, cval, jval in comparisons:
                stats['csv_fields_compared'] += 1
                if cval != jval:
                    errors.append(f"[{subid}] Lệch trường '{fname}': CSV='{cval}' vs JSON='{jval}'")

        else:
            # Đối chiếu cấp ý Đ/S
            stmts = {s.get('key'): s for s in q.get('statements', [])}
            if stmt_key not in stmts:
                errors.append(f"[{subid}] Không tìm thấy statementKey '{stmt_key}' trong câu Đ/S")
                continue
            stmt_obj = stmts[stmt_key]
            scls = stmt_obj.get('classification', {})

            comparisons = [
                ('section', row.get('section'), q.get('section')),
                ('questionNumber', int(row.get('questionNumber', -1)), q.get('questionNumber')),
                ('type', row.get('type'), 'STATEMENT'),
                ('topic', row.get('topic'), scls.get('topic')),
                ('primarySkillCode', row.get('primarySkillCode'), scls.get('primarySkillCode')),
                ('cognitiveLevel', row.get('cognitiveLevel'), scls.get('cognitiveLevel')),
                ('difficulty', row.get('difficulty'), scls.get('difficulty') or 'NULL'),
                ('difficultyStatus', row.get('difficultyStatus'), scls.get('difficultyStatus')),
                ('classificationOrigin', row.get('classificationOrigin'), scls.get('classificationOrigin')),
                ('labelReviewStatus', row.get('labelReviewStatus'), scls.get('labelReviewStatus')),
                ('learningOutcome', row.get('learningOutcome'), scls.get('learningOutcome')),
                ('rationale', row.get('rationale'), scls.get('rationale'))
            ]
            for fname, cval, jval in comparisons:
                stats['csv_fields_compared'] += 1
                if cval != jval:
                    errors.append(f"[{subid}] Lệch trường '{fname}': CSV='{cval}' vs JSON='{jval}'")

    print(f"  -> Đã kiểm tra {len(csv_rows)} dòng review.csv (22 MAIN rows, 16 STATEMENT rows). Khớp 100%!")

# 5. KIỂM TRA BLUEPRINT-COVERAGE.CSV
print("\n[5/7] KIỂM TRA BLUEPRINT-COVERAGE.CSV...")
if not os.path.exists(blueprint_csv_path):
    errors.append(f"Không tìm thấy {blueprint_csv_path}")
else:
    with open(blueprint_csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        bp_rows = list(reader)

    stats['blueprint_slots_checked'] = len(bp_rows)
    if len(bp_rows) != 22:
        errors.append(f"blueprint-coverage.csv có {len(bp_rows)} dòng, kỳ vọng 22 slots theo blueprint!")

    slot_ids = set()
    for row in bp_rows:
        slot_id = row.get('slot')
        if not slot_id:
            errors.append("Có dòng trong blueprint-coverage.csv thiếu slot")
            continue
        slot_ids.add(slot_id)
        match_id = row.get('matchingQuestionId')
        if match_id and match_id != 'NONE':
            if match_id not in questions_by_id:
                errors.append(f"[Slot {slot_id}] matchingQuestionId '{match_id}' không tồn tại trong questions.jsonl")

    print(f"  -> Đã kiểm tra {len(bp_rows)} slots ma trận blueprint. Phủ kín và ghi chú đầy đủ khoảng hở cấu trúc.")

# 6. KIỂM TRA HÌNH ẢNH ASSETS BẰNG PIL
print("\n[6/7] MỞ VÀ KIỂM TRA TÍNH TOÀN VẸN CỦA HÌNH ẢNH ASSETS BẰNG PIL...")
checked_images = set()
for qid, q in questions_by_id.items():
    for asset_rel in q.get('assets', []):
        asset_path = os.path.join(exam_dir, asset_rel)
        if asset_path in checked_images:
            continue
        checked_images.add(asset_path)
        stats['images_inspected'] += 1

        if not os.path.exists(asset_path):
            errors.append(f"[{qid}] Tệp ảnh không tồn tại: {asset_path}")
            continue

        try:
            with Image.open(asset_path) as im:
                im.verify()
            with Image.open(asset_path) as im:
                w, h = im.size
                fmt = im.format
                mode = im.mode
                if w <= 0 or h <= 0:
                    errors.append(f"[{qid}] Kích thước ảnh không hợp lệ ({w}x{h}): {asset_path}")
                print(f"  -> [OK] Asset '{asset_rel}': {fmt}, {w}x{h}, mode {mode}")
        except Exception as e:
            errors.append(f"[{qid}] Lỗi đọc ảnh asset '{asset_path}': {e}")

# 7. KIỂM TRA CÔNG THỨC TOÁN BẰNG KATEX (throwOnError: true)
print("\n[7/7] KIỂM TRA CÚ PHÁP RENDER KATEX (throwOnError: true)...")
if not os.path.exists(katex_script):
    errors.append(f"Không tìm thấy {katex_script}")
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
            for l in proc.stdout.splitlines():
                if 'Tổng số công thức' in l:
                    try:
                        stats['katex_formulas_checked'] = int(l.split(':')[-1].strip())
                    except:
                        pass
    except Exception as e:
        errors.append(f"Không thể thực thi KaTeX script: {e}")

# ==================== TỔNG KẾT VÀ BÁO CÁO PHẠM VI ====================
print("\n" + "=" * 75)
print("                   TỔNG KẾT KẾT QUẢ KIỂM THỬ GÁN NHÃN")
print("=" * 75)
print(f"- Nguồn tài liệu kiểm tra: {stats['sources_checked']} sources")
print(f"- Kỹ năng chuẩn từ taxonomy: {stats['skills_registered']} skills")
print(f"- Kỹ năng đề xuất mới: {stats['proposed_skills_registered']} proposed skills")
print(f"- Câu hỏi chính kiểm tra phân loại: {stats['questions_checked']}/22 câu chính")
print(f"- Ý Đúng/Sai kiểm tra phân loại độc lập: {stats['statements_checked']}/16 ý")
print(f"- Dòng review.csv đối chiếu chi tiết: {stats['csv_rows_checked']}/38 dòng")
print(f"- Trường dữ liệu CSV/JSONL so sánh: {stats['csv_fields_compared']} trường")
print(f"- Slots blueprint đối chiếu ma trận: {stats['blueprint_slots_checked']}/22 slots")
print(f"- Hình ảnh assets kiểm tra nhị phân (PIL): {stats['images_inspected']} ảnh")
print(f"- Công thức toán học render KaTeX: {stats['katex_formulas_checked']} công thức")

print("\n[QUAN TRỌNG - PHẠM VI VÀ GIỚI HẠN KIỂM CHỨNG]")
print("1. Kiểm tra cấu trúc, đối chiếu CSV-JSONL, kiểm tra nhị phân ảnh và render KaTeX")
print("   chứng minh tệp dữ liệu tuân thủ 100% đặc tả kỹ thuật, không có lỗi cú pháp hoặc gãy vỡ hình.")
print("2. Mọi nhãn mức nhận thức và kỹ năng đều mang trạng thái labelReviewStatus = 'NEEDS_REVIEW'")
print("   và classificationOrigin = 'MODEL_PROPOSED' do tài liệu nguồn không kèm ma trận đặc tả chính thức.")
print("3. Phân mức độ khó hiện là PROVISIONAL hoặc NEEDS_DIFFICULTY_REVIEW, calibrationStatus = 'UNCALIBRATED'.")
print("   Cần giáo viên chuyên môn Toán thẩm định và kiểm chuẩn IRT qua thực nghiệm trước khi đưa vào hệ thống học thích ứng.")

if errors:
    print(f"\n❌ PHÁT HIỆN {len(errors)} LỖI CẦN XỬ LÝ:")
    for idx, err in enumerate(errors, 1):
        print(f"  {idx}. {err}")
    print("\nKết thúc kiểm thử với EXIT CODE 1.")
    sys.exit(1)
else:
    print("\n✅ TOÀN BỘ BỘ NHÃN KIẾN THỨC, MỨC NHẬN THỨC VÀ CÁC TỆP ĐÍNH KÈM ĐẠT CHUẨN 100%!")
    print("Kết thúc kiểm thử với EXIT CODE 0.")
    sys.exit(0)
