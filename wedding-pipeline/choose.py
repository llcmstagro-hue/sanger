import json, os, math, collections, urllib.request, urllib.parse, threading
import numpy as np
import cv2

recs = [json.loads(l) for l in open('analysis.jsonl')]
clusters = json.load(open('clusters.json'))
c0 = np.array(clusters[0]['cent'], dtype=np.float32)
c1 = np.array(clusters[1]['cent'], dtype=np.float32)
ASSIGN_T = 0.38

def norm(v):
    v = np.array(v, dtype=np.float32)
    return v / (np.linalg.norm(v) + 1e-9)

def parse_dt(r):
    d = r.get('dto') or ''
    if len(d) == 19:
        try:
            import datetime
            return datetime.datetime.strptime(d, '%Y:%m:%d %H:%M:%S').timestamp()
        except Exception:
            pass
    return float(r['mtime'])

# annotate photos
photos = []
for r in recs:
    t = parse_dt(r)
    has0 = has1 = False
    f0 = f1 = None
    others = 0
    for f in r['faces']:
        if not f['emb'] or f['box'][3] < 30:
            if f['box'][3] >= 30:
                others += 1
            continue
        e = norm(f['emb'])
        s0 = float(np.dot(e, c0)); s1 = float(np.dot(e, c1))
        if s0 >= ASSIGN_T and s0 >= s1:
            has0 = True
            if f0 is None or f['box'][3] > f0['box'][3]: f0 = f
        elif s1 >= ASSIGN_T:
            has1 = True
            if f1 is None or f['box'][3] > f1['box'][3]: f1 = f
        else:
            others += 1
    photos.append({'r': r, 't': t, 'has0': has0, 'has1': has1, 'f0': f0, 'f1': f1,
                   'others': others, 'both': has0 and has1})
photos.sort(key=lambda p: (p['t'], p['r']['name']))

# torso whiteness per cluster (bride heuristic) using couple photos
def torso_white(p, f):
    img = cv2.imread('thumbs/' + p['r']['name'])
    if img is None or f is None: return None
    x, y, w, h = [int(v) for v in f['box']]
    y0 = min(img.shape[0] - 1, y + int(1.3 * h)); y1 = min(img.shape[0], y + int(3.2 * h))
    x0 = max(0, x - int(0.4 * w)); x1 = min(img.shape[1], x + int(1.4 * w))
    if y1 - y0 < 8 or x1 - x0 < 8: return None
    reg = img[y0:y1, x0:x1]
    hsv = cv2.cvtColor(reg, cv2.COLOR_BGR2HSV)
    white = ((hsv[:, :, 1] < 60) & (hsv[:, :, 2] > 170)).mean()
    return float(white)

w0s, w1s = [], []
for p in photos:
    if p['both']:
        a = torso_white(p, p['f0']); b = torso_white(p, p['f1'])
        if a is not None: w0s.append(a)
        if b is not None: w1s.append(b)
w0m = float(np.mean(w0s)) if w0s else 0.0
w1m = float(np.mean(w1s)) if w1s else 0.0
bride_cluster = 0 if w0m > w1m else 1
print('torso white c0=%.3f c1=%.3f -> bride=cluster%d' % (w0m, w1m, bride_cluster))

# scene segmentation over BOTH-photos (time gap based)
both = [p for p in photos if p['both']]
print('photos with both:', len(both))
scenes = []
cur = []
for p in both:
    if cur and (p['t'] - cur[-1]['t'] > 600):
        scenes.append(cur); cur = []
    cur.append(p)
if cur: scenes.append(cur)
print('scenes:', len(scenes), [len(s) for s in scenes])

# quality scoring
sharps = sorted(x['r']['sharp'] for x in both)
def pct(v, arr):
    import bisect
    return bisect.bisect_left(arr, v) / max(1, len(arr))
def face_q(f):
    if f is None: return 0
    return min(1.0, f['box'][3] / 200.0) * min(1.0, f['sharp'] / 150.0 + 0.3)
def score(p):
    r = p['r']
    s = 0.0
    s += 2.5 * (face_q(p['f0']) + face_q(p['f1']))
    s += 1.5 * pct(r['sharp'], sharps)
    exp_pen = 0.0
    if r['mean'] < 60: exp_pen += (60 - r['mean']) / 60.0
    if r['mean'] > 200: exp_pen += (r['mean'] - 200) / 55.0
    exp_pen += max(0.0, r['over'] - 0.05) * 4
    s -= 1.2 * exp_pen
    s -= 0.25 * min(4, p['others'])
    hh = r['ah']
    for f in (p['f0'], p['f1']):
        if f:
            cy = (f['box'][1] + f['box'][3] / 2) / hh
            if cy > 0.8: s -= 0.4
    fs = [f for f in (p['f0'], p['f1']) if f]
    if len(fs) == 2:
        d = abs(fs[0]['box'][0] - fs[1]['box'][0]) / p['r']['aw']
        if d < 0.45: s += 0.5
    return s
for p in both:
    p['score'] = score(p)

# per-scene selection with diversity, target ~35
def emb_of(p):
    es = [f['emb'] for f in (p['f0'], p['f1']) if f and f['emb']]
    return norm(np.concatenate([norm(e) for e in es])) if es else None
def hist_of(p):
    img = cv2.imread('thumbs/' + p['r']['name'])
    hst = cv2.calcHist([img], [0, 1, 2], None, [8, 8, 8], [0, 256] * 3)
    return cv2.normalize(hst, hst).flatten()
TARGET = 35
quota = []
for s in scenes:
    q = 1 if len(s) < 8 else 2
    quota.append(q)
while sum(quota) > 42:
    i = max(range(len(scenes)), key=lambda i: quota[i] - (len(scenes[i]) / 50.0))
    if quota[i] > 1: quota[i] -= 1
    else: break
selected = []
for si, s in enumerate(scenes):
    cand = sorted(s, key=lambda p: -p['score'])
    take = []
    for p in cand:
        if len(take) >= quota[si]: break
        ok = True
        for q in take:
            hsim = float(cv2.compareHist(hist_of(p), hist_of(q), cv2.HISTCMP_CORREL))
            dt = abs(p['t'] - q['t'])
            if hsim > 0.93 and dt < 120: ok = False; break
        if ok: take.append(p)
    for p in take:
        p['scene'] = si
        selected.append(p)
selected.sort(key=lambda p: p['t'])
# trim to target by dropping lowest-score extras from 2-quota scenes
while len(selected) > 40:
    twos = collections.Counter(p['scene'] for p in selected)
    cands = [p for p in selected if twos[p['scene']] > 1]
    if not cands: break
    drop = min(cands, key=lambda p: p['score'])
    selected.remove(drop)
print('selected:', len(selected))

json.dump([{'name': p['r']['name'], 'scene': p['scene'], 't': p['t'],
            'dto': p['r']['dto'], 'score': round(p['score'], 3),
            'others': p['others'],
            'bride_face': (p['f0'] if bride_cluster == 0 else p['f1'])['box'],
            'groom_face': (p['f1'] if bride_cluster == 0 else p['f0'])['box']}
           for p in selected], open('selected.json', 'w'), ensure_ascii=False, indent=1)

# CSV report for all photos
import csv
with open('photo_analysis.csv', 'w', newline='', encoding='utf-8-sig') as fh:
    wcsv = csv.writer(fh)
    wcsv.writerow(['file', 'datetime', 'groom_found', 'bride_found', 'both', 'sharpness',
                   'exposure_mean', 'overexp_frac', 'faces_total', 'extra_people',
                   'score', 'scene', 'decision', 'reason'])
    selnames = {p['r']['name'] for p in selected}
    scene_of = {}
    for si, s in enumerate(scenes):
        for p in s: scene_of[p['r']['name']] = si
    for p in photos:
        r = p['r']
        hasb = p['has0'] if bride_cluster == 0 else p['has1']
        hasg = p['has1'] if bride_cluster == 0 else p['has0']
        if r['name'] in selnames:
            dec, why = 'KEEP', 'selected: best of scene %02d' % scene_of.get(r['name'], -1)
        elif not p['both']:
            dec = 'EXCLUDE'
            why = 'bride_or_groom_missing' if (hasb or hasg) else 'couple_not_found'
        elif r['sharp'] < 40:
            dec, why = 'EXCLUDE', 'blur'
        elif p.get('score', 0) <= 0:
            dec, why = 'EXCLUDE', 'poor_composition_or_exposure'
        else:
            dec, why = 'EXCLUDE', 'duplicate_or_weaker_than_scene_best'
        wcsv.writerow([r['name'], r['dto'], int(hasg), int(hasb), int(p['both']),
                       r['sharp'], r['mean'], r['over'], r['nfaces'], p['others'],
                       round(p.get('score', 0), 3), scene_of.get(r['name'], ''),
                       dec, why])

# rejected examples (up to 20)
rej = {'blur': [], 'bride_or_groom_missing': [], 'duplicate': [], 'poor_composition': []}
for p in photos:
    r = p['r']
    if r['name'] in {q['r']['name'] for q in selected}: continue
    if p['both'] and r['sharp'] < 40 and len(rej['blur']) < 5: rej['blur'].append(r['name'])
    elif not p['both'] and (p['has0'] or p['has1']) and len(rej['bride_or_groom_missing']) < 5:
        rej['bride_or_groom_missing'].append(r['name'])
    elif p['both'] and p.get('score', 0) <= 0 and len(rej['poor_composition']) < 5:
        rej['poor_composition'].append(r['name'])
    elif p['both'] and len(rej['duplicate']) < 5:
        rej['duplicate'].append(r['name'])
json.dump(rej, open('rejected_examples.json', 'w'), indent=1)

# montages of selected (grids 7x3, 300px tiles)
os.makedirs('sel_montage', exist_ok=True)
tiles = []
for idx, p in enumerate(selected):
    img = cv2.imread('thumbs/' + p['r']['name'])
    hh, ww = img.shape[:2]
    sc = 300.0 / max(hh, ww)
    img = cv2.resize(img, (int(ww * sc), int(hh * sc)))
    canvas = np.zeros((320, 300, 3), np.uint8)
    y0 = (300 - img.shape[0]) // 2; x0 = (300 - img.shape[1]) // 2
    canvas[y0:y0 + img.shape[0], x0:x0 + img.shape[1]] = img
    cv2.putText(canvas, '%02d s%02d %s' % (idx + 1, p['scene'], p['r']['name'][:14]),
                (4, 314), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1)
    tiles.append(canvas)
per = 21
for mi in range(0, len(tiles), per):
    chunk = tiles[mi:mi + per]
    while len(chunk) % 7: chunk.append(np.zeros((320, 300, 3), np.uint8))
    rows = [cv2.hconcat(chunk[i:i + 7]) for i in range(0, len(chunk), 7)]
    m = cv2.vconcat(rows)
    fp = 'sel_montage/sel_%d.jpg' % (mi // per + 1)
    cv2.imwrite(fp, m, [cv2.IMWRITE_JPEG_QUALITY, 78])
    print(fp, os.path.getsize(fp))

# download originals of selected
base = open('dlbase.txt').read().strip()
os.makedirs('selected_orig', exist_ok=True)
def dl(p, idx):
    nm = p['r']['name']
    u = base + '/' + urllib.parse.quote('DJpE/t5D4AmSeg/' + nm)
    out = 'selected_orig/%03d_scene%02d_%s' % (idx + 1, p['scene'], nm.replace(' ', '_'))
    for t in range(3):
        try:
            r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(r, timeout=90).read()
            open(out, 'wb').write(data)
            return
        except Exception as e:
            if t == 2: print('DLFAIL', nm, e)
ths = []
for idx, p in enumerate(selected):
    th = threading.Thread(target=dl, args=(p, idx)); th.start(); ths.append(th)
    if len(ths) >= 8:
        for th in ths: th.join()
        ths = []
for th in ths: th.join()
print('originals:', len(os.listdir('selected_orig')))
print('SELECT_DONE')
