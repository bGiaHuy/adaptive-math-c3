"""Human transcription after visual comparison with PDF pages 1-5 (code 9101)."""
import json
from pathlib import Path
from PIL import Image

OUT = Path(__file__).parent
ROOT = OUT.parents[1]
source_file = 'tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/02_De_tong_hop/01_HK1_Hung_Yen_2025_2026.pdf'
url = 'https://thcs.toanmath.com/2026/01/de-cuoi-hoc-ky-1-toan-9-nam-2025-2026-so-gddt-hung-yen.html'
rows = []
def base(kind, number, page, content, skill):
    return dict(externalId=f'hung-yen-2025-2026-9101-{kind}-{number}', questionType=kind, content=content, skillCode=skill, status='DRAFT', source=dict(file=source_file,page=page,questionNumber=f'9101 / {kind} / {number}',url=url,author='Sở GDĐT Hưng Yên',year='2025-2026',reviewStatus='VERIFIED'),answerEvidence=dict(file=source_file,page=5,column='9101'),reviewNotes='Nội dung, công thức và đáp án được đối chiếu trực quan trang PDF. Không bổ sung lời giải chưa có trong nguồn.')
def mc(n,p,text,options,key,skill):
    q=base('SINGLE_CHOICE',n,p,text,skill)
    q['options']=[dict(optionKey=k,content=v,isCorrect=k==key) for k,v in zip('ABCD',options)]
    rows.append(q)

mc(1,1,'Phương trình nào sau đây là phương trình bậc nhất hai ẩn?', [r'$2x+3y^2=0$',r'$0x-0y=3$',r'$3x+2y=6$',r'$xy-x=1$'],'C','SKILL-03')
mc(2,1,r'Hệ phương trình $\begin{cases}3x+2y=5\\x-2y=-1\end{cases}$ có nghiệm duy nhất $(x_0;y_0)$. Giá trị của $2026y_0^2-x_0$ bằng:', ['2025','2026','−2025','2024'],'A','SKILL-03')
mc(3,1,r'Điều kiện xác định của phương trình $\frac{1-2x}{x}=\frac{1}{x-2}$ là:', [r'$x\ne2$ và $x\ne0$',r'$x\ne2$ hoặc $x\ne0$',r'$x\ne0$',r'$x\ne2$'],'A','MATH9-LINEAR-EQUATIONS')
mc(4,1,r'Diện tích hình quạt tròn cung $30^\circ$ của một đường tròn có bán kính 4 cm bằng:',[r'$\frac{2\pi}{15}\,cm^2$',r'$\frac{2\pi}{3}\,cm^2$',r'$\frac{4\pi}{3}\,cm^2$',r'$\frac{4\pi}{15}\,cm^2$'],'C','SKILL-08')
mc(5,1,r'Gọi $d$ là khoảng cách giữa hai tâm của $(O,R)$ và $(O\prime,r)$ với $0<r<R$. Hai đường tròn tiếp xúc trong khi:',[r'$d>R+r$',r'$d=R+r$',r'$d=R-r$',r'$R-r<d<R+r$'],'C','SKILL-08')
mc(6,1,r'Hai tiếp tuyến tại A và B của đường tròn $(O;R)$ cắt nhau tại M. Nếu $MA=R\sqrt3$ thì $\widehat{AOB}$ bằng:',[r'$45^\circ$',r'$120^\circ$',r'$60^\circ$',r'$90^\circ$'],'B','SKILL-08')
mc(7,1,r'$\sqrt[3]{-125}$ có kết quả là:',['25','−5','−25','5'],'B','MATH9-CUBE-ROOTS')
mc(8,1,r'Giải bất phương trình $\frac{x+2}{3}+3x+1>\frac{x+2}{2}$ ta được nghiệm là:',[r'$x>\frac{-4}{17}$',r'$x>\frac{-6}{11}$',r'$x>\frac{-6}{7}$',r'$x<\frac{6}{5}$'],'A','MATH9-LINEAR-INEQUALITY')
mc(9,1,'Cho tam giác ABC vuông tại A, kẻ đường cao AH (H thuộc BC). Biết HB = 3 cm, HC = 12 cm. Độ dài đoạn AH bằng:',['8 cm','6 cm','4 cm','5 cm'],'B','SKILL-07')
mc(10,1,'Trên mặt một chiếc đồng hồ có vạch chia như hình vẽ. Góc tạo bởi kim giờ và kim phút tại thời điểm 3 giờ có số đo bằng:\n\n![Đồng hồ nguồn](/math-import-assets/hung-yen-9101-clock.png)',[r'$45^\circ$',r'$180^\circ$',r'$90^\circ$',r'$270^\circ$'],'C','SKILL-08')
mc(11,2,'Theo nội dung đề: người đủ 16 tuổi trở lên được điều khiển xe gắn máy. Gọi x là số tuổi người đủ điều kiện điều khiển xe gắn máy. Chọn khẳng định sai trong các khẳng định sau:',[r'$x\ge16$',r'$x>16$',r'$x<16$',r'$x=16$'],'C','MATH9-LINEAR-INEQUALITY')
rows[-1]['reviewNotes'] += ' Câu được giữ theo đáp án chính thức C; cách diễn đạt tập nghiệm với B/D cần giáo viên rà soát trước xuất bản.'
mc(12,2,r'Phương trình $(2x-3)^2=6x-9$ có hai nghiệm là $x=a$, $x=b$. Tích $2ab$ bằng:',['−9','12','9','−12'],'C','SKILL-05')
mc(13,2,r'Nghiệm của phương trình $(x-2026)(x+2025)=0$ là:',[r'$x=-2026;\ x=2025$',r'$x=2026;\ x=-2025$',r'$x=-2026;\ x=-2025$',r'$x=2026;\ x=2025$'],'B','MATH9-LINEAR-EQUATIONS')
mc(14,2,'Cho tam giác ABC vuông tại A, khẳng định nào sau đây sai?',[r'$\sin B=\cos C$',r'$\tan B=\cot C$',r'$\sin B=\tan C$',r'$\frac{AB}{AC}=\frac{\cos B}{\cos C}$'],'C','SKILL-07')
mc(15,2,r'Tỉ số giữa độ dài cung $n^\circ$ và độ dài đường tròn (có cùng bán kính) bằng:',[r'$\frac n{180}$',r'$\frac n{90}$',r'$\frac n{360}$',r'$\frac n{120}$'],'C','SKILL-08')
mc(16,2,'Trong các khẳng định sau, khẳng định nào sai?',[r'$\sqrt{\frac{4a}{-3}}=\frac{-2\sqrt{3a}}{3}$ với $a<0$',r'$\sqrt{\frac{4a}{3b}}=\frac{2\sqrt{3ab}}{3b}$ với $a>b>0$',r'$\sqrt{\frac37}=\frac{\sqrt{21}}7$',r'$\sqrt{\frac{50}6}=\frac{5\sqrt3}3$'],'A','SKILL-02')
mc(17,2,'Cho đường tròn tâm O, hai tiếp tuyến tại A và B (A ≠ B) cắt nhau tại M. Khẳng định nào sau đây sai?',['MA + MB = AB.','MO vuông góc với AB.','MO là tia phân giác của góc AMB.','MA = MB.'],'A','SKILL-08')
mc(18,2,r'Một học sinh có tầm mắt cao 1,6 m đứng trên sân thượng của một căn nhà cao 25 m nhìn thấy một chiếc xe đứng yên ở C với góc nghiêng xuống $38^\circ$ (như hình). Xe cách căn nhà bao nhiêu mét, làm tròn đến hàng đơn vị?'+ '\n\n![Hình nguồn](/math-import-assets/hung-yen-9101-house.png)',['21 m','50 m','34 m','32 m'],'C','SKILL-07')
mc(19,2,r'Hệ phương trình $\begin{cases}2(x+2)-3(y+1)=9\\3(x+1)+2(y-1)=0\end{cases}$ có nghiệm là:',[r'$(x;y)=(-2;3)$',r'$(x;y)=(2;-3)$',r'$(x;y)=(1;-2)$',r'$(x;y)=(-1;2)$'],'C','SKILL-03')
mc(20,3,'Bác An gửi 1 tỉ đồng vào hai ngân hàng A và B, lãi suất A là 6,5% một năm, B là 7% một năm. Sau một năm thu được cả gốc và lãi là 1,067 tỉ đồng. Bác An gửi ngân hàng A bao nhiêu triệu đồng?',['400 triệu đồng','500 triệu đồng','600 triệu đồng','700 triệu đồng'],'C','SKILL-04')
mc(21,3,r'Nghiệm của phương trình $\frac1{x-1}-\frac2{x+2}=0$ là:',['x = 4','x = −4','x = 0','Vô nghiệm'],'A','MATH9-LINEAR-EQUATIONS')
mc(22,3,r'Viết nghiệm tổng quát của phương trình $-2x+y=4$ (với $x\in\mathbb R$ tùy ý):',[r'$(x;-2x-4)$',r'$(x;2x+4)$',r'$(x;2x-4)$',r'$(x;-2x+4)$'],'B','SKILL-03')
mc(23,3,r'Sau khi rút gọn $\frac2{5-\sqrt3}+\frac2{5+\sqrt3}$ là phân số tối giản $\frac ab$ ($a,b\in\mathbb Z,b>0$), giá trị $a+b$ là:',['21','22','16','31'],'A','SKILL-02')
mc(24,3,r'Cho $a>b$, bất đẳng thức nào sau đây đúng?',[r'$-3a+2<-3b-1$',r'$2a-2>2b-3$',r'$3a+3>-3b+3$',r'$2a+5<2b+5$'],'B','MATH9-LINEAR-INEQUALITY')
mc(25,3,'Một khu vườn hình chữ nhật có chu vi 48 m. Nếu tăng chiều rộng lên bốn lần và chiều dài lên ba lần thì chu vi là 162 m. Gọi chiều dài, chiều rộng ban đầu là x m, y m (0 < y < x < 24). Biểu thức thể hiện chu vi sau thay đổi là:',[r'$2(x+y)=162$',r'$2(x+y)=24$',r'$2(3x+4y)=162$',r'$2(4x+3y)=162$'],'C','SKILL-04')
mc(26,3,'Cho hai đường tròn (O; 5 cm) và (O′; 5 cm) cắt nhau tại A và B. Biết OO′ = 8 cm. Độ dài dây cung AB là:',['6 cm','7 cm','5 cm','8 cm'],'A','SKILL-08')

q=base('TRUE_FALSE',1,3,r'Cho biểu thức $A=\frac2{\sqrt x+1}+\frac1{\sqrt x-2}-\frac{\sqrt x-5}{x-\sqrt x-2}$. Xét đúng/sai các ý sau:','SKILL-02')
q['statements']=[dict(key=k,content=t,isCorrect=v) for k,t,v in zip('abcd',[r'Điều kiện xác định là $x\ge0;\ x\ne4$.',r'Kết quả rút gọn bằng $\frac2{\sqrt x-1}$.',r'Với $x=\frac94$ thì $A=4$.',r'Biết $A=\sqrt x$ thì $x=m+n\sqrt3$. Khi đó $m+n=6$.'],[True,False,True,True])]; rows.append(q)
q=base('TRUE_FALSE',2,3,'Cho đường tròn (O,R), điểm A ngoài đường tròn sao cho OA = 2R. Từ A kẻ tiếp tuyến AB (B là tiếp điểm), H là hình chiếu của B lên AO. Xét đúng/sai:','SKILL-08')
q['statements']=[dict(key=k,content=t,isCorrect=v) for k,t,v in zip('abcd',[r'$OH\cdot OA=4R^2$.','Kéo dài BH cắt (O) tại C thì AC là tiếp tuyến của (O).','BC là dây cung chung của đường tròn đường kính AO và (O).','Tam giác ABC là tam giác đều.'],[False,True,True,True])]; rows.append(q)

shorts=[(r'Giá trị $A=3(\sqrt5-2)-\sqrt{45}$ bằng bao nhiêu?','-6','SKILL-02'),(r'Giá trị nguyên dương lớn nhất của $x$ để $M=\frac{2\sqrt x-1}{\sqrt x-2}$ đạt giá trị nguyên là bao nhiêu?','25','SKILL-02'),(r'Cho hình vẽ, tính diện tích phần tô xám theo $cm^2$, biết OA = 20 cm, OC = 5 cm, $\widehat{AOB}=135^\circ$. Lấy $\pi\approx3,14$, làm tròn đến hàng đơn vị.'+'\n\n![Hình nguồn](/math-import-assets/hung-yen-9101-sector.png)','442','SKILL-08'),(r'Cho $a$ là số thực. Giá trị nhỏ nhất của $P=a^2-a+\frac2{a^2+1}+2024$ bằng bao nhiêu?','2025','SKILL-02'),(r'Giá trị $\frac{\cos^2 25^\circ+\cos^2 65^\circ+2}{2\tan20^\circ\cdot\tan70^\circ-1}$ bằng bao nhiêu?','3','SKILL-07'),('Lớp 9A có 40 học sinh, mỗi em ủng hộ đồng bào miền Trung ở mức 20 nghìn đồng hoặc 50 nghìn đồng, tổng 1,7 triệu đồng. Có bao nhiêu học sinh ủng hộ ở mức 50 nghìn đồng?','30','SKILL-04')]
for n,(t,a,s) in enumerate(shorts,1):
    q=base('SHORT_ANSWER',n,4,t,s); q['shortAnswer']=dict(mode='NUMERIC',acceptedAnswers=[a],tolerance=1e-9);rows.append(q)

# Crop actual source figures; do not redraw or synthesize missing geometry.
for page,box,name in [(1,(650,998,826,1176),'clock'),(2,(320,870,583,1045),'house'),(4,(340,290,576,425),'sector')]:
    Image.open(OUT/f'hung-yen-page-{page}.png').crop(box).save(OUT/f'hung-yen-9101-{name}.png')

# Keep a mixed-type pilot first; remaining order retains source numbering.
pilot=[rows[0],rows[26],rows[28]]
rest=[q for q in rows if q not in pilot]
for name,qs in [('pilot',pilot),('batch-002',rest[:30]),('batch-003',rest[30:])]:
    (OUT/f'{name}.json').write_text(json.dumps(dict(batchId=f'hung-yen-9101-{name}',questions=qs),ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'hung-yen-9101-all.json').write_text(json.dumps(dict(batchId='hung-yen-9101-all',questions=rows),ensure_ascii=False,indent=2),encoding='utf8')
print('Prepared',len(rows),'verified transcriptions; batches',len(pilot),len(rest[:30]),len(rest[30:]))
