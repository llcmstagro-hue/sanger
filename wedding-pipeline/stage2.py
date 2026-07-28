"""Stage 2: fetch selected originals, 1080p versions, contact sheet PDF, PPTX."""
import json, os, urllib.request, urllib.parse, threading, datetime

SCENE_NAMES = {
    0: 'utro-sbory', 1: 'pervaya-vstrecha', 2: 'ceremoniya', 3: 'osenniy-park',
    4: 'progulka', 5: 'progulka-2', 6: 'kafe-progulka', 7: 'portrety',
    8: 'restoran', 9: 'banket', 10: 'banket-2', 11: 'vecher',
    12: 'tanec', 13: 'vecher-2', 14: 'vecher-3', 15: 'pozdniy-vecher', 16: 'final',
}

sel = json.load(open('selected.json'))
base = open('dlbase.txt').read().strip() if os.path.exists('dlbase.txt') else None
if not base:
    def getj(u):
        r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        return json.loads(urllib.request.urlopen(r, timeout=60).read())
    base = getj('https://cloud.mail.ru/api/v2/dispatcher?api=2')['body']['weblink_get'][0]['url']
    open('dlbase.txt', 'w').write(base)

os.makedirs('selected_orig', exist_ok=True)
os.makedirs('sel_1080', exist_ok=True)

def outname(i, p):
    scene = SCENE_NAMES.get(p['scene'], 'scene%02d' % p['scene'])
    return '%03d_%s_%s' % (i + 1, scene, p['name'].replace(' ', '_'))

def dl(i, p):
    nm = p['name']
    out = 'selected_orig/' + outname(i, p)
    if os.path.exists(out) and os.path.getsize(out) > 100000:
        return
    u = base + '/' + urllib.parse.quote('DJpE/t5D4AmSeg/' + nm)
    for t in range(4):
        try:
            r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(r, timeout=120).read()
            open(out, 'wb').write(data)
            return
        except Exception as e:
            if t == 3: print('DLFAIL', nm, e)

ths = []
for i, p in enumerate(sel):
    t = threading.Thread(target=dl, args=(i, p)); t.start(); ths.append(t)
    if len(ths) >= 6:
        for t in ths: t.join()
        ths = []
for t in ths: t.join()
print('originals:', len(os.listdir('selected_orig')))

from PIL import Image, ImageOps
for i, p in enumerate(sel):
    src = 'selected_orig/' + outname(i, p)
    dst = 'sel_1080/' + outname(i, p)
    if not os.path.exists(src): continue
    if os.path.exists(dst): continue
    im = Image.open(src)
    im = ImageOps.exif_transpose(im).convert('RGB')
    w, h = im.size
    sc = min(1.0, 1920.0 / w, 1920.0 / h)
    im = im.resize((int(w * sc), int(h * sc)), Image.LANCZOS)
    im.save(dst, quality=90)
print('1080 versions:', len(os.listdir('sel_1080')))

# contact sheet PDF
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.lib.units import mm
PW, PH = landscape(A4)
c = pdfcanvas.Canvas('selected_contact_sheet.pdf', pagesize=landscape(A4))
cols, rows = 5, 3
cw, chh = PW / cols, (PH - 15 * mm) / rows
c.setFont('Helvetica-Bold', 14)
c.drawString(10 * mm, PH - 10 * mm, 'Wedding: selected photos contact sheet (Alexander & Yulia, 25.08.2015)')
n = 0
for i, p in enumerate(sel):
    src = 'sel_1080/' + outname(i, p)
    if not os.path.exists(src): continue
    col, row = n % cols, (n // cols) % rows
    if n > 0 and n % (cols * rows) == 0:
        c.showPage()
    x, y = col * cw, PH - 15 * mm - (row + 1) * chh
    try:
        im = Image.open(src); w, h = im.size
        arw = (cw - 6) / (chh - 16)
        ar = w / h
        if ar > arw: dw, dh = cw - 6, (cw - 6) / ar
        else: dh, dw = chh - 16, (chh - 16) * ar
        c.drawImage(src, x + 3 + (cw - 6 - dw) / 2, y + 14 + (chh - 16 - dh) / 2, dw, dh)
    except Exception as e:
        print('pdf img err', src, e)
    c.setFont('Helvetica', 6)
    scene = SCENE_NAMES.get(p['scene'], 'scene%02d' % p['scene'])
    c.drawString(x + 3, y + 8, '%02d  %s  %s' % (i + 1, scene, p['name']))
    c.drawString(x + 3, y + 2, 'score %.2f, both in frame; best of scene' % p['score'])
    n += 1
c.save()
print('contact sheet done')

# PPTX
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank = prs.slide_layouts[6]
GRAPHITE = RGBColor(0x2B, 0x2B, 0x2E)
CHAMPAGNE = RGBColor(0xF7, 0xF1, 0xE4)
GOLD = RGBColor(0xB0, 0x8D, 0x57)

def bg(slide, color):
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = color

# title slide
s = prs.slides.add_slide(blank)
bg(s, CHAMPAGNE)
tb = s.shapes.add_textbox(Inches(1), Inches(2.6), Inches(11.333), Inches(1.6))
tf = tb.text_frame
tf.text = 'Александр  &  Юлия'
tf.paragraphs[0].alignment = PP_ALIGN.CENTER
r = tf.paragraphs[0].runs[0]
r.font.size = Pt(54); r.font.color.rgb = GRAPHITE; r.font.name = 'Georgia'
p2 = tf.add_paragraph(); p2.text = '25.08.2015'; p2.alignment = PP_ALIGN.CENTER
p2.runs[0].font.size = Pt(24); p2.runs[0].font.color.rgb = GOLD; p2.runs[0].font.name = 'Georgia'
ln = s.shapes.add_shape(1, Inches(5.67, ), Inches(4.5), Inches(2), Pt(2))
ln.fill.solid(); ln.fill.fore_color.rgb = GOLD; ln.line.fill.background()

for i, p in enumerate(sel):
    src = 'sel_1080/' + outname(i, p)
    if not os.path.exists(src): continue
    s = prs.slides.add_slide(blank)
    bg(s, GRAPHITE if i % 7 == 3 else CHAMPAGNE)
    im = Image.open(src); w, h = im.size
    ar = w / h; slide_ar = 13.333 / 7.5
    if ar > slide_ar:
        dw = Inches(12.733); dh = Emu(int(dw * h / w))
    else:
        dh = Inches(6.9); dw = Emu(int(dh * w / h))
    left = Emu(int((Inches(13.333) - dw) / 2))
    top = Emu(int((Inches(7.5) - dh) / 2))
    s.shapes.add_picture(src, left, top, dw, dh)
    scene = SCENE_NAMES.get(p['scene'], 'scene%02d' % p['scene'])
    s.notes_slide.notes_text_frame.text = 'Сцена: %s | Файл: %s | %s' % (scene, p['name'], p['dto'])

s = prs.slides.add_slide(blank)
bg(s, GRAPHITE)
tb = s.shapes.add_textbox(Inches(1), Inches(3.1), Inches(11.333), Inches(1.4))
tf = tb.text_frame
tf.text = 'И это только начало нашей истории'
tf.paragraphs[0].alignment = PP_ALIGN.CENTER
r = tf.paragraphs[0].runs[0]
r.font.size = Pt(36); r.font.color.rgb = CHAMPAGNE; r.font.name = 'Georgia'; r.font.italic = True
prs.save('Wedding_Presentation.pptx')
print('PPTX done', os.path.getsize('Wedding_Presentation.pptx'))
print('STAGE2_DONE')
