import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# 1. Cum 2 Hai Phong Page 3, Q14
p_cum2 = os.path.join(root, r'03_Bo_sung_Antigravity\De_tong_hop\10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf')
r_cum2 = pypdf.PdfReader(p_cum2)
print("=== CUM 2 HAI PHONG P.3 (Q14) ===")
print(r_cum2.pages[2].extract_text()[:600])

# 2. Cum 4 Hai Phong Page 3, Q2
p_cum4 = os.path.join(root, r'03_Bo_sung_Antigravity\De_tong_hop\12_KS_Cum_4_Hai_Phong_2025_2026.pdf')
r_cum4 = pypdf.PdfReader(p_cum4)
print("\n=== CUM 4 HAI PHONG P.2-3 (Q2) ===")
txt_cum4 = r_cum4.pages[1].extract_text() + "\n" + r_cum4.pages[2].extract_text()
for l in txt_cum4.splitlines():
    if any(k in l.lower() for k in ['bánh đậu xanh', 'câu 2.', 'xưởng', 'ý a)', 'a)']):
        print(" ", l[:90])
