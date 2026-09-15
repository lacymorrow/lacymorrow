import { lazy } from "react";

import { Poster } from "./poster";
import type { WorldModule } from "../types";

/**
 * flash: Made in Flash. 21 real pieces ride a magenta ribbon past a gate and
 * paint themselves on an easel as you scroll. docs/worlds/flash.md.
 * Nothing 3D is imported here; the scene arrives through the lazy World.
 */
export const flash: WorldModule = {
  meta: {
    id: "flash",
    title: "Made in Flash",
    line: "I drew these with code in Flash years ago, and they still run.",
    href: "/play/art",
    cta: "See the art",
    background: "#06070f",
    foreground: "#fafafa",
    lengthVh: 200,
    playSeconds: 22,
    // The scene keeps its top left clear of ribbons on purpose, and the
    // filmstrip sweeps through the bottom left, so the copy sits up top.
    // docs/worlds/flash.md section 2.
    overlay: { position: "top" },
    budget: { assetsKb: 1000, triangles: 5000 },
  },
  World: lazy(() => import("./world")),
  Poster,
};

export default flash;
