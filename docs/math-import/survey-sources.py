import json,hashlib,re
from pathlib import Path
from pypdf import PdfReader
import pypdfium2 as pdf
from PIL import Image,ImageDraw
out=Path(__file__).parent
root=out.parents[1]/'tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16'
records=json.loads((root/'nguon.json').read_text(encoding='utf8'))
inventory=[]
for i,r in enumerate(records,1):
    p=root/r['file']; reader=PdfReader(p)
    pages=sorted({1,len(reader.pages),*[n for a in r['type_pages'].values() for n in a[:1]]})
    texts={str(n):reader.pages[n-1].extract_text() or '' for n in pages}
    (out/f'source-{i:02}-sample.txt').write_text('\n\n'.join(f'PAGE {n}\n{t}' for n,t in texts.items()),encoding='utf8')
    doc=pdf.PdfDocument(str(p)); review_pages=sorted({1,*[n for a in r['type_pages'].values() for n in a[:1]]})
    sheet=Image.new('RGB',(600*len(review_pages),880),'white');draw=ImageDraw.Draw(sheet)
    for j,n in enumerate(review_pages):
        im=doc[n-1].render(scale=.9).to_pil();im.thumbnail((590,840));sheet.paste(im,(600*j,30));draw.text((600*j+5,5),f'SOURCE {i:02} PDF PAGE {n}',fill='black')
    sheet.save(out/f'source-{i:02}-overview.png')
    scan=all(len(t.strip())<80 for t in texts.values())
    inventory.append(dict(sourceId=i,name=r['name'],file=r['file'],pages=len(reader.pages),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),sourceUrl=r['source'],typePages=r['type_pages'],samplePages=pages,textClassification='SCAN_OR_NO_TEXT' if scan else 'TEXT_WITH_MATH_LAYOUT',sampleTextCharacters={n:len(t) for n,t in texts.items()},disposition='PILOT_TRANSCRIBED' if i==8 else 'NEEDS_REVIEW',reason='34 câu đã đối chiếu công thức/hình/đáp án mã9101 trang1–5.' if i==8 else ('Không có lớp văn bản có thể dùng; cần OCR và đối chiếu ảnh/đáp án từng câu, không suy diễn loại câu từ tên tệp.' if scan else 'Có văn bản nhưng thứ tự phân số/căn/hệ phương trình bị đảo khi trích xuất; mẫu và trang cần rà soát đã lưu. Chưa đánh dấu VERIFIED cho câu chưa đối chiếu trực quan cùng đáp án.')))
    print(i,r['name'],len(reader.pages),scan,flush=True)
(out/'source-inventory.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf8')
