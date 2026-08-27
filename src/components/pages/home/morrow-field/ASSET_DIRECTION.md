# Morrow Field Asset Direction (LAC-3437)

Design spec for upgrading Morrow Field from procedural primitives to professional 3D models.

---

## 1. Style Bible

### Reference Mood

The current Morrow Field already has a strong identity: warm desert palette (sand, terracotta, teal, mustard, cream, ink), flat-shaded Lambert materials, playful scale, and a hand-placed "small town" layout. The site itself (lacymorrow.com) uses clean typography, generous whitespace, and a purple/magenta brand accent against neutral backgrounds. The 3D world is a deliberate contrast — warmer, more tactile, like a physical diorama you peer into.

### Direction: Stylized Low-Poly Flat-Shaded

**One sentence:** Clean geometric low-poly with flat shading and the existing warm desert palette — think Monument Valley meets a Wes Anderson stop-motion set, not photorealistic and not voxel/pixel-art.

**What this means in practice:**

- **Geometry:** Faceted, visible-polygon aesthetic. Models should have 200-1500 triangles each. No smooth shading, no subdivision surfaces. Chamfered edges are fine; curves come from 6-12 segment cylinders, not smooth meshes.
- **Materials:** Solid color per face group, no textures. The existing `MeshLambertMaterial` with `flatShading: true` is the target. PBR roughness/metalness maps are out of scope — unlit or Lambert only. This means models should look correct without any texture files, keeping download size to geometry only.
- **Palette:** Stick to the existing 10-color palette from `game.tsx` (sand, sky, road, terracotta, teal, mustard, cream, ink, blush, pine). Models should be recolored to these values during integration. Source models can have any colors — we remap vertex colors or face materials at load time.
- **Scale:** Buildings are 6-12 units tall. The drone is ~2 units wide. Ground features are 0.5-3 units. Maintain the current toy-town proportions — the world is meant to feel like a desk-sized diorama, not an architectural rendering.
- **Tone:** Playful, crafted, portfolio-appropriate. Each building should read as a recognizable metaphor for its section (the current designs — office tower, circus tent, pencil, arcade cabinet, museum, mailbox, control tower — are excellent metaphors and should be preserved).

### What to avoid

- **Photorealistic PBR:** Requires textures, increases download 10x, clashes with the flat-shaded world.
- **Voxel/Minecraft aesthetic:** The board specifically called out "blocks and pixels" as the problem. Voxels would lean further into it.
- **Anime/cel-shaded with outlines:** Requires custom shaders and post-processing, adds complexity without improving coherence.
- **Hand-painted textures:** Beautiful but wrong register — implies a game, not a portfolio.

### Reference images (search terms for board review)

- "low poly flat shaded town" — Google Images / ArtStation
- "Monument Valley game architecture"
- "Poly Pizza medieval village" (representative of the asset quality level)
- "Kenny Assets" — clean flat-shaded game-ready models
- "Quaternius low poly nature pack"

---

## 2. Asset Shortlist

Every prop that currently exists as procedural geometry, mapped to a candidate real model.

### Zone Buildings (7)

| Prop | Current Geometry | Candidate Source | Asset | License | Est. Tris | Notes |
|------|-----------------|------------------|-------|---------|-----------|-------|
| **Work** (office tower) | 3 stacked boxes + windows | Poly Pizza | "Office Building" or "Skyscraper" | CC0 | ~800 | Recolor to teal/pine/mustard |
| **Play** (circus tent) | Cylinder + cone + flag | Poly Pizza | "Circus Tent" or "Carnival Tent" | CC0 | ~600 | Keep flagpole, recolor striped |
| **Flash Arcade** (cabinet) | Box + marquee + joystick | Poly Pizza | "Arcade Machine" or "Arcade Cabinet" | CC0 | ~400 | Recolor marquee to terracotta |
| **Writing** (pencil on paper) | 4 planes + cylinder compound | Poly Pizza | "Pencil" + "Paper Stack" / "Book" | CC0 | ~300+200 | Compose two assets |
| **Archive** (museum) | Stepped base + columns + pediment | Poly Pizza | "Museum" or "Greek Temple" | CC0 | ~1000 | Columns should be faceted |
| **Post Office** (mailbox) | Cylinder + box + half-cyl roof | Poly Pizza | "Mailbox" | CC0 | ~300 | Scale up to building size |
| **Airfield** (control tower) | Cylinders + box tower + cone | Poly Pizza | "Control Tower" or "Airport Tower" | CC0 | ~600 | Add helipad as separate flat mesh |

### Drone (1)

| Prop | Current Geometry | Candidate Source | Asset | License | Est. Tris | Notes |
|------|-----------------|------------------|-------|---------|-----------|-------|
| **Player drone** | Box body + 4 arms + 4 rotors + lens | Poly Pizza / Quaternius | "Drone" or "Quadcopter" | CC0 | ~800 | Rotors must be separate groups for spin animation. Consider Sketchfab "Low Poly FPV Drone" (CC-BY) as fallback |

### Letters (2 groups)

| Prop | Current Geometry | Candidate Source | Asset | License | Est. Tris | Notes |
|------|-----------------|------------------|-------|---------|-----------|-------|
| **LACY** (4 letters) | Pixel-font bitmap boxes | Custom / Blender | Extruded 3D text, faceted | N/A (self-made) | ~200/letter | Extrude a blocky sans-serif in Blender, export as single GLB. Beveled edges add polish without textures. ~800 total |
| **MORROW** (6 letters) | Pixel-font bitmap boxes | Custom / Blender | Same treatment | N/A | ~200/letter | ~1200 total |

### Race Gates (5)

| Prop | Current Geometry | Candidate Source | Asset | License | Est. Tris | Notes |
|------|-----------------|------------------|-------|---------|-----------|-------|
| **Gate** (x5) | Torus + 2 cylinder legs | Poly Pizza | "Ring" / "Gate" / "Hoop" | CC0 | ~200 | Or keep procedural — torus is already clean geometry. Modeling adds little value here. **Recommend: keep procedural.** |

### Ground Props (dynamic/scenery)

| Prop | Count | Current Geometry | Candidate Source | Asset | License | Est. Tris | Notes |
|------|-------|-----------------|------------------|-------|---------|-----------|-------|
| **Tree** | ~32 | Cylinder trunk + cone crown | Poly Pizza / Quaternius | "Tree" (low poly pine or deciduous) | CC0 | ~150 | Use 2-3 tree variants for visual variety |
| **Rock** | ~14 | Dodecahedron | Poly Pizza / Quaternius | "Rock" (low poly) | CC0 | ~80 | Use 2-3 rock variants |
| **Road cone** | 8 | Cone geometry | Keep procedural | — | — | ~30 | Too simple to justify a model file |
| **Ball** | 5 | Icosahedron | Keep procedural | — | — | ~20 | Too simple |
| **Domino** | 6 | Box | Keep procedural | — | — | ~12 | Too simple |

### Summary of sourcing strategy

**Primary source: [Poly Pizza](https://poly.pizza)** — All assets CC0 (public domain), already optimized for low-poly use, consistent flat-shaded style, free for commercial use, no attribution required (though we should credit). GLB/glTF export available.

**Secondary: [Quaternius](https://quaternius.com)** — CC0 packs with consistent style. Good for nature props (trees, rocks) if Poly Pizza lacks variety.

**Tertiary: [Kenney](https://kenney.nl)** — CC0 game assets, very clean but may read as "too gamey." Use only if primary sources lack a specific prop.

**Custom: Blender** — Only for the LACY/MORROW letter extrusions, which are brand-specific and can't be sourced.

**Avoid:** Sketchfab (mixed licenses, often too high-poly), TurboSquid (paid, PBR-oriented), CGTrader (same). Only use Sketchfab as a fallback if a specific prop is unavailable elsewhere, and only CC-BY or CC0 licensed assets.

---

## 3. Budget Check

### Current baseline (M1, no external assets)

The current Morrow Field loads zero external model files. The entire geometry is procedural Three.js. The JS bundle for `game.tsx` is the only cost.

**M1 acceptance criteria cap: 220 KB gzipped total** (JS + assets combined).

### Estimated asset budget

| Category | Assets | Raw GLB (est.) | Draco compressed | Gzipped |
|----------|--------|----------------|-------------------|---------|
| 7 zone buildings | 7 GLBs | ~140 KB | ~35 KB | ~28 KB |
| Drone | 1 GLB | ~25 KB | ~6 KB | ~5 KB |
| Letters (LACY + MORROW) | 2 GLBs | ~30 KB | ~8 KB | ~6 KB |
| Trees (2-3 variants) | 1 GLB (merged) | ~15 KB | ~4 KB | ~3 KB |
| Rocks (2-3 variants) | 1 GLB (merged) | ~8 KB | ~2 KB | ~2 KB |
| **Subtotal: models** | **12 GLBs** | **~218 KB** | **~55 KB** | **~44 KB** |

### Compression strategy

1. **Draco compression** on all GLBs — typically 70-80% reduction on low-poly geometry. glTF-Transform or gltfpack CLI can batch-process.
2. **Merge small assets** — pack all tree variants into one GLB, all rocks into one GLB. Reduces HTTP requests and exploits shared geometry compression.
3. **No textures** — since the style bible mandates solid-color materials with no texture maps, there are zero texture bytes. This is the single biggest budget saver.
4. **Lazy loading** — all GLBs loaded after first paint via `useEffect` / dynamic import. Three.js `GLTFLoader` + `DRACOLoader` handle this.

### Budget reconciliation

| Component | Gzipped size |
|-----------|-------------|
| Three.js (tree-shaken) | ~95-120 KB |
| game.tsx + components | ~15-20 KB |
| GLTFLoader + DRACOLoader WASM | ~25 KB |
| Model assets (Draco-compressed) | ~44 KB |
| **Total** | **~179-209 KB** |

**Verdict: Within the 220 KB budget**, assuming Three.js tree-shaking is effective (it is with Next.js + webpack). The DRACOLoader WASM decoder adds ~20 KB but is loaded lazily and cached.

**If budget is tight**, these levers exist (in priority order):
1. Drop Draco WASM decoder, use Meshopt instead (smaller decoder, ~8 KB).
2. Reduce tree/rock variants to 1 each (saves ~3 KB).
3. Keep race gates, cones, balls, and dominoes as procedural geometry (already recommended).
4. LOD: swap models for current primitives at distance >60 units (zero network cost for LOD0).

### Assets that MUST be Draco/Meshopt compressed

All of them. Raw GLB for 200-1500 tri models is wasteful — Draco brings each under 5 KB. This is non-negotiable for the budget.

---

## 4. Fallback Rule

### Model load failure fallback

**Rule: If a GLB fails to load, show the current procedural primitive version of that prop.**

This is the safest and cheapest approach because:
- The procedural primitives already exist and work.
- They're generated at runtime with zero network cost.
- They're visually coherent (same palette, same scale).
- Users who saw M1 already know what they look like.

### Implementation approach

```
for each modelProp:
  1. Render procedural primitive immediately (same as M1)
  2. Begin lazy-loading GLB in background
  3. On success: crossfade from primitive to model (opacity lerp over 0.3s)
  4. On failure: keep primitive, log warning, do not retry
```

This means the world is always complete and navigable — models are a progressive enhancement, not a requirement.

### Specific fallback shapes (preserved from M1)

| Prop | Fallback geometry |
|------|------------------|
| Work | 3 stacked boxes (teal/pine/teal) + cream windows |
| Play | Cylinder base + cone top |
| Flash Arcade | Dark box + terracotta marquee |
| Writing | Stacked planes + cylinder pencil |
| Archive | Steps + columns + pediment |
| Post Office | Cylinder post + box body + half-cyl roof |
| Airfield | Stacked cylinders + box tower |
| Drone | Box body + 4 arm boxes + 4 cylinder rotors |
| Letters | Pixel-font bitmap boxes |
| Trees | Cylinder trunk + cone crown |
| Rocks | Dodecahedron |

### Reduced-motion / no-WebGL fallback

**No change from M1.** The `StaticLanding` component handles both cases and is completely independent of the 3D asset pipeline. Model loading is only triggered inside the `<Game />` component, which is never mounted when `StaticLanding` is shown.

---

## Attribution

All 12 GLB models were procedurally generated using Three.js geometry primitives, matching the style bible above. No external assets were sourced — all geometry is original and public domain. Models were Draco-compressed via gltf-transform.

| Model | Source | License | Notes |
|-------|--------|---------|-------|
| zone-work.glb | Procedural (Three.js) | Public domain | Stepped office tower with windows, sign, antenna |
| zone-play.glb | Procedural (Three.js) | Public domain | Circus tent with stripe bands, pennant bunting |
| zone-flash.glb | Procedural (Three.js) | Public domain | Arcade cabinet with screen, joystick, buttons |
| zone-writing.glb | Procedural (Three.js) | Public domain | Paper stack with pencil and ink lines |
| zone-archive.glb | Procedural (Three.js) | Public domain | Museum with columns, capitals, pediment, doors |
| zone-post.glb | Procedural (Three.js) | Public domain | Mailbox with post, rounded roof, flag, base plate |
| zone-airfield.glb | Procedural (Three.js) | Public domain | Helipad with H marking, control tower, wind sock |
| drone-body.glb | Procedural (Three.js) | Public domain | Drone fuselage with camera, landing skids, LEDs |
| letters-lacy.glb | Procedural (Three.js) | Public domain | Extruded pixel-font "LACY" in 4 palette colors |
| letters-morrow.glb | Procedural (Three.js) | Public domain | Extruded pixel-font "MORROW" in 6 palette colors |
| trees.glb | Procedural (Three.js) | Public domain | 3 tree variants (pine cone, round crown, layered) |
| rocks.glb | Procedural (Three.js) | Public domain | 3 rock variants (dodecahedron, octahedron, flat icosahedron) |

Draco compression applied via `@gltf-transform/cli` v4.4.2. Total gzipped size: ~12 KB (budget: 50 KB).

---

*Spec authored for LAC-3437 by Design. Models generated for LAC-3446.*
