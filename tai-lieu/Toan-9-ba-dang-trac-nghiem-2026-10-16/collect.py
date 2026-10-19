import urllib.request,urllib.parse,re,json,concurrent.futures,pathlib,html
root=pathlib.Path('tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16')
items=[
('01_Chuyen_de','01_Phuong_trinh_he_hai_an','https://montoan.com.vn/tu-luan-va-trac-nghiem-phuong-trinh-va-he-hai-phuong-trinh-bac-nhat-hai-an-toan-9-knttvcs'),
('01_Chuyen_de','02_Phuong_trinh_bat_phuong_trinh','https://thcs.toanmath.com/2026/07/tu-luan-va-trac-nghiem-phuong-trinh-va-bat-phuong-trinh-bac-nhat-mot-an-toan-9-knttvcs.html'),
('01_Chuyen_de','03_Ham_so_phuong_trinh_bac_hai','https://thcs.toanmath.com/2026/07/tu-luan-va-trac-nghiem-ham-so-y-ax2-a-%E2%89%A0-0-phuong-trinh-bac-hai-mot-an-toan-9-knttvcs.html'),
('01_Chuyen_de','04_Duong_tron','https://montoan.com.vn/tu-luan-va-trac-nghiem-duong-tron-toan-9-knttvcs'),
('01_Chuyen_de','05_Ngoai_tiep_noi_tiep','https://thcs.toanmath.com/2026/07/tu-luan-va-trac-nghiem-duong-tron-ngoai-tiep-va-duong-tron-noi-tiep-toan-9-knttvcs.html'),
('01_Chuyen_de','06_Can_thuc_Canh_Dieu','https://thcs.toanmath.com/2025/09/tu-luan-va-trac-nghiem-can-thuc-toan-9-canh-dieu.html'),
('01_Chuyen_de','07_Luong_giac_Canh_Dieu','https://thcs.toanmath.com/2025/09/tu-luan-va-trac-nghiem-he-thuc-luong-trong-tam-giac-vuong-toan-9-canh-dieu.html'),
('02_De_tong_hop','01_HK1_Hung_Yen_2025_2026','https://thcs.toanmath.com/2026/01/de-cuoi-hoc-ky-1-toan-9-nam-2025-2026-so-gddt-hung-yen.html'),
('02_De_tong_hop','02_Khao_sat_Hai_Phong_2025_2026','https://thcs.toanmath.com/2026/05/de-khao-sat-toan-9-nam-2025-2026-cum-chuyen-mon-so-24-hai-phong.html'),
('02_De_tong_hop','03_HK1_Quan_Toan_2025_2026','https://montoan.com.vn/de-cuoi-hoc-ki-1-toan-9-nam-2025-2026-truong-thcs-quan-toan-hai-phong'),
('02_De_tong_hop','04_HK1_Tay_Son_2025_2026','https://montoan.com.vn/de-cuoi-ki-1-toan-9-nam-2025-2026-truong-thcs-tay-son-da-nang'),
('02_De_tong_hop','05_GK1_Nguyen_Van_Linh_2025_2026','https://montoan.com.vn/de-giua-ky-1-toan-9-nam-2025-2026-truong-thcs-nguyen-van-linh-da-nang'),
]
def get(url):
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read()
def run(item):
 group,name,url=item
 if 'montoan.com.vn' in url:
  slug=url.rsplit('/',1)[-1]
  period='2026/07' if group=='01_Chuyen_de' else ('2026/01' if 'quan-toan' in slug else '2025/12' if 'tay-son' in slug else '2025/11')
  url='https://thcs.toanmath.com/'+period+'/'+slug+'.html'
 row={'group':group,'name':name,'source':url}
 try:
  page=get(url).decode('utf-8','replace')
  links=re.findall(r'https?://[^\s\"\'<>]+\.pdf',html.unescape(page))
  links=[u for u in links if 'pdf' in u]
  if not links: raise Exception('No public PDF link')
  pdf=links[-1]; pdf=urllib.parse.quote(pdf,safe=":/?=&%"); data=get(pdf)
  if not data.startswith(b'%PDF'): raise Exception('Not PDF')
  target=root/group/(name+'.pdf');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
  row.update(pdf_url=pdf,file=str(target.relative_to(root)),bytes=len(data),status='downloaded')
 except Exception as e:row.update(status='failed',error=str(e))
 return row
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 rows=list(pool.map(run,items))
(root/'nguon.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
for r in rows:print(r['name'],r['status'],r.get('bytes',r.get('error')))

