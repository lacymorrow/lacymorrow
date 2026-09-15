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
