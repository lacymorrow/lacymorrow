import {
  BoxGeometry,
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  SpotLight,
  TubeGeometry,
  Vector3,
} from "three";

import { DESK, DESK_Z, SHEET_H, SHEET_W } from "./layout";
import { palette } from "./palette";

/**
 * The one desk, the one lamp, and the pen. Everything the machines do is
 * only a draft until something happens here. docs/worlds/fleet.md section 3.
 */

export interface Desk {
  group: Group;
  light: SpotLight;
  /** The sheet being signed, with the signature and the pen riding on it. */
  sheet: Group;
  stroke: Mesh;
  pen: Object3D;
  flap: Object3D;
  /** How many index triples the signature has in total. */
  strokeIndexCount: number;
  /** Local point on the stroke, for the pen to sit at. */
  strokeAt: (t: number, out: Vector3) => Vector3;
  dispose: () => void;
}

/**
 * A generic flourish, not Lacy's real signature. A real one on a public page
 * is a thing anybody can trace.
 */
const signature = (): Vector3[] => {
  const points: Vector3[] = [];
  for (let i = 0; i < 48; i++) {
    const u = i / 47;
    points.push(
      new Vector3(
        0.004 + u * 0.086,
        0.0022,
        -0.094 + Math.sin(u * Math.PI * 3.1) * 0.015 + Math.sin(u * 7.9) * 0.004,
      ),
    );
  }
  return points;
};

export const createDesk = (quality: "low" | "high"): Desk => {
  const wood = new MeshStandardMaterial({ color: palette.body, roughness: 0.92, metalness: 0 });
  const steel = new MeshStandardMaterial({ color: palette.steel, roughness: 0.92, metalness: 0 });
  const brass = new MeshStandardMaterial({ color: palette.brass, roughness: 0.6, metalness: 0.4 });
  const paper = new MeshLambertMaterial({ color: palette.paper, side: DoubleSide });
  const ink = new MeshStandardMaterial({ color: palette.ink, roughness: 0.6, metalness: 0 });

  const group = new Group();
  const owned: { dispose: () => void }[] = [wood, steel, brass, paper, ink];
  const add = (mesh: Mesh, shadow = true) => {
    if (shadow && quality === "high") mesh.castShadow = true;
    owned.push(mesh.geometry);
    group.add(mesh);
    return mesh;
  };

  const top = add(new Mesh(new BoxGeometry(DESK.width, 0.05, DESK.depth), wood), false);
  top.position.set(0, DESK.topY - 0.025, DESK_Z);
  if (quality === "high") top.receiveShadow = true;

  for (const dx of [-0.72, 0.72]) {
    for (const dz of [-0.34, 0.34]) {
      const leg = add(new Mesh(new BoxGeometry(0.06, 0.76, 0.06), steel), false);
      leg.position.set(dx, 0.38, DESK_Z + dz);
    }
  }

  // The in-tray, with the short pile the presses have already filled.
  const trayFloor = add(new Mesh(new BoxGeometry(0.34, 0.012, 0.36), steel), false);
  trayFloor.position.set(DESK.tray[0], DESK.topY + 0.006, DESK.tray[1]);
  for (const dx of [-0.17, 0.17]) {
    const wall = add(new Mesh(new BoxGeometry(0.012, 0.05, 0.36), steel), false);
    wall.position.set(DESK.tray[0] + dx, DESK.topY + 0.025, DESK.tray[1]);
  }
  const pile = add(new Mesh(new BoxGeometry(SHEET_W, 0.022, SHEET_H), paper));
  pile.position.set(DESK.tray[0], DESK.topY + 0.023, DESK.tray[1]);

  // The mail slot. The flap opens for the signed sheet and for nothing else.
  const slotBody = add(
    new Mesh(new BoxGeometry(DESK.slot.width, DESK.slot.height, DESK.slot.depth), steel),
  );
  slotBody.position.set(
    DESK.slot.center[0],
    DESK.topY + DESK.slot.height / 2,
    DESK.slot.center[2],
  );
  const flap = new Group();
  flap.position.set(
    DESK.slot.center[0],
    DESK.topY + DESK.slot.height - 0.02,
    DESK.slot.center[2] - DESK.slot.depth / 2 - 0.004,
  );
  const flapGeometry = new PlaneGeometry(DESK.slot.width - 0.04, DESK.slot.height - 0.06);
  flapGeometry.translate(0, -(DESK.slot.height - 0.06) / 2, 0);
  const flapMesh = new Mesh(flapGeometry, steel);
  owned.push(flapGeometry);
  flap.add(flapMesh);
  group.add(flap);
  const mouthGeometry = new PlaneGeometry(DESK.slot.width - 0.05, DESK.slot.height - 0.07);
  mouthGeometry.translate(0, 0, 0);
  const mouth = new Mesh(mouthGeometry, new MeshLambertMaterial({ color: "#05050a" }));
  mouth.position.set(
    DESK.slot.center[0],
    DESK.topY + DESK.slot.height / 2 + 0.005,
    DESK.slot.center[2] - DESK.slot.depth / 2 - 0.001,
  );
  owned.push(mouthGeometry, mouth.material as MeshLambertMaterial);
  group.add(mouth);

  // The lamp: base, a bent arm, a cone shade. The light itself is separate.
  const base = add(new Mesh(new CylinderGeometry(0.07, 0.08, 0.02, 14), steel), false);
  base.position.set(DESK.lamp.base[0], DESK.topY + 0.01, DESK.lamp.base[1]);
  const armCurve = new CatmullRomCurve3([
    new Vector3(DESK.lamp.base[0], DESK.topY, DESK.lamp.base[1]),
    new Vector3(DESK.lamp.base[0] + 0.04, DESK.topY + 0.42, DESK.lamp.base[1] - 0.02),
    new Vector3(DESK.lamp.head[0] + 0.06, DESK.lamp.head[1] + 0.07, DESK.lamp.head[2] + 0.06),
    new Vector3(DESK.lamp.head[0], DESK.lamp.head[1], DESK.lamp.head[2]),
  ]);
  add(new Mesh(new TubeGeometry(armCurve, 18, 0.008, 5, false), steel), false);
  const shade = add(new Mesh(new ConeGeometry(0.1, 0.13, 16, 1, true), steel), false);
  shade.position.set(DESK.lamp.head[0], DESK.lamp.head[1] - 0.02, DESK.lamp.head[2]);
  shade.rotation.x = -0.5;
  const collar = add(new Mesh(new CylinderGeometry(0.022, 0.022, 0.03, 10), brass), false);
  collar.position.set(DESK.lamp.head[0], DESK.lamp.head[1] + 0.05, DESK.lamp.head[2]);

  const light = new SpotLight(palette.deskLamp, 0, 6, 0.6, 0.6, 2);
  light.position.set(DESK.lamp.head[0], DESK.lamp.head[1] - 0.04, DESK.lamp.head[2]);
  light.target.position.set(DESK.signing[0], DESK.topY, DESK.signing[1]);
  if (quality === "high") {
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 3;
  }
  group.add(light, light.target);

  // The sheet that gets signed, with the signature and the pen as children,
  // so when it slides into the slot it takes the signature with it.
  const sheet = new Group();
  const sheetGeometry = new PlaneGeometry(SHEET_W, SHEET_H);
  sheetGeometry.rotateX(-Math.PI / 2);
  const sheetMesh = new Mesh(sheetGeometry, paper);
  if (quality === "high") sheetMesh.castShadow = true;
  owned.push(sheetGeometry);
  sheet.add(sheetMesh);

  const points = signature();
  const curve = new CatmullRomCurve3(points);
  const strokeGeometry = new TubeGeometry(curve, 47, 0.002, 3, false);
  owned.push(strokeGeometry);
  const stroke = new Mesh(strokeGeometry, ink);
  sheet.add(stroke);

  const penGeometry = new CylinderGeometry(0.005, 0.0032, 0.105, 8);
  penGeometry.translate(0, 0.052, 0);
  owned.push(penGeometry);
  const pen = new Mesh(penGeometry, ink);
  pen.rotation.set(0.62, 0, 0.3);
  if (quality === "high") pen.castShadow = true;
  sheet.add(pen);
  group.add(sheet);

  const strokeIndexCount = strokeGeometry.index!.count;
  const scratch = new Vector3();

  return {
    group,
    light,
    sheet,
    stroke,
    pen,
    flap,
    strokeIndexCount,
    strokeAt: (t, out) => out.copy(curve.getPoint(Math.min(0.999, Math.max(0, t)), scratch)),
    dispose: () => {
      owned.forEach((o) => o.dispose());
      light.dispose();
    },
  };
};
