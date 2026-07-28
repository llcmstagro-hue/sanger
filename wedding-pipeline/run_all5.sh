#!/bin/bash
# v5: slot-rotating self-checkpointing pipeline.
# Requires: slot_num.txt (current slot N), ckpt_put.txt (PUT url for slot N),
# slots_get.txt (bundled), optional res_put.txt
cd /home/user
exec >> /home/user/run_all.log 2>&1
echo "=== v5 start slot=$(cat slot_num.txt 2>/dev/null) $(date +%H:%M:%S) ==="
N=$(cat slot_num.txt 2>/dev/null || echo 1)
if [ ! -s analysis_compact.jsonl ]; then
  i=$((N - 1))
  while [ "$i" -ge 1 ]; do
    u=$(sed -n "${i}p" slots_get.txt)
    if curl -sfL -o restore.tar.gz "$u"; then
      tar xzf restore.tar.gz 2>/dev/null && echo "restored $(wc -l < analysis_compact.jsonl 2>/dev/null || echo 0) records from slot $i" && break
    fi
    i=$((i - 1))
  done
fi
if ! python3 -c "import cv2, numpy" 2>/dev/null; then
  for i in 1 2 3; do
    pip install numpy opencv-python-headless python-pptx reportlab > pip.log 2>&1 && break
    echo "pip attempt $i failed"; sleep 5
  done
fi
python3 -c "import cv2" || { echo "FATAL: cv2 missing"; exit 1; }
[ -s yunet.onnx ] || curl -sL --retry 3 -o yunet.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
[ -s sface.onnx ] || curl -sL --retry 3 -o sface.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
[ -s yunet.onnx ] && [ -s sface.onnx ] || { echo "FATAL: onnx models missing"; exit 1; }
[ -s files.json ] || python3 listing.py || { echo "FATAL: listing failed"; exit 1; }
echo "setup done $(date +%H:%M:%S)"
ckpt_save() {
  tar czf ckpt_new.tar.gz analysis_compact.jsonl clusters.json selected.json photo_analysis.csv rejected_examples.json sel_montage cluster_montage.jpg 2>/dev/null
  mv ckpt_new.tar.gz ckpt.tar.gz
  curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @ckpt.tar.gz -o /dev/null -w "ckpt PUT %{http_code} $(date +%H:%M:%S)\n" "$(cat ckpt_put.txt)"
}
(while true; do sleep 30; ckpt_save; done) & CKPID=$!
python3 analyze2.py || { echo "FATAL: analyze failed"; kill $CKPID; ckpt_save; exit 1; }
echo "analyze done $(date +%H:%M:%S)"
python3 cluster2.py || { echo "FATAL: cluster failed"; kill $CKPID; ckpt_save; exit 1; }
python3 choose2.py || { echo "FATAL: choose failed"; kill $CKPID; ckpt_save; exit 1; }
kill $CKPID 2>/dev/null
ckpt_save
if [ -s res_put.txt ]; then
  tar czf results.tar.gz clusters.json selected.json photo_analysis.csv rejected_examples.json sel_montage cluster_montage.jpg analysis_compact.jsonl 2>/dev/null
  curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @results.tar.gz -o /dev/null -w "results PUT %{http_code}\n" "$(cat res_put.txt)"
fi
echo "ALL_DONE $(date +%H:%M:%S)"
