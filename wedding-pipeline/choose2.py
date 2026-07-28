import json, os, base64, collections, urllib.request, urllib.parse, threading, bisect, datetime
import numpy as np
import cv2

recs = [json.loads(l) for l in open('analysis_compact.jsonl')]
seen = set(); uniq = []
for r in recs:
    if r['n'] not in seen: seen.add(r['n']); uniq.append(r)
recs = uniq
clusters = json.load(open('clusters.json'))
c0 = np.array(clusters[0]['cent'], dtype=np.float32)
c1 = np.array(clusters[1]['cent'], dtype=np.float32)
T = 0.38
os.makedirs('thumbs', exist_ok=True)

def deq(eb):
    q = np.frombuffer(base64.b64decode(eb), dtype=np.int8).astype(np.float32) / 127.0
    return q / (np.linalg.norm(q) + 1e-9)

def get_thumb(name):
    p = 'thumbs/' + name
    if os.path.exists(p):
        img = cv2.imread(p)
        if img is not None: return img
    u = 'https://thumb.cloud.mail.ru/weblink/thumb/xw1/' + urllib.parse.quote('DJpE/t5D4AmSeg/' + name)
    for i in range(3):
        try:
            rq = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(rq, timeout=60).read()
            arr = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_REDUCED_COLOR_2)
            if arr is None: return None
            h, w = arr.shape[:2]
            sc = min(1.0, 1280.0 / max(h, w))
            if sc < 1: arr = cv2.resize(arr, (int(w * sc), int(h * sc)))
            cv2.imwrite(p, arr, [cv2.IMWRITE_JPEG_QUALITY, 88])
            return arr
        except Exception:
            pass
    return None

def parse_dt(r):
    d = r.get('d') or ''
    if len(d) == 19:
        try: return datetime.datetime.strptime(d, '%Y:%m:%d %H:%M:%S').timestamp()
        except Exception: pass
    return float(r['m'])

photos = []
for r in recs:
    t = parse_dt(r)
    has0 = has1 = False; f0 = f1 = None; others = 0
    for f in r['f']:
        if not f[6] or f[3] < 30:
            if f[3] >= 30: others += 1
            continue
        e = deq(f[6])
        s0 = float(np.dot(e, c0)); s1 = float(np.dot(e, c1))
        if s0 >= T and s0 >= s1:
            has0 = True
            if f0 is None or f[3] > f0[3]: f0 = f
        elif s1 >= T:
            has1 = True
            if f1 is None or f[3] > f1[3]: f1 = f
        else: others += 1
    photos.append({'r': r, 't': t, 'has0': has0, 'has1': has1, 'f0': f0, 'f1': f1,
                   'others': others, 'both': has0 and has1})
photos.sort(key=lambda p: (p['t'], p['r']['n']))
both = [p for p in photos if p['both']]
print('photos with both:', len(both))

# pre-fetch thumbs for both-photos (parallel)
names = [p['r']['n'] for p in both]
def pf(sub):
    for nm in sub: get_thumb(nm)
ths = [threading.Thread(target=pf, args=(names[i::6],)) for i in range(6)]
for t in ths: t.start()
for t in ths: t.join()
print('thumbs ready:', len(os.listdir('thumbs')))

def torso_white(p, f):
    img = cv2.imread('thumbs/' + p['r']['n'])
    if img is None or f is None: return None
    x, y, w, h = [int(v) for v in f[:4]]
    y0 = min(img.shape[0] - 1, y + int(1.3 * h)); y1 = min(img.shape[0], y + int(3.2 * h))
    x0 = max(0, x - int(0.4 * w)); x1 = min(img.shape[1], x + int(1.4 * w))
    if y1 - y0 < 8 or x1 - x0 < 8: return None
    hsv = cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_BGR2HSV)
    return float(((hsv[:, :, 1] < 60) & (hsv[:, :, 2] > 170)).mean())

w0s = [v for v in (torso_white(p, p['f0']) for p in both) if v is not None]
w1s = [v for v in (torso_white(p, p['f1']) for p in both) if v is not None]
bride = 0 if (np.mean(w0s) if w0s else 0) > (np.mean(w1s) if w1s else 0) else 1
print('torso white c0=%.3f c1=%.3f -> bride=cluster%d' %
      (np.mean(w0s) if w0s else -1, np.mean(w1s) if w1s else -1, bride))

scenes = []; cur = []
for p in both:
    if cur and (p['t'] - cur[-1]['t'] > 600): scenes.append(cur); cur = []
    cur.append(p)
if cur: scenes.append(cur)
print('scenes:', len(scenes), [len(s) for s in scenes])

sharps = sorted(x['r']['s'] for x in both)
def pct(v): return bisect.bisect_left(sharps, v) / max(1, len(sharps))
def face_q(f):
    if f is None: return 0
    return min(1.0, f[3] / 200.0) * min(1.0, f[5] / 150.0 + 0.3)
def score(p):
    r = p['r']; s = 2.5 * (face_q(p['f0']) + face_q(p['f1'])) + 1.5 * pct(r['s'])
    ep = 0.0
    if r['b'] < 60: ep += (60 - r['b']) / 60.0
    if r['b'] > 200: ep += (r['b'] - 200) / 55.0
    ep += max(0.0, r['o'] - 0.05) * 4
    s -= 1.2 * ep + 0.25 * min(4, p['others'])
    for f in (p['f0'], p['f1']):
        if f and (f[1] + f[3] / 2) / r['ah'] > 0.8: s -= 0.4
    if p['f0'] and p['f1'] and abs(p['f0'][0] - p['f1'][0]) / r['aw'] < 0.45: s += 0.5
    return s
for p in both: p['score'] = score(p)

hists = {}
def hist_of(p):
    nm = p['r']['n']
    if nm not in hists:
        img = cv2.imread('thumbs/' + nm)
        h = cv2.calcHist([img], [0, 1, 2], None, [8, 8, 8], [0, 256] * 3)
        hists[nm] = cv2.normalize(h, h).flatten()
    return hists[nm]

quota = [1 if len(s) < 8 else 2 for s in scenes]
selected = []
for si, s in enumerate(scenes):
    cand = sorted(s, key=lambda p: -p['score'])
    take = []
    for p in cand:
        if len(take) >= quota[si]: break
        ok = True
        for q in take:
            if float(cv2.compareHist(hist_of(p), hist_of(q), cv2.HISTCMP_CORREL)) > 0.93 and abs(p['t'] - q['t']) < 120:
                ok = False; break
        if ok: take.append(p)
    for p in take:
        p['scene'] = si; selected.append(p)
selected.sort(key=lambda p: p['t'])
while len(selected) > 40:
    cnts = collections.Counter(p['scene'] for p in selected)
    cands = [p for p in selected if cnts[p['scene']] > 1]
    if not cands: break
    selected.remove(min(cands, key=lambda p: p['score']))
print('selected:', len(selected))

json.dump([{'name': p['r']['n'], 'scene': p['scene'], 'dto': p['r']['d'],
            'score': round(p['score'], 3), 'others': p['others'],
            'bride_face': (p['f0'] if bride == 0 else p['f1'])[:4],
            'groom_face': (p['f1'] if bride == 0 else p['f0'])[:4]}
           for p in selected], open('selected.json', 'w'), indent=0)

import csv
scene_of = {}
for si, s in enumerate(scenes):
    for p in s: scene_of[p['r']['n']] = si
selnames = {p['r']['n'] for p in selected}
with open('photo_analysis.csv', 'w', newline='', encoding='utf-8-sig') as fh:
    w = csv.writer(fh)
    w.writerow(['file', 'datetime', 'groom_found', 'bride_found', 'both', 'sharpness',
                'exposure_mean', 'overexp_frac', 'faces', 'extra_people', 'score',
                'scene', 'decision', 'reason'])
    for p in photos:
        r = p['r']
        hb = p['has0'] if bride == 0 else p['has1']
        hg = p['has1'] if bride == 0 else p['has0']
        if r['n'] in selnames: dec, why = 'KEEP', 'selected: best of scene %02d' % scene_of.get(r['n'], -1)
        elif not p['both']: dec, why = 'EXCLUDE', ('bride_or_groom_missing' if (hb or hg) else 'couple_not_found')
        elif r['s'] < 40: dec, why = 'EXCLUDE', 'blur'
        elif p.get('score', 0) <= 0: dec, why = 'EXCLUDE', 'poor_composition_or_exposure'
        else: dec, why = 'EXCLUDE', 'duplicate_or_weaker_than_scene_best'
        w.writerow([r['n'], r['d'], int(hg), int(hb), int(p['both']), r['s'], r['b'], r['o'],
                    len(r['f']), p['others'], round(p.get('score', 0), 3),
                    scene_of.get(r['n'], ''), dec, why])

rej = {'blur': [], 'bride_or_groom_missing': [], 'duplicate': [], 'poor_composition': []}
for p in photos:
    r = p['r']
    if r['n'] in selnames: continue
    if p['both'] and r['s'] < 40 and len(rej['blur']) < 5: rej['blur'].append(r['n'])
    elif not p['both'] and (p['has0'] or p['has1']) and len(rej['bride_or_groom_missing']) < 5:
        rej['bride_or_groom_missing'].append(r['n'])
    elif p['both'] and p.get('score', 0) <= 0 and len(rej['poor_composition']) < 5:
        rej['poor_composition'].append(r['n'])
    elif p['both'] and len(rej['duplicate']) < 5: rej['duplicate'].append(r['n'])
json.dump(rej, open('rejected_examples.json', 'w'), indent=0)

os.makedirs('sel_montage', exist_ok=True)
tiles = []
for idx, p in enumerate(selected):
    img = cv2.imread('thumbs/' + p['r']['n'])
    if img is None: continue
    hh, ww = img.shape[:2]; sc = 300.0 / max(hh, ww)
    img = cv2.resize(img, (int(ww * sc), int(hh * sc)))
    canvas = np.zeros((320, 300, 3), np.uint8)
    y0 = (300 - img.shape[0]) // 2; x0 = (300 - img.shape[1]) // 2
    canvas[y0:y0 + img.shape[0], x0:x0 + img.shape[1]] = img
    cv2.putText(canvas, '%02d s%02d %s' % (idx + 1, p['scene'], p['r']['n'][:14]),
                (4, 314), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1)
    tiles.append(canvas)
per = 21
for mi in range(0, len(tiles), per):
    ch = tiles[mi:mi + per]
    while len(ch) % 7: ch.append(np.zeros((320, 300, 3), np.uint8))
    rows = [cv2.hconcat(ch[i:i + 7]) for i in range(0, len(ch), 7)]
    fp = 'sel_montage/sel_%d.jpg' % (mi // per + 1)
    cv2.imwrite(fp, cv2.vconcat(rows), [cv2.IMWRITE_JPEG_QUALITY, 78])
    print(fp, os.path.getsize(fp))

# cluster exemplar montage for bride/groom verification
rowsm = []
for c in clusters[:4]:
    row = []
    for e in c['exemplars'][:8]:
        img = get_thumb(e['name'])
        if img is None: continue
        x, y, w, h = [int(v) for v in e['box']]
        pad = int(h * 0.3)
        crop = img[max(0, y - pad):y + h + pad, max(0, x - pad):x + w + pad]
        if crop.size == 0: continue
        row.append(cv2.resize(crop, (112, 112)))
    while len(row) < 8: row.append(np.zeros((112, 112, 3), np.uint8))
    rowsm.append(cv2.hconcat(row[:8]))
cv2.imwrite('cluster_montage.jpg', cv2.vconcat(rowsm), [cv2.IMWRITE_JPEG_QUALITY, 80])
print('CHOOSE_DONE')
