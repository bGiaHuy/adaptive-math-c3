import os
import glob
import pypdf
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

root = r'C:\Users\Administrator\Documents\Codespace\Adaptive Learning\Adaptive Math\tai-lieu\Toan-9-ba-dang-trac-nghiem-2026-10-16'

exam_list = [
    r'02_De_tong_hop\01_HK1_Hung_Yen_2025_2026.pdf',
    r'02_De_tong_hop\03_HK1_Quan_Toan_2025_2026.pdf',
    r'02_De_tong_hop\04_HK1_Tay_Son_2025_2026.pdf',
    r'02_De_tong_hop\05_GK1_Nguyen_Van_Linh_2025_2026.pdf',
    r'03_Bo_sung\01_HK2_Hung_Yen_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\06_GK2_Nguyen_Hue_Da_Nang_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\07_HK2_Tran_Phu_Hai_Phong_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\08_HK2_Nguyen_Hue_Da_Nang_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\09_HK2_Chu_Van_An_Gia_Lai_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\10_On_thi_vao_10_Cum_2_Hai_Phong_2026_2027.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\11_KS_Chu_Van_An_Hai_Phong_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\12_KS_Cum_4_Hai_Phong_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\13_KS_Cum_25_Hai_Phong_2025_2026.pdf',
    r'03_Bo_sung_Antigravity\De_tong_hop\15_On_thi_vao_10_Hong_Bang_Hai_Phong_2026.pdf',
]

print("Scanning exam files for target slots...")

for rel_path in exam_list:
    full_p = os.path.join(root, rel_path)
    if not os.path.exists(full_p):
        continue
    reader = pypdf.PdfReader(full_p)
    pages = len(reader.pages)
    
    # Extract text from all pages
    all_text = []
    for i, page in enumerate(reader.pages):
        all_text.append((i+1, page.extract_text() or ''))
    
    print(f"\n=======================================================")
    print(f"FILE: {rel_path} ({pages} pages)")
    print(f"=======================================================")
    
    # Let's search for keywords matching each slot:
    # Slot 2: 'phương trình quy về' or 'phương trình tích' or '(x - ' or 'nghiệm của phương trình (x'
    # Slot 10: 'tứ giác nội tiếp' or 'nội tiếp đường tròn' or 'đa giác đều' or 'ngoại tiếp đường tròn'
    # Slot 11: 'tần số tương đối'
    # Slot 13: 'Phần II' and ('hai tổ' or 'xưởng' or 'kế hoạch' or 'quãng đường' or 'hệ phương trình')
    # Slot 14: 'Phần II' and ('căn' or 'rút gọn' or 'biểu thức')
    # Slot 15: 'Phần II' and ('đường tròn' or 'tiếp tuyến' or 'dây cung')
    # Slot 16: 'Phần II' and ('thống kê' or 'bảng tần số' or 'tần số ghép nhóm' or 'ghép nhóm')
    # Slot 17: 'Phần III' and ('viète' or 'vi-ét' or 'hai nghiệm' or 'x1' or 'x2')
    # Slot 20: 'Phần III' and ('hình trụ' or 'hình nón' or 'hình cầu' or 'thể tích' or 'diện tích xung quanh' or 'bể' or 'nón lá')
    # Slot 22: 'Phần III' and ('nội tiếp' or 'tứ giác' or 'tiếp tuyến' or 'đường tròn')
    
    for page_num, text in all_text:
        t_low = text.lower()
        
        # Check Section I, II, III
        is_p1 = 'phần i' in t_low or 'trắc nghiệm nhiều' in t_low
        is_p2 = 'phần ii' in t_low or 'đúng sai' in t_low or 'đúng/sai' in t_low
        is_p3 = 'phần iii' in t_low or 'trả lời ngắn' in t_low
        
        # Look for Slot 2: Phương trình quy về bậc nhất (TN)
        if any(k in t_low for k in ['phương trình tích', 'ẩn ở mẫu', 'quy về bậc nhất']):
            print(f"  [Slot 2 potential] P.{page_num}: matches 'phương trình quy về/tích/ẩn ở mẫu'")
            
        # Look for Slot 10: Tứ giác nội tiếp / đa giác đều (TN)
        if ('tứ giác nội tiếp' in t_low or 'đa giác đều' in t_low or 'ngoại tiếp' in t_low) and is_p1:
            print(f"  [Slot 10 potential] P.{page_num}: matches 'tứ giác nội tiếp / đa giác đều' in Part I")
            
        # Look for Slot 11: Thống kê, tần số tương đối (TN)
        if 'tần số tương đối' in t_low and is_p1:
            print(f"  [Slot 11 potential] P.{page_num}: matches 'tần số tương đối' in Part I")
            
        # Look for Slot 13: Mô hình hóa pt/hệ pt (Đ/S)
        if is_p2 and any(k in t_low for k in ['kế hoạch', 'sản phẩm', 'xưởng', 'tổ i', 'tổ 1', 'hệ phương trình']):
            print(f"  [Slot 13 potential] P.{page_num}: matches 'mô hình hóa hệ pt' in Part II")
            
        # Look for Slot 14: Biến đổi căn thức (Đ/S)
        if is_p2 and any(k in t_low for k in ['căn bậc hai', 'rút gọn biểu thức', '√x', 'p =', 'a =', 'b =']):
            print(f"  [Slot 14 potential] P.{page_num}: matches 'biến đổi căn thức' in Part II")
            
        # Look for Slot 15: Quan hệ hình học đường tròn (Đ/S)
        if is_p2 and any(k in t_low for k in ['đường tròn (o', 'tiếp tuyến', 'dây cung', 'đường kính']):
            print(f"  [Slot 15 potential] P.{page_num}: matches 'đường tròn' in Part II")
            
        # Look for Slot 16: Đọc và phân tích dữ liệu (Đ/S)
        if is_p2 and any(k in t_low for k in ['bảng tần số', 'ghép nhóm', 'tần số tương đối']):
            print(f"  [Slot 16 potential] P.{page_num}: matches 'thống kê dữ liệu' in Part II")
            
        # Look for Slot 17: Viète và ứng dụng (Ngắn)
        if is_p3 and any(k in t_low for k in ['vi-ét', 'viète', 'hai nghiệm', 'x1', 'x2']):
            print(f"  [Slot 17 potential] P.{page_num}: matches 'Viète' in Part III")
            
        # Look for Slot 20: Diện tích, thể tích thực tiễn (Ngắn)
        if is_p3 and any(k in t_low for k in ['hình trụ', 'hình nón', 'hình cầu', 'thể tích', 'diện tích', 'nón lá', 'thùng', 'bể']):
            print(f"  [Slot 20 potential] P.{page_num}: matches 'hình khối / thể tích' in Part III")
            
        # Look for Slot 22: Hình học nội tiếp tổng hợp (Ngắn)
        if is_p3 and any(k in t_low for k in ['nội tiếp', 'đường tròn', 'tiếp tuyến', 'bán kính']):
            print(f"  [Slot 22 potential] P.{page_num}: matches 'hình học nội tiếp / đường tròn' in Part III")
