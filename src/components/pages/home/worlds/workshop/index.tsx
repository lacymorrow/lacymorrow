import { lazy } from "react";

import type { WorldModule } from "../types";
import data from "./data.json";
import { Poster } from "./poster";

/**
 * 24 Million: the open source world. Numbers come from data.json, baked at
 * build time; nothing 3D is imported here. docs/worlds/workshop.md.
 */
export const workshop: WorldModule = {
  meta: {
    id: "workshop",
    title: `${Math.floor(data.crossoverDownloads / 1e6)} Million`,
    line: "Each light out there is a thousand people who downloaded CrossOver, a free crosshair overlay I built for gamers in 2019 and still look after.",
    href: "/play/crossover",
    cta: "See CrossOver",
    background: "#09090b",
    foreground: "#fafafa",
    lengthVh: 300,
    budget: { assetsKb: 12, triangles: 52000 },
  },
  World: lazy(() => import("./world")),
  Poster,
};

export default workshop;
