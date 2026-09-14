import { airfield } from "./airfield";
import { workshop } from "./workshop";
import type { WorldModule } from "./types";

/**
 * The order the worlds play in, and the only place that order lives. A world
 * that is not ready to ship is not in this list; there is no "coming soon"
 * state. The ship order in docs/worlds/README.md is flash, airfield, fleet,
 * then workshop, city, jungle.
 */
export const worlds: WorldModule[] = [airfield, workshop];
