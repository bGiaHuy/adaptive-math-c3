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
    # print relevant section
    idx = txt.find(f"Câu {qnum}")
    if idx != -1:
        print("QUESTION TEXT FROM PDF:")
        print(txt[idx:idx+600].strip())
    else:
        print("NOT FOUND DIRECTLY, first 500 chars of page:")
        print(txt[:500].strip())
        
    if ans_page and ans_page <= len(doc):
        ap = doc[ans_page - 1]
        atxt = ap.get_text()
        print("--- ANSWER PAGE TEXT SNIPPET ---")
        aidx = atxt.find(f"Câu {qnum}")
        if aidx != -1:
            print(atxt[aidx:aidx+300].strip())
        else:
            print(f"(Câu {qnum} not in ans page directly, showing first 250 chars):")
            print(atxt[:250].strip())

print("=== INSPECTING SLOT 2 (6 questions) ===")
dump_q(2, "CAND-SLOT02-01", "01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf", 16, "I", "1", 101)
dump_q(2, "CAND-SLOT02-02", "01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf", 16, "I", "2", 101)
dump_q(2, "CAND-SLOT02-03", "01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf", 16, "I", "3", 101)
dump_q(2, "CAND-SLOT02-04", "01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf", 20, "I", "45", 117)
dump_q(2, "CAND-SLOT02-05", "03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf", 21, "I", "56", 97)
dump_q(2, "CAND-SLOT02-06", "03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf", 21, "I", "59", 97)
