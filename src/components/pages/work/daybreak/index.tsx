import Link from "next/link";

import { MoodDial } from "@/components/mood/mood-dial";
import { MoodSync } from "@/components/mood/mood-sync";

import { DaybreakBackdrop } from "./backdrop";
import { DaybreakHero } from "./hero";
import { CareerTimeline } from "./career-timeline";
import { DaybreakFlagship } from "./flagship";
import { DaybreakCredibility } from "./credibility";
import { DaybreakBelief } from "./belief";
import { DaybreakInvitation } from "./invitation";

const FOOT_LINKS = [
  { href: "/", label: "← Home", internal: true },
  { href: "https://github.com/lacymorrow", label: "GitHub" },
  { href: "https://x.com/lacybuilds", label: "@lacybuilds" },
  { href: "https://www.linkedin.com/in/lacymorrow/", label: "LinkedIn" },
  { href: "mailto:me@lacymorrow.com", label: "Email" },
];

/**
 * Daybreak — the /work face. Warm, editorial, credibility-first, with the full
 * career timeline. The link to hand recruiters. Defaults to the daybreak mood
 * (the no-flash script opens /work in daybreak); the dial still flips it.
 */
export function DaybreakWork() {
  return (
    <div
      className="min-h-dvh scroll-smooth bg-ground font-sans text-ink [transition:background-color_1s_ease,color_1s_ease] motion-reduce:transition-none"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <MoodSync />
      <DaybreakBackdrop />

      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(20px,5vw,56px)] py-5 backdrop-blur-[12px]"
        style={{ background: "linear-gradient(to bottom, hsl(var(--ground) / 0.72), transparent)" }}
      >
        <div className="inline-flex items-center gap-2.5">
          <Link href="/" title="Back to the home view" className="text-[15px] font-semibold text-ink">
            Lacy Morrow
          </Link>
          <span className="rounded-full border border-hair-strong px-2.5 py-[3px] font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-mute">
            /work
          </span>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-[clamp(14px,3vw,32px)]">
          <Link
            href="/"
            title="The full picture — Lacy's home"
            className="hidden font-mono text-[13px] text-ink-soft transition-colors hover:text-agent sm:inline"
          >
            ← Home
          </Link>
          <a href="#work" className="hidden text-[13.5px] text-ink-soft transition-colors hover:text-agent sm:inline">
            Work
          </a>
          <a href="#belief" className="hidden text-[13.5px] text-ink-soft transition-colors hover:text-agent sm:inline">
            Belief
          </a>
          <MoodDial />
        </nav>
      </header>

      <main>
        <DaybreakHero />
        <CareerTimeline />
        <DaybreakFlagship />
        <DaybreakCredibility />
        <DaybreakBelief />
        <DaybreakInvitation />
      </main>

      <footer className="mt-[clamp(30px,6vh,70px)] border-t border-hair px-[clamp(20px,5vw,56px)] pb-[46px] pt-[clamp(38px,6vh,70px)]">
        <div className="mx-auto w-full max-w-[940px]">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <div className="font-mono text-[13px] text-ink-mute">
              Charlotte, NC &nbsp;✈&nbsp; San Francisco, CA
            </div>
            <div className="flex flex-wrap gap-5 font-mono">
              {FOOT_LINKS.map((l) =>
                l.internal ? (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-[13px] text-ink-soft transition-colors hover:text-agent"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.href}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-[13px] text-ink-soft transition-colors hover:text-agent"
                  >
                    {l.label}
                  </a>
                ),
              )}
            </div>
          </div>
          <p className="mt-5 max-w-[62ch] font-mono text-[12px] text-ink-mute">
            The work view, built for hiring and proposals. For the rest of who I am, there&rsquo;s the{" "}
            <Link href="/" className="border-b border-hair-strong text-agent hover:border-agent">
              home view
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

export default DaybreakWork;
