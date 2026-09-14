/** The workshop palette. docs/worlds/workshop.md section 4. */
export const palette = {
  background: "#09090b",
  surface: "#111113",
  display: "#1c1c1f",
  benchTop: "#27272a",
  frame: "#19191d",
  arm: "#fafafa",
  dot: "#a78bfa",
  accents: ["#4ade80", "#d946ef", "#60a5fa"],
  lamp: "#f5e6c8",
  /** The shade around the bulb. Warm, and dark enough to stay a silhouette. */
  lampShade: "#3a2f24",
  mark: "#a1a1aa",
} as const;

export const FOG_NEAR = 20;
// The spec says 140. At 140 the last row (about 132 from the crane camera)
// is still 7% visible and its edge reads as a wall; at 115 it dissolves.
export const FOG_FAR = 115;

/** Where the monitor's screen sits. Every audience screen looks at it. */
export const SCREEN_CENTER: [number, number, number] = [0, 1.15, 0];
