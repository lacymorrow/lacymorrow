import Link from "next/link";
import { NAV_LINKS, ZONES } from "./zones";

interface StaticLandingProps {
  reason?: "reduced-motion" | "no-webgl" | "loading" | "flag-fallback";
}

export const StaticLanding = ({ reason }: StaticLandingProps) => {
  const noticeMap: Record<NonNullable<StaticLandingProps["reason"]>, string> = {
    "reduced-motion":
      "Reduced-motion preference detected — showing the static landing.",
    "no-webgl":
      "WebGL isn't available in this browser — showing the static landing.",
    loading: "Loading the 3D world…",
    "flag-fallback": "",
  };

  return (
    <section
      aria-label="Lacy Morrow portfolio"
      className="mx-auto flex min-h-[70vh] w-full max-w-[860px] flex-col justify-center px-6 py-16"
    >
      <p className="text-muted-foreground mb-3 font-mono text-[11px] uppercase tracking-[0.18em]">
        Developer · Designer · Drone Pilot
      </p>
      <h1 className="text-foreground mb-6 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
        Lacy Morrow
      </h1>
      <p className="text-muted-foreground mb-8 max-w-[52ch] text-base leading-relaxed">
        Two decades shipping software. Creator of CrossOver and Shipkit. I build
        AI agents that control computers, and I fly FPV drones.
      </p>

      {reason && noticeMap[reason] && (
        <p className="border-border bg-muted/40 text-muted-foreground mb-8 rounded-md border px-3 py-2 text-xs">
          {noticeMap[reason]}
        </p>
      )}

      <nav aria-label="Site sections" className="mb-10">
        <ul className="flex flex-wrap gap-2">
          {NAV_LINKS.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="border-border text-foreground hover:bg-foreground hover:text-background inline-block rounded-full border px-4 py-1.5 text-sm font-medium"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium uppercase tracking-wider">
          Places to visit
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ZONES.map((z) => (
            <li key={z.route}>
              <Link
                href={z.route}
                className="border-border hover:border-foreground block rounded-lg border p-4"
              >
                <div className="text-foreground text-base font-semibold">
                  {z.name}
                </div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {z.desc}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
