/**
 * Ruffle, fetched once and only on purpose. The player is about 13 MB of
 * WebAssembly, which is why nothing in here runs until someone presses play.
 * After that one press the same player element loads every other piece:
 * `load()` replaces the movie and reuses the instance, so picking a track
 * costs one SWF, about 10 KB. docs/worlds/flash.md.
 */

export interface RufflePlayerElement extends HTMLElement {
  load(options: Record<string, unknown>): Promise<void>;
  play(): void;
  pause(): void;
}

interface RuffleSource {
  createPlayer(): RufflePlayerElement;
}

interface RuffleApi {
  newest(): RuffleSource | null;
}

/**
 * `react-ruffle` already declares `window.RufflePlayer` for the art pages,
 * with only the `config` field it needs. Reading through a cast keeps the two
 * views of the same global from fighting.
 */
const api = (): RuffleApi | undefined =>
  (window as unknown as { RufflePlayer?: RuffleApi }).RufflePlayer;

/** The self-hosted build already in `public/`, the same one the art pages use. */
const SCRIPT_SRC = "/ruffle/ruffle.js";
const SCRIPT_ID = "ruffle-selfhosted";

let pending: Promise<RuffleSource> | null = null;

/**
 * Resolve the newest registered Ruffle source, loading the script on the first
 * call. Nothing here configures Ruffle globally: the art pages under
 * `/play/art` rely on its `<object>` polyfill, and a client-side navigation
 * from here to one of them shares this same window.
 */
export const loadRuffle = (): Promise<RuffleSource> => {
  if (pending) return pending;

  pending = new Promise<RuffleSource>((resolve, reject) => {
    const settle = () => {
      const source = api()?.newest();
      if (source) resolve(source);
      else reject(new Error("Ruffle loaded without registering a source"));
    };

    if (api()?.newest()) {
      settle();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", settle, { once: true });
    script.addEventListener("error", () => reject(new Error("Ruffle failed to load")), {
      once: true,
    });
    if (!existing) {
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  // A failed press should not poison the next one.
  pending.catch(() => {
    pending = null;
  });

  return pending;
};

/** The original files, still where they were put. */
export const swfUrl = (name: string): string => `/flash/art/${name}.swf`;

/**
 * Per-movie options. Passed on every `load()` rather than set on
 * `window.RufflePlayer.config`, which would follow the visitor to the art
 * pages and turn the polyfill those pages need off.
 */
export const PLAY_OPTIONS = {
  autoplay: "on",
  // The person pressed play; a second overlay asking them to press it again is
  // the sort of thing this section exists to avoid.
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
   * on its own stop the four pieces that still call Adobe Kuler. The
   * connect-src header in next.config.js is what actually stops those.
   */
  allowNetworking: "none",
} as const;
