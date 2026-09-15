import { Vector3 } from "three";

/**
 * One trip down the hall: wake up at the door, follow a sheet along the
 * chute, turn to watch a card refuse to cross a plate, walk to the desk for
 * the signature, then crane up so all seventeen are in one frame.
 * docs/worlds/fleet.md section 3.
 */

export const FOV = 46;

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

interface Key {
  at: number;
  pos: [number, number, number];
  look: [number, number, number];
}

/**
 * Keyframes with a smoothstep inside every segment rather than one spline
 * through all of them. A spline overshoots on the hard turn at 0.4, and an
 * overshoot here puts the camera inside a press.
 */
const KEYS: Key[] = [
  // At rest by the door, looking at the first press in row A.
  { at: 0.0, pos: [0, 0.9, 0], look: [2.2, 1.05, 2.0] },
  // Risen, turned down the aisle, watching the floor wake up.
  { at: 0.2, pos: [0, 1.7, 3.0], look: [0.3, 1.3, 16.0] },
  // Across the aisle from row A, so the presses that handle the sheet are
  // in profile and the sheet itself is between the camera and them.
  { at: 0.26, pos: [-0.85, 1.45, 5.6], look: [1.42, 1.05, 6.8] },
  { at: 0.4, pos: [-0.85, 1.45, 12.2], look: [1.42, 1.0, 12.0] },
  // Down the row, not across it. The plate is thin along z so it can stop a
  // card travelling the rail; from the aisle that makes it a 2 cm sliver,
  // and an open platen sits right on the lens. From here the rail recedes,
  // the card slides away from the camera, and the plate stands across it.
  // Forty degrees off the row: the card hangs facing across the aisle and
  // the plate stands across the row, so neither is face-on from a square
  // angle and both are readable from this one.
  { at: 0.5, pos: [-0.2, 2.36, 3.15], look: [1.45, 2.2, 5.86] },
  { at: 0.6, pos: [-0.1, 2.33, 3.45], look: [1.45, 2.18, 5.92] },
  // The length of the hall to the desk.
  { at: 0.7, pos: [0, 1.35, 14.0], look: [0, 1.15, 24.4] },
  // Aimed left of the desk and below it, which puts the lamp pool in the
  // right half of the frame and above the overlay copy.
  { at: 0.8, pos: [-0.5, 1.62, 23.0], look: [-0.34, 0.7, 24.55] },
  // Lifting while the signed sheet goes in the slot, not after.
  { at: 0.88, pos: [-0.5, 2.25, 22.8], look: [-0.34, 0.74, 24.5] },
  // The hall runs bottom right to top left, so the copy in the bottom left
  // sits over dark floor instead of over two of the seventeen.
  { at: 0.97, pos: [2.5, 7.3, 27.3], look: [-1.15, 0.8, 13.6] },
  { at: 1.0, pos: [2.6, 7.4, 27.6], look: [-1.2, 0.8, 13.4] },
];

const lerp3 = (a: [number, number, number], b: [number, number, number], t: number, out: Vector3) =>
  out.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);

/** The window where the camera holds the hero sheet rather than a fixed point. */
const TRACK_IN = 0.24;
const TRACK_OUT = 0.41;

export const sampleCamera = (
  p: number,
  sheet: Vector3,
  pos: Vector3,
  target: Vector3,
): void => {
  let i = 1;
  while (i < KEYS.length - 1 && p > KEYS[i]!.at) i++;
  const a = KEYS[i - 1]!;
  const b = KEYS[i]!;
  const t = smoothstep(a.at, b.at, p);
  lerp3(a.pos, b.pos, t, pos);
  lerp3(a.look, b.look, t, target);

  // Between the two beats the sheet is the subject, so the aim follows it
  // and blends back out before the camera turns to the plate.
  const hold = Math.min(smoothstep(TRACK_IN, TRACK_IN + 0.03, p), 1 - smoothstep(TRACK_OUT - 0.04, TRACK_OUT, p));
  if (hold > 0) target.lerp(sheet, hold);
};
