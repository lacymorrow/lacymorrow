/**
 * Loading Ruffle, once per page, from this domain.
 *
 * Shared by the art pages and the Flash world on the home page. It has to be
 * one module: the player is 12.7 MB of WebAssembly, and two copies of this
 * loader would mean two script tags and two downloads.
 */

export interface RufflePlayerElement extends HTMLElement {
  load(options: Record<string, unknown>): Promise<void>;
  play(): void;
  pause(): void;
}

export interface RuffleSource {
  createPlayer(): RufflePlayerElement;
}

interface RuffleApi {
  newest(): RuffleSource | null;
}

/** `react-ruffle` used to declare this global with only the field it needed. */
const api = (): RuffleApi | undefined =>
  (window as unknown as { RufflePlayer?: RuffleApi }).RufflePlayer;

const SCRIPT_SRC = "/ruffle/ruffle.js";
const SCRIPT_ID = "ruffle-selfhosted";

let pending: Promise<RuffleSource> | null = null;

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

  // A failed load should not poison the next attempt.
  pending.catch(() => {
    pending = null;
  });

  return pending;
};

