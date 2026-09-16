import { CatmullRomCurve3, Vector3 } from "three";
import { GATE_POINTS, SPLINE } from "./track";

/**
 * The camera path and its lookup tables, computed once per mount.
 * Everything the frame loop reads about the track lives here, so the
 * per-frame cost is one array index and a couple of lerps.
 */

export const SAMPLES = 2048;
const HEADING_BLUR = 8;
const CURVATURE_BLUR = 12;

export interface GatePose {
  /** Arc-length parameter where the camera crosses the gate plane. */
  u: number;
  position: Vector3;
  /** Heading of the spline tangent, radians, so the frame faces the path. */
  yaw: number;
}

export interface Track {
  curve: CatmullRomCurve3;
  /** Arc-length spaced positions, SAMPLES + 1 of them. */
  points: Vector3[];
  /** Camera yaw per sample, radians, unwrapped and box blurred. */
  heading: Float32Array;
  /** Signed curvature per sample, normalized so the tightest turn is 1. Positive turns left. */
  curvature: Float32Array;
  gates: GatePose[];
  /** Arc-length parameter of the finish gate; the timer freezes here. */
  finishU: number;
}

const boxBlur = (src: Float32Array, radius: number): Float32Array => {
  const n = src.length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let count = 0;
    for (let j = -radius; j <= radius; j++) {
      const k = Math.min(n - 1, Math.max(0, i + j));
      sum += src[k];
      count++;
    }
    out[i] = sum / count;
  }
  return out;
};

/** A camera with rotation.y = yaw looks along (-sin yaw, 0, -cos yaw). */
const yawOf = (tx: number, tz: number) => Math.atan2(-tx, -tz);

export const buildTrack = (): Track => {
  const curve = new CatmullRomCurve3(
    SPLINE.map(([x, y, z]) => new Vector3(x, y, z)),
    false,
    "centripetal",
  );
  const points = curve.getSpacedPoints(SAMPLES);
  const n = points.length;

  // Flat tangents from consecutive spaced points.
  const tx = new Float32Array(n);
  const tz = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = points[Math.max(0, i - 1)];
    const b = points[Math.min(n - 1, i + 1)];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    tx[i] = dx / len;
    tz[i] = dz / len;
  }

  // Heading, unwrapped so the blur never crosses a seam at +-pi.
  const rawHeading = new Float32Array(n);
  let prev = yawOf(tx[0], tz[0]);
  rawHeading[0] = prev;
  for (let i = 1; i < n; i++) {
    let h = yawOf(tx[i], tz[i]);
    while (h - prev > Math.PI) h -= Math.PI * 2;
    while (h - prev < -Math.PI) h += Math.PI * 2;
    rawHeading[i] = h;
    prev = h;
  }
  const heading = boxBlur(rawHeading, HEADING_BLUR);

  // Signed curvature: the y component of the cross product of consecutive
  // tangents. A left turn (north to west) gives a positive y.
  const rawCurvature = new Float32Array(n);
  let maxAbs = 1e-6;
  for (let i = 0; i < n - 1; i++) {
    const c = tz[i] * tx[i + 1] - tx[i] * tz[i + 1];
    rawCurvature[i] = c;
    maxAbs = Math.max(maxAbs, Math.abs(c));
  }
  rawCurvature[n - 1] = rawCurvature[n - 2];
  const blurred = boxBlur(rawCurvature, CURVATURE_BLUR);
  let maxBlurred = 1e-6;
  for (let i = 0; i < n; i++) maxBlurred = Math.max(maxBlurred, Math.abs(blurred[i]));
  const curvature = new Float32Array(n);
  for (let i = 0; i < n; i++) curvature[i] = blurred[i] / maxBlurred;

  // Gates: the spaced sample nearest each gate control point.
  const gates: GatePose[] = GATE_POINTS.map((pi) => {
    const [gx, gy, gz] = SPLINE[pi];
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < n; i++) {
      const p = points[i];
      const d = (p.x - gx) ** 2 + (p.y - gy) ** 2 + (p.z - gz) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return {
      u: best / (n - 1),
      position: new Vector3(gx, gy, gz),
      yaw: yawOf(tx[best], tz[best]),
    };
  });

  return { curve, points, heading, curvature, gates, finishU: gates[gates.length - 1].u };
};

/** Linear read of a per-sample table at arc-length parameter u. */
export const sampleTable = (table: Float32Array, u: number): number => {
  const x = u * (table.length - 1);
  const i = Math.floor(x);
  const t = x - i;
  const a = table[i];
  const b = table[Math.min(table.length - 1, i + 1)];
  return a + (b - a) * t;
};
