import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# 1. Cum 18 Hai Phong Page 4, Q4 (Part III)
p_cum18 = os.path.join(root, r'05_Bo_sung_theo_ma_tran\PDF\19_KS_Cum_18_Hai_Phong_2025_2026.pdf')
r_cum18 = pypdf.PdfReader(p_cum18)
print("=== CUM 18 HAI PHONG P.4 (PART III Q4 - VIETE) ===")
lines = r_cum18.pages[3].extract_text().splitlines()
for l in lines:
    if any(k in l.lower() for k in ['câu 4.', 'nghiệm', 'x1', 'x2']):
        print(" ", l[:90])

# 2. Cum 2 Hai Phong Page 3, Q18 (Part III Q2)
p_cum2 = os.path.join(root, r'03_Bo_sung_Antigravity\De_tong_hop\10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf')
r_cum2 = pypdf.PdfReader(p_cum2)
print("\n=== CUM 2 HAI PHONG P.3 (PART III Q17/18 - VIETE) ===")
lines = r_cum2.pages[2].extract_text().splitlines()
for l in lines:
    if any(k in l.lower() for k in ['phần 3', 'câu 17', 'câu 18', 'phương trình', 'nghiệm']):
        print(" ", l[:90])

# 3. Cum 4 Hai Phong Page 3, Part III Q2
p_cum4 = os.path.join(root, r'03_Bo_sung_Antigravity\De_tong_hop\12_KS_Cum_4_Hai_Phong_2025_2026.pdf')
r_cum4 = pypdf.PdfReader(p_cum4)
print("\n=== CUM 4 HAI PHONG P.3 (PART III Q2 - VIETE) ===")
lines = r_cum4.pages[2].extract_text().splitlines()
for l in lines:
    if any(k in l.lower() for k in ['phần iii', 'câu 1', 'câu 2', 'nghiệm']):
        print(" ", l[:90])
