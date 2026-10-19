import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math'

skill_codes = {}

# 1. seed.ts
seed_path = os.path.join(root, 'apps', 'api', 'prisma', 'seed.ts')
if os.path.exists(seed_path):
    with open(seed_path, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(r"\{\s*code:\s*['\"]([^'\"]+)['\"],\s*title:\s*['\"]([^'\"]+)['\"],\s*chapter:\s*['\"]([^'\"]+)['\"]", content)
        for code, title, chapter in matches:
            skill_codes[code] = {'title': title, 'chapter': chapter, 'source': 'seed.ts'}

# 2. diagnostic-blueprint.ts
bp_path = os.path.join(root, 'apps', 'api', 'src', 'modules', 'diagnostic', 'diagnostic-blueprint.ts')
if os.path.exists(bp_path):
    with open(bp_path, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = re.findall(r"\[\s*['\"]([A-Z_]+)['\"],\s*['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"]\s*\]", content)
        for qtype, code, cog, diff, topic in matches:
            if code not in skill_codes:
                skill_codes[code] = {'title': topic, 'chapter': 'CHƯA_RÕ', 'source': 'diagnostic-blueprint.ts'}

# 3. bank-classification-plan.json
bcp_path = os.path.join(root, 'docs', 'math-import', 'bank-classification-plan.json')
if os.path.exists(bcp_path):
    with open(bcp_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for s in data.get('newSkills', []):
            code = s['code']
            skill_codes[code] = {'title': s.get('title'), 'chapter': s.get('chapter'), 'source': 'bank-classification-plan.json'}

print(f"Tổng số skill codes tìm thấy: {len(skill_codes)}")
for k, v in sorted(skill_codes.items()):
    print(f"  - {k}: {v['title']} (Chương: {v['chapter']}) [từ {v['source']}]")
