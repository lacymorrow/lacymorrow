# Morrow Field 3D asset drop-in

Drop Draco-compressed GLB files here. File names must match the manifest in
`src/components/pages/home/morrow-field/model-loader.ts` (`MODEL_MANIFEST`).

Expected files (all Draco or Meshopt compressed):

- `zone-work.glb`
- `zone-play.glb`
- `zone-flash.glb`
- `zone-writing.glb`
- `zone-archive.glb`
- `zone-post.glb`
- `zone-airfield.glb`
- `drone-body.glb`
- `letters-lacy.glb`
- `letters-morrow.glb`
- `trees.glb`
- `rocks.glb`

Per-asset gzipped caps are declared in `MODEL_MANIFEST`. Total shipped weight
must stay under the LAC-3437 designer budget (~44 KB gz for models, 220 KB gz
overall). Runtime logs a warning in dev builds if either cap is exceeded.

If a file is missing, the world renders the procedural primitive from M1.

Sourcing rules: see `src/components/pages/home/morrow-field/ASSET_DIRECTION.md`.
Every source asset must be CC0 or CC-BY commercial-safe. Recolor to the
existing 10-color palette (`C` in `game.tsx`) before export.

Pivot convention: model origin sits on the ground plane at the building's
footprint center. The drone body pivots at the geometric center of the fuselage.
Word-letter models pivot at the row centerline (y = 1.65 above ground).
