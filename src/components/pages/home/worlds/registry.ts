import { airfield } from "./airfield";
import { flash } from "./flash";
import { fleet } from "./fleet";
import { workshop } from "./workshop";
import type { WorldModule } from "./types";

/**
 * The order the worlds play in, and the only place that order lives. A world
 * that is not ready to ship is not in this list; there is no "coming soon"
 * state. The remaining specs are in docs/worlds: city, jungle.
 */
export const worlds: WorldModule[] = [flash, airfield, fleet, workshop];
