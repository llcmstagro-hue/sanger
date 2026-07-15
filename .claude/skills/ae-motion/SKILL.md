---
name: ae-motion
description: Automates Adobe After Effects with ExtendScript (JSX) — creating comps, layers, keyframes, and expressions from script, applying common expressions (wiggle, loopOut, valueAtTime), and rendering via Render Queue or aerender. Use when the user wants AE projects built or modified programmatically, or batch/template-driven AE rendering.
---

# After Effects Automation with ExtendScript

## Environment check first

AE automation requires After Effects installed (Windows/macOS only — there is no Linux AE). Before promising anything, check:

- macOS: `ls /Applications | grep -i "after effects"` and the renderer `ls "/Applications/Adobe After Effects"*/aerender`
- Windows: `aerender.exe` under `C:\Program Files\Adobe\Adobe After Effects <ver>\Support Files\`

If AE is absent (e.g. this Linux container), do not attempt to run anything — write the `.jsx` script and hand it to the user with run instructions (File > Scripts > Run Script File, or `AfterFX -r script.jsx` / `osascript -e 'tell application "Adobe After Effects ..." to DoScriptFile ...'`). For scripts to run, enable Preferences > Scripting & Expressions > "Allow Scripts to Write Files and Access Network".

ExtendScript is ES3-era JavaScript: no `let`/`const`, no arrow functions, no template literals, no `JSON` global. Write `var` and `function` throughout.

## Project, comp, and layers

```javascript
// build.jsx
app.beginUndoGroup("Build Title Card");

var proj = app.project || app.newProject();
var comp = proj.items.addComp("TitleCard", 1920, 1080, 1.0, 10, 30); // name,w,h,PAR,dur(s),fps

// solid background
var bg = comp.layers.addSolid([0.055, 0.055, 0.07], "BG", 1920, 1080, 1.0);

// text layer
var title = comp.layers.addText("Open House · Kapolei");
var srcText = title.property("Source Text");
var doc = srcText.value;
doc.fontSize = 110;
doc.font = "Raleway-Bold";            // PostScript name, not display name
doc.fillColor = [0.7, 0.125, 0.145];
doc.justification = ParagraphJustification.CENTER_JUSTIFY;
srcText.setValue(doc);
title.property("Position").setValue([960, 560]);

// footage import
var footage = proj.importFile(new ImportOptions(File("/path/to/broll.mp4")));
var clip = comp.layers.add(footage);
clip.startTime = 2;

app.endUndoGroup();
```

Key facts: colors are `[r,g,b]` in 0–1; times are in **seconds** (convert from frames: `frame / comp.frameRate`); layer index 1 is topmost; access properties by matchName-safe paths like `layer.property("Transform").property("Opacity")` — the shorthand `layer.property("Opacity")` works for transform props.

## Keyframes from script

```javascript
var pos = title.property("Position");
pos.setValueAtTime(0,   [960, 660]);
pos.setValueAtTime(0.5, [960, 560]);

var op = title.property("Opacity");
op.setValuesAtTimes([0, 0.5], [0, 100]);

// easing: one KeyframeEase per dimension, applied per keyframe index (1-based)
var easeIn  = new KeyframeEase(0, 66);   // speed, influence(0.1–100)
var easeOut = new KeyframeEase(0, 66);
pos.setTemporalEaseAtKey(1, [easeOut, easeOut]);
pos.setTemporalEaseAtKey(2, [easeIn, easeIn]);
// For hold keyframes: pos.setInterpolationTypeAtKey(2, KeyframeInterpolationType.HOLD);
```

2D properties need arrays of 2 `KeyframeEase` objects, 3D need 3, scalars need 1 — mismatched counts throw.

## Expressions (set as strings)

```javascript
// organic drift on a null/camera
layer.property("Position").expression = "wiggle(2, 15)";   // 2 Hz, 15 px

// cycle keyframed animation forever
layer.property("Rotation").expression = 'loopOut("cycle")';   // also "pingpong", "offset", "continue"

// echo another layer's motion with a 0.15s lag
layer.property("Position").expression =
  'thisComp.layer("Leader").transform.position.valueAtTime(time - 0.15)';

// staggered entrance by layer index (offset each layer 3 frames)
layer.property("Opacity").expression =
  'var d = (index - 1) * 3 / thisComp.frameDuration / thisComp.frameRate;' +
  'linear(time, d, d + 0.4, 0, 100)';

// bounce-settle on scale (drop-in classic)
layer.property("Scale").expression =
  'var n = 0; if (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) n--; }' +
  'if (n === 0) { value } else { var t = time - key(n).time, amp = velocityAtTime(key(n).time - 0.001);' +
  'value + amp * Math.sin(8 * Math.PI * t) / Math.exp(4 * t) * thisComp.frameDuration; }';
```

Expressions evaluate per-frame inside AE; keyframes + `loopOut`/`valueAtTime` cover most template needs without baking hundreds of keys. Templates: name placeholder layers predictably ("TITLE", "SUBTITLE", "PHOTO_1") so a data-driven script can find them with a `for` loop over `comp.layers` and swap `Source Text` / footage.

## Rendering

In-script queue:

```javascript
var rq = app.project.renderQueue;
var item = rq.items.add(comp);
item.outputModule(1).applyTemplate("Lossless");        // or a named OM template
item.outputModule(1).file = new File("/tmp/out/title.mov");
rq.render();   // synchronous
```

Batch/headless via aerender (preferred for automation — no UI):

```bash
"/Applications/Adobe After Effects 2025/aerender" \
  -project /path/proj.aep -comp "TitleCard" \
  -RStemplate "Best Settings" -OMtemplate "Lossless" \
  -output /tmp/out/title.mov
```

Modern AE has no direct H.264 output module; render lossless/ProRes then transcode: `ffmpeg -i title.mov -c:v libx264 -pix_fmt yuv420p -crf 18 title.mp4`. For final delivery pipelines Adobe expects Media Encoder, but aerender + ffmpeg is the scriptable path.

## Debugging

- Wrap risky sections in `try { ... } catch (e) { alert(e.line + ": " + e.toString()); }` — ExtendScript errors are otherwise opaque.
- Log to a file (`var f = File("~/ae_log.txt"); f.open("a"); f.writeln(msg); f.close();`) when running headless.
- Always `app.beginUndoGroup`/`endUndoGroup` so a botched run is one Ctrl+Z for the user.
- Verify font PostScript names with a tiny probe script before building text-heavy comps; a missing font silently substitutes.
