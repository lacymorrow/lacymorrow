import * as THREE from "three";

export interface ModelSpec {
  key: string;
  file: string;
  maxBytesGz: number;
}

const BASE_PATH = "/models/morrow-field";

const DRACO_DECODER_URL = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

export const MODEL_MANIFEST: Record<string, ModelSpec> = {
  "zone-work": { key: "zone-work", file: "zone-work.glb", maxBytesGz: 5500 },
  "zone-play": { key: "zone-play", file: "zone-play.glb", maxBytesGz: 4500 },
  "zone-flash": { key: "zone-flash", file: "zone-flash.glb", maxBytesGz: 3500 },
  "zone-writing": { key: "zone-writing", file: "zone-writing.glb", maxBytesGz: 3500 },
  "zone-archive": { key: "zone-archive", file: "zone-archive.glb", maxBytesGz: 5500 },
  "zone-post": { key: "zone-post", file: "zone-post.glb", maxBytesGz: 3500 },
  "zone-airfield": { key: "zone-airfield", file: "zone-airfield.glb", maxBytesGz: 4500 },
  "drone-body": { key: "drone-body", file: "drone-body.glb", maxBytesGz: 5500 },
  "letters-lacy": { key: "letters-lacy", file: "letters-lacy.glb", maxBytesGz: 4000 },
  "letters-morrow": { key: "letters-morrow", file: "letters-morrow.glb", maxBytesGz: 5000 },
  trees: { key: "trees", file: "trees.glb", maxBytesGz: 3500 },
  rocks: { key: "rocks", file: "rocks.glb", maxBytesGz: 2500 },
};

export const TOTAL_BUDGET_BYTES_GZ = 50_000;

type LoaderModule = typeof import("three/examples/jsm/loaders/GLTFLoader.js");
type DracoModule = typeof import("three/examples/jsm/loaders/DRACOLoader.js");

interface LoaderContext {
  loader: InstanceType<LoaderModule["GLTFLoader"]>;
  ready: Promise<void>;
}

let loaderCtx: LoaderContext | null = null;
const cache = new Map<string, Promise<THREE.Group | null>>();
let totalBytesLoaded = 0;
let budgetWarned = false;

const getLoader = (): LoaderContext => {
  if (loaderCtx) return loaderCtx;
  const ctx: LoaderContext = {
    loader: null as unknown as InstanceType<LoaderModule["GLTFLoader"]>,
    ready: Promise.resolve(),
  };
  ctx.ready = (async () => {
    const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
      import("three/examples/jsm/loaders/GLTFLoader.js") as Promise<LoaderModule>,
      import("three/examples/jsm/loaders/DRACOLoader.js") as Promise<DracoModule>,
    ]);
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_DECODER_URL);
    loader.setDRACOLoader(draco);
    ctx.loader = loader;
  })();
  loaderCtx = ctx;
  return ctx;
};

const applyFlatShading = (group: THREE.Group): void => {
  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of materials) {
      const anyMat = m as THREE.MeshStandardMaterial | THREE.MeshLambertMaterial;
      if ("flatShading" in anyMat) {
        (anyMat as { flatShading: boolean }).flatShading = true;
        (anyMat as { needsUpdate: boolean }).needsUpdate = true;
      }
    }
  });
};

const trackBytes = (key: string, bytes: number, maxBytes: number): void => {
  totalBytesLoaded += bytes;
  if (process.env.NODE_ENV !== "production") {
    if (bytes > maxBytes) {
      console.warn(
        `[morrow-field] model "${key}" is ${bytes} bytes, exceeds per-asset cap ${maxBytes}`,
      );
    }
    if (!budgetWarned && totalBytesLoaded > TOTAL_BUDGET_BYTES_GZ) {
      budgetWarned = true;
      console.warn(
        `[morrow-field] total model bytes ${totalBytesLoaded} exceeds budget ${TOTAL_BUDGET_BYTES_GZ}`,
      );
    }
  }
};

export const loadModel = (key: string): Promise<THREE.Group | null> => {
  const cached = cache.get(key);
  if (cached) return cached;
  const spec = MODEL_MANIFEST[key];
  if (!spec) {
    return Promise.resolve(null);
  }
  const url = `${BASE_PATH}/${spec.file}`;
  const promise = (async (): Promise<THREE.Group | null> => {
    try {
      const head = await fetch(url, { method: "HEAD" });
      if (!head.ok) return null;
      const len = Number(head.headers.get("content-length") || "0");
      if (len > 0) trackBytes(key, len, spec.maxBytesGz);
      const ctx = getLoader();
      await ctx.ready;
      const gltf = await ctx.loader.loadAsync(url);
      applyFlatShading(gltf.scene);
      return gltf.scene;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[morrow-field] failed to load model "${key}":`, err);
      }
      return null;
    }
  })();
  cache.set(key, promise);
  return promise;
};

export interface SwapOptions {
  key: string;
  parent: THREE.Object3D;
  primitive: THREE.Object3D;
  scale?: number;
  onLoaded?: (model: THREE.Group) => void;
}

export const swapOnLoad = ({
  key,
  parent,
  primitive,
  scale = 1,
  onLoaded,
}: SwapOptions): void => {
  parent.add(primitive);
  const kickoff = () => {
    void loadModel(key).then((source) => {
      if (!source) return;
      if (!parent.parent) return;
      const model = source.clone(true) as THREE.Group;
      model.scale.setScalar(scale);
      parent.add(model);
      primitive.visible = false;
      onLoaded?.(model);
      const startedAt = performance.now();
      const durMs = 220;
      const tick = () => {
        const t = Math.min(1, (performance.now() - startedAt) / durMs);
        const eased = 1 - (1 - t) * (1 - t);
        model.scale.setScalar(scale * (0.9 + 0.1 * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    (window as unknown as {
      requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback(kickoff, { timeout: 2000 });
  } else {
    setTimeout(kickoff, 300);
  }
};

export const resetLoaderForTest = (): void => {
  cache.clear();
  loaderCtx = null;
  totalBytesLoaded = 0;
  budgetWarned = false;
};
