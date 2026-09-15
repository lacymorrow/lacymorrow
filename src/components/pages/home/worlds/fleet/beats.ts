import { Vector3 } from "three";

import { smoothstep } from "./camera";
import { CEO, CHUTE_Y, DESK, FOUNDING, PLATE_Z, QA, RAIL_Y, REVIEWER, ROW_X } from "./layout";

/**
 * Every hero object is a pure function of progress, so the story reads the
 * same at any point on the timeline and needs no state to replay.
 * docs/worlds/fleet.md section 3.
 */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const between = (a: number, b: number, p: number) => clamp01((p - a) / (b - a));

/**
 * The chute runs just clear of the press faces, which start 0.6 m in from
 * the middle of each press, so a sheet on it never disappears into one.
 */
export const CHUTE_X = ROW_X - 0.78;

// --------------------------------------------------------------------------
// 0.20 to 0.40: a job card drops, a sheet comes out, three presses touch it.

const CARD_DROP = [0.215, 0.235] as const;

/** Height of the card that falls into the Founding Engineer's tray. */
export const heroCardY = (p: number): number => {
  const t = between(CARD_DROP[0], CARD_DROP[1], p);
  // Falling, not floating: fast at the end.
  return RAIL_Y - (RAIL_Y - 1.02) * t * t;
};

export const heroCardVisible = (p: number): boolean => p > 0.19 && p < 0.26;

/**
 * Where the sheet is along row A's chute. It stops at the two presses that
 * pull it in, which is why this is a table and not a straight ramp. The last
 * leg runs past 0.40 because the camera has already turned away by then:
 * sending it 12 m in the 0.03 the beat sheet leaves would be a blur, and
 * nobody is watching. By the time the lamp comes on it is in the tray.
 */
const SHEET_PATH: [number, number][] = [
  [0.26, FOUNDING.z],
  [0.3, REVIEWER.z],
  [0.32, REVIEWER.z],
  [0.35, QA.z],
  [0.37, QA.z],
  [0.46, DESK.tray[1]],
];

/** A press holding the sheet lifts it a little, so the pull reads as a pull. */
const lift = (p: number): number => {
  const pull = (a: number, b: number) => Math.sin(between(a, b, p) * Math.PI) * 0.06;
  return pull(0.3, 0.32) + pull(0.35, 0.37);
};

export const heroSheetVisible = (p: number): boolean => p >= 0.255;

export const heroSheet = (p: number, out: Vector3): Vector3 => {
  const path = SHEET_PATH;
  let z = path[0]![1];
  if (p >= path[path.length - 1]![0]) {
    z = path[path.length - 1]![1];
  } else {
    for (let i = 1; i < path.length; i++) {
      const [t1, z1] = path[i]!;
      if (p <= t1) {
        const [t0, z0] = path[i - 1]!;
        z = z0 + (z1 - z0) * smoothstep(t0, t1, p);
        break;
      }
    }
  }
  // The last leg lands it in the in-tray, so it has to cross the aisle and
  // drop onto the desk as it arrives.
  const landing = smoothstep(0.42, 0.46, p);
  const x = CHUTE_X + (DESK.tray[0] - CHUTE_X) * landing;
  const y = CHUTE_Y + (DESK.topY + 0.03 - CHUTE_Y) * landing;
  return out.set(x, y + lift(p), z);
};

/** The presses that cycle because the sheet arrived, not because of a timer. */
export const forcedCycle = (index: number, p: number): number => {
  if (index === FOUNDING.index) return Math.sin(between(0.235, 0.26, p) * Math.PI);
  if (index === REVIEWER.index) return Math.sin(between(0.3, 0.32, p) * Math.PI);
  if (index === QA.index) return Math.sin(between(0.35, 0.37, p) * Math.PI);
  return 0;
};

// --------------------------------------------------------------------------
// 0.40 to 0.60: a card from one queue reaches for another and is stopped.

const REACH = [0.44, 0.58] as const;
const TIP = [0.6, 0.66] as const;

export const ceoCardVisible = (p: number): boolean => p > 0.42 && p < 0.7;

/**
 * The CEO's card slides along its own rail toward the Founding Engineer's,
 * stops dead against the plate, then tips off into the return bin. It never
 * crosses. That is the whole point of the beat.
 */
export const ceoCard = (p: number, out: Vector3): Vector3 => {
  const reach = smoothstep(REACH[0], REACH[1], p);
  const z = CEO.z + 0.45 + (PLATE_Z - 0.09 - (CEO.z + 0.45)) * reach;
  const fall = between(TIP[0], TIP[1], p);
  const y = RAIL_Y - 0.12 - (RAIL_Y - 0.12 - 0.16) * fall * fall;
  const x = ROW_X - 0.9 + fall * 0.12;
  return out.set(x, y, z);
};

export const ceoCardTilt = (p: number): number => between(TIP[0], TIP[1], p) * 1.9;

/** How red the Founding Engineer's lamp is. One flick, 400 ms of a 26 s run. */
export const refusal = (p: number): number =>
  Math.min(smoothstep(0.6, 0.603, p), 1 - smoothstep(0.613, 0.617, p));

// --------------------------------------------------------------------------
// 0.60 to 1.00: the desk.

/** The one warm light in the world, and the only thing that casts a shadow. */
export const deskLamp = (p: number): number => smoothstep(0.7, 0.72, p);

/** The top sheet slides out of the tray and under the lamp to be signed. */
export const signingSheet = (p: number, out: Vector3): Vector3 => {
  const slide = smoothstep(0.74, 0.78, p);
  const post = smoothstep(0.88, 0.92, p);
  const [tx, tz] = DESK.tray;
  const [sx, sz] = DESK.signing;
  const x = tx + (sx - tx) * slide + (DESK.slot.center[0] - sx) * post;
  const z = tz + (sz - tz) * slide + (DESK.slot.center[2] - 0.04 - sz) * post;
  const y = DESK.topY + 0.004 + post * (DESK.slot.center[1] - DESK.topY - 0.03);
  return out.set(x, y, z);
};

/** How much of the signature has been drawn. */
export const strokeDrawn = (p: number): number => smoothstep(0.78, 0.84, p);

export const penVisible = (p: number): boolean => p > 0.765 && p < 0.865;

/** Open for the signed sheet, and for nothing else. */
export const flapAngle = (p: number): number =>
  (Math.min(smoothstep(0.86, 0.875, p), 1 - smoothstep(0.935, 0.95, p)) * Math.PI) / 2.6;
