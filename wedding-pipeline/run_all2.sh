#!/bin/bash
# Incremental wedding pipeline: setup -> seed -> analyze2 -> cluster2 -> choose2
cd /home/user
exec >> /home/user/run_all.log 2>&1
echo "=== run_all2 $(date +%H:%M:%S) ==="
if ! python3 -c "import cv2, numpy" 2>/dev/null; then
  for i in 1 2 3; do
    pip install numpy opencv-python-headless python-pptx reportlab > pip.log 2>&1 && break
    echo "pip attempt $i failed: $(tail -2 pip.log)"; sleep 5
  done
fi
python3 -c "import cv2" || { echo "FATAL: cv2 missing"; exit 1; }
[ -s yunet.onnx ] || curl -sL --retry 3 -o yunet.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
[ -s sface.onnx ] || curl -sL --retry 3 -o sface.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
[ -s yunet.onnx ] && [ -s sface.onnx ] || { echo "FATAL: onnx models missing"; exit 1; }
[ -s files.json ] || python3 listing.py || { echo "FATAL: listing failed"; exit 1; }
if [ ! -s analysis_compact.jsonl ]; then
  curl -sfL -o analysis_seed.jsonl "https://raw.githubusercontent.com/llcmstagro-hue/sanger/refs/heads/claude/wedding-presentation-film-naxo2h/wedding-pipeline/analysis_seed.jsonl" && cp analysis_seed.jsonl analysis_compact.jsonl && echo "seeded $(wc -l < analysis_compact.jsonl) records"
fi
echo "setup done $(date +%H:%M:%S)"
python3 analyze2.py || { echo "FATAL: analyze failed"; exit 1; }
echo "analyze done $(date +%H:%M:%S)"
python3 cluster2.py || { echo "FATAL: cluster failed"; exit 1; }
python3 choose2.py || { echo "FATAL: choose failed"; exit 1; }
echo "ALL_DONE $(date +%H:%M:%S)"
