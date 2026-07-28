#!/bin/bash
# Autonomous wedding-photo pipeline stage 1: setup -> analyze -> cluster -> select
cd /home/user
exec >> /home/user/run_all.log 2>&1
echo "=== run_all $(date +%H:%M:%S) ==="
if ! python3 -c "import cv2, numpy" 2>/dev/null; then
  for i in 1 2 3; do
    pip install numpy opencv-python-headless python-pptx reportlab > pip.log 2>&1 && break
    echo "pip attempt $i failed: $(tail -2 pip.log)"
    sleep 5
  done
fi
python3 -c "import cv2, numpy; print('cv2', cv2.__version__)" || { echo "FATAL: cv2 missing"; exit 1; }
for m in yunet.onnx sface.onnx; do
  [ -s $m ] || ok=missing
done
[ -s yunet.onnx ] || curl -sL --retry 3 -o yunet.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
[ -s sface.onnx ] || curl -sL --retry 3 -o sface.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
[ -s yunet.onnx ] && [ -s sface.onnx ] || { echo "FATAL: onnx models missing"; exit 1; }
[ -s files.json ] || python3 listing.py || { echo "FATAL: listing failed"; exit 1; }
echo "setup done $(date +%H:%M:%S)"
python3 analyze.py || { echo "FATAL: analyze failed"; exit 1; }
echo "analyze done $(date +%H:%M:%S)"
python3 cluster.py || { echo "FATAL: cluster failed"; exit 1; }
echo "cluster done $(date +%H:%M:%S)"
python3 choose.py || { echo "FATAL: select failed"; exit 1; }
echo "select done $(date +%H:%M:%S)"
echo "ALL_DONE $(date +%H:%M:%S)"
