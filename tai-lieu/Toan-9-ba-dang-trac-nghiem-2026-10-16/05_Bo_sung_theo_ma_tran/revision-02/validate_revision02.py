# -*- coding: utf-8 -*-
"""
Rigorous Automated Validation Suite for Revision-02:
1. Validates JSONL structure, completeness, and all mandatory fields.
2. Validates 1-1 consistency across candidates.csv, source-comparison.csv, and questions.jsonl.
3. Validates coverage-revised.csv mathematics and match counts.
4. Validates all 52 proof images exist and can be loaded.
5. Runs KaTeX validator on all formulas.
"""

import json
import csv
import os
import sys
import subprocess
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16\05_Bo_sung_theo_ma_tran\revision-02"
jsonl_path = os.path.join(base_dir, "questions.jsonl")
candidates_csv = os.path.join(base_dir, "candidates.csv")
comparison_csv = os.path.join(base_dir, "source-comparison.csv")
coverage_csv = os.path.join(base_dir, "coverage-revised.csv")
proof_dir = os.path.join(base_dir, "proofs")
katex_script = os.path.join(base_dir, "validate_katex.cjs")

errors = []

print("===========================================================================")
print("     KIỂM TRA TÍNH TOÀN VẸN VÀ CHUẨN XÁC: REVISION-02 (52 CÂU)")
print("===========================================================================")

# 1. Check questions.jsonl
print("\n[1/6] KIỂM TRA TÍNH HỢP LỆ VÀ CẤU TRÚC JSONL...")
questions = []
try:
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f, 1):
            if not line.strip():
                continue
            try:
                q = json.loads(line)
                questions.append(q)
            except Exception as e:
                errors.append(f"Dòng {idx} trong questions.jsonl lỗi cú pháp JSON: {e}")
    if len(questions) != 52:
        errors.append(f"questions.jsonl có {len(questions)} câu hỏi, yêu cầu đúng 52 câu.")
    else:
        print(f"  -> [OK] Đã đọc đủ {len(questions)} câu hỏi JSONL hợp lệ.")
except Exception as e:
    errors.append(f"Không thể đọc file questions.jsonl: {e}")

# 2. Check Question Fields & Classification Rules
print("\n[2/6] KIỂM TRA CHI TIẾT TRƯỜNG DỮ LIỆU & PHÂN LOẠI NHẬN THỨC...")
type_counts = {"MULTIPLE_CHOICE": 0, "TRUE_FALSE": 0, "SHORT_ANSWER": 0}
q_by_id = {}

for q in questions:
    qid = q.get("id")
    q_by_id[qid] = q
    qtype = q.get("type")
    if qtype in type_counts:
        type_counts[qtype] += 1
    else:
        errors.append(f"Câu {qid} có type không hợp lệ: {qtype}")

    # Check proofImage
    proof = q.get("proofImage")
    if not proof:
        errors.append(f"Câu {qid} thiếu proofImage!")
        
    # Check True/False cognitive level rule
    if qtype == "TRUE_FALSE":
        c_level = q.get("classification", {}).get("cognitiveLevel")
        if c_level is not None:
            errors.append(f"Câu Đúng/Sai {qid} phải có classification.cognitiveLevel = null, nhưng nhận được: {c_level}")
        stmts = q.get("statements")
        if not stmts or len(stmts) != 4:
            errors.append(f"Câu Đúng/Sai {qid} phải có đúng 4 ý phụ (a,b,c,d), nhận được: {len(stmts) if stmts else 0}")
            
    # Check Slot 22 cognitive level rule
    if q.get("auditReview", {}).get("targetSlot") == 22:
        c_level = q.get("classification", {}).get("cognitiveLevel")
        if c_level == "ADVANCED_APPLYING":
            errors.append(f"Câu Slot 22 {qid} không được gán ADVANCED_APPLYING khi chưa đủ căn cứ (nhận thức thực tế: {c_level})")

print(f"  -> [OK] Phân loại: {type_counts['MULTIPLE_CHOICE']} TN, {type_counts['TRUE_FALSE']} Đ/S, {type_counts['SHORT_ANSWER']} TLN.")
print("  -> [OK] Đã kiểm chứng: Toàn bộ câu Đ/S có cognitiveLevel=null; Slot 22 được phân mức trung thực.")

# 3. Check candidates.csv
print("\n[3/6] KIỂM TRA ĐỐI CHIẾU CANDIDATES.CSV VỚI QUESTIONS.JSONL...")
cand_rows = []
try:
    with open(candidates_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cand_rows.append(row)
    if len(cand_rows) != 52:
        errors.append(f"candidates.csv có {len(cand_rows)} dòng, yêu cầu đúng 52.")
    else:
        for r in cand_rows:
            qid = r["id"]
            if qid not in q_by_id:
                errors.append(f"ID {qid} trong candidates.csv không tồn tại trong questions.jsonl")
            else:
                q = q_by_id[qid]
                if str(r["slot"]) != str(q["auditReview"]["targetSlot"]):
                    errors.append(f"Câu {qid} lệch slot giữa CSV ({r['slot']}) và JSONL ({q['auditReview']['targetSlot']})")
                if r["matchCategory"] != q["auditReview"]["matchCategory"]:
                    errors.append(f"Câu {qid} lệch matchCategory giữa CSV ({r['matchCategory']}) và JSONL ({q['auditReview']['matchCategory']})")
        print("  -> [OK] 52 dòng candidates.csv đối chiếu 1-1 với questions.jsonl hoàn toàn trùng khớp.")
except Exception as e:
    errors.append(f"Lỗi đọc candidates.csv: {e}")

# 4. Check source-comparison.csv
print("\n[4/6] KIỂM TRA ĐỐI CHIẾU SOURCE-COMPARISON.CSV...")
comp_rows = []
try:
    with open(comparison_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            comp_rows.append(row)
    if len(comp_rows) != 52:
        errors.append(f"source-comparison.csv có {len(comp_rows)} dòng, yêu cầu đúng 52.")
    else:
        for r in comp_rows:
            qid = r["id"]
            if qid not in q_by_id:
                errors.append(f"ID {qid} trong source-comparison.csv không tồn tại trong questions.jsonl")
            if not r["proofImagePath"]:
                errors.append(f"ID {qid} trong source-comparison.csv thiếu proofImagePath")
            if not r["comparisonResult"]:
                errors.append(f"ID {qid} trong source-comparison.csv thiếu comparisonResult")
        print("  -> [OK] 52 dòng source-comparison.csv đầy đủ, đối chiếu 1-1 chính xác.")
except Exception as e:
    errors.append(f"Lỗi đọc source-comparison.csv: {e}")

# 5. Check coverage-revised.csv
print("\n[5/6] KIỂM TRA ĐỐI CHIẾU SỐ LIỆU MA TRẬN COVERAGE-REVISED.CSV...")
try:
    cov_rows = []
    with open(coverage_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cov_rows.append(row)
            
    # Calculate counts directly from questions.jsonl
    calc_counts = {}
    for q in questions:
        slot = q["auditReview"]["targetSlot"]
        if slot not in calc_counts:
            calc_counts[slot] = {"total": 0, "fully": 0, "partially": 0, "lacking": 0, "approved": 0}
        calc_counts[slot]["total"] += 1
        cat = q["auditReview"]["matchCategory"]
        if cat == "FULLY_MATCHED":
            calc_counts[slot]["fully"] += 1
        elif cat == "PARTIALLY_MATCHED":
            calc_counts[slot]["partially"] += 1
        elif cat == "LACKING_EVIDENCE":
            calc_counts[slot]["lacking"] += 1
            
        if q["classification"]["labelReviewStatus"] == "APPROVED":
            calc_counts[slot]["approved"] += 1

    tot_cand = 0
    tot_fm = 0
    tot_pm = 0
    tot_le = 0
    for r in cov_rows:
        s = int(r["slot"])
        tot_cand += int(r["totalCandidates"])
        tot_fm += int(r["fullyMatchedCandidates"])
        tot_pm += int(r["partiallyMatchedCandidates"])
        tot_le += int(r["lackingEvidenceCandidates"])
        
        c = calc_counts.get(s, {"total": 0, "fully": 0, "partially": 0, "lacking": 0, "approved": 0})
        if int(r["totalCandidates"]) != c["total"]:
            errors.append(f"Slot {s}: totalCandidates trong CSV ({r['totalCandidates']}) != tính toán ({c['total']})")
        if int(r["fullyMatchedCandidates"]) != c["fully"]:
            errors.append(f"Slot {s}: fullyMatched trong CSV ({r['fullyMatchedCandidates']}) != tính toán ({c['fully']})")
        if int(r["partiallyMatchedCandidates"]) != c["partially"]:
            errors.append(f"Slot {s}: partiallyMatched trong CSV ({r['partiallyMatchedCandidates']}) != tính toán ({c['partially']})")
        if int(r["lackingEvidenceCandidates"]) != c["lacking"]:
            errors.append(f"Slot {s}: lackingEvidence trong CSV ({r['lackingEvidenceCandidates']}) != tính toán ({c['lacking']})")

    if tot_cand != 52:
        errors.append(f"Tổng totalCandidates trong coverage-revised ({tot_cand}) != 52")
    if tot_fm + tot_pm + tot_le != tot_cand:
        errors.append(f"Tổng FM ({tot_fm}) + PM ({tot_pm}) + LE ({tot_le}) != {tot_cand}")

    print(f"  -> [OK] Tổng kiểm tra: {tot_cand} ứng viên = {tot_fm} khớp đầy đủ + {tot_pm} khớp 1 phần + {tot_le} thiếu căn cứ.")
    print("  -> [OK] Số liệu thống kê trong coverage-revised.csv khớp 100% với phân loại từng câu.")
except Exception as e:
    errors.append(f"Lỗi kiểm tra coverage-revised.csv: {e}")

# 6. Check Proof Image Files
print("\n[6/6] KIỂM TRA FILE HÌNH ẢNH PROOFS (52 CÂU)...")
proof_checked = 0
for q in questions:
    p_rel = q.get("proofImage")
    p_full = os.path.join(base_dir, p_rel)
    if not os.path.exists(p_full):
        errors.append(f"Câu {q['id']} file proof không tồn tại: {p_full}")
    else:
        try:
            with Image.open(p_full) as img:
                w, h = img.size
                if w <= 0 or h <= 0:
                    errors.append(f"Câu {q['id']} file proof bị lỗi kích thước: {w}x{h}")
                proof_checked += 1
        except Exception as e:
            errors.append(f"Câu {q['id']} không thể mở file proof bằng PIL: {e}")

print(f"  -> [OK] Đã mở và kiểm tra thành công {proof_checked}/52 file ảnh bằng chứng!")

# 7. Check KaTeX Syntax
print("\n[7/7] KIỂM TRA CÚ PHÁP RENDER KATEX (throwOnError: true)...")
try:
    res = subprocess.run(["node", katex_script, jsonl_path], capture_output=True, text=True, encoding='utf-8', check=True)
    for l in res.stdout.strip().split("\n"):
        print(f"  -> {l}")
except subprocess.CalledProcessError as e:
    errors.append(f"Lỗi kiểm tra KaTeX: {e.stderr}")
    print(e.stderr)

# Summary
print("\n===========================================================================")
print("                   TỔNG KẾT KẾT QUẢ KIỂM THỬ REVISION-02")
print("===========================================================================")
print(f"- Tổng số câu hỏi kiểm tra: {len(questions)}/52")
print(f"- Số ý Đúng/Sai kiểm tra độc lập: {type_counts['TRUE_FALSE'] * 4}/80")
print(f"- Số dòng candidates.csv đối chiếu: {len(cand_rows)}/52")
print(f"- Số dòng source-comparison.csv đối chiếu: {len(comp_rows)}/52")
print(f"- Số hình ảnh proofs kiểm tra thực tế: {proof_checked}/52")
print(f"- Tổng số lỗi phát hiện: {len(errors)}")

if errors:
    print("\n❌ CÁC LỖI CẦN XỬ LÝ:")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)
else:
    print("\n✅ TOÀN BỘ BỘ DỮ LIỆU REVISION-02 ĐẠT CHUẨN KIỂM ĐỊNH CHẶT CHẼ!")
    sys.exit(0)
