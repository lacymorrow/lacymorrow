import { InstancedBufferAttribute, InstancedMesh, Object3D, PlaneGeometry } from "three";

import { SCREEN_CENTER } from "./palette";
import { createScreenMaterial } from "./screen-material";
import { seeded } from "./seed";

/**
 * The field: one InstancedMesh, one draw call, N screens. Instance 0 is the
 * monitor on the bench; the rest fan out from it in rows, near to far.
 * Layout recipe in docs/worlds/workshop.md section 5.
 */

const DEG = Math.PI / 180;
const ARC = 110 * DEG;
const SPACING = 0.85;
const [CX, CY, CZ] = SCREEN_CENTER;

export const createField = (count: number, quality: "low" | "high") => {
  const rand = seeded(20191005);
  const between = (lo: number, hi: number) => lo + (hi - lo) * rand();

  const geometry = new PlaneGeometry(0.5, 0.3);
  const { material, uniforms } = createScreenMaterial(quality);
  const mesh = new InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;

  const litAt = new Float32Array(count);
  const rowOf = new Uint16Array(count);
  const tint = new Float32Array(count);
  const seed = new Float32Array(count);
  const dummy = new Object3D();

  // Instance 0: the monitor. Faces -Z, toward the bench, always lit.
  dummy.position.set(CX, CY, CZ);
  dummy.rotation.set(0, Math.PI, 0);
  dummy.scale.set(1.8, 1.8, 1);
  dummy.updateMatrix();
  mesh.setMatrixAt(0, dummy.matrix);
  litAt[0] = -1;
  tint[0] = 0;
  seed[0] = 0;
  dummy.scale.set(1, 1, 1);

  let i = 1;
  let rows = 0;
  for (let row = 0; i < count; row += 1) {
    rows = row + 1;
    const radius = 2 + 0.7 * row;
    const perRow = Math.floor((ARC * radius) / SPACING);
    const y = CY + 0.012 * row ** 1.35;
    for (let k = 0; k < perRow && i < count; k += 1) {
      const theta = -ARC / 2 + (ARC * (k + 0.5)) / perRow;
      dummy.position.set(
        CX + radius * Math.sin(theta) + between(-0.15, 0.15),
        y + between(-0.05, 0.05),
        CZ + radius * Math.cos(theta) + between(-0.15, 0.15),
      );
      dummy.lookAt(CX, CY, CZ);
      dummy.rotateY(between(-4, 4) * DEG);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      rowOf[i] = row;
      litAt[i] = between(-0.02, 0.02);
      tint[i] = rand() < 1 / 40 ? 1 + Math.floor(rand() * 3) : 0;
      seed[i] = rand();
      i += 1;
    }
  }
  mesh.instanceMatrix.needsUpdate = true;

  // The wave is spread by row, not by instance index. Far rows hold most of
  // the screens, so spreading by index would race the lit edge to the
  // horizon in the first fifth of the scroll and then crawl. By row the
  // edge moves outward at one pace, and the last row still lights at 0.55.
  for (let k = 1; k < count; k += 1) {
    litAt[k] += 0.1 + (0.45 * rowOf[k]) / Math.max(1, rows - 1);
  }

  geometry.setAttribute("aLitAt", new InstancedBufferAttribute(litAt, 1));
  geometry.setAttribute("aTint", new InstancedBufferAttribute(tint, 1));
  geometry.setAttribute("aSeed", new InstancedBufferAttribute(seed, 1));

  const dispose = () => {
    geometry.dispose();
    material.dispose();
    mesh.dispose();
  };

  return { mesh, uniforms, dispose };
};
