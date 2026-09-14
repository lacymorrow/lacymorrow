import type { WorldModule } from "./types";
import { smoke } from "./smoke";
import { workshop } from "./workshop";

/**
 * The order the worlds play in. A world that is not ready to ship is not
 * in this list; there is no "coming soon" state.
 */
export const worlds: WorldModule[] = [workshop, smoke, { ...smoke, meta: { ...smoke.meta, id: "smoke2", background: "#0b2a1f" } }];
