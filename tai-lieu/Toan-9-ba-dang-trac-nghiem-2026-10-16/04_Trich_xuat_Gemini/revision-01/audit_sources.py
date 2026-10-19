import json
import os
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

with open(os.path.join(root, '04_Trich_xuat_Gemini', 'sources.json'), 'r', encoding='utf-8') as f:
    sources = json.load(f)

for s in sources:
    rel = s.get('relativePath', '')
    abs_p = os.path.join(root, rel)
    exists = os.path.exists(abs_p)
    actual_hash = None
    if exists:
        actual_hash = hashlib.sha256(open(abs_p, 'rb').read()).hexdigest()
    hash_match = (actual_hash == s.get('sha256'))
    print(f"{s['sourceId']}: {s['fileName']} | exists={exists} | hash_match={hash_match} | author={s.get('schoolOrAuthor')} | year={s.get('schoolYear')}")
