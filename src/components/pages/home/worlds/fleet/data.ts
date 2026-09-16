/**
 * The floor is the table. Every number here comes from the essay at
 * /writing/running-infrastructure-on-ai-agents, dated 2026-08-25. When the
 * essay changes, this file changes and the machines change with it.
 * docs/worlds/fleet.md section 6.
 */

export const ESSAY_DATE = "2026-08-25";

export interface Role {
  name: string;
  /** Times this agent has run. */
  runs: number;
  /** Cached input tokens read, absolute. */
  tokens: number;
}

/** The six the essay's table does not name, derived from its totals. */
const UNNAMED: Omit<Role, "name"> = { runs: 53, tokens: 55e6 };

/**
 * Row A, far end of the hall to the desk end. The order is not arbitrary:
 * the CEO stands next to the Founding Engineer so the refusal has two
 * neighbours to happen between, and the review chain runs in desk order so
 * the hero sheet only ever travels toward the lamp.
 */
export const ROW_A: Role[] = [
  { name: "Marketing Lead", runs: 817, tokens: 745e6 },
  { name: "CEO", runs: 1352, tokens: 1.63e9 },
  { name: "Founding Engineer", runs: 1246, tokens: 2.67e9 },
  { name: "Code Reviewer", runs: 208, tokens: 219e6 },
  { name: "QA Engineer", runs: 235, tokens: 357e6 },
  { name: "Frontend Engineer", runs: 334, tokens: 866e6 },
  { name: "Client Shepherd", runs: 272, tokens: 432e6 },
  { name: "Backend Engineer", runs: 119, tokens: 296e6 },
  { name: "Designer", runs: 85, tokens: 172e6 },
];

export const ROW_B: Role[] = [
  { name: "CTO", runs: 1069, tokens: 1.28e9 },
  { name: "Product Manager", runs: 145, tokens: 103e6 },
  ...Array.from({ length: 6 }, (_, i) => ({ name: `Agent ${i + 12}`, ...UNNAMED })),
];

export const ROLES: Role[] = [...ROW_A, ...ROW_B];

/** The title depends on this. */
export const COUNT = ROLES.length;

/** One sheet on the aisle runner for every million tokens the fleet has read. */
export const RUNNER_SHEETS = Math.round(ROLES.reduce((n, r) => n + r.tokens, 0) / 1e6);

/**
 * How often a press fires, in seconds. The essay says the heartbeat is
 * faster for critical roles without saying which; run counts encode the
 * same thing and need no second source. The CEO is at the floor of the
 * range and the Designer at the ceiling, so the spread is visible without
 * anything running fast enough to read as a stutter.
 */
export const cyclePeriod = (runs: number): number => Math.min(20, Math.max(1.5, 2000 / runs));

/** The Founding Engineer has read the most, so it carries the fattest roll. */
export const rollRadius = (tokens: number): number => 0.06 + 0.16 * Math.sqrt(tokens / 2.67e9);

/** What a press has already printed, stacked beside it. */
export const stackHeight = (runs: number): number => runs * 0.0004;
