#!/bin/bash
# Stage 2 runner: originals + contact sheet + pptx. Requires ckpt_get6.txt, out_put.txt, orig_put.txt
cd /home/user
exec >> /home/user/stage2.log 2>&1
echo "=== stage2 $(date +%H:%M:%S) ==="
if [ ! -s selected.json ]; then
  curl -sfL -o r.tar.gz "$(cat ckpt_get6.txt)" && tar xzf r.tar.gz && echo "restored state"
fi
[ -s selected.json ] || { echo "FATAL: no selected.json"; exit 1; }
python3 -c "import pptx, reportlab, PIL" 2>/dev/null || pip install python-pptx reportlab pillow > pip2.log 2>&1
python3 stage2.py || { echo "FATAL: stage2.py failed"; exit 1; }
tar czf stage2_out.tar.gz Wedding_Presentation.pptx selected_contact_sheet.pdf photo_analysis.csv selected.json rejected_examples.json clusters.json
curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @stage2_out.tar.gz -o /dev/null -w "out PUT %{http_code}\n" "$(cat out_put.txt)"
zip -q -0 -r originals.zip selected_orig
curl -s -X PUT -H "Content-Type: application/octet-stream" --data-binary @originals.zip -o /dev/null -w "orig PUT %{http_code}\n" "$(cat orig_put.txt)"
echo "STAGE2_ALL_DONE $(date +%H:%M:%S)"
