---
name: ae-motion
description: Generates ExtendScript (JSX) scripts that automate Adobe After Effects — building compositions, layers, keyframes, and expressions programmatically, then rendering motion-graphics for SANGER. Use when asked to automate After Effects, script an AE comp, build lower-thirds/title cards, or produce broadcast-style motion graphics.
---

# Ae-Motion: After Effects Automation via ExtendScript

Produce ExtendScript (JSX) that builds and animates After Effects compositions programmatically, so motion-graphics templates are reproducible and batchable.

## When to use
- "Automate After Effects / script an AE comp / generate a title card / lower-third."
- Broadcast-style motion graphics, animated logos, stat overlays.
- Batch-generating many variants of one MoGraph template.

## Method
1. Author a `.jsx` script targeting the AE DOM (`app.project`):
   - Create the comp: `app.project.items.addComp("SANGER Promo", 1920, 1080, 1, dur, 30)`.
   - Add layers: text (`comp.layers.addText("SANGER")`), solids (`comp.layers.addSolid([r,g,b],...)`), and imported footage/`public/assets` images via `app.project.importFile(new ImportOptions(File(path)))`.
2. Animate with keyframes on transform properties:
   - `layer.property("Transform").property("Position").setValueAtTime(t, [x,y])`.
   - Use `setInterpolationTypeAtKey(i, KeyframeInterpolationType.BEZIER)` and set temporal ease (`setTemporalEaseAtKey`) for smooth easing — avoid linear defaults.
   - For staggered title reveals, offset each layer's keyframe times.
3. Add expressions for procedural motion where cleaner than keyframes:
   - Bounce/overshoot, `wiggle()`, or `loopOut()` via `property.expression = "...";`.
4. Brand it: text fill #111111 or #E4141C on a #FAFAF8 background solid; set fonts through the text `SourceText` `TextDocument` (font name, size, tracking). Bundle brand colors as variables at the top of the script.
5. Wrap edits in `app.beginUndoGroup("Build SANGER Comp") ... app.endUndoGroup()` and add `#target aftereffects` at the top.
6. Run and render:
   - Interactive: File > Scripts > Run Script File, or place in the Scripts folder.
   - Headless render via `aerender`: add the comp to the render queue in-script (`app.project.renderQueue.items.add(comp)`) then `aerender -project proj.aep -comp "SANGER Promo" -output out/promo.mov`.
   - Transcode the ProRes/MOV to web with `ffmpeg -i out/promo.mov -c:v libx264 -pix_fmt yuv420p -crf 18 promo.mp4` (+ WebM), plus a poster WebP.
7. Save final video/poster to `/home/user/sanger/public/assets/`; keep the `.jsx` and `.aep` as source (scratchpad or repo).

## Fallback
After Effects is a desktop app and almost never present in this environment. Deliver the complete, correct `.jsx` script and the exact run/`aerender` commands for the user to execute locally — do not fabricate rendered output. For a fully code-native alternative that CAN render here, recommend the `remotion-superpowers` skill instead.

## Checklist
- [ ] `#target aftereffects` set and edits wrapped in an undo group
- [ ] Comp created with correct dimensions/fps/duration
- [ ] Keyframes use Bezier interpolation + temporal ease (not linear); staggered reveals offset per layer
- [ ] Expressions used where they beat manual keyframes
- [ ] Brand palette/fonts applied; assets imported from `public/assets`
- [ ] `aerender` + ffmpeg commands provided; final MP4/WebM+poster path in `/home/user/sanger/public/assets/`
- [ ] `.jsx` source saved and absolute paths reported
