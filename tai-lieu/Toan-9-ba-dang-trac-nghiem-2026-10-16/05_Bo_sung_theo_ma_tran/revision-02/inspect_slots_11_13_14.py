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

print("=== INSPECTING REMAINING CANDIDATES ===")
# Slot 11
print("\n--- SLOT 11 ---")
dump_q(11, "CAND-SLOT11-01", "02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf", 1, "I", "10", 5)
dump_q(11, "CAND-SLOT11-02", "03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf", 2, "I", "9", 6)
dump_q(11, "CAND-SLOT11-03", "03_Bo_sung/01_HK2_Hung_Yen_2025_2026.pdf", 3, "I", "26", 6)
dump_q(11, "CAND-SLOT11-04", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 1, "I", "8", 33)
dump_q(11, "CAND-SLOT11-05", "03_Bo_sung_Antigravity/Chuyen_de/10_Thong_ke_tan_so_KNTT.pdf", 16, "I", "1", 97)

# Slot 13
print("\n--- SLOT 13 ---")
dump_q(13, "CAND-SLOT13-01", "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf", 2, "II", "14", 9)
dump_q(13, "CAND-SLOT13-02", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 2, "II", "2", 34)
dump_q(13, "CAND-SLOT13-03", "03_Bo_sung_Antigravity/De_tong_hop/11_KS_Chu_Van_An_Hai_Phong_2026.pdf", 2, "II", "2", 6)
dump_q(13, "CAND-SLOT13-04", "02_De_tong_hop/02_Khao_sat_Hai_Phong_2025_2026.pdf", 3, "II", "3", 9)
dump_q(13, "CAND-SLOT13-05", "03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf", 25, "II", "81", 145)

# Slot 14
print("\n--- SLOT 14 ---")
dump_q(14, "CAND-SLOT14-01", "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf", 2, "II", "13", 9)
dump_q(14, "CAND-SLOT14-02", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 3, "II", "3", 34)
dump_q(14, "CAND-SLOT14-03", "05_Bo_sung_theo_ma_tran/PDF/19_KS_Cum_18_Hai_Phong_2025_2026.pdf", 3, "II", "3", 9)
dump_q(14, "CAND-SLOT14-04", "03_Bo_sung_Antigravity/De_tong_hop/13_KS_Cum_25_Hai_Phong_2025_2026.pdf", 4, "II", "1", 7)
dump_q(14, "CAND-SLOT14-05", "03_Bo_sung_Antigravity/Chuyen_de/11_Can_thuc_KNTT.pdf", 72, "II", "1", 81)
