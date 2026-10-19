import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

for g, f, q_pages, ans_pages in [
    (10, 'THPT-10-CUOI_HK1-026.pdf', [1, 2, 3], [7, 8, 9, 10]),
    (11, 'THPT-11-CUOI_HK1-126.pdf', [1, 2, 3], [7, 8, 9, 10]),
    (12, 'THPT-12-CUOI_HK1-227.pdf', [1, 2, 3, 4], [9, 10, 11, 12])
]:
    doc = fitz.open('outputs/thpt-300-papers/sources/' + f)
    out_txt_file = f"outputs/thpt-300-papers/raw_{f.replace('.pdf', '')}.txt"
    with open(out_txt_file, 'w', encoding='utf-8') as out:
        out.write(f"=== {f} (Total pages: {len(doc)}) ===\n")
        out.write("--- QUESTION PAGES ---\n")
        for p in q_pages:
            out.write(f"\n[PAGE {p}]\n")
            out.write(doc[p-1].get_text())
        out.write("\n--- ANSWER PAGES ---\n")
        for p in ans_pages:
            out.write(f"\n[PAGE {p}]\n")
            out.write(doc[p-1].get_text())
    print(f"Dumped full raw text of Grade {g} ({f}) to {out_txt_file}")
