"""Stage 4: rebuild wedding clip — 4 bride-solo + 30 couple frames, no bystanders, date 25.09.2015."""
import csv, json, os, subprocess, urllib.request, urllib.parse, threading

SOLO = ['1 (89).jpg', '1 (100).jpg', '1 (124).jpg', '2 (710).jpg']
CLIP_PHOTOS = ['1 (78).jpg', '1 (83).jpg', '2 (112).jpg', '2 (178).jpg', '2 (250).jpg',
               '2 (365).jpg', '2 (521).jpg', '2 (633).jpg', '2 (679).jpg']
COUPLE_N = 30

rows = list(csv.DictReader(open('photo_analysis.csv', encoding='utf-8-sig')))
by_name = {r['file']: r for r in rows}

def fl(x):
    try: return float(x)
    except Exception: return 0.0

coup = [r for r in rows if r['both'] in ('1', 'True') and
        (r['extra_people'] == '0' or r['file'] in CLIP_PHOTOS)]
chosen = [by_name[n] for n in CLIP_PHOTOS if n in by_name]
rest = sorted((r for r in coup if r['file'] not in CLIP_PHOTOS),
              key=lambda r: fl(r['score']), reverse=True)
per_scene = {}
for r in chosen:
    per_scene[r['scene']] = per_scene.get(r['scene'], 0) + 1
for r in rest:
    if len(chosen) >= COUPLE_N: break
    if per_scene.get(r['scene'], 0) >= 3: continue
    chosen.append(r)
    per_scene[r['scene']] = per_scene.get(r['scene'], 0) + 1

sel = chosen + [by_name[n] for n in SOLO if n in by_name]
sel.sort(key=lambda r: r['datetime'])
json.dump([{'name': r['file'], 'dto': r['datetime'], 'scene': r['scene'],
            'solo': r['file'] in SOLO} for r in sel],
          open('selected4.json', 'w'), ensure_ascii=False, indent=1)
print('selected:', len(sel), '| solo:', sum(1 for r in sel if r['file'] in SOLO))

base = open('dlbase.txt').read().strip() if os.path.exists('dlbase.txt') else None
if not base:
    rq = urllib.request.Request('https://cloud.mail.ru/api/v2/dispatcher?api=2',
                                headers={'User-Agent': 'Mozilla/5.0'})
    base = json.loads(urllib.request.urlopen(rq, timeout=60).read())['body']['weblink_get'][0]['url']
    open('dlbase.txt', 'w').write(base)

os.makedirs('orig4', exist_ok=True)
os.makedirs('sel4', exist_ok=True)

def dl(nm):
    out = 'orig4/' + nm
    if os.path.exists(out) and os.path.getsize(out) > 100000: return
    u = base + '/' + urllib.parse.quote('DJpE/t5D4AmSeg/' + nm)
    for t in range(4):
        try:
            rq = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            open(out, 'wb').write(urllib.request.urlopen(rq, timeout=120).read())
            return
        except Exception as e:
            if t == 3: print('DLFAIL', nm, e)

ths = []
for r in sel:
    t = threading.Thread(target=dl, args=(r['file'],)); t.start(); ths.append(t)
    if len(ths) >= 6:
        for t in ths: t.join()
        ths = []
for t in ths: t.join()
print('downloaded:', len(os.listdir('orig4')))

from PIL import Image, ImageOps
for r in sel:
    src, dst = 'orig4/' + r['file'], 'sel4/' + r['file']
    if not os.path.exists(src) or os.path.exists(dst): continue
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    w, h = im.size
    sc = min(1.0, 1920.0 / w, 1920.0 / h)
    im.resize((int(w * sc), int(h * sc)), Image.LANCZOS).save(dst, quality=90)
print('resized:', len(os.listdir('sel4')))

clips = json.load(open('clips4.json'))  # {"1 (78).jpg": "https://...mp4"}
os.makedirs('seg4', exist_ok=True)
os.makedirs('clipdl', exist_ok=True)

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode != 0: print('CMDFAIL', cmd[:100], r.stderr[-300:])
    return r.returncode == 0

FPS, DUR = 25, 5.0
for i, r in enumerate(sel):
    seg = 'seg4/s%03d.mp4' % (i + 1)
    if os.path.exists(seg) and os.path.getsize(seg) > 50000: continue
    nm = r['file']
    if nm in clips:
        cf = 'clipdl/%d.mp4' % i
        if not os.path.exists(cf): urllib.request.urlretrieve(clips[nm], cf)
        run('ffmpeg -y -i %s -vf "scale=1920:1080:force_original_aspect_ratio=decrease,'
            'pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,fps=%d,fade=t=in:st=0:d=0.3,'
            'fade=t=out:st=4.6:d=0.4" -an -t 5 -c:v libx264 -preset medium -crf 19 '
            '-pix_fmt yuv420p %s' % (cf, FPS, seg))
    else:
        z = "min(zoom+0.0006,1.075)" if i % 2 == 0 else "if(eq(on,1),1.075,max(zoom-0.0006,1.0))"
        run('ffmpeg -y -loop 1 -i "sel4/%s" -vf "scale=2400:-2,zoompan=z=\'%s\':'
            'x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=%d:s=1920x1080:fps=%d,'
            'fade=t=in:st=0:d=0.3,fade=t=out:st=4.6:d=0.4" -t %f -c:v libx264 '
            '-preset medium -crf 19 -pix_fmt yuv420p -an %s'
            % (nm, z, int(DUR * FPS), FPS, DUR, seg))
    print('seg', i + 1, len(sel), flush=True)

from PIL import ImageDraw, ImageFont
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
if not os.path.exists(FONT): FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def card(fname, lines, bgc, fgc, sizes):
    im = Image.new('RGB', (1920, 1080), bgc)
    d = ImageDraw.Draw(im)
    y = (1080 - (sum(sizes) + 40 * (len(lines) - 1))) // 2
    for text, size in zip(lines, sizes):
        f = ImageFont.truetype(FONT, size)
        d.text(((1920 - d.textlength(text, font=f)) / 2, y), text, font=f, fill=fgc)
        y += size + 40
    im.save(fname)

card('title4.png', ['Александр  &  Юлия', '25.09.2015'], (247, 241, 228), (43, 43, 46), [96, 44])
card('final4.png', ['И это только начало нашей истории'], (43, 43, 46), (247, 241, 228), [64])
run('ffmpeg -y -loop 1 -i title4.png -vf "fade=t=in:st=0:d=0.6,fade=t=out:st=3.0:d=0.5,fps=25" '
    '-t 3.5 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -an seg4/s000.mp4')
run('ffmpeg -y -loop 1 -i final4.png -vf "fade=t=in:st=0:d=0.6,fade=t=out:st=4.2:d=0.8,fps=25" '
    '-t 5 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -an seg4/s999.mp4')

with open('concat4.txt', 'w') as fh:
    for s in sorted(os.listdir('seg4')):
        fh.write("file 'seg4/%s'\n" % s)
total = 3.5 + 5 + len(sel) * 5
fade_st = total - 9
if os.path.exists('MUSIC4.mp3'):
    run('ffmpeg -y -f concat -safe 0 -i concat4.txt -i MUSIC4.mp3 -shortest -c:v copy '
        '-af "loudnorm=I=-18:TP=-1.5,afade=t=in:st=0:d=2,afade=t=out:st=%f:d=8" '
        '-c:a aac -b:a 192k -movflags +faststart Wedding_Clip.mp4' % fade_st)
else:
    run('ffmpeg -y -f concat -safe 0 -i concat4.txt -c:v copy -movflags +faststart Wedding_Clip.mp4')
print('CLIP done:', os.path.getsize('Wedding_Clip.mp4'))
print('STAGE4_DONE')
