# jungle: Off the Clock

World id `jungle`. Link `/about`. The last world before the paper comes
back. Follows the contract in `README.md`; the twelve sections below are
in the order it asks for.

## 1. The person and the moment

A stranger who has just scrolled through five worlds of Lacy's work
steps out of the banana leaves from his portrait into a clearing at
golden hour, where a 3D printer on a flat rock is printing one of the
small parts he makes for the house, and it finishes as they arrive.

## 2. The one link and the overlay copy

| field | value |
|-------|-------|
| id | `jungle` |
| title | Off the clock |
| line | When the laptop closes I print the small parts the house is missing, one layer at a time. |
| href | `/about` |
| cta | More about me |
| background | `#14301c` |
| lengthVh | 300 |
| budget | `{ assetsKb: 40, triangles: 40000 }` |

Copy is final. Title in Instrument Serif at `#f6efe3`. Line in the
system sans at `#d9d3c4`. Link at `#f0a35e` with a 1px underline in the
same color; on hover the underline goes to `#f6efe3`. The overlay sits
bottom left, 24px inset, max width 34ch, and stays put for the whole
world. Nothing in the scene is clickable.

The one interactive moment is free: the print is a function of
`progress`, so scrolling back up un-prints the part layer by layer.
Nobody has to be told. Beyond that, pointer parallax only.

## 3. The beat sheet

Coordinates are meters, y up. The clearing is centered on the origin.
The printer sits on a flat rock slab whose top is at y 0.45. The part
stands on the bed at (0, 0.49, 0). The sun is low, behind the printer
and to the left, direction `normalize(-0.55, 0.22, -0.80)`, so the leaves
behind the printer are lit from behind and glow.

The camera is a `CatmullRomCurve3` through six points, sampled at
`progress` directly (no extra easing; the scroll is the easing). A second
curve carries the look-at target. FOV 35, near 0.05, far 80.

| progress | camera | look at |
|----------|--------|---------|
| 0.0 | (0.60, 1.50, 6.50) | (0, 0.70, 0) |
| 0.2 | (0.40, 1.30, 4.00) | (0, 0.70, 0) |
| 0.4 | (-1.60, 1.05, 2.10) | (0, 0.55, 0) |
| 0.6 | (-0.26, 0.62, 0.20) | (0, 0.52, 0) |
| 0.8 | (1.20, 0.60, 2.40) | (0, 0.50, 0) |
| 1.0 | (1.60, 0.35, 3.60) | (0, 0.45, 0.20) |

Print height: `printT = clamp((progress - 0.12) / 0.63, 0, 1)`. The part
is empty at 0.12 and finished at 0.75. Height is quantized to 0.2 mm
layers (318 layers over 63.5 mm) so it ticks instead of sliding.

- **0.0** The portrait's background. The camera is inside the entrance
  cluster: six big leaves fill roughly 60 percent of the frame, edges
  soft with backlight, the sun a warm disc between them. Through the gap
  the clearing is visible but small. Overlay title and line are already
  on. The leaves nearest the lens move a few degrees with the pointer.
- **0.0 to 0.2** The camera pushes forward between the leaves. Two of
  them cross the frame left to right as it passes. The clearing opens.
  By 0.15 the printer is clearly a printer and the first orange layers
  are on the bed, which puts the checkable object (the real adapter
  from `/play/3d`) on screen before 20 percent.
- **0.2** Full view of the clearing from 4 m out: the printer on its
  rock, seven banana plants in a ring, dust in the sun shafts, the
  snowboard leaning against a stem at back left. Print at 13 percent.
- **0.2 to 0.4** A slow swing to the left and down toward printer
  height. The print head is visibly tracing circles. Print reaches 44
  percent.
- **0.4** Three quarter view from 2.7 m. The head's hot layer is the
  brightest thing in the frame. Leaves behind the printer glow.
- **0.4 to 0.6** The camera comes in close, ending 0.33 m from the part
  at bed height plus a little. This is a macro shot: the part fills about
  a third of the frame height, layer lines readable, nozzle drawing the
  current ring. Print reaches 76 percent.
- **0.6** Closest beat. The bed, the part, the nozzle, the filament
  running up to the spool, out of focus leaves as the whole background.
- **0.6 to 0.8** The camera pulls back and right. At 0.75 the last layer
  lands, the hot band fades over the next 0.05 of progress, and the
  head parks at the back left corner of the bed.
- **0.8** The finished part in orange on the bed, printer at rest, seen
  from 2.7 m at eye level. The snowboard and the ring of plants are back
  in frame.
- **0.8 to 1.0** The camera drops to knee height and drifts right and
  back, coming to rest on the ground looking across the clearing.
- **1.0** Still. Low camera, the part small and complete in the middle
  distance, leaves at the edges of the frame swaying on time only. The
  pin releases and the paper returns with the creed line directly under
  this frame. The world does nothing to the creed line; the handoff is
  the resting camera, on the ground, and then the words.

## 4. The look

Golden hour under a banana canopy. References a builder can search:
"backlit banana leaf golden hour" on any photo site for the light, the Monument Valley style of
flat readable shapes, "Alto's Odyssey" for the low poly ground and one
warm key light, and Lacy's own portrait at
`public/images/lacy-morrow.jpg` for the exact greens.

### Palette

| use | hex |
|-----|-----|
| cut color and fog base | `#14301c` |
| ground in shade | `#0f2416` |
| ground lit | `#1e3a22` |
| leaf dark (shadow side) | `#1f5a2e` |
| leaf mid | `#2f7d3c` |
| leaf lit (backlight) | `#8fd36a` |
| leaf vein | `#17431f` |
| banana stem | `#7f9a52` |
| sky zenith | `#24502f` |
| sky horizon | `#d8975a` |
| sun disc | `#ffd9a0` |
| key light | `#ffb45c` |
| accent (the corgi shirt orange) | `#d9772f` |
| accent light (hot layer, link) | `#f0a35e` |
| printer frame | `#1c1c1e` |
| printer rails and bed plate | `#a8a8ad` |
| snowboard | `#23262e` |
| rock | `#2b3a2c` |
| overlay title | `#f6efe3` |
| overlay line | `#d9d3c4` |

Orange appears on four things only: the spool, the filament, the part,
and the link. Nothing else is warm except the sky and the light.

### Light

- One `DirectionalLight`, color `#ffb45c`, intensity 2.4, direction as
  above, no shadow map.
- One `HemisphereLight`, sky `#b6d89a`, ground `#10261a`, intensity 0.6.
- No point lights. The hot layer on the print is emissive, not a light.
- No shadow maps at all. Grounding comes from a baked contact shadow (a
  radial gradient plane under the printer and under each rock, drawn to
  a 64x64 canvas once) and from the leaf shader darkening toward the
  stem.

### Materials

- Leaves: one custom `ShaderMaterial`, alpha test, `DoubleSide`, fog
  chunks included. Lighting is a hand rolled wrap diffuse plus a
  backlight term (see section 6). No PBR.
- Ground, rocks, stems, printer, snowboard: `MeshStandardMaterial`,
  roughness 0.9, metalness 0, flat colors, `flatShading` on the rocks.
- Printer rails and bed: roughness 0.45, metalness 0.6, so the key light
  puts one highlight on them.
- Part: `MeshStandardMaterial` `#d9772f`, roughness 0.55, patched with
  `onBeforeCompile` for the layer cut and the hot band.
- Sky: a `ShaderMaterial` on an inverted sphere, unlit, no fog.

### Fog

`FogExp2`, color `#17351f`, density 0.14 on high, 0.17 on low (three's
exp2 fog is `1 - exp(-(density * depth)^2)`, so 0.14 is half fog at 6 m,
13 percent at 2.7 m and nothing at 0.33 m). The
sky dome is excluded from fog. At 6 m the far plants are half dissolved
into the fog color; at 0.3 m nothing is.

### Post

None. Zero render targets. A vignette would be nice and is not worth
the render target; the dark leaves at the frame edges do that job.

## 5. Assets

| asset | source | size |
|-------|--------|------|
| Paper towel adapter, the part being printed | existing `public/static/3d/paper-towel-adapter/paper-towel-adapter.glb`, 236 triangles, one mesh, bounds 43 x 43 x 63.5 mm, z up in mm. Rotate x by -90 degrees and scale 0.001 at load. Real part, published on Cults3D and on `/play/3d`. | 21 KB |
| Rocks | existing `public/models/morrow-field/rocks.glb`, 64 triangles, self made. Material overridden to `#2b3a2c` flat shaded. | 2 KB |
| Leaf mask | procedural. One SVG string in the world module: a 256 x 1024 viewBox, an elongated leaf outline with a pointed tip and seven wedge tears cut in from the edges along vein angles, filled white; a 6px `#808080` midrib down the center. Rasterized once to a 256 x 1024 canvas, uploaded as `RGFormat` (R alpha, G vein), `LinearMipmapLinearFilter`, anisotropy 4. Same path drives the Poster. | 2 KB of source, 0 KB over the wire |
| Contact shadow | procedural 64 x 64 canvas, radial gradient black to transparent. | 0 KB |
| Everything else: leaves, stems, ground, sky, printer, snowboard, dust | procedural, see section 6 | 0 KB |
| Poster | inline SVG in `Poster.tsx`, see section 8 | 6 KB |

Total over the wire: about 29 KB of assets plus the world's own JS
chunk (estimated 18 KB gzipped). Nothing from the photos folders is
loaded; the photos are for the builder to look at, not to ship.

Nothing is needed from Lacy to build this. Section 11 lists the two
facts that would make it more his.

## 6. Technique

Plain `three` and `@react-three/fiber` 8, no drei. Every mesh below is
built once in `useMemo` and disposed in the effect cleanup.

### Layout

Seven banana plants at (x, z): (-3.4, -2.6), (2.9, -3.1), (-4.6, 0.8),
(4.2, 1.2), (-2.8, 3.6), (3.1, 3.9), (0.4, -4.8). Each plant is a
pseudostem plus seven leaves fanned from its top: yaw `i * 360/7 +
jitter(±14°)`, pitch from 22° to 68°, length 1.6 to 2.6 m, width 0.32 of
length. Stem height 1.6 to 2.4 m, radius 0.09 to 0.14. Plant seeds are
fixed constants so the layout is identical on every load.

Six hero leaves are hand placed in the entrance cluster between z 5.0
and 6.4, x from -1.6 to 1.6, angled so the camera at 0.0 sees their
undersides and passes between them by 0.18. They live in their own
`InstancedMesh` with denser geometry and a parent group that carries the
pointer parallax.

Eight rock instances around the clearing, scale 0.4 to 0.9, plus one
instance scaled (2.2, 0.35, 2.2) as the slab under the printer.

### Leaves

Geometry: a `PlaneGeometry(1, 1, 6, 24)` for ring leaves (288
triangles), `PlaneGeometry(1, 1, 12, 48)` for hero leaves (1152
triangles). uv.x runs across the width, uv.y from stem to tip. All shape
happens in the vertex shader from these uvs.

Per instance attributes: `iPos` vec3, `iRot` vec4 quaternion, `iScale`
vec2 (length, width), `iPhase` float, `iTint` float (0 to 1, mixes leaf
mid toward leaf dark).

Vertex shader, in leaf local space before the instance transform:

```glsl
float x = (uv.x - 0.5) * iScale.y;        // across
float y = uv.y * iScale.x;                // along, stem at 0
float fold = abs(uv.x - 0.5) * 0.36 * (1.0 - uv.y * 0.3); // V section
float droop = uv.y * uv.y * 0.42;         // tip curls down
float sway = sin(uTime * 0.7 + iPhase) * 0.05 * uv.y
           + sin(uTime * 0.23 + iPhase * 2.0) * 0.03 * uv.y * uv.y;
vec3 p = vec3(x, y, -fold - droop * iScale.x);
p = rotateAboutX(p, sway);               // hinge at the stem
```

Normals are recomputed in the shader from the analytic fold and droop
(two small partial derivatives), not read from the geometry.

Fragment shader:

```glsl
vec2 m = texture2D(uMask, vUv).rg;
if (m.r < 0.5) discard;
float wrap  = dot(N, uSunDir) * 0.5 + 0.5;          // wrap diffuse
float back  = pow(max(dot(-N, uSunDir), 0.0), 1.5);  // light through the leaf
float ao    = mix(0.55, 1.0, smoothstep(0.0, 0.35, vUv.y)); // dark near stem
vec3 base   = mix(uLeafMid, uLeafDark, vTint);
vec3 col    = mix(uLeafDark, base, wrap) * ao;
col = mix(col, uLeafLit, back * 0.75);
col = mix(col, uVein, m.g * 0.6);
// fog chunk here
```

Alpha test instead of blending means no sorting and correct depth. Both
sides render because the camera sees undersides in the entrance.

### Ground and sky

Ground: `PlaneGeometry(30, 30, 64, 64)` rotated flat, vertex y from a
two octave value noise computed on the CPU at build (amplitude 0.12),
flattened to zero inside radius 1.6 of the origin so the clearing is
level. Vertex colors from `#0f2416` to `#1e3a22` by height.

Sky: `SphereGeometry(60, 24, 12)`, `BackSide`, `depthWrite false`,
`fog false`. Fragment: `t = dir.y * 0.5 + 0.5`, color mixes horizon to
zenith with `pow(t, 0.6)`, plus `pow(max(dot(dir, uSunDir), 0), 400.0)`
for the disc and `pow(..., 8.0) * 0.35` for the halo.

### The printer

A bed slinger built from boxes and cylinders, 0.44 m wide, 0.47 m tall,
placed on the slab so its feet are at y 0.45. Parts, each a merged
`BufferGeometry` so the whole printer is four draw calls:

- Frame: two uprights and one top bar, 20 mm square, `#1c1c1e`, plus the
  base rails. One geometry.
- Bed: a 220 x 220 x 4 mm plate `#a8a8ad` on a 12 mm carriage.
- Gantry and head: the x rail, the carriage block, the hot end (a 12 mm
  cylinder narrowing to a 2 mm nozzle), and a 60 mm fan shroud in
  `#1c1c1e`. This whole group moves.
- Spool: a `TorusGeometry` (radius 48 mm, tube 18 mm, 8 x 24 segments) in
  `#d9772f` on a short axle above the top bar, plus a `TubeGeometry`
  along a fixed three point curve from the spool down to the top of the
  gantry (24 segments, 6 radial). The final few millimeters from gantry
  to nozzle are a fixed straight tube attached to the head group. The
  spool rotates on time at 0.15 rad/s while `printT` is between 0 and 1.

The printer is about 2,100 triangles.

### The print

The part mesh's `MeshStandardMaterial` is patched in `onBeforeCompile`:

```glsl
// vertex: pass world position
// fragment, before output:
float h = vWorldPos.y - uBedY;
if (h > uPrintHeight) discard;
float band = 1.0 - smoothstep(0.0, 0.0006, uPrintHeight - h);
totalEmissiveRadiance += uHot * band * uHotStrength;
```

`uPrintHeight = floor(printT * 318.0) / 318.0 * 0.0635`. `uHot` is
`#f0a35e`, `uHotStrength` is 1.4 while printing and eases to 0 between
progress 0.75 and 0.80. The material is `DoubleSide`, so above the cut
the viewer sees into the shell, which is what a print in progress looks
like. The part geometry never changes; the cut is a discard.

Head motion: at load, bin the GLB's vertices by height into 318 layers
and record the largest radius per layer (fill empty bins from the bin
below). This 318 float table is the outline of the part per layer, which
is enough because the adapter is round. Each frame in `useFrame`:

```ts
const layer = Math.min(317, Math.floor(printT * 318));
const r = radiusByLayer[layer];
const a = clock.elapsedTime * 3.0;
head.position.set(r * Math.cos(a), bedY + layer * 0.0002 + 0.001, r * Math.sin(a));
```

The bed carriage slides in z by `-r * Math.sin(a)` and the head slides
in x by `r * Math.cos(a)` so it behaves like a bed slinger rather than a
head that floats. When `printT >= 1` the head lerps to the home corner
(-0.10, bedY + 0.02, -0.10) over 0.4 s of frame time.

### Snowboard

An extruded `Shape`: a 1.55 x 0.16 m rounded rectangle with 0.08 m end
radii and a slight sidecut, extruded 0.012 m, about 200 triangles, color
`#23262e`. One 0.02 m stripe in `#d9772f` across the top third. Leaning
against the stem of the plant at (-3.4, -2.6), tilted 14 degrees off
vertical, base on the ground. It has no beat of its own and no motion.

### Dust

`Points`, 150 positions in a 6 x 3 x 6 box centered on (0, 1.5, 0),
`PointsMaterial` size 0.02, `sizeAttenuation`, color `#ffd9a0`, opacity
0.35, `AdditiveBlending`, `depthWrite false`. In `useFrame` each point
rises 0.02 m/s and wobbles in x by `sin(t + i)`, wrapping at the box
top. Only points inside the sun's cone matter visually; the rest fade
into the fog and are cheap.

### What runs in `useFrame`

Only while `active`:

1. Read `progress.get()` and `pointer.get()`. Never subscribe for
   re-render.
2. Sample the camera curve and target curve, set camera position, look
   at target, then add yaw `pointer.x * 1.5°` and pitch `pointer.y *
   1.0°`.
3. Offset the hero leaf group by `(pointer.x * 0.15, pointer.y * 0.08,
   0)`, smoothed with `damp` at lambda 6.
4. Update `uTime` on the leaf material, sky and dust.
5. Compute `printT`, set `uPrintHeight`, `uHotStrength`, move the head,
   carriage and spool.

When `active` is false the loop returns on line one. `frameloop` stays
`"always"` under the stage's control; the world only guards its own
work.

### Precomputed at mount

Leaf mask canvas, contact shadow canvas, ground noise heights, plant and
leaf instance matrices, the head radius table, both camera curves, the
merged printer geometries.

## 7. Quality low vs high

| item | high | low |
|------|------|-----|
| ring leaves per plant | 7 (49 total) | 4 (28 total) |
| hero leaves | 6 at 12 x 48 | 4 at 6 x 24 |
| ground grid | 64 x 64 | 32 x 32 |
| dust | 150 points | none |
| leaf mask | 256 x 1024, anisotropy 4 | 128 x 512, anisotropy 1 |
| fog density | 0.14 | 0.17 |
| DPR | up to 1.5 | 1 |
| sky dome segments | 24 x 12 | 16 x 8 |

Everything else is the same. The printer, the part and the layer cut
never get cut; they are the world.

## 8. The Poster

An inline SVG at 1600 x 1000, `preserveAspectRatio="xMidYMid slice"`,
filling the stage. Drawn as flat shapes in the palette, back to front:

1. Sky: a vertical linear gradient `#24502f` to `#d8975a`, a 90px sun
   disc at (1100, 300) in `#ffd9a0` with a 240px halo at 25 percent.
2. Far plants: two stems and eight leaves in `#1f5a2e` at 55 percent
   opacity, the fog doing its work.
3. Ground: an ellipse `#1e3a22` with a darker `#0f2416` band at the
   bottom.
4. The printer: a portal frame of `#1c1c1e` rectangles on a `#2b3a2c`
   slab, bed as a `#a8a8ad` bar, a `#d9772f` torus for the spool, and
   the part as an orange trapezoid with three horizontal
   `#f0a35e` hairlines at the top to say "mid print".
5. Mid plants: four leaves in `#2f7d3c` and two in `#8fd36a` where the
   sun would come through.
6. Foreground: three hero leaves in `#163d20` entering from the top left,
   left and right edges, each with the same tear pattern.

The leaf shape is one `<path>` in `<defs>` reused with `<use>` and a
transform, the same path string that becomes the runtime mask. Every
Poster leaf is that one path scaled and rotated, which keeps the file
around 6 KB and makes the still and the scene rhyme.

The overlay is the same HTML overlay as the live world, rendered on top
of the SVG by the stage. Alt text on the SVG: "A 3D printer on a flat
rock in a clearing of banana leaves at golden hour, part way through
printing an orange paper towel holder adapter."

The Poster is also the server render, the reduced motion state, the
no WebGL state, the error boundary fallback and the offline state. The
cross fade to the live world happens over 300 ms after the world's first
rendered frame, and the first live frame is composed to match the Poster
(same camera as progress 0, same sun position) so the fade is a change
in texture, not in composition.

## 9. Budget sheet

| item | value |
|------|-------|
| assets over the wire | 29 KB (GLB 21, rocks 2, Poster 6) |
| world JS chunk | about 18 KB gzipped, loaded through `next/dynamic` |
| triangles, high | about 34,000 (ring leaves 14,100; hero 6,900; stems 450; ground 8,200; rocks 580; printer 2,100; part 236; snowboard 200; sky 576; dust 150 points) |
| triangles, low | about 15,000 |
| draw calls | 13 (sky, ground, ring leaves, hero leaves, stems, rocks, contact shadows, printer x4, part, snowboard, dust) |
| render targets | 0 |
| textures | 1 leaf mask (256 x 1024 RG), 1 contact shadow (64 x 64) |
| expected GPU time, M1 Air DPR 1.5 | 3 to 5 ms, dominated by hero leaf overdraw at progress 0 to 0.15 |
| expected GPU time, iPhone 12 DPR 1 low | 5 to 7 ms |
| CPU per frame | under 0.3 ms: two curve samples, one uniform pass, 150 dust points |
| memory | under 12 MB of GPU buffers |

If the entrance cluster costs more than budget on the iPhone, drop
hero leaves to 3 on low before touching anything else.

## 10. What was removed

- **The Moonlander keyboard.** It is a keyboard. The world is about
  being away from one.
- **Piano keys and a drum.** Two more hobbies on the ground turn a
  still life into a hobby list. Hard to make read at low poly. Cut.
- **A drone nod** (a gate, a prop, the Ranger cover). The airfield world
  owns drones; a nod here reads as a leftover.
- **Last.fm scrobble count, Instagram, the Hitchhiker's Guide.** Text
  cannot live in the scene by contract, and none of them are objects
  worth a mesh.
- **A dog.** The corgi shirt survives as the orange, not as a corgi.
  A corgi in a jungle is a joke the scene would have to keep telling.
- **Shadow maps.** A shadow map with alpha tested leaf casters needs a
  custom depth material and costs a full pass. The contact shadow
  planes and the in shader stem darkening do the job.
- **Post processing (bloom on the hot layer, vignette, depth of
  field).** All three were considered for the macro beat. Emissive
  alone reads as hot. The dark leaves edge the frame. Depth of field
  would be the one that earns it and it costs the one render target
  plus a blur pass; revisit only if the macro beat feels flat in a
  recording.
- **A procedural fallback part when the GLB fails.** The contract says
  a failed asset means the Poster. Comply, do not improvise.
- **A sound toggle** (birds, the printer's stepper whine). Autoplay is
  banned, and a toggle is a second action on a screen that has one.
- **Clicking the printer** to restart the print. Scroll already runs
  the print both ways.
- **Wind gusts on the pointer** (leaves parting as the pointer moves).
  Parallax of a few degrees is the whole input model. A gust is a
  second input.
- **Scaling the printer up** so the part reads from farther away. The
  part is 63.5 mm because it is real. The camera comes to it instead.
- **A second creed line inside the world** (Stay grounded, in the
  overlay at the end). The overlay is one title, one line, one link.
  The creed line belongs to the paper, and the low resting camera at
  1.0 already says it.

## 11. Open questions for Lacy

1. **Which printer.** The scene shows a generic bed slinger (Ender 3
   shape). If you own something else (a Prusa, a Bambu box), say which
   and the builder changes the frame; it is four merged boxes.
2. **Part color.** The real adapter in the photo is white PLA. The spec
   prints it in the corgi orange so the thing the camera orbits carries
   the accent. If you would rather it be true to the photo, the part
   goes `#f2ede4` and the accent stays on the spool, filament and link.

Neither blocks the build. Defaults are the Ender shape and orange.

## 12. Build estimate and order

About 28 hours for a strong engineer who has shipped one of the other
worlds. Order, so a half built world still ships:

| step | hours | shippable after |
|------|-------|-----------------|
| 1. Module skeleton: `meta`, `World`, `Poster` stubs, camera curves, sky, ground, fog, overlay wired to the stage | 4 | no, Poster is a stub |
| 2. Leaf mask SVG, leaf shader, instanced ring leaves, hero cluster with parallax, plant layout | 8 | no |
| 3. Printer geometry, GLB part, layer cut shader, head and bed motion, spool, contact shadow | 6 | no |
| 4. Poster SVG, alt text, first frame matched to the Poster | 3 | yes: leaves, clearing, printer, Poster |
| 5. Quality low, dispose on unmount, perf pass on an M1 Air at DPR 1.5 and an iPhone 12 at DPR 1 | 4 | yes, and required before it goes to the registry |
| 6. Snowboard, rocks, dust, final color pass against the portrait | 3 | yes |

Steps 1 through 5 are the world. Step 6 is the still life detail and is
the first thing to drop if the schedule slips.

Evidence to attach before it is marked done: a 15 second recording of
one scroll from 0 to 1 on the M1 Air, a still at progress 0.6 next to
the Poster, and the frame time readout from both devices. DRI is the
engineer who takes the build issue; Lacy signs off on the recording.

## Read this before building: what fleet cost

Added 2026-09-15, after `fleet` was built from a spec written the same
way this one was. Four things in that spec were wrong in ways nobody
could see until it rendered. Three of them apply here too.

**The light values are in the wrong units.** These specs were written
against the old three.js light model. three moved to physical units,
where the numbers here render a black room. `fleet` asked for a
hemisphere at 0.35 and a directional at 0.6 and needed 2.2 and 3.0 to
be visible at all. Treat every intensity in this document as a ratio
between lights, not a value, and tune against a render on the first
day rather than the last.

**One key light lights half a scene.** Two rows of anything facing each
other means one row faces away from the key and is lit only by the
hemisphere ground colour. If that colour is near black, half the scene
is too. `fleet` needed a fill from the opposite side and a ground
colour that was not black.

**Anything small has to survive its widest shot.** `fleet` ends by
counting seventeen status lamps. At the spec's 0.035 m they were a pixel
and a half from the crane camera, and mounted where the spec put them,
the machines hid their own lamps from above. Check the smallest thing
that carries meaning at the furthest the camera ever gets, before
building anything around it.

**The timeline is a clock, not the scrollbar.** If this spec still
talks about the viewer scrubbing anything, that changed: `progress`
runs 0 to 1 over `playSeconds` on a wall clock and scroll only chooses
which world has the screen. Beat sheets survive this unchanged, because
they were already written as functions of progress. Prose about
scrubbing does not.

Also: `lengthVh` here is above the 180 to 220 the contract allows. Every
shipped world uses 200.
