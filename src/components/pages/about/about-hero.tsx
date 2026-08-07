import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

export function AboutHero() {
  return (
    <section className="mb-8 rounded-[20px] border border-hair bg-card-mood px-[clamp(24px,4vw,48px)] py-[clamp(36px,6vh,72px)] backdrop-blur-xl">
      <Reveal>
        <Marker label="About" tone="shell" className="mb-5" />
      </Reveal>
      <Reveal delay={0.06}>
        <h1 className="m-0 mb-4 max-w-[20ch] text-[clamp(1.8rem,4vw,3rem)] font-light tracking-[-0.02em] text-ink">
          Lacy Morrow
        </h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="m-0 mb-6 max-w-[52ch] text-[clamp(1rem,1.8vw,1.2rem)] font-light text-ink-soft">
          Senior engineer building AI agents that control computers. Two decades
          shipping open source. Previously at Twilio and Credit Karma.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/work"
            className="inline-block rounded-full border border-hair-strong px-5 py-2 font-mono text-[12px] text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-agent hover:text-ink"
          >
            View work
          </Link>
          <Link
            href="/play"
            className="inline-block rounded-full border border-hair-strong px-5 py-2 font-mono text-[12px] text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-shell hover:text-ink"
          >
            View projects
          </Link>
          <a
            href="mailto:me@lacymorrow.com"
            className="inline-block rounded-full border border-hair-strong px-5 py-2 font-mono text-[12px] text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-agent hover:text-ink"
          >
            Contact
          </a>
        </div>
      </Reveal>
    </section>
  );
}
