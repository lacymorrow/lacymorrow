# fleet: Seventeen

The print shop that runs at night. Seventeen platen presses on a dark
floor, each cycling on its own timer, job cards on rails above them,
sheets moving down a chute toward one desk with one lamp, where a pen
signs the proof before it goes in the mail slot.

Aspect: the company of AI agents that runs Lacy's projects.
Link: `/writing/running-infrastructure-on-ai-agents`.
Position in the registry: third, after `airfield`. Ships in the first
three.

Every number in this spec comes from the essay at that link, dated
2026-08-25. When the essay changes, this spec changes.

## 1. The person and the moment

A stranger who just read "17 AI agents running my projects" in the
letter and is scrolling to find out whether that is a claim or a
machine.

## 2. The one link and the overlay copy

Final. Do not paraphrase in the build.

```ts
export const meta: WorldMeta = {
  id: "fleet",
  title: "Seventeen",
  line: "Seventeen Claude agents run my projects on a timer; they draft, I sign.",
  href: "/writing/running-infrastructure-on-ai-agents",
  cta: "Read what actually happens",
  background: "#0b0b0d",
  lengthVh: 300,
  budget: { assetsKb: 45, triangles: 70000 },
};
```

Overlay placement: bottom left, fixed for the whole world, fades in
over 300 ms at progress 0.04 and stays. Title in Instrument Serif,
`#efe7d3`. Line in the site sans, `#a1a1aa`. Link in the site sans,
`#efe7d3`, underlined, underline offset 4 px. The scene keeps its
subjects on the right two thirds of the frame so the overlay never
sits on top of the desk or the refusal.

The link is the only clickable thing. Nothing in the canvas responds
to clicks.

The checkable number is on screen from progress 0: the title says
Seventeen, and by 0.2 the viewer can see machines to count.

## 3. The beat sheet

Scene units are meters. The hall is 26 m long along z, 7 m wide along
x. Two rows of presses face the center aisle. Row A (x = +2.2) has
nine presses, row B (x = -2.2) has eight. Presses sit 2.4 m apart
along z, starting at z = 2 and ending at z = 21.2. The desk is at
z = 24.5, centered on the aisle, facing back down the hall. The
viewer's camera enters at the far end (z = 0) and travels toward the
desk.

Row A, far end to desk end: Marketing Lead, CEO, Founding Engineer,
Code Reviewer, QA Engineer, Frontend Engineer, Client Shepherd,
Backend Engineer, Designer. Row B, far end to desk end: CTO, Product
Manager, then the six agents the essay's table does not name (see
section 11). The order puts the CEO next to the Founding Engineer for
the refusal beat, and puts the review chain in desk order so the
hero sheet travels toward the lamp.

Two visual rules the whole scene obeys, so the mechanics read without
labels:

- Rails are private. Each press has its own overhead rail carrying its
  job cards. A steel plate stands between every pair of rails. Cards
  never cross a plate.
- The chute is shared. Finished sheets leave a press on a low chute
  that runs along the row toward the desk. A press can pull a sheet
  in off the chute if the sheet is addressed to it. This is the
  platform's blocker chain.

### Progress 0.00

Night. The camera is at aisle center, z = 0, height 0.9, looking at
the Marketing Lead press in row A, 2.5 m away, three quarter view.
The press is at rest: platen open, flywheel still, paper roll
loaded, status lamp amber (waiting). Fog hides everything past 6 m.
The desk at the far end is dark. Nothing moves except a faint drift
in the fog. This is what the scene is when Lacy is asleep and the
heartbeat has not fired.

### 0.00 to 0.20: the heartbeats

Camera: dolly forward to z = 3 and rise to height 1.7, turning to look
down the aisle. Ease in and out.

Presses wake in run-count order, busiest first, one every 0.012 of
progress between 0.04 and 0.20. Waking is: lamp amber to green, the
flywheel starts turning, and one cycle fires (platen closes with a
thunk, opens). After waking, each press keeps cycling on its own
period, time based, on top of scroll (section 6 has the periods).
By 0.20 the viewer can see nine presses in row A and the near end of
row B, all breathing at different rates, the CEO and the engineers
fast, the Designer barely at all.

What this teaches: they run on timers, and the timers differ.

### 0.20 to 0.40: an issue travels

Camera: tracks the hero sheet. Starts at the Founding Engineer press
(z = 6.8), height 1.4, 2 m off the aisle center toward row B, so row
A is in profile.

At 0.22 the top card on the Founding Engineer's rail drops into its
tray. The press pulls it, cycles, and a sheet comes out onto the
chute at 0.26. The sheet's position along the chute is a direct
function of progress from 0.26 to 0.40 (not time), so the viewer
scrubs it. At 0.30 the Code Reviewer press pulls it in, cycles once,
and puts it back out (a scroll triggered cycle that also resets that
press's timer phase). At 0.35 the QA Engineer press does the same.
At 0.40 the sheet slides off the end of the chute into the desk's
in-tray, which is still in the dark.

What this teaches: work moves from machine to machine on a fixed
path. One finishes, the next picks it up.

### 0.40 to 0.60: a boundary refuses

Camera: swings back up the row to the plate between the CEO's rail
and the Founding Engineer's rail (z = 5.6), height 2.1, close, 1.6 m
from the plate. The plate fills the middle third of the frame.

From 0.44 a card on the CEO's rail slides along the rail toward the
Founding Engineer's rail (the CEO reaching into the engineer's queue).
Card position is a function of progress. At 0.58 it reaches the
plate and stops against it. At 0.60 the Founding Engineer press's
lamp flicks red for 400 ms (time based, triggered once when progress
crosses 0.60 upward; re-armed when progress drops below 0.56), and
the card tips off the rail into the return bin on the floor between
the two presses. The CEO press keeps cycling as if nothing happened.
Nothing on the Founding Engineer's rail moved.

What this teaches: a machine cannot touch another machine's queue.
Not even the one at the head of the row.

### 0.60 to 0.80: Lacy signs

Camera: dollies the length of the hall to the desk, height 1.3, and
settles 1.2 m in front of it, slightly above, looking down at the
in-tray, pen, and mail slot. Fog thins as the camera goes so the
presses stay visible behind, small and blinking.

The desk lamp comes on at 0.70 (warm, the only warm light in the
world, and the only shadow caster). It reveals the in-tray with the
hero sheet on top of a short pile. From 0.74 to 0.78 the top sheet
slides forward under the lamp. From 0.78 to 0.84 the pen lifts and
draws one stroke across the lower right of the sheet, the stroke's
draw range a function of progress. At 0.86 the mail slot flap opens,
from 0.88 to 0.92 the signed sheet slides in, at 0.94 the flap
closes. The flap never opens for anything else.

What this teaches: the machines run in the dark. Nothing goes out
until a person sits down and signs.

### 0.80 to 1.00: the count

Camera: cranes up and back over the desk to height 9, z = 27, pitched
down 38 degrees, looking back down the whole hall. Fog density goes
to its minimum so the far end resolves. Ease out; the camera is still
by 0.96.

For the first time, all seventeen presses are in one frame. Two rows,
each lamp green, each platen on its own period, sheets moving on the
chutes, the pale runner of read paper down the aisle, the one warm
lamp in the foreground. The scene holds. The next world cuts in.

What this teaches: seventeen. Count them.

### Scrubbing backward

Every hero object (card, sheet, stroke, flap, lamp state) is a pure
function of progress, so scrolling up replays the story in reverse
without special cases. The two time based effects (press cycles, the
red flick) do not need to reverse; the red flick re-arms as described.

## 4. The look

A night press room built as a paper diorama. Matte everything, no
shine, no glow, no gradients painted into materials. Shape comes from
one cold overhead light and one warm desk lamp.

References a builder can search for:

- Heidelberg Windmill platen press (the machine silhouette: flat bed,
  hinged platen, flywheel on the side, feed table on top). Model the
  gesture, not the detail.
- Edward Hopper, Office at Night (one lamp, dark room, paper on the
  desk).
- Isle of Dogs miniature sets, night interiors (matte diorama light,
  visible construction, warm against cold).
- Blender Eevee clay render (as a material target: roughness near 1,
  metalness 0, ambient occlusion doing the work).

Palette (hex, final):

| Use | Hex |
|-----|-----|
| Cut color, back wall, fog | `#0b0b0d` |
| Floor | `#141416` |
| Press body | `#24262b` |
| Platen face and feed table | `#2f3238` |
| Flywheel, rails, plates, chute | `#1c1d21` |
| Brass trim (flywheel hub, lamp collar) | `#8a6d3b` |
| Paper, sheets, runner | `#efe7d3` |
| Job cards (manila) | `#d9c9a6` |
| Signature stroke, pen barrel | `#1b1b1f` |
| Lamp: waiting | `#f59e0b` |
| Lamp: running | `#4ade80` |
| Lamp: refused | `#ef4444` |
| Desk lamp light | `#ffb26b` |
| Overhead light | `#3a4250` |
| Overlay title and link | `#efe7d3` |
| Overlay line | `#a1a1aa` |

No purple. No blue accent. The green is the same green the rest of
Lacy's properties use for "active", so the seam with the site is
deliberate.

Light:

- HemisphereLight sky `#1a1c22`, ground `#000000`, intensity 0.35.
- DirectionalLight `#3a4250`, intensity 0.6, from high and behind
  the camera's entry, no shadows. It gives the machines their edges.
- SpotLight `#ffb26b`, intensity 18, angle 0.55 rad, penumbra 0.6,
  decay 2, distance 6, at the desk lamp head, aimed at the in-tray.
  Off (intensity 0) until progress 0.70, then ramps to full over 0.02.
  This is the one shadow map, 1024 square, casters limited to the
  desk objects.
- Status lamps are emissive, not lights. Each is a small sphere with
  `emissive` set to the lamp color and a flat emissive disc decal on
  the press face behind it to fake the local pool. Seventeen real
  point lights would cost more than the rest of the scene.

Fog: `FogExp2`, color `#0b0b0d`. Density is a function of progress:
0.13 at 0, 0.09 at 0.2, 0.07 through 0.6, 0.05 at 0.8, 0.028 at 1.0.
The far end of the hall is hidden until the crane shot.

Materials: `MeshStandardMaterial`, roughness 0.92, metalness 0 for
press parts; paper uses `MeshLambertMaterial`, double sided, with a
256 by 256 procedural noise map at 0.06 opacity as a bump for tooth.
Brass is roughness 0.6, metalness 0.4, on three tiny parts only.

Post: on `quality: "high"`, one full screen pass with vignette (0.35,
soft) and fine film grain (0.04, animated). One render target. On
`quality: "low"`, none. Build it last; the scene must hold without
it.

## 5. Assets

Everything is procedural. Nothing is downloaded. Wire cost is the
world's own JavaScript chunk plus the Poster.

| Asset | Source | Size |
|-------|--------|------|
| Press body | Merged BufferGeometry: base box 1.2 by 0.9 by 1.6, feed table box, two side frames, lamp collar cylinder. Built once, instanced 17 times. | 0 KB, ~520 tris |
| Platen | Box 1.0 by 0.06 by 0.8 with a hinge offset so it rotates closed from 62 degrees to 0. Instanced 17 times, per instance rotation. | 0 KB, 12 tris |
| Flywheel | Cylinder radius 0.42, 20 segments, plus brass hub. Instanced 17 times. | 0 KB, ~120 tris |
| Paper roll | Cylinder, radius per press from cached input tokens (section 6). Instanced 17 times, per instance scale. | 0 KB, ~80 tris |
| Finished stack | Box 0.42 by h by 0.3 beside each press, h from run count. Instanced 17 times. | 0 KB, 12 tris |
| Status lamp | Sphere radius 0.035, 8 segments, plus a 0.14 radius disc decal. Instanced 17 times, per instance color. | 0 KB, ~100 tris |
| Rails and plates | Bar 0.03 by 0.03 by 1.8 per press at height 2.4 plus a plate 0.02 by 0.6 by 0.5 between neighbors. Merged into one static geometry. | 0 KB, ~400 tris |
| Job cards | Plane 0.12 by 0.18, hanging from rails. 3 to 8 per rail, seeded random (decoration, not data; the essay gives no queue lengths). About 95 instances. | 0 KB, 2 tris each |
| Chute | Two long shallow troughs, one per row, at height 0.7, merged. | 0 KB, ~200 tris |
| Sheets in flight | Plane 0.21 by 0.297 (A4). Up to 60 instances cycling on the chutes, plus the one hero sheet as its own mesh. | 0 KB, 2 tris each |
| Runner (9,100 sheets) | Same A4 plane, InstancedMesh, 9,100 instances shingled in six lanes down the aisle with seeded 1 to 3 degree jitter. One sheet per million tokens. Matrices computed once at mount. | 0 KB, 18,200 tris |
| Return bins | Open box between presses, merged into the rails geometry. | 0 KB, 8 each |
| Desk | Box top 1.6 by 0.05 by 0.8, four leg boxes, in-tray (open box), mail slot (recess plus flap plane with hinge), lamp (cylinder base, bent arm from a TubeGeometry on a 3 point curve, cone shade). | 0 KB, ~700 tris |
| Pen | Cylinder radius 0.006, length 0.14, moves along the stroke. | 0 KB, 40 tris |
| Signature stroke | Ribbon mesh along a 48 point precomputed curve, width 0.004, drawRange set from progress. A generic looping stroke, not Lacy's real signature (his real one does not belong on a public page). | 0 KB, 96 tris |
| Floor, walls | Two planes and a back wall. | 0 KB, 6 tris |
| Paper tooth texture | 256 by 256 canvas noise generated at mount. | 0 KB |
| Data table | Runs and cached tokens for the 11 named roles, inline in `data.ts` with the essay date. | under 1 KB |
| World chunk | The world's own JS, gzipped (three and fiber are shared with the stage). | ~26 KB |
| Poster | Hand built SVG, section 8. | ~18 KB |

Total over the wire: about 45 KB.

## 6. Technique

Plain three.js through `@react-three/fiber` v8, no drei, no
postprocessing library (the one pass is a hand written
`ShaderMaterial` on a full screen triangle). No WASM. Nothing here
needs it.

Data drives the machines. From the essay's table:

| Press | Runs | Cached input |
|-------|------|--------------|
| CEO | 1,352 | 1.63B |
| Founding Engineer | 1,246 | 2.67B |
| CTO | 1,069 | 1.28B |
| Marketing Lead | 817 | 745M |
| Frontend Engineer | 334 | 866M |
| Client Shepherd | 272 | 432M |
| QA Engineer | 235 | 357M |
| Code Reviewer | 208 | 219M |
| Product Manager | 145 | 103M |
| Backend Engineer | 119 | 296M |
| Designer | 85 | 172M |

Three derived values per press, all precomputed at mount:

- Cycle period in seconds: `clamp(2000 / runs, 1.5, 20)`. CEO 1.5 s,
  Founding Engineer 1.6 s, CTO 1.9 s, Marketing 2.4 s, Frontend 6 s,
  Shepherd 7.4 s, QA 8.5 s, Reviewer 9.6 s, PM 13.8 s, Backend 16.8 s,
  Designer 20 s. Each press gets a seeded phase offset so none sync.
  The essay says two hours for most and faster for critical roles;
  run counts encode the same thing without a second data source.
- Paper roll radius: `0.06 + 0.16 * sqrt(tokens / 2.67e9)`. The
  Founding Engineer's roll is the biggest on the floor. The PM's is
  a stub.
- Finished stack height: `runs * 0.0004` m. The CEO's stack is 0.54 m
  tall, the Designer's is a few sheets.

The six presses not in the table use the totals to derive defaults:
6,200 total runs minus the listed 5,882 leaves about 320, so 53 each;
9.1B minus the listed 8.77B leaves about 330M, so 55M each. Section
11 asks for the real numbers.

Instancing. One `InstancedMesh` per part type across all 17 presses
(body, platen, flywheel, roll, stack, lamp). Static parts set their
matrices once. Platens and flywheels update only the instances that
changed this frame and flip `instanceMatrix.needsUpdate` once.
Lamp colors use `instanceColor`, updated only on state change.

What runs in `useFrame` (all of it returns early when `active` is
false):

1. Read `progress.get()` and `pointer.get()`.
2. Camera: sample a `CatmullRomCurve3` for position and a second one
   for the look target, both keyed to the beat table, with per
   segment easing. Add pointer parallax of at most 2 degrees yaw and
   1 degree pitch. Set fog density from the progress curve.
3. Heartbeats: for each press, `phase = (t + offset) mod period`; if
   in the first 0.35 s of the period, set platen rotation from a
   thunk curve (fast close, slower open). Flywheel angle advances
   `t * 1.2 / period`. Only presses that have woken (their wake
   threshold is below current progress) do this.
4. Hero objects: card drop, hero sheet on the chute, the CEO card on
   the rail, stroke `drawRange`, pen position, flap angle, desk lamp
   intensity, all pure functions of progress from lookup tables in
   `beats.ts`.
5. Background sheets on the chutes: 60 instances on a loop, position
   `(t * speed + i * gap) mod chuteLength`, so the floor always looks
   busy at the crane shot.
6. The red flick: a one shot timer armed on the upward crossing of
   0.60.

Precomputed at mount: all geometry, the 9,100 runner matrices, the
signature curve points, the camera curves, the per press cadence
table, the paper noise texture. Mount cost is under 40 ms on an M1.

Disposal: the world keeps every geometry, material, texture, and
render target in one array and disposes all of them on unmount. The
stage unmounts two viewports past.

## 7. Quality low vs high

| | high | low |
|-|------|-----|
| DPR | 1.5 (capped) | 1 |
| Post pass | vignette plus grain | none |
| Desk shadow map | 1024 | none (lamp still lights, no shadow) |
| Runner instances | 9,100 | 2,275 (one sheet per four million tokens; alt text stays honest because the Poster, not the canvas, carries the number) |
| Chute sheets | 60 | 30 |
| Job cards | ~95 | ~48 |
| Fog | Exp2 | linear |
| Paper tooth texture | on | off |
| Flywheel segments | 20 | 12 |

Nothing in the beat sheet is cut on low. Every mechanic still plays.

## 8. The Poster

One SVG, hand built, viewBox 1600 by 900, about 18 KB. It shows the
crane shot from progress 1.0 as a flat isometric drawing: the floor
plane, two rows of press blocks (three flat faces each, top, side,
platen face), the runner as a pale strip down the aisle at 60 percent
opacity, the desk at the right with a single warm ellipse at 14
percent opacity for the lamp pool, and a small sheet on the desk with
one dark stroke on it. Seventeen lamp dots: fourteen green, two amber,
one red. No gradients, no text inside the SVG. Title, line and link
are the same HTML overlay as the live world, so with JavaScript off
the page reads exactly the same.

It is inline in the server render (not an `<img>`), so it paints with
the letter and costs no request.

Alt text, on the SVG's `<title>` and the wrapper's `aria-label`:

"A dark print shop at night, drawn flat. Two rows of seventeen platen
presses face a center aisle, each with a small status lamp. A pale
runner of paper, nine thousand one hundred sheets, one for every
million tokens the agents have read, runs the length of the aisle to
a desk at the far end, where one lamp is on and a signed sheet waits
by the mail slot."

The Poster is the loading state, the reduced motion state, the no
WebGL state, and the error state. It is never blank.

## 9. Budget sheet

| Item | Value |
|------|-------|
| Assets over the wire | ~45 KB (world chunk ~26 KB, Poster ~18 KB, data under 1 KB) |
| Triangles, high | ~52,000 (runner 18,200; presses 17 × ~850 = 14,500; rails, chutes, bins ~1,200; desk and pen ~850; cards and sheets ~350; floor and walls 6; plus the post triangle). Well under 150k. |
| Triangles, low | ~36,000 |
| Draw calls, high | 17 (bodies, platens, flywheels, rolls, stacks, lamps, lamp decals, rails, cards, chutes, chute sheets, hero sheet, runner, floor and walls, desk group, pen, stroke) plus 1 post pass and 1 shadow pass |
| Draw calls, low | 15 |
| Render targets | 1 on high (post), plus the shadow map. 0 on low. |
| Shadow casters | desk objects only |
| Real lights | 3 (hemisphere, directional, one spot) |
| Expected frame time, M1 Air, DPR 1.5, high | ~3.5 ms GPU, ~1.2 ms CPU in `useFrame`. 60 fps with room. |
| Expected frame time, iPhone 12, DPR 1, low | ~7 ms GPU, ~1.5 ms CPU. 30 fps with room, likely 60. |
| Mount cost | under 40 ms |
| Memory | under 12 MB of GPU buffers |

If a measurement misses, cut in this order: post pass, runner to
2,275 on high too, chute sheets to 30, shadow map. Do not cut a beat.

## 10. What was removed

Metaphors considered and cut:

- Space, satellites around a station. Lacy said one world could be in
  space, and orbital period is a real timer, so it got a fair look.
  It lost on the signing beat. There is no person in orbit, and the
  story's turn is a person picking up a pen. It also lost on tokens
  (no shape for volume) and on the look: a globe with arcs is the
  most stock three.js scene there is. If a future world wants space,
  the airfield is the closer neighbor.
- Night switchboard. Jacks that refuse a plug are a good 403, but 17
  operators means 17 human figures, and operators only connect calls.
  The agents do the work, so the metaphor lies about the roles.
- Harbor, 17 boats. A water shader is a cliche, a harbormaster's flag
  is a weak sign, and boats on a timetable read as transit, not work.
- Beehive. No timer in a hive, and agents as bees is the most worn
  image in the category. Default no.

Inside the print shop, considered and cut:

- Three presses under dust sheets for the three terminated roles.
  True to the essay ("silence where there used to be a heartbeat") and
  cheap, but it puts twenty machines on a floor titled Seventeen and
  makes the count lie. In section 11 as a question only if Lacy wants
  it back.
- Agent names on the machines (io, hunter, ledger, and the rest). No
  fonts in a scene by contract, and the names are not in the essay.
  The role table is the data; names stay data.
- A counter ticking up to nine billion. It would need fonts, and a
  number that races to a fixed value is a trick. The runner is the
  honest version: one instance per million tokens, countable in the
  source.
- Seventeen point lights, one per lamp. Emissive spheres with a decal
  read the same at a tenth of the cost.
- A human figure at the desk. Uncanny at this polygon count, and the
  lamp, pen, and stroke already say a person is there.
- A sound toggle for the platen thunks. It would be good. It is also
  a second control on a screen that has one, and the README asks for
  a case. The case is not strong enough yet.
- Clicking a press to learn its role. One primary action per screen.
- The quota storm as a beat (all seventeen lamps red at once). A real
  incident, but two kinds of red on one scroll confuse the 403, which
  is the more important idea. The essay tells the storm better.
- The monologue storm (one press printing the same sheet 89 times).
  Same reason.
- Two halls for the two companies (LAC and LACA). Doubles the geometry
  to explain an org chart nobody asked about.
- Dawn light through a window at 1.0. A second look inside one world.
  The hall stays night.
- Live numbers from the Paperclip API. The site is static, the
  numbers are the essay's, and the essay carries the date.
- A signed pile at the desk sized to the 59M output tokens (59
  sheets). Honest in principle, but it attaches a meaning to a pile
  nobody can count, and mixing "output tokens" with "things Lacy
  signed" is a stretch. The in-tray holds an unlabeled short pile.
- Purple, glows, lens flares, particle spheres, glass cards. Not
  considered.

## 11. Open questions for Lacy

1. Runs and cached input tokens for the six agents the essay's table
   does not list. Defaults derived from the totals are 53 runs and
   55M tokens each (section 6). Real numbers make the quiet end of the
   floor honest. Also confirm the fleet is still seventeen; the title
   depends on it.
2. The essay says heartbeats are faster for critical roles but does
   not say which. The spec derives cadence from run counts instead,
   which needs no answer. Only speak up if a specific role should
   visibly run faster than its run count suggests.
3. The row split is nine and eight because that is what seventeen
   divides into, not because of the two machines (zero and graphite).
   If the real placement is nine and eight and Lacy wants the rows to
   mean that, say so; it costs nothing. Otherwise it stays a layout
   choice.

No question here blocks the build. Defaults ship.

## 12. Build estimate and order

About 26 hours for a strong engineer who has the stage from the README
already working. DRI: whoever picks up the `fleet` issue in LAC; one
person, start to finish, including the Poster.

Build in this order. Each numbered step leaves a world that could
ship that day.

1. Poster SVG and `meta`, wired to the registry. 3 h. Shippable: the
   page tells the story with a still. This is also the fallback for
   every state, so it comes first.
2. Press geometry, instancing, data table, cadences, lamps, floor,
   fog, the three lights, camera curves for all six beats, overlay
   fade. 7 h. Shippable: seventeen machines breathing in the dark at
   their real rates, with the crane shot at the end. This alone
   passes the stage test.
3. Desk, lamp with shadow, in-tray, pen, stroke, mail flap, the
   0.60 to 1.00 timing. 4 h. Shippable: the story now has its turn.
4. Rails, cards, chutes, background chute sheets, the hero sheet and
   the 0.20 to 0.40 beat. 4 h.
5. The plate, the CEO card, the red flick, the return bin, the 0.40
   to 0.60 beat. 2 h.
6. The runner, 9,100 instances, and the crane shot retuned around it.
   2 h.
7. `quality: "low"` cuts, dispose on unmount, `active` gating, and a
   measured pass on an M1 Air at DPR 1.5 and an iPhone 12. 3 h.
8. Post pass, high only. 1 h. Last, because the scene has to hold
   without it.

Evidence due with the PR: a 20 second screen recording of one scroll
from 0 to 1.0 on the M1 Air, a frame time readout from the same run,
one iPhone 12 recording, and the Poster rendered with JavaScript off.
A description of the recording does not count.

## 13. Built, and where the build departs from this spec

Built 2026-09-15 on branch `home/worlds`. Steps 1 through 6 of section 12
are in; step 7's measurement and step 8's post pass are not. Everything
below is a deliberate change, not drift, and the reason is given.

**The timeline is a clock, not the scrollbar.** This spec was written when
scroll position drove progress, which is why section 3 talks about the
viewer scrubbing a sheet along the chute. The contract changed after
Lacy's note that animation must not require scrolling: `progress` now runs
0 to 1 over `playSeconds` on a wall clock, and scroll only chooses which
world has the screen. Nothing else in the beat sheet had to move, because
every hero object was already a pure function of progress. The paragraph
on scrubbing backward no longer applies; the two time based effects still
work as described.

| Spec | Built | Why |
|------|-------|-----|
| `lengthVh: 300` | 200 | The README caps a world at 180 to 220, and every shipped world is 200. |
| no `playSeconds` | 26 | The beat sheet needs about that long to read. It puts the refusal flick at 440 ms and the signature at 1.6 s. |
| Overlay bottom left, its own placement | The stage's shared overlay, bottom, plus a bottom left scrim inside the world | The stage owns the overlay for every world. A per world placement would be the first seam between them. |
| Hemisphere 0.35, directional 0.6, spot 18 | 1.7, 2.4, 18 | three moved to physical light units after this spec was written. At 0.35 and 0.6 the hall renders black. The spot's 18 was already in the new units. |
| Platen 1.0 by 0.06 by 0.8, opens 62 degrees | 1.0 by 0.06 by 0.62, opens 54 | At 0.8 and 62 the platen swung past its own body and read as a slab, and from the aisle it covered the status lamp. |
| Lamp on a collar above the feed table | On the front face at 0.68 m | The collar sat above the body with nothing holding it up. The face is where a machine's own indicator goes, and the aisle can see it from either end. |
| Lamp decal a 0.28 square plane | A 0.15 disc | Square plane seen at a glancing angle down the row reads as a bar, not a pool. |
| Chute at the row's inner edge | `ROW_X - 0.78` | At the inner edge the trough and the sheets on it cut into the press bodies. |
| Hero sheet reaches the in-tray at 0.40 | Leaves the chute at 0.37 and lands at 0.46 | The beat sheet leaves 0.03 for the last 12 m, which at 26 s is a blur. The camera turns to the plate at 0.40, so the glide finishes unwatched and the sheet is in the tray before the lamp comes on. |
| Presses wake every 0.012 | Every 0.01 | Seventeen presses is sixteen gaps. At 0.012 the last one wakes at 0.232, past the 0.20 the spec sets for the end of the stretch. |
| Back wall and two side walls | One wall, at the door end | The crane shot ends behind the desk at z = 27. A wall there would be between the camera and the hall. The far end is fog, which is what the fog curve is for. |

Open question 1 in section 11 is still open: the six unnamed agents run on
the derived defaults of 53 runs and 55M tokens, so the quiet end of row B
is a guess. Everything else on the floor is the essay's.

### Changes made once it was on screen

Nothing below is taste. Each one is something the build could not show
until it rendered.

| Spec | Built | Why |
|------|-------|-----|
| 3 real lights | 6: hemisphere, key, fill, and three point lights in shades over the aisle | The rails sit at 2.4 m and the only light in the room was at deck level, so the refusal played in the dark. A press room has light over the work. The shades are visible geometry, cold, so the desk lamp is still the only warm light. |
| Plates in the rail colour `#1c1d21` | Their own mesh at `#5d646f` | A card stopping against something nobody can see is not a boundary, it is a bug. |
| Status lamp on the press face | On the deck, top front corner | From the crane shot a press hides its own face, and the ending of this world is counting seventeen lamps. |
| Job cards 0.12 by 0.18 | 0.17 by 0.23 | At rail height and 3 m away the smaller card was a speck. |
| Refusal camera across the row, 1.6 m from the plate | 40 degrees off the row, 3.1 m back | The plate is thin along z so it can stop a card on the rail, and the cards hang facing across the aisle. The two are perpendicular, so any square camera shows one of them edge on. At 1.6 m the plate also filled a third of the frame, and an open platen sat on the lens. |
| Crane straight back down the hall axis | Hall runs bottom right to top left | On the axis the two nearest presses sat under the overlay copy, so the count came up fifteen. |
| "the one warm lamp in the foreground" in the final frame | Not in frame | The desk is 2 m from the crane camera and 7 m below it, the far end is 25 m away and level. No single 46 degree frame holds both. Counting seventeen won. |
| Work lights over the plates | Offset 1.1 m along the row | A lamp directly above a vertical face leaves that face unlit, and the plate is the point of the beat. |
