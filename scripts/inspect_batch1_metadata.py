import json
import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# The 30 papers selected for Batch 1 (10 per grade)
BATCH1_FILES = [
    # Grade 10
    'THPT-10-CUOI_HK1-026.pdf',
    'THPT-10-CUOI_HK1-028.pdf',
    'THPT-10-CUOI_HK1-035.pdf',
    'THPT-10-CUOI_HK1-041.pdf',
    'THPT-10-CUOI_HK1-042.pdf',
    'THPT-10-CUOI_HK1-045.pdf',
    'THPT-10-CUOI_HK1-048.pdf',
    'THPT-10-CUOI_HK2-076.pdf',
    'THPT-10-CUOI_HK2-079.pdf',
    'THPT-10-CUOI_HK2-084.pdf',
    # Grade 11
    'THPT-11-CUOI_HK1-126.pdf',
    'THPT-11-CUOI_HK1-127.pdf',
    'THPT-11-CUOI_HK1-129.pdf',
    'THPT-11-CUOI_HK1-136.pdf',
    'THPT-11-CUOI_HK1-137.pdf',
    'THPT-11-CUOI_HK1-138.pdf',
    'THPT-11-CUOI_HK1-139.pdf',
    'THPT-11-CUOI_HK1-141.pdf',
    'THPT-11-CUOI_HK1-147.pdf',
    'THPT-11-CUOI_HK2-176.pdf',
    # Grade 12
    'THPT-12-CUOI_HK1-227.pdf',
    'THPT-12-CUOI_HK1-228.pdf',
    'THPT-12-CUOI_HK1-235.pdf',
    'THPT-12-CUOI_HK1-236.pdf',
    'THPT-12-CUOI_HK1-241.pdf',
    'THPT-12-CUOI_HK1-247.pdf',
    'THPT-12-CUOI_HK2-281.pdf',
    'THPT-12-GIUA_HK1-206.pdf',
    'THPT-12-GIUA_HK1-208.pdf',
    'THPT-12-GIUA_HK1-225.pdf'
]

papers_meta = json.load(open('outputs/thpt-300-papers/papers.json', encoding='utf-8'))
meta_by_id = {p['paperId']: p for p in papers_meta}

results = []
for fname in BATCH1_FILES:
    pid = fname.replace('.pdf', '')
    p_meta = meta_by_id.get(pid, {})
    doc = fitz.open(f"outputs/thpt-300-papers/sources/{fname}")
    
    # Scan first 2 pages for exam code and school
    txt_first = doc[0].get_text() + "\n" + (doc[1].get_text() if len(doc) > 1 else "")
    code_match = re.search(r'Mã\s+đề(?:\s+thi)?[:\s]+([A-Za-z0-9]+)', txt_first, re.IGNORECASE)
    code = code_match.group(1) if code_match else "CHÍNH THỨC"
    
    # Find answer page
    ans_page = None
    for p_idx, page in enumerate(doc):
        ptxt = page.get_text()
        if any(w in ptxt.upper() for w in ['BẢNG ĐÁP ÁN', 'HƯỚNG DẪN CHẤM', 'ĐÁP ÁN VÀ THANG ĐIỂM', 'ĐÁP ÁN TRẮC NGHIỆM']):
            ans_page = p_idx + 1
            break
            
    results.append({
        'paperId': pid,
        'file': fname,
        'grade': p_meta.get('grade'),
        'school': p_meta.get('examHeader', {}).get('schoolOrDepartment', ''),
        'title': p_meta.get('title', ''),
        'totalPages': len(doc),
        'code': code,
        'ansPage': ans_page
    })

print(f"Scanned {len(results)} Batch 1 papers:")
for r in results:
    print(f"[{r['paperId']}] Gr {r['grade']} | Code: {r['code']} | AnsP: {r['ansPage']}/{r['totalPages']} | {r['school'][:35]}")
