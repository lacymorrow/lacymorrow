# flash: Made in Flash

World `flash`, working title "The Arcade". Link: `/play/art`.

Concept in one sentence: glossy 2004 vector swooshes fly past the camera, one of them stays and becomes a filmstrip carrying all 21 real Flash art pieces past a gate, and an easel on the right paints whichever piece is at the gate, stroke by stroke, as you scroll.

## 1. The person and the moment

A stranger who just read "still plays: Flash art and a Flash music player" in the list above, scrolling on with mild doubt, and who in the next ten seconds should see a real piece from that era drawing itself and believe the line.

## 2. The one link and the overlay copy

| field | value |
|-------|-------|
| id | `flash` |
| title | Made in Flash |
| line | I drew these with code in Flash years ago, and they still run. |
| href | `/play/art` |
| cta | See the art |
| background | `#06070f` |
| lengthVh | 340 |
| budget | `{ assetsKb: 1000, triangles: 5000 }` |

The overlay sits top left, visible from progress 0, title `#fafafa` in Instrument Serif, line `#a1a1aa`, cta `#fafafa` underlined. The scene keeps the top left 40 percent by 35 percent of the viewport clear of ribbons at every progress so the text never fights a lime swoosh.

One extra HTML element is allowed in this world and here is why: a list of art pieces without names is not a list. A caption in the site's mono (12 px, letter-spacing 0.06em, `#a1a1aa`, piece name in `#fafafa`) hangs just under the easel ledge and reads, for example:

```
07 / 21   tree
```

It changes only when the current piece changes (at most 21 re-renders per scroll). On a fine pointer, once the frame at the gate has been still for 400 ms, the caption grows a tail, `click to play`, the same words the piece pages use. On a coarse pointer the tail is `tap to open`. The caption is `pointer-events: none` except in the failed state in section 6. The link in the overlay stays the primary action of the screen; the easel click is the one sanctioned exception from the contract, and on phones it is the same link the cta points to, one piece deeper.

The line does not repeat the paper above ("Built in ActionScript back when that was the web. Preserved with Ruffle."). The paper claims it. The world shows it.

## 3. The beat sheet

Coordinates are world units, camera FOV 42 vertical, near 0.1, far 200. Landscape layout is given here; the portrait layout is in section 6.

Fixed points (landscape):

| name | position | note |
|------|----------|------|
| camera | (0.4, 2.8, 15) looking at (0.2, 2.6, 0) | dollies to (0.9, 2.8, 13.8) between 0.2 and 0.9, ease in-out sine, then holds |
| gate G | (-2.6, 2.4, 1.0) | the point on the ribbon where the current piece sits |
| easel E | panel center (3.6, 2.7, 0), rotated -0.32 rad about Y so its face turns toward the camera | panel is 5.33 by 4.0 units, the 533 by 400 stage at 1 unit per 100 px |

Progress is scrubbed 1:1. Nothing smooths `progress` itself.

**0.00, the cut.** Paper white cuts to `#06070f`. Overlay title is already on screen. Right of center the easel stands at 60 percent opacity with a nearly blank canvas (piece 01, `isometrics`, frame 0 at 0.5 s: its background and first strokes). Left of center the first swoosh, lime, is already 30 percent drawn from the far back and swaying, and the white shine band is sweeping along it. The cyan one is 10 percent drawn. Nothing is static on the first frame even if the person never scrolls again.

**0.00 to 0.20, the flight.** Five swooshes draw themselves on from far away and erase from the tail as they pass, the way a masked motion tween looked in Flash 8: lime, cyan, orange, magenta, a thin white one. Twenty four thin white speed lines streak from the back toward the camera. The easel fades to full opacity by 0.20. The gallery ribbon, the sixth and largest swoosh, magenta, draws on from (-48, 10, -72) and its head reaches the gate at 0.20. The first real pieces are visible riding it from about 0.12, small and far away, which satisfies the twenty percent rule.

**0.20 to 0.22, arrival.** The first frame on the ribbon, `isometrics`, slides into the gate, lifts 0.85 units off the ribbon, grows 1.55 times and turns to face the camera. The easel begins painting it.

**0.22 to 0.90, the gallery.** The ribbon flows. Piece i (0-based) is at the gate at progress `0.22 + i * 0.034`; each piece owns 0.034 of progress, about 104 px of scroll at a 900 px viewport. Frames approach from the back left, pass the gate at left center, then dive down and out the bottom right of the frame. The easel paints the piece at the gate from its 0.5 s frame to its 6 s frame across that piece's span, then cuts to the next piece with a 150 ms crossfade. Fast scrolling flips through them like a timeline scrub. Slow scrolling watches each one draw.

Beats a builder can check:

| progress | at the gate | on the easel |
|----------|-------------|--------------|
| 0.2 | isometrics arriving | isometrics, phase 0 |
| 0.4 | 06 continual | continual, drawing |
| 0.6 | 12 shapes | shapes, drawing |
| 0.8 | 18 theme | theme, drawing |
| 0.9 | 21 weave | weave, drawing |
| 1.0 | ribbon tail gone | weave, complete, holding |

**0.90 to 1.00, the hold.** `weave` finishes on the easel by 0.917 and holds. The ribbon's tail dives past the gate and out. Camera holds. The last thing on screen is a finished painting, the caption `21 / 21   weave`, and "See the art".

Scrolling up reverses everything; every uniform is a function of progress.

## 4. The look

Committed, period accurate, and deliberate: flat vector shapes with gradient fills and a moving white specular band, on black. No lights, no PBR, no bloom, no lens flare. Everything is unlit. `toneMapped: false`, sRGB output, the hex values below are final screen colors.

Palette:

| role | hex |
|------|-----|
| background and fog | `#06070f` |
| lime swoosh | `#c6ff00` |
| cyan swoosh | `#19e6ff` |
| orange swoosh | `#ff8a00` |
| magenta swoosh and gallery ribbon | `#ff0099` (the site accent, hsl(324 100% 50%)) |
| white swoosh, speed lines, shine band | `#ffffff` |
| easel stand and panel border | `#26262b` and `#1a1a1f` |
| overlay title, cta, caption name | `#fafafa` |
| overlay line, caption | `#a1a1aa` |

Four saturated colors at full strength, everything else neutral. That restraint is what keeps a glossy look from turning into a template.

Ribbon fill, across the width (v from 0 at the bottom edge to 1 at the top): the color at 55 percent brightness at v=0 rising to full at v=1, a white band at 45 percent mixed in between v 0.58 and 0.78 with soft edges (the Web 2.0 gloss stripe), edges feathered over the outer 8 percent. Along the length (u), a white shine band of Gaussian width 0.035 sweeps from tail to head every 3.5 s, offset per ribbon so they never sweep together. Depth fade: mix toward `#06070f` from 30 to 110 units from the camera, done in the shader (custom materials do not get scene fog for free).

Frames on the ribbon: the thumbnail, a hairline white border (1.2 percent of the plane, anti-aliased with `fwidth`), no shadow.

Easel: three thin rods and a ledge in `#26262b`, the panel border `#1a1a1f`. It is furniture, it should disappear.

References a builder can search: "2advanced studios v4 flash site 2004", "Flash 8 swoosh motion tween tutorial", "web 2.0 glossy shine animation", "Erik Natzke flash generative art", "Jared Tarbell levitated.net", "Joshua Davis praystation". Lacy's pieces come from that lineage and this world is their lobby.

## 5. Assets

Everything is procedural except the captured pictures of the pieces. No downloaded models.

| asset | source | size |
|-------|--------|------|
| 6 ribbons (5 intro swooshes, 1 gallery ribbon) | procedural, section 6 | 0 KB |
| 24 speed lines | procedural, one InstancedMesh | 0 KB |
| 21 frame planes | procedural, one InstancedMesh | 0 KB |
| easel | procedural, 3 CylinderGeometry + 2 BoxGeometry + 2 PlaneGeometry merged | 0 KB |
| `public/static/play/art/ribbon.webp` | capture script, 21 tiles of 320x240 in a 7 by 3 grid, 2240x720 | ~120 KB |
| `public/static/play/art/easel/<name>.webp` x21 | capture script, 2 by 2 atlas of 533x400 frames at 0.5 s, 1.5 s, 3 s, 6 s, so 1066x800 | ~40 KB each, ~840 KB total, fetched on demand |
| `public/static/play/art/easel-low/<name>.webp` x21 | same, 266x200 frames, 532x400 | ~12 KB each, ~250 KB total |
| `public/static/play/art/thumbs/<name>.webp` x21 | capture script, single 6 s frame at 533x400 | ~14 KB each, poster uses one |
| `public/static/play/art/thumbs-sm/<name>.webp` x21 | 320x240, the tiles the ribbon atlas is packed from | ~6 KB each, poster uses four |
| `src/components/pages/home/worlds/flash/pieces.json` | capture script output: name, order, background hex, ink coverage at 6 s | ~2 KB |
| world JS chunk (including drei `Html`) | `next/dynamic` | ~24 KB gzipped |
| Ruffle runtime `public/ruffle/ruffle.js` + wasm | already on disk, 0.1.0-nightly.2023.09.23 | 373 KB js + 12.7 MB wasm raw, loaded only after a click on a fine pointer, never by scrolling, outside the world budget by design |

The gallery needs thumbnails. The SWFs are 10 KB each but mean nothing without a 12 MB emulator, and Ruffle draws to its own canvas which cannot be sampled cheaply into a three.js texture. So the pictures are captured once and committed.

Ribbon order, which is Lacy's own order from the brief and from `_meta.json` (isometrics first):

```
01 isometrics  02 stix     03 rtext     04 offset    05 sprout   06 continual  07 tree
08 scribe      09 shine    10 shinier   11 shinierier 12 shapes  13 lines      14 scribble
15 multi       16 orbit    17 expand    18 theme     19 converge 20 blank      21 weave
```

There are 21 SWFs in `public/flash/art/`, not 22. See section 11.

### Capture recipe, `scripts/capture-flash-art.mjs`

Run once, commit the outputs, rerun only when a piece changes. Playwright (chromium) and `sharp` (already a dependency).

1. Serve `public/` statically on a local port (`npx serve public -l 5055`). The script writes a one-page HTML into the scratchpad that loads `/ruffle/ruffle.js` and exposes `window.RufflePlayer`.
2. Launch chromium headless with `--use-angle=swiftshader --enable-unsafe-swiftshader`, viewport 700x500, `deviceScaleFactor: 2`.
3. For each name: `const p = window.RufflePlayer.newest().createPlayer()`, size it 533 by 400, append it, `p.load({ url: '/flash/art/<name>.swf', autoplay: 'on', unmuteOverlay: 'hidden', splashScreen: false, letterbox: 'off', contextMenu: 'off', preferredRenderer: 'canvas' })`. Wait for the `loadeddata` event, 15 s timeout.
4. Click the player center once (the pieces are click to play), then move the mouse along a slow Lissajous over the player for the whole run so mouse-reactive pieces produce something.
5. Element screenshots at 0.5 s, 1.5 s, 3 s and 6 s after the click, PNG, 1066x800 each.
6. With sharp: downscale each frame to 533x400 (supersampled), pack the 2 by 2 easel atlas, the 266x200 low atlas, the 533x400 thumb, the 320x240 small thumb; pack all small thumbs into `ribbon.webp` in order. WebP quality 80, effort 6. Vector fills compress well; the sizes above are estimates, the script prints the real ones.
7. Measure ink coverage at 6 s: the fraction of pixels more than 24 levels away from the dominant color. Record it and the dominant color as `background` in `pieces.json`. A piece under 2 percent coverage is flagged blank in the console and left out of `pieces.json` order; the caption count comes from `pieces.json` length, so the world stays honest without a code change.
8. Write a contact sheet, all 21 six-second frames in a 7 by 3 grid, to the scratchpad. It is the evidence artifact for the PR.

Expect `rtext.swf` (543 bytes) and `tree.swf` (693 bytes) to need a look. Files that small are usually a stub that loads something else, and the capture will show whether they render alone.

## 6. Technique

`@react-three/fiber` 8 with `three` 0.177, plus `@react-three/drei` (add it, import only `Html`). Everything below the stage's `Canvas`.

### Ribbons

One BufferGeometry per ribbon, built once at mount. Take a `CatmullRomCurve3` (centripetal), sample N points with `getSpacedPoints(N)` and `computeFrenetFrames(N)`, and for each point emit two vertices offset plus and minus `halfWidth(u)` along the normal, where `halfWidth(u) = W * pow(sin(u * PI), 0.6)` so both ends taper. Index as a triangle strip. Attributes: position, uv (u along the length 0..1, v across 0..1). N is 600 for the gallery ribbon and 300 per intro swoosh.

One `ShaderMaterial`, transparent, `depthWrite: false`, `side: DoubleSide`, blending normal. Uniforms: `uColor`, `uAlpha`, `uHead` (0..1, drawn up to here), `uTail` (0..1, erased up to here), `uTime`, `uShineOffset`, `uFlow`, `uFogColor`, `uFogNear`, `uFogFar`, `uCameraPos`.

Fragment, in words: `edge = smoothstep(0, 0.08, v) * smoothstep(1, 0.92, v)`; base color `mix(uColor * 0.55, uColor, v)`; gloss band `smoothstep(0.58, 0.64, v) * smoothstep(0.78, 0.72, v)` mixed 45 percent toward white; shine `exp(-pow((u - fract(uTime / 3.5 + uShineOffset)) * 28.0, 2.0))` mixed 55 percent toward white; on the gallery ribbon only, faint flow stripes `0.06 * (0.5 + 0.5 * sin((u * 220.0 - uFlow * 220.0)))` subtracted so the ribbon itself reads as moving; draw on and erase off `head = smoothstep(uHead, uHead - 0.03, u)`, `tail = smoothstep(uTail, uTail + 0.03, u)`; alpha `edge * head * tail * uAlpha`; then fog by distance.

Intro swoosh curves and spans (landscape; portrait scales x by 0.6 around the gate):

| ribbon | color | width | span | control points |
|--------|-------|-------|------|----------------|
| S1 | lime | 2.2 | 0.00 to 0.17 | (-34, 7, -36) (-14, 6, -14) (2, 4, 4) (16, 5, 22) |
| S2 | cyan | 1.4 | 0.02 to 0.19 | (-28, 0.5, -44) (-10, -0.5, -12) (4, -1.5, 6) (18, -3, 24) |
| S3 | orange | 2.8 | 0.05 to 0.21 | (24, 11, -56) (12, 7, -20) (6, 4.5, 2) (-2, 2, 22) |
| S4 | magenta | 1.0 | 0.07 to 0.23 | (28, 3, -34) (14, 2.5, -10) (6, 1, 6) (-6, -2, 24) |
| S5 | white, alpha 0.5 | 0.35 | 0.10 to 0.23 | (-22, 4, -26) (-6, 3.5, -6) (6, 3, 8) (14, 2, 22) |

Within a span, local `l = (progress - s0) / (s1 - s0)` clamped. `uHead = easeOutCubic(min(1, l / 0.45))`, `uTail = max(0, (l - 0.55) / 0.45)` linear. Before the span `uHead` holds its progress-0 value (S1 starts at 0.30, S2 at 0.10, others at 0) so the first frame is not empty. Meshes never move; the visible window travels along the curve from far to near, which is exactly what a masked tween looked like. Idle sway: the four control points of each intro swoosh get a time-based offset of `0.3 * sin(uTime * 0.9 + i)` on y, and the geometry is rebuilt only for the intro swooshes, only while `progress < 0.24`, and only every third frame (300 points, trivial). The gallery ribbon does not sway.

Gallery ribbon, width 3.0, magenta, control points (landscape):

```
A (-48, 10, -72)   B (-32, 8, -44)   C (-17, 5, -20)   D (-8, 3.0, -5)
G (-2.6, 2.4, 1.0) gate
H (-0.5, 0.4, 5.5) I (2.5, -3.5, 10) J (7, -10, 18)
```

Length about 110 units; the gate sits near curve parameter `tG ≈ 0.786` (compute it with `getUtoTmapping` at mount, never hardcode). `uHead` runs 0 to 1 over progress 0.06 to 0.20 (ease out cubic), `uTail` stays 0 until 0.90 and runs to 1 by 1.0. `uFlow` equals the continuous index `k` times the frame spacing in u.

### Frames on the ribbon

One `InstancedMesh`, `PlaneGeometry(3.2, 2.4)`, 21 instances, an instanced float attribute `aTile`. Material samples `ribbon.webp` with `uv * tileSize + tileOffset(aTile)`, tile `(i % 7, floor(i / 7))`, plus the hairline border. sRGB texture, mipmaps on, anisotropy 4.

Continuous index `k = (progress - 0.22) / 0.034`, unclamped. Frame spacing 4.5 units, in curve parameter `sp = 4.5 / length`. Per frame, in `useFrame`, for i in 0..20:

```
t = tG - (i - k) * sp          // i == round(k) sits at the gate
if t < 0.02 or t > 0.98: scale 0, continue
pos = curve.getPointAt(t)  (use the precomputed spaced points and frames, lerp between samples)
w = 1 - smoothstep(0, 1, abs(t - tG) / sp)
pos += normal * (0.35 + 0.5 * w)
quat = slerp(frenetQuat(t), faceCameraQuat, w)
scale = 1 + 0.55 * w
```

Write the 21 matrices, `instanceMatrix.needsUpdate = true`. Current index `cur = clamp(round(k), 0, 20)`; when it changes, the easel and caption update.

### Easel

Panel `PlaneGeometry(5.33, 4.0)` with its own `ShaderMaterial`. Uniforms: `uTexA`, `uTexB`, `uRectsA[4]`, `uRectsB[4]` (vec4 x, y, w, h in atlas uv), `uPhaseA`, `uPhaseB` (0..3), `uMix` (0..1), `uDim` (0..1), `uOpacity`. Fragment: for side A, `p = clamp(uPhaseA, 0, 3)`, `i0 = floor(p)`, `i1 = min(i0 + 1, 3)`, `colA = mix(sample(uTexA, uRectsA[i0]), sample(uTexA, uRectsA[i1]), fract(p))`; same for B; `out = mix(colA, colB, uMix) * (1 - 0.25 * uDim)`, alpha `uOpacity`.

Phase for piece i: `phase = clamp((k - (i - 0.5)) * 3, 0, 3)`. The phase uniform is smoothed toward the target with a 90 ms half-life, time based, so a fast flick reads as drawing rather than flicker. It never lags more than about 200 ms. When `cur` changes, B takes the new piece, `uMix` tweens 0 to 1 over 150 ms, then A and B swap.

Atlas loading: `fetch` plus `createImageBitmap` (premultiply none, colorSpaceConversion none) into a `THREE.Texture` with `colorSpace = SRGBColorSpace`, mipmaps on. An LRU of 5 decoded atlases (3 on low). On `cur` change: fetch `cur` first, then `cur + 1`, `cur + 2`, `cur - 1`. Until a piece's atlas is in, the easel uses `ribbon.webp` with all four rects set to that piece's tile: a soft version that sharpens when the atlas lands. That is the loading state, and it looks like a 2004 progressive JPEG on purpose. A failed fetch keeps the soft version and does not retry.

Dispose everything on unmount: geometries, all textures, `ImageBitmap.close()`.

### Click to play

Only the panel mesh takes r3f pointer events; `onPointerOver` sets `cursor: pointer` on the body, `onPointerOut` clears it.

Fine pointer and `quality: "high"`: click mounts `<Html transform distanceFactor={4} position={E} rotation={[0, yaw, 0]} zIndexRange={[20, 10]} style={{ width: 533, height: 400, pointerEvents: 'auto' }}>` (drei's transform mode maps one unit to 400 / distanceFactor CSS px, so 4 gives 100 px per unit; verify once against the WebGL panel with a debug outline and commit the constant). Inside it: if `window.RufflePlayer` is absent, inject `<script src="/ruffle/ruffle.js">` once; then `const player = window.RufflePlayer.newest().createPlayer()`, size 533 by 400, append, `player.load({ url: '/flash/art/<name>.swf', autoplay: 'on', unmuteOverlay: 'hidden', splashScreen: false, letterbox: 'off', contextMenu: 'off' })`. Use the player API, not `react-ruffle`, which injects a remote script from unpkg and gives no load events. Ruffle draws into its own canvas inside the CSS3D layer, above the WebGL canvas, so the mouse reaches the piece directly and the pieces stay interactive, which is the point of a live player.

States, all designed:

- Within 100 ms of the click: `uDim` tweens to 1, caption tail reads `loading player`.
- On the player's `loadeddata` event: panel `uOpacity` 1 to 0 and Html opacity 0 to 1 over 200 ms, caption tail `playing`. If the piece itself waits for a click (they are click to play), the person clicks it again, same as on the piece page.
- On the player's `error` event or 10 s without `loadeddata`: unmount the Html, `uDim` back to 0, caption reads `the player did not load` followed by a link `open the page` to `/play/art/<name>`. This is the one moment the caption accepts pointer events.
- Offline: the script fetch fails within seconds and lands in the same failed state.
- The player unmounts when `cur` changes in either direction, when `active` goes false, or on Escape. The easel is already showing the next piece by then, so nothing is lost.

Coarse pointer or `quality: "low"`: click or tap on the panel navigates to `/play/art/<name>` with `next/router`. Phones never load the emulator inside the world.

Keyboard: the canvas is `aria-hidden`; the overlay link reaches every piece through `/play/art`.

### What runs where

Per frame in `useFrame` (returns immediately when `active` is false): read `progress`, set six ribbon `uHead`/`uTail`/`uFlow` uniforms, `uTime` on all materials, 21 instance matrices, easel phase smoothing, camera dolly and parallax (`pointer` drives yaw ±1.5 degrees and pitch ±1 degree, lerped at 0.08 per frame), intro sway rebuild while `progress < 0.24`. Under 0.3 ms of JS.

Precomputed at mount: six curves, spaced points and Frenet frames, six ribbon geometries, the speed line instance matrices, `tG`, the 21 tile rects.

### Portrait layout

When the canvas aspect is under 1: camera (0, 2.6, 19) looking at (0, 2.4, 0), no dolly; easel panel scaled 0.62 at (0, 4.0, 0), yaw 0; gate at (0, 0.6, 1.0), frame growth 1.3 instead of 1.55. Every curve is stored as offsets from the gate, and the gallery ribbon offsets get x scaled by 0.6, so the ribbon still passes through the gate and dives out the bottom. The overlay keeps the top 30 percent, the easel sits under it, the frame at the gate under that, caption at the bottom. Recompute on resize, debounced 200 ms.

## 7. Quality low vs high

| item | high | low |
|------|------|-----|
| DPR | stage default (1.5 cap) | 1 |
| intro swooshes | 5 | 3 (lime, cyan, magenta) |
| speed lines | 24 | 0 |
| gallery ribbon segments | 600 | 300 |
| intro sway rebuild | every third frame | off |
| easel atlases | `easel/` 1066x800, LRU 5 | `easel-low/` 532x400, LRU 3 |
| shine sweep | on | on (cheapest alive thing here) |
| pointer parallax | on | off |
| easel click | inline Ruffle | navigate to the piece page |
| post-processing | none | none |

## 8. The Poster

The still is the scene at about progress 0.3, the money shot: three swooshes crossing a black stage, the magenta ribbon carrying four small frames toward the gate, and the easel on the right showing `isometrics` at 6 s. Inline SVG rendered by the `Poster` component, viewBox 0 0 1600 900, background `#06070f`:

- Three `<path>` swooshes (lime, cyan, orange) with `linearGradient` fills from the 55 percent shade to full color across the width, each with a second thin white path at 40 percent opacity as the gloss stripe. About 3 KB.
- The magenta ribbon path with four `<image>` frames on it (`thumbs-sm/tree.webp`, `orbit.webp`, `expand.webp`, `weave.webp`, 320x240, each about 6 KB), tilted 6 to 10 degrees along the curve with a 1 px white stroke.
- The easel: three lines and a ledge in `#26262b`, panel border `#1a1a1f`, `<image href="/static/play/art/thumbs/isometrics.webp" width="533" height="400">` at 2.4 times scale, about 14 KB.
- `preserveAspectRatio="xMidYMid slice"` so it fills the stage at any viewport. For portrait, a second `<svg>` with the easel stacked over the ribbon; a CSS `aspect-ratio` media query shows one and hides the other.

Total about 43 KB with the five images, under the 60 KB line. Alt text: "Made in Flash. Lime, cyan and orange swooshes cross a black stage. A magenta ribbon carries small frames of Flash pieces named tree, orbit, expand and weave toward an easel showing isometrics, one of 21 generative pieces written in ActionScript." The same title, line and cta render as HTML around it, so the page tells the whole story with JavaScript off.

The Poster is built first, from the capture output, and is shippable alone.

## 9. Budget sheet

| measure | high | low |
|---------|------|-----|
| assets over the wire, full scroll | ribbon 120 KB + 21 easel atlases ~840 KB + JS 24 KB ≈ 985 KB | 120 + ~250 + 24 ≈ 395 KB |
| assets by 20 percent scroll | ribbon + 3 atlases ≈ 260 KB | ≈ 180 KB |
| Ruffle after a click | ~4 MB brotli (12.7 MB raw wasm), opt in | never |
| triangles | ≈ 4,400 | ≈ 2,500 |
| draw calls | 11 (6 ribbons, speed lines, frames, panel, border, stand) | 8 |
| GPU memory | ribbon atlas ≈ 8.6 MB with mips + 5 easel atlases ≈ 23 MB ≈ 32 MB | ≈ 14 MB |
| frame time, M1 Air DPR 1.5 | GPU ≈ 2.5 ms at the 0.05 to 0.15 overdraw peak, JS < 0.3 ms | |
| frame time, iPhone 12 DPR 1 | | GPU ≈ 4 ms |
| render targets | 0 | 0 |

The fill cost is five large transparent quads overlapping during the flight. If the M1 misses 60 fps there, drop S5 and halve the speed lines before touching anything else.

## 10. What was removed

- A fake Flash preloader ("loading 100%") at progress 0. Period correct, but the contract forbids progress bars because they read as real loading, and the joke fails on anyone under 30.
- Bloom and any post-processing. Flash had none. The gloss is in the fill.
- A floor with reflections (the flipped-copy trick Flash sites used). The exit path dives below the gate, which a mirror plane would contradict, and a black void reads as a Flash stage anyway. Saved two draw calls and a source of visual confusion.
- A ring or carousel of cards. The list is a filmstrip on one swoosh; the same object the intro is made of.
- An arcade cabinet model (the working title suggested one). These are paintings, not games. An easel is the honest prop.
- Live Ruffle on the easel by default. 12.7 MB of WASM cannot live in a 1.5 MB world. It loads only after a click, and only on desktop.
- Recreating the pieces procedurally in GLSL so they "generate" for real. A fake would not be Lacy's work; the captured frames are.
- A cameo for `xspf_jukebox.swf` or the 25 interactive SWFs in `public/flash/interactive/`. One story per world; the paper above already links `/play/flash` for the player.
- A sound toggle. Nothing here has sound worth the button.
- Piece names as 3D text. No fonts in scene; the HTML caption does the job.
- A standalone "click the painting" hint. Folded into the caption tail so there is one caption, not two.
- Smoothing on `progress`. Scroll is a scrub; only the easel phase is smoothed, and only to stop flicker.
- Pointer-following swooshes. Pointer does parallax and nothing else.
- Idle sway on the gallery ribbon. The frames ride it and the caption keys off it; a moving ribbon under a still frame felt like a bug.

## 11. Open questions for Lacy

1. There are 21 SWFs in `public/flash/art/`, not 22. Is one missing from the folder, or was 22 a miscount? The world and the caption count from `pieces.json`, so either answer works without a code change.
2. `rtext.swf` (543 bytes) and `tree.swf` (693 bytes) are far smaller than the others. Do they render standalone, or did they load something external? The capture script will show blank frames if so, and they would be left off the ribbon while staying on `/play/art`.
3. The ribbon order follows your listing (isometrics first, weave last). Fine to keep, or is there a piece you want first on the easel?

## 12. Build estimate and order

About 22 hours for a strong engineer. Each step leaves a world that ships.

| step | hours | leaves you with |
|------|-------|-----------------|
| 1. Capture script, all outputs, `pieces.json`, contact sheet | 3 | the facts: which pieces render, real file sizes |
| 2. Poster | 1.5 | a world that ships with no WebGL at all |
| 3. Ribbon geometry and shader, six ribbons on progress, easel with a single still | 4 | swooshes fly by and land on a painting |
| 4. Frames on the ribbon, gate logic, caption | 3 | the list, scrubbing |
| 5. Easel generating shader, atlas LRU, loading fallback | 3 | the pieces paint themselves |
| 6. Portrait layout, quality low, disposal, active gating | 2.5 | phones and the frame budget |
| 7. Click to play: inline Ruffle, its four states, Escape, unmount rules | 3 | the one exception, done properly |
| 8. QA on an M1 Air and an iPhone 12, recordings | 2 | evidence |

If step 7 is not solid by the time the rest is, ship without it: the easel click navigates to the piece page on every device, which is complete on its own, and inline Ruffle lands in a second PR.

Evidence for the PR: a 20 second recording of a full scroll on the M1 Air at DPR 1.5, a recording on a phone, the capture contact sheet, and the frame-time readout from the r3f `Perf` overlay at progress 0.1 and 0.5.

DRI: the engineer on the build issue Lacy files for this world. Until it is filed, Lacy owns the three questions above.
