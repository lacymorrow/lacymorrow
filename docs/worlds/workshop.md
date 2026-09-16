# workshop: 24 Million

The third world. Lacy as the person who keeps open source running.
Everything in this document was checked against the public GitHub and
npm APIs on 2026-09-14; the exact numbers and the commands to re-check
them are in section 5.

## 1. The person and the moment

A stranger who has just watched two worlds of Flash art and drones
scrolls into the dark and, for a second, thinks a crosshair app is
running on their own screen. Then they back up and see it is one
monitor in a workshop, facing 24,593 lit screens, one for every thousand
people who downloaded it.

## 2. The one link and the overlay copy

| field | value |
|-------|-------|
| id | `workshop` |
| title | `24 Million` (computed at build: `Math.floor(downloads / 1e6) + " Million"`, so it rolls to "25 Million" on its own) |
| line | `Each light out there is a thousand people who downloaded CrossOver, a free crosshair overlay I built for gamers in 2019 and still look after.` |
| href | `/play/crossover` |
| cta | `See CrossOver` |
| background | `#09090b` |
| lengthVh | `300` |
| budget | `{ assetsKb: 12, triangles: 52000 }` |

Why `/play/crossover` and not `/play`: the line is about CrossOver and
the stranger has just been told 24 million people use it. The click has
to deliver the thing itself, the download button and the readme, not a
list page. `/play/crossover` already ends with "View all my projects",
so the wider portfolio is one more click away, and nothing is lost.

Overlay colors on this background: title `#fafafa`, line `#a1a1aa`,
link `#a78bfa` with a 1px underline in the same color. Overlay sits
bottom left. The crosshair at progress 0 sits dead center, so the two
never collide. The title fades in over 0.06 to 0.12 of progress, the
line and link over 0.55 to 0.62, once the field is fully lit and there
is something to say a sentence about.

## 3. The beat sheet

The whole world is one camera move: back up from a monitor, rise over
the bench, and look out at the crowd. No orbit, no cuts.

Scene axes: the monitor screen is centered at the origin and faces -Z.
The maintainer's side of the bench is -Z. The field of screens starts at
z = 2 and runs away to about z = 125 in a fan that opens outward.

| progress | on screen | camera |
|----------|-----------|--------|
| 0.00 | Near black. One crosshair centered in the viewport: four short white arms, a violet dot in the middle, the CrossOver default. Nothing else. On a landscape viewport the monitor overfills the frame so no bezel shows and it reads as "CrossOver is running on my screen". On a portrait phone the monitor sits at 90% of the viewport width with black around it, which reads as a monitor and is fine. | Position `(0, 1.15, -d0)`, looking at the origin. `d0 = clamp(0.5 / (2 * tan(fov/2) * aspect) * 0.9, 0.28, 1.2)` with fov 50. |
| 0.06 to 0.20 | The camera backs up. The bezel edge appears at about 0.06, then the monitor stand, then the bench top under a warm pool of lamplight. Around the monitor's edges the first rows of the field are visible, dim and unlit, and the nearest ones begin to light. The title "24 Million" fades in bottom left. The crosshair is still at frame center. By 0.20 a stranger has seen the real icon and the real number. | Dolly and slight rise to `(0, 1.55, -2.2)`, look at `(0, 1.25, 4)`. |
| 0.20 to 0.40 | The crane. The camera rises above the monitor and the field opens up past it: rows of small screens fanning out and climbing gently like seats. Lights are coming on in a soft wave that runs away from the bench, near rows first. The bench and lamp are small at the bottom of the frame. The cover wall at the left edge of the bench enters at the bottom left. | Rise and back to `(0, 3.0, -5.0)`, look at `(0, 2.0, 20)`. |
| 0.40 to 0.60 | The wave finishes. By 0.55 all 24,593 screens are lit, each with its own crosshair, the far ones just a speck of a bright dot fading into fog. The lamp pool on the bench is the only warm thing in the frame. At 0.55 the line and the link fade in. This is the Poster frame. | To `(0, 4.4, -7.0)`, look at `(0, 2.6, 34)`. |
| 0.60 to 0.80 | Hold with life in it. A slow drift so nothing feels frozen. On `quality: "high"` a tiny fraction of screens blink dark and back, as if someone alt-tabbed. Pointer parallax is at full weight. | Drift to `(0.3, 4.5, -7.4)`, look at `(0, 2.7, 36)`. |
| 0.80 to 1.00 | Same frame, the drift continues. Nothing new appears; this span exists so the sentence and the link have time to be read. | Drift to `(0.5, 4.6, -7.8)`, look at `(0, 2.8, 38)`. Then the hard cut to `fleet`. |

Between keyframes the camera position is Catmull-Rom interpolated and
the parameter is eased per segment with `smoothstep`, so every segment
starts and ends at rest. The look-at point is interpolated the same
way. Pointer parallax adds at most 1.5 degrees of yaw and 1 degree of
pitch, weighted by `smoothstep(0.2, 0.5, progress)` so the crosshair
never slides off center while the monitor is filling the frame.

Screens light in index order, which is near to far. Each screen has a
`litAt` value spread evenly across 0.10 to 0.55 with plus or minus 0.02
of jitter, so the lit edge is a soft band moving outward rather than a
hard line.

## 4. The look

A workshop at night, lit by one lamp, facing an audience of screens.
The natural palette for this world is Lacy's own OSS style guide,
chosen on purpose because this world is about that work.

| use | hex |
|-----|-----|
| background, fog, floor | `#09090b` |
| unlit screen, monitor bezel, lamp shade | `#111113` |
| lit screen face (the display behind the crosshair) | `#1c1c1f` |
| bench top | `#27272a` |
| bench trestles, monitor stand, cover rack | `#19191d` |
| crosshair arms | `#fafafa` at 85% |
| crosshair dot, default | `#a78bfa` (CrossOver ships with a violet dot, `#442ac6`; this is the same idea lifted for contrast on near black) |
| crosshair dot, 1 in 40 screens | one of `#4ade80`, `#d946ef`, `#60a5fa`, people who changed their color |
| lamp light | `#f5e6c8`, the one warm color in the world, deliberately, because a lamp left on says someone works here |
| cover tiles | backgrounds from `#111113` `#19191d` `#27272a`, marks in `#a1a1aa` or `#fafafa`, 1 in 12 with an accent |

Light: one `SpotLight` in the lamp, color `#f5e6c8`, intensity tuned so
the bench top under it reads around `#5a5245`, angle 0.6 rad, penumbra
0.5, no shadows. One `HemisphereLight` at very low intensity
(`#111113` sky, `#09090b` ground) so the unlit sides of the props are
not pure black. The screens are unlit shader quads and ignore both.

Materials: `MeshLambertMaterial` with `flatShading` for the bench, lamp,
monitor body, rack and floor. A custom `ShaderMaterial` for every
screen. No metalness, no roughness maps, no textures on props.

Fog: linear, `#09090b`, near 20, far 140. The last rows are at about
z = 125 and are still faintly there; they do not end at a wall.

Post: none. No bloom, no vignette, no grain. Bloom is the glow the style
guide bans, and the lights read on `#09090b` without it.

References a builder can search for: the screens should look like
"lit windows at night from a hillside" (a crowd of small rectangles,
not a particle cloud); the props should look like the Morrow Field
flat-shaded diorama already in this repo
(`src/components/pages/home/morrow-field/ASSET_DIRECTION.md`); the
crosshair is CrossOver's default reticle
(`~/repo/crossover/src/main/preferences.js`, `reticle: 'dot'`).

## 5. Assets

Everything is procedural or baked JSON. Nothing is downloaded by the
visitor except the world's code chunk and one small JSON file.

### Data (baked at build, never fetched by the browser)

`src/components/pages/home/worlds/workshop/data.json`, committed, about
300 bytes:

```json
{
  "fetchedAt": "2026-09-14",
  "crossoverDownloads": 24593357,
  "crossoverReleases": 91,
  "albumArtFirstPublished": "2014-04-20",
  "albumArtMonths": 149,
  "albumArtLastMonth": 8182
}
```

A prebuild script `scripts/fetch-workshop-data.mjs` (run from the
`prebuild` npm hook, 10 second timeout, never fails the build) writes
this file. Sources, all public and unauthenticated:

```
GET https://api.github.com/repos/lacymorrow/crossover/releases?per_page=100&page=1
GET https://api.github.com/repos/lacymorrow/crossover/releases?per_page=100&page=2
    crossoverDownloads = sum of assets[].download_count over every release
GET https://registry.npmjs.org/album-art
    albumArtFirstPublished = time.created; albumArtMonths = whole months since
GET https://api.npmjs.org/downloads/point/last-month/album-art
    albumArtLastMonth = downloads
```

Guard: if any fetch fails, or `crossoverDownloads` comes back under
1,000,000 or over 200,000,000, keep the committed file untouched. The
scene reads only this file. Checked 2026-09-14: 24,593,357 downloads
across 91 releases, first release v0.1.1 on 2019-10-05, v3.3.4 alone at
12,819,927, 1,245 stars; album-art created 2014-04-20T21:43:58Z, 8,182
downloads for 2026-08-13 to 2026-09-11. The 24,546,457 figure in the
brief was a week older and is consistent.

### The field (procedural)

One `PlaneGeometry(0.5, 0.3)`, 2 triangles, instanced N times where
`N = Math.round(crossoverDownloads / 1000)` (24,593 today). Layout
recipe, computed once at mount, deterministic from a fixed seed:

```
row r = 0, 1, 2 ...          radius R = 2.0 + 0.7 r
arc spread                   -55 deg .. +55 deg around +Z, centered on the origin
count per row                floor(arcLength / 0.85) = floor(1.92 R / 0.85)
height                       y = 1.15 + 0.012 * r^1.35   (a gentle bowl, far rows sit higher)
jitter per screen            x, z += rand(-0.15, 0.15); y += rand(-0.05, 0.05); yaw += rand(-4, 4) deg
facing                       each screen looks at (0, 1.15, 0), then the jitter yaw is added
stop                         when N screens are placed (about 175 rows, last row partial)
```

Instance 0 is the monitor itself: matrix at the origin, facing -Z,
scaled 1.8 on x and y (0.9 by 0.54 world units), `litAt = -1` so it is
always lit. It lives in the same InstancedMesh as the audience, so
there is one crosshair shader and one draw call for all of them.

Per-instance attributes (Float32, set once):

| name | value |
|------|-------|
| `aLitAt` | `0.10 + 0.45 * (i / N) + rand(-0.02, 0.02)`; instance 0 is `-1` |
| `aTint` | `0` for violet; `1..3` for green, magenta, blue on 1 in 40 screens (instance 0 is always `0`) |
| `aSeed` | `rand(0, 1)` for the blink |

### Props (procedural, merged where noted)

| prop | recipe | tris |
|------|--------|------|
| floor | `PlaneGeometry(40, 40)` at y = 0, `#09090b` Lambert (only the lamp pool ever shows on it) | 2 |
| bench top | `BoxGeometry(2.4, 0.06, 0.9)` centered `(0, 0.72, -0.2)`, `#27272a` | 12 |
| trestles | two `BoxGeometry(0.08, 0.66, 0.7)` at x = plus or minus 1.05, `#19191d`, merged with the bench top into one mesh | 24 |
| monitor body | `BoxGeometry(0.98, 0.62, 0.05)` centered `(0, 1.15, 0.03)` so the screen quad (instance 0, at z = 0) sits 5 mm proud of its front face; stand `CylinderGeometry(0.03, 0.03, 0.34, 8)` and base `CylinderGeometry(0.18, 0.2, 0.02, 16)`; all `#111113`, merged | about 200 |
| lamp | base `CylinderGeometry(0.12, 0.14, 0.03, 12)` at `(-0.9, 0.76, -0.45)`; arm `CylinderGeometry(0.012, 0.012, 1.2, 6)` leaning 30 degrees toward the bench center; shade `ConeGeometry(0.16, 0.2, 12, 1, true)` opening downward at the arm's top, about `(-0.55, 1.85, -0.35)`; `#19191d` base and arm, `#111113` shade, merged; the `SpotLight` sits inside the shade, target `(0.1, 0.75, -0.1)` | about 250 |
| cover rack | `BoxGeometry(3.6, 3.9, 0.06)` at `(-2.4, 2.05, 0.6)`, rotated 35 degrees about Y so it faces the crane camera, `#19191d` | 12 |
| cover wall | `PlaneGeometry(0.26, 0.26)` instanced `albumArtMonths` times (149), 12 columns, filling bottom row first, 0.04 gutters, 0.01 proud of the rack; the last row is partly empty on purpose, it is still being filled | 298 |

### Cover atlas (generated at mount, 0 KB over the wire)

A `CanvasTexture` of 12 by 13 cells at 48 px each (576 by 624 px on
high, 24 px cells on low). Cell `i` is drawn from `seed = hash(i)`:
background one of the three surface grays; one mark in `#a1a1aa` or
`#fafafa` chosen from {disc, half disc, vertical bar, small square,
ring, two horizontal stripes}; every 12th cell swaps the mark color for
one of the four accents. No text, no gradients, no real album covers,
nothing copyrighted. The cover instances carry an `aCell` attribute
that picks the atlas cell. Generation is under 2 ms.

### What we do not need

No GLB, no image, no font, no audio. The 200 CC0 Kenney crosshair SVGs
in `~/repo/crossover/src/static/crosshairs/Kenney/` are fair game but
the default reticle is four lines and a dot, cheaper to draw in the
shader than to load.

## 6. Technique

Plain `three` and `@react-three/fiber` v8. No `drei` (it is not
installed and nothing here needs it).

### The screen shader (one material, one draw call, N instances)

Vertex: standard instanced transform, passes `vUv`, `aLitAt`, `aTint`,
`aSeed`, and view depth for fog.

Fragment, in words, then in code:

- The quad is a monitor. The outer 6% of width and 10% of height is
  bezel, `#111113`.
- Unlit, the display is `#111113` too, so a dark screen is a faint dark
  rectangle on the `#09090b` background: present, not lit.
- Lit, the display is `#1c1c1f` and the crosshair is drawn on it in
  world units so it stays square regardless of the quad's aspect: four
  arms of half-thickness 0.012, gap 0.02 from center, length to 0.06,
  and a dot of radius 0.012. Arms are `#fafafa` at 85%; the dot color
  comes from `uPalette[aTint]`.
- `lit = smoothstep(aLitAt - 0.015, aLitAt + 0.015, uProgress)`.
- Antialiasing uses `fwidth` on the distance fields, which also means
  that at 6 px wide in the far rows the arms fall away and the dot
  widens to a one pixel bright speck. That is the "light" in the line.
- High quality only: `blink = step(0.995, hash(aSeed + floor(uTime * 0.5)))`
  darkens the display for that half second. About 0.5% of screens are
  dark at any moment. On low, `uBlink = 0`.
- Fog is mixed last: `mix(color, uFogColor, smoothstep(uFogNear, uFogFar, depth))`.

```glsl
// fragment, abbreviated
vec2 p = vUv - 0.5;
float bezel = max(step(0.44, abs(p.x)), step(0.40, abs(p.y)));
vec2 q = p * vec2(0.5, 0.3);                 // world units on the quad
float aa = fwidth(q.x) * 1.5;
float armH = (1.0 - smoothstep(0.012, 0.012 + aa, abs(q.y)))
           * smoothstep(0.02 - aa, 0.02, abs(q.x))
           * (1.0 - smoothstep(0.06, 0.06 + aa, abs(q.x)));
float armV = (1.0 - smoothstep(0.012, 0.012 + aa, abs(q.x)))
           * smoothstep(0.02 - aa, 0.02, abs(q.y))
           * (1.0 - smoothstep(0.06, 0.06 + aa, abs(q.y)));
float dot  = 1.0 - smoothstep(0.012, 0.012 + aa, length(q));
float lit  = smoothstep(vLitAt - 0.015, vLitAt + 0.015, uProgress) * (1.0 - uBlink * blink(vSeed));
vec3 display = mix(SURFACE, LINE_DIM, lit);
vec3 col = mix(display, ARM_WHITE * 0.85, max(armH, armV) * lit);
col = mix(col, uPalette[int(vTint)], dot * lit);
col = mix(col, SURFACE, bezel);
col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, vDepth));
```

Instance matrices are written once with an `Object3D` dummy and never
touched again. `frustumCulled = false` on the InstancedMesh (its
bounding sphere would be the whole scene anyway). Uniforms updated per
frame: `uProgress`, `uTime`. Nothing else changes per frame.

### useFrame

```
if (!active) return;
uProgress = progress.get();
uTime = clock.elapsedTime (high only);
camera: sample the keyframe spline at progress, add pointer parallax
        weighted by smoothstep(0.2, 0.5, progress), copy into camera,
        lookAt the sampled target
```

No React state changes on scroll. `progress` and `pointer` are read as
MotionValues inside the frame callback, as the contract requires.

### Precomputed at mount

Instance matrices and attributes, the cover atlas, the keyframe spline
(`CatmullRomCurve3` for positions and one for look-at targets), and the
`d0` distance for the current aspect (recomputed on resize). All of it
runs in one synchronous pass under 30 ms on an M1 Air.

### Disposal

On unmount: dispose the plane geometry, the screen material, the merged
prop geometries and their Lambert materials, the cover atlas texture,
and the cover material. Nothing holds a reference after that.

### Screen space and aspect

The monitor is the only thing that has to land at an exact place on
screen (dead center at progress 0). Its screen quad is at the origin,
the camera looks at the origin, so it is centered by construction at
every aspect. Only `d0` depends on aspect, and section 3 gives the
formula.

## 7. Quality low vs high

The one thing that does not change with quality is the count. The
sentence says a thousand people per light, so the number of lights is
the honest number on both tiers. It costs nothing to keep: 49k
triangles in one draw call, and nearly all of those quads are a few
pixels wide.

| | low | high |
|--|-----|------|
| device pixel ratio | 1 (stage) | up to 1.5 (stage) |
| screen count | `N` | `N` |
| shader antialiasing | hard `step` edges, no `fwidth` | `fwidth` smoothstep |
| blink | off | on |
| hemisphere light | off (props lit by the spot only) | on |
| cover atlas | 24 px cells (288 by 312 px) | 48 px cells |
| pointer parallax | off | on |
| fog | on, same values | on |
| post | none | none |

## 8. The Poster

The still is the 0.60 frame: over the shoulder of the bench, the field
of lights running away into the dark. It is an inline SVG, `viewBox
0 0 1600 900`, `preserveAspectRatio="xMidYMid slice"`, under 10 KB,
written by hand and committed at
`src/components/pages/home/worlds/workshop/poster.tsx`.

Recipe:

- Background `#09090b`.
- The field is 72 `<line>` elements, one per row, each with a
  `stroke-dasharray` so a single line draws a whole row of screens.
  Row `k` (0 at the bottom, near the bench, 71 at the horizon):
  `y = 640 - 470 * k / (k + 9)`; half-width `w = min(790, 260 + 16k)`;
  dash `26 * 9 / (k + 9)` on, `12 * 9 / (k + 9)` off, minimum 1.5;
  `stroke-width = max(1, 15 * 9 / (k + 9))`; `stroke = #a1a1aa`;
  `opacity = 0.85 * (1 - k / 90)`; `stroke-dashoffset` from a fixed
  per-row jitter so the rows do not line up into a grid.
- The nearest three rows are drawn as explicit `<rect>` screens
  (`#1c1c1f` fill, `#111113` bezel) with a 2 px `#a78bfa` dot in each
  and 1 px `#fafafa` arms, about 40 rects, so the near field shows what
  the dashes are.
- Bench: `<rect x=600 y=696 width=400 height=10 fill=#27272a>`, two
  trestle rects in `#19191d`. Monitor: `<rect x=740 y=612 width=120
  height=72 fill=#111113>` with an inner `#1c1c1f` display and the
  crosshair in `#fafafa` arms and a `#a78bfa` dot. Lamp: a 3 px line
  for the arm, a small triangle for the shade, and one
  `<ellipse cx=720 cy=702 rx=150 ry=14 fill=#f5e6c8 opacity=0.08>` for
  the pool. Eight percent is the style guide's ceiling for a tint and
  the only place the warm color appears in the still.
- Cover rack: a `#19191d` rect at the left edge with 12 by 13 tiny
  squares in the surface grays, a handful in an accent.

The Poster component renders the SVG only. The stage draws the overlay
(title, line, link from `meta`) over both the Poster and the live
world, so JavaScript off, reduced motion, no WebGL and a thrown error
all show the same still with the same three lines of text. If the
stage turns out not to own the overlay for posters, the Poster renders
the identical overlay markup itself; either way there is one copy of
the copy, in `meta`.

Alt text on the SVG: "A workshop at night. A desk lamp lights a bench
and one monitor showing a crosshair. Beyond the bench, twenty-four
thousand small lit screens stretch into the dark, one for every
thousand downloads of CrossOver."

## 9. Budget sheet

| item | value |
|------|-------|
| assets over the wire | `data.json` about 0.3 KB, Poster SVG about 9 KB inline in the chunk; no images, models, fonts or audio. Total about 12 KB against the 1.5 MB ceiling |
| world code chunk | about 14 KB gzipped on top of the shared `three` and fiber chunks the stage already loads |
| triangles | field 49,186 (24,593 by 2), props about 500, cover wall 298, floor 2. About 50k against the 150k ceiling |
| draw calls | field 1, bench 1, monitor 1, lamp 1, rack 1, covers 1, floor 1. Seven |
| lights | 1 spot, 1 hemisphere (high only) |
| render targets | 0 |
| per-frame CPU | two uniform writes, one spline sample, one `lookAt`. Under 0.2 ms |
| frame time, M1 Air, DPR 1.5, high | about 3 to 4 ms. Fragment-bound at progress 0, where one quad covers the viewport with a cheap shader, and at 0.6, where 24k quads mostly cover a few pixels each. Sixty fps with room |
| frame time, iPhone 12, DPR 1, low | about 7 to 9 ms estimated. Thirty fps with room. Measure in step 8 |
| mount cost | under 30 ms for the layout and attributes, under 2 ms for the atlas |
| memory | instance matrices 24,593 by 64 B = 1.6 MB, attributes 0.3 MB, atlas 1.4 MB on high |

## 10. What was removed

- A rolling counter or big number on screen. The number appears once,
  as the title, and everything else is the number embodied.
- A starfield of GitHub stars. 1,245 stars is a small crowd, and a
  starfield reads as a template.
- The contribution calendar as terrain. The GraphQL calendar needs a
  token at build time, and GitHub Skyline already made that object.
- A screen-space HUD reticle over the whole world. It doubled the
  crosshair. The monitor's own crosshair sits at frame center for the
  entire pull-back, which is the same effect for free.
- Issues arriving and releases leaving as flying cards. Floating cards
  are the slop the contract names, and they are unreadable without
  text, which the scene cannot have.
- Lighting keyed to release dates. v3.3.4 is 12.8 million of the total
  and would light half the field in a single frame. Near-to-far in
  release order tells the same story at a pace the eye can follow.
- A figure or chair at the bench. Low-poly people read badly. The lamp
  left on and the monitor still lit say someone was just here.
- Lamp shadows. A shadow map is a second render pass for one bench
  shadow nobody would miss.
- Bloom. It is the glow the style guide forbids, and the lights read on
  near black without it.
- The scam warning, the Microsoft Store badge, the Arctic Code Vault
  badge, and the other package names. All live on `/play/crossover`
  and `/play`, one click away.
- Real album covers. Copyright. The generated tiles say "a wall of
  records" from where the camera stands, which is all the scene needs.
- Fetching from GitHub or npm in the visitor's browser. Rate limits, a
  stranger's IP hitting GitHub, and a half-built scene when it fails.
- A sound toggle (a click per light). Nothing here earns audio.
- Making the cover wall a second act with its own camera move. Album-art
  is twelve years of quiet work, and a wall in the corner is the right
  size for it. It is also the first thing to cut if the build runs
  long; see section 12.

## 11. Open questions for Lacy

1. The line says "built for gamers in 2019". The repo's first commit is
   2019-10-04 and the first release is 2019-10-05. If CrossOver existed
   somewhere before GitHub, give the real year and the line changes to
   match.
2. The count is GitHub release downloads only. The Microsoft Store has
   its own install count we cannot read. If you know it and want it in,
   it becomes a second baked number added to the total; if not, the
   title stays honest as GitHub alone.

Decisions made here that are not questions but that you may overrule:
the link goes to `/play/crossover` rather than `/play` (section 2), and
the lamp is warm `#f5e6c8`, the one non-zinc color in the world
(section 4).

## 12. Build estimate and order

About 18 hours for a strong engineer who has built one world already.
Each step leaves a world that ships.

| step | work | hours | ships as |
|------|------|-------|----------|
| 1 | `data.json` snapshot, the prebuild fetch script with its guard, `meta` with the computed title | 1 | nothing visible yet |
| 2 | The field: layout recipe, InstancedMesh, the screen shader with every light on, the camera spline from 0 to 1, fog | 4 | a crosshair on black that pulls back into a lit crowd. Already the whole idea |
| 3 | `litAt` wave, per-instance tint, overlay fade timings, `d0` for aspect | 2 | the wave, the story in order |
| 4 | Poster SVG and alt text; verify JavaScript off, reduced motion, no WebGL | 2 | the fallback states, designed |
| 5 | Bench, monitor body and stand, lamp with the spot, floor, merge geometries | 3 | the workshop |
| 6 | Quality low path, pointer parallax, blink, disposal on unmount, `active` gating | 2 | phones and the frame loop rules |
| 7 | Cover rack, cover instances, generated atlas | 2 | the wall of records. Skip if hours run out; nothing else depends on it |
| 8 | Measure on an M1 Air at DPR 1.5 and an iPhone 12 on low; tune the fog and spot; screenshots at 0, 0.2, 0.4, 0.6 and a 10 second recording of the pull-back for the PR | 2 | evidence |

DRI: whoever builds it owns the world end to end, including the PR
evidence. Do not split the field and the props across two people; the
seam would show at the bench.

### Demo test, run on this spec

1. Ten seconds: a crosshair on what looks like your own screen, then
   you back up and it is one monitor facing a crowd of lit screens.
2. Removed: section 10, fifteen items.
3. One primary action: the "See CrossOver" link. Nothing in the canvas
   is clickable.
4. Defaults: no settings. Quality is decided by the stage.
5. States: first paint, loading, no WebGL, reduced motion, error and
   offline all show the Poster with the same three lines. Missing data
   falls back to the committed snapshot. An absurd count falls back
   too.
6. Direct manipulation: scroll drives the camera the same frame.
7. Seams: the overlay copy has one source (`meta`), the Poster is the
   0.60 frame of the live world, and the CTA lands on the page that has
   the download. The one seam found and closed: an earlier draft's
   HUD reticle fought the monitor's crosshair, cut.
8. Stage test: the pull-back from one crosshair to twenty-four thousand
   is a demo moment. Yes.
9. Evidence: none yet. Nothing is built. Step 8 produces the
   screenshots and the recording; until then this is a spec, not a
   done world.
10. DRI: the builder of the world, named on the issue when it is filed.
