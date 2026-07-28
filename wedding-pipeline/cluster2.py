import json, base64, os
import numpy as np

recs = [json.loads(l) for l in open('analysis_compact.jsonl')]
seen = set()
uniq = []
for r in recs:
    if r['n'] not in seen:
        seen.add(r['n']); uniq.append(r)
recs = uniq
recs.sort(key=lambda r: (r.get('d') or '9999', r['n']))

def deq(eb):
    q = np.frombuffer(base64.b64decode(eb), dtype=np.int8).astype(np.float32) / 127.0
    return q / (np.linalg.norm(q) + 1e-9)

faces = []
for r in recs:
    for i, f in enumerate(r['f']):
        if f[6] and f[4] >= 0.7 and f[3] >= 40:
            faces.append({'n': r['n'], 'box': f[:4], 'emb': deq(f[6])})
print('faces for clustering:', len(faces))
clusters = []
for f in faces:
    best, bi = -1, -1
    for ci, c in enumerate(clusters):
        s = float(np.dot(c['cent'], f['emb']))
        if s > best: best, bi = s, ci
    if best >= 0.40:
        c = clusters[bi]; c['members'].append(f)
        c['sum'] += f['emb']; c['cent'] = c['sum'] / np.linalg.norm(c['sum'])
    else:
        clusters.append({'members': [f], 'sum': f['emb'].copy(), 'cent': f['emb'].copy()})
clusters.sort(key=lambda c: -len(c['members']))
print('clusters:', len(clusters))
out = []
for ci, c in enumerate(clusters[:10]):
    names = set(m['n'] for m in c['members'])
    print('cluster', ci, 'faces', len(c['members']), 'photos', len(names))
    out.append({'id': ci, 'faces': len(c['members']), 'nphotos': len(names),
                'cent': [round(float(v), 5) for v in c['cent']],
                'exemplars': [{'name': m['n'], 'box': [float(v) for v in m['box']]}
                              for m in sorted(c['members'], key=lambda m: -m['box'][3])[:10]]})
json.dump(out, open('clusters.json', 'w'))
print('CLUSTER_DONE')
