import json
import csv
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

DIR = 'outputs/thpt-300-papers'
cand_file = os.path.join(DIR, 'questions-candidates.jsonl')

counts = {} # (grade, chapter, qType) -> count
with open(cand_file, 'r', encoding='utf-8') as f:
    for line in f:
        if not line.strip(): continue
        q = json.loads(line)
        key = (q['grade'], q['chapterCode'], q['questionType'])
        counts[key] = counts.get(key, 0) + 1

# Complete matrix of chapters
chapters_by_grade = {
    10: [f'KNTT-10-C{str(i).padStart(2, "0")}' if False else f'KNTT-10-C{i:02d}' for i in range(1, 10)],
    11: [f'KNTT-11-C{str(i).padStart(2, "0")}' if False else f'KNTT-11-C{i:02d}' for i in range(1, 10)],
    12: [f'KNTT-12-C{str(i).padStart(2, "0")}' if False else f'KNTT-12-C{i:02d}' for i in range(1, 7)]
}

q_types = ['SINGLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']
difficulties = ['EASY', 'MEDIUM', 'HARD', 'VERY_HARD']

rows = []
for g in [10, 11, 12]:
    for ch in chapters_by_grade[g]:
        for qt in q_types:
            for diff in difficulties:
                # We attribute candidates primarily to EASY/MEDIUM in pilot
                cnt = counts.get((g, ch, qt), 0)
                cand_cnt = cnt if diff == 'EASY' else 0
                import_cnt = 0
                status = 'COVERED' if cand_cnt > 0 else 'EMPTY'
                rows.append([g, ch, qt, diff, cand_cnt, import_cnt, status])

cov_file = os.path.join(DIR, 'coverage.csv')
with open(cov_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['grade', 'chapterCode', 'questionType', 'difficulty', 'candidateCount', 'importEligibleCount', 'coverageStatus'])
    writer.writerows(rows)

print(f"Updated coverage.csv with {len(rows)} matrix cells.")
