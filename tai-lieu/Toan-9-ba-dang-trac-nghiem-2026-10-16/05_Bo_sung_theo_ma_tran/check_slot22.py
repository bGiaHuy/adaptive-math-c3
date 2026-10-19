import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# 1. Cum 4 Hai Phong Page 3, Part III Q3
p_cum4 = os.path.join(root, r'03_Bo_sung_Antigravity\De_tong_hop\12_KS_Cum_4_Hai_Phong_2025_2026.pdf')
r_cum4 = pypdf.PdfReader(p_cum4)
print("=== CUM 4 HAI PHONG P.3 (PART III Q3) ===")
txt = r_cum4.pages[2].extract_text()
for l in txt.splitlines():
    if any(k in l.lower() for k in ['câu 3.', 'nội tiếp', 'tam giác', 'góc c']):
        print(" ", l[:95])

# 2. 05_Ngoai_tiep_noi_tiep.pdf Part III
p_ch5 = os.path.join(root, r'01_Chuyen_de\05_Ngoai_tiep_noi_tiep.pdf')
r_ch5 = pypdf.PdfReader(p_ch5)
print(f"\n=== 05_Ngoai_tiep_noi_tiep.pdf PART III ===")
for i in range(15, 35):
    txt = r_ch5.pages[i].extract_text()
    if 'phần iii. câu trắc nghiệm trả lời ngắn' in txt.lower():
        print(f"Found Part III on Page {i+1}!")
        for l in txt.splitlines()[:25]:
            print("  ", l[:95])
        break
