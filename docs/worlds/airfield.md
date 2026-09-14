# airfield: Gates

World id `airfield`. Link `/work/drones`. Ship order: second, after `flash`.

The person scrolls into the camera of a racing quad sitting on a launch
pad at dusk, and their scroll is the throttle. One lap through eight
lit gates on a school field, past the twenty-four quads the Flymore
kids built, and back onto the pad. They never see the drone. They are
the drone.

## 1. The person and the moment

A stranger who just read "24 kids" in the letter and wants, for about
forty seconds, to feel what Lacy feels when he pulls the goggles on.

## 2. The one link and the overlay copy

```ts
export const meta: WorldMeta = {
  id: "airfield",
  title: "Gates",
  line: "In 2017 my brother, my cousin and I taught 24 kids in Charlotte to build their own quads and race them through gates like these.",
  href: "/work/drones",
  cta: "See the flying",
  background: "#5f7290",
  lengthVh: 300,
  budget: { assetsKb: 10, triangles: 12000 },
};
```

The overlay has two layers, both HTML, both `aria-hidden` except the
title, line and link.

The story layer sits bottom-left: title in Instrument Serif at 40 px
(32 px under 640 px wide), the line in the site's system sans at 15 px
with a 34ch max width, the link underlined in the same sans. All three
in cream `#faf3e2`. The bottom-left of every frame is ground or pad, so
cream holds contrast (6.4:1 on the grass, 5.5:1 on the cut color).

The OSD layer is the world's visual language. It uses the same
`font-mono text-xs` the letter uses for its receipt column, so the
vocabulary carries down from the top of the page. 11 px, uppercase,
0.12em tracking, `rgba(250,243,226,0.85)`, a 1 px ink text shadow the
way real OSD glyphs are outlined. Four readouts and a crosshair:

| Position | Reads | Driven by |
|----------|-------|-----------|
| top-left | `16.8V` | pack voltage, sags with speed, drains with the lap |
| top-center | `CLUTZZ` | the craft name field, Lacy's pilot handle, static |
| top-right | `GATE 0/8` | gates passed, increments as the camera crosses each gate plane |
| bottom-right | `00:00.0` | lap timer, runs with progress, freezes at the finish gate |
| center | a 10 px cross, 1 px lines, cream at 70 percent | static |

Nothing in the OSD is clickable. The crosshair is not decoration: a
fixed point in the middle of a moving wide-angle frame is the single
cheapest thing that keeps a person from feeling sick, and it is what
every real OSD has. The link is the only interactive element.

The timer's end value (0:36.4) is a design value that reads like a lap.
It is not a claim about anyone's lap time and the site never says it is.

## 3. The beat sheet

Units are meters, Y up. Forward from the pad is north, which is -Z. The
camera rides a Catmull-Rom spline (`CatmullRomCurve3`, centripetal)
through these control points. Column `y` is the camera height. The
eight gates sit at the marked points with their normal along the
spline tangent, so the camera passes through each gate's exact center.

```
P0   (  0.0, 0.30,  12.0)   launch pad, disarmed
P1   (  0.0, 2.20,   4.0)   climb out
P2   (  0.0, 1.60, -10.0)   G1  north
P3   (  0.0, 1.60, -30.0)   G2  north
P4   ( -3.0, 3.00, -46.0)   turn 1 entry, climbing
P5   (-13.0, 3.40, -56.0)   turn 1 apex
P6   (-24.0, 2.60, -58.0)   G3  west, the high gate
P7   (-37.0, 1.80, -53.0)   turn 1 exit
P8   (-43.0, 1.50, -42.0)   G4  south
P9   (-37.0, 1.50, -26.0)   G5  south, slalom right
P10  (-46.0, 1.50, -10.0)   G6  south, slalom left
P11  (-42.0, 2.60,   6.0)   turn 2 entry
P12  (-30.0, 2.80,  16.0)   turn 2 apex
P13  (-18.0, 1.80,  18.0)   G7  east
P14  ( -6.0, 1.50,  14.0)   G8  east, the finish
P15  (  3.0, 0.80,  11.5)   flare
P16  (  5.0, 0.30,  11.0)   landed, facing east toward the pits
```

About 215 m of flight, eight gates 14 to 20 m apart. That is a real
club-length track.

Progress maps to the lap like this:

- `0.00 to 0.08` on the pad, `u = 0`. Props spool up.
- `0.08 to 0.92` the lap. `u = (p - 0.08) / 0.84`, then arc-length
  parametrized (`curve.getPointAt(u)`). No easing curve on top:
  the person's hand is the easing.
- `0.92 to 1.00` landed, `u = 1`. Props spool down, the camera settles.

Speed is not a function of progress. It is the person's scroll speed.
A slow scroll is a nervous kid's first lap, hovering, nose up. A fast
flick is race pace, nose down, horizon high in the frame. The camera
model below makes that happen without a setting.

Beats:

- **0.00** On the pad. Camera at (0, 0.3, 12) facing north, tilted up
  28 degrees because that is how a race camera is mounted. Frame is
  70 percent sky: peach at the horizon, slate blue overhead, the sun a
  warm disc low to the west. Along the bottom: the edge of the pad,
  then gates 1 and 2 in a line, two small glowing squares 22 and 42 m
  out, the tree line dark behind them, the school's lit window strip
  far left. At the right edge, the pits: two cream pop-up tents and
  twenty-four small quads on their foam pads in a 4 by 6 grid. Two
  stationary two-blade props in the top corners of the frame. OSD:
  `16.8V`, `CLUTZZ`, `GATE 0/8`, `00:00.0`. Title, line, link.
- **0.04** Props spin up. Blades cross-fade into translucent discs.
  Nothing else moves. The person learns the input model without a
  word: scroll, and the machine answers.
- **0.08** Lift. The camera leaves the pad and the horizon climbs the
  frame as the nose drops.
- **0.20** Through gate 1 (`GATE 1/8` pulses once). Gate 2 dead ahead
  at 14 m, camera at 1.6 m, grass streaming below. Timer reads
  about `00:05.2`. The 20 percent rule is met three ways by here:
  the real 24 in the line, the twenty-four quads on the ground, the
  real craft name on the feed.
- **0.40** Mid turn 1, rolled 14 degrees left, climbing toward the
  high gate. The sun is dead ahead at the horizon, which is the best
  frame in the world and where the Poster could have come from. The
  tree line and the school sweep past on the left.
- **0.60** On the slalom between gates 5 and 6, heading south. The sky
  has lost most of its peach. The gates are brighter by contrast. The
  pad and the pits are visible far ahead-left, 40 m out.
- **0.80** Out of turn 2, gate 7 ahead, gate 8 behind it, the tents
  and the twenty-four quads beyond. Blue hour.
- **0.92** Through gate 8. `GATE 8/8`. The timer freezes at `00:36.4`.
  The camera flares and drops.
- **1.00** Landed at (5, 0.3, 11), facing east, tilted back up to 28
  degrees. The frame is the pits, close: twenty-four quads on their
  pads 4 to 14 m away, the tents behind them, gates 7 and 8 glowing at
  the left edge, a dark blue sky. Props wind down to two still blades.
  The voltage rests at `15.9V`. This frame holds while the next world
  cuts in.

Between beats the camera does only what the model says. No cuts, no
camera swaps, no idle drift on the pad.

The camera model, evaluated each frame:

```
s      smoothed progress: s += (p - s) * (1 - exp(-dt / 0.12))
u      clamp((s - 0.08) / 0.84, 0, 1)
v      |ds/dt|, in progress per second
f      speed factor, clamp(v / 0.35, 0, 1), smoothed with tau 0.25 s
       rising and 0.60 s falling (a quad decelerates slower than it
       accelerates, and the fall time is what makes a stopped scroll
       feel like a hover instead of a freeze)
pos    curve.getPointAt(u)
yaw    heading of the tangent at u, from a precomputed table box
       blurred over 8 samples
pitch  +28 - 36 * f degrees      (+28 on the pad, -8 flat out)
roll   clamp(-k(u) * 22 * (0.4 + 0.6 * f), -14, +14) degrees, where
       k(u) is the signed curvature from the same table, blurred over
       12 samples; positive rolls into the turn
```

Exponential smoothing only, no springs. A spring overshoots and an
overshooting FPV camera is a sick person.

FOV targets 100 degrees horizontal. Vertical fov =
`clamp(2 * atan(tan(50 deg) / aspect), 60, 95)`. That gives 68
vertical on a 16:9 laptop and caps at 95 on a portrait phone, where
the horizontal ends up around 57. A rectilinear camera at a real
150 degree FPV field of view stretches the corners into nonsense; 100
is where it still reads as wide. Near 0.05, far 400.

Cut in: the stage paints `#5f7290` (the sky's 35 degree band, which
dominates frame 0). Cut out: frame 1.0 is stationary and dark, so any
next world's cut color reads as a clean cut, not a flash.

## 4. The look

A school field in Charlotte at dusk, flat shaded, the same low-poly
register as Morrow Field but at the other end of the day. Morrow Field
is sand at noon; this is grass at 8 pm in June. The gates need the
dark to glow.

Palette (hex). Values with two entries lerp from progress 0 to 1 as
the sun goes down.

| Token | p = 0 | p = 1 | Use |
|-------|-------|-------|-----|
| sky.horizon | `#f2b98a` | `#b9806e` | sky dome 0 degrees, fog color |
| sky.low | `#d38d78` | `#7a6070` | sky dome 10 degrees |
| sky.mid | `#5f7290` | `#34445e` | sky dome 35 degrees, the cut color |
| sky.zenith | `#223350` | `#101a2c` | sky dome 90 degrees |
| sun | `#ffd9a8` | | the sun disc |
| grass | `#3a4a3c` | `#2b3730` | ground |
| tree | `#1c2c2a` | | crowns, silhouettes |
| trunk | `#2a2320` | | trunks, tent legs, gate legs, poles |
| led | `#ffc98a` | | gate frames, unlit |
| ledSpill | `#ffc98a` at 18 percent | | light discs under gates |
| brick | `#6e4438` | | the school |
| window | `#f3e6c8` | | the school's lit window strip, unlit |
| cream | `#faf3e2` | | tents, prop discs, OSD, overlay text |
| ink | `#35312c` | | prop blades, hubs, pads, contact shadows |
| pad | `#e3a44f` | | the launch pad top (Morrow Field mustard) |
| quads | `#1f6e66` `#cd5f38` `#e3a44f` `#e2937b` `#faf3e2` `#175048` | | the kids' quads, one per instance, cycled |

Kept from Morrow Field's `C`: teal, terracotta, mustard, cream, ink,
blush, pine, as accents on the kids' quads and the pad. Dropped: sand,
sky, road. This world has no roads and no noon.

Light. One `DirectionalLight` from the west-southwest at 8 degrees
elevation, `#ffb27a`, intensity 1.4 at p 0 to 0.5 at p 1. One
`HemisphereLight`, sky `#6f82a8`, ground `#3a4a3c`, intensity 0.7 to
0.45. No shadow maps. Grounding comes from instanced dark discs under
every object that touches the grass (30 percent ink, `depthWrite`
false) and from the LED spill under the gates.

Materials. `MeshLambertMaterial` with `flatShading` for everything the
sun touches. `MeshBasicMaterial` for the things that make their own
light: gate frames, the window strip, the sun disc, the spill discs.
No textures, no normal maps, no environment maps.

Fog. `FogExp2`, color = `sky.horizon` (lerped), density 0.0075. At 40 m
a gate loses 9 percent to fog; at 110 m the tree line loses half and
becomes a silhouette against the horizon band.

Post, high quality only. One pass, one render target at the canvas
size: barrel distortion `k = 0.10` (the lens), a vignette to 35 percent
at the corners, and analog noise at 2.5 percent amplitude, time based.
That is the whole "it is a video feed" treatment. On low quality the
vignette is a CSS radial gradient on the OSD layer and the rest is off.

References a builder can search for: "MultiGP LED race gate night",
"Betaflight OSD layout craft name", "props in view FPV freestyle",
"Alto's Odyssey dusk sky" for the gradient, "Kenney nature kit
silhouette" for the tree register, and Morrow Field's `game.tsx` for
the flat-shaded material recipe.

## 5. Assets

Everything is procedural. Nothing is downloaded. The world is 0 KB of
models and textures over the wire; the Poster SVG is the only asset
file and it is under 10 KB.

Why none of the Morrow Field GLBs: they are Draco compressed, and the
Draco decoder pulled from gstatic is well over 100 KB for models that
total 10 KB. `drone-body.glb` is a fuselage only (one mesh, four
material groups, about 196 triangles, no rotors; the rotors in
`game.tsx` are procedural), and the FPV camera never sees its own
body. `zone-airfield.glb` is a control tower with a helipad, which is
an airport, not a school field. `trees.glb` is 3 KB, and three cones
on cylinders cost 3 KB of nothing.

| Mesh | Recipe | Instances | Tris each |
|------|--------|-----------|-----------|
| ground | `PlaneGeometry(400, 400)`, rotated flat, grass | 1 | 2 |
| sky dome | `SphereGeometry(390, 24, 12)`, `BackSide`, gradient `ShaderMaterial` with the four stops as uniforms | 1 | 576 |
| sun disc | `CircleGeometry(14, 24)` on the dome at azimuth 250 degrees, elevation 5 degrees at p 0 to -2 at p 1 (sinks behind the trees around p 0.65), `fog: false` | 1 | 24 |
| gate frame | four `BoxGeometry` bars merged: inner 1.6 m square, bar 0.08 m, in `led` unlit | 8 | 48 |
| gate legs | `CylinderGeometry(0.04, 0.04, h, 6)` from the two bottom corners to the grass; `h` is the gate's center height minus 0.8 | 16 | 24 |
| gate spill | `CircleGeometry(2.2, 20)` flat at y 0.02, `ledSpill` | 8 | 20 |
| turn flags | pole `CylinderGeometry(0.02, 0.02, 2, 5)` plus a pennant `BufferGeometry` triangle 0.4 by 0.25 in terracotta, three outside each apex: (-10, -62), (-18, -66), (-28, -64), (-40, 12), (-34, 22), (-26, 26) | 6 | 18 |
| tree A | `ConeGeometry(r, h, 8)` on `CylinderGeometry(0.3, 0.4, 1.5, 6)`, r 2.5 to 4, h 7 to 11 | ~50 | 40 |
| tree B | `IcosahedronGeometry(r, 0)` crown on the same trunk, r 3 to 4.5 | ~50 | 44 |
| tree C | two stacked cones on the trunk, h 9 to 13 | ~40 | 56 |
| school | `BoxGeometry(50, 5, 12)` at (-15, 2.5, -84) in brick, plus `BoxGeometry(46, 0.9, 0.1)` window strip on its south face at y 3.0 | 1 + 1 | 12 + 12 |
| soccer goal | three `BoxGeometry` bars, 7.3 by 2.4 m, at (30, 0, -50), cream | 1 | 36 |
| pit tents | four legs `CylinderGeometry(0.03, 0.03, 2.2, 5)` and a `ConeGeometry(2.3, 0.9, 4)` roof, cream, 3 by 3 m footprint, at (13, 0, 21) and (19, 0, 21) | 2 | 76 |
| kids' quads | `BoxGeometry(0.12, 0.04, 0.16)` body, four `BoxGeometry(0.14, 0.012, 0.02)` arms at 45 degrees, single material, `instanceColor` cycles the six quad colors; 0.36 m across | 24 | 60 |
| kids' props | `CircleGeometry(0.065, 8)`, ink, four per quad, at rest | 96 | 8 |
| foam pads | `BoxGeometry(0.5, 0.12, 0.5)`, ink, one per quad, 4 rows at z 6, 9, 12, 15 by 6 columns at x 9 to 19 step 2 | 24 | 12 |
| launch pad | `BoxGeometry(1.2, 0.15, 1.2)` ink with a `BoxGeometry(1.0, 0.02, 1.0)` pad-colored top at (0, 0, 12) | 1 | 24 |
| contact shadows | `CircleGeometry(1, 12)` scaled per object, ink at 30 percent, y 0.015 | 34 | 12 |
| own props (camera child) | hub `CylinderGeometry(0.012, 0.012, 0.01, 6)`, two blades `BoxGeometry(0.11, 0.006, 0.02)`, and a `CircleGeometry(0.115, 16)` disc in cream at 0 to 0.18 opacity; at camera-space (±0.50, 0.30, -0.50), pitched +28 degrees so they lie on the quad's plane, not the camera's | 2 | 46 |
| Poster | `src/components/pages/home/worlds/airfield/poster.svg`, hand-authored, see section 8 | 1 file | under 10 KB |

The tree ring: 140 trees (70 on low) on radius 95 to 130 m around the
field center (-20, -20), seeded (`seed = 2017`, the LCG from
`game.tsx`), with a 40 degree gap centered on the school so the
building reads. Heights vary 7 to 13 m, yaw random.

Data sources: the spline points above, the 24 pad positions, and the
flag positions live in `track.ts` as plain arrays. No JSON fetch.

## 6. Technique

`@react-three/fiber` 8 with core `three` only. No `drei` (not
installed, not needed): `CatmullRomCurve3`, `InstancedMesh` and
`EffectComposer` from `three/examples/jsm/postprocessing` cover it.
The World renders inside whatever `Canvas` the stage provides. If the
stage gives each world its own `Canvas`, nothing here changes.

Precomputed once at mount, in a `useMemo`:

- The curve, `getSpacedPoints(2048)` for arc-length lookup, and per
  sample the tangent heading and the signed curvature (from the cross
  product of consecutive tangents). Both blurred with a box filter (8
  and 12 samples).
- The `u` of each gate (`curve.getUtoTmapping` on the gate's control
  point), for the OSD counter.
- All instance matrices. Nothing instanced ever moves.
- The sky shader with `uHorizon`, `uLow`, `uMid`, `uZenith` uniforms.

`useFrame`, in order:

1. Read `progress.get()`. Update `s`, `u`, `v`, `f` as in section 3.
   Early return if `active` is false (and the loop stops: set
   `frameloop="demand"` while inactive, `invalidate()` on activate).
2. Camera: position, `quaternion` from yaw, pitch, roll (YXZ order).
3. Sky uniforms, fog color, ground color, sun position and the two
   light intensities: `lerp` by `s`. Six uniform writes, no allocation.
4. Own props: `spin += rate * dt`, `rate` 0 below p 0.02, ramping to
   90 rad/s by 0.07, `90 + 60 f` during the lap, back to 0 across
   0.94 to 1.0. Disc opacity `smoothstep(30, 60, rate) * 0.18`.
5. OSD: format voltage `16.8 - 0.9 u - 1.3 f`, timer
   `min(u, uG8) / uG8 * 36.4` (0 until p passes 0.08), gates
   `count(uGate <= u)`. Write each to a DOM ref's `textContent` only
   when the string changes. On a gate count change, toggle a class
   that runs a 300 ms CSS scale pulse. No React state, no re-render.
6. On high, the composer renders; on low, the renderer does.

Scroll to pixels is one `MotionValue` read and one exponential lerp.
Nothing waits on anything. Direct manipulation is instant.

Pointer parallax: none. An FPV camera is bolted to the frame, and a
pointer-driven wobble on top of a scroll-driven wide-angle camera is
the quickest way to make someone queasy. `pointer` is read nowhere.

Disposal: on unmount, traverse and dispose every geometry and material,
dispose the render target, drop the tables.

Motion comfort, in one place so it is not forgotten:

- The person sets the speed. Self-paced motion is the single largest
  factor in whether a wide field of view makes people ill.
- Roll clamped at 14 degrees, pitch between -8 and +28, no yaw
  oscillation, no vibration, no jello.
- Exponential smoothing, 120 ms, no overshoot.
- A fixed crosshair and fixed OSD corners as reference frames.
- Frame 0 and frame 1.0 are stationary. Nobody cuts into or out of
  motion.
- `prefers-reduced-motion` gets the Poster, per the contract.

## 7. Quality: low vs high

| | high | low |
|---|---|---|
| DPR | 1.5 | 1 |
| post pass | barrel, vignette, noise, one target | none; CSS vignette on the OSD layer |
| trees | 140 | 70 |
| sky dome | 24 by 12 | 16 by 8 |
| contact shadows | 34 | 34 |
| kids' quads | 24 | 24 (they are the story) |
| gates, spill, flags, school, tents | all | all |
| own props | all | all |
| antialias | on | on (tile GPUs get it nearly free) |
| fog | on | on |

Nothing that carries meaning is cut on low. Only pixels and trees.

## 8. The Poster

The still is the frame at progress 0.10: the quad has just lifted to
1.9 m over the pad, nose starting to drop, gate 1 filling the lower
middle of the frame 18 m out, gate 2 visible through it, the sun a
warm disc low to the left, the tree line dark, the school's window
strip far left, and the pits at the right edge with the two tents and
the twenty-four quads as a 4 by 6 grid of small crosses. Two prop
discs in the top corners. OSD reads `16.7V`, `CLUTZZ`, `GATE 0/8`,
`00:00.8`. The crosshair in the center. The story layer (title, line,
link) is the same HTML as the live world, positioned over the SVG.

Made as one hand-authored SVG, `viewBox="0 0 1600 1000"`,
`preserveAspectRatio="xMidYMid slice"`: a linear gradient rect for the
sky (the p 0.10 stops), a rect for the grass, a `polygon` tree line
(about 60 points), one rect for the school and one for the windows,
two `rect` outlines for the gates with the spill as ellipses under
them, two tent triangles, the quads as 24 tiny `path` crosses, two
translucent circles for the props, and the OSD as `<text>` in the
page's mono stack. A radial gradient overlay for the vignette. Colors
inline, no fonts embedded, no filters. Target 8 KB, hard limit 10 KB,
gzips to about 3 KB.

`Poster.tsx` imports it inline (so the OSD text uses the page font and
the SVG scales with the stage), and the `<svg>` carries
`role="img"` with alt text:

> The view from a racing drone that has just lifted off a launch pad
> on a school field at dusk. Two lit square gates stand in a line
> ahead. Off to the right, twenty-four small drones sit on foam pads
> beside two canopy tents. The on-screen display reads CLUTZZ, 16.7
> volts, gate 0 of 8.

The Poster is what people with JavaScript off, no WebGL, reduced
motion, save-data, a small phone, or a broken asset see. It is also
frame one for everyone, with the live world cross-fading in over
300 ms behind it after its first rendered frame. Since the live frame
at p 0 differs from the Poster's p 0.10 pose (the Poster is lifted, the
live scene is on the pad), the live scene renders its first frame at
whatever `progress` is at mount. If that is 0, the cross-fade goes from
"just lifted" to "on the pad", 1.6 m of camera height over 300 ms. That
is a settle, not a jump, and it tells the person the thing is alive.

## 9. Budget sheet

| | Value | Contract limit |
|---|---|---|
| assets over the wire | 0 KB models and textures; Poster SVG about 8 KB (3 KB gz) | 1,500 KB |
| world JS chunk | about 14 KB gz (`three` shared with the other worlds) | |
| triangles, high | about 11,800 | 150,000 |
| triangles, low | about 8,600 | |
| draw calls, high | 21 scene plus 1 post | |
| draw calls, low | 21 | |
| render targets | 1 on high, 0 on low | 1 |
| GPU frame time, M1 Air DPR 1.5, high | about 3.5 ms (the post pass is most of it) | 16.6 ms |
| GPU frame time, iPhone 12 DPR 1, low | about 4 ms | 33 ms |
| CPU per frame | under 0.3 ms: one curve lookup, six lerps, four string formats | |
| memory | under 12 MB of GPU buffers | |

Draw call list, high: ground, sky dome, sun, gate frames, gate legs,
gate spill, flag poles, pennants, tree A, tree B, tree C, school,
windows, goal, tents, kids' quads, kids' props, foam pads, launch pad,
contact shadows, own props; then the composer's one pass.

## 10. What was removed

Considered and cut, with the reason, so nobody re-adds them.

- **Third-person chase camera.** Safer and it shows the nice drone
  model. It is also every game's default and nobody would put it on a
  slide. FPV is the thing itself and no one who has not flown has seen
  it.
- **An establishing shot that cuts into FPV at 0.06.** A cut inside a
  scrubbed timeline is a glitch when the person scrolls back across it.
- **Savona Mill.** The first Charlotte drone race and a wonderful
  building. A 100 year old brick interior is the hardest thing to make
  read in flat-shaded low poly, and indoor dusk is mud. The letter's
  receipt is the 24 kids, so the world is their field. The mill is a
  page on `/work/drones`.
- **The Morrow Field GLBs.** See section 5. The decoder outweighs the
  models forty to one, and the camera never sees its own body.
- **RSSI, throttle bar, artificial horizon, home arrow on the OSD.** A
  full Betaflight OSD is fourteen fields. Four carry the story. The
  rest is noise a stranger reads as clutter and a pilot reads as
  someone's screenshot.
- **Gate recolor on pass (the Morrow Field teal).** You never see a
  gate you have passed. The counter is the feedback.
- **Highlighting the next gate.** Real gates do not know which one is
  next, and it turns the course into a tutorial.
- **Gate number plates.** No fonts in scenes, per the contract, and
  the counter says which gate you are on.
- **Camera vibration, prop wash, jello.** Authentic, and the fastest
  route to a sick person on a wide lens. Comfort wins.
- **Pointer parallax.** Same reason. A camera bolted to a frame does
  not wobble when a mouse moves.
- **A heat of other quads racing alongside.** Needs flight paths, AI,
  and it fills the frame with things that are not gates. The lap is
  solo. The other quads are on the ground, where they were between
  heats.
- **Figures for the 24 kids and their parents.** Low-poly people look
  like a stock asset pack. Twenty-four quads on their pads say 24
  better than twenty-four mannequins.
- **The Charlotte Today video as a texture.** No MP4 exists in the
  repo. The video is one click away on `/work/drones/flymore`.
- **A real-time lap timer.** Honest, but scrolling up would run time
  backwards. Progress-based, and labeled a design value.
- **A sound toggle (motor whine).** Analog FPV has no audio; a lot of
  pilots fly with none. It would be the only sound on the page.
- **Shadow maps.** Two thousand pixels of shadow map for a dusk scene
  where the sun is 8 degrees up. Contact discs do the grounding for
  nothing.
- **Bloom.** Unlit LED color against a dark sky glows without a pass.
  The one allowed render target goes to the lens, which is what makes
  it a feed.
- **A 150 degree fisheye.** Rectilinear cameras cannot do it and a
  fisheye shader is a second pass. 100 degrees plus 0.10 barrel reads
  as the lens.
- **The Morrow Field noon palette.** Lovely, and the gates would not
  glow. This world is the same town at the other end of the day.

## 11. Open questions for Lacy

Only where a fact is missing.

1. Craft name on the OSD. The spec uses `CLUTZZ` (from fly.clutzz and
   @Clutzz). Is that what your OSD actually shows, and are you happy
   with it on the home page?
2. Pack voltage. The spec assumes 4S (16.8 V full, resting 15.9 after
   a lap), which was standard in 2017. If you fly 6S now and want the
   feed to look like your feed today, the readouts become 25.2 to
   23.9.
3. Where the camp race was flown. The spec builds a school field
   outdoors at dusk. If the race was indoors (a gym), the dressing
   changes (walls and a ceiling replace the sky and tree line, the
   gates stay, the lap stays). Nothing else in the spec moves.

## 12. Build estimate and order

Twenty hours for a strong engineer who has shipped a scroll-driven
three.js scene before. Build in this order; each step leaves a world
that ships.

| Step | Hours | Leaves you with |
|------|-------|-----------------|
| 1. Scaffold: `index.ts`, `meta`, `track.ts`, the curve and tables, the camera model with smoothing, ground, sky dome, fog, eight instanced gates with legs and spill | 6 | A lap through eight glowing gates at dusk. Shippable. |
| 2. The Poster SVG and `Poster.tsx` with alt text | 2 | The fallback and first paint, so step 1 has a still to fade in from. |
| 3. The OSD layer: four readouts on refs, the crosshair, the pulse, the story layer positioned; own props on the camera with spool up and down | 3 | It is a video feed, and it is his. |
| 4. Dressing: trees, school, goal, tents, launch pad, the 24 quads on pads, flags, contact shadows, sun disc, the dusk lerps | 4 | It is a real place with the 24 kids in it. |
| 5. `active` handling, disposal, quality low, device pass on an M1 Air and an iPhone 12, comfort tuning of the four camera constants | 3 | It meets the contract. |
| 6. The post pass on high | 2 | The lens. First thing to cut if frame time fails. |

DRI: the engineer who picks this file up owns the world end to end,
including the device recording. Lacy owns the three answers in
section 11. Nobody else is in the loop.

Demo test, run on this spec before it was written down:

1. Ten seconds: sky, two gates low in the frame, twenty-four quads at
   the right edge, `CLUTZZ` on the feed, the title. The person scrolls
   and the props spin up.
2. Removed: section 10, nineteen items.
3. One primary action: the link. Nothing else is clickable.
4. Defaults: no settings. Speed is the hand. Quality comes from the
   stage.
5. States: Poster for first paint, no JS, no WebGL, reduced motion,
   save-data, low memory, error, offline; cross-fade for loading; a
   stationary first and last frame for the cuts.
6. Instant: one `MotionValue` read and one lerp per frame.
7. Seams: OSD type is the letter's mono, so the vocabulary carries
   down. The Poster to live cross-fade is a 1.6 m settle, called out
   in section 8.
8. Stage test: the frame at 0.40, into the sun through the high gate
   with his craft name on the feed. Yes.
9. Evidence the builder attaches: a screen recording of the full lap
   on an M1 Air at DPR 1.5 with a frame-time overlay, a screenshot of
   the Poster with JavaScript off, and a screenshot at 0.40.
10. DRI: above.
