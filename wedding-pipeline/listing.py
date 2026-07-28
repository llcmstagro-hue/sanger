import json, urllib.request, urllib.parse

def get(u):
    r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(r, timeout=60).read()

disp = json.loads(get('https://cloud.mail.ru/api/v2/dispatcher?api=2'))
open('dlbase.txt', 'w').write(disp['body']['weblink_get'][0]['url'])
lst = json.loads(get('https://cloud.mail.ru/api/v2/folder?weblink=' +
                     urllib.parse.quote('DJpE/t5D4AmSeg') + '&offset=0&limit=1000&api=2'))
files = [f for f in lst['body']['list'] if f['name'].lower().endswith('.jpg')]
files.sort(key=lambda f: f['name'])
json.dump(files, open('files.json', 'w'))
print('files', len(files))
