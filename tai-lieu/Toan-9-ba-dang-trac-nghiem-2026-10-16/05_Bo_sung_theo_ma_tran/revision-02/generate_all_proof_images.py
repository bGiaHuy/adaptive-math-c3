import csv
import os
import sys
import fitz
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'
csv_path = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'candidates.csv')
proof_dir = os.path.join(base, '05_Bo_sung_theo_ma_tran', 'revision-02', 'proofs')
os.makedirs(proof_dir, exist_ok=True)

with open(csv_path, 'r', encoding='utf-8-sig') as f:
    candidates = list(csv.DictReader(f))

slot_counts = {}
for c in candidates:
    s = int(c['slot'])
    slot_counts[s] = slot_counts.get(s, 0) + 1
    c['id'] = f"CAND-SLOT{s:02d}-{slot_counts[s]:02d}"

# Manual exact page mapping adjustments if needed
# E.g. CAND-SLOT11-01 is on p.1
# CAND-SLOT13-01 is on p.2
# CAND-SLOT20-05 is on p.8

page_overrides = {
    'CAND-SLOT11-01': 1,
    'CAND-SLOT13-01': 2,
    'CAND-SLOT20-05': 8,
}

print("Rendering high-res cropped proof images for all 52 candidates...")

proof_manifest = {}

for idx, c in enumerate(candidates, 1):
    cid = c['id']
    fn = c['filename']
    doc = fitz.open(os.path.join(base, fn))
    target_page = page_overrides.get(cid, int(c['pdfPage'])) - 1
    target_page = max(0, min(target_page, len(doc) - 1))
    
    qnum = c['questionNumber']
    sec = c['section']
    exam = c['examCode']
    
    page = doc[target_page]
    
    # Locate question header
    patterns = [f"Câu {qnum}.", f"Câu {qnum}:", f"Câu {qnum} ", f"CÂU {qnum}."]
    found_rect = None
    for pat in patterns:
        rects = page.search_for(pat)
        if rects:
            found_rect = rects[0]
            break
            
    # If not on target_page, search adjacent
    if not found_rect:
        for adj in [target_page - 1, target_page + 1]:
            if 0 <= adj < len(doc):
                for pat in patterns:
                    rects = doc[adj].search_for(pat)
                    if rects:
                        target_page = adj
                        page = doc[target_page]
                        found_rect = rects[0]
                        break
            if found_rect:
                break
                
    if not found_rect:
        # Fallback to whole page crop
        crop_rect = page.rect
    else:
        # Find next boundary
        next_qnum = int(qnum) + 1 if qnum.isdigit() else None
        next_patterns = [f"Câu {next_qnum}.", f"Câu {next_qnum}:", f"Câu {next_qnum} ", f"CÂU {next_qnum}."] if next_qnum else []
        next_rect = None
        for npat in next_patterns:
            nrects = page.search_for(npat)
            for nr in nrects:
                if nr.y0 > found_rect.y0:
                    next_rect = nr
                    break
            if next_rect:
                break
        
        # Check section boundaries
        for sec_pat in ['PHẦN II', 'PHẦN III', 'PHẦN IV', 'Lời giải', 'BẢNG ĐÁP ÁN', 'Trang ']:
            srects = page.search_for(sec_pat)
            for sr in srects:
                if sr.y0 > found_rect.y0:
                    if next_rect is None or sr.y0 < next_rect.y0:
                        next_rect = sr
                        
        y0 = max(0, found_rect.y0 - 10)
        y1 = min(page.rect.height, next_rect.y0 - 2) if next_rect else page.rect.height - 20
        # If height is too small (< 40), give reasonable height
        if y1 - y0 < 40:
            y1 = min(page.rect.height, y0 + 150)
            
        crop_rect = fitz.Rect(20, y0, page.rect.width - 20, y1)

    pix = page.get_pixmap(clip=crop_rect, dpi=200)
    img_name = f"{cid}_p{target_page+1:03d}_{exam}_{sec}_Q{qnum}.png"
    img_path = os.path.join(proof_dir, img_name)
    pix.save(img_path)
    proof_manifest[cid] = {
        'filename': img_name,
        'path': f"proofs/{img_name}",
        'page': target_page + 1,
        'width': pix.width,
        'height': pix.height
    }
    print(f"[{idx:02d}] {cid} -> {img_name} ({pix.width}x{pix.height})")

print(f"\nGenerated {len(proof_manifest)} proof images in {proof_dir}")
