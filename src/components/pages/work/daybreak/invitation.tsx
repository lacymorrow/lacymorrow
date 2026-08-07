import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";

export function DaybreakInvitation() {
  return (
    <section id="invite" className="px-[clamp(20px,5vw,56px)] py-[clamp(60px,10vh,130px)] text-center">
      <div className="mx-auto w-full max-w-[940px]">
        <Reveal blur={0}>
          <h2 className="m-0 mb-5 text-balance text-[clamp(1.8rem,4vw,2.9rem)] font-medium tracking-[-0.025em] text-ink">
            Building something <span className="font-serif font-normal italic">that matters?</span>
          </h2>
        </Reveal>
        <Reveal blur={0}>
          <p className="mx-auto mb-[30px] max-w-[44ch] text-[clamp(1.02rem,1.7vw,1.16rem)] text-ink-soft">
            I&rsquo;m available to lead your next project, build your next product, or help you think
            through your next idea.
          </p>
        </Reveal>
        <Reveal blur={0}>
          <div className="inline-flex flex-wrap justify-center gap-3.5">
            <a
              href="mailto:me@lacymorrow.com"
              className="rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-ground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px] hover:shadow-agent/40"
            >
              Start a conversation
            </a>
            <a
              href="https://github.com/lacymorrow"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-hair-strong px-7 py-3.5 text-[15px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-agent hover:text-agent"
            >
              See the code
            </a>
          </div>
        </Reveal>
        <Reveal blur={0}>
          <p className="mt-[30px] font-mono text-[13px] text-ink-mute">
            Prefer the fuller picture?{" "}
            <Link
              href="/"
              className="border-b border-hair-strong text-agent transition-colors hover:border-agent"
            >
              ← Back to the home view
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
