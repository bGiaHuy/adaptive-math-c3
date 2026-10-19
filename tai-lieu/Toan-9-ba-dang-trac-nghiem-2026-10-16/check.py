import pathlib,json,re,unicodedata,csv,zipfile
from pypdf import PdfReader
root=pathlib.Path('tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16')
rows=json.loads((root/'nguon.json').read_text(encoding='utf8'))
def norm(s):return re.sub(r'\s+',' ',''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn').replace('đ','d'))
for row in rows:
 reader=PdfReader(root/row['file']);row['pages']=len(reader.pages);hits={'nhieu_lua_chon':[],'dung_sai':[],'tra_loi_ngan':[]}
 for n,page in enumerate(reader.pages,1):
  t=norm(page.extract_text() or '')
  for key,patterns in [('nhieu_lua_chon',['nhieu phuong an','nhieu lua chon','bon phuong an']),('dung_sai',['dung sai','dung - sai','dung hoac sai','dung/sai']),('tra_loi_ngan',['tra loi ngan'])]:
   if any(p.replace(" ","") in t.replace(" ","") for p in patterns):hits[key].append(n)
  if all(len(v)>=1 for v in hits.values()):break
 row['type_pages']=hits;row['verified_three_types']=all(hits.values())
 print(row['name'],row['pages'],row['verified_three_types'],flush=True)
(root/'nguon.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8')
with (root/'DANH-MUC.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(['Nhóm','Tài liệu','File','Số trang','Trang nhiều lựa chọn','Trang đúng sai','Trang trả lời ngắn','Đủ ba dạng theo kiểm tra văn bản','Nguồn','PDF'])
 for r in rows:w.writerow([r['group'],r['name'],r['file'],r['pages'],*[','.join(map(str,r['type_pages'][k][:8])) for k in ['nhieu_lua_chon','dung_sai','tra_loi_ngan']],r['verified_three_types'],r['source'],r['pdf_url']])
lines=['# Tài liệu Toán 9 – ba dạng trắc nghiệm','', 'Tổng hợp ngày 16/10/2026. Gồm nhiều lựa chọn, đúng/sai và trả lời ngắn. Các PDF giữ nguyên bản nguồn, có thể bao gồm tự luận. Chưa nhập vào ngân hàng câu hỏi của ứng dụng.','', '## Cách dùng','', '- Mở DANH-MUC.csv bằng Excel để lọc chủ đề và tra trang chứa từng dạng. Số trang là thứ tự trang PDF, không nhất thiết trùng số trang in.','- Các trang được xác định bằng tìm tiêu đề trong văn bản PDF; không phải danh sách đầy đủ mọi câu hỏi.','- Nguồn chuyên đề có cả Kết Nối Tri Thức và Cánh Diều, đã ghi trong tên file.','- Đáp án/lời giải chưa được thẩm định độc lập. Đây là tài liệu tham khảo; cần xác nhận quyền sử dụng trước khi xuất bản lại câu hỏi trong sản phẩm thương mại.','', '## Danh mục','', '| Tài liệu | Trang | Đủ ba dạng qua kiểm tra văn bản | Nguồn |','|---|---:|---|---|']
for r in rows:lines.append(f"| [{r['name']}]({r['file'].replace(chr(92),'/')}) | {r['pages']} | {'Có' if r['verified_three_types'] else 'Cần kiểm tra thêm'} | [Trang nguồn]({r['source']}) |")
lines+=['','## Antigravity','', 'Chưa gửi việc sang Antigravity vì phiên này không có công cụ liên lạc với ứng dụng đó. Có prompt sẵn trong PROMPT-ANTIGRAVITY.txt để tìm bổ sung.']
(root/'README.md').write_text('\n'.join(lines),encoding='utf8')
(root/'PROMPT-ANTIGRAVITY.txt').write_text('Tìm bổ sung tài liệu Toán lớp 9 chương trình GDPT 2018 có đủ ba dạng: trắc nghiệm nhiều lựa chọn, đúng/sai và trả lời ngắn. Ưu tiên chuyên đề Kết Nối Tri Thức: thống kê, xác suất, hình trụ/hình nón/hình cầu; đề giữa kỳ 2 và cuối kỳ 2. Chỉ tải PDF hoặc Word công khai, không vượt đăng nhập hoặc trả phí. Kiểm tra nội dung thật, ghi URL trang nguồn, URL tải, tên tác giả/trường, năm học, bộ sách, số trang, trang có từng dạng và tình trạng đáp án. So với DANH-MUC.csv để bỏ trùng. Lưu vào thư mục 03_Bo_sung_Antigravity và xuất danh mục CSV; tài liệu chưa xác minh ghi rõ. Không nhập hay xuất bản câu hỏi vào ứng dụng.',encoding='utf8')
with zipfile.ZipFile(root.with_suffix('.zip'),'w',zipfile.ZIP_DEFLATED) as z:
 for p in root.rglob('*'):
  if p.is_file() and p.suffix!='.py':z.write(p,p.relative_to(root.parent))
print('TOTAL',sum(r['pages'] for r in rows))
