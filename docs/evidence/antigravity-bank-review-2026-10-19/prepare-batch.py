import json,pathlib,copy,re
root=pathlib.Path('tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16'); qs=[json.loads(l) for l in (root/'05_Bo_sung_theo_ma_tran/revision-03/questions.jsonl').read_text(encoding='utf8').splitlines() if l.strip()];by={q['id']:q for q in qs};out=pathlib.Path('docs/math-import/antigravity-reviewed-2026-10-19');out.mkdir(parents=True,exist_ok=True)
selected=[]
def add(id,skill,level,diff,solution,stem=None,options=None,answer=None,statements=None):
 q=copy.deepcopy(by['CAND-SLOT'+id]); original=copy.deepcopy(q)
 if stem is not None:q['stem']=stem
 if options is not None:q['options']=[{'key':k,'text':v} for k,v in zip('ABCD',options)]
 if answer is not None:q['answer']=answer
 if statements is not None:q['statements']=[{'key':k,'text':v} for k,v in zip('abcd',statements)]
 c=q['classification'];c.update(primarySkillCode=skill,cognitiveLevel=level,difficulty=diff,status='REVIEWED',reviewerType='AI_ASSISTANT',humanApproved=False)
 c['rationale']=solution;c['difficultyStatus']='PROVISIONAL';c['labelReviewStatus']='AI_REVIEWED'
 evidence=c['evidence'];content=q['stem']
 # Renderer accepts TeX arrays, not Markdown tables.
 content=re.sub(r'\\\\(?=[A-Za-z])',lambda _: '\\',content)
 record={'externalId':q['id'],'skillCode':skill,'questionType':{'MULTIPLE_CHOICE':'SINGLE_CHOICE'}.get(q['type'],q['type']),'content':content,'difficulty':diff,'cognitiveLevel':level,'explanation':solution,'status':'PUBLISHED','source':{'file':str(root/evidence['relativePath']).replace('\\','/'),'page':q['questionPages'][0],'questionNumber':f"{q['examCode']} / {q['section']} / {q['questionNumber']}",'reviewStatus':'VERIFIED','externalId':q['id'],'classification':c,'originalExtraction':{'stem':original['stem'],'answer':original['answer']},'review':{'date':'2026-10-19','kind':'AI_SOURCE_AND_MATH_REVIEW','humanApproved':False,'proof':str(root/'05_Bo_sung_theo_ma_tran/revision-03'/q['proofImage']).replace('\\','/'),'explanationOrigin':'MODEL_GENERATED','sourceAnswerPreserved':original['answer'],'changesReviewed':True}}}
 if q['type']=='MULTIPLE_CHOICE':record['options']=[{'optionKey':o['key'],'content':o['text'],'isCorrect':o['key']==q['answer']['correctOption']} for o in q['options']]
 elif q['type']=='SHORT_ANSWER':record['shortAnswer']={'mode':'NUMERIC','acceptedAnswers':[str(q['answer']['value']).replace(',','.')],'tolerance':0}
 else:record['statements']=[{'key':s['key'],'content':s['text'],'isCorrect':q['answer'][s['key']]} for s in q['statements']]
 selected.append(record)
R='REMEMBERING';U='UNDERSTANDING';A='APPLYING';V='ADVANCED_APPLYING'
add('02-01','MATH9-LINEAR-EQUATIONS',R,'EASY','Phương án B là tích hai nhân tử bằng 0; các phương án còn lại là tổng hoặc hiệu.')
add('02-03','MATH9-LINEAR-EQUATIONS',R,'EASY','Hai nghiệm là -2 và 5/2. Trong bốn lựa chọn chỉ A: x=-2 thỏa mãn.')
add('02-04','MATH9-LINEAR-EQUATIONS',R,'EASY','Các mẫu số 3, 2, 4 đều là hằng số khác 0 nên phương trình xác định với mọi số thực.',stem=r'Điều kiện xác định của phương trình $\frac{x}{3}-\frac12+\frac{x-1}{4}=0$ là')
add('02-05','MATH9-LINEAR-EQUATIONS',R,'EASY','Các mẫu khác 0 khi x khác 2 và -2. Chọn C.',stem=r'Điều kiện xác định của phương trình $\frac{1}{x-2}+\frac{2}{x+2}=\frac{3}{(x-2)(x+2)}$ là')
add('02-06','MATH9-LINEAR-EQUATIONS',R,'EASY','Chỉ phương án C có x ở mẫu; các mẫu còn lại là hằng số.',options=[r'$x-\frac{2x}{2025}=0$',r'$\frac12x-\frac13=0$',r'$\frac{x-2026}{x}=0$',r'$\frac{2x-1}{2025}=0$'])
add('10-01','MATH9-CYCLIC-POLYGONS',U,'MEDIUM','Hai góc đối của tứ giác nội tiếp có tổng 180 độ: x+2x=180 nên x=60 độ.')
add('10-02','MATH9-CYCLIC-POLYGONS',U,'MEDIUM',r'Đường chéo hình vuông bằng $a\sqrt2$ là đường kính, nên bán kính bằng $a\sqrt2/2$.')
add('10-03','MATH9-TRIANGLE-CIRCLES',A,'HARD',r'Với tam giác đều, $r=a\sqrt3/6$. Do r=3 nên $a=6\sqrt3$ và diện tích $a^2\sqrt3/4=27\sqrt3$. Chọn B.')
add('10-04','MATH9-CYCLIC-POLYGONS',R,'EASY','Tổng hai góc đối của tứ giác nội tiếp là 180 độ. Đây là câu nhắc lại tính chất, không gắn mức thông hiểu để lấp ma trận.')
add('11-02','MATH9-STATISTICS',R,'EASY','Cột điểm 7 có tần số 6. Chọn A.',stem=r'Bạn Bình thống kê điểm bài thi thử môn Toán của 35 học sinh lớp 9A và ghi lại trong bảng sau. Tần số xuất hiện của điểm 7 là: $\begin{array}{c|rrrrrrrr}\text{Diem}&3&4&5&6&7&8&9&10\\\hline\text{Tan so}&3&3&4&5&6&7&5&2\end{array}$',options=['6','5','8','7'],answer={'correctOption':'A'})
add('11-03','MATH9-STATISTICS',U,'MEDIUM','Số học sinh đạt 800 điểm là 45-15-16-5=9; tần số tương đối 9/45=20%. Chọn C.',options=['11%','80%','20%','9%'])
add('11-04','MATH9-STATISTICS',U,'MEDIUM','Tần số tương đối là 8/40=0,20 (tương đương 20%). Chọn D.')
add('11-REPL01','MATH9-STATISTICS',U,'MEDIUM','Tổng tần số tương đối bằng 100%, nên x=100-5-15-55=25. Chọn D.',stem=r'Bảng tần số tương đối sau cho biết kết quả tập luyện của một vận động viên bắn súng: $\begin{array}{c|rrrr}\text{Diem}&7&8&9&10\\\hline\text{Tan so tuong doi}&5\%&15\%&55\%&x\%\end{array}$. Giá trị của x là')
add('17-01','SKILL-06',V,'VERY_HARD',r'$x_1=2+\sqrt2$. Khi đó $2x_1^4+24x_1+10=194+120\sqrt2=(12+5\sqrt2)^2$. Do đó $A=-2-2\sqrt2$, suy ra a=-2, b=2, c=-2 và $a^2-2bc=12$.',stem=r'Cho phương trình $x^2-4x+2=0$ có hai nghiệm $x_1,x_2$ với $x_1>x_2$. Khi đó $A=\sqrt{2x_1^4+24x_1+10}-7x_1$ có dạng $a\sqrt b+c$ với b là số nguyên tố; a,c là các số nguyên. Hãy tính $a^2-2bc$.',answer={'value':'12'})
add('17-02','SKILL-06',A,'HARD',r'Ta có $x_1=(3+\sqrt5)/2$ và $\sqrt{2x_1^2+x_1+5}=(7+\sqrt5)/2$. Suy ra $P=2+\sqrt5$, a=1,b=2 nên a-2b=-3.',stem=r'Cho phương trình $x^2-3x+1=0$ có hai nghiệm $x_1,x_2$ ($x_1>x_2$). Tính $P=\sqrt{2x_1^2+x_1+5}-x_2$ ta được $P=a\sqrt5+b$ ($a,b\in\mathbb Z$). Tính $a-2b$.')
add('17-03','SKILL-06',V,'VERY_HARD',r'Từ $x_1^2=3x_1+7$ suy ra $x_1^3=16x_1+21$. Biểu thức dưới căn bằng $24x_1+37=73+12\sqrt{37}=(6+\sqrt{37})^2$. Cộng $4x_2$ được $12-\sqrt{37}$, do đó a=-1,b=37,c=12 và T=48.')
add('17-REPL01','SKILL-06',U,'MEDIUM','Theo Viète S=7,P=5 nên tổng bình phương hai nghiệm là S²-2P=49-10=39. Không gắn mức vận dụng cho thao tác công thức trực tiếp.')
add('20-03','MATH9-SOLIDS',U,'MEDIUM',r'Giấy chỉ phủ mặt xung quanh. Diện tích $2\pi rh=2\cdot3{,}14\cdot8\cdot15=753{,}6$, làm tròn được 754 cm².',stem=r'Một lọ thuốc hình trụ có chiều cao 15 cm và bán kính đáy bằng 8 cm. Nhà sản xuất phủ kín mặt xung quanh của lọ thuốc bằng giấy in các thông tin về loại thuốc ấy. Hãy tính diện tích phần giấy cần dùng cho lọ thuốc đó, biết độ dày của giấy in vỏ lọ thuốc không đáng kể (lấy $\pi=3{,}14$ và kết quả làm tròn đến hàng đơn vị của centimét vuông).',answer={'value':'754'})
add('20-04','MATH9-SOLIDS',A,'HARD','Thể tích bể là 2,5×4,8=12 m³=12000 lít. Thời gian chảy đầy là 12000/4800=2,5 giờ.')
add('20-REPL01','MATH9-SOLIDS',U,'MEDIUM','Bán kính 3,2 cm. Thể tích 3,14×3,2²×12=385,8432 cm³, bằng 385,8432 ml; làm tròn hai chữ số thập phân: 385,84 ml.')
add('22-01','MATH9-TRIANGLE-CIRCLES',U,'MEDIUM',r'Góc nội tiếp 45 độ chắn cung 90 độ, nên dây $AB=R\sqrt2=10\sqrt2$. Suy ra R=10 cm.')
add('22-02','MATH9-TRIANGLE-CIRCLES',A,'HARD',r'Gọi AD là đường kính. Hai tam giác AHB và ACD đồng dạng (góc vuông và góc nội tiếp cùng chắn cung AB), suy ra AH/AC=AB/AD nên AH.AD=AB.AC=15 cm².')
add('22-03','MATH9-TRIANGLE-CIRCLES',A,'HARD','Theo hệ thức AB.AC=2R.AH, tích cần tìm bằng 2×5×8=80 cm².')
add('22-05','SKILL-08',A,'HARD',r'Đặt khoảng cách từ O đến dây MN là h, H là chân đường vuông góc. Khi đó AC²=4h²; HM²=16-h², HA²=4-h² và AM²+AN²=2(HM²+HA²)=40-4h². Tổng bằng 40.')
add('13-01','SKILL-04',A,'HARD',r'a đúng vì tổng kế hoạch là 600. b sai: phần tăng thêm phải là 0,18x và 0,21(600-x). c đúng theo tổng tăng 120. Giải phương trình được x=200, tổ II=400; d đúng.',statements=[r'Số sản phẩm của tổ II theo kế hoạch là $600-x$.',r'Số sản phẩm tăng thêm của tổ I là $\frac{118}{100}x$, số sản phẩm tăng thêm của tổ II là $\frac{121}{100}(600-x)$.',r'Theo đề bài ta có phương trình $\frac{18}{100}x+\frac{21}{100}(600-x)=120$.','Theo kế hoạch số sản phẩm được giao của tổ II nhiều hơn tổ I là 200 sản phẩm.'],answer={'a':True,'b':False,'c':True,'d':True})
add('13-05','MATH9-LINEAR-EQUATIONS',A,'HARD',r'Phương trình tương đương $18x^2-6x=6x(3x-1)=0$, nghiệm 0 và 1/3. a đúng, b sai, c đúng, d đúng.',statements=[r'Phương trình (1) xác định mọi $x\in\mathbb R$.',r'Phương trình (1) biến đổi thành tích như sau: $9x(1+3x)=0$.',r'Tích các nghiệm của phương trình (1) bằng 0.',r'Các nghiệm của phương trình (1) là nghiệm của phương trình $3x^2-x=0$.'])
(out/'batch.json').write_text(json.dumps({'batchId':'antigravity-reviewed-2026-10-19','questions':selected},ensure_ascii=False,indent=2),encoding='utf8')
audit=[{'id':q['id'],'decision':'REVIEWED_FOR_IMPORT' if q['id'] in {x['externalId'] for x in selected} else 'QUARANTINED','reason':'Đối chiếu ảnh nguồn và giải độc lập; nhãn theo nội dung, không ép ma trận.' if q['id'] in {x['externalId'] for x in selected} else 'Chưa đủ căn cứ sau các sai lệch trích xuất; cần đối chiếu hoàn chỉnh câu/ảnh/đáp án và nhãn trước khi xuất bản.'} for q in qs]
(out/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8');print(len(selected),'reviewed;',len(qs)-len(selected),'quarantined')
