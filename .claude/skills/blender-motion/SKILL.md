---
name: blender-motion
description: Builds and renders 3D scenes in Blender entirely from Python (bpy) — objects, materials, lights, camera, keyframed animation, and headless CLI rendering. Use when the user wants scripted 3D graphics, product-style renders, or 3D motion without opening the Blender UI.
---

# Scripted 3D with Blender + bpy

## Verify Blender first

Never promise a render before confirming the binary exists:

```bash
which blender && blender --version
```

If absent, check common locations (`/usr/bin/blender`, `/snap/bin/blender`, `/Applications/Blender.app/Contents/MacOS/Blender`, flatpak `org.blender.Blender`). If it's not installed, tell the user; offer to install it (`snap install blender --classic` or the apt/brew package) or to write the `.py` script for them to run locally. There is no useful bpy without Blender (the standalone `bpy` pip wheel exists only for specific Python versions — don't rely on it).

## Headless execution model

Scripts run inside Blender's bundled Python:

```bash
blender --background --python scene.py                    # run script, exit
blender --background --python scene.py -- --out /tmp/r    # args after "--" reach sys.argv
```

Read script args with `sys.argv[sys.argv.index("--") + 1:]`. Print progress to stdout; a silent 10-minute render looks like a hang.

## Scene construction pattern

Always start from a clean slate so reruns are deterministic:

```python
import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)   # empty scene, no default cube
scene = bpy.context.scene

# --- objects ---
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 0, 1), segments=64, ring_count=32)
ball = bpy.context.active_object
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
floor = bpy.context.active_object

# --- material (Principled BSDF via node inputs) ---
mat = bpy.data.materials.new("Red")
mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.70, 0.13, 0.15, 1.0)
bsdf.inputs["Roughness"].default_value = 0.35
ball.data.materials.append(mat)

# --- lights ---
key = bpy.data.objects.new("Key", bpy.data.lights.new("Key", type='AREA'))
key.data.energy = 800; key.data.size = 4
key.location = (4, -4, 6); key.rotation_euler = (0.9, 0, 0.8)
scene.collection.objects.link(key)

# --- camera ---
cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
cam.location = (7, -7, 4); cam.rotation_euler = (1.15, 0, 0.785)
scene.collection.objects.link(cam)
scene.camera = cam
```

Practical notes:

- Prefer the data API (`bpy.data.*.new` + `collection.objects.link`) over `bpy.ops` where easy — ops depend on context and are the main source of headless failures. Primitives via ops are fine right after a scene reset.
- Aim the camera robustly with a Track To constraint on an empty at the subject instead of hand-tuning eulers:
  `c = cam.constraints.new('TRACK_TO'); c.target = target_empty`
- Set color once, in linear space; note Base Color takes RGBA.
- Print `bpy.app.version` in the script — node/input names occasionally shift between versions; if an input name KeyErrors, print `[i.name for i in bsdf.inputs]` and adapt.

## Keyframing animation

```python
scene.frame_start, scene.frame_end = 1, 90
scene.render.fps = 30

ball.location = (0, 0, 4);  ball.keyframe_insert("location", frame=1)
ball.location = (0, 0, 1);  ball.keyframe_insert("location", frame=30)
ball.scale = (1.2, 1.2, 0.7); ball.keyframe_insert("scale", frame=32)   # squash
ball.scale = (1, 1, 1);       ball.keyframe_insert("scale", frame=40)

# easing: work on fcurves after inserting
for fc in ball.animation_data.action.fcurves:
    for kp in fc.keyframe_points:
        kp.interpolation = 'BEZIER'   # or 'LINEAR', 'BOUNCE', 'ELASTIC'
```

Keyframe any animatable property the same way: `obj.keyframe_insert("rotation_euler", frame=n)`, light `energy`, material inputs via `bsdf.inputs["Roughness"].keyframe_insert("default_value", frame=n)`.

## Render settings and output

```python
scene.render.engine = 'CYCLES'            # or 'BLENDER_EEVEE_NEXT' (fast previews; name varies by version — check)
scene.cycles.samples = 128
scene.render.resolution_x, scene.render.resolution_y = 1920, 1080
scene.render.filepath = "/tmp/out/frame_"
scene.render.image_settings.file_format = 'PNG'

bpy.ops.render.render(write_still=True)   # single frame
# bpy.ops.render.render(animation=True)   # frame_start..frame_end as numbered PNGs
```

- Render animations to **PNG frames, not direct video** — a crash mid-render keeps completed frames. Assemble after: `ffmpeg -framerate 30 -i /tmp/out/frame_%04d.png -c:v libx264 -pix_fmt yuv420p out.mp4`.
- Cycles on CPU is slow: prototype at 64 samples / half resolution, enable denoising (`scene.cycles.use_denoising = True`), final-render only when the look is approved. EEVEE renders 10–100x faster and is fine for stylized motion graphics.
- Alternatively set output opts from the CLI: `blender -b file.blend -o //render/ -F PNG -s 1 -e 90 -a`.

## Workflow

1. Confirm blender exists; note the version.
2. Write `scene.py`; render **one still at low samples** first.
3. Read the PNG to inspect framing, lighting, materials. Fix in script, re-render.
4. Only then run the full animation render, in the background (`run_in_background`), and assemble with ffmpeg.
5. Optionally `bpy.ops.wm.save_as_mainfile(filepath="scene.blend")` so the user can open the result in the UI.
