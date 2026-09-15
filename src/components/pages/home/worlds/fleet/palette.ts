/** The night press room. docs/worlds/fleet.md section 4. */
export const palette = {
  background: "#0b0b0d",
  floor: "#141416",
  body: "#24262b",
  platen: "#2f3238",
  steel: "#1c1d21",
  brass: "#8a6d3b",
  paper: "#efe7d3",
  card: "#d9c9a6",
  ink: "#1b1b1f",
  waiting: "#f59e0b",
  running: "#4ade80",
  refused: "#ef4444",
  deskLamp: "#ffb26b",
  overhead: "#3a4250",
  sky: "#1a1c22",
} as const;

/**
 * Fog density along the timeline. The far end of the hall stays hidden
 * until the crane shot, which is the first time all seventeen are in one
 * frame and the whole point of the ending.
 */
const FOG = [
  [0, 0.13],
  [0.2, 0.09],
  [0.6, 0.07],
  [0.8, 0.05],
  [1, 0.028],
] as const;

export const fogDensity = (p: number): number => {
  for (let i = 1; i < FOG.length; i++) {
    const [z1, d1] = FOG[i]!;
    if (p <= z1 || i === FOG.length - 1) {
      const [z0, d0] = FOG[i - 1]!;
      const t = z1 === z0 ? 1 : Math.min(1, Math.max(0, (p - z0) / (z1 - z0)));
      return d0 + (d1 - d0) * t;
    }
  }
  return 0.028;
};
