import json,pathlib,sys
from PIL import Image,ImageOps,ImageDraw
sys.stdout.reconfigure(encoding='utf8')
p=pathlib.Path('tai-lieu/Toan-9-ba-dang-trac-nghiem-2026-10-16/05_Bo_sung_theo_ma_tran/revision-03')
qs=[json.loads(l) for l in (p/'questions.jsonl').read_text(encoding='utf8').splitlines() if l.strip()]
for group in ['02','10','11','17','20','22','13','14','15','16']:
 selected=[q for q in qs if q['id'].startswith('CAND-SLOT'+group) and q.get('sourceVerificationStatus')=='VERIFIED']
 imgs=[]
 for q in selected:
  f=p/q['proofImage'];im=Image.open(f).convert('RGB');im.thumbnail((1050,1100));canvas=Image.new('RGB',(1100,im.height+40),'white');ImageDraw.Draw(canvas).text((10,5),q['id'],fill='black');canvas.paste(im,(10,35));imgs.append(canvas)
 if not imgs:continue
 sheet=Image.new('RGB',(2200,sum(max(i.height for i in imgs[n:n+2]) for n in range(0,len(imgs),2))),'#ddd');y=0
 for n in range(0,len(imgs),2):
  for x,im in enumerate(imgs[n:n+2]):sheet.paste(im,(1100*x,y))
  y+=max(i.height for i in imgs[n:n+2])
 sheet.save('docs/evidence/antigravity-bank-review-2026-10-19/proof-'+group+'.png')
print('sheets ready')
