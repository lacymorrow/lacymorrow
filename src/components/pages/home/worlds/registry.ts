import type { WorldModule } from "./types";
import { flash } from "./flash";
import { smoke } from "./smoke";

/**
 * The order the worlds play in. A world that is not ready to ship is not
 * in this list; there is no "coming soon" state.
 */
export const worlds: WorldModule[] = [flash, smoke, { ...smoke, meta: { ...smoke.meta, id: "smoke2", background: "#0b2a1f" } }];
