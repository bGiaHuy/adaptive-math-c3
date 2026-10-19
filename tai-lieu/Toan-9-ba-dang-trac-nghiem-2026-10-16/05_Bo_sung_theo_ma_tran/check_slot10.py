import os
import pypdf
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# Check 01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf
p_ch5 = os.path.join(root, r'01_Chuyen_de\05_Ngoai_tiep_noi_tiep.pdf')
r_ch5 = pypdf.PdfReader(p_ch5)
print(f"=== 05_Ngoai_tiep_noi_tiep.pdf ({len(r_ch5.pages)} pages) ===")

for i in range(10, 30):
    txt = r_ch5.pages[i].extract_text() or ''
    if 'phần i. câu trắc nghiệm nhiều phương án' in txt.lower():
        print(f"Found MC Section on Page {i+1}!")
        lines = [l.strip() for l in txt.splitlines() if l.strip()]
        for l in lines[:20]:
            print("  ", l[:90])
        break

# Check 12_KS_Cum_4_Hai_Phong_2025_2026.pdf
p_cum4 = os.path.join(root, r'03_Bo_sung_Antigravity\De_tong_hop\12_KS_Cum_4_Hai_Phong_2025_2026.pdf')
r_cum4 = pypdf.PdfReader(p_cum4)
print(f"\n=== 12_KS_Cum_4_Hai_Phong_2025_2026.pdf ===")
for p_num in [1, 5, 9, 13]:
    txt = r_cum4.pages[p_num-1].extract_text() or ''
    for l in txt.splitlines():
        if any(w in l.lower() for w in ['tứ giác', 'nội tiếp', 'đa giác đều', 'ngoại tiếp']):
            print(f"  P.{p_num}: {l[:90]}")
