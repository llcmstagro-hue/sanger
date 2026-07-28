"""Stage 3: build wedding film 1920x1080 from stills + Higgsfield clips, plus reports."""
import json, os, subprocess, urllib.request, math

SCENE_NAMES = {
    0: 'utro-sbory', 1: 'pervaya-vstrecha', 2: 'ceremoniya', 3: 'osenniy-park',
    4: 'progulka', 5: 'progulka-2', 6: 'kafe-progulka', 7: 'portrety',
    8: 'restoran', 9: 'banket', 10: 'banket-2', 11: 'vecher',
    12: 'tanec', 13: 'vecher-2', 14: 'vecher-3', 15: 'pozdniy-vecher', 16: 'final',
}
sel = json.load(open('selected.json'))
clips = json.load(open('clips.json'))  # {"2": "https://...mp4", ...} 1-based photo index
os.makedirs('segments', exist_ok=True)
os.makedirs('clips', exist_ok=True)

def outname(i, p):
    scene = SCENE_NAMES.get(p['scene'], 'scene%02d' % p['scene'])
    return '%03d_%s_%s' % (i + 1, scene, p['name'].replace(' ', '_'))

def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode != 0:
        print('CMDFAIL', cmd[:120], r.stderr[-400:])
    return r.returncode == 0

FPS = 25
DUR = 5.0

for i, p in enumerate(sel):
    seg = 'segments/seg%03d.mp4' % (i + 1)
    if os.path.exists(seg) and os.path.getsize(seg) > 50000:
        continue
    idx = str(i + 1)
    if idx in clips:
        cf = 'clips/clip%s.mp4' % idx
        if not os.path.exists(cf):
            urllib.request.urlretrieve(clips[idx], cf)
        run('ffmpeg -y -i %s -vf "scale=1920:1080:force_original_aspect_ratio=decrease,'
            'pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,fps=%d,fade=t=in:st=0:d=0.3,'
            'fade=t=out:st=4.6:d=0.4" -an -t 5 -c:v libx264 -preset medium -crf 19 '
            '-pix_fmt yuv420p %s' % (cf, FPS, seg))
    else:
        src = 'sel_1080/' + outname(i, p)
        zoom_in = (i % 2 == 0)
        frames = int(DUR * FPS)
        if zoom_in:
            zexpr = "min(zoom+0.0006,1.075)"
        else:
            zexpr = "if(eq(on,1),1.075,max(zoom-0.0006,1.0))"
        run('ffmpeg -y -loop 1 -i "%s" -vf "scale=2400:-2,zoompan=z=\'%s\':'
            'x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=%d:s=1920x1080:fps=%d,'
            'fade=t=in:st=0:d=0.3,fade=t=out:st=4.6:d=0.4" -t %f -c:v libx264 '
            '-preset medium -crf 19 -pix_fmt yuv420p -an %s'
            % (src, zexpr, frames, FPS, DUR, seg))
    print('seg', i + 1, 'done', flush=True)

# title and final cards
from PIL import Image, ImageDraw, ImageFont
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
if not os.path.exists(FONT):
    FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def card(fname, lines, bgc, fgc, sizes):
    im = Image.new('RGB', (1920, 1080), bgc)
    d = ImageDraw.Draw(im)
    total_h = sum(sizes) + 40 * (len(lines) - 1)
    y = (1080 - total_h) // 2
    for text, size in zip(lines, sizes):
        f = ImageFont.truetype(FONT, size)
        w = d.textlength(text, font=f)
        d.text(((1920 - w) / 2, y), text, font=f, fill=fgc)
        y += size + 40
    im.save(fname)

card('title.png', ['Александр  &  Юлия', '25.08.2015'], (247, 241, 228), (43, 43, 46), [96, 44])
card('final.png', ['И это только начало нашей истории'], (43, 43, 46), (247, 241, 228), [64])
run('ffmpeg -y -loop 1 -i title.png -vf "fade=t=in:st=0:d=0.6,fade=t=out:st=3.0:d=0.5,fps=25" '
    '-t 3.5 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -an segments/seg000.mp4')
run('ffmpeg -y -loop 1 -i final.png -vf "fade=t=in:st=0:d=0.6,fade=t=out:st=4.2:d=0.8,fps=25" '
    '-t 5 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -an segments/seg999.mp4')

segs = sorted(os.listdir('segments'))
with open('concat.txt', 'w') as fh:
    for s in segs:
        fh.write("file 'segments/%s'\n" % s)
music = None
for m in ('MUSIC.mp3', 'MUSIC.wav'):
    if os.path.exists(m):
        music = m
if music:
    run('ffmpeg -y -f concat -safe 0 -i concat.txt -stream_loop -1 -i %s -shortest '
        '-af "afade=t=in:st=0:d=2,afade=t=out:st=185:d=5,loudnorm" -c:v copy -c:a aac -b:a 192k '
        '-movflags +faststart Wedding_Film.mp4' % music)
else:
    run('ffmpeg -y -f concat -safe 0 -i concat.txt -c:v copy -movflags +faststart Wedding_Film.mp4')
    open('MUSIC_INSTRUCTIONS.txt', 'w').write(
        'Фильм собран без музыки: доступного инструмента для создания лицензированной\n'
        'ИНСТРУМЕНТАЛЬНОЙ музыки в этом окружении не оказалось (Higgsfield генерирует только речь).\n\n'
        'Рекомендация: добавьте нежную фортепианную композицию с лёгкими струнными\n'
        '(например, из библиотек с лицензией на использование: Artlist, Epidemic Sound,\n'
        'YouTube Audio Library - категория "Романтическая/Кинематографичная").\n'
        'Длительность фильма ~3.5 минуты. Наложить музыку можно командой:\n\n'
        'ffmpeg -i Wedding_Film.mp4 -i MUSIC.mp3 -shortest -c:v copy '
        '-af "afade=t=in:st=0:d=2,afade=t=out:st=185:d=8" -c:a aac -b:a 192k Wedding_Film_music.mp4\n')
print('FILM done:', os.path.getsize('Wedding_Film.mp4'))
print('STAGE3_DONE')
