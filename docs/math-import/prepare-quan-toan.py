import json
from pathlib import Path
from PIL import Image
out=Path(__file__).parent
src=json.loads((out.parents[1]/'tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/nguon.json').read_text(encoding='utf8'))[9]
rows=[]
def base(kind,n,p,t,s):
    return dict(externalId=f'quan-toan-2025-2026-901-{kind}-{n}',questionType=kind,content=t,skillCode=s,status='DRAFT',source=dict(file='tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/'+src['file'].replace('\\','/'),page=p,questionNumber=f'901 / {kind} / {n}',url=src['source'],author='Trường THCS Quán Toan Hải Phòng',year='2025-2026',reviewStatus='VERIFIED'),answerEvidence=dict(pages=[5,6],row='901 (hàng đầu tiên)'),reviewNotes='Đối chiếu ảnh mã901 trang1–2 với bảng đáp án tách đôi trang5–6. Không nhập mã903 trùng nội dung đảo thứ tự.')
def mc(n,t,os,a,s):
    q=base('SINGLE_CHOICE',n,1,t,s);q['options']=[dict(optionKey=k,content=v,isCorrect=k==a) for k,v in zip('ABCD',os)];rows.append(q)
mc(1,'Biển báo trong hình báo trọng tải P tối đa của toàn bộ xe đi qua cầu. P phải thỏa mãn điều kiện nào để đúng quy định biển báo?\n\n![Biển báo nguồn](/math-import-assets/quan-toan-901-sign.png)',[r'$P>10$',r'$P\le10$',r'$P<10$',r'$P\ge10$'],'B','MATH9-LINEAR-INEQUALITY')
mc(2,'Trong các hình dưới đây, hình nào minh họa góc ở tâm?\n\n![Hình nguồn](/math-import-assets/quan-toan-901-angles.png)',['Hình 3','Hình 1','Hình 4','Hình 2'],'A','SKILL-08')
mc(3,'Tam giác MNP vuông tại M, MN = 9 cm, MP = 12 cm. Khi đó cos N bằng:',[r'$\frac43$',r'$\frac35$',r'$\frac34$',r'$\frac45$'],'B','SKILL-07')
mc(4,'Căn bậc hai số học của 7 là:',[r'$\pm\sqrt7$',r'$\sqrt7$','49',r'$-\sqrt7$'],'B','SKILL-01')
mc(5,r'Hệ phương trình $\begin{cases}2x+y=-3\\x+3y=1\end{cases}$ có nghiệm là:',['(−2;1)','(2;1)','(−2;−1)','(2;−1)'],'A','SKILL-03')
mc(6,'Tam giác ABC vuông tại A, đường cao AH. Chọn khẳng định sai:',[r'$\tan C=\frac{AH}{AC}$',r'$\sin B=\frac{AH}{AB}$',r'$\cos C=\frac{AC}{BC}$',r'$\tan B=\frac{AC}{AB}$'],'A','SKILL-07')
mc(7,'Hai đường tròn (O;6 cm), (O′;2 cm), OO′ = 9 cm. Vị trí tương đối của hai đường tròn là:',['Cắt nhau','Ở ngoài nhau','Tiếp xúc trong','Tiếp xúc ngoài'],'B','SKILL-08')
mc(8,'Hai tiếp tuyến tại B,C của (O) cắt nhau tại A. Chọn khẳng định sai:',['OA là đường trung trực của BC.',r'$OA\perp BC$.',r'$OA\perp BC$ tại trung điểm của OA.','AB = AC.'],'C','SKILL-08')
mc(9,'Hệ phương trình nào là hệ phương trình bậc nhất hai ẩn?',[r'$\begin{cases}0x+0y=2\\x-3y=1\end{cases}$',r'$\begin{cases}x+\sqrt3y=-2\\2x-y=\sqrt5\end{cases}$',r'$\begin{cases}x+y=0\\-x^2+2y=3\end{cases}$',r'$\begin{cases}x^2+3y=2\\2y-x=3\end{cases}$'],'B','SKILL-03')
mc(10,r'Điều kiện để $\sqrt{1-4x}$ xác định là:',[r'$x\ge\frac14$',r'$x\le\frac14$',r'$x\le-\frac14$',r'$x\ge-\frac14$'],'B','SKILL-01')
mc(11,'Cho (O;5 cm), điểm M cách O 13 cm. Vẽ tiếp tuyến MA (A là tiếp điểm). Độ dài MA là:',['10 cm','6 cm','12 cm','8 cm'],'C','SKILL-08')
mc(12,r'Số nào không là nghiệm của bất phương trình $2x-4\ge0$?',[r'$\sqrt5$',r'$\frac{11}5$','2',r'$\sqrt3$'],'D','MATH9-LINEAR-INEQUALITY')
def tf(n,t,ss,ans,s):
    q=base('TRUE_FALSE',n,1,t,s);q['statements']=[dict(key=k,content=v,isCorrect=a) for k,v,a in zip('abcd',ss,ans)];rows.append(q)
tf(1,r'Cho bất đẳng thức $a\ge b$. Xét các khẳng định:',[r'$(2-\sqrt5)a\ge(2-\sqrt5)b$.',r'$\sqrt{2025a}-2026\le\sqrt{2025b}-2026$.',r'$-5a\le-5b$.',r'$3-m^2a\le3-m^2b$ với $m<0$.'],[False,False,True,True],'MATH9-LINEAR-INEQUALITY')
tf(2,r'Cho $A=\frac{\sqrt x-3}{\sqrt x+3}$ và $B=\frac3{\sqrt x+3}+\frac{3\sqrt x+27}{x-9}$. Xét các khẳng định:',[r'Giá trị $P=A\cdot B$ tại $x=3$ là 1.',r'Rút gọn $B=\frac6{\sqrt x-3}$.',r'Điều kiện để B không âm là $x\ge9$.',r'Điều kiện xác định A,B là $x\ge0,\ x\ne9$.'],[False,True,False,True],'SKILL-02')
tf(3,'Ô tô đi AB với 60 km/h, tiếp BC với 50 km/h. Tổng AB,BC = 190 km; thời gian đi AB ít hơn BC 30 phút. Gọi x,y giờ là thời gian đi AB,BC. Xét các khẳng định:', ['Thời gian đi AB là 1,5 giờ.',r'Điều kiện $x,y\in\mathbb N,\ y>0,5$.','AB dài 60x km, BC dài 50y km.','Phương trình liên hệ thời gian là y − x = 30.'],[True,False,True,False],'SKILL-04')
tf(4,r'Tam giác ABC vuông tại A, AB = 5 cm, $\widehat{ACB}=40^\circ$. Đường tròn tâm I đường kính AB cắt BC ở M. Xét các khẳng định:',[r'$AM\perp BC$.','Đường tròn đường kính AC đi qua M.',r'Độ dài cung nhỏ BM là $\frac{10}9$ cm.',r'Diện tích đường tròn $(I,IA)$ bằng $\frac{25}2\pi$ cm².'],[True,True,False,False],'SKILL-08')
shorts=[(1,'Mặt đĩa CD có dạng vành khuyên giới hạn bởi hai đường tròn bán kính 1,5 cm và 5 cm. Diện tích bao nhiêu cm²? Lấy π = 3,14, làm tròn đến hàng đơn vị.\n\n![Đĩa CD nguồn](/math-import-assets/quan-toan-901-disc.png)','71','SKILL-08'),(2,r'Cho $x\ge16$. Tìm giá trị lớn nhất $A=\frac{\sqrt{x-16}}{3x}$, làm tròn đến chữ số thập phân thứ hai.','0.04','SKILL-02'),(2,r'Biết $\alpha=30^\circ$. Tính $M=\sin\alpha-2\cos\alpha$, làm tròn đến hàng phần trăm.','-1.23','SKILL-07'),(2,r'Tính $A=\frac{\sqrt5-5}{1-\sqrt5}-\sqrt{(2-\sqrt5)^2}$.','2','SKILL-02'),(2,'Kì thi gồm Toán, Ngữ văn, Tiếng Anh: Toán và Ngữ văn hệ số 2, Tiếng Anh hệ số 1. Điểm trung bình ít nhất 8 để trúng tuyển. An được Toán 9,25, Tiếng Anh 7,75. Điểm Ngữ văn tối thiểu bao nhiêu, làm tròn đến chữ số thập phân thứ nhất?','6.9','MATH9-LINEAR-INEQUALITY'),(2,r'Thiết bị chiếu sáng B gắn trên tường AB, cao 2,95 m, góc chiếu $\widehat{DBC}=25^\circ$. Vùng sáng bắt đầu C cách chân tường A 1,88 m. Tính độ dài CD (m); làm tròn góc đến độ, độ dài đến chữ số thập phân thứ nhất.'+'\n\n![Hình nguồn](/math-import-assets/quan-toan-901-light.png)','2.8','SKILL-07')]
for n,(p,t,a,s) in enumerate(shorts,1):
    q=base('SHORT_ANSWER',n,p,t,s);q['shortAnswer']=dict(mode='NUMERIC',acceptedAnswers=[a],tolerance=1e-9);rows.append(q)
for p,box,name in [(1,(410,332,554,472),'sign'),(1,(264,515,707,640),'angles'),(2,(375,62,592,272),'disc'),(2,(348,710,624,931),'light')]:
    Image.open(out/f'quan-toan-page-{p}.png').crop(box).save(out/f'quan-toan-901-{name}.png')
(out/'batch-005-quan-toan.json').write_text(json.dumps(dict(batchId='quan-toan-901',questions=rows),ensure_ascii=False,indent=2),encoding='utf8')
print('Prepared',len(rows))
