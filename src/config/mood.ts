/**
 * Mood system — the "two faces" of the site.
 *
 *   aurora   → the home / soul (dark, cosmic)      → couples to the "dark" theme
 *   daybreak → the /work / hire view (warm, dawn)  → couples to the "light" theme
 *
 * The palette hexes here are the source of truth for the Silk WebGL shader
 * (which consumes hex, not CSS vars). They MUST stay in sync with the
 * `--aur-*` HSL triples in `src/styles/globals.scss` — same three colors,
 * two representations. Everything else on the page reads the CSS tokens.
 */

export const MOODS = ["aurora", "daybreak"] as const;
export type Mood = (typeof MOODS)[number];

export const DEFAULT_MOOD: Mood = "aurora";
export const MOOD_STORAGE_KEY = "mood";
export const MOOD_EXPLICIT_KEY = "mood:explicit";

/** next-themes value each mood couples to. */
export const MOOD_THEME: Record<Mood, "dark" | "light"> = {
  aurora: "dark",
  daybreak: "light",
};

/** Silk shader inputs per mood: the three aurora colors + drift speed. */
export interface MoodPalette {
  /** [aur-1, aur-2, aur-3] — mirrors --aur-1/2/3 in globals.scss */
  colors: [string, string, string];
  /** Silk drift speed */
  speed: number;
  /** browser chrome color (theme-color / msapplication-TileColor meta) */
  themeColor: string;
}

export const MOOD_PALETTE: Record<Mood, MoodPalette> = {
  aurora: {
    colors: ["#c072f0", "#58e6a6", "#4a3b8c"],
    speed: 2,
    themeColor: "#08070e",
  },
  daybreak: {
    colors: ["#f0a95a", "#ef7fa4", "#b98ce6"],
    speed: 3,
    themeColor: "#f6f5fb",
  },
};

/** The mood a route defaults to before the visitor makes an explicit choice. */
export function moodForPath(pathname: string): Mood {
  return pathname.startsWith("/work") ? "daybreak" : "aurora";
}

export function otherMood(mood: Mood): Mood {
  return mood === "aurora" ? "daybreak" : "aurora";
}
