import piecesJson from "./pieces.json";

/**
 * The 21 Flash pieces, in Lacy's order, as captured by
 * scripts/capture-flash-art.mjs. The file is the source of truth: the player
 * reads its length from here, so a recapture that drops a piece needs no code
 * change.
 */
export interface Piece {
  /** 0-based position in the playlist. */
  order: number;
  /** The SWF basename, also the atlas filename. */
  name: string;
  /** The piece's own page. */
  href: string;
  /** Dominant color at 6 seconds. */
  background: string;
  /** Fraction of pixels that are not the dominant color at 6 seconds. */
  coverage: number;
}

export const pieces = piecesJson as Piece[];

export const ART_BASE = "/static/play/art";

export const atlasUrl = (name: string, quality: "low" | "high"): string =>
  `${ART_BASE}/${quality === "high" ? "easel" : "easel-low"}/${name}.webp`;

/**
 * The piece the Poster holds. It has to read as a picture rather than as a
 * frame of an animation, because it is also the whole section for anyone on
 * reduced motion, saveData, a small machine, or no JavaScript at all. `stix`
 * is the densest, most obviously hand-drawn finished frame in the set; the
 * first piece in Lacy's order is a white field with a small logo in it, which
 * is the weakest still here. Looked up by name so a recapture that reorders
 * the playlist still opens on the same picture.
 */
const POSTER_NAME = "stix";
export const POSTER_INDEX = Math.max(
  0,
  pieces.findIndex((piece) => piece.name === POSTER_NAME),
);
