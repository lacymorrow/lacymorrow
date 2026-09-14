import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { GatePose } from "./curve";
import { FIELD_CENTER, FLAGS, GOAL, LAUNCH_PAD, PADS, PALETTE, SCHOOL, TENTS, lcg } from "./track";

/**
 * Procedural geometry and instance placement for everything static in the
 * world. Every builder runs once at mount. Nothing built here ever moves.
 */

export interface Placed {
  geometry: BufferGeometry;
  matrices: Matrix4[];
  /** Per-instance colors, when the mesh cycles a palette. */
  colors?: Color[];
}

const scratch = {
  pos: new Vector3(),
  quat: new Quaternion(),
  scale: new Vector3(),
  euler: new Euler(),
};

const compose = (
  x: number,
  y: number,
  z: number,
  yaw = 0,
  sx = 1,
  sy = 1,
  sz = 1,
  pitch = 0,
  roll = 0,
): Matrix4 => {
  scratch.pos.set(x, y, z);
  scratch.euler.set(pitch, yaw, roll, "YXZ");
  scratch.quat.setFromEuler(scratch.euler);
  scratch.scale.set(sx, sy, sz);
  return new Matrix4().compose(scratch.pos, scratch.quat, scratch.scale);
};

/** Bake one flat color into a geometry's `color` attribute. */
const paint = (geometry: BufferGeometry, hex: string): BufferGeometry => {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  if (g !== geometry) geometry.dispose();
  const c = new Color(hex);
  const n = g.getAttribute("position").count;
  const colors = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new BufferAttribute(colors, 3));
  return g;
};

const translate = (g: BufferGeometry, x: number, y: number, z: number) => g.translate(x, y, z);

const merge = (parts: BufferGeometry[]): BufferGeometry => {
  const merged = mergeGeometries(parts, false);
  for (const p of parts) p.dispose();
  return merged;
};

// ---------------------------------------------------------------------------
// Gates

const GATE_INNER = 1.6;
const GATE_BAR = 0.08;

/** Four bars per gate, 32 instances of a unit box, one draw call. */
export const buildGateFrames = (gates: GatePose[]): Placed => {
  const geometry = new BoxGeometry(1, 1, 1);
  const half = GATE_INNER / 2 + GATE_BAR / 2;
  const outer = GATE_INNER + GATE_BAR * 2;
  const matrices: Matrix4[] = [];
  const local = new Matrix4();
  for (const gate of gates) {
    const world = compose(gate.position.x, gate.position.y, gate.position.z, gate.yaw);
    const bars: [number, number, number, number, number][] = [
      [0, half, 0, outer, GATE_BAR], // top
      [0, -half, 0, outer, GATE_BAR], // bottom
      [-half, 0, 0, GATE_BAR, outer], // left
      [half, 0, 0, GATE_BAR, outer], // right
    ];
    for (const [x, y, z, w, h] of bars) {
      local.copy(compose(x, y, z, 0, w, h, GATE_BAR));
      matrices.push(new Matrix4().multiplyMatrices(world, local));
    }
  }
  return { geometry, matrices };
};

/** Two legs from the bottom corners of each gate to the grass. */
export const buildGateLegs = (gates: GatePose[]): Placed => {
  const geometry = new CylinderGeometry(0.04, 0.04, 1, 6);
  geometry.translate(0, 0.5, 0);
  const matrices: Matrix4[] = [];
  const half = GATE_INNER / 2 + GATE_BAR / 2;
  for (const gate of gates) {
    const h = gate.position.y - GATE_INNER / 2;
    const cos = Math.cos(gate.yaw);
    const sin = Math.sin(gate.yaw);
    for (const side of [-half, half]) {
      // The gate's local +X, rotated by yaw about Y.
      const x = gate.position.x + side * cos;
      const z = gate.position.z - side * sin;
      matrices.push(compose(x, 0, z, 0, 1, h, 1));
    }
  }
  return { geometry, matrices };
};

/**
 * Light spill on the grass under each gate: a disc that fades from LED at the
 * center to black at the rim, drawn additive so the rim adds nothing.
 */
export const buildGateSpill = (gates: GatePose[]): Placed => {
  const geometry = new CircleGeometry(2.2, 20);
  geometry.rotateX(-Math.PI / 2);
  const led = new Color(PALETTE.led);
  const n = geometry.getAttribute("position").count;
  const colors = new Float32Array(n * 3);
  // CircleGeometry puts the center first, the rim after.
  colors[0] = led.r;
  colors[1] = led.g;
  colors[2] = led.b;
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  const matrices = gates.map((g) => compose(g.position.x, 0.02, g.position.z));
  return { geometry, matrices };
};

// ---------------------------------------------------------------------------
// Trees

const trunk = () => {
  const t = new CylinderGeometry(0.3, 0.4, 1.5, 6);
  t.translate(0, 0.75, 0);
  return paint(t, PALETTE.trunk);
};

/**
 * Each type is baked at a canonical size and scaled uniformly per instance,
 * so the trunk grows with the crown the way a real tree does.
 */

/** Cone crown, r 3.25, h 9. */
const treeA = (): BufferGeometry => {
  const crown = new ConeGeometry(3.25, 7.5, 8);
  crown.translate(0, 1.5 + 3.75, 0);
  return merge([trunk(), paint(crown, PALETTE.tree)]);
};

/** Icosahedron crown, r 3.75. */
const treeB = (): BufferGeometry => {
  const crown = new IcosahedronGeometry(3.75, 0);
  crown.translate(0, 1.5 + 3.4, 0);
  return merge([trunk(), paint(crown, PALETTE.tree)]);
};

/** Two stacked cones, h 11. */
const treeC = (): BufferGeometry => {
  const lower = new ConeGeometry(3.25, 5.5, 8);
  lower.translate(0, 1.5 + 2.75, 0);
  const upper = new ConeGeometry(2.3, 4.5, 8);
  upper.translate(0, 6.5 + 2.25, 0);
  return merge([trunk(), paint(lower, PALETTE.tree), paint(upper, PALETTE.tree)]);
};

export interface TreeRing {
  a: Placed;
  b: Placed;
  c: Placed;
}

/**
 * A ring of trees around the field with a 40 degree gap centered on the
 * school so the building reads. Seeded, so every visitor gets the same wood.
 */
export const buildTrees = (count: number): TreeRing => {
  const rnd = lcg(2017);
  const [cx, cz] = FIELD_CENTER;
  const schoolAngle = Math.atan2(SCHOOL[2] - cz, SCHOOL[0] - cx);
  const gap = (40 * Math.PI) / 180;
  const a: Matrix4[] = [];
  const b: Matrix4[] = [];
  const c: Matrix4[] = [];
  let placed = 0;
  while (placed < count) {
    const angle = rnd() * Math.PI * 2;
    let delta = angle - schoolAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    if (Math.abs(delta) < gap / 2) continue;
    const radius = 95 + rnd() * 35;
    const x = cx + Math.cos(angle) * radius;
    const z = cz + Math.sin(angle) * radius;
    const yaw = rnd() * Math.PI * 2;
    const s = 0.8 + rnd() * 0.42;
    const bucket = [a, b, c][placed % 3];
    bucket.push(compose(x, 0, z, yaw, s, s, s));
    placed++;
  }
  return {
    a: { geometry: treeA(), matrices: a },
    b: { geometry: treeB(), matrices: b },
    c: { geometry: treeC(), matrices: c },
  };
};

// ---------------------------------------------------------------------------
// The pits: 24 quads on foam pads, two tents

export const buildQuads = (): Placed => {
  const body = new BoxGeometry(0.12, 0.04, 0.16);
  body.translate(0, 0.16, 0);
  const parts: BufferGeometry[] = [body.toNonIndexed()];
  body.dispose();
  for (const angle of [Math.PI / 4, -Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4]) {
    const arm = new BoxGeometry(0.14, 0.012, 0.02);
    arm.translate(0.11, 0, 0);
    arm.rotateY(angle);
    arm.translate(0, 0.16, 0);
    parts.push(arm.toNonIndexed());
    arm.dispose();
  }
  const geometry = merge(parts);
  const matrices = PADS.map(([x, , z], i) => compose(x, 0, z, (i % 5) * 0.35 - 0.7));
  const colors = PADS.map((_, i) => new Color(PALETTE.quads[i % PALETTE.quads.length]));
  return { geometry, matrices, colors };
};

/** Four props per quad, at rest, at the arm ends. */
export const buildQuadProps = (): Placed => {
  const geometry = new CircleGeometry(0.065, 8);
  geometry.rotateX(-Math.PI / 2);
  const matrices: Matrix4[] = [];
  PADS.forEach(([x, , z], i) => {
    const yaw = (i % 5) * 0.35 - 0.7;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    for (const [ax, az] of [
      [0.13, 0.13],
      [-0.13, 0.13],
      [0.13, -0.13],
      [-0.13, -0.13],
    ]) {
      const px = x + ax * cos + az * sin;
      const pz = z - ax * sin + az * cos;
      matrices.push(compose(px, 0.175, pz));
    }
  });
  return { geometry, matrices };
};

export const buildFoamPads = (): Placed => {
  const geometry = new BoxGeometry(0.5, 0.12, 0.5);
  geometry.translate(0, 0.06, 0);
  return { geometry, matrices: PADS.map(([x, , z]) => compose(x, 0, z)) };
};

export const buildTents = (): Placed => {
  const parts: BufferGeometry[] = [];
  for (const [lx, lz] of [
    [1.5, 1.5],
    [-1.5, 1.5],
    [1.5, -1.5],
    [-1.5, -1.5],
  ]) {
    const leg = new CylinderGeometry(0.03, 0.03, 2.2, 5);
    leg.translate(lx, 1.1, lz);
    parts.push(leg.toNonIndexed());
    leg.dispose();
  }
  const roof = new ConeGeometry(2.3, 0.9, 4);
  roof.rotateY(Math.PI / 4);
  roof.translate(0, 2.2 + 0.45, 0);
  parts.push(roof.toNonIndexed());
  roof.dispose();
  const geometry = merge(parts);
  return { geometry, matrices: TENTS.map(([x, z]) => compose(x, 0, z)) };
};

// ---------------------------------------------------------------------------
// Field furniture

/** Soccer goal: three bars of a unit box, cream. */
export const buildGoal = (): Placed => {
  const geometry = new BoxGeometry(1, 1, 1);
  const [gx, , gz] = GOAL;
  const w = 7.3;
  const h = 2.4;
  const bar = 0.1;
  return {
    geometry,
    matrices: [
      compose(gx, h, gz, 0, w + bar, bar, bar),
      compose(gx - w / 2, h / 2, gz, 0, bar, h, bar),
      compose(gx + w / 2, h / 2, gz, 0, bar, h, bar),
    ],
  };
};

/** Pole plus pennant, terracotta on a dark pole, six around the apexes. */
export const buildFlags = (): Placed => {
  const pole = new CylinderGeometry(0.02, 0.02, 2, 5);
  pole.translate(0, 1, 0);
  const pennant = new BufferGeometry();
  pennant.setAttribute(
    "position",
    new Float32BufferAttribute([0, 2, 0, 0, 1.75, 0, 0.4, 1.875, 0, 0, 2, 0, 0.4, 1.875, 0, 0, 1.75, 0], 3),
  );
  pennant.setAttribute("uv", new Float32BufferAttribute(new Float32Array(12), 2));
  pennant.computeVertexNormals();
  const geometry = merge([paint(pole, PALETTE.trunk), paint(pennant, PALETTE.terracotta)]);
  const rnd = lcg(11);
  return { geometry, matrices: FLAGS.map(([x, z]) => compose(x, 0, z, rnd() * Math.PI * 2)) };
};

/** The launch pad: an ink block with a mustard top. */
export const buildLaunchPad = (): BufferGeometry => {
  const base = new BoxGeometry(1.2, 0.15, 1.2);
  base.translate(0, 0.075, 0);
  const top = new BoxGeometry(1.0, 0.02, 1.0);
  top.translate(0, 0.16, 0);
  const g = merge([paint(base, PALETTE.ink), paint(top, PALETTE.pad)]);
  const [x, y, z] = LAUNCH_PAD;
  translate(g, x, y, z);
  return g;
};

/** Dark discs under everything that touches the grass: pads, tents, goal, flags, launch pad. */
export const buildContactShadows = (): Placed => {
  const geometry = new CircleGeometry(1, 12);
  geometry.rotateX(-Math.PI / 2);
  const matrices: Matrix4[] = [];
  for (const [x, , z] of PADS) matrices.push(compose(x, 0.015, z, 0, 0.42, 1, 0.42));
  for (const [x, z] of TENTS) matrices.push(compose(x, 0.015, z, 0, 2.2, 1, 2.2));
  matrices.push(compose(GOAL[0], 0.015, GOAL[2], 0, 4.2, 1, 0.9));
  for (const [x, z] of FLAGS) matrices.push(compose(x, 0.015, z, 0, 0.35, 1, 0.35));
  matrices.push(compose(LAUNCH_PAD[0], 0.015, LAUNCH_PAD[2], 0, 0.9, 1, 0.9));
  return { geometry, matrices };
};

// ---------------------------------------------------------------------------
// Own props, camera children

export interface OwnProp {
  hub: BufferGeometry;
  blades: BufferGeometry;
  disc: BufferGeometry;
}

export const buildOwnProp = (): OwnProp => {
  const hub = new CylinderGeometry(0.012, 0.012, 0.01, 6);
  const left = new BoxGeometry(0.11, 0.006, 0.02);
  left.translate(-0.055, 0, 0);
  const right = new BoxGeometry(0.11, 0.006, 0.02);
  right.translate(0.055, 0, 0);
  const blades = merge([left.toNonIndexed(), right.toNonIndexed()]);
  const disc = new CircleGeometry(0.115, 16);
  disc.rotateX(-Math.PI / 2);
  return { hub, blades, disc };
};
