# city: Inside Companies

World id `city`. Aspect: the day job. Link: `/work`.

A stranger scrolls past "Still in use" and the page goes dark. They are
on a street at dusk, moving slowly past buildings that are not software
buildings: a brick campus hall, a lab with exhaust stacks on the roof, a
hospital, a power yard with two cooling stacks. Every one of them is
dark. As the camera reaches each one, a single window comes on, then
the floor, then the whole building. By the end the camera lifts off the
street and the stranger sees what they walked past: nine buildings lit,
three gone dark again, and behind them the Charlotte skyline with one
tower's crown lit blue.

No logos, no labels, no text in the scene. The copy is in the overlay.

## 1. The person and the moment

Someone who does not know Lacy, thirty seconds into the home page,
about to decide whether "software engineer" means a person who joins
big teams or a person who shows up where there is no team and leaves
something running.

## 2. The one link and the overlay copy

```ts
export const meta: WorldMeta = {
  id: "city",
  title: "Inside Companies",
  line: "I build software inside companies that mostly don't build software, twelve of them so far, from a power company to a genetics lab.",
  href: "/work",
  cta: "See the companies",
  background: "#1c2033",
  lengthVh: 340,
  budget: { assetsKb: 24, triangles: 16000 },
};
```

"Twelve" is the number a stranger can check: `/work/companies` lists
twelve. It is on screen from progress 0.

Overlay placement: bottom left. During the dolly the lower fifth of the
frame is street and sidewalk, so the text always sits on dark ground.
Title `#f3e9d8`, line `#d9cfbf`, link `#f3e9d8` underlined `#ffcd85`.
The stage owns fade timing.

## 3. The beat sheet

The scene is a street running along +x. Building fronts face +z at
z = 0. The camera rides along the far side of the street at z = 40,
y = 6, looking across at the facades with a 6 m lead. Progress moves
the camera. Every light in the scene is a function of progress, so
scrolling back up puts the lights out again in reverse.

Camera, exact:

| progress | position | lookAt |
|---|---|---|
| 0.00 to 0.06 | (-30 to -24, 6, 40), linear | (x + 6, 11, 0) |
| 0.06 to 0.80 | (-24 + (p - 0.06) / 0.74 × 350, 6, 40), linear in p | (x + 6, 11, 0) |
| 0.80 to 0.82 | hold at (326, 6, 40) | (332, 11, 0) |
| 0.82 to 1.00 | lerp (326, 6, 40) to (170, 82, 215), t = smoothstep((p - 0.82) / 0.18) | lerp (332, 11, 0) to (170, 24, -60) |

Portrait (aspect under 1): the crane ends at (235, 95, 230) looking at
(240, 30, -60) so the lit right half of the street and the crown stay
in frame. Vertical FOV 45 in landscape, 62 in portrait.

In `useFrame`, damp toward the target: `pos.lerp(target, 1 - exp(-10 dt))`.
That is the only smoothing. Scroll never fights it.

Building i lights at `pOn = 0.06 + ((cx - 4) + 24) / 350 × 0.74`, where
cx is the building's center x. It is centered in frame at that moment.
For the six dark buildings, the desk lamp comes on at `pOn - 0.03`
(about 14 m earlier, as the building enters frame from the right). For
the three defunct buildings, the windows go back out from
`pOn + 0.09` over 0.03 (out of frame during the dolly, visible in the
crane).

| p | on screen | camera |
|---|---|---|
| 0.0 | Dusk. Sodium lamps on, everything else dark. The low glass office of building 1 is at frame right with a third of its windows already lit (it had engineers). Skyline silhouette in fog behind. Overlay reads "Inside Companies" and the line with "twelve". | Slow push from x = -30 to -24. |
| 0.2 | The brick campus hall (building 2) fills the frame, just lit: its cupola glows, the sidewalk in front of it is warm. Building 3, the lab, is entering from the right, fully dark, stacks on its roof against the fog. At 0.225 one second-floor window in the lab comes on with a fluorescent stutter. | Dolly, x = 42. |
| 0.4 | The small storefront (building 6) is at center with its desk lamp on and the cascade about to run. Behind and left, the wide three-floor slab (5) is lit. The nine-floor telecom tower (7) with its lattice mast is entering from the right, a third lit. | Dolly, x = 137. |
| 0.6 | The building with the roof dish (9) has just lit. The glass office (10) enters from the right, a third lit. Between them the back-row filler towers stay dark. | Dolly, x = 231. |
| 0.8 | End of the dolly. The power yard (12) is lit: control building windows warm, cooling stacks lit from below by the yard lamps, transformer rows in silhouette. Behind it, the tallest skyline towers, their crowns unlit. | Hold at x = 326. |
| 1.0 | The whole street from above and behind the camera's side. Nine buildings lit, three dark (the lab, the small storefront, the solar warehouse). Twenty-seven filler buildings dark or nearly. The skyline behind, the tallest tower's crown lit blue since 0.90 to 0.96. This frame is the Poster. | Crane end. |

What the lighting means: the moment the software went live. The desk
lamp is the moment before that, when he is the only one there. A
building that was a third lit when he arrived had a team. A building
that goes dark again is a company that no longer exists; the software
did not outlive it, and the scene does not pretend otherwise.

## 4. The look

Departs from the Morrow Field desert palette. Same construction
(flat-shaded Lambert boxes, no textures) so the two feel like one hand,
different hour of the day.

References to search: "Firewatch key art Olly Moss" for the layered
dusk and the fog planes; "Townscaper" for building massing; "Edward
Hopper Nighthawks" for warm window light against a cool evening;
"Charlotte skyline from Bank of America Stadium at dusk" for the
silhouette.

Palette:

| use | hex |
|---|---|
| cut color, sky zenith | `#1c2033` |
| sky mid | `#5a4046` |
| sky horizon band | `#d0683b` |
| fog | `#3b3742` |
| facade slate | `#262932` |
| facade concrete | `#2f3139` |
| facade brick | `#3a2e2c` |
| facade dark glass | `#1f2229` |
| facade pale concrete | `#34373f` |
| rooftop, trims, lamp posts | `#1b1d24` |
| asphalt | `#17181d` |
| sidewalk | `#23242a` |
| road stripe | `#5b5548` |
| window dark | `#0f1420` |
| window lit warm | `#ffcd85` |
| window lit cool (fluorescent, near white) | `#d9ecff` |
| desk lamp | `#ffd9a3` |
| skyline windows, always on, dim | `#8c6f45` |
| sodium lamp head, pool center | `#ffb347`, `#ff9a3c` |
| the one cool accent, the crown | `#6fd3ff` |

Light: `HemisphereLight(#2a2f4a, #3a2a24, 0.7)` and one
`DirectionalLight(#ff8a5b, 0.45)` at (-80, 25, 60), the last of the
sun from behind the camera's left, rimming west faces and rooftops. No
shadows. Windows are unlit (`MeshBasicMaterial`, `toneMapped: false`),
so they glow without lights.

Fog: `THREE.Fog(#3b3742, 55, 300)` during the dolly, lerped to
(160, 560) through the crane so the skyline stays readable when the
camera is 200 m back. Skyline sits at z = -170 to -260, inside the
fog, as silhouettes with dim windows.

Sky: a vertex-colored plane at z = -420, 1400 × 500, bottom at y = -10,
three color rows (zenith, mid, horizon band in the bottom 12 percent).
No texture, no shader.

Post: none. The glow of a lit building is one additive plane on the
sidewalk in front of it (see assets), not bloom.

Materials: `MeshLambertMaterial({ flatShading: true })`, one per facade
color, cached exactly like `mat()` in
`src/components/pages/home/morrow-field/game.tsx`.

## 5. Assets

Everything is procedural. Nothing downloads except the world's own
code chunk. No textures, no models, no fonts.

Scale: meters. Floor height 3.4. Windows are planes 1.4 × 1.8 on a
2.6 m pitch, sill 0.9 above each floor, on the +z face and both ±x
faces, 0.03 in front of the facade. No windows on -z faces.

### The twelve, front row, z = 0 line

Chronological left to right. `state` is dark (no team when he
arrived), lit (a third of windows already on), and `defunct` adds the
dim-out.

| # | company | years | building type | x0 | w | d | floors | state | pOn |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Red Ventures | 2010 | low glass office, flat canopy | 0 | 18 | 14 | 2 | lit | 0.121 |
| 2 | Appalachian State | 2010 to 2014 | brick hall, center cupola 4 × 4 rising to 22 m, 4 cupola windows | 26 | 26 | 16 | 3 | dark | 0.185 |
| 3 | Invitae | 2013 to 2015 | lab: long low block, four roof exhaust stacks (r 0.4, h 3), glass atrium 6 w × 10 h at the right end with 6 windows | 60 | 24 | 20 | 3 | dark, defunct | 0.255 |
| 4 | 10up | 2015 to 2016 | converted warehouse, sawtooth roof (4 prisms) | 92 | 14 | 14 | 4 | lit | 0.312 |
| 5 | Yahoo | 2016 | wide three-floor slab | 114 | 22 | 18 | 3 | lit | 0.367 |
| 6 | Long Game | 2016 | storefront with a roll-up door (recessed box) | 144 | 10 | 10 | 2 | dark, defunct | 0.417 |
| 7 | Twilio | 2017 to 2021 | telecom tower, lattice mast 14 m (4 thin cylinders + 3 rings), two dish cylinders r 1.2 | 162 | 16 | 16 | 9 | lit | 0.462 |
| 8 | Swell Energy | 2023 | warehouse, roof array of 12 tilted panels (boxes 3 × 0.1 × 1.6 at 25 degrees), 3 battery cabinets 2 × 2.4 × 1 in the yard | 186 | 20 | 18 | 2 | dark, defunct | 0.517 |
| 9 | Viasat | 2023 | office with a roof dish (cone r 3, h 1.2, tilted 40 degrees, on a 2 m post) | 214 | 16 | 14 | 4 | lit | 0.572 |
| 10 | Credit Karma | 2024 | glass office | 238 | 14 | 14 | 6 | lit | 0.620 |
| 11 | Novant Health | 2024 | hospital tower with a long two-floor wing on the left, helipad on the tower (octagon r 5 with a ring) | 260 | 22 | 22 | 11 | dark | 0.675 |
| 12 | Duke Energy | 2025 to 2026 | power yard: control building 12 × 10 × 2 floors at the left, two cooling stacks `CylinderGeometry(3.2, 4.4, 16, 12)` at x0 + 18 and x0 + 26, four transformer boxes 2 × 2.4 × 2 with three insulator pins each, fence of 12 posts | 290 | 30 | 24 | 2 | dark | 0.747 |

`pOn` values are derived from the formula in section 3, not typed by
hand; the table is the check.

The desk lamp is always the third window from the left on the second
floor of the front face (floor index 1, column 2). On the power yard it
is the control building's window. On the hospital it is in the tower.

Facade colors: 1 dark glass, 2 brick, 3 pale concrete, 4 brick, 5
concrete, 6 slate, 7 concrete, 8 slate, 9 pale concrete, 10 dark glass,
11 pale concrete, 12 concrete (control building) and slate (stacks).

Window count per building (front columns = floor((w - 2) / 2.6), side
columns = floor((d - 2) / 2.6) × 2, times floors, plus extras):
28, 61, 66, 48, 57, 18, 135, 36, 52, 72, 231, 18. Total 822.

### Front-row fillers, 11

One in each 8 m gap: x = gap start + 1, w 6, d 10, floors 3 + (i mod
3), color cycles slate, concrete, brick. Windows every 2.6 m. About 28
each, 308 total. Never lit; 6 percent of their windows are on from the
start (seeded), dim warm `#8c6f45`.

### Back-row fillers, 16

Lots from x = -40 to 340 every 24 m with ±4 m seeded jitter, z from
-24 to -44, w = 12 + rnd × 12, d 16, floors 5 + floor(rnd × 10), color
from the facade set. Windows every 5.2 m (double pitch). About 1,100
total. 8 percent lit from the start, dim warm. These are the dark
buildings the lit ones sit among.

### Skyline, 14 towers, z = -170 to -260

Stylized Charlotte from the south, unlabeled, heights halved to sit in
frame. Widths 20 to 40, depths 20 to 30. Heights (m): 60, 85, 45,
110, 160, 70, 140, 95, 55, 120, 80, 65, 100, 50, at x from -60 to 380
in that order with 30 m spacing. The 160 m tower at x = 210 is the nod
to the tallest one (a cluster of 9 thin cylinders at its top, always
lit dim warm). The 140 m tower at x = 290, behind the power yard, is
the nod to the tower with the LED crown (550 South Tryon, which most of
Charlotte still calls the Duke Energy Center): stepped top, six
horizontal strip boxes (w × 0.6 × 0.6) at 2.4 m spacing under the top.
Strips are `#0f1420` until 0.90 and `#6fd3ff` by 0.96, per strip from
the bottom up.

Skyline windows: planes 4 × 3 on a 6.8 m vertical pitch (every other
floor), front face plus sides at double pitch. 40 percent on, seeded,
`#8c6f45`. About 2,200.

### Street furniture

- Ground: one plane 800 × 600 at y = 0, asphalt. A sidewalk box 800 ×
  0.2 × 6 at z = 0 to 6 and one at z = 36 to 40. One road stripe box
  800 × 0.02 × 0.3 at z = 21, dashed by using 100 instances of an 4 m
  box.
- Lamp posts: `InstancedMesh`, 24 instances, every 14 m starting at
  x = -20, alternating z = 7 (far side) and z = 35 (near side, they
  swipe past the camera 5 m away, which gives the dolly its parallax).
  Each is a cylinder r 0.12 h 7 (6 segments) plus a head box
  0.6 × 0.3 × 0.4 at the top in lamp head color, unlit.
- Lamp pools: `InstancedMesh`, 24 discs `CircleGeometry(5, 16)` at
  y = 0.02 with vertex alpha (center 0.45, edge 0), additive,
  `#ff9a3c`, depthWrite off.
- Spill: `InstancedMesh`, 12 planes w × 8 lying on the sidewalk in
  front of each company building, additive, `#ffcd85`, instance color
  scaled by that building's lit fraction × 0.35. Black instance color
  is invisible under additive blending, so no toggling.

### Windows, one mesh

One `InstancedMesh(PlaneGeometry(1.4, 1.8), MeshBasicMaterial({ toneMapped: false }), N)`
for every window in the scene, company buildings, fillers and skyline
alike. Skyline windows use a second `InstancedMesh` with the 4 × 3
plane. N ≈ 2,200 street, 2,200 skyline; cap each at 2,600.

### Sizes

| item | over the wire |
|---|---|
| world chunk (layout table, builders, frame loop) | about 14 KB gzipped |
| Poster (inline SVG, server rendered) | about 8 KB |
| textures, models, fonts | 0 |
| total | about 22 KB, budget 24 |

`three` and `@react-three/fiber` load through the stage and are not
counted against this world.

## 6. Technique

`src/components/pages/home/worlds/city/`:

- `layout.ts`: the twelve, the fillers, the skyline, the lamps, as
  plain data. A seeded PRNG (the `16807` one from `game.tsx`, seed 12)
  so the scene and the Poster agree on every filler and every pre-lit
  window. Exports `buildWindows()` which returns a flat table:
  position, face normal, building id, kind (warm, cool, desk, prelit,
  ambient), `pOn`, `pOff` or -1, `delay` in progress units.
- `world.tsx`: builds meshes once in `useMemo`, disposes on unmount,
  runs the frame loop.
- `poster.tsx`: the SVG, from `layout.ts`.

Precomputed at mount:

- Facade geometry merged per color with `mergeGeometries` from
  `three/examples/jsm/utils/BufferGeometryUtils` (six draw calls for
  every facade in the street, one or two for the skyline).
- The window table, and a `Float32Array(N × 3)` of resting colors.
- Instance matrices for lamps, pools, spill and windows. Set once.

Per frame in `useFrame`, only while `active`:

1. Read `progress.get()` and `pointer.get()`. If progress equals the
   last frame's value and the pointer moved less than 0.002, return
   after the camera damp step.
2. Camera target from the table in section 3, plus pointer parallax
   of ±1.5 degrees yaw and ±0.8 degrees pitch, then damp.
3. Fog near and far from the crane t.
4. Window colors. For each window: `t = clamp((p - pOn - delay) / dur)`
   with `dur = 0.002` per window and `delay = floorIndex × 0.002 +
   seeded 0 to 0.0012`, so a seven-floor building cascades bottom to
   top over about 0.014 progress (35 px of scroll at a 900 px
   viewport). Color is `mix(dark, lit, ease(t))`. Pre-lit windows start
   at lit × 0.85 and go to lit. Ambient windows never change. The desk
   lamp uses `pOn - 0.03` and multiplies by
   `0.5 + 0.5 × step(0.5, fract(t × 3))` for t under 0.4, the
   fluorescent stutter. Defunct buildings then run a second ramp from
   `pOff` over 0.03 back to dark. Write into `instanceColor.array`,
   set `needsUpdate`. 4,400 windows at a few ops each is under 0.3 ms
   and a 53 KB upload; do it all rather than track dirty ranges.
5. Spill instance colors from each building's mean t.
6. Crown strips from `clamp((p - 0.90 - i × 0.01) / 0.02)`.

Nothing else moves. There is no idle animation; a stopped scroll is a
still.

Precision: window planes 0.03 off the facade, `polygonOffset` not
needed. Camera near 1, far 900.

Disposal: every geometry and material, both instanced meshes, on
unmount. No render targets exist.

## 7. Quality low vs high

| | high | low |
|---|---|---|
| DPR | min(devicePixelRatio, 1.5) | 1 |
| skyline windows | every other floor, 2,200 | every fourth floor, 1,100 |
| back-row fillers | 16 | 8 (every other lot) |
| spill planes | 12 | none |
| lamp pools | 24 | 24 |
| window color upload | every frame progress changes | same, plus skip when no window crossed a threshold this frame |
| triangles | about 16k | about 11k |

Nothing about the twelve buildings, the desk lamps, the cascades, the
dim-outs or the crown changes between tiers. The story is the same on
an iPhone 12.

## 8. The Poster

The final crane frame as a flat elevation: no perspective, the street
seen straight on from slightly above, which reads cleaner as a still
than a perspective render would.

`poster.tsx` returns an inline `<svg viewBox="0 0 1600 900" role="img">`
with a `<title>` and this description as the accessible name: "A
street of twelve small buildings at dusk, a power yard, a hospital, a
lab and a campus hall among them, their windows lit warm, three of them
dark again, with the Charlotte skyline behind and one tower's crown lit
blue." It is built from the same `layout.ts`, so the buildings, the
fillers and which three are dark match the scene exactly.

Layers, back to front: sky `linearGradient` with the three sky stops
(a sky, not UI chrome, so the site's no-gradient rule does not apply);
skyline silhouettes in `#23242e` filled with a `<pattern>` of dim
windows (16 × 16 tile, 3 of 8 cells filled, which reads as scattered
without random rects); the crown strips in `#6fd3ff`; a fog band rect
at 35 percent opacity; back-row fillers; front-row fillers; the twelve
with `#win-lit` (nine) or `#win-dark` (three) patterns and their
signature details drawn as polygons (stacks, dish, mast, cupola,
helipad, panels, transformers); lamp posts as lines with a
`#ffb347` circle and a flat `#ff9a3c` ellipse at 25 percent opacity for
the pool; ground and sidewalk rects. Under 70 elements, about 8 KB.
No text in the SVG. The overlay carries title, line and link, so the
page tells the whole story with JavaScript off.

The Poster is also every fallback state: server render, loading (the
world cross fades in behind it after its first frame), no WebGL,
reduced motion, saveData, low memory, a thrown error, a failed chunk.
None of those show anything but this still and the overlay.

## 9. Budget sheet

| | value | limit |
|---|---|---|
| assets over the wire | about 22 KB | 1,536 KB |
| triangles, high | about 16,000 (windows 8,800, facades and details 5,500, skyline 900, street 800) | 150,000 |
| draw calls | 16 (facades 6, skyline 2, windows 2, lamps 2, pools 1, spill 1, sky 1, ground 1) | |
| render targets | 0 | 1 |
| JS per frame | under 0.5 ms (4,400 window colors, one buffer upload) | |
| GPU per frame, M1 Air at DPR 1.5 | under 2 ms | 16.6 ms |
| iPhone 12, low | under 6 ms | 33 ms |
| memory | under 12 MB of buffers | |

## 10. What was removed

- Company logos on buildings. Trademarks, and the whole point is that
  the buildings are typed by what the company does.
- A San Francisco interlude for the Twilio years. Two cities is two
  worlds. One street, and the tower with the mast says telecom.
- Rain and wet-asphalt reflections. Needs a reflection pass or a
  texture, and the street would read as a Blade Runner template.
- Bloom on the windows. `UnrealBloomPass` is a mip chain, over the
  one-render-target rule, and flat additive spill on the sidewalk
  sells the light for free.
- Shadows. Dusk has none worth drawing, and it saves a shadow map.
- Cars, people, a passing train. Headlights compete with the windows
  and anything moving pulls the eye off the building that is lighting.
- Idle animation: a blinking aviation beacon on the mast, flickering
  skyline windows, a pulse on the sodium lamps. Real, but noise. A
  stopped scroll is a still.
- An ambulance-bay underlight on the hospital. A second white accent.
  The crown is the only cool light.
- Pilotis under the wide slab (building 5). Four columns nobody would
  notice at 40 m.
- A day-to-night time lapse. The light-up is the time passing.
- The Invitae card words ("connected", "humanity", "path") projected
  somewhere in the scene. No fonts in scenes, and the card's back is
  the company's copy, not his.
- Clicking a building to go to its company page. Twelve hit targets on
  a scrolling canvas, and the contract wants one link. The overlay
  link goes to `/work`.
- A sound toggle (street ambience). No case for it.
- Lit windows staying on for the three defunct companies. Considered
  leaving one window lit as "the work outlived them". It did not.
  They go fully dark.

## 11. Open questions for Lacy

One. The split between buildings that start dark (no team when you
arrived) and buildings that start a third lit (a team was there) is a
guess from the company pages:

- dark: Duke Energy, Invitae, Novant Health, Appalachian State, Swell
  Energy, Long Game
- a third lit: Twilio, Credit Karma, Yahoo, Red Ventures, Viasat, 10up

Move any building between the two lists. It is one field in
`layout.ts`.

## 12. Build estimate and order

About 28 hours for a strong engineer who has built with r3f before.
DRI: the Frontend Engineer who takes the build issue; Lacy signs off
on the screenshots.

Build in this order. Each step leaves the home page shippable.

1. `layout.ts` and `poster.tsx` (5 h). The Poster alone is a valid
   world under the contract: it is what every fallback shows anyway.
   Ship it with `World` pointing at a component that renders nothing
   and let the stage keep the Poster up.
2. Facades, street, sky, fog, and the dolly camera with no lights
   changing (5 h). Buildings dark, lamps on. Already a scene.
3. The window mesh and the cascade timeline, desk lamps included (6 h).
   This is the story. Screenshot p = 0.2 and p = 0.6.
4. The crane, the fog lerp, the skyline and the crown (4 h).
   Screenshot p = 1.0 against the Poster; they should match in
   composition.
5. Spill planes, lamp pools, the defunct dim-outs (3 h).
6. Quality tiers, disposal, `active` gating, portrait FOV and crane
   end (3 h). Test on an iPhone 12 or a throttled equivalent.
7. Tuning with Lacy from screenshots (2 h). Colors and the cascade
   duration are the likely knobs.

Evidence to attach on the build issue: screenshots at p = 0.2, 0.6 and
1.0 at 1440 × 900 and 390 × 844, a 10 second scroll recording on a
MacBook, and the frame time readout from the r3f `Stats` panel on the
phone.

## Appendix: demo test, run on this spec

1. Ten seconds: a dark street at dusk, the first building already a
   third lit, the line with "twelve" at bottom left. They scroll, and
   the next building lights up as they reach it.
2. Removed: section 10. Considered and cut: same list.
3. One primary action: the `/work` link. Nothing in the canvas is
   clickable.
4. Defaults: quality picks itself from the stage's `quality` prop. No
   settings.
5. Empty, loading, error, offline: the Poster, section 8.
6. Scroll is native and the camera damps at 10 per second; the cascade
   completes within 35 px of scroll.
7. Seams: the Morrow Field world uses a desert palette; this one uses
   the same flat-shaded construction at dusk. Named as deliberate in
   section 4.
8. Stage test: the crane reveal with nine lit and three dark is the
   slide. Yes.
9. Evidence: not yet, this is a spec. Required on the build issue,
   section 12.
10. DRI: section 12.

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
