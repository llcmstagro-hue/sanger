import json, collections, os
import numpy as np
import cv2

recs = [json.loads(l) for l in open('analysis.jsonl')]
recs.sort(key=lambda r: (r.get('dto') or '9999', r['name']))
faces = []
for r in recs:
    for i, f in enumerate(r['faces']):
        if f['emb'] and f['score'] >= 0.7 and f['box'][3] >= 40:
            faces.append({'name': r['name'], 'i': i, 'box': f['box'],
                          'emb': np.array(f['emb'], dtype=np.float32)})
print('faces for clustering:', len(faces))
for f in faces:
    f['emb'] /= (np.linalg.norm(f['emb']) + 1e-9)
clusters = []
for f in faces:
    best, bi = -1, -1
    for ci, c in enumerate(clusters):
        sim = float(np.dot(c['cent'], f['emb']))
        if sim > best:
            best, bi = sim, ci
    if best >= 0.40:
        c = clusters[bi]
        c['members'].append(f)
        c['sum'] += f['emb']
        c['cent'] = c['sum'] / np.linalg.norm(c['sum'])
    else:
        clusters.append({'members': [f], 'sum': f['emb'].copy(), 'cent': f['emb'].copy()})
clusters.sort(key=lambda c: -len(c['members']))
print('clusters:', len(clusters))
out = []
for ci, c in enumerate(clusters[:10]):
    names = set(m['name'] for m in c['members'])
    print('cluster', ci, 'faces', len(c['members']), 'photos', len(names))
    out.append({'id': ci, 'faces': len(c['members']), 'nphotos': len(names),
                'photos': sorted(names),
                'cent': [round(float(v), 5) for v in c['cent']],
                'exemplars': [{'name': m['name'], 'box': [float(v) for v in m['box']]}
                              for m in sorted(c['members'], key=lambda m: -m['box'][3])[:12]]})
json.dump(out, open('clusters.json', 'w'))

tile = 112
rows = []
for c in out[:6]:
    row = []
    for e in c['exemplars'][:8]:
        img = cv2.imread('thumbs/' + e['name'])
        if img is None:
            continue
        x, y, w, h = [int(v) for v in e['box']]
        pad = int(h * 0.3)
        x0, y0 = max(0, x - pad), max(0, y - pad)
        crop = img[y0:y + h + pad, x0:x + w + pad]
        if crop.size == 0:
            continue
        row.append(cv2.resize(crop, (tile, tile)))
    while len(row) < 8:
        row.append(np.zeros((tile, tile, 3), np.uint8))
    rows.append(cv2.hconcat(row[:8]))
if rows:
    m = cv2.vconcat(rows)
    cv2.imwrite('cluster_montage.jpg', m, [cv2.IMWRITE_JPEG_QUALITY, 80])
    print('montage bytes', os.path.getsize('cluster_montage.jpg'))
