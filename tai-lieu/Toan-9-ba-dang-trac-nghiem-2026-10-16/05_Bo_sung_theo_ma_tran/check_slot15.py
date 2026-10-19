import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# Cum 18 Hai Phong Page 3, Q2
p_cum18 = os.path.join(root, r'05_Bo_sung_theo_ma_tran\PDF\19_KS_Cum_18_Hai_Phong_2025_2026.pdf')
r_cum18 = pypdf.PdfReader(p_cum18)
print("=== CUM 18 HAI PHONG P.3 (PART II Q2) ===")
txt = r_cum18.pages[2].extract_text()
for l in txt.splitlines():
    if any(k in l.lower() for k in ['câu 2.', 'đường tròn', 'a)', 'b)', 'c)', 'd)']):
        print(" ", l[:90])

# Hung Yen HK2 Page 3, Q2
p_hy2 = os.path.join(root, r'03_Bo_sung\01_HK2_Hung_Yen_2025_2026.pdf')
r_hy2 = pypdf.PdfReader(p_hy2)
print("\n=== HUNG YEN HK2 P.3 (PART II Q2) ===")
txt = r_hy2.pages[2].extract_text()
for l in txt.splitlines():
    if any(k in l.lower() for k in ['câu 2:', 'đường kính', 'a)', 'b)', 'c)', 'd)']):
        print(" ", l[:90])
