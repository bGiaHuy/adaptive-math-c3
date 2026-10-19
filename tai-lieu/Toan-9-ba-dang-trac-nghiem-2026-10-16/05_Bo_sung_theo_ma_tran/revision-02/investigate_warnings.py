import fitz
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
base = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

def find_in_pdf(pdf_rel, search_terms, max_pages=None):
    doc = fitz.open(os.path.join(base, pdf_rel))
    n = len(doc) if not max_pages else min(len(doc), max_pages)
    results = []
    for i in range(n):
        t = doc[i].get_text()
        for term in search_terms:
            if term in t:
                results.append((i+1, term, t[t.find(term):t.find(term)+150].replace('\n', ' ')))
    return results

print("=== CHECKING 8 QUESTIONS ===")

# 1. CAND-SLOT11-01: 02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf Q10
print("\n--- 1. CAND-SLOT11-01 ---")
print(find_in_pdf('02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf', ['Câu 10:', 'Câu 10.']))

# 2. CAND-SLOT13-01: 03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf Q14
print("\n--- 2. CAND-SLOT13-01 ---")
print(find_in_pdf('03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf', ['Câu 14.', 'Câu 14:']))

# 3. CAND-SLOT14-05: 03_Bo_sung_Antigravity/Chuyen_de/11_Can_thuc_KNTT.pdf Q1
print("\n--- 3. CAND-SLOT14-05 ---")
print(find_in_pdf('03_Bo_sung_Antigravity/Chuyen_de/11_Can_thuc_KNTT.pdf', ['PHẦN II', 'Phần II', 'Câu 1.'], max_pages=100)[:10])

# 4. CAND-SLOT15-05: 03_Bo_sung_Antigravity/Chuyen_de/15_Duong_tron_Canh_Dieu.pdf Q1
print("\n--- 4. CAND-SLOT15-05 ---")
print(find_in_pdf('03_Bo_sung_Antigravity/Chuyen_de/15_Duong_tron_Canh_Dieu.pdf', ['PHẦN II', 'Phần II', 'Câu 1.'], max_pages=300)[:10])

# 5. CAND-SLOT16-02: 02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf Q4
print("\n--- 5. CAND-SLOT16-02 ---")
print(find_in_pdf('02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf', ['Câu 4:', 'Câu 4.']))

# 6. CAND-SLOT16-05: 03_Bo_sung_Antigravity/Chuyen_de/10_Thong_ke_tan_so_KNTT.pdf Q1
print("\n--- 6. CAND-SLOT16-05 ---")
print(find_in_pdf('03_Bo_sung_Antigravity/Chuyen_de/10_Thong_ke_tan_so_KNTT.pdf', ['PHẦN II', 'Phần II'], max_pages=200)[:10])

# 7. CAND-SLOT17-05: 01_Chuyen_de/03_Ham_so_phuong_trinh_bac_hai.pdf Q3
print("\n--- 7. CAND-SLOT17-05 ---")
print(find_in_pdf('01_Chuyen_de/03_Ham_so_phuong_trinh_bac_hai.pdf', ['PHẦN III', 'Phần III', 'Câu 3.'], max_pages=50)[:10])

# 8. CAND-SLOT20-05: 03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf Q21
print("\n--- 8. CAND-SLOT20-05 ---")
print(find_in_pdf('03_Bo_sung_Antigravity/De_tong_hop/10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf', ['Câu 21.', 'Câu 21:']))

# And let's check 12_KS_Cum_4_Hai_Phong_2025_2026.pdf for CAND-SLOT15-04 and CAND-SLOT22-04
print("\n--- KS Cum 4 Hai Phong Part II and Part III ---")
print(find_in_pdf('03_Bo_sung_Antigravity/De_tong_hop/12_KS_Cum_4_Hai_Phong_2025_2026.pdf', ['PHẦN II', 'PHẦN III']))
