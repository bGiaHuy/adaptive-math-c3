import json
import os
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
orig_sources_path = os.path.join(root, '04_Trich_xuat_Gemini', 'sources.json')
rev_sources_path = os.path.join(root, '04_Trich_xuat_Gemini', 'revision-01', 'sources.json')

with open(orig_sources_path, 'r', encoding='utf-8') as f:
    orig_sources = json.load(f)

# Build a mapping of SHA-256 across all files on disk
file_hashes = {}
for r, d, files in os.walk(root):
    if '04_Trich_xuat_Gemini' in r:
        continue
    for file in files:
        if file.lower().endswith('.pdf'):
            full_p = os.path.join(r, file)
            with open(full_p, 'rb') as fp:
                h = hashlib.sha256(fp.read()).hexdigest()
            file_hashes.setdefault(h, []).append(os.path.relpath(full_p, root).replace('\\', '/'))

revised_sources = []

for s in orig_sources:
    sid = s['sourceId']
    rel_p = s['relativePath'].replace('\\', '/')
    abs_p = os.path.join(root, rel_p)
    
    # Verify file existence and hash
    if not os.path.exists(abs_p):
        raise FileNotFoundError(f"File not found: {abs_p}")
    
    with open(abs_p, 'rb') as fp:
        actual_sha256 = hashlib.sha256(fp.read()).hexdigest()
    
    actual_size = os.path.getsize(abs_p)
    
    # Check duplicates by hash
    matching_files = file_hashes.get(actual_sha256, [])
    is_dup = len(matching_files) > 1
    dup_of = [m for m in matching_files if m != rel_p] if is_dup else None

    # Base item
    item = {
        "sourceId": sid,
        "title": s.get("title"),
        "fileName": s.get("fileName"),
        "relativePath": rel_p,
        "sha256": actual_sha256,
        "isDuplicate": is_dup,
        "duplicateOf": dup_of,
        "sourceUrl": s.get("sourceUrl"),
        "pdfUrl": s.get("pdfUrl"),
        "bookSeries": s.get("bookSeries"),
        "schoolOrAuthor": s.get("schoolOrAuthor"),
        "schoolYear": s.get("schoolYear"),
        "pages": s.get("pages"),
        "fileSizeBytes": actual_size,
        "group": s.get("group"),
        "verifiedThreeTypes": s.get("verifiedThreeTypes", False),
        "metadataIssues": []
    }

    # Specific corrections per requirements
    if sid == "SRC008":
        item["schoolOrAuthor"] = "Sở GD&ĐT Hưng Yên"
        item["metadataIssues"].append("Bản ghi cũ gán nhãn tác giả 'Ban chuyên môn'; đã chuẩn hóa thành 'Sở GD&ĐT Hưng Yên' căn cứ tiêu đề đề thi.")
    elif sid == "SRC009":
        item["schoolOrAuthor"] = "Cụm chuyên môn số 24 Hải Phòng"
        item["metadataIssues"].append("Bản ghi cũ gán nhãn tác giả 'Ban chuyên môn'; đã chuẩn hóa thành 'Cụm chuyên môn số 24 Hải Phòng' căn cứ tiêu đề và nguồn đề thi.")
    elif sid == "SRC010":
        item["schoolOrAuthor"] = "Trường THCS Quán Toan – Hải Phòng"
        item["metadataIssues"].append("Bản ghi cũ gán nhãn tác giả 'Ban chuyên môn'; đã chuẩn hóa thành 'Trường THCS Quán Toan – Hải Phòng' căn cứ tiêu đề đề thi.")
    elif sid == "SRC011":
        item["schoolOrAuthor"] = "Trường THCS Tây Sơn – Đà Nẵng"
        item["verifiedThreeTypes"] = True
        item["metadataIssues"].append("Bản ghi cũ gán tác giả 'Ban chuyên môn' và verifiedThreeTypes=false do là PDF scan; đã đối chiếu trực quan bản scan trang 1 xác nhận đủ 3 dạng: nhiều lựa chọn (C1-4), đúng/sai (C5: a,b,c,d), trả lời ngắn (C6-9).")
    elif sid == "SRC012":
        item["schoolOrAuthor"] = "Trường THCS Nguyễn Văn Linh – Đà Nẵng"
        item["verifiedThreeTypes"] = True
        item["metadataIssues"].append("Bản ghi cũ gán tác giả 'Ban chuyên môn' và verifiedThreeTypes=false do là PDF scan; đã đối chiếu trực quan bản scan trang 1 xác nhận đủ 3 dạng: Phần 1 nhiều lựa chọn (C1-4), Phần 2 đúng/sai (C5: a,b,c,d), Phần 3 trả lời ngắn (C6-7).")
    elif sid == "SRC032":
        item["schoolOrAuthor"] = "Giang Sơn (Trần Lãm)"
        item["schoolYear"] = None
        item["metadataIssues"].append("Bản ghi cũ gán tác giả 'Sở GD&ĐT Hưng Yên' và schoolYear '2026-2027'; thực tế là tài liệu tham khảo biên soạn 'theo cấu trúc Hưng Yên' bởi tác giả Giang Sơn (Trần Lãm, 10/2026), không phải đề chính thức của Sở ban hành. Trường schoolYear để null do không phải năm học của một kỳ thi cụ thể.")

    revised_sources.append(item)

with open(rev_sources_path, 'w', encoding='utf-8') as f:
    json.dump(revised_sources, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {rev_sources_path} with {len(revised_sources)} sources!")
