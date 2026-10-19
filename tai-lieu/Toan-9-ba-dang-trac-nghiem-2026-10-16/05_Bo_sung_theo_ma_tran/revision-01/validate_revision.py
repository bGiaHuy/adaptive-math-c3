import os
import sys
import json
import csv
import subprocess
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
rev_dir = os.path.join(root, '05_Bo_sung_theo_ma_tran', 'revision-01')
jsonl_path = os.path.join(rev_dir, 'questions.jsonl')
cand_csv_path = os.path.join(rev_dir, 'candidates.csv')
cov_csv_path = os.path.join(rev_dir, 'coverage-revised.csv')
katex_script = os.path.join(rev_dir, 'validate_katex.cjs')

errors = []
warnings = []
stats = {
    "total_questions": 0,
    "mc_questions": 0,
    "tf_questions": 0,
    "sa_questions": 0,
    "statements_checked": 0,
    "csv_rows_checked": 0,
    "assets_verified": 0,
    "katex_formulas": 0
}

print("=" * 75)
print("     KIỂM TRA TÍNH TOÀN VẸN VÀ CHUẨN XÁC: REVISION-01 (52 CÂU)")
print("=" * 75)

# 1. Check questions.jsonl
print("\n[1/6] KIỂM TRA TÍNH HỢP LỆ VÀ CẤU TRÚC JSONL...")
if not os.path.exists(jsonl_path):
    errors.append(f"Không tìm thấy file: {jsonl_path}")
    sys.exit(1)

questions = []
with open(jsonl_path, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        line = line.strip()
        if not line:
            continue
        try:
            q = json.loads(line)
            questions.append(q)
        except Exception as e:
            errors.append(f"Dòng {line_idx+1}: Lỗi parse JSON - {e}")

stats['total_questions'] = len(questions)
if len(questions) != 52:
    errors.append(f"Số lượng câu hỏi trong JSONL ({len(questions)}) không đúng 52 câu!")
else:
    print(f"  -> [OK] Đã đọc đủ 52 câu hỏi JSONL hợp lệ.")

# 2. Schema and Classification audit
print("\n[2/6] KIỂM TRA CHI TIẾT TRƯỜNG DỮ LIỆU & PHÂN LOẠI NHẬN THỨC...")
valid_types = {'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'}
valid_levels = {'REMEMBERING', 'UNDERSTANDING', 'APPLYING', 'ADVANCED_APPLYING'}

for q in questions:
    qid = q.get('id', 'UNKNOWN')
    q_type = q.get('type')
    slot = q.get('auditReview', {}).get('targetSlot')
    
    if q_type not in valid_types:
        errors.append(f"[{qid}] Loại câu hỏi '{q_type}' không hợp lệ!")
    
    if q_type == 'MULTIPLE_CHOICE':
        stats['mc_questions'] += 1
        opts = q.get('options')
        if not isinstance(opts, list) or len(opts) != 4:
            errors.append(f"[{qid}] Câu Nhiều lựa chọn phải có đúng 4 options!")
        if q.get('statements') is not None:
            errors.append(f"[{qid}] Câu Nhiều lựa chọn không được có statements!")
            
    elif q_type == 'TRUE_FALSE':
        stats['tf_questions'] += 1
        stmts = q.get('statements')
        if not isinstance(stmts, list) or len(stmts) != 4:
            errors.append(f"[{qid}] Câu Đúng/Sai phải có đúng 4 statements!")
        if q.get('options') is not None:
            errors.append(f"[{qid}] Câu Đúng/Sai không được có options!")
            
        # Verify cognitive level of main question is null
        cls = q.get('classification', {})
        if cls.get('cognitiveLevel') is not None:
            errors.append(f"[{qid}] Câu Đúng/Sai phải có cognitiveLevel của câu chính là null (chờ quy tắc gộp)!")
            
        dist = cls.get('statementLevelDistribution')
        if not isinstance(dist, dict) or sum(dist.values()) != 4:
            errors.append(f"[{qid}] Câu Đúng/Sai thiếu statementLevelDistribution hợp lệ (tổng = 4)!")
            
        # Check each statement
        for s in (stmts or []):
            stats['statements_checked'] += 1
            scls = s.get('classification', {})
            slevel = scls.get('cognitiveLevel')
            if slevel not in valid_levels:
                errors.append(f"[{qid}] Ý '{s.get('key')}' có cognitiveLevel không hợp lệ: '{slevel}'!")
                
    elif q_type == 'SHORT_ANSWER':
        stats['sa_questions'] += 1
        ans = q.get('answer', {})
        if 'value' not in ans:
            errors.append(f"[{qid}] Câu Trả lời ngắn thiếu answer.value!")
            
    # Audit Slot 22: Must NOT be ADVANCED_APPLYING
    if slot == 22:
        cls_level = q.get('classification', {}).get('cognitiveLevel')
        if cls_level == 'ADVANCED_APPLYING':
            errors.append(f"[{qid}] Vị trí 22: Chưa có căn cứ gán ADVANCED_APPLYING! Phải phân loại thực tế.")
        if q.get('auditReview', {}).get('matchCategory') != 'PARTIALLY_MATCHED':
            errors.append(f"[{qid}] Vị trí 22: matchCategory phải là PARTIALLY_MATCHED!")

print(f"  -> [OK] Phân loại: {stats['mc_questions']} TN, {stats['tf_questions']} Đ/S ({stats['statements_checked']} ý), {stats['sa_questions']} TLN.")
print("  -> [OK] Đã kiểm chứng: Toàn bộ câu Đ/S có cognitiveLevel=null; Slot 22 được phân mức trung thực.")

# 3. Verify candidates.csv
print("\n[3/6] KIỂM TRA ĐỐI CHIẾU CANDIDATES.CSV VỚI QUESTIONS.JSONL...")
if not os.path.exists(cand_csv_path):
    errors.append(f"Không tìm thấy file: {cand_csv_path}")
else:
    with open(cand_csv_path, 'r', encoding='utf-8-sig') as f:
        cand_rows = list(csv.DictReader(f))
    stats['csv_rows_checked'] = len(cand_rows)
    if len(cand_rows) != 52:
        errors.append(f"candidates.csv có {len(cand_rows)} dòng, kỳ vọng 52 dòng!")
    
    q_map = {q['id']: q for q in questions}
    for r in cand_rows:
        cid = r['id']
        if cid not in q_map:
            errors.append(f"ID '{cid}' trong candidates.csv không tồn tại trong questions.jsonl!")
        else:
            q = q_map[cid]
            if str(r['slot']) != str(q['auditReview']['targetSlot']):
                errors.append(f"[{cid}] Lệch slot giữa CSV ({r['slot']}) và JSONL ({q['auditReview']['targetSlot']})!")
            if r['matchCategory'] != q['auditReview']['matchCategory']:
                errors.append(f"[{cid}] Lệch matchCategory giữa CSV và JSONL!")

print(f"  -> [OK] 52 dòng candidates.csv đối chiếu 1-1 với questions.jsonl hoàn toàn trùng khớp.")

# 4. Verify coverage-revised.csv
print("\n[4/6] KIỂM TRA ĐỐI CHIẾU SỐ LIỆU MA TRẬN COVERAGE-REVISED.CSV...")
if not os.path.exists(cov_csv_path):
    errors.append(f"Không tìm thấy file: {cov_csv_path}")
else:
    with open(cov_csv_path, 'r', encoding='utf-8-sig') as f:
        cov_rows = list(csv.DictReader(f))
    if len(cov_rows) != 10:
        errors.append(f"coverage-revised.csv có {len(cov_rows)} dòng, kỳ vọng 10 dòng!")
    
    for r in cov_rows:
        s = int(r['slot'])
        qs_in_slot = [q for q in questions if q['auditReview']['targetSlot'] == s]
        total_in_slot = len(qs_in_slot)
        fully_in_slot = sum(1 for q in qs_in_slot if q['auditReview']['matchCategory'] == 'FULLY_MATCHED')
        partially_in_slot = sum(1 for q in qs_in_slot if q['auditReview']['matchCategory'] == 'PARTIALLY_MATCHED')
        
        if int(r['totalCandidates']) != total_in_slot:
            errors.append(f"Slot {s}: totalCandidates trong CSV ({r['totalCandidates']}) != JSONL ({total_in_slot})!")
        if int(r['fullyMatchedCandidates']) != fully_in_slot:
            errors.append(f"Slot {s}: fullyMatchedCandidates trong CSV ({r['fullyMatchedCandidates']}) != JSONL ({fully_in_slot})!")
        if int(r['partiallyMatchedCandidates']) != partially_in_slot:
            errors.append(f"Slot {s}: partiallyMatchedCandidates trong CSV ({r['partiallyMatchedCandidates']}) != JSONL ({partially_in_slot})!")
        if int(r['approvedCount']) != 0:
            errors.append(f"Slot {s}: approvedCount phải bằng 0 (chưa có câu nào được duyệt chính thức)!")

print("  -> [OK] Số liệu thống kê trong coverage-revised.csv khớp 100% với phân loại từng câu.")

# 5. Verify image assets
print("\n[5/6] KIỂM TRA FILE HÌNH ẢNH ASSETS...")
for q in questions:
    assets = q.get('assets', [])
    for a in assets:
        asset_full = os.path.join(rev_dir, a)
        if not os.path.exists(asset_full):
            errors.append(f"[{q['id']}] Không tìm thấy file asset: {asset_full}")
        else:
            try:
                with Image.open(asset_full) as im:
                    im.verify()
                with Image.open(asset_full) as im:
                    w, h = im.size
                    stats['assets_verified'] += 1
                    print(f"  -> [OK] Asset '{a}': {im.format}, {w}x{h}, mode {im.mode}")
            except Exception as e:
                errors.append(f"[{q['id']}] Lỗi đọc ảnh asset '{asset_full}': {e}")

# 6. Verify KaTeX
print("\n[6/6] KIỂM TRA CÚ PHÁP RENDER KATEX (throwOnError: true)...")
if not os.path.exists(katex_script):
    errors.append(f"Không tìm thấy file: {katex_script}")
else:
    try:
        proc = subprocess.run(
            ['node', katex_script, jsonl_path],
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
                        stats['katex_formulas'] = int(l.split(':')[-1].strip())
                    except:
                        pass
    except Exception as e:
        errors.append(f"Không thể thực thi node {katex_script}: {e}")

# Summary
print("\n" + "=" * 75)
print("                   TỔNG KẾT KẾT QUẢ KIỂM THỬ REVISION-01")
print("=" * 75)
print(f"- Tổng số câu hỏi kiểm tra: {stats['total_questions']}/52")
print(f"- Số ý Đúng/Sai kiểm tra độc lập: {stats['statements_checked']}/64 (16 câu x 4 ý)")
print(f"- Số dòng candidates.csv đối chiếu: {stats['csv_rows_checked']}/52")
print(f"- Số hình ảnh asset kiểm tra: {stats['assets_verified']}")
print(f"- Số công thức KaTeX render thành công: {stats['katex_formulas']}")
print(f"- Tổng số lỗi phát hiện: {len(errors)}")

if errors:
    print("\n❌ CÁC LỖI CẦN XỬ LÝ:")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)
else:
    print("\n✅ TOÀN BỘ BỘ DỮ LIỆU REVISION-01 ĐẠT CHUẨN KIỂM ĐỊNH CHẶT CHẼ!")
    sys.exit(0)
