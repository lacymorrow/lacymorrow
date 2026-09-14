import { LinearMipmapLinearFilter, SRGBColorSpace, Texture } from "three";

/**
 * Atlas loading and a small LRU. Textures decode off the main thread through
 * createImageBitmap, flipped at decode so every uv in this world has (0, 0) at
 * the bottom left of the image. docs/worlds/flash.md, 6.
 */

export const loadTexture = async (url: string, signal?: AbortSignal): Promise<Texture> => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob, {
    imageOrientation: "flipY",
    premultiplyAlpha: "none",
    colorSpaceConversion: "none",
  });
  const texture = new Texture(bitmap);
  texture.flipY = false;
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
};

export const disposeTexture = (texture: Texture): void => {
  const source = texture.image as ImageBitmap | undefined;
  if (source && typeof source.close === "function") source.close();
  texture.dispose();
};

/** Keeps the last `size` decoded atlases and disposes the rest. */
export class TextureCache {
  private readonly entries = new Map<string, Texture>();
  private disposed = false;
  private readonly pending = new Map<string, Promise<Texture | null>>();

  /** Never evicted: every piece falls back to it while its atlas loads. */
  constructor(
    private readonly size: number,
    private readonly keep: string,
  ) {}

  get(key: string): Texture | undefined {
    const texture = this.entries.get(key);
    if (texture) {
      this.entries.delete(key);
      this.entries.set(key, texture);
    }
    return texture;
  }

  /** Fetch once per key. A failure is remembered, never retried. */
  load(key: string, url: string): Promise<Texture | null> {
    const existing = this.entries.get(key);
    if (existing) return Promise.resolve(existing);
    const inFlight = this.pending.get(key);
    if (inFlight) return inFlight;
    const promise = loadTexture(url)
      .then((texture) => {
        if (this.disposed) {
          disposeTexture(texture);
          return null;
        }
        this.entries.set(key, texture);
        this.trim();
        return texture;
      })
      .catch(() => null);
    this.pending.set(key, promise);
    return promise;
  }

  private trim(): void {
    while (this.entries.size > this.size) {
      let oldest: string | undefined;
      this.entries.forEach((_, name) => {
        if (oldest === undefined && name !== this.keep) oldest = name;
      });
      if (oldest === undefined) return;
      const texture = this.entries.get(oldest);
      this.entries.delete(oldest);
      if (texture) disposeTexture(texture);
    }
  }

  dispose(): void {
    this.disposed = true;
    this.entries.forEach(disposeTexture);
    this.entries.clear();
    this.pending.clear();
  }
}
