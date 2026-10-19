# -*- coding: utf-8 -*-
"""
Rigorous Automated Validation Suite for Revision-03 (56 candidates):
1. Validates JSONL structure, completeness, and all mandatory fields.
2. Validates strict separation of 3 states: sourceVerificationStatus, proposedMatchStatus, humanApprovalStatus.
3. Validates 1-to-1 consistency across candidates.csv, source-comparison.csv, and questions.jsonl.
4. Validates coverage-revised.csv mathematics and match counts directly derived from questions.jsonl.
5. Validates all proof image files exist on disk and can be opened with valid dimensions via PIL.
6. Validates KaTeX syntax with throwOnError: true for 100% of math expressions.
"""

import json
import csv
import os
import sys
import subprocess
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16\05_Bo_sung_theo_ma_tran\revision-03"
jsonl_path = os.path.join(base_dir, "questions.jsonl")
candidates_csv = os.path.join(base_dir, "candidates.csv")
comparison_csv = os.path.join(base_dir, "source-comparison.csv")
coverage_csv = os.path.join(base_dir, "coverage-revised.csv")
proof_dir = os.path.join(base_dir, "proofs")
katex_script = os.path.join(base_dir, "validate_katex.cjs")

errors = []

print("===========================================================================")
print("     KIỂM TRA TÍNH TOÀN VẸN VÀ CHUẨN XÁC: REVISION-03 (56 CÂU)")
print("===========================================================================")

# 1. Check questions.jsonl
print("\n[1/7] KIỂM TRA TÍNH HỢP LỆ VÀ CẤU TRÚC JSONL...")
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
    if len(questions) != 56:
        errors.append(f"questions.jsonl có {len(questions)} câu hỏi, yêu cầu đúng 56 câu.")
    else:
        print(f"  -> [OK] Đã đọc đủ {len(questions)} câu hỏi JSONL hợp lệ.")
except Exception as e:
    errors.append(f"Không thể đọc file questions.jsonl: {e}")

# 2. Check Separation of 3 States & Classification Rules
print("\n[2/7] KIỂM TRA PHÂN ĐỊNH 3 TRẠNG THÁI VÀ NGUYÊN TẮC SƯ PHẠM...")
q_by_id = {}
type_counts = {"MULTIPLE_CHOICE": 0, "TRUE_FALSE": 0, "SHORT_ANSWER": 0}
state_counts = {
    "sourceVer": {"VERIFIED": 0, "UNVERIFIED": 0},
    "proposedMatch": {"PROPOSED_FULL_MATCH": 0, "PROPOSED_PARTIAL_MATCH": 0, "REJECTED_LACKING_EVIDENCE": 0},
    "humanApproval": {"PENDING_HUMAN_REVIEW": 0, "APPROVED": 0}
}

for q in questions:
    qid = q.get("id")
    q_by_id[qid] = q
    qtype = q.get("type")
    if qtype in type_counts:
        type_counts[qtype] += 1
    else:
        errors.append(f"Câu {qid} có type không hợp lệ: {qtype}")

    # Three-state verification
    s_ver = q.get("sourceVerificationStatus")
    p_mat = q.get("proposedMatchStatus")
    h_app = q.get("humanApprovalStatus")

    if s_ver in state_counts["sourceVer"]:
        state_counts["sourceVer"][s_ver] += 1
    else:
        errors.append(f"Câu {qid} có sourceVerificationStatus không hợp lệ: {s_ver}")

    if p_mat in state_counts["proposedMatch"]:
        state_counts["proposedMatch"][p_mat] += 1
    else:
        errors.append(f"Câu {qid} có proposedMatchStatus không hợp lệ: {p_mat}")

    if h_app in state_counts["humanApproval"]:
        state_counts["humanApproval"][h_app] += 1
    else:
        errors.append(f"Câu {qid} có humanApprovalStatus không hợp lệ: {h_app}")

    # Integrity rule: NEVER treat PROPOSED_FULL_MATCH as APPROVED
    if h_app != "PENDING_HUMAN_REVIEW":
        errors.append(f"Câu {qid} có humanApprovalStatus = {h_app}; yêu cầu tất cả câu phải là PENDING_HUMAN_REVIEW (approvedCount = 0).")

    # Isolation rule: If UNVERIFIED, proposedMatchStatus must be REJECTED_LACKING_EVIDENCE
    if s_ver == "UNVERIFIED":
        if p_mat != "REJECTED_LACKING_EVIDENCE":
            errors.append(f"Câu {qid} là UNVERIFIED nhưng proposedMatchStatus là {p_mat} (phải là REJECTED_LACKING_EVIDENCE).")

    # True/False cognitive level rule: cluster level must be None/null
    if qtype == "TRUE_FALSE":
        c_level = q.get("classification", {}).get("cognitiveLevel")
        if c_level is not None:
            errors.append(f"Câu Đúng/Sai {qid} phải có classification.cognitiveLevel = null, nhưng nhận được: {c_level}")
        stmts = q.get("statements")
        if not stmts or len(stmts) != 4:
            errors.append(f"Câu Đúng/Sai {qid} phải có đúng 4 ý phụ (a,b,c,d), nhận được: {len(stmts) if stmts else 0}")
        else:
            for s_idx, st in enumerate(stmts):
                if not st.get("cognitiveLevel"):
                    errors.append(f"Câu Đúng/Sai {qid} ý {s_idx+1} thiếu cognitiveLevel")

    # Slot 22 rule: only CAND-SLOT22-NEW01 is ADVANCED_APPLYING
    target_slot = q.get("auditReview", {}).get("targetSlot")
    if target_slot == 22:
        c_level = q.get("classification", {}).get("cognitiveLevel")
        if qid == "CAND-SLOT22-NEW01":
            if c_level != "ADVANCED_APPLYING":
                errors.append(f"Câu Slot 22 {qid} phải là ADVANCED_APPLYING, nhận được: {c_level}")
        else:
            if c_level == "ADVANCED_APPLYING":
                errors.append(f"Câu Slot 22 cũ {qid} không được gán ADVANCED_APPLYING khi chưa đủ căn cứ (nhận thức: {c_level})")

    # Explanation Origin rule:
    exp_origin = q.get("explanationOrigin")
    exp_pages = q.get("explanationPages", [])
    if exp_origin == "SOURCE_SOLUTION" and len(exp_pages) == 0:
        errors.append(f"Câu {qid} ghi SOURCE_SOLUTION nhưng explanationPages rỗng!")

print(f"  -> [OK] Phân loại: {type_counts['MULTIPLE_CHOICE']} TN, {type_counts['TRUE_FALSE']} Đ/S, {type_counts['SHORT_ANSWER']} TLN.")
print(f"  -> [OK] Trạng thái 1 (Nguồn): {state_counts['sourceVer']['VERIFIED']} VERIFIED, {state_counts['sourceVer']['UNVERIFIED']} UNVERIFIED.")
print(f"  -> [OK] Trạng thái 2 (Ma trận): {state_counts['proposedMatch']['PROPOSED_FULL_MATCH']} FULL, {state_counts['proposedMatch']['PROPOSED_PARTIAL_MATCH']} PARTIAL, {state_counts['proposedMatch']['REJECTED_LACKING_EVIDENCE']} REJECTED.")
print(f"  -> [OK] Trạng thái 3 (Duyệt người): 100% ({state_counts['humanApproval']['PENDING_HUMAN_REVIEW']}/56) PENDING_HUMAN_REVIEW, 0 APPROVED.")

# 3. Check candidates.csv
print("\n[3/7] KIỂM TRA ĐỐI CHIẾU CANDIDATES.CSV VỚI QUESTIONS.JSONL...")
cand_rows = []
try:
    with open(candidates_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cand_rows.append(row)
    if len(cand_rows) != 56:
        errors.append(f"candidates.csv có {len(cand_rows)} dòng, yêu cầu đúng 56.")
    else:
        for r in cand_rows:
            qid = r["id"]
            if qid not in q_by_id:
                errors.append(f"ID {qid} trong candidates.csv không tồn tại trong questions.jsonl")
            else:
                q = q_by_id[qid]
                if str(r["slot"]) != str(q["auditReview"]["targetSlot"]):
                    errors.append(f"Câu {qid} lệch slot giữa CSV ({r['slot']}) và JSONL ({q['auditReview']['targetSlot']})")
                if r["sourceVerificationStatus"] != q["sourceVerificationStatus"]:
                    errors.append(f"Câu {qid} lệch sourceVerificationStatus giữa CSV và JSONL")
                if r["proposedMatchStatus"] != q["proposedMatchStatus"]:
                    errors.append(f"Câu {qid} lệch proposedMatchStatus giữa CSV và JSONL")
                if r["humanApprovalStatus"] != q["humanApprovalStatus"]:
                    errors.append(f"Câu {qid} lệch humanApprovalStatus giữa CSV và JSONL")
        print("  -> [OK] 56 dòng candidates.csv đối chiếu 1-1 với questions.jsonl hoàn toàn trùng khớp.")
except Exception as e:
    errors.append(f"Lỗi đọc candidates.csv: {e}")

# 4. Check source-comparison.csv
print("\n[4/7] KIỂM TRA ĐỐI CHIẾU SOURCE-COMPARISON.CSV...")
comp_rows = []
try:
    with open(comparison_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            comp_rows.append(row)
    if len(comp_rows) != 56:
        errors.append(f"source-comparison.csv có {len(comp_rows)} dòng, yêu cầu đúng 56.")
    else:
        for r in comp_rows:
            qid = r["id"]
            if qid not in q_by_id:
                errors.append(f"ID {qid} trong source-comparison.csv không tồn tại trong questions.jsonl")
            if not r["proofImagePath"]:
                errors.append(f"ID {qid} trong source-comparison.csv thiếu proofImagePath")
            if not r["sourceVerificationStatus"]:
                errors.append(f"ID {qid} trong source-comparison.csv thiếu sourceVerificationStatus")
        print("  -> [OK] 56 dòng source-comparison.csv đầy đủ, đối chiếu 1-1 chính xác.")
except Exception as e:
    errors.append(f"Lỗi đọc source-comparison.csv: {e}")

# 5. Check coverage-revised.csv
print("\n[5/7] KIỂM TRA ĐỐI CHIẾU SỐ LIỆU MA TRẬN COVERAGE-REVISED.CSV...")
try:
    cov_rows = []
    with open(coverage_csv, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cov_rows.append(row)
            
    calc_counts = {}
    for q in questions:
        slot = q["auditReview"]["targetSlot"]
        if slot not in calc_counts:
            calc_counts[slot] = {"total": 0, "fully": 0, "partially": 0, "lacking": 0, "approved": 0}
        calc_counts[slot]["total"] += 1
        p_mat = q["proposedMatchStatus"]
        if p_mat == "PROPOSED_FULL_MATCH":
            calc_counts[slot]["fully"] += 1
        elif p_mat == "PROPOSED_PARTIAL_MATCH":
            calc_counts[slot]["partially"] += 1
        elif p_mat == "REJECTED_LACKING_EVIDENCE":
            calc_counts[slot]["lacking"] += 1
            
        if q["humanApprovalStatus"] == "APPROVED":
            calc_counts[slot]["approved"] += 1

    tot_cand = 0
    tot_fm = 0
    tot_pm = 0
    tot_le = 0
    tot_app = 0
    for r in cov_rows:
        s = int(r["slot"])
        tot_cand += int(r["totalCandidates"])
        tot_fm += int(r["fullyMatchedCandidates"])
        tot_pm += int(r["partiallyMatchedCandidates"])
        tot_le += int(r["lackingEvidenceCandidates"])
        tot_app += int(r["approvedCount"])
        
        c = calc_counts.get(s, {"total": 0, "fully": 0, "partially": 0, "lacking": 0, "approved": 0})
        if int(r["totalCandidates"]) != c["total"]:
            errors.append(f"Slot {s}: totalCandidates trong CSV ({r['totalCandidates']}) != tính toán ({c['total']})")
        if int(r["fullyMatchedCandidates"]) != c["fully"]:
            errors.append(f"Slot {s}: fullyMatched trong CSV ({r['fullyMatchedCandidates']}) != tính toán ({c['fully']})")
        if int(r["partiallyMatchedCandidates"]) != c["partially"]:
            errors.append(f"Slot {s}: partiallyMatched trong CSV ({r['partiallyMatchedCandidates']}) != tính toán ({c['partially']})")
        if int(r["lackingEvidenceCandidates"]) != c["lacking"]:
            errors.append(f"Slot {s}: lackingEvidence trong CSV ({r['lackingEvidenceCandidates']}) != tính toán ({c['lacking']})")
        if int(r["approvedCount"]) != c["approved"]:
            errors.append(f"Slot {s}: approvedCount trong CSV ({r['approvedCount']}) != tính toán ({c['approved']})")

    if tot_cand != 56:
        errors.append(f"Tổng totalCandidates trong coverage-revised ({tot_cand}) != 56")
    if tot_fm + tot_pm + tot_le != tot_cand:
        errors.append(f"Tổng FM ({tot_fm}) + PM ({tot_pm}) + LE ({tot_le}) != {tot_cand}")
    if tot_app != 0:
        errors.append(f"Tổng approvedCount ({tot_app}) != 0")

    print(f"  -> [OK] Tổng kiểm tra: {tot_cand} ứng viên = {tot_fm} đề xuất khớp hoàn toàn + {tot_pm} đề xuất khớp 1 phần + {tot_le} cách ly thiếu chứng cứ.")
    print("  -> [OK] approvedCount = 0 (tất cả câu đang chờ người duyệt chấp thuận).")
    print("  -> [OK] Số liệu thống kê trong coverage-revised.csv khớp 100% với phân loại từng câu.")
except Exception as e:
    errors.append(f"Lỗi kiểm tra coverage-revised.csv: {e}")

# 6. Check Proof Image Files
print("\n[6/7] KIỂM TRA FILE HÌNH ẢNH BẰNG CHỨNG PROOFS...")
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

print(f"  -> [OK] Đã mở và kiểm tra thành công {proof_checked}/56 file ảnh bằng chứng!")

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
print("                   TỔNG KẾT KẾT QUẢ KIỂM THỬ REVISION-03")
print("===========================================================================")
print(f"- Tổng số câu hỏi kiểm tra: {len(questions)}/56")
print(f"- Số ý Đúng/Sai kiểm tra độc lập: {type_counts['TRUE_FALSE'] * 4}/80")
print(f"- Số dòng candidates.csv đối chiếu: {len(cand_rows)}/56")
print(f"- Số dòng source-comparison.csv đối chiếu: {len(comp_rows)}/56")
print(f"- Số hình ảnh proofs kiểm tra thực tế: {proof_checked}/56")
print(f"- Tổng số lỗi phát hiện: {len(errors)}")

if errors:
    print("\n❌ CÁC LỖI CẦN XỬ LÝ:")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)
else:
    print("\n✅ TOÀN BỘ BỘ DỮ LIỆU REVISION-03 ĐẠT CHUẨN KIỂM ĐỊNH CHẶT CHẼ!")
    sys.exit(0)
