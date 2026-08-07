import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CompanyCard {
  name: string;
  role: string;
  period: string;
  href: string;
  tone?: "shell" | "agent";
}

const COMPANIES: CompanyCard[] = [
  { name: "Duke Energy", role: "Agentic Engineer", period: "2024 – now", href: "/work/companies/duke-energy", tone: "agent" },
  { name: "Credit Karma", role: "Full-stack Engineer", period: "2024", href: "/work/companies/credit-karma" },
  { name: "Twilio", role: "Senior Web Engineer", period: "2017 – 2021", href: "/work/companies/twilio" },
  { name: "Invitae", role: "Senior React Developer", period: "2021 – 2022", href: "/work/companies/invitae" },
  { name: "Viasat", role: "Senior React Engineer", period: "2021", href: "/work/companies/viasat" },
  { name: "Yahoo", role: "Accessibility Engineer", period: "2016 – 2017", href: "/work/companies/yahoo" },
  { name: "10up", role: "Senior Web Engineer", period: "2015 – 2016", href: "/work/companies/10up" },
  { name: "Swell Energy", role: "Full-stack Engineer", period: "2022 – 2023", href: "/work/companies/swell-energy" },
  { name: "Long Game", role: "Senior React Native", period: "2022", href: "/work/companies/long-game" },
  { name: "Novant Health", role: "Full-stack Developer", period: "2019", href: "/work/companies/novant-health" },
  { name: "Red Ventures", role: "Frontend Engineer", period: "2015", href: "/work/companies/red-ventures" },
  { name: "Appalachian State", role: "Full-stack Developer", period: "2013 – 2015", href: "/work/companies/appalachian-state-university" },
];

export function CompanyCards() {
  return (
    <section>
      <Reveal>
        <Marker label="Professional highlights" className="mb-5" />
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mb-8 max-w-[52ch] text-[clamp(1rem,1.8vw,1.15rem)] font-light text-ink-soft">
          Full-time roles spanning startups to Fortune 500, focused on frontend
          architecture, design systems, and developer tooling.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {COMPANIES.map((c, i) => {
          const agent = c.tone === "agent";
          return (
            <Reveal key={c.name} delay={Math.min(i * 0.04, 0.2)}>
              <Link
                href={c.href}
                className={cn(
                  "group relative block overflow-hidden rounded-[16px] border border-hair bg-card-mood p-[clamp(18px,2.5vw,28px)] backdrop-blur-xl",
                  "transition-all duration-400 hover:-translate-y-0.5 hover:border-hair-strong",
                  agent
                    ? "hover:shadow-[0_20px_50px_-26px] hover:shadow-agent/30"
                    : "hover:shadow-[0_20px_50px_-26px] hover:shadow-shell/30",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-[2.5px] opacity-45 transition-opacity duration-400 group-hover:opacity-100",
                    agent ? "bg-agent" : "bg-shell",
                  )}
                />
                <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
                  {c.period}
                </div>
                <h3 className="mb-1.5 mt-1.5 text-[clamp(1.1rem,2vw,1.35rem)] font-normal tracking-[-0.015em] text-ink">
                  {c.name}
                </h3>
                <p className="m-0 text-[0.9rem] font-light text-ink-soft">{c.role}</p>
                <span className="mt-3 inline-block font-mono text-[12px] text-ink-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                  Read more →
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
