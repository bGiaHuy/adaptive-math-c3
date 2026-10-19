import os
import glob
import json
import pypdf
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# Map existing files to sha256 and metadata
existing_files = glob.glob(os.path.join(root, '**', '*.pdf'), recursive=True)
print(f"Total existing PDFs: {len(existing_files)}")

# Check some key exams:
# 1. 02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf
# 2. 02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf
# 3. 03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf
# 4. 03_Bo_sung_Antigravity/De_tong_hop/07_HK2_Tran_Phu_Hai_Phong_2025_2026.pdf
# 5. 03_Bo_sung_Antigravity/De_tong_hop/08_HK2_Nguyen_Hue_Da_Nang_2025_2026.pdf
# 6. 03_Bo_sung_Antigravity/De_tong_hop/09_HK2_Chu_Van_An_Gia_Lai_2025_2026.pdf
# 7. 03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf
# 8. 03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf
# 9. 01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf
# 10. 03_Bo_sung_Antigravity/Chuyen_de/08_Hinh_khoi_thuc_tien_KNTT.pdf
# 11. 03_Bo_sung_Antigravity/Chuyen_de/10_Thong_ke_tan_so_KNTT.pdf
# 12. 03_Bo_sung_Antigravity/Chuyen_de/11_Can_thuc_KNTT.pdf
# 13. 03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf
# 14. 03_Bo_sung_Antigravity/Chuyen_de/15_Duong_tron_Canh_Dieu.pdf

exam_files = [
    r'02_De_tong_hop\01_HK1_Hung_Yen_2025_2026.pdf',
    r'03_Bo_sung\01_HK2_Hung_Yen_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\07_HK2_Tran_Phu_Hai_Phong_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\08_HK2_Nguyen_Hue_Da_Nang_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\09_HK2_Chu_Van_An_Gia_Lai_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\11_KS_Chu_Van_An_Hai_Phong_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\12_KS_Cum_4_Hai_Phong_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\13_KS_Cum_25_Hai_Phong_2025_2026.pdf',
]

for ef in exam_files:
    full_p = os.path.join(root, ef)
    if os.path.exists(full_p):
        reader = pypdf.PdfReader(full_p)
        print(f"\n=== {ef} ({len(reader.pages)} pages) ===")
        # print text sample of page 1 and 2
        for page_idx in range(min(3, len(reader.pages))):
            t = reader.pages[page_idx].extract_text() or ''
            lines = [l.strip() for l in t.splitlines() if l.strip()]
            print(f"--- Page {page_idx+1} ({len(lines)} lines) ---")
            for l in lines[:8]:
                print(f"    {l[:90]}")
