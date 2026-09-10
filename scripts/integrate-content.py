from pathlib import Path
import json, shutil, re
from PIL import Image, ImageOps

root=Path(__file__).resolve().parents[1]
source=root/'imagesss'; assets=root/'public/assets/official'; assets.mkdir(parents=True,exist_ok=True)
downloads=root/'public/downloads'; downloads.mkdir(exist_ok=True)
def loc(en,ne):return {'en':en,'ne':ne}
mapping={
'20240624_173907.jpg.jpeg':'union-gathering',
'flag logo.jpeg':'union-flag',
'WhatsApp Image 2026-09-07 at 12.28.24 PM (1).jpeg':'taxi-outreach-1',
'WhatsApp Image 2026-09-07 at 12.28.25 PM.jpeg':'taxi-outreach-2',
'WhatsApp Image 2026-09-07 at 12.31.02 PM.jpeg':'workers-meeting',
'WhatsApp Image 2026-09-07 at 12.36.23 PM (1).jpeg':'taxi-delegation-1',
'WhatsApp Image 2026-09-07 at 12.36.23 PM (2).jpeg':'outdoor-discussion',
'WhatsApp Image 2026-09-07 at 12.36.23 PM.jpeg':'taxi-delegation-2',
'WhatsApp Image 2026-09-07 at 12.57.59 PM.jpeg':'office-meeting',
'WhatsApp Image 2026-09-07 at 12.28.24 PM.jpeg':'taxi-campaign',
'WhatsApp Image 2026-09-07 at 12.39.42 PM.jpeg':'press-release'}
manifest=[]
for name,target in mapping.items():
    im=ImageOps.exif_transpose(Image.open(source/name)).convert('RGB'); im.thumbnail((1600,1600))
    im.save(assets/(target+'.webp'),'WEBP',quality=82,method=6)
    manifest.append({'source':name,'output':'/assets/official/'+target+'.webp','originalBytes':(source/name).stat().st_size,'optimizedBytes':(assets/(target+'.webp')).stat().st_size,'width':im.width,'height':im.height})
    if target in ['taxi-campaign','press-release']:shutil.copyfile(source/name,downloads/(target+'.jpg'))
shutil.copyfile(source/'logo.png',assets/'logo.png')
(root/'audit/assets.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
rows=json.loads((root/'audit/workbook.json').read_text(encoding='utf-8'))
roles={'chairman':loc('Chairperson','अध्यक्ष'),'senior vice president':loc('Senior Vice President','वरिष्ठ उपाध्यक्ष'),'vice president':loc('Vice President','उपाध्यक्ष'),'secretary general':loc('General Secretary','महासचिव'),'deputy general secretary':loc('Deputy General Secretary','उपमहासचिव'),'secretary':loc('Secretary','सचिव'),'treasure':loc('Treasurer','कोषाध्यक्ष'),'member':loc('Member','सदस्य')}
members=[]
for row in rows:
    name=re.sub(r'\s+',' ',row['name'].strip()).title()
    name=re.sub(r'\bK\.c\b','K.C.',name)
    members.append({'id':f"central-{row['s.no']:03}",'name':loc(name,name),'role':roles[row['position'].strip()],'category':'Central','location':loc('Central Committee','केन्द्रीय समिति'),'image':'','accent':'red','phone':str(row['phone']) if row['phone'] else '', 'status':'Published','order':row['s.no']})
photo_titles={
'union-gathering':loc('Union members together','एकसाथ संघका सदस्यहरू'),
'taxi-outreach-1':loc('Meeting transport workers','यातायात श्रमिकसँग भेटघाट'),
'taxi-outreach-2':loc('Conversations on the road','सडकमा संवाद'),
'workers-meeting':loc('Workers in discussion','छलफलमा श्रमिकहरू'),
'taxi-delegation-1':loc('Taxi workers together','एकसाथ ट्याक्सी श्रमिकहरू'),
'outdoor-discussion':loc('A conversation among members','सदस्यहरूबीच संवाद'),
'taxi-delegation-2':loc('Transport workers gathering','यातायात श्रमिकहरूको भेटघाट'),
'office-meeting':loc('Discussion at the union office','संघ कार्यालयमा छलफल')}
galleries=[{'id':k,'title':v,'image':'/assets/official/'+k+'.webp','type':'photo','size':'wide','status':'Published','order':i} for i,(k,v) in enumerate(photo_titles.items())]
about_ne='अखिल नेपाल यातायात मजदुर संघ (All Nepal Transport Workers’ Union) नेपालमा यातायात क्षेत्रमा काम गर्ने मजदुरहरूको हित र अधिकारको रक्षा गर्ने उद्देश्यले स्थापित एक श्रमिक संगठन हो। यो संघ नेपालमा यातायात मजदुरहरूको एकता, अधिकार, र कल्याणका लागि काम गर्दछ।\n\nस्थापना इतिहास\nअखिल नेपाल यातायात मजदुर संघको स्थापना नेपालमा श्रमिक आन्दोलनको ऐतिहासिक पृष्ठभूमिमा भएको हो। नेपालमा श्रमिक संघहरूको उदय २०औं शताब्दीको मध्यदेखि भएको थियो। संघ दर्ता २०६३/१२/१५ गते भएको र दर्ता नम्बर १५६ श्रम विभागमा दर्ता भएको देखिन्छ। यातायात क्षेत्रमा काम गर्ने मजदुरहरूले आफ्नो अधिकार र हितको रक्षा गर्ने उद्देश्यले यो संघ स्थापना गरेका हुन्।\n\nउद्देश्य\n१. यातायात मजदुरहरूको आर्थिक, सामाजिक, र कानूनी अधिकारको रक्षा गर्नु।\n२. मजदुरहरूको कामको स्थिति र जीवनस्तरमा सुधार ल्याउनु।\n३. यातायात क्षेत्रमा काम गर्ने मजदुरहरू बीच एकता र सहकार्य बढाउनु।\n४. मजदुरहरूको शिक्षा, स्वास्थ्य, र कल्याणका लागि कार्यक्रमहरू सञ्चालन गर्नु।\n\nगतिविधिहरू\nमजदुरहरूको अधिकारका लागि आवाज उठाउनु। सरकार र निजी क्षेत्रसँग समन्वय गरी मजदुरहरूको हितमा नीतिहरू बनाउनु। मजदुरहरूको क्षमता विकासका लागि प्रशिक्षण र कार्यशाला आयोजना गर्नु। मजदुरहरूको समस्या समाधानका लागि मध्यस्थता गर्नु।\n\nअखिल नेपाल यातायात मजदुर संघले नेपालमा यातायात क्षेत्रमा काम गर्ने मजदुरहरूको जीवनस्तरमा सुधार ल्याउने र उनीहरूको अधिकारको रक्षा गर्ने महत्वपूर्ण भूमिका खेलिरहेको छ।'
about_en='The All Nepal Transport Workers’ Union brings together people working in Nepal’s transport sector to defend their rights, advance their welfare and strengthen solidarity.\n\nOur history\nThe union grew from Nepal’s labour movement and the efforts of transport workers to protect their rights and interests. The union’s official introduction records its registration with the Department of Labour on 2063/12/15 BS, registration number 156.\n\nOur objectives\n1. Protect the economic, social and legal rights of transport workers.\n2. Improve working conditions and workers’ living standards.\n3. Strengthen unity and cooperation across the transport sector.\n4. Support workers’ education, health and welfare.\n\nOur work\nWe advocate for workers’ rights, work with government and private-sector organisations on policies affecting workers, organise training and workshops, and mediate to help resolve workplace problems.\n\nThrough this work, ANTWU seeks to improve the lives of transport workers and protect their rights across Nepal.'
docs=[{'id':'taxi-campaign','category':'Publications','title':loc('Taxi organisation campaign','ट्याक्सी संगठन सुदृढीकरण अभियान'),'description':loc('The Valley Taxi Special Committee’s campaign leaflet and commitments. Read the original Nepali document.','उपत्यका ट्याक्सी विशेष समितिको अभियान पत्र र प्रतिबद्धताहरू। मूल नेपाली कागजात पढ्नुहोस्।'),'date':'','type':'JPG','size':f"{(downloads/'taxi-campaign.jpg').stat().st_size//1024} KB",'file':'/downloads/taxi-campaign.jpg','status':'Published'}, {'id':'press-release','category':'Press releases','title':loc('Statement on the Bhotekoshi flood','भोटेकोशी बाढीसम्बन्धी प्रेस विज्ञप्ति'),'description':loc('The Central Committee’s statement expressing condolences and calling for rescue, relief and rehabilitation. Original Nepali scan.','खोज, उद्धार, राहत र पुनर्स्थापनाको माग गर्दै केन्द्रीय समितिले जारी गरेको शोक तथा समवेदनासहितको मूल विज्ञप्ति।'),'date':'','type':'JPG','size':f"{(downloads/'press-release.jpg').stat().st_size//1024} KB",'file':'/downloads/press-release.jpg','status':'Published'}]
data={'committeeMembers':members,'notices':[{'id':d['id'],'category':'Press release' if d['id']=='press-release' else 'Notice','title':d['title'],'excerpt':d['description'],'body':d['description'],'date':d['date'],'file':d['file'],'status':'Published'} for d in docs], 'blogPosts':[], 'galleryItems':galleries,'documents':docs,
'heroSlides':[{'id':'hero-main','kicker':loc('All Nepal Transport Workers’ Union','अखिल नेपाल यातायात मजदुर संघ'),'title':loc('Together, we move Nepal.','हामी सँगै, नेपाल अघि बढ्छ।'),'sub':loc('Standing together for the rights, dignity and welfare of the people who keep our country moving.','देशलाई चलायमान राख्ने श्रमिकहरूको अधिकार, सम्मान र हितका लागि एकसाथ।'),'image':'/assets/official/union-gathering.webp','status':'Published'}],
'activities':[],
'pages':[{'id':'about','title':loc('A shared voice for transport workers.','यातायात श्रमिकहरूको साझा आवाज।'),'body':loc(about_en,about_ne),'image':'/assets/official/workers-meeting.webp','status':'Published'}, {'id':'chairperson','title':loc('Message from the chairperson','अध्यक्षको सन्देश'),'body':loc('A message from the chairperson will be published here when it is available. Please contact the union office for current information.','अध्यक्षको सन्देश उपलब्ध भएपछि यहाँ प्रकाशन गरिनेछ। हालको जानकारीका लागि संघ कार्यालयमा सम्पर्क गर्नुहोस्।'),'image':'','status':'Published'}],
'stats':[{'id':'central-count','value':121,'label':loc('Central committee members','केन्द्रीय समिति सदस्यहरू'),'suffix':'','status':'Published'}, {'id':'committee-levels','value':5,'label':loc('Committee categories','समितिका प्रकार'),'suffix':'','status':'Published'}],
'values':[{'id':'rights','icon':'shield','number':'01','title':loc('Rights at work','कार्यस्थलमा अधिकार'),'body':loc('Defending the economic, social and legal rights of transport workers.','यातायात मजदुरहरूको आर्थिक, सामाजिक र कानूनी अधिकारको रक्षा।'),'status':'Published'}, {'id':'solidarity','icon':'users','number':'02','title':loc('Strength in unity','एकतामा शक्ति'),'body':loc('Building cooperation and a shared voice throughout the transport sector.','यातायात क्षेत्रमा सहकार्य र साझा आवाजको निर्माण।'),'status':'Published'}, {'id':'welfare','icon':'heart','number':'03','title':loc('Worker welfare','श्रमिक कल्याण'),'body':loc('Supporting better working conditions, education, health and living standards.','राम्रो कार्यस्थिति, शिक्षा, स्वास्थ्य र जीवनस्तरका लागि सहयोग।'),'status':'Published'}],
'settings':[{'id':'site-settings','address':loc('Peris Dada, Koteshwor–32, Kathmandu','पेरिस डाडा, कोटेश्वर–३२, काठमाडौं'),'phone':'01-4602758','email':'unionant2008@gmail.com','mission':loc('United for the rights, dignity and welfare of Nepal’s transport workers.','नेपालका यातायात श्रमिकहरूको अधिकार, सम्मान र कल्याणका लागि एकजुट।'),'siteTitle':loc('All Nepal Transport Workers’ Union','अखिल नेपाल यातायात मजदुर संघ'),'description':loc('Official ANTWU website: committee directory, union updates, publications, gallery and membership registration.','अखिल नेपाल यातायात मजदुर संघको आधिकारिक वेबसाइट: समिति निर्देशिका, सूचना, प्रकाशन, ग्यालरी र सदस्यता दर्ता।')}]}
dest=root/'src/data';dest.mkdir(exist_ok=True)
(dest/'content-seed.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'members':len(members),'photographs':len(galleries),'documents':len(docs),'originalImageBytes':sum(x['originalBytes'] for x in manifest),'optimizedImageBytes':sum(x['optimizedBytes'] for x in manifest),'phoneDataIssues':[r['s.no'] for r in rows if r['phone'] and len(str(r['phone']))!=10]}))
