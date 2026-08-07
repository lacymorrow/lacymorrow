import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";

export function AuroraInvitation() {
  return (
    <section id="invite" className="px-[clamp(20px,5vw,64px)] py-[clamp(90px,15vh,200px)]">
      <div className="mx-auto w-full max-w-[1120px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[26px] border border-hair bg-card-mood p-[clamp(38px,6vw,76px)] text-center backdrop-blur-xl">
            <h2 className="m-0 mb-[22px] text-balance text-[clamp(1.8rem,4.2vw,3rem)] font-light tracking-[-0.025em] text-ink">
              Building something that matters?
            </h2>
            <p className="mx-auto mb-[34px] max-w-[44ch] text-[clamp(1.02rem,1.8vw,1.18rem)] font-light text-ink-soft">
              I&rsquo;m available to lead your next project, build your next product, or help you think
              through your next idea.
            </p>
            <div className="inline-flex flex-wrap justify-center gap-3.5">
              <a
                href="mailto:me@lacymorrow.com"
                className="rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-ground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px] hover:shadow-agent/45"
              >
                Start a conversation
              </a>
              <a
                href="https://github.com/lacymorrow"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-hair-strong px-7 py-3.5 text-[15px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-agent"
              >
                See the code
              </a>
            </div>
            <p className="mt-[30px] font-mono text-[13px] text-ink-mute">
              Here to evaluate me for a role?{" "}
              <Link
                href="/work"
                className="border-b border-hair-strong text-shell transition-colors hover:border-shell"
              >
                See the work-focused view →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
