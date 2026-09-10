from pathlib import Path
import json, openpyxl
from PIL import Image, ImageOps, ImageDraw
from urllib.request import urlopen
from concurrent.futures import ThreadPoolExecutor
import re
from html import unescape

root=Path(__file__).resolve().parents[1]
out=root/'audit'; out.mkdir(exist_ok=True)
w=openpyxl.load_workbook(root/'imagesss'/'namelist .....office.xlsx', data_only=True)
rows=list(w.active.values)
(out/'workbook.json').write_text(json.dumps([dict(zip(rows[0],r)) for r in rows[1:]],ensure_ascii=False,indent=2),encoding='utf-8')
files=[p for p in (root/'imagesss').iterdir() if p.suffix.lower() in ['.png','.jpeg','.jpg']]
sheet=Image.new('RGB',(1000,((len(files)+2)//3)*260),'#eeeae4'); draw=ImageDraw.Draw(sheet)
for i,p in enumerate(files):
    im=ImageOps.exif_transpose(Image.open(p)).convert('RGB'); im.thumbnail((320,215))
    x=(i%3)*333;y=(i//3)*260
    sheet.paste(im,(x+(320-im.width)//2,y))
    draw.text((x+4,y+218),f'{i+1}: {p.name[:45]}',fill='black')
    draw.text((x+4,y+236),f'{Image.open(p).size}',fill='black')
sheet.save(out/'asset-contact-sheet.jpg')
paths=['render_about','orgnizationchart','render_central_members','render_province_members','render_district_members','render_international_members','render_unit_members','render_chairperson','render_rules','render_directot','render_publication','render_notice','render_press','render_tender','render_news','render_other','render_images','render_videos','render_youthactivity','render_youthstats','render_all_posts','portal/contact_page','registermember']
def fetch(p):
    try:
        html=urlopen('https://antwu.org.np/'+p, timeout=30).read().decode('utf-8')
        (out/(p.replace('/','-')+'.html')).write_text(html,encoding='utf-8')
        cleaned=re.sub(r'<(script|style|nav|footer|header)\b[^>]*>.*?</\1>','',html,flags=re.S|re.I)
        def txt(s):return re.sub(r'\s+',' ',unescape(re.sub('<[^>]+>',' ',s))).strip()
        return p,{'text':txt(cleaned),'images':re.findall(r'<img[^>]+src=[\"\x27]([^\"\x27]+)',cleaned),'links':[{'href':a,'text':txt(b)} for a,b in re.findall(r'<a[^>]+href=[\"\x27]([^\"\x27]+)[\"\x27][^>]*>(.*?)</a>',cleaned,re.S)],'tables':[[[txt(c) for c in re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>',tr,re.S)] for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',t,re.S)] for t in re.findall(r'<table[^>]*>(.*?)</table>',cleaned,re.S)]}
    except Exception as e:return p,{'error':str(e)}
data=dict(ThreadPoolExecutor(max_workers=5).map(fetch,paths))
(out/'live-content.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({p:{'text':v.get('text','')[-550:],'images':len(v.get('images',[])),'table_rows':[len(t) for t in v.get('tables',[])]} for p,v in data.items()},ensure_ascii=False,indent=2))
