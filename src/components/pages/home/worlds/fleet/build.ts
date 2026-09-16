import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  ConeGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SphereGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { rollRadius, stackHeight, RUNNER_SHEETS } from "./data";
import {
  CHUTE_Y,
  DESK_Z,
  HALL_LENGTH,
  HALL_WIDTH,
  PRESS_GAP,
  RAIL_Y,
  ROW_X,
  SHEET_H,
  SHEET_W,
  presses,
  seeded,
  type Press,
} from "./layout";
import { CHUTE_X } from "./beats";
import { palette } from "./palette";

/**
 * Every mesh in the hall, built once at mount. One InstancedMesh per part
 * across all seventeen presses; everything static merged into single
 * geometries. Nothing in here reads progress. docs/worlds/fleet.md section 5.
 */

export interface Built {
  group: Group;
  dispose: () => void;
}

/** Where the aisle's work lights hang. One of them is over the refusal. */
export const WORK_LIGHT_Z = [4.5, 11.7, 18.5];

/** Where the moving parts sit inside a press, before the press is placed. */
export const LOCAL = {
  hinge: new Vector3(-0.34, 0.9, 0),
  flywheel: new Vector3(0.3, 0.95, 0.86),
  // On the top front corner, proud of the deck. The face would be the
  // obvious place, and it was, until the crane shot: from above, the press's
  // own top hides its face, and the ending of this world is counting these.
  lamp: new Vector3(-0.52, 0.962, 0.5),
  decal: new Vector3(-0.52, 0.903, 0.5),
  roll: new Vector3(0.24, 1.26, 0),
};

const standard = (color: string) =>
  new MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 });

/** Paper tooth. Cheap, and the only texture in the world. */
export const paperTexture = (): CanvasTexture => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(size, size);
  const random = seeded(90210);
  for (let i = 0; i < size * size; i++) {
    const v = 128 + (random() - 0.5) * 70;
    image.data[i * 4] = v;
    image.data[i * 4 + 1] = v;
    image.data[i * 4 + 2] = v;
    image.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

/** Press body, feed table, side frames and lamp collar, merged into one. */
const pressBody = (): BufferGeometry => {
  const base = new BoxGeometry(1.2, 0.9, 1.6);
  base.translate(0, 0.45, 0);
  const table = new BoxGeometry(0.9, 0.06, 1.0);
  table.rotateZ(-0.34);
  table.translate(-0.05, 1.12, 0);
  const left = new BoxGeometry(0.12, 1.1, 0.12);
  left.translate(0.1, 1.0, -0.72);
  const right = left.clone();
  right.translate(0, 0, 1.44);
  const collar = new CylinderGeometry(0.05, 0.06, 0.06, 10);
  collar.translate(LOCAL.lamp.x, 0.9, LOCAL.lamp.z);
  const merged = mergeGeometries([base, table, left, right, collar], false)!;
  [base, table, left, right, collar].forEach((g) => g.dispose());
  return merged;
};

const composePress = (press: Press, out: Matrix4): Matrix4 => {
  out.makeRotationY(press.side === 1 ? 0 : Math.PI);
  out.setPosition(press.x, 0, press.z);
  return out;
};

export interface Presses extends Built {
  /** Per press, 0 is open and 1 is closed. */
  setPlaten: (index: number, closed: number) => void;
  setFlywheel: (index: number, angle: number) => void;
  setLamp: (index: number, color: Color) => void;
  flush: () => void;
}

export const createPresses = (quality: "low" | "high"): Presses => {
  const count = presses.length;
  const base = presses.map((p) => composePress(p, new Matrix4()).clone());
  const scratch = new Matrix4();
  const local = new Matrix4();

  const bodyGeometry = pressBody();
  const bodies = new InstancedMesh(bodyGeometry, standard(palette.body), count);

  // The hinge is baked into the geometry, so the instance matrix is a plain
  // rotation about the hinge line and the platen never drifts off it.
  const platenGeometry = new BoxGeometry(0.06, 0.46, 0.8);
  platenGeometry.translate(0, 0.4, 0);
  const platens = new InstancedMesh(platenGeometry, standard(palette.platen), count);

  const wheelGeometry = new CylinderGeometry(0.42, 0.42, 0.06, quality === "high" ? 20 : 12);
  wheelGeometry.rotateX(Math.PI / 2);
  const wheels = new InstancedMesh(wheelGeometry, standard(palette.steel), count);

  const hubGeometry = new CylinderGeometry(0.075, 0.075, 0.09, 8);
  hubGeometry.rotateX(Math.PI / 2);
  const hubs = new InstancedMesh(
    hubGeometry,
    new MeshStandardMaterial({ color: palette.brass, roughness: 0.6, metalness: 0.4 }),
    count,
  );

  // One cylinder, scaled per press: the roll is how much this agent has read.
  const rollGeometry = new CylinderGeometry(1, 1, 0.9, 12);
  rollGeometry.rotateX(Math.PI / 2);
  const rolls = new InstancedMesh(rollGeometry, standard(palette.paper), count);

  const stackGeometry = new BoxGeometry(0.42, 1, 0.3);
  stackGeometry.translate(0, 0.5, 0);
  const stacks = new InstancedMesh(stackGeometry, standard(palette.paper), count);

  const lampGeometry = new SphereGeometry(0.062, 10, 8);
  const lamps = new InstancedMesh(lampGeometry, new MeshBasicMaterial({ toneMapped: false }), count);

  // A flat disc on the press face fakes the pool of light a real bulb would
  // throw. Seventeen point lights would cost more than the rest of the hall.
  const decalGeometry = new CircleGeometry(0.26, 18);
  decalGeometry.rotateX(-Math.PI / 2);
  const decals = new InstancedMesh(
    decalGeometry,
    new MeshBasicMaterial({ transparent: true, opacity: 0.32, toneMapped: false, depthWrite: false }),
    count,
  );

  presses.forEach((press, i) => {
    bodies.setMatrixAt(i, base[i]!);

    local.makeTranslation(LOCAL.flywheel.x, LOCAL.flywheel.y, LOCAL.flywheel.z);
    wheels.setMatrixAt(i, scratch.multiplyMatrices(base[i]!, local));
    hubs.setMatrixAt(i, scratch.multiplyMatrices(base[i]!, local));

    const r = rollRadius(press.role.tokens);
    local.makeScale(r, r, 1);
    local.setPosition(LOCAL.roll.x, LOCAL.roll.y, LOCAL.roll.z);
    rolls.setMatrixAt(i, scratch.multiplyMatrices(base[i]!, local));

    const h = Math.max(0.01, stackHeight(press.role.runs));
    local.makeScale(1, h, 1);
    local.setPosition(-0.15, 0, 0.98);
    stacks.setMatrixAt(i, scratch.multiplyMatrices(base[i]!, local));

    local.makeTranslation(LOCAL.lamp.x, LOCAL.lamp.y, LOCAL.lamp.z);
    lamps.setMatrixAt(i, scratch.multiplyMatrices(base[i]!, local));
    local.makeTranslation(LOCAL.decal.x, LOCAL.decal.y, LOCAL.decal.z);
    decals.setMatrixAt(i, scratch.multiplyMatrices(base[i]!, local));

    const waiting = new Color(palette.waiting);
    lamps.setColorAt(i, waiting);
    decals.setColorAt(i, waiting);
  });

  [bodies, wheels, hubs, rolls, stacks, lamps, decals].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    m.frustumCulled = false;
  });
  lamps.instanceColor!.needsUpdate = true;
  decals.instanceColor!.needsUpdate = true;

  const group = new Group();
  group.add(bodies, platens, wheels, hubs, rolls, stacks, lamps, decals);

  let matricesDirty = true;
  let colorsDirty = false;

  return {
    group,
    setPlaten: (index, closed) => {
      // Open leans out over the bed, closed stands up. 38 degrees is as far
      // as it can go without reaching past the machine's own footprint.
      local.makeRotationZ((1 - closed) * 0.66);
      local.setPosition(LOCAL.hinge.x, LOCAL.hinge.y, LOCAL.hinge.z);
      platens.setMatrixAt(index, scratch.multiplyMatrices(base[index]!, local));
      matricesDirty = true;
    },
    setFlywheel: (index, angle) => {
      local.makeRotationZ(angle);
      local.setPosition(LOCAL.flywheel.x, LOCAL.flywheel.y, LOCAL.flywheel.z);
      wheels.setMatrixAt(index, scratch.multiplyMatrices(base[index]!, local));
      matricesDirty = true;
    },
    setLamp: (index, color) => {
      lamps.setColorAt(index, color);
      decals.setColorAt(index, color);
      colorsDirty = true;
    },
    flush: () => {
      if (matricesDirty) {
        platens.instanceMatrix.needsUpdate = true;
        wheels.instanceMatrix.needsUpdate = true;
        matricesDirty = false;
      }
      if (colorsDirty) {
        lamps.instanceColor!.needsUpdate = true;
        decals.instanceColor!.needsUpdate = true;
        colorsDirty = false;
      }
    },
    dispose: () => {
      [bodies, platens, wheels, hubs, rolls, stacks, lamps, decals].forEach((m) => {
        m.geometry.dispose();
        (m.material as MeshStandardMaterial).dispose();
        m.dispose();
      });
    },
  };
};

/**
 * Rails, plates, return bins, chutes, floor and walls. All static, all
 * merged: one draw call for the room the presses stand in.
 */
export const createHall = (): Built => {
  const steel: BufferGeometry[] = [];

  const plates: BufferGeometry[] = [];

  for (const press of presses) {
    const x = press.side * (ROW_X - 0.9);
    const rail = new BoxGeometry(0.04, 0.04, 1.8);
    rail.translate(x, RAIL_Y, press.z);
    steel.push(rail);

    // A plate between every pair of neighbouring rails. Cards never cross one.
    const plate = new BoxGeometry(0.52, 0.62, 0.025);
    plate.translate(x, RAIL_Y - 0.16, press.z + PRESS_GAP / 2);
    plates.push(plate);

    // Where a refused card lands.
    const bin = new BoxGeometry(0.42, 0.14, 0.42);
    bin.translate(x, 0.07, press.z + PRESS_GAP / 2);
    steel.push(bin);
  }

  // One shared chute per row, running the length of it toward the desk.
  for (const side of [1, -1]) {
    const length = DESK_Z - 1;
    const bottom = new BoxGeometry(0.34, 0.02, length);
    bottom.translate(side * CHUTE_X, CHUTE_Y, length / 2 + 0.5);
    const near = new BoxGeometry(0.02, 0.09, length);
    near.translate(side * (CHUTE_X - 0.17), CHUTE_Y + 0.04, length / 2 + 0.5);
    const far = near.clone();
    far.translate(side * 0.34, 0, 0);
    steel.push(bottom, near, far);
  }

  const merged = mergeGeometries(steel, false)!;
  steel.forEach((g) => g.dispose());
  const fixtures = new Mesh(merged, standard(palette.steel));
  fixtures.frustumCulled = false;

  const plateMerged = mergeGeometries(plates, false)!;
  plates.forEach((g) => g.dispose());
  // Lighter than the rails on purpose: a card stopping against something
  // nobody can see is not a boundary, it is a bug.
  const plateMesh = new Mesh(plateMerged, standard("#5d646f"));
  plateMesh.frustumCulled = false;

  const floorGeometry = new PlaneGeometry(HALL_WIDTH, HALL_LENGTH + 4);
  floorGeometry.rotateX(-Math.PI / 2);
  floorGeometry.translate(0, 0, HALL_LENGTH / 2 - 1);
  const floor = new Mesh(floorGeometry, standard(palette.floor));

  // One wall, at the end the camera starts from. The far end is fog.
  const wallGeometry = new PlaneGeometry(HALL_WIDTH, 4);
  wallGeometry.translate(0, 2, -1.2);
  const wall = new Mesh(wallGeometry, standard(palette.background));

  // Shades over the aisle. A press room has light where the work is, and
  // this world's work happens on the rails at 2.4 m, which the deck lamps
  // never reach.
  const shadeGeometry = new ConeGeometry(0.3, 0.22, 12, 1, true);
  const shades: BufferGeometry[] = [];
  const discs: BufferGeometry[] = [];
  for (const z of WORK_LIGHT_Z) {
    const shade = shadeGeometry.clone();
    shade.translate(0, 3.15, z);
    shades.push(shade);
    const disc = new CircleGeometry(0.19, 14);
    disc.rotateX(Math.PI / 2);
    disc.translate(0, 3.045, z);
    discs.push(disc);
  }
  shadeGeometry.dispose();
  const shadeMerged = mergeGeometries(shades, false)!;
  shades.forEach((g) => g.dispose());
  const shadeMesh = new Mesh(shadeMerged, standard(palette.steel));
  const discMerged = mergeGeometries(discs, false)!;
  discs.forEach((g) => g.dispose());
  const discMesh = new Mesh(
    discMerged,
    new MeshBasicMaterial({ color: palette.overhead, toneMapped: false }),
  );
  shadeMesh.frustumCulled = false;
  discMesh.frustumCulled = false;

  const group = new Group();
  group.add(fixtures, plateMesh, floor, wall, shadeMesh, discMesh);

  return {
    group,
    dispose: () => {
      [fixtures, plateMesh, floor, wall, shadeMesh, discMesh].forEach((m) => {
        m.geometry.dispose();
        (m.material as MeshStandardMaterial).dispose();
      });
    },
  };
};

export interface Paper extends Built {
  /** Background sheets drifting down both chutes. */
  advance: (t: number) => void;
}

/**
 * The paper in the room: the runner down the aisle (one sheet per million
 * tokens read), the job cards hanging over the presses, and the sheets
 * always moving on the chutes.
 */
export const createPaper = (quality: "low" | "high", tooth: CanvasTexture | null): Paper => {
  const high = quality === "high";
  const sheetGeometry = new PlaneGeometry(SHEET_W, SHEET_H);
  sheetGeometry.rotateX(-Math.PI / 2);

  const paperMaterial = new MeshLambertMaterial({
    color: palette.paper,
    side: DoubleSide,
    ...(tooth ? { bumpMap: tooth, bumpScale: 0.06 } : {}),
  });

  // The runner. Every sheet is a million tokens, so the count is the claim
  // and anyone can read it in the source.
  const runnerCount = high ? RUNNER_SHEETS : Math.round(RUNNER_SHEETS / 4);
  const runner = new InstancedMesh(sheetGeometry, paperMaterial, runnerCount);
  const random = seeded(4242);
  const matrix = new Matrix4();
  const lanes = 6;
  const perLane = Math.ceil(runnerCount / lanes);
  const runLength = DESK_Z - 2.5;
  for (let i = 0; i < runnerCount; i++) {
    const lane = i % lanes;
    const along = Math.floor(i / lanes) / perLane;
    matrix.makeRotationY((random() - 0.5) * 0.06);
    matrix.setPosition(
      (lane - (lanes - 1) / 2) * 0.26 + (random() - 0.5) * 0.05,
      0.002 + (i % 3) * 0.0006,
      1.2 + along * runLength + (random() - 0.5) * 0.04,
    );
    runner.setMatrixAt(i, matrix);
  }
  runner.instanceMatrix.needsUpdate = true;
  runner.frustumCulled = false;

  // Job cards on the rails. Decoration: the essay gives no queue lengths.
  const cardGeometry = new PlaneGeometry(0.12, 0.18);
  const cards: { x: number; y: number; z: number }[] = [];
  for (const press of presses) {
    const n = 3 + Math.floor(random() * (high ? 6 : 3));
    for (let i = 0; i < n; i++) {
      cards.push({
        x: press.side * (ROW_X - 0.9),
        y: RAIL_Y - 0.11,
        z: press.z - 0.8 + (i + 0.5) * (1.6 / n),
      });
    }
  }
  const cardMesh = new InstancedMesh(
    cardGeometry,
    new MeshLambertMaterial({ color: palette.card, side: DoubleSide }),
    cards.length,
  );
  cards.forEach((c, i) => {
    matrix.makeRotationY(Math.PI / 2 + (random() - 0.5) * 0.12);
    matrix.setPosition(c.x, c.y, c.z);
    cardMesh.setMatrixAt(i, matrix);
  });
  cardMesh.instanceMatrix.needsUpdate = true;
  cardMesh.frustumCulled = false;

  // Sheets moving on the chutes, so the floor is busy in the crane shot.
  const chuteCount = high ? 60 : 30;
  const chuteSheets = new InstancedMesh(sheetGeometry, paperMaterial, chuteCount);
  chuteSheets.frustumCulled = false;
  const chuteLength = DESK_Z - 1.5;
  const speeds = Array.from({ length: chuteCount }, () => 0.35 + random() * 0.5);
  const offsets = Array.from({ length: chuteCount }, () => random() * chuteLength);

  const group = new Group();
  group.add(runner, cardMesh, chuteSheets);

  return {
    group,
    advance: (t) => {
      for (let i = 0; i < chuteCount; i++) {
        const side = i % 2 === 0 ? 1 : -1;
        const z = 1 + ((offsets[i]! + t * speeds[i]!) % chuteLength);
        matrix.makeRotationY(side === 1 ? 0.02 : -0.02);
        matrix.setPosition(side * CHUTE_X, CHUTE_Y + 0.025, z);
        chuteSheets.setMatrixAt(i, matrix);
      }
      chuteSheets.instanceMatrix.needsUpdate = true;
    },
    dispose: () => {
      sheetGeometry.dispose();
      cardGeometry.dispose();
      paperMaterial.dispose();
      (cardMesh.material as MeshLambertMaterial).dispose();
      runner.dispose();
      cardMesh.dispose();
      chuteSheets.dispose();
    },
  };
};
