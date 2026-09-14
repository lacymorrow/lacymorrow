import {
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { palette } from "./palette";

/**
 * The workshop props: floor, bench, monitor body, lamp and the cover rack.
 * Every piece is a primitive, painted with a vertex color and merged into
 * one flat-shaded Lambert mesh, so the whole workshop is one draw call.
 * Recipes in docs/worlds/workshop.md section 5.
 */

export const LAMP_SHADE = new Vector3(-0.72, 1.42, -0.42);
export const LAMP_TARGET = new Vector3(0, 0.78, -0.15);

/**
 * The cover rack's placement, shared with the cover wall so they line up.
 * World -X is screen right (the camera looks down +Z), so the rack stands
 * in the right of the crane frames, clear of the overlay copy. It sits at
 * about 70 degrees off +Z, outside the field's 110 degree fan, so no screen
 * ever pokes through it.
 */
export const RACK_POSITION = new Vector3(-4.8, 1, 2.4);
export const RACK_YAW = (147 * Math.PI) / 180;
export const RACK_SIZE: [number, number] = [1.62, 1.86];
export const RACK_DEPTH = 0.06;

const paint = (geometry: BufferGeometry, hex: string) => {
  const c = new Color(hex);
  const n = geometry.getAttribute("position").count;
  const colors = new Float32Array(n * 3);
  for (let i = 0; i < n; i += 1) {
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  return geometry;
};

const at = (geometry: BufferGeometry, x: number, y: number, z: number) =>
  geometry.translate(x, y, z);

const UP = new Vector3(0, 1, 0);

/** A thin rod from `from` to `to`. */
const rod = (from: Vector3, to: Vector3, radius: number, hex: string) => {
  const dir = to.clone().sub(from);
  const length = dir.length();
  const geometry = new CylinderGeometry(radius, radius, length, 6);
  const q = new Quaternion().setFromUnitVectors(UP, dir.normalize());
  geometry.applyQuaternion(q);
  const mid = from.clone().add(to).multiplyScalar(0.5);
  return paint(at(geometry, mid.x, mid.y, mid.z), hex);
};

export const createProps = () => {
  const pieces: BufferGeometry[] = [];

  // Floor. Only the lamp pool ever shows on it.
  pieces.push(paint(new PlaneGeometry(40, 40).rotateX(-Math.PI / 2), palette.background));

  // Bench top and two trestles.
  pieces.push(paint(at(new BoxGeometry(2.4, 0.06, 0.9), 0, 0.72, -0.2), palette.benchTop));
  for (const x of [-1.05, 1.05]) {
    pieces.push(paint(at(new BoxGeometry(0.08, 0.66, 0.7), x, 0.36, -0.2), palette.frame));
  }

  // Monitor body, stand and base. The screen quad is instance 0 of the field.
  pieces.push(paint(at(new BoxGeometry(0.98, 0.62, 0.05), 0, 1.15, 0.03), palette.surface));
  pieces.push(paint(at(new CylinderGeometry(0.03, 0.03, 0.34, 8), 0, 0.92, 0.03), palette.frame));
  pieces.push(paint(at(new CylinderGeometry(0.18, 0.2, 0.02, 16), 0, 0.76, 0.03), palette.frame));

  // Lamp: base, arm leaning toward the bench, shade opening downward.
  const lampBase = new Vector3(-0.95, 0.765, -0.5);
  pieces.push(paint(at(new CylinderGeometry(0.12, 0.14, 0.03, 12), lampBase.x, lampBase.y, lampBase.z), palette.frame));
  pieces.push(rod(lampBase, LAMP_SHADE.clone().add(new Vector3(0, 0.05, 0)), 0.012, palette.frame));
  pieces.push(paint(at(new ConeGeometry(0.11, 0.14, 12, 1, true), LAMP_SHADE.x, LAMP_SHADE.y, LAMP_SHADE.z), palette.surface));

  // Cover rack, turned to face the crane camera.
  const rack = new BoxGeometry(RACK_SIZE[0], RACK_SIZE[1], RACK_DEPTH);
  rack.rotateY(RACK_YAW);
  pieces.push(paint(at(rack, RACK_POSITION.x, RACK_POSITION.y, RACK_POSITION.z), palette.frame));

  // The bulb: the only unlit surface in the props, so the lamp reads as on
  // rather than as a black triangle. One extra draw call, twelve triangles.
  const bulbGeometry = new CircleGeometry(0.085, 12).rotateX(Math.PI / 2);
  bulbGeometry.translate(LAMP_SHADE.x, LAMP_SHADE.y - 0.062, LAMP_SHADE.z);
  const bulbMaterial = new MeshBasicMaterial({ color: palette.lamp });
  const bulb = new Mesh(bulbGeometry, bulbMaterial);

  const geometry = mergeGeometries(pieces, false);
  for (const piece of pieces) piece.dispose();
  if (!geometry) throw new Error("[workshop] props did not merge");
  const material = new MeshLambertMaterial({ vertexColors: true, flatShading: true, side: DoubleSide });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.add(bulb);

  const dispose = () => {
    geometry.dispose();
    material.dispose();
    bulbGeometry.dispose();
    bulbMaterial.dispose();
  };

  return { mesh, dispose };
};
