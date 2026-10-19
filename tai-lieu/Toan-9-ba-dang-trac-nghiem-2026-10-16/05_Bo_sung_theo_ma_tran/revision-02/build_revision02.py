# -*- coding: utf-8 -*-
"""
Script to build Revision-02 files:
- questions.jsonl
- candidates.csv
- source-comparison.csv
- coverage-revised.csv
"""

import json
import csv
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Import modules
import data_slot_02_10_11
import data_slot_13_14
import data_slot_15_16
import data_slot_17_20_22

base_dir = r"C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16\05_Bo_sung_theo_ma_tran\revision-02"

questions = []
questions.extend(data_slot_02_10_11.get_slot_02_questions())
questions.extend(data_slot_02_10_11.get_slot_10_questions())
questions.extend(data_slot_02_10_11.get_slot_11_questions())
questions.extend(data_slot_13_14.get_slot_13_questions())
questions.extend(data_slot_13_14.get_slot_14_questions())
questions.extend(data_slot_15_16.get_slot_15_questions())
questions.extend(data_slot_15_16.get_slot_16_questions())
questions.extend(data_slot_17_20_22.get_slot_17_questions())
questions.extend(data_slot_17_20_22.get_slot_20_questions())
questions.extend(data_slot_17_20_22.get_slot_22_questions())

print(f"Total questions loaded: {len(questions)}")
assert len(questions) == 52, f"Expected 52 questions, got {len(questions)}"

# 1. Write questions.jsonl
jsonl_path = os.path.join(base_dir, "questions.jsonl")
with open(jsonl_path, "w", encoding="utf-8") as f:
    for q in questions:
        f.write(json.dumps(q, ensure_ascii=False) + "\n")
print(f"-> Successfully written {jsonl_path}")

# 2. Write candidates.csv
candidates_csv_path = os.path.join(base_dir, "candidates.csv")
fieldnames_cand = [
    "id", "slot", "sourceId", "examCode", "section", "questionNumber",
    "pdfPage", "answerPage", "type", "topic", "primarySkillCode",
    "cognitiveLevel", "difficulty", "matchCategory", "comparisonResult",
    "duplicateGroup", "proofImage", "labelReviewStatus"
]

with open(candidates_csv_path, "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames_cand)
    writer.writeheader()
    for q in questions:
        c = q["classification"]
        audit = q["auditReview"]
        writer.writerow({
            "id": q["id"],
            "slot": audit["targetSlot"],
            "sourceId": q["sourceId"],
            "examCode": q["examCode"],
            "section": q["section"],
            "questionNumber": q["questionNumber"],
            "pdfPage": q["questionPages"][0],
            "answerPage": q["answerPages"][0] if q["answerPages"] else "",
            "type": q["type"],
            "topic": q["topic"],
            "primarySkillCode": c["primarySkillCode"],
            "cognitiveLevel": c["cognitiveLevel"] if c["cognitiveLevel"] else "null",
            "difficulty": c["difficulty"],
            "matchCategory": audit["matchCategory"],
            "comparisonResult": q["comparisonResult"],
            "duplicateGroup": audit["duplicateGroup"] if audit["duplicateGroup"] else "NONE",
            "proofImage": q["proofImage"],
            "labelReviewStatus": c["labelReviewStatus"]
        })
print(f"-> Successfully written {candidates_csv_path}")

# 3. Write source-comparison.csv
comparison_csv_path = os.path.join(base_dir, "source-comparison.csv")
fieldnames_comp = [
    "id", "slot", "sourceFile", "sourcePage", "examCode", "section",
    "questionNumber", "sourceAnswer", "proofImagePath", "comparisonResult",
    "differencesFromRevision01", "editorialNote"
]

with open(comparison_csv_path, "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames_comp)
    writer.writeheader()
    for q in questions:
        audit = q["auditReview"]
        c = q["classification"]
        ed = q.get("editorialProposal")
        ed_text = ""
        if ed:
            ed_text = ed.get("rationale", "")
            
        writer.writerow({
            "id": q["id"],
            "slot": audit["targetSlot"],
            "sourceFile": c["evidence"]["relativePath"],
            "sourcePage": q["questionPages"][0],
            "examCode": q["examCode"],
            "section": q["section"],
            "questionNumber": q["questionNumber"],
            "sourceAnswer": q.get("sourceAnswer", ""),
            "proofImagePath": q["proofImage"],
            "comparisonResult": q["comparisonResult"],
            "differencesFromRevision01": q.get("differencesFromRevision01", ""),
            "editorialNote": ed_text
        })
print(f"-> Successfully written {comparison_csv_path}")

# 4. Write coverage-revised.csv
coverage_csv_path = os.path.join(base_dir, "coverage-revised.csv")

slot_metadata = [
    (2, "Phương trình quy về bậc nhất (TN, Nhận biết)", 6, 6, 0, 0, 0, 2, "REACHED_PROVISIONAL_TARGET_GE_5", "Đạt 6 ứng viên khớp chuyên đề và mức Nhận biết sau khi khôi phục nguyên văn nguồn (2 câu trùng lặp tác giả)."),
    (10, "Tứ giác nội tiếp, đa giác đều (TN, Thông hiểu)", 6, 6, 0, 0, 0, 4, "REACHED_PROVISIONAL_TARGET_GE_5", "Đạt 6 ứng viên khớp chuyên đề và mức Thông hiểu, 100% đối chiếu chính xác từ PDF gốc."),
    (11, "Thống kê, tần số tương đối (TN, Nhận biết)", 5, 4, 0, 1, 0, 3, "BELOW_TARGET_MISSING_1", "Thu thập 5 ứng viên; 4 câu khớp chuẩn; 1 câu (CAND-SLOT11-01) là bài toán góc đồng hồ (Hình học), không phải Thống kê nên bị loại khỏi diện khớp."),
    (13, "Mô hình hóa bằng pt và hệ (Đ/S 4 ý, Thông hiểu)", 5, 0, 5, 0, 0, 5, "PENDING_TF_AGGREGATION_RULE", "5 câu Đúng/Sai có phân bố đa mức (UND-APP). cognitiveLevel câu chính để null, chưa tính khớp đủ điều kiện cho đến khi có quy tắc gộp."),
    (14, "Biến đổi căn thức (Đ/S 4 ý, Thông hiểu)", 5, 0, 3, 2, 0, 3, "PENDING_TF_AGGREGATION_RULE", "Thu thập 5 ứng viên; 3 câu Đúng/Sai hợp lệ (chờ quy tắc gộp); 2 câu không đạt (1 câu lệch sang phương trình bậc hai, 1 câu không tìm thấy trang nguồn)."),
    (15, "Quan hệ hình học đường tròn (Đ/S 4 ý, Thông hiểu)", 5, 0, 3, 2, 0, 3, "PENDING_TF_AGGREGATION_RULE", "Thu thập 5 ứng viên; 3 câu Đúng/Sai hình học hợp lệ (chờ quy tắc gộp); 2 câu không đạt (1 câu nguồn thực tế là biểu thức đại số, 1 câu không tìm thấy trang nguồn)."),
    (16, "Đọc và phân tích dữ liệu (Đ/S 4 ý, Thông hiểu)", 5, 0, 3, 2, 0, 3, "PENDING_TF_AGGREGATION_RULE", "Thu thập 5 ứng viên; 3 câu Đúng/Sai thống kê hợp lệ (chờ quy tắc gộp); 2 câu không đạt (1 câu là tìm GTNN trả lời ngắn, 1 câu không tìm thấy trang nguồn)."),
    (17, "Viète và ứng dụng (Ngắn, Vận dụng)", 5, 3, 0, 2, 0, 3, "BELOW_TARGET_MISSING_2", "Thu thập 5 ứng viên; 3 câu trả lời ngắn Viète khớp chuẩn; 2 câu không đạt (1 câu là rút gọn căn thức Đúng/Sai, 1 câu không tìm thấy trang nguồn)."),
    (20, "Diện tích, thể tích thực tiễn (Ngắn, Vận dụng)", 5, 4, 0, 1, 0, 2, "BELOW_TARGET_MISSING_1", "Thu thập 5 ứng viên; 4 câu hình khối thực tế khớp chuẩn; 1 câu không đạt (trang nguồn là hình phẳng trang trí, không phải hình khối)."),
    (22, "Hình học nội tiếp tổng hợp (Ngắn, Vận dụng cao)", 5, 0, 5, 0, 0, 3, "SHORTAGE_LEVEL_MISMATCH", "Thiếu hụt hoàn toàn: 0/5 câu đạt ADVANCED_APPLYING. Các ứng viên chỉ đạt Thông hiểu hoặc Vận dụng cơ bản, không đạt chỉ tiêu Vận dụng cao.")
]

fieldnames_cov = [
    "slot", "name", "totalCandidates", "fullyMatchedCandidates",
    "partiallyMatchedCandidates", "lackingEvidenceCandidates",
    "approvedCount", "independentSourcesCount", "targetStatus", "auditSummary"
]

with open(coverage_csv_path, "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames_cov)
    writer.writeheader()
    for row in slot_metadata:
        writer.writerow({
            "slot": row[0],
            "name": row[1],
            "totalCandidates": row[2],
            "fullyMatchedCandidates": row[3],
            "partiallyMatchedCandidates": row[4],
            "lackingEvidenceCandidates": row[5],
            "approvedCount": row[6],
            "independentSourcesCount": row[7],
            "targetStatus": row[8],
            "auditSummary": row[9]
        })
print(f"-> Successfully written {coverage_csv_path}")

print("\n--- SUMMARY OF REVISION-02 DATASET ---")
total_cand = sum(r[2] for r in slot_metadata)
fully_matched = sum(r[3] for r in slot_metadata)
partially_matched = sum(r[4] for r in slot_metadata)
lacking_evidence = sum(r[5] for r in slot_metadata)
approved_total = sum(r[6] for r in slot_metadata)

print(f"Total candidates:         {total_cand} (Target: 52)")
print(f"Fully matched candidates: {fully_matched}")
print(f"Partially matched:        {partially_matched}")
print(f"Lacking evidence:         {lacking_evidence}")
print(f"Sum check (FM + PM + LE): {fully_matched + partially_matched + lacking_evidence} == {total_cand}")
print(f"Total approved count:     {approved_total} (All remain NEEDS_REVIEW)")
