---
name: blender-motion
description: Drives Blender via Python (bpy) scripting to build and render 3D scenes and animations — product shots, a 3D jersey, rotating hero renders — headlessly, saving stills/video into the site assets. Use for 3D render, product shot, 3D jersey/kit, turntable, or "render this in Blender" requests.
---

# Blender-Motion: Scripted 3D Rendering

Automate Blender with Python to produce premium 3D product renders and short animations for SANGER, run headless and saved as web-ready assets.

## When to use
- "Render a 3D jersey / product shot / rotating turntable / 3D hero."
- Repeatable, scripted 3D scenes (lighting rig, camera, materials as code).
- Batch renders at multiple angles or resolutions.

## Method
1. Write a `bpy` script (e.g. `scene.py`) that builds the scene deterministically:
   - Clear default scene, import/create geometry (`bpy.ops.import_scene.gltf` / `obj`, or generate a plane/cloth for a jersey).
   - Set units, camera (`bpy.data.cameras`), and a soft 3-point/HDRI lighting rig for premium studio look.
   - Materials via nodes: Principled BSDF; brand palette — fabric base near #FAFAF8 with #E4141C accent stripes, subtle roughness/sheen for cloth.
   - World background #FAFAF8 (or transparent: `render.film_transparent = True`).
2. Configure render settings in-script:
   - Engine `CYCLES` (photoreal) with GPU if available, or `BLENDER_EEVEE_NEXT` for speed.
   - `render.resolution_x/y`, `render.image_settings.file_format = 'PNG'` (RGBA for transparency), samples, denoising on.
3. For animation, keyframe a turntable: rotate the object or orbit the camera over `frame_start..frame_end`, set `fps`, output an image sequence (not a locked video) for flexibility.
4. Run headless from the terminal:
   - Still: `blender -b -P scene.py -o //render_ -f 1`
   - Animation frames: `blender -b -P scene.py -o //frames/turntable_ -a`
5. Post-process:
   - Encode animation: `ffmpeg -framerate 30 -i frames/turntable_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 jersey-turntable.mp4` (+ WebM).
   - Convert stills to web formats: `npx sharp -i render_0001.png -o product-jersey.webp --webp-quality 88` (keep a PNG for transparency).
6. Save outputs to `/home/user/sanger/public/assets/` (e.g. `product-jersey.webp`, `product-jersey.png`, `jersey-turntable.mp4/.webm`, poster WebP).

## Fallback
If Blender is not installed/available in this environment, still author the complete `bpy` script and save it (e.g. to the repo or scratchpad), then provide the exact headless command for the user to run locally. Do not fabricate render output. If a 3D-generation MCP (e.g. `mcp__higgsfield__generate_3d`) is connected, that can produce a GLB from an image which the script then imports and lights.

## Checklist
- [ ] Scene built deterministically in a `bpy` script (camera, lights, materials as code)
- [ ] Brand palette applied to materials; studio lighting rig set
- [ ] Render engine/resolution/samples/denoise configured; transparency where needed
- [ ] Headless render command(s) provided/run (`blender -b -P ... -a`)
- [ ] Stills (WebP+PNG) and/or animation (MP4+WebM+poster) saved to `/home/user/sanger/public/assets/`
- [ ] Absolute paths and run commands reported
