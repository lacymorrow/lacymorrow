# Worlds: what happens below the letter

The home page has two halves. The top is the letter: photo, one line,
three numbers, one button. It is static, server rendered, and paints
in under a second. Below "Still in use" the page stops being a page.
Each world is a full-viewport scene with its own look, its own
technology, and one link out to the part of the site it stands for.
Scrolling takes you into a world; the world plays itself once you are
there. Leaving one is a hard cut into the next, like walking through a
door into a different building.

This document is the contract. A world that does not fit it does not
ship, however good it looks.

## The experience, in order

1. Letter. Ten seconds: face, name, one sentence, three receipts,
   "Say hi". Unchanged by anything below.
2. "Still in use" list. The last paper section.
3. A single hairline and the first world's background color bleeds in
   as the stage pins. No "scroll down" arrow, no tutorial.
4. Worlds. **Scroll chooses the scene. The scene plays itself.** A
   world starts its timeline the moment it takes the screen and runs
   it on a clock, so standing still is how you watch it, not how you
   stop it. Scrolling moves you to the next world the way a door moves
   you into the next room; it never scrubs a scene frame by frame.
5. Each world has one overlay: a title, one sentence, one link. The
   link is the primary action of that screen, and it stays on screen
   for as long as the world does. Nothing else is clickable unless the
   spec says so and says why.
6. After the last world the paper comes back: the creed line, "from
   the creed", "Say hi" again, the footer.

Native scrolling only. No scroll hijacking, no wheel capture, no
smooth-scroll library, no horizontal scroll, no `overflow: hidden` on
body. Touch scrolls the way touch scrolls.

## How a world is timed

`progress` runs 0 to 1 over `meta.playSeconds`, eased at both ends and
linear in between so a beat sheet written at an even pace plays at an
even pace. Elapsed time comes from the wall clock, not from adding up
frame deltas, so a slow machine drops frames instead of playing the
scene in slow motion.

When the timeline ends the world holds its last frame for
`meta.holdSeconds`, cuts out through its own `background` colour over
450 ms, starts over, and cuts back in. That is a reel, or a lap. A
world whose last frame is alive on its own sets `loop: false` and
simply holds.

A world takes the screen when half its panel is in view, and gives it
up the same way, so two worlds never run their clocks at once.
Arriving plays from the top: leaving and coming back is a new arrival,
not a resumed video.

Nothing about this is tied to scroll offset, so the beat sheet in a
spec is a list of times, not a list of scroll positions. Read the
numbers 0.0 to 1.0 as fractions of the timeline.

## The contract

```ts
// src/components/pages/home/worlds/types.ts
export interface WorldMeta {
  id: string;            // "flash", "airfield", ...
  title: string;         // overlay title, serif, short
  line: string;          // one sentence, first person, humanized
  href: string;          // one link, on this domain
  cta: string;           // link text, e.g. "See the art"
  background: string;    // CSS color painted behind the stage before
                         // the world renders; the cut color
  lengthVh: number;      // how much scroll the world holds the screen
                         // for, in viewport heights. 180 to 220.
  playSeconds?: number;  // how long its timeline takes. Default 16.
  loop?: boolean;        // default true. See "How a world is timed".
  holdSeconds?: number;  // last frame hold before it starts over. Default 3.
  budget: { assetsKb: number; triangles: number };
}

export interface WorldProps {
  progress: MotionValue<number>; // the timeline; read in useFrame, never re-render on it
  active: boolean;               // this world has the screen; pause work when false
  quality: "low" | "high";       // low: DPR 1, no post, halve counts
  pointer: MotionValue<{ x: number; y: number }>; // -1..1, for parallax only
}

export interface WorldModule {
  meta: WorldMeta;
  World: React.ComponentType<WorldProps>;  // the live scene
  Poster: React.ComponentType;             // the still. See below.
}
```

Each world lives in `src/components/pages/home/worlds/<id>/` with
`index.ts` exporting `meta` and lazy loaders for `World` and `Poster`.
The registry in `worlds/registry.ts` lists the order. The stage
(`worlds/stage.tsx`) owns the pin, the progress math, mounting, and
fallbacks. A world never touches `window.scrollY`, the document, or
another world.

## States, designed, not defaulted

- **Server render and first paint**: the Poster. A designed still
  (SVG or a compressed image under 60 KB) with the same title, line
  and link. The page tells the whole story with JavaScript off.
- **Loading**: the Poster stays. The world mounts behind it and cross
  fades in over 300 ms after its first rendered frame. No spinners, no
  progress bars, no "loading world".
- **No WebGL, `prefers-reduced-motion`, `saveData`, `deviceMemory`
  under 4 GB, or a world that throws**: the Poster, permanently, for
  that world. An error boundary wraps every world. A blank stage is a
  bug.
- **Not on screen**: `active` is false. The world stops its frame loop.
  Two viewports past, it unmounts and disposes its geometry, textures
  and render targets. At most two worlds are mounted at once (the one
  on screen and the next one warming up one viewport early).
- **Offline or a failed asset**: the Poster. Never a half-built scene.

## Budgets, hard

- The letter's JavaScript does not change. `three`, `@react-three/*`
  and every world load through `next/dynamic` when the "Still in use"
  section is within one viewport of the top of the screen. Nothing 3D
  is in the initial bundle.
- Per world: assets 1.5 MB or less over the wire, 150k triangles or
  less, one render target of post-processing at most. Instance
  anything repeated. Procedural geometry beats downloaded geometry;
  a downloaded model is allowed when it is under 200 KB and CC0 or
  self-made (the Morrow Field GLBs in `public/models/morrow-field`
  are 2 to 8 KB each and are fair game).
- Frame time: 60 fps on an M1 MacBook Air at DPR 1.5, 30 fps on an
  iPhone 12 at DPR 1 in `quality: "low"`. If a scene cannot hit that,
  cut the scene, not the frame rate.
- Fonts inside a scene: none. Text in the overlay is HTML.
- Audio: none autoplays. A world may offer a sound toggle in its
  overlay if the spec makes the case.

## Look

Every world is a different building, so no shared palette is imposed.
Two rules still hold. Nothing that reads as a stock template: no
purple gradient glows, no floating glass cards, no particle spheres
for their own sake, no emoji, no lens flare. And a world has to be
about Lacy specifically: an asset or a number a stranger could check
should be on screen within the first 20 percent of scroll (a real
Flash piece, the real gate count, the real 24 million).

Overlay typography is shared so the seams feel deliberate: title in
Instrument Serif, line and link in the site's system sans, colors
chosen per world for contrast against that world's background.

## Interaction

- The clock drives the timeline. Pointer position drives at most a few
  degrees of parallax. That is the entire input model. Scroll is not an
  input to a scene, only a way of choosing one.
- Clicking the scene does nothing unless the spec says what and why
  (the Flash easel is the one known exception: clicking it plays the
  piece, because that is how Flash worked).
- Keyboard users tab to the overlay link. The canvas is
  `aria-hidden`; the Poster's alt text carries the description.

## What a world spec has to contain

`docs/worlds/<id>.md`, written so a builder can implement it without
asking a question. Sections, in this order:

1. The person and the moment. One sentence.
2. The one link and the overlay copy (title, line, cta), final.
3. The beat sheet: what is on screen at 0, 0.2, 0.4, 0.6, 0.8 and 1.0
   of the timeline, and what the camera does between beats. Say what
   the last frame does once the timeline ends: hold and loop, or stay
   alive on its own.
4. The look: palette (hex), light, materials, fog, post. Named
   references a builder can search for.
5. Assets: every mesh, texture and data source, where it comes from
   (procedural recipe, existing file path, CC0 URL with license, or a
   Lacy-provided file we do not have yet), and its size.
6. Technique: the three.js or WASM approach, instancing, shaders,
   what runs in `useFrame`, what is precomputed.
7. Quality low vs high: exactly what gets cut.
8. The Poster: what the still shows, how it is made.
9. Budget sheet: asset KB, triangles, draw calls, expected frame time.
10. What was removed. Ideas considered and cut, with the reason.
11. Open questions for Lacy, only where a real fact is missing.
12. Build estimate in hours for a strong engineer, and the order to
    build in so a half-built world is still shippable.

## Worlds, first draft of the order

| id | aspect | link | working title |
|----|--------|------|---------------|
| flash | Flash art, the 2000s | /play/art | The Arcade |
| airfield | FPV drones, Flymore | /work/drones | Gates |
| workshop | open source, CrossOver, album-art | /play | 24 Million |
| fleet | the AI agents | /writing/running-infrastructure-on-ai-agents | Seventeen |
| city | the day job, the companies | /work | Inside Companies |
| jungle | off the keyboard | /about | Off the Clock |

Ship order: flash, airfield, fleet first (the detailed brief, the
existing assets, the current story). workshop, city, jungle follow.
A home page with three excellent worlds beats one with six fair ones.
