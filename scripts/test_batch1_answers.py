import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# The 27 new papers
from extract_batch1_30 import NEW_PAPERS_BATCH1

def extract_answers_from_page(doc, ans_page, code):
    """Robust extractor of SC, TF, SA answers from the answer page for given code."""
    txt = doc[ans_page - 1].get_text()
    tokens = txt.split()
    
    # 1. SC answers (12 items)
    sc = {}
    # Find code in tokens
    clean_code = code.lstrip('0')
    code_indices = [i for i, t in enumerate(tokens) if t == code or t == clean_code or t == f"0{code}"]
    if not code_indices:
        code_indices = [i for i, t in enumerate(tokens) if code in t]
        
    for idx in code_indices:
        # Check if next tokens are letters
        letters = []
        for j in range(idx + 1, min(idx + 25, len(tokens))):
            t = tokens[j].upper().strip('.,:()')
            if t in ['A', 'B', 'C', 'D']:
                letters.append(t)
            elif t.isdigit():
                continue
            else:
                break
        if len(letters) >= 12:
            sc = {q_num: l for q_num, l in enumerate(letters[:12], 1)}
            break
            
    # 2. True/False answers
    tf = {}
    for idx in code_indices:
        # Check next tokens for SD patterns or a)Đ/S
        sub_tokens = tokens[idx + 1: idx + 40]
        # Pattern 1: SDSD or SSDS
        sdsd_candidates = [t.upper().replace('Đ', 'D') for t in sub_tokens if re.match(r'^[DS]{4}$', t.upper().replace('Đ', 'D'))]
        if sdsd_candidates:
            for q_idx, pat in enumerate(sdsd_candidates[:4], 1):
                tf[q_idx] = {'a': pat[0]=='D', 'b': pat[1]=='D', 'c': pat[2]=='D', 'd': pat[3]=='D'}
            break
        # Pattern 2: a)Đ - b)S ...
        # Look in raw text
        code_pos = txt.find(code)
        if code_pos != -1:
            snippet = txt[code_pos:code_pos + 600]
            tf_lines = re.findall(r'([abcdABCD]\s*[\)\.\-]\s*[ĐDSs])', snippet)
            if len(tf_lines) >= 8:
                # 2 questions of 4 statements
                for q_idx in [1, 2]:
                    chunk = tf_lines[(q_idx-1)*4 : q_idx*4]
                    tf[q_idx] = {
                        chr(ord('a') + s_idx): ('Đ' in item or 'D' in item)
                        for s_idx, item in enumerate(chunk)
                    }
                break

    # 3. Short answers
    sa = {}
    for idx in code_indices:
        sub_tokens = tokens[idx + 1: idx + 40]
        # Look for numeric or short string tokens
        nums = []
        for t in sub_tokens:
            clean_t = t.replace(',', '.')
            if re.match(r'^-?\d+(\.\d+)?$', clean_t) and clean_t not in [code, clean_code]:
                nums.append(clean_t)
        if len(nums) >= 4:
            sa = {q_idx: val for q_idx, val in enumerate(nums[:4], 1)}
            break
            
    return sc, tf, sa

success_count = 0
for p in NEW_PAPERS_BATCH1:
    doc = fitz.open(f"outputs/thpt-300-papers/sources/{p['file']}")
    sc, tf, sa = extract_answers_from_page(doc, p['ansPage'], p['code'])
    print(f"[{p['paperId']}] Code: {p['code']} | SC: {len(sc)}/12 | TF: {len(tf)} | SA: {len(sa)}")
    if len(sc) == 12:
        success_count += 1

print(f"\nSuccessfully extracted SC 12/12 for {success_count}/{len(NEW_PAPERS_BATCH1)} papers.")
