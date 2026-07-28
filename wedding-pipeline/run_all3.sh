#!/bin/bash
# v4: self-checkpointing pipeline. Requires ckpt_put.txt, ckpt_get.txt, res_put.txt in /home/user
cd /home/user
exec >> /home/user/run_all.log 2>&1
echo "=== v4 start $(date +%H:%M:%S) ==="
if [ ! -s analysis_compact.jsonl ] && [ -s ckpt_get.txt ]; then
  curl -sfL -o ckpt.tar.gz "$(cat ckpt_get.txt)?cb=$$RANDOM" && tar xzf ckpt.tar.gz 2>/dev/null && echo "restored $(wc -l < analysis_compact.jsonl 2>/dev/null || echo 0) records from checkpoint"
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
(while true; do sleep 40; ckpt_save; done) & CKPID=$!
python3 analyze2.py || { echo "FATAL: analyze failed"; kill $CKPID; ckpt_save; exit 1; }
echo "analyze done $(date +%H:%M:%S)"
python3 cluster2.py || { echo "FATAL: cluster failed"; kill $CKPID; ckpt_save; exit 1; }
python3 choose2.py || { echo "FATAL: choose failed"; kill $CKPID; ckpt_save; exit 1; }
kill $CKPID 2>/dev/null
ckpt_save
tar czf results.tar.gz clusters.json selected.json photo_analysis.csv rejected_examples.json sel_montage cluster_montage.jpg analysis_compact.jsonl 2>/dev/null
curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @results.tar.gz -o /dev/null -w "results PUT %{http_code}\n" "$(cat res_put.txt)"
echo "ALL_DONE $(date +%H:%M:%S)"
