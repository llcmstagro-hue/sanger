#!/bin/bash
# Autonomous wedding-photo pipeline stage 1: setup -> analyze -> cluster -> checkpoint
cd /home/user
exec >> /home/user/run_all.log 2>&1
echo "=== run_all $(date +%H:%M:%S) ==="
python3 -c "import cv2" 2>/dev/null || pip install -q numpy opencv-python-headless python-pptx reportlab
[ -s yunet.onnx ] || curl -sL -o yunet.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
[ -s sface.onnx ] || curl -sL -o sface.onnx "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
[ -s files.json ] || python3 listing.py
echo "setup done $(date +%H:%M:%S)"
python3 analyze.py
echo "analyze done $(date +%H:%M:%S)"
python3 cluster.py
echo "cluster done $(date +%H:%M:%S)"
python3 select.py
echo "select done $(date +%H:%M:%S)"
echo "ALL_DONE $(date +%H:%M:%S)"
