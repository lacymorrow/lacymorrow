import { lazy } from "react";

import { Poster } from "./poster";
import { BACKDROP } from "./jukebox";
import type { WorldModule } from "../types";

export const flash: WorldModule = {
  meta: {
    id: "flash",
    title: "Made in Flash",
    line: "I drew these with code in Flash years ago, and they still run.",
    href: "/play/art",
    cta: "See the art",
    background: BACKDROP,
    foreground: "#fafafa",
    lengthVh: 200,
    // Twenty one pieces, three seconds each, then the playlist starts over.
    playSeconds: 63,
    holdSeconds: 2,
    // No WebGL in this world at all: one 37 KB atlas on screen at a time.
    budget: { assetsKb: 80, triangles: 0 },
  },
  World: lazy(() => import("./world")),
  Poster,
};

export default flash;
