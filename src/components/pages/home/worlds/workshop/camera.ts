import { Vector3 } from "three";

import { SCREEN_CENTER } from "./palette";

/**
 * One camera move: back up from the monitor, rise over the bench, look out
 * at the crowd. Keyframes at every 0.2 of progress, Catmull-Rom between
 * them, each segment eased with smoothstep so it starts and ends at rest.
 * docs/worlds/workshop.md section 3.
 */

export const FOV = 50;

const [CX, CY, CZ] = SCREEN_CENTER;

const positions = [
  new Vector3(CX, CY, CZ), // z is replaced by -d0 each frame
  new Vector3(0, 1.55, -2.2),
  new Vector3(0, 3.0, -5.0),
  new Vector3(0, 4.4, -7.0),
  new Vector3(0.3, 4.5, -7.4),
  new Vector3(0.5, 4.6, -7.8),
];

const targets = [
  new Vector3(CX, CY, CZ),
  new Vector3(0, 1.25, 4),
  new Vector3(0, 2.0, 20),
  new Vector3(0, 2.6, 34),
  new Vector3(0, 2.7, 36),
  new Vector3(0, 2.8, 38),
];

const SEGMENTS = positions.length - 1;

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * How far back the camera starts. Landscape: the monitor's display area
 * (0.792 by 0.432 world units inside the bezel) overfills the viewport so
 * no bezel shows. Portrait: the whole monitor sits at 90% of the width.
 */
export const startDistance = (aspect: number) => {
  const half = Math.tan((FOV * Math.PI) / 360);
  if (aspect < 1) return Math.min(2.4, 1 / (2 * half * aspect));
  const byWidth = 0.792 / (2 * half * aspect);
  const byHeight = 0.432 / (2 * half);
  return Math.max(0.28, Math.min(byWidth, byHeight) * 0.95);
};

/**
 * How much to shrink the monitor's reticle so it holds a constant share of
 * the viewport at progress 0, whatever the aspect. Derived from the width
 * of the crosshair on the quad (0.216 world units at scale 1) against the
 * world height the camera sees from the start distance.
 */
export const monitorReticleScale = (aspect: number) => {
  const visibleHeight = 2 * startDistance(aspect) * Math.tan((FOV * Math.PI) / 360);
  return Math.max(1.2, 0.216 / (0.06 * visibleHeight));
};

const catmullRom = (
  out: Vector3,
  points: Vector3[],
  segment: number,
  u: number,
) => {
  const p0 = points[Math.max(0, segment - 1)];
  const p1 = points[segment];
  const p2 = points[Math.min(SEGMENTS, segment + 1)];
  const p3 = points[Math.min(SEGMENTS, segment + 2)];
  const u2 = u * u;
  const u3 = u2 * u;
  out.set(
    0.5 * (2 * p1.x + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
    0.5 * (2 * p1.y + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3),
    0.5 * (2 * p1.z + (-p0.z + p2.z) * u + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * u2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * u3),
  );
  return out;
};

/** Writes the camera position and look-at target for `progress` into `pos` and `target`. */
export const sampleCamera = (
  progress: number,
  aspect: number,
  pos: Vector3,
  target: Vector3,
) => {
  positions[0].z = CZ - startDistance(aspect);
  const p = Math.min(1, Math.max(0, progress));
  const segment = Math.min(SEGMENTS - 1, Math.floor(p * SEGMENTS));
  const u = smoothstep(0, 1, p * SEGMENTS - segment);
  catmullRom(pos, positions, segment, u);
  catmullRom(target, targets, segment, u);
};
