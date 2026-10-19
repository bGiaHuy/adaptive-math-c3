import json
from pathlib import Path
out=Path(__file__).parent
sources=json.loads((out.parents[1]/'tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/nguon.json').read_text(encoding='utf8'))
rows=[]
def mc(i,n,t,os,a,s):
    src=sources[i-1];p=src['type_pages']['nhieu_lua_chon'][0]
    rows.append(dict(externalId=f'specialist-{i}-SC-{n}',questionType='SINGLE_CHOICE',content=t,skillCode=s,status='DRAFT',options=[dict(optionKey=k,content=v,isCorrect=k==a) for k,v in zip('ABCD',os)],source=dict(file='tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/'+src['file'].replace('\\','/'),page=p,questionNumber=f'PHẦN I / {n}',url=src['source'],author='Trương Ngọc Vỹ',reviewStatus='VERIFIED'),answerEvidence=dict(page=p,encoding='Phương án đúng được nguồn tô đỏ; đối chiếu ảnh supplement-source-'+str(i)+'.png'),reviewNotes='Mẫu chuyên đề: đối chiếu công thức, từng phương án và phương án đỏ. Không suy diễn từ thứ tự văn bản hay màu tiêu đề.'))
mc(1,1,'Phương trình nào sau đây không phải phương trình bậc nhất hai ẩn?',[r'$2025x-2026y+2027=0$',r'$\frac12y-\frac{2026}{2027}=0$',r'$\frac12x-2y=0$',r'$2x+y^2-2=0$'],'D','SKILL-03')
mc(1,5,r'Phương trình $x-3y+1=0$ nhận cặp số nào sau đây là nghiệm?',['(1;−1)','(−1;0)','(2;−1)',r'$(0;-\frac13)$'],'B','SKILL-03')
mc(1,4,'Phương trình nào dưới đây nhận cặp số (−2;4) làm nghiệm?',[r'$x-2y=0$',r'$2x+y=0$',r'$x-y=2$',r'$x+2y+1=0$'],'B','SKILL-03')
mc(2,3,r'Cho $(x+2)(5-2x)=0$. Giá trị x nào sau đây là nghiệm?',['x = −2','x = 2','x = 1','x = −1'],'A','MATH9-LINEAR-EQUATIONS')
mc(2,4,r'Cho $(\frac x2-1)(1-3x)=0$. Giá trị x nào sau đây là nghiệm?',['x = −2','x = 4','x = 3',r'$x=\frac13$'],'D','MATH9-LINEAR-EQUATIONS')
mc(2,8,r'Tìm m để $(m-5x)(1-3x)=0$ có nghiệm x = 1.',['m = −5','m = 5','m = −2','m = 2'],'B','MATH9-LINEAR-EQUATIONS')
mc(3,1,r'Giá trị của hàm số $y=f(x)=-7x^2$ tại $x_0=-2$ là:',['28','14','21','−28'],'D','SKILL-05')
mc(3,2,r'Giá trị của hàm số $y=f(x)=\frac45x^2$ tại $x_0=-5$ là:',['20','10','4','−20'],'A','SKILL-05')
mc(3,4,'Điểm A(−2;−1) thuộc đồ thị hàm số nào?',[r'$y=3x^2$',r'$y=-3x^2$',r'$y=\frac14x^2$',r'$y=-\frac14x^2$'],'D','SKILL-05')
mc(4,1,'Cho (O;R), điểm M bất kỳ biết OM = R. Chọn khẳng định đúng:',['M nằm ngoài (O;R).','M nằm trên (O;R).','M nằm trong (O;R).','M không thuộc (O;R).'],'B','SKILL-08')
mc(4,4,'Trên mặt phẳng Oxy, xác định vị trí điểm A(−1;−1) với đường tròn tâm gốc tọa độ O, bán kính R = 2.',['A nằm ngoài đường tròn.','A nằm trên đường tròn.','A nằm trong đường tròn.','Không kết luận được.'],'C','SKILL-08')
mc(4,5,'Trên mặt phẳng Oxy, xác định vị trí điểm A(−3;−4) với đường tròn tâm gốc tọa độ O, bán kính R = 3.',['A nằm ngoài (O;3).','A nằm trên (O;3).','A nằm trong (O;3).','Không kết luận được.'],'A','SKILL-08')
mc(5,1,'Góc nội tiếp nhỏ hơn hoặc bằng 90° có số đo:',['Bằng nửa số đo góc ở tâm cùng chắn một cung.','Bằng số đo góc ở tâm cùng chắn một cung.','Bằng số đo cung bị chắn.','Bằng nửa số đo cung lớn.'],'A','SKILL-08')
mc(5,2,'Góc nội tiếp chắn nửa đường tròn bằng bao nhiêu độ?',[r'$45^\circ$',r'$90^\circ$',r'$60^\circ$',r'$120^\circ$'],'B','SKILL-08')
mc(5,3,'Khẳng định nào sau đây sai?',['Trong một đường tròn, góc nội tiếp chắn nửa đường tròn là góc vuông.','Trong một đường tròn, hai góc nội tiếp bằng nhau chắn hai cung bằng nhau.','Trong một đường tròn, hai góc nội tiếp cùng chắn một cung thì bằng nhau.','Trong một đường tròn, hai góc nội tiếp bằng nhau thì cùng chắn một cung.'],'D','SKILL-08')
mc(6,3,'Cho a,b là hai số không âm. Khẳng định nào sau đây đúng?',[r'$\sqrt{ab}=a\sqrt b$',r'$\sqrt a\sqrt b=b\sqrt a$',r'$\sqrt{ab}=\sqrt a\cdot\sqrt b$',r'$\sqrt{ab}=\frac{\sqrt a}{\sqrt b}$'],'C','SKILL-02')
mc(6,4,'Cho a không âm, b,c dương. Khẳng định nào sau đây sai?',[r'$\sqrt{\frac{ac}b}=\frac{\sqrt{ac}}{\sqrt b}$',r'$\frac{\sqrt{ab}}{\sqrt c}=\sqrt{\frac{ab}c}$',r'$\sqrt a\sqrt b\sqrt c=\sqrt{abc}$',r'$\frac{\sqrt a}{\sqrt{bc}}=\frac{\sqrt{ab}}{\sqrt c}$'],'D','SKILL-02')
mc(6,6,'Cho số thực a. Khẳng định nào sau đây sai?',[r'Với $a\ge0,b\ge0$, nếu $a<b$ thì $\sqrt a<\sqrt b$.',r'Với $a\ge0,b\ge0$, nếu $\sqrt a<\sqrt b$ thì $a<b$.',r'Nếu $a<b$ thì $\sqrt[3]a>\sqrt[3]b$.',r'Nếu $\sqrt[3]a<\sqrt[3]b$ thì $a<b$.'],'C','MATH9-CUBE-ROOTS')
mc(7,1,r'Với mọi góc nhọn $\alpha$, ta có:',[r'$\cot(90^\circ-\alpha)=\cos\alpha$',r'$\tan(90^\circ-\alpha)=\cos\alpha$',r'$\cot(90^\circ-\alpha)=\sin\alpha$',r'$\tan^2(90^\circ-\alpha)=\cot^2\alpha$'],'D','SKILL-07')
mc(7,3,r'Cho góc nhọn $\alpha$. Chọn khẳng định sai:',[r'$\cot\alpha=\frac1{\tan\alpha}$',r'$\tan^2\alpha\cdot\cot^2\alpha=1$',r'$0<\sin\alpha<1$',r'$0<\cot\alpha<1$'],'D','SKILL-07')
mc(7,4,r'Cho hai góc nhọn $\alpha+\beta=90^\circ$. Khẳng định nào đúng?',[r'$\tan\alpha=\sin\beta$',r'$\tan\alpha=\cot\beta$',r'$\tan\alpha=\cos\beta$',r'$\tan\alpha=\tan\beta$'],'B','SKILL-07')
(out/'batch-006-specialist-samples.json').write_text(json.dumps(dict(batchId='specialist-samples-7-sources',questions=rows),ensure_ascii=False,indent=2),encoding='utf8')
print('Prepared',len(rows))
