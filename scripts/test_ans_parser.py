import json
import fitz
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def parse_answer_page(doc, ans_page_num, target_code):
    """
    Parses the answer page of an exam PDF for the specified target exam code.
    Returns:
      sc_answers: {1: 'A', 2: 'B', ...}
      tf_answers: {1: {'a': True, 'b': False, ...}, ...}
      sa_answers: {1: '123', 2: '4.5', ...}
    """
    if ans_page_num is None or ans_page_num > len(doc):
        return None, None, None
        
    txt = doc[ans_page_num - 1].get_text()
    
    # 1. Parse Part I (Single choice 1-12)
    sc_answers = {}
    lines = [l.strip() for l in txt.split('\n') if l.strip()]
    
    # Look for code row in grid
    # Target code might be 101, 1001, 0101, 132, etc.
    # Often a line has the code, followed by 12 letters A/B/C/D
    # Or in tabular format where lines are tokenized
    tokens = txt.split()
    for i, tok in enumerate(tokens):
        if tok == str(target_code) or tok == f"0{target_code}" or (target_code in tok and len(tok) <= len(str(target_code)) + 2):
            # Check if next 12 tokens are letters A, B, C, D
            candidate_letters = []
            for j in range(i + 1, min(i + 25, len(tokens))):
                val = tokens[j].upper().strip('.:,')
                if val in ['A', 'B', 'C', 'D']:
                    candidate_letters.append(val)
                elif val.isdigit():
                    continue # might be question numbers interleaved
                else:
                    break
            if len(candidate_letters) >= 12:
                for q_num, letter in enumerate(candidate_letters[:12], 1):
                    sc_answers[q_num] = letter
                break

    # 2. Parse Part II (True/False)
    # Often SDSD, DSSD or a: Đ, b: S, etc.
    tf_answers = {}
    tf_tokens = re.findall(r'(?:Câu\s*(\d+)[:\s]+)?([ĐD|S|T|F]{4})', txt, re.IGNORECASE)
    # Alternatively find SDSD patterns near the code
    if str(target_code) in txt:
        code_pos = txt.find(str(target_code))
        sub = txt[code_pos:code_pos + 400]
        sdsd_matches = re.findall(r'\b([DS]{4})\b', sub.replace('Đ', 'D'))
        for idx, pattern in enumerate(sdsd_matches[:4], 1):
            tf_answers[idx] = {
                'a': pattern[0] == 'D',
                'b': pattern[1] == 'D',
                'c': pattern[2] == 'D',
                'd': pattern[3] == 'D'
            }

    # 3. Parse Part III (Short answers)
    sa_answers = {}
    # Often numbers following the True/False answers in the table
    # Look for table section or explicit values
    
    return sc_answers, tf_answers, sa_answers

# Test on THPT-10-CUOI_HK1-028 (Mã đề 1001, Ans page 7)
doc = fitz.open('outputs/thpt-300-papers/sources/THPT-10-CUOI_HK1-028.pdf')
sc, tf, sa = parse_answer_page(doc, 7, '1001')
print("THPT-10-CUOI_HK1-028 SC:", sc)
print("THPT-10-CUOI_HK1-028 TF:", tf)
