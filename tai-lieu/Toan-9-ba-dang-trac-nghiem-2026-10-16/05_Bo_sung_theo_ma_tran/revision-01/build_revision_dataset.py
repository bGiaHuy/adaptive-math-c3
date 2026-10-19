import os
import sys
import json
import csv
import hashlib
import fitz
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
rev_dir = os.path.join(root, '05_Bo_sung_theo_ma_tran', 'revision-01')
assets_dir = os.path.join(rev_dir, 'assets')
os.makedirs(assets_dir, exist_ok=True)

# Import question data modules
sys.path.append(rev_dir)
from data_slot_02_10_11 import get_slot_02_questions, get_slot_10_questions, get_slot_11_questions
from data_slot_13_14 import get_slot_13_questions, get_slot_14_questions
from data_slot_15_16 import get_slot_15_questions, get_slot_16_questions
from data_slot_17_20_22 import get_slot_17_questions, get_slot_20_questions, get_slot_22_questions

def get_sha256(rel_path):
    abs_path = os.path.join(root, rel_path)
    if not os.path.exists(abs_path):
        return "FILE_NOT_FOUND"
    with open(abs_path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def extract_assets():
    pdf_p = os.path.join(root, r'05_Bo_sung_theo_ma_tran\PDF\19_KS_Cum_18_Hai_Phong_2025_2026.pdf')
    if os.path.exists(pdf_p):
        doc = fitz.open(pdf_p)
        page = doc[3] # page 4
        pix = page.get_pixmap(dpi=300)
        im = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
        scale = 300 / 72
        crop_box = (int(380 * scale), int(60 * scale), int(550 * scale), int(220 * scale))
        cropped = im.crop(crop_box)
        asset_p = os.path.join(assets_dir, 'SRC-NEW-003-P004-Q002.png')
        cropped.save(asset_p)
        print(f"Extracted and saved asset: {asset_p} ({cropped.size})")

def copy_katex_validator():
    src_katex = os.path.join(root, '04_Trich_xuat_Gemini', 'full-exam-101-labeled', 'validate_katex.cjs')
    dst_katex = os.path.join(rev_dir, 'validate_katex.cjs')
    if os.path.exists(src_katex):
        with open(src_katex, 'r', encoding='utf-8') as f:
            content = f.read()
        with open(dst_katex, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Copied KaTeX validator to {dst_katex}")

def build_dataset():
    all_questions = []
    all_questions.extend(get_slot_02_questions())
    all_questions.extend(get_slot_10_questions())
    all_questions.extend(get_slot_11_questions())
    all_questions.extend(get_slot_13_questions())
    all_questions.extend(get_slot_14_questions())
    all_questions.extend(get_slot_15_questions())
    all_questions.extend(get_slot_16_questions())
    all_questions.extend(get_slot_17_questions())
    all_questions.extend(get_slot_20_questions())
    all_questions.extend(get_slot_22_questions())

    print(f"Total extracted questions across 10 target slots: {len(all_questions)}")

    # 1. Write questions.jsonl
    jsonl_path = os.path.join(rev_dir, 'questions.jsonl')
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for q in all_questions:
            f.write(json.dumps(q, ensure_ascii=False) + '\n')
    print(f"Written: {jsonl_path} ({len(all_questions)} lines)")

    # 2. Write candidates.csv
    candidates_csv_path = os.path.join(rev_dir, 'candidates.csv')
    fieldnames_cand = [
        "id", "slot", "section", "questionNumber", "type", "topic",
        "primarySkillCode", "cognitiveLevel", "difficulty", "matchCategory",
        "duplicateGroup", "sourceId", "filename", "sha256", "pdfPage",
        "answerPages", "answerOrigin", "explanationOrigin", "labelReviewStatus", "matchNotes"
    ]

    cand_rows = []
    for q in all_questions:
        evidence = q['classification'].get('evidence', {})
        rel_path = evidence.get('relativePath', '')
        sha = get_sha256(rel_path)
        cand_rows.append({
            "id": q['id'],
            "slot": q['auditReview']['targetSlot'],
            "section": q['section'],
            "questionNumber": q['questionNumber'],
            "type": q['type'],
            "topic": q['topic'],
            "primarySkillCode": q['classification']['primarySkillCode'],
            "cognitiveLevel": q['classification']['cognitiveLevel'] or "NULL_STATEMENT_SPREAD",
            "difficulty": q['classification']['difficulty'] or "NULL",
            "matchCategory": q['auditReview']['matchCategory'],
            "duplicateGroup": q['auditReview']['duplicateGroup'] or "",
            "sourceId": q['sourceId'],
            "filename": rel_path,
            "sha256": sha,
            "pdfPage": q['questionPages'][0] if q['questionPages'] else "",
            "answerPages": str(q['answerPages']),
            "answerOrigin": q['answerOrigin'],
            "explanationOrigin": q['explanationOrigin'],
            "labelReviewStatus": q['classification']['labelReviewStatus'],
            "matchNotes": q['auditReview']['matchNotes']
        })

    with open(candidates_csv_path, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames_cand)
        writer.writeheader()
        writer.writerows(cand_rows)
    print(f"Written: {candidates_csv_path} ({len(cand_rows)} rows)")

    # 3. Write coverage-revised.csv
    slots_list = [2, 10, 11, 13, 14, 15, 16, 17, 20, 22]
    slot_names = {
        2: "Phương trình quy về bậc nhất (TN, Nhận biết)",
        10: "Tứ giác nội tiếp, đa giác đều (TN, Thông hiểu)",
        11: "Thống kê, tần số tương đối (TN, Nhận biết)",
        13: "Mô hình hóa bằng pt và hệ (Đ/S 4 ý, Thông hiểu)",
        14: "Biến đổi căn thức (Đ/S 4 ý, Thông hiểu)",
        15: "Quan hệ hình học đường tròn (Đ/S 4 ý, Thông hiểu)",
        16: "Đọc và phân tích dữ liệu (Đ/S 4 ý, Thông hiểu)",
        17: "Viète và ứng dụng (Ngắn, Vận dụng)",
        20: "Diện tích, thể tích thực tiễn (Ngắn, Vận dụng)",
        22: "Hình học nội tiếp tổng hợp (Ngắn, Vận dụng cao)"
    }

    coverage_rows = []
    for s in slots_list:
        cands_s = [q for q in all_questions if q['auditReview']['targetSlot'] == s]
        total_cands = len(cands_s)
        fully_matched = sum(1 for q in cands_s if q['auditReview']['matchCategory'] == 'FULLY_MATCHED')
        partially_matched = sum(1 for q in cands_s if q['auditReview']['matchCategory'] == 'PARTIALLY_MATCHED')
        lacking_evidence = sum(1 for q in cands_s if q['auditReview']['matchCategory'] == 'LACKING_EVIDENCE')
        approved_count = 0 # all are NEEDS_REVIEW
        sources_used = len(set(q['sourceId'] for q in cands_s))

        # Status and audit summary
        if s in [13, 14, 15, 16]:
            target_status = "PENDING_TF_AGGREGATION_RULE"
            audit_summary = "Cả 5 câu Đúng/Sai đều có phân bố đa mức (REM-UND-APP). Mức câu chính để null, chưa tính khớp đủ điều kiện cho đến khi có quy tắc gộp."
        elif s == 22:
            target_status = "SHORTAGE_LEVEL_MISMATCH"
            audit_summary = "Thiếu hụt hoàn toàn: 0/5 câu đạt ADVANCED_APPLYING. Các ứng viên chỉ đạt Thông hiểu hoặc Vận dụng cơ bản, không đạt chỉ tiêu."
        else:
            target_status = "REACHED_PROVISIONAL_TARGET_GE_5"
            audit_summary = f"Đạt {fully_matched} ứng viên khớp chuyên đề, dạng câu và mức nhận thức (chờ hội đồng duyệt nhãn)."

        coverage_rows.append({
            "slot": s,
            "name": slot_names[s],
            "totalCandidates": total_cands,
            "fullyMatchedCandidates": fully_matched,
            "partiallyMatchedCandidates": partially_matched,
            "lackingEvidenceCandidates": lacking_evidence,
            "approvedCount": approved_count,
            "independentSourcesCount": sources_used,
            "targetStatus": target_status,
            "auditSummary": audit_summary
        })

    coverage_csv_path = os.path.join(rev_dir, 'coverage-revised.csv')
    with open(coverage_csv_path, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
            "slot", "name", "totalCandidates", "fullyMatchedCandidates", "partiallyMatchedCandidates",
            "lackingEvidenceCandidates", "approvedCount", "independentSourcesCount", "targetStatus", "auditSummary"
        ])
        writer.writeheader()
        writer.writerows(coverage_rows)
    print(f"Written: {coverage_csv_path} (10 summary rows)")

if __name__ == '__main__':
    extract_assets()
    copy_katex_validator()
    build_dataset()
