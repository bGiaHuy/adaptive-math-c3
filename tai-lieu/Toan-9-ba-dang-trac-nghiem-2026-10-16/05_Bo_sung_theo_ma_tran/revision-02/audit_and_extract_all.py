import csv
import sys
import os
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

print(f"Auditing {len(candidates)} candidates against true PDF contents...")

results = []

for idx, c in enumerate(candidates, 1):
    cid = c['id']
    slot = int(c['slot'])
    fn = c['filename']
    pdf_path = os.path.join(base, fn)
    p_num = int(c['pdfPage']) - 1 # 0-indexed
    sec = c['section']
    qnum = c['questionNumber']
    ans_p = int(c['answerPage']) if c['answerPage'] else None
    
    doc = fitz.open(pdf_path)
    
    # We will search for the question header in p_num, p_num-1, p_num+1
    search_pages = [p_num]
    if p_num > 0:
        search_pages.append(p_num - 1)
    if p_num + 1 < len(doc):
        search_pages.append(p_num + 1)
    # Also check if it's further away
    
    found_page = None
    found_rect = None
    next_rect = None
    
    header_patterns = [f"Câu {qnum}.", f"Câu {qnum}:", f"Câu {qnum} ", f"CÂU {qnum}."]
    
    # Next question pattern
    next_qnum = int(qnum) + 1 if qnum.isdigit() else None
    next_patterns = [f"Câu {next_qnum}.", f"Câu {next_qnum}:", f"Câu {next_qnum} ", f"CÂU {next_qnum}."] if next_qnum else []
    
    # First search target page
    for p in search_pages:
        page = doc[p]
        for pat in header_patterns:
            rects = page.search_for(pat)
            if rects:
                # filter rects: should be near left margin or prominent
                found_page = p
                found_rect = rects[0]
                break
        if found_page is not None:
            break
            
    # If still not found, search whole document
    if found_page is None:
        for p in range(len(doc)):
            page = doc[p]
            for pat in header_patterns:
                rects = page.search_for(pat)
                if rects:
                    found_page = p
                    found_rect = rects[0]
                    break
            if found_page is not None:
                break
                
    if found_page is None:
        print(f"[{idx:02d}] {cid}: NOT FOUND ANYWHERE IN {fn} for Q{qnum}")
        results.append({
            'candidate': c,
            'status': 'NOT_FOUND',
            'real_page': None,
            'text': '',
            'proof': None
        })
        continue

    # Find the next question or section boundary on the same page
    page = doc[found_page]
    p_text = page.get_text()
    
    # Next rect
    for npat in next_patterns:
        nrects = page.search_for(npat)
        if nrects:
            # find first that is below found_rect
            for nr in nrects:
                if nr.y0 > found_rect.y0:
                    next_rect = nr
                    break
        if next_rect:
            break
            
    # Also search for section headers like 'PHẦN II', 'PHẦN III', 'B. TỰ LUẬN', 'Lời giải'
    for sec_pat in ['PHẦN II', 'PHẦN III', 'Lời giải', 'BẢNG ĐÁP ÁN', 'Trang ']:
        srects = page.search_for(sec_pat)
        for sr in srects:
            if sr.y0 > found_rect.y0:
                if next_rect is None or sr.y0 < next_rect.y0:
                    next_rect = sr

    # Calculate crop rect
    margin = 25
    y0 = max(0, found_rect.y0 - 8)
    if next_rect:
        y1 = min(page.rect.height, next_rect.y0 - 2)
    else:
        y1 = min(page.rect.height, page.rect.height - 20)
        
    crop_rect = fitz.Rect(margin, y0, page.rect.width - margin, y1)
    
    # Render pixmap
    pix = page.get_pixmap(clip=crop_rect, dpi=200)
    proof_filename = f"{cid}_p{found_page+1:03d}_{c['examCode']}_{c['section']}_Q{qnum}.png"
    proof_path = os.path.join(proof_dir, proof_filename)
    pix.save(proof_path)
    
    # Extract text from this region
    q_text = page.get_text("text", clip=crop_rect).strip()
    
    # Check if question text is too short or cut off (e.g. spans to next page)
    # If next_rect is None and question seems incomplete
    if next_rect is None and found_page + 1 < len(doc):
        next_p = doc[found_page + 1]
        # check if next page starts directly with choices or continuation
        # e.g. A. B. C. D. or continued text
        n_text = next_p.get_text()
        # let's see if next page has next question
        if next_patterns and any(npat in n_text for npat in next_patterns):
            # next question is on next page, so part of current question might be at top of next page
            for npat in next_patterns:
                nr_list = next_p.search_for(npat)
                if nr_list:
                    top_rect = fitz.Rect(margin, 20, next_p.rect.width - margin, nr_list[0].y0 - 2)
                    top_text = next_p.get_text("text", clip=top_rect).strip()
                    if len(top_text) > 10:
                        # question spans across page! Stitch images
                        pix_top = next_p.get_pixmap(clip=top_rect, dpi=200)
                        im1 = Image.open(proof_path)
                        # save pix_top to temp
                        im2_path = os.path.join(proof_dir, f"temp_{cid}.png")
                        pix_top.save(im2_path)
                        im2 = Image.open(im2_path)
                        
                        # stitch vertically
                        stitched = Image.new('RGB', (max(im1.width, im2.width), im1.height + im2.height), (255, 255, 255))
                        stitched.paste(im1, (0, 0))
                        stitched.paste(im2, (0, im1.height))
                        stitched.save(proof_path)
                        os.remove(im2_path)
                        q_text += "\n[TRANG SAU]\n" + top_text
                        print(f"  -> SPANNED PAGE DETECTED AND STITCHED: {cid}")
                    break

    print(f"[{idx:02d}] {cid} | p.{found_page+1} | {q_text[:70].replace(chr(10), ' ')}...")
    results.append({
        'candidate': c,
        'status': 'FOUND',
        'real_page': found_page + 1,
        'text': q_text,
        'proof': proof_filename
    })

print(f"\nDone auditing {len(results)} candidates. Proof images saved in {proof_dir}")
