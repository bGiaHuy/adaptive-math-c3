import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('outputs/thpt-300-papers/sources/THPT-10-CUOI_HK1-026.pdf')
print("=== THPT-10-CUOI_HK1-026 (LỚP 10) ===")
for p in [0, 1, 2, 6, 7]:
    print(f"\n--- PAGE {p+1} ---")
    print(doc[p].get_text())
