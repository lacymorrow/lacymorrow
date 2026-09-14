import piecesJson from "./pieces.json";

/**
 * The 21 Flash pieces, in Lacy's order, as captured by
 * scripts/capture-flash-art.mjs. The file is the source of truth: the caption
 * count, the ribbon tiles and the easel all read their length from here, so a
 * recapture that drops a piece needs no code change.
 */
export interface Piece {
  /** 0-based position on the ribbon. */
  order: number;
  /** The SWF basename, also the atlas filename. */
  name: string;
  /** Where a click on the easel goes. */
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

export const RIBBON_ATLAS = `${ART_BASE}/ribbon.webp`;
export const RIBBON_KEY = "__ribbon";

/** Tiles in the ribbon atlas, 7 across and 3 down. */
export const RIBBON_COLS = 7;
export const RIBBON_ROWS = 3;

/** Column and row of a piece's tile in ribbon.webp. */
export const tileOf = (index: number): [number, number] => [
  index % RIBBON_COLS,
  Math.floor(index / RIBBON_COLS),
];

/** "07 / 21" with the same padding every piece. */
export const captionCount = (index: number): string =>
  `${String(index + 1).padStart(2, "0")} / ${String(pieces.length).padStart(2, "0")}`;
