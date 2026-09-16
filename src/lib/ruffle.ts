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

/**
 * Give the stage one click, the way a visitor would.
 *
 * Several of the pieces are mouse-reactive: `scribe` and `theme` draw
 * nothing at all until the stage receives a mouse event, so they sit as a
 * flat red rectangle until someone thinks to click them. That is what they
 * were written to do in 2008, when a Flash movie had the page to itself and
 * clicking it was the obvious move. On a page of its own, with a title above
 * it, it just looks broken.
 *
 * `scripts/capture-flash-art.mjs` already clicks every piece before it grabs
 * a frame, for the same reason, so doing it here keeps the live pieces and
 * the captured stills telling the same story.
 *
 * Only the first click is synthetic. Everything after it is the visitor's
 * own mouse, which is the point of these pieces.
 */
export const nudge = (player: RufflePlayerElement): void => {
  const canvas = player.shadowRoot?.querySelector("canvas");
  if (!canvas) return;
  const box = canvas.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return;
  const at = {
    clientX: box.left + box.width / 2,
    clientY: box.top + box.height / 2,
    bubbles: true,
    cancelable: true,
    pointerType: "mouse",
    isPrimary: true,
    button: 0,
  };
  canvas.dispatchEvent(new PointerEvent("pointerdown", { ...at, buttons: 1 }));
  canvas.dispatchEvent(new PointerEvent("pointerup", { ...at, buttons: 0 }));
};
