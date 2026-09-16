/**
 * The Flash world's use of Ruffle. The loader itself is shared with the art
 * pages in src/lib/ruffle.ts: the player is 12.7 MB, and two loaders would
 * mean two of them.
 */

export { loadRuffle, nudge, type RufflePlayerElement } from "@/lib/ruffle";

/** The original files, still where they were put. */
export const swfUrl = (name: string): string => `/flash/art/${name}.swf`;

/**
 * Per-movie options. Passed on every `load()` rather than set on
 * `window.RufflePlayer.config`, which is global: it would follow the visitor
 * to the art pages, and it cannot say anything different for the jukebox at
 * /play/flash, which plays music and should keep its unmute overlay.
 */
export const PLAY_OPTIONS = {
  autoplay: "on",
  // The person pressed play; a second overlay asking them to press it again
  // is the sort of thing this section exists to avoid.
  unmuteOverlay: "hidden",
  splashScreen: false,
  contextMenu: "off",
  warnOnUnsupportedContent: false,
  logLevel: "error",
  letterbox: "on",
  scale: "showAll",
  wmode: "opaque",
  allowScriptAccess: false,
  /**
   * Belt, not braces. In this Ruffle build this option governs navigation
   * inside the movie rather than the fetches a movie makes, so it does not
   * on its own stop the pieces that call Adobe Kuler. The connect-src header
   * in next.config.js is what actually stops those, and the address is out
   * of the two files that carried it.
   */
  allowNetworking: "none",
} as const;
