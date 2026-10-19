import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# Cum 4 Hai Phong Page 3, Part III Q1 & Q4
p_cum4 = os.path.join(root, r'03_Bo_sung_Antigravity\De_tong_hop\12_KS_Cum_4_Hai_Phong_2025_2026.pdf')
r_cum4 = pypdf.PdfReader(p_cum4)
print("=== CUM 4 HAI PHONG P.3 (PART III) ===")
lines = r_cum4.pages[2].extract_text().splitlines()
for l in lines:
    if any(k in l.lower() for k in ['phần iii', 'câu 1.', 'câu 2.', 'câu 3.', 'câu 4.', 'câu 6.', 'câu 7.']):
        print(" ", l[:90])

# Check 08_Hinh_khoi_thuc_tien_KNTT.pdf
p_hk = os.path.join(root, r'03_Bo_sung_Antigravity\Chuyen_de\08_Hinh_khoi_thuc_tien_KNTT.pdf')
r_hk = pypdf.PdfReader(p_hk)
print(f"\n=== 08_Hinh_khoi_thuc_tien_KNTT.pdf ({len(r_hk.pages)} pages) ===")
for i in [31, 32, 116, 117]:
    if i < len(r_hk.pages):
        txt = r_hk.pages[i].extract_text()
        for l in txt.splitlines():
            if 'phần iii' in l.lower() or 'câu 1' in l.lower():
                print(f"  P.{i+1}: {l[:90]}")
