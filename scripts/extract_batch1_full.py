import fitz
import sys
import json
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

# Strict extraction rules:
# 1. NO dummy fallbacks (NO "Phương án A/B/C/D", NO "Khẳng định (a)...", NO generic prompt texts).
# 2. If a question cannot be cleanly parsed from the real PDF text, set status to EXTRACTION_FAILED or NEEDS_REVIEW.
# 3. All reviewStatus crosschecked flags MUST be set to False if extraction is incomplete or unverified.
# 4. import-candidates.jsonl MUST strictly remain 0 items.

OUT_DIR = 'outputs/thpt-300-papers'

def parse_pdf_strict(doc, q_pages, spec):
    """
    Strict parser: extracts questions from PDF pages.
    Returns list of items. If any item is incomplete, it is marked NEEDS_REVIEW and has flags False.
    """
    raw_text = ""
    page_map = {}
    for p in q_pages:
        txt = doc[p - 1].get_text()
        raw_text += f"\n[PAGE_{p}]\n" + txt
        page_map[p] = txt

    parsed_items = []
    
    # Check for Single Choice questions
    for i in range(1, 13):
        pat = rf'Câu\s+{i}[\.\:](.+?)(?=Câu\s+{i+1}[\.\:]|PHẦN\s+II|PHẦN\s+2|$)'
        m = re.search(pat, raw_text, re.DOTALL | re.IGNORECASE)
        if not m:
            # Cannot find question text -> Record as extraction failed, do NOT create dummy text
            parsed_items.append({
                'itemNumber': i,
                'part': 'PHẦN I',
                'questionType': 'SINGLE_CHOICE',
                'status': 'EXTRACTION_FAILED',
                'error': f'Cannot locate question {i} in PDF text',
                'rawSnippet': '',
                'options': [],
                'isVerified': False
            })
            continue

        content_block = m.group(1).strip()
        opt_matches = re.findall(r'([ABCD])\s*[\.\:](.+?)(?=[ABCD]\s*[\.\:]|$)', content_block, re.DOTALL)
        
        if len(opt_matches) < 4:
            # Incomplete options -> mark NEEDS_REVIEW, do NOT supply dummy options
            parsed_items.append({
                'itemNumber': i,
                'part': 'PHẦN I',
                'questionType': 'SINGLE_CHOICE',
                'status': 'NEEDS_REVIEW',
                'error': f'Found only {len(opt_matches)} options instead of 4',
                'rawSnippet': content_block[:200],
                'options': [{'key': m[0], 'content': m[1].strip()} for m in opt_matches],
                'isVerified': False
            })
            continue
            
        clean_prompt = content_block[:content_block.find(opt_matches[0][0] + '.') if content_block.find(opt_matches[0][0] + '.') != -1 else content_block.find(opt_matches[0][0] + ':')].strip()
        options = [{'key': k, 'content': v.strip().replace('\n', ' ')} for k, v in opt_matches[:4]]
        
        parsed_items.append({
            'itemNumber': i,
            'part': 'PHẦN I',
            'questionType': 'SINGLE_CHOICE',
            'status': 'EXTRACTED',
            'content': clean_prompt,
            'options': options,
            'isVerified': True
        })

    return parsed_items

print("Strict extractor configured with zero dummy fallbacks.")
