// One-off: convert STL files to GLB for the 3D model viewer.
// Usage: node scripts/stl-to-glb.mjs <in.stl> <out.glb>
import { readFileSync, writeFileSync } from "node:fs";

// three's GLTFExporter (binary) relies on a browser FileReader to read a Blob.
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = ab;
        this.onloadend?.();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((ab) => {
        const b64 = Buffer.from(ab).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${b64}`;
        this.onloadend?.();
      });
    }
  };
}

import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error("Usage: node scripts/stl-to-glb.mjs <in.stl> <out.glb>");
  process.exit(1);
}

const buf = readFileSync(inPath);
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const geometry = new STLLoader().parse(arrayBuffer);
geometry.computeVertexNormals();
geometry.center();

const material = new THREE.MeshStandardMaterial({ color: 0xb0b4ba, metalness: 0.1, roughness: 0.7 });
const mesh = new THREE.Mesh(geometry, material);
const scene = new THREE.Scene();
scene.add(mesh);

const exporter = new GLTFExporter();
const gltf = await exporter.parseAsync(scene, { binary: true });
writeFileSync(outPath, Buffer.from(gltf));
console.log(`Wrote ${outPath} (${Buffer.from(gltf).length} bytes)`);
