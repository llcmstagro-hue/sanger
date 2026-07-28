#!/bin/bash
# Stage 4 runner. Requires: photo_analysis.csv, clips4.json, segs_put.txt, film_put.txt in /home/user
cd /home/user
exec >> /home/user/stage4.log 2>&1
echo "=== stage4 $(date +%H:%M:%S) ==="
if [ ! -s photo_analysis.csv ]; then
  curl -sfL -o s2.tar.gz "https://d2ol7oe51mr4n9.cloudfront.net/user_3GRaVW9DP8KDs9Ei0s5ovvXoZIn/136c8ef1-f447-40a4-94c6-93b199f2f859.gz" && tar xzf s2.tar.gz && echo "csv restored"
fi
python3 -c "import PIL" 2>/dev/null || pip install pillow > /dev/null 2>&1
[ -s MUSIC4.mp3 ] || curl -sfL -o MUSIC4.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3"
ls -la MUSIC4.mp3
# resume segments from checkpoint if compatible (contains seg4/)
if [ ! -d seg4 ] && curl -sfL -o segs4.tar.gz "$(cat segs_get.txt 2>/dev/null)"; then
  tar xzf segs4.tar.gz 2>/dev/null; echo "seg4 restored: $(ls seg4 2>/dev/null | wc -l)"
fi
seg_ckpt() {
  tar czf segs4_new.tar.gz seg4 clipdl selected4.json 2>/dev/null && mv segs4_new.tar.gz segs4.tar.gz
  curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @segs4.tar.gz -o /dev/null -w "segs4 PUT %{http_code} $(date +%H:%M:%S)\n" "$(cat segs_put.txt)"
}
(while true; do sleep 90; seg_ckpt; done) & CKPID=$!
python3 stage4.py || { echo "FATAL stage4.py"; kill $CKPID; seg_ckpt; exit 1; }
kill $CKPID 2>/dev/null
seg_ckpt
curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @Wedding_Clip.mp4 -o /dev/null -w "clip PUT %{http_code}\n" "$(cat film_put.txt)"
echo "STAGE4_ALL_DONE $(date +%H:%M:%S)"
