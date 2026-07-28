#!/bin/bash
# Stage 3 runner. Requires: clips.json, film_put.txt in /home/user (written at launch)
cd /home/user
exec >> /home/user/stage3.log 2>&1
echo "=== stage3 $(date +%H:%M:%S) ==="
if [ ! -s selected.json ]; then
  curl -sfL -o r.tar.gz "https://d2ol7oe51mr4n9.cloudfront.net/user_3GRaVW9DP8KDs9Ei0s5ovvXoZIn/bb0adaf2-413f-4254-852e-0cad97ece90d.gz" && tar xzf r.tar.gz && echo "state restored"
fi
if [ ! -d sel_1080 ] || [ "$(ls sel_1080 2>/dev/null | wc -l)" -lt 35 ]; then
  curl -sfL -o originals.zip "https://d2ol7oe51mr4n9.cloudfront.net/user_3GRaVW9DP8KDs9Ei0s5ovvXoZIn/4d747b7c-909a-4b4e-a26d-fba043a62f7b.gz" && unzip -q -o originals.zip
  mkdir -p sel_1080
  for f in selected_orig/*.jpg; do
    b=$(basename "$f")
    [ -s "sel_1080/$b" ] || convert "$f" -auto-orient -resize 1920x1920 -quality 90 "sel_1080/$b"
  done
  echo "sel_1080 ready: $(ls sel_1080 | wc -l)"
fi
python3 -c "import PIL" 2>/dev/null || pip install pillow > /dev/null 2>&1
# restore segments checkpoint if present
if [ ! -d segments ] && curl -sfL -o segs.tar.gz "$(cat segs_get.txt 2>/dev/null)"; then
  tar xzf segs.tar.gz 2>/dev/null && echo "segments restored: $(ls segments 2>/dev/null | wc -l)"
fi
seg_ckpt() {
  tar czf segs_new.tar.gz segments clips 2>/dev/null && mv segs_new.tar.gz segs.tar.gz
  curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @segs.tar.gz -o /dev/null -w "segs PUT %{http_code} $(date +%H:%M:%S)\n" "$(cat segs_put.txt)"
}
(while true; do sleep 90; seg_ckpt; done) & CKPID=$!
python3 stage3.py || { echo "FATAL stage3.py"; kill $CKPID; seg_ckpt; exit 1; }
kill $CKPID 2>/dev/null
seg_ckpt
curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @Wedding_Film.mp4 -o /dev/null -w "film PUT %{http_code}\n" "$(cat film_put.txt)"
echo "STAGE3_ALL_DONE $(date +%H:%M:%S)"
