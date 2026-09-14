import { CatmullRomCurve3, Vector3 } from "three";

/**
 * Every fixed point in the world, in world units, plus the portrait variant.
 * Curves are written as landscape positions and re-placed around the gate, so
 * the ribbon passes through the gate at any aspect. docs/worlds/flash.md, 3 and 6.
 */

export const FOV = 42;

/** The gate the landscape numbers are written around. */
const GATE_LANDSCAPE = new Vector3(-2.6, 2.4, 1.0);

export interface Layout {
  portrait: boolean;
  /** Camera at progress 0 and at the end of the dolly. */
  cameraFrom: Vector3;
  cameraTo: Vector3;
  target: Vector3;
  gate: Vector3;
  easel: Vector3;
  easelYaw: number;
  easelScale: number;
  /** How much a frame grows as it reaches the gate. 0.55 means 1.55 times. */
  frameGrow: number;
  /** Curves are squeezed toward the gate in x on a narrow screen. */
  xScale: number;
}

export const layoutFor = (aspect: number): Layout =>
  aspect < 1
    ? {
        portrait: true,
        cameraFrom: new Vector3(0, 2.6, 19),
        cameraTo: new Vector3(0, 2.6, 19),
        target: new Vector3(0, 2.4, 0),
        gate: new Vector3(0, 0.1, 1.0),
        easel: new Vector3(0, 4.0, 0),
        easelYaw: 0,
        easelScale: 0.62,
        frameGrow: 0.3,
        xScale: 0.6,
      }
    : {
        portrait: false,
        cameraFrom: new Vector3(0.4, 2.8, 15),
        cameraTo: new Vector3(0.9, 2.8, 13.8),
        target: new Vector3(0.2, 2.6, 0),
        gate: GATE_LANDSCAPE.clone(),
        easel: new Vector3(3.6, 2.7, 0),
        easelYaw: -0.32,
        easelScale: 1,
        frameGrow: 0.55,
        xScale: 1,
      };

/** A landscape point, moved to wherever the gate is at this aspect. */
const place = (p: number[], layout: Layout): Vector3 =>
  new Vector3(
    layout.gate.x + ((p[0] ?? 0) - GATE_LANDSCAPE.x) * layout.xScale,
    layout.gate.y + ((p[1] ?? 0) - GATE_LANDSCAPE.y),
    layout.gate.z + ((p[2] ?? 0) - GATE_LANDSCAPE.z),
  );

export const curveThrough = (points: number[][], layout: Layout): CatmullRomCurve3 =>
  new CatmullRomCurve3(
    points.map((p) => place(p, layout)),
    false,
    "centripetal",
  );

export interface SwooshSpec {
  color: string;
  /** Half the band width at its widest, in world units. */
  width: number;
  /** Progress span it draws on and erases over. */
  span: [number, number];
  /**
   * How far it is already drawn at progress 0, so the first frame is never
   * empty even if the person does not scroll.
   */
  head0: number;
  alpha: number;
  /** Phase of the shine sweep so no two sweep together. */
  shine: number;
  points: number[][];
  /** Dropped on quality low. */
  optional: boolean;
}

/**
 * Four, not the five the spec drew: the thin white one read as a stray wire
 * across the easel rather than a swoosh, and the spec's own budget note says
 * to drop it first.
 */
export const SWOOSHES: SwooshSpec[] = [
  {
    color: "#c6ff00",
    width: 0.55,
    span: [0.0, 0.17],
    head0: 0.72,
    alpha: 1,
    shine: 0.0,
    points: [
      [-32, 6, -42],
      [-14, 7, -16],
      [-2, 8.5, -2],
      [6, 12, 8],
    ],
    optional: false,
  },
  {
    color: "#19e6ff",
    width: 0.38,
    span: [0.02, 0.19],
    head0: 0.5,
    alpha: 1,
    shine: 0.31,
    points: [
      [-26, -1, -46],
      [-10, -2, -14],
      [0, -4, -2],
      [8, -9, 8],
    ],
    optional: false,
  },
  {
    color: "#ff8a00",
    width: 0.7,
    span: [0.05, 0.21],
    head0: 0,
    alpha: 1,
    shine: 0.58,
    points: [
      [20, 12, -52],
      [8, 8, -18],
      [-2, 5, -4],
      [-12, 1, 8],
    ],
    optional: true,
  },
  {
    color: "#ff0099",
    width: 0.28,
    span: [0.07, 0.23],
    head0: 0,
    alpha: 1,
    shine: 0.77,
    points: [
      [24, 2, -36],
      [10, 1.5, -12],
      [0, -0.5, -2],
      [-10, -4, 8],
    ],
    optional: false,
  },
];

/** The gallery ribbon, through the gate and out the bottom of the frame. */
export const GALLERY_POINTS: number[][] = [
  [-48, 10, -72],
  [-32, 8, -44],
  [-17, 5, -20],
  [-8, 3.0, -5],
  [-2.6, 2.4, 1.0],
  [1.8, -2.2, 4.2],
  [5.5, -9.0, 6.4],
  [12, -18, 8.5],
];

export const GALLERY_COLOR = "#ff0099";
export const GALLERY_WIDTH = 1.4;
export const BACKGROUND = "#06070f";

/** Where a piece sits in progress: the first at 0.22, one every 0.034. */
export const GALLERY_START = 0.22;
export const GALLERY_STEP = 0.034;
/** World units between frames on the ribbon. */
export const FRAME_SPACING = 4.5;
