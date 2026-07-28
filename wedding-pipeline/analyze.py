#!/usr/bin/env python3
"""Streaming analyzer: download mail.ru thumbs, extract EXIF/quality/faces/embeddings."""
import json, os, sys, time, threading, queue, traceback
import urllib.request, urllib.parse
import numpy as np, cv2
from PIL import Image, ExifTags, ImageOps

BASE_DIR = '/home/user'
THUMBS = os.path.join(BASE_DIR, 'thumbs')
os.makedirs(THUMBS, exist_ok=True)
OUT = os.path.join(BASE_DIR, 'analysis.jsonl')
LOG = os.path.join(BASE_DIR, 'analyze.log')

files = json.load(open(os.path.join(BASE_DIR, 'files.json')))
done = set()
if os.path.exists(OUT):
    for line in open(OUT):
        try: done.add(json.loads(line)['name'])
        except Exception: pass
todo = [f for f in files if f['name'] not in done]

det = cv2.FaceDetectorYN.create(os.path.join(BASE_DIR, 'yunet.onnx'), '', (320, 320), 0.6, 0.3, 5000)
rec = cv2.FaceRecognizerSF.create(os.path.join(BASE_DIR, 'sface.onnx'), '')
det_lock = threading.Lock()

def log(msg):
    with open(LOG, 'a') as fh:
        fh.write('%s %s\n' % (time.strftime('%H:%M:%S'), msg))

def fetch(name, tries=4):
    u = 'https://thumb.cloud.mail.ru/weblink/thumb/xw1/' + urllib.parse.quote('DJpE/t5D4AmSeg/' + name)
    for i in range(tries):
        try:
            r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            return urllib.request.urlopen(r, timeout=60).read()
        except Exception as e:
            if i == tries - 1: raise
            time.sleep(2 * (i + 1))

dlq = queue.Queue(maxsize=12)
res_lock = threading.Lock()
counter = {'n': len(done), 'err': 0}

def downloader(sub):
    for f in sub:
        try:
            dlq.put((f, fetch(f['name'])))
        except Exception as e:
            log('DLERR %s %s' % (f['name'], e))
            with res_lock: counter['err'] += 1

def process():
    while True:
        item = dlq.get()
        if item is None: break
        f, data = item
        try:
            rec_out = analyze(f, data)
            with res_lock:
                with open(OUT, 'a') as fh:
                    fh.write(json.dumps(rec_out, ensure_ascii=False) + '\n')
                counter['n'] += 1
                if counter['n'] % 25 == 0:
                    log('done %d/%d err=%d' % (counter['n'], len(files), counter['err']))
        except Exception as e:
            log('PROCERR %s %s' % (f['name'], traceback.format_exc(limit=2)))
            with res_lock: counter['err'] += 1

def analyze(f, data):
    im = Image.open(__import__('io').BytesIO(data))
    exif = {}
    try:
        ex = im._getexif() or {}
        exif = {ExifTags.TAGS.get(k, str(k)): v for k, v in ex.items()}
    except Exception: pass
    dto = str(exif.get('DateTimeOriginal', ''))
    im = ImageOps.exif_transpose(im).convert('RGB')
    w, h = im.size
    # analysis image max 1280
    scale = min(1.0, 1280.0 / max(w, h))
    ana = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS) if scale < 1 else im
    ana.save(os.path.join(THUMBS, f['name']), quality=88)
    a = cv2.cvtColor(np.asarray(ana), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    sharp = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    mean_b = float(gray.mean())
    over = float((gray > 250).mean()); under = float((gray < 8).mean())
    ah, aw = a.shape[:2]
    with det_lock:
        det.setInputSize((aw, ah))
        ok, faces_arr = det.detect(a)
    faces = []
    if faces_arr is not None:
        for fc in faces_arr:
            x, y, fw, fh_ = fc[:4]
            score = float(fc[14])
            face_sharp = 0.0
            xi, yi = max(0, int(x)), max(0, int(y))
            crop = gray[yi:yi + int(fh_), xi:xi + int(fw)]
            if crop.size > 400:
                face_sharp = float(cv2.Laplacian(crop, cv2.CV_64F).var())
            emb = None
            if fw >= 28 and fh_ >= 28:
                try:
                    with det_lock:
                        aligned = rec.alignCrop(a, fc)
                        emb = rec.feature(aligned).flatten().astype(float).round(5).tolist()
                except Exception: pass
            faces.append({'box': [round(float(v), 1) for v in fc[:4]],
                          'lm': [round(float(v), 1) for v in fc[4:14]],
                          'score': round(score, 3), 'sharp': round(face_sharp, 1),
                          'emb': emb})
    return {'name': f['name'], 'size': f['size'], 'mtime': f['mtime'], 'dto': dto,
            'w': w, 'h': h, 'aw': aw, 'ah': ah,
            'sharp': round(sharp, 1), 'mean': round(mean_b, 1),
            'over': round(over, 4), 'under': round(under, 4),
            'nfaces': len(faces), 'faces': faces}

nthreads = 6
chunks = [todo[i::nthreads] for i in range(nthreads)]
dls = [threading.Thread(target=downloader, args=(c,), daemon=True) for c in chunks]
procs = [threading.Thread(target=process, daemon=True) for _ in range(2)]
log('START todo=%d done=%d' % (len(todo), len(done)))
t0 = time.time()
for t in dls + procs: t.start()
for t in dls: t.join()
for _ in procs: dlq.put(None)
for t in procs: t.join()
log('FINISHED n=%d err=%d in %.1fs' % (counter['n'], counter['err'], time.time() - t0))
print('FINISHED', counter)
