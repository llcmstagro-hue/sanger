import json, os, time, threading, queue, traceback, io, base64
import urllib.request, urllib.parse
import numpy as np, cv2
from PIL import Image, ExifTags, ImageOps

BASE = '/home/user'
OUT = BASE + '/analysis_compact.jsonl'
LOG = BASE + '/analyze.log'
files = json.load(open(BASE + '/files.json'))
done = set()
if os.path.exists(OUT):
    for line in open(OUT):
        try: done.add(json.loads(line)['n'])
        except Exception: pass
todo = [f for f in files if f['name'] not in done]
det = cv2.FaceDetectorYN.create(BASE + '/yunet.onnx', '', (320, 320), 0.6, 0.3, 5000)
rec = cv2.FaceRecognizerSF.create(BASE + '/sface.onnx', '')
lk = threading.Lock()

def log(m):
    with open(LOG, 'a') as fh: fh.write('%s %s\n' % (time.strftime('%H:%M:%S'), m))

def fetch(name, tries=4):
    u = 'https://thumb.cloud.mail.ru/weblink/thumb/xw1/' + urllib.parse.quote('DJpE/t5D4AmSeg/' + name)
    for i in range(tries):
        try:
            r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            return urllib.request.urlopen(r, timeout=60).read()
        except Exception:
            if i == tries - 1: raise
            time.sleep(2 * (i + 1))

dlq = queue.Queue(maxsize=12)
res = threading.Lock()
cnt = {'n': len(done), 'err': 0}

def downloader(sub):
    for f in sub:
        try: dlq.put((f, fetch(f['name'])))
        except Exception as e:
            log('DLERR %s %s' % (f['name'], e))
            with res: cnt['err'] += 1

def qemb(e):
    v = np.array(e, dtype=np.float32)
    v /= (np.linalg.norm(v) + 1e-9)
    q = np.clip(np.round(v * 127), -127, 127).astype(np.int8)
    return base64.b64encode(q.tobytes()).decode()

def analyze(f, data):
    im = Image.open(io.BytesIO(data))
    dto = ''
    try:
        ex = im._getexif() or {}
        dto = str({ExifTags.TAGS.get(k, str(k)): v for k, v in ex.items()}.get('DateTimeOriginal', ''))
    except Exception: pass
    im = ImageOps.exif_transpose(im).convert('RGB')
    w, h = im.size
    sc = min(1.0, 1280.0 / max(w, h))
    ana = im.resize((int(w * sc), int(h * sc)), Image.LANCZOS) if sc < 1 else im
    a = cv2.cvtColor(np.asarray(ana), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    sharp = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    mean_b = float(gray.mean()); over = float((gray > 250).mean())
    ah, aw = a.shape[:2]
    with lk:
        det.setInputSize((aw, ah))
        ok, fa = det.detect(a)
    faces = []
    if fa is not None:
        for fc in fa:
            x, y, fw, fh_ = [float(v) for v in fc[:4]]
            score = float(fc[14])
            if fh_ < 24: continue
            xi, yi = max(0, int(x)), max(0, int(y))
            crop = gray[yi:yi + int(fh_), xi:xi + int(fw)]
            fsharp = float(cv2.Laplacian(crop, cv2.CV_64F).var()) if crop.size > 400 else 0.0
            eb = ''
            if fh_ >= 36 and score >= 0.65:
                try:
                    with lk:
                        al = rec.alignCrop(a, fc)
                        eb = qemb(rec.feature(al).flatten())
                except Exception: pass
            faces.append([round(x, 1), round(y, 1), round(fw, 1), round(fh_, 1),
                          round(score, 2), round(fsharp, 1), eb])
    return {'n': f['name'], 'm': f['mtime'], 'd': dto, 'w': w, 'h': h,
            'aw': aw, 'ah': ah, 's': round(sharp, 1), 'b': round(mean_b, 1),
            'o': round(over, 4), 'f': faces}

def worker():
    while True:
        it = dlq.get()
        if it is None: break
        f, data = it
        try:
            r = analyze(f, data)
            with res:
                with open(OUT, 'a') as fh:
                    fh.write(json.dumps(r, separators=(',', ':')) + '\n')
                cnt['n'] += 1
                if cnt['n'] % 25 == 0: log('done %d/%d err=%d' % (cnt['n'], len(files), cnt['err']))
        except Exception:
            log('PROCERR %s %s' % (f['name'], traceback.format_exc(limit=1)))
            with res: cnt['err'] += 1

nt = 6
dls = [threading.Thread(target=downloader, args=(todo[i::nt],), daemon=True) for i in range(nt)]
ws = [threading.Thread(target=worker, daemon=True) for _ in range(2)]
log('START todo=%d done=%d' % (len(todo), len(done)))
for t in dls + ws: t.start()
for t in dls: t.join()
for _ in ws: dlq.put(None)
for t in ws: t.join()
log('ANALYZE_FINISHED n=%d err=%d' % (cnt['n'], cnt['err']))
