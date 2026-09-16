import { lazy } from "react";

import type { WorldMeta, WorldModule } from "../types";
import { Poster } from "./poster";

/**
 * fleet: Seventeen. A print shop running in the dark, where machines draft
 * and one desk signs. Spec: docs/worlds/fleet.md.
 */
export const meta: WorldMeta = {
  id: "fleet",
  title: "Seventeen",
  line: "Seventeen Claude agents run my projects on a timer; they draft, I sign.",
  href: "/writing/running-infrastructure-on-ai-agents",
  cta: "Read what actually happens",
  background: "#0b0b0d",
  foreground: "#efe7d3",
  lengthVh: 200,
  playSeconds: 26,
  budget: { assetsKb: 45, triangles: 70000 },
  // The hall is dark at the door and the copy would sit on nothing, so it
  // arrives with the first machines rather than before them.
  overlay: { title: [0.03, 0.06], body: [0.04, 0.08] },
};

export const fleet: WorldModule = {
  meta,
  Poster,
  World: lazy(() => import("./world")),
};

export default fleet;
