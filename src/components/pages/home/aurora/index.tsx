import Link from "next/link";

import { MoodDial } from "@/components/mood/mood-dial";
import { MoodSync } from "@/components/mood/mood-sync";

import { AuroraBackdrop } from "./backdrop";
import { AuroraHero } from "./hero";
import { AuroraThesis } from "./thesis-timeline";
import { AuroraWork } from "./work-constellation";
import { AuroraPedigree } from "./pedigree";
import { AuroraSkills } from "./skills-stack";
import { AuroraSky } from "./the-sky";
import { AuroraBelief } from "./belief";
import { AuroraInvitation } from "./invitation";
import { ScrollNav } from "./scroll-nav";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#belief", label: "Belief" },
  { href: "#invite", label: "Contact" },
];

const FOOT_LINKS = [
  { href: "/work", label: "/work", internal: true },
  { href: "https://github.com/lacymorrow", label: "GitHub" },
  { href: "https://x.com/lacybuilds", label: "@lacybuilds" },
  { href: "https://www.linkedin.com/in/lacymorrow/", label: "LinkedIn" },
  { href: "mailto:me@lacymorrow.com", label: "Email" },
];

export function AuroraHome() {
  return (
    <div
      className="min-h-dvh scroll-smooth bg-ground font-sans text-ink [transition:background-color_1s_ease,color_1s_ease] motion-reduce:transition-none"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <MoodSync />
      <AuroraBackdrop />

      <ScrollNav nav={NAV} />

      <main>
        <AuroraHero />
        <AuroraThesis />
        <AuroraWork />
        <AuroraPedigree />
        <AuroraSkills />
        <AuroraSky />
        <AuroraBelief />
        <AuroraInvitation />
      </main>

      <footer className="mt-[clamp(40px,8vh,90px)] border-t border-hair px-[clamp(20px,5vw,64px)] pb-12 pt-[clamp(40px,7vh,80px)]">
        <div className="mx-auto w-full max-w-[1120px] text-center">
          <p className="mb-6 text-[clamp(1.05rem,1.8vw,1.2rem)] font-light text-ink-soft">
            Let&rsquo;s build something that matters.
          </p>
          <a
            href="mailto:me@lacymorrow.com"
            className="inline-block rounded-full border border-hair-strong px-7 py-3 font-mono text-[13px] text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-agent hover:text-ink"
          >
            me@lacymorrow.com
          </a>

          <div className="mx-auto mt-10 flex flex-wrap justify-center gap-5 font-mono">
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

          <div className="mt-8 space-y-1.5 font-mono text-[12px] text-ink-mute">
            <p className="m-0">Charlotte, NC · San Francisco, CA</p>
            <p className="m-0">Lacy Morrow</p>
            <p className="m-0">
              Last updated{" "}
              <time dateTime={new Date().toISOString().slice(0, 10)}>
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </time>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuroraHome;
