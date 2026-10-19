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
        print(txt[idx:idx+500].strip())
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

print("=== INSPECTING SLOT 10 (6 questions) ===")
dump_q(10, "CAND-SLOT10-01", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 1, "I", "5", 33)
dump_q(10, "CAND-SLOT10-02", "03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf", 1, "I", "6", 33)
dump_q(10, "CAND-SLOT10-03", "03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf", 2, "I", "9", 9)
dump_q(10, "CAND-SLOT10-04", "01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf", 162, "I", "4", 214)
dump_q(10, "CAND-SLOT10-05", "01_Chuyen_de/05_Ngoai_tiep_noi_tiep.pdf", 163, "I", "9", 216)
dump_q(10, "CAND-SLOT10-06", "03_Bo_sung_Antigravity/De_tong_hop/08_HK2_Nguyen_Hue_Da_Nang_2025_2026.pdf", 9, "I", "7", 11)
