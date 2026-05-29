// One-off: convert STL files to OBJ for download alongside the STL/GLB exports.
// Usage: node scripts/stl-to-obj.mjs <in.stl> <out.obj>
import { readFileSync, writeFileSync } from "node:fs";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error("Usage: node scripts/stl-to-obj.mjs <in.stl> <out.obj>");
  process.exit(1);
}

const buf = readFileSync(inPath);
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

// No geometry.center(): preserve the original STL origin so the OBJ aligns
// with the STL download when imported into a slicer or CAD software.
const geometry = new STLLoader().parse(arrayBuffer);
geometry.computeVertexNormals();

const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
const obj = new OBJExporter().parse(mesh);
writeFileSync(outPath, obj);
console.log(`Wrote ${outPath} (${Buffer.byteLength(obj)} bytes)`);
