import os
import pypdf
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

# Let's inspect specific candidates:
# 1. Slot 2: Phương trình quy về bậc nhất (Nhiều lựa chọn, Nhận biết)
# In 01_Chuyen_de/02_Phuong_trinh_bat_phuong_trinh.pdf:
#   P.16: Câu 1, Câu 2, Câu 3 (Phương trình tích dạng, cách giải, nghiệm)
#   P.20: Câu 45, Câu 46, Câu 50 (Điều kiện xác định của phương trình chứa ẩn ở mẫu)
# In 03_Bo_sung_Antigravity/Chuyen_de/14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf:
#   P.16: Câu 1, Câu 2, Câu 3
#   P.21: Câu 59 (Phương trình nào chứa ẩn ở mẫu)

p1 = os.path.join(root, r'01_Chuyen_de\02_Phuong_trinh_bat_phuong_trinh.pdf')
r1 = pypdf.PdfReader(p1)
print("=== SLOT 2 CANDIDATES IN 01_Chuyen_de/02 ===")
print("P.16 Q1-Q3:")
print(r1.pages[15].extract_text()[:600])
print("\nP.20 Q45-Q47:")
print(r1.pages[19].extract_text()[:600])

# In 14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf
p2 = os.path.join(root, r'03_Bo_sung_Antigravity\Chuyen_de\14_Phuong_trinh_he_bac_nhat_Canh_Dieu.pdf')
r2 = pypdf.PdfReader(p2)
print("\n=== SLOT 2 CANDIDATES IN Canh Dieu 14 ===")
print("P.21 Q59-Q61:")
print(r2.pages[20].extract_text()[:600])
