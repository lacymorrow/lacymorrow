import { lazy } from "react";
import type { WorldModule } from "../types";

const Poster = () => (
  <div className="flex size-full items-center justify-center" style={{ background: "#111" }}>
    <div className="size-40 rotate-12 border-2 border-[#ff0080]" />
  </div>
);

export const smoke: WorldModule = {
  meta: {
    id: "smoke",
    title: "Smoke test",
    line: "A box that turns as you scroll. If you can read this, the stage works.",
    href: "/play",
    cta: "See the play section",
    background: "#111111",
    foreground: "#fafafa",
    lengthVh: 300,
    budget: { assetsKb: 0, triangles: 12 },
  },
  World: lazy(() => import("./world")),
  Poster,
};
