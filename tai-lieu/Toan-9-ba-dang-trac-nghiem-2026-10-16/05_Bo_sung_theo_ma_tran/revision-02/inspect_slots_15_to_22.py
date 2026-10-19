import fitz
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
base = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

def dump_q(slot, cid, rel_path, page, sec, qnum, ans_page):
    doc = fitz.open(os.path.join(base, rel_path))
    p = doc[page - 1]
    txt = p.get_text()
    print(f"==================================================")
    print(f"[{cid}] Slot {slot} | {rel_path} | p.{page} Sec {sec} Q{qnum} | Ans_p {ans_page}")
    print(f"--------------------------------------------------")
    idx = txt.find(f"Câu {qnum}")
    if idx != -1:
        print("QUESTION TEXT FROM PDF:")
        print(txt[idx:idx+600].strip())
    else:
        print("NOT FOUND DIRECTLY, snippet of page:")
        print(txt[:400].strip())
        
    if ans_page and ans_page <= len(doc):
        ap = doc[ans_page - 1]
        atxt = ap.get_text()
        print("--- ANSWER PAGE TEXT SNIPPET ---")
        aidx = atxt.find(f"Câu {qnum}")
        if aidx != -1:
            print(atxt[aidx:aidx+300].strip())
        else:
            print(atxt[:250].strip())

print("=== INSPECTING SLOTS 15, 16, 17, 20, 22 ===")

# Slot 15
print("\n--- SLOT 15 ---")
dump_q(15, "CAND-SLOT15-01", "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf", 3, "II", "15", 9)
dump_q(15, "CAND-SLOT15-02", "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf", 3, "II", "2", 9)
dump_q(15, "CAND-SLOT15-03", "03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf", 3, "II", "2", 6)
dump_q(15, "CAND-SLOT15-04", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 7, "II", "4", 36)
dump_q(15, "CAND-SLOT15-05", "03_Bo_sung_Antigravity/Chuyen_de/15_Duong_tron_Canh_Dieu.pdf", 230, "II", "1", 332)

# Slot 16
print("\n--- SLOT 16 ---")
dump_q(16, "CAND-SLOT16-01", "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf", 3, "II", "4", 9)
dump_q(16, "CAND-SLOT16-02", "02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf", 3, "II", "4", 5)
dump_q(16, "CAND-SLOT16-03", "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf", 2, "II", "2", 9)
dump_q(16, "CAND-SLOT16-04", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 6, "II", "2", 35)
dump_q(16, "CAND-SLOT16-05", "03_Bo_sung_Antigravity/Chuyen_de/10_Thong_ke_tan_so_KNTT.pdf", 128, "II", "1", 150)

# Slot 17
print("\n--- SLOT 17 ---")
dump_q(17, "CAND-SLOT17-01", "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf", 4, "III", "4", 9)
dump_q(17, "CAND-SLOT17-02", "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf", 3, "III", "17", 9)
dump_q(17, "CAND-SLOT17-03", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 3, "III", "5", 34)
dump_q(17, "CAND-SLOT17-04", "03_Bo_sung_Antigravity/De_tong_hop/13_KS_Cum_25_Hai_Phong_2025_2026.pdf", 4, "III", "2", 7)
dump_q(17, "CAND-SLOT17-05", "01_Chuyen_de/03_Ham_so_phuong_trinh_bac_hai.pdf", 25, "III", "3", 110)

# Slot 20
print("\n--- SLOT 20 ---")
dump_q(20, "CAND-SLOT20-01", "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf", 4, "III", "2", 9)
dump_q(20, "CAND-SLOT20-02", "03_Bo_sung_Antigravity/Chuyen_de/08_Hinh_khoi_thuc_tien_KNTT.pdf", 32, "III", "91", 117)
dump_q(20, "CAND-SLOT20-03", "03_Bo_sung_Antigravity/Chuyen_de/08_Hinh_khoi_thuc_tien_KNTT.pdf", 32, "III", "92", 117)
dump_q(20, "CAND-SLOT20-04", "03_Bo_sung_Antigravity/Chuyen_de/08_Hinh_khoi_thuc_tien_KNTT.pdf", 32, "III", "94", 118)
dump_q(20, "CAND-SLOT20-05", "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf", 7, "III", "21", 10)

# Slot 22
print("\n--- SLOT 22 ---")
dump_q(22, "CAND-SLOT22-01", "01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf", 21, "III", "44", 72)
dump_q(22, "CAND-SLOT22-02", "01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf", 21, "III", "45", 73)
dump_q(22, "CAND-SLOT22-03", "01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf", 21, "III", "46", 73)
dump_q(22, "CAND-SLOT22-04", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 3, "III", "3", 34)
dump_q(22, "CAND-SLOT22-05", "03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf", 3, "III", "3", 6)
