import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd();
const excerpt=JSON.parse(fs.readFileSync('content/thpt-materials/questions.json')).items;
const catalog=JSON.parse(fs.readFileSync('content/thpt-materials/catalog.json')).items;
const candidates=fs.readFileSync('outputs/thpt-300-papers/questions-candidates.jsonl','utf8').trim().split('\n').map(JSON.parse);
const keys={10:'ADDDCAA DCBAC'.replaceAll(' ',''),11:'CBDCBDDCA AAD'.replaceAll(' ',''),12:'CCCAAABCADDB'};
const topics={10:['0403','0102','0101','0501','0101','0102','0201','0501','0403','0202','0302','0401','0503','0401','0502','0401','0403','0503'],11:['0405','0401','0201','0301','0502','0202','0103','0101','0402','0102','0104','0302','0404','0503','0203','0501','0102','0302'],12:['0201','0201','0101','0201','0103','0104','0301','0301','0203','0202','0302','0102','0203','0104','0201','0301','0203','0105']};
const proofs={
10:[
'Hệ số của i và j lần lượt là 3 và −9 nên tọa độ vectơ là (3; −9).',
'Các phần tử thuộc A nhưng không thuộc B là 0 và 1.',
'Phủ định của mệnh đề với mọi là tồn tại; phủ định của > 0 là ≤ 0.',
'Sai số tuyệt đối là giá trị tuyệt đối của hiệu giữa số gần đúng và số đúng.',
'Nhận xét ăn phở rất ngon mang tính chủ quan, không có giá trị đúng/sai xác định.',
'Các số tự nhiên không lớn hơn 5 là 0, 1, 2, 3, 4, 5.',
'Thay N(2; −2) vào 2x − y được 6 > 5. Các điểm còn lại cho 5, 1, −3 nên không thỏa.',
'Sĩ số 40 học sinh là số đếm chính xác; các số đo và số ước lượng ở phương án khác là số gần đúng.',
'Đuôi vectơ ở (1; 0), đầu ở (3; 3), nên tọa độ vectơ là (3 − 1; 3 − 0) = (2; 3).',
'Chỉ B gồm hai bất phương trình bậc nhất hai ẩn. A chứa xy, C chứa x², D có phương trình thay cho bất phương trình.',
'Định lí côsin: a² = b² + c² − 2bc cos A.',
'Đổi thứ tự các số hạng rồi dùng quy tắc đa giác: AB + BC + CD + DA là vectơ không.',
'a) Sai: giá trị nhỏ nhất là 3,4, không thuộc Tây Nguyên. b) Đúng: tổng 28,2 chia 6 bằng 4,7. c) Đúng: 6,5 − 3,4 = 3,1. d) Đúng: cộng cùng một hằng số không làm thay đổi độ lệch chuẩn.',
'a) Sai: O nằm trên BD. b) Đúng: O là trung điểm AC nên OA = −AC/2. c) Đúng: cả hai vế bằng BD. d) Đúng: độ dài BD = √(4² + 3²) = 5.',
'Trung bình lượng mưa là (120 + 150 + 180 + 200 + 250)/5 = 180.',
'Vì AC = AB + AD nên 2AB − AC = AB − AD. Hai vectơ AB, AD vuông góc, cùng độ dài 3√2 nên độ dài hiệu là √(18 + 18) = 6.',
'Từ A(120; −50) đến B(180; 30) trong 2 giờ, vận tốc là (30; 40). Sau thêm 3 giờ, C = (270; 150). Do đó x − 2y = 270 − 300 = −30.',
'Giá trị lớn nhất 65, nhỏ nhất 43; khoảng biến thiên bằng 22.'
],
11:[
'Phép chiếu song song của hình tròn nói chung là một elip, không nhất thiết là hình tròn. Do đó C là khẳng định sai.',
'Đường thẳng nằm trong mặt phẳng được kí hiệu a ⊂ (P). Kí hiệu a ∈ (P) không đúng quan hệ này.',
'1/5 > 1/10 > 1/15, nên dãy ở D giảm.',
'Các nhóm trước 12 giây có tổng tần số 2 + 4 + 7 = 13.',
'Đa thức liên tục tại 1; giới hạn bằng 2 − 3 + 1 = 0.',
'Với uₙ = 7n + 2, số hạng đầu u₁ = 9.',
'cos(−x) = cos x trên miền xác định đối xứng nên hàm cos là hàm chẵn.',
'15° = 15π/180 = π/12 radian.',
'M, N là trung điểm SA, SB nên MN song song AB. Trong hình bình hành, AB song song CD; do đó MN song song CD.',
'Công thức cộng: sin(a + b) = sin a cos b + cos a sin b.',
'sin x = 0 khi và chỉ khi x = kπ, k là số nguyên.',
'Nhóm [40; 50) có tần số lớn nhất bằng 15 nên là nhóm chứa mốt.',
'a) Đúng: S, O cùng thuộc (SAC), (SBD). b) Sai: đường trung bình MO của tam giác SAC song song SC. c) Đúng: MN song song BC và MO song song SC nên (MNO) song song (SBC). d) Đúng: MO song song SC và không nằm trong (SBC).',
'a) Đúng: nhánh x² + 1 liên tục quanh 2. b) Sai: f(0) = 1. c) Sai: giới hạn bên phải bằng 1. d) Đúng: giới hạn trái bằng −1 khác giới hạn phải bằng 1.',
'Cấp số nhân có u₅ = u₁q⁴ = 2 × 3⁴ = 162.',
'Chia tử và mẫu cho n²: giới hạn bằng 1/7. Do 1/a = 1/7 nên a = 7.',
'Dùng sin u − sin v = 2 sin((u − v)/2) cos((u + v)/2): a = −1/8, b = 3/16; 4a + 8b = −1/2 + 3/2 = 1.',
'Trung điểm các nhóm là 2, 6, 10, 14, 18. Trung bình bằng (2×2 + 6×4 + 10×7 + 14×4 + 18×3)/20 = 10,4.'
],
12:[
'Hai mặt đối diện hình hộp bằng nhau và cùng hướng tương ứng: B’D’ = BD.',
'Cộng ba vectơ cạnh xuất phát từ A’ theo quy tắc hình hộp được vectơ đường chéo A’C.',
'Đạo hàm đổi dấu + sang − tại −1 và − sang + tại 1. Tại 0 không đổi dấu. Hàm số có hai điểm cực trị.',
'Quy tắc ba điểm: AB + BC = AC; phép cộng vectơ có tính giao hoán.',
'Mẫu số bằng 0 tại x = 2, trong khi tử bằng 8 khác 0, nên tiệm cận đứng là x = 2.',
'Đồ thị có tiệm cận đứng x = −1, ngang y = 1, đi qua (0; −1) và (1; 0). Phương án A thỏa các đặc điểm này.',
'Giá trị đại diện của nhóm [155; 160) là trung điểm (155 + 160)/2 = 157,5.',
'Khoảng biến thiên của mẫu ghép nhóm là 5 − 2 = 3.',
'b − a = (−2 − (−1); 0 − 3; 3 − (−2)) = (−1; −3; 5).',
'Các hệ số của i, j, k lần lượt là 1, −2, −1 nên u = (1; −2; −1).',
'D sai: nếu độ lệch chuẩn là 0,5 thì phương sai là 0,25, nhỏ hơn độ lệch chuẩn. A, B, C là các tính chất đúng.',
'Từ đồ thị trên đoạn đã cho, giá trị lớn nhất 4 và nhỏ nhất −3. Tổng bằng 1.',
'a) Đúng: C’ = (2; 3; 4). b) Sai: tâm hộp là (1; 1,5; 2). c) Sai: AC’ = (2; 3; 4), CD’ = (−2; 0; 4), tích vô hướng bằng 12. d) Sai: chu vi AB’D’ bằng √20 + 5 + √13 ≈ 13,078 < 13,5.',
'Viết y = 3 − 4/(x + 2). a) Sai: f(0) = 1. b) Sai: hàm không xác định tại −2 nên không đồng biến trên toàn R. c) Đúng: đạo hàm 4/(x + 2)² > 0 trên mỗi khoảng xác định, không có cực trị. d) Đúng: hai tiệm cận x = −2, y = 3 cắt nhau tại (−2; 3).',
'Vì −DA = AD, tích cần tính là AB·(AB + AD) = |AB|² + |AB||AD|cos 60° = 4 + 2 = 6.',
'Có 100 số liệu. Q₁ = 4 + 2(25 − 12)/20 = 5,3; Q₃ = 8 + 2(75 − 69)/21 = 60/7. Q₃ − Q₁ = 229/70 ≈ 3,2714286, làm tròn hai chữ số được 3,27.',
'Đối xứng M(3; 3; −2) qua Oy được N(−3; 3; 2). MN = √(6² + 0² + (−4)²) = √52 ≈ 7,2 khi làm tròn một chữ số.',
'Đặt t = CM thuộc [0; 9]. Chi phí triệu đồng C(t) = 30(9 − t) + 50√(t² + 36). C’(t) = −30 + 50t/√(t² + 36), triệt tiêu tại t = 4,5 và đổi dấu âm sang dương. Chi phí nhỏ nhất bằng 30×4,5 + 50×7,5 = 510 triệu đồng.'
]};
fs.mkdirSync('public/math-import-assets',{recursive:true});
const questions=excerpt.filter(q=>q.orderIndex<=18).map(q=>{
 const old=candidates.find(c=>c.paperId===q.paperId&&c.externalId.endsWith(q.id.slice(-4)));
 if(!old)throw Error('Missing transcription '+q.id);
 const options=structuredClone(old.options||[]),statements=structuredClone(old.statements||[]);
 const n=q.orderIndex,g=q.grade;
 const opt=(key,content)=>{options.find(o=>o.key===key).content=content;};
 if(g===10&&n===1)opt('D','$(-9; 6)$');
 if(g===10&&n===4){opt('A','$\\Delta_a = |\\overline{a}+a|$');opt('C','$\\Delta_a = \\overline{a}-a$');}
 if(g===10&&n===10){opt('A','$\\begin{cases}x+2xy>2024\\\\2x-y<2025\\end{cases}$');opt('D','$\\begin{cases}x+y>2024\\\\2x-y=2025\\end{cases}$');}
 if(g===11&&n===11)opt('C','$x = \\dfrac{\\pi}{2}+k\\pi\\;(k\\in\\mathbb{Z})$');
 if(g===12&&n===6){opt('B','$y=\\dfrac{x^2+3x+1}{x+3}$');opt('D','$y=\\dfrac{-2x+1}{2x+2}$');}
 if(g===12&&n===9){opt('A','$(-1;-3;5)$');opt('B','$(-3;3;1)$');}
 if(g===12&&n===13){statements[2].content='Tích vô hướng $\\vec{AC\'}\\cdot\\vec{CD\'}$ bằng $16$.';statements[3].content='Chu vi tam giác $AB\'D\'$ lớn hơn $13{,}5$.';}
 const files=q.images.map((name,i)=>{
  const bytes=fs.readFileSync(path.join('content/thpt-materials/question-images',name));
  const hash=createHash('sha256').update(bytes).digest('hex');
  if(hash!==q.imageHashes[i])throw Error('Image hash mismatch');
  const file=`thpt-question-${hash}.png`,dest=path.join('public/math-import-assets',file);
  if(fs.existsSync(dest)){if(!fs.readFileSync(dest).equals(bytes))throw Error('Immutable asset conflict');}else fs.writeFileSync(dest,bytes,{flag:'wx'});
  return file;
 });
 const topic=topics[g][n-1],paper=catalog.find(p=>p.id===q.paperId);
 return {externalId:q.id,grade:g,skillCode:`KNTT-${g}-C${topic.slice(0,2)}-T${topic.slice(2)}`,questionType:q.originalType,
 content:files.map((f,i)=>`![Câu ${q.originalItemNumber} · phần ${q.part} · bản gốc${files.length>1?` (${i+1}/${files.length})`:''}](/math-import-assets/${f})`).join('\n'),
 explanation:proofs[g][n-1],difficulty:n===18&&g===12?'HARD':'MEDIUM',cognitiveLevel:n>=15?'APPLYING':'UNDERSTANDING',
 ...(n<=12?{options,correctOption:keys[g][n-1]}:n<=14?{statements}:{shortAnswer:{...old.shortAnswer,tolerance:1e-9}}),
 source:{paperId:q.paperId,originalExamCode:q.examCode,part:q.part,questionNumber:String(q.originalItemNumber),sourcePages:q.sourcePages,answerPages:g===12?[9,10]:[7,8],pdfSha256:paper.sha256,sourcePageUrl:paper.sourcePageUrl,immutableImages:files,reviewStatus:'SOURCE_KEY_AND_SOLUTION_CHECKED',reviewMethod:'CODEX_SOURCE_COMPARISON_AND_INDEPENDENT_SOLUTION',peerReviewed:false,classification:{status:'PROVISIONAL',method:'CODEX_CURRICULUM_MAPPING'},importBatchId:'thpt-phuloc-source-54-v1'}};
});
if(questions.length!==54||Object.values(keys).some(k=>k.length!==12))throw Error('Wrong batch shape');
fs.mkdirSync('content/thpt-reviewed',{recursive:true});
fs.writeFileSync('content/thpt-reviewed/batch.json',JSON.stringify({batchId:'thpt-phuloc-source-54-v1',questions},null,2)+'\n');
console.log('Prepared 54 objective questions with immutable original source images. Essays excluded.');
