import { ROLES, ROW_A, ROW_B, type Role } from "./data";

/**
 * Where everything stands. Units are meters, the hall runs along +z, and
 * the camera always travels toward the desk. docs/worlds/fleet.md section 3.
 */

export const HALL_LENGTH = 26;
export const HALL_WIDTH = 7;
/** Row A is on the right hand side going in, row B on the left. */
export const ROW_X = 2.2;
export const FIRST_Z = 2;
export const PRESS_GAP = 2.4;
export const DESK_Z = 24.5;
export const RAIL_Y = 2.4;
export const CHUTE_Y = 0.7;

export interface Press {
  index: number;
  role: Role;
  /** +1 for row A, -1 for row B. */
  side: 1 | -1;
  x: number;
  z: number;
  /** Where on the timeline this press wakes up. */
  wakeAt: number;
  /** Seconds between thunks. */
  period: number;
  /** So seventeen machines on the same period never beat in unison. */
  phase: number;
}

/** mulberry32. Deterministic, so the floor is the same on every visit. */
export const seeded = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const WAKE_FIRST = 0.04;
const WAKE_LAST = 0.2;

const build = (): Press[] => {
  const random = seeded(1_702_017);
  const placed = ROLES.map((role, index) => {
    const inRowA = index < ROW_A.length;
    const slot = inRowA ? index : index - ROW_A.length;
    return {
      index,
      role,
      side: (inRowA ? 1 : -1) as 1 | -1,
      x: inRowA ? ROW_X : -ROW_X,
      z: FIRST_Z + slot * PRESS_GAP,
      wakeAt: 0,
      period: 0,
      phase: random(),
    };
  });

  // Busiest first, evenly spread across the waking stretch, so the last one
  // lights exactly as the stretch ends rather than after it.
  const byRuns = [...placed].sort((a, b) => b.role.runs - a.role.runs);
  const step = (WAKE_LAST - WAKE_FIRST) / (byRuns.length - 1);
  byRuns.forEach((press, i) => {
    press.wakeAt = WAKE_FIRST + i * step;
  });

  return placed;
};

export const presses: Press[] = build();

const find = (name: string): Press => {
  const press = presses.find((p) => p.role.name === name);
  if (!press) throw new Error(`fleet: no press named ${name}`);
  return press;
};

/** The four the story happens to, by name rather than by index. */
export const CEO = find("CEO");
export const FOUNDING = find("Founding Engineer");
export const REVIEWER = find("Code Reviewer");
export const QA = find("QA Engineer");

/** The plate the CEO's card stops against. */
export const PLATE_Z = (CEO.z + FOUNDING.z) / 2;

export const ROW_B_COUNT = ROW_B.length;

/**
 * The desk, in the same units. The camera arrives from -z, so "near" means
 * a smaller z and the lower right of a sheet on the desk is +x, -z.
 */
export const DESK = {
  center: [0, 0.76, DESK_Z] as const,
  /** The working surface. Everything on the desk sits at this height. */
  topY: 0.785,
  width: 1.6,
  depth: 0.8,
  tray: [-0.42, 24.32] as const,
  /** Where the sheet sits while it is signed. */
  signing: [0, 24.45] as const,
  lamp: {
    base: [-0.62, 24.86] as const,
    head: [-0.16, 1.28, 24.7] as const,
  },
  slot: {
    center: [0.52, 0.9, 24.66] as const,
    width: 0.34,
    height: 0.24,
    depth: 0.18,
  },
} as const;

/** A4, lying flat: 0.21 across the desk, 0.297 toward the camera. */
export const SHEET_W = 0.21;
export const SHEET_H = 0.297;
