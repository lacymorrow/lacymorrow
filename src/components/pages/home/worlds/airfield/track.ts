/**
 * The airfield track, as plain arrays. Meters, Y up, north is -Z.
 * Every number here comes from docs/worlds/airfield.md sections 3 and 5.
 */

export type Vec3 = [number, number, number];

/** Camera spline control points. Column two is camera height. */
export const SPLINE: Vec3[] = [
  [0.0, 0.3, 12.0], // P0  launch pad, disarmed
  [0.0, 2.2, 4.0], // P1  climb out
  [0.0, 1.6, -10.0], // P2  G1 north
  [0.0, 1.6, -30.0], // P3  G2 north
  [-3.0, 3.0, -46.0], // P4  turn 1 entry, climbing
  [-13.0, 3.4, -56.0], // P5  turn 1 apex
  [-24.0, 2.6, -58.0], // P6  G3 west, the high gate
  [-37.0, 1.8, -53.0], // P7  turn 1 exit
  [-43.0, 1.5, -42.0], // P8  G4 south
  [-37.0, 1.5, -26.0], // P9  G5 south, slalom right
  [-46.0, 1.5, -10.0], // P10 G6 south, slalom left
  [-42.0, 2.6, 6.0], // P11 turn 2 entry
  [-30.0, 2.8, 16.0], // P12 turn 2 apex
  [-18.0, 1.8, 18.0], // P13 G7 east
  [-6.0, 1.5, 14.0], // P14 G8 east, the finish
  [2.0, 0.8, 10.0], // P15 flare
  [4.0, 0.3, 6.5], // P16 landed, facing the pits
];

/** Indices into SPLINE where the eight gates stand. */
export const GATE_POINTS = [2, 3, 6, 8, 9, 10, 13, 14];

/** Progress window of the lap itself. Before it: on the pad. After: landed. */
export const LAP_START = 0.08;
export const LAP_END = 0.92;

/** Lap timer end value. A design value that reads like a lap, not a claim. */
export const LAP_SECONDS = 36.4;

/**
 * The 24 foam pads: 4 rows by 6 columns, in the pits beside the launch pad.
 * The spec puts them at x 9 to 19, z 6 to 15, which is 70 to 90 degrees off
 * the nose on the pad, so a 100 degree lens never sees them. They sit north
 * and west of that here: 32 to 41 degrees right at frame 0, and 3 to 16 m
 * ahead of the landed camera, which is the spec's "4 to 14 m away". The
 * grid, the spacing and the count are the spec's.
 */
export const PADS: Vec3[] = [];
for (const z of [4, 1, -2, -5]) {
  for (let x = 5; x <= 15; x += 2) PADS.push([x, 0, z]);
}

/** Turn flags, three outside each apex. */
export const FLAGS: [number, number][] = [
  [-10, -62],
  [-18, -66],
  [-28, -64],
  [-40, 12],
  [-34, 22],
  [-26, 26],
];

/** Behind the pads, as seen from the landed camera. */
export const TENTS: [number, number][] = [
  [7, -8],
  [13, -8],
];

/** A touch south of P0 so the pad's far edge, not its middle, is the frame's floor. */
export const LAUNCH_PAD: Vec3 = [0, 0, 12.05];
export const GOAL: Vec3 = [30, 0, -50];
/** The spec's (-15, -84) sits dead ahead from the pad and hides gates 1 and 2. Moved west so it reads far left, as the beat sheet asks. */
export const SCHOOL: Vec3 = [-58, 2.5, -86];
export const FIELD_CENTER: [number, number] = [-20, -20];

/** Pack voltage, 4S. Full at arm, resting after the lap. */
export const VOLT_FULL = 16.8;

/**
 * Palette. Pairs lerp from progress 0 to 1 as the sun goes down.
 * Single values hold.
 */
export const PALETTE = {
  skyHorizon: ["#f2b98a", "#b9806e"],
  skyLow: ["#d38d78", "#7a6070"],
  skyMid: ["#5f7290", "#34445e"],
  skyZenith: ["#223350", "#101a2c"],
  // The spec's night grass (#2b3730) renders as dead black under a sun at
  // 8 degrees; lifted a little so the near ground still reads as grass.
  grass: ["#3a4a3c", "#36453a"],
  sun: "#ffd9a8",
  sunLight: "#ffb27a",
  hemiSky: "#6f82a8",
  tree: "#1c2c2a",
  trunk: "#2a2320",
  led: "#ffc98a",
  brick: "#6e4438",
  window: "#f3e6c8",
  cream: "#faf3e2",
  ink: "#35312c",
  pad: "#e3a44f",
  terracotta: "#cd5f38",
  quads: ["#1f6e66", "#cd5f38", "#e3a44f", "#e2937b", "#faf3e2", "#175048"],
} as const;

/** Seeded LCG, the one from Morrow Field's game.tsx. */
export const lcg = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};
