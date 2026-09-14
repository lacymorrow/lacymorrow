import { lazy } from "react";
import type { WorldMeta, WorldModule } from "../types";
import { Poster } from "./poster";

/**
 * airfield: Gates. One lap through eight lit gates on a school field at
 * dusk, seen from the quad. Spec: docs/worlds/airfield.md.
 */
export const meta: WorldMeta = {
  id: "airfield",
  title: "Gates",
  line: "In 2017 my brother, my cousin and I taught 24 kids in Charlotte to build their own quads and race them through gates like these.",
  href: "/work/drones",
  cta: "See the flying",
  background: "#5f7290",
  foreground: "#faf3e2",
  lengthVh: 300,
  budget: { assetsKb: 10, triangles: 12000 },
};

export const airfield: WorldModule = {
  meta,
  Poster,
  World: lazy(() => import("./world")),
};

export default airfield;
