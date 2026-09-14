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
    lengthVh: 340,
    budget: { assetsKb: 1000, triangles: 5000 },
  },
  World: lazy(() => import("./world")),
  Poster,
};

export default flash;
