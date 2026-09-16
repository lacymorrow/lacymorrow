export type Tier = "off" | "low" | "high";

interface NavigatorExtras extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

const hasWebGL = (): boolean => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

/**
 * Decide once per page load whether worlds run at all, and how hard.
 * "off" means every world shows its Poster. The rules are in
 * docs/worlds/README.md under "States".
 */
export const detectTier = (): Tier => {
  if (typeof window === "undefined") return "off";
  const nav = navigator as NavigatorExtras;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  if (nav.connection?.saveData) return "off";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return "off";
  if (!hasWebGL()) return "off";

  const small = window.matchMedia("(max-width: 768px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  if (small || coarse || fewCores) return "low";
  return "high";
};
