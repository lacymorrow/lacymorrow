import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";

/** The manifesto — the emotional centerpiece of the home. */
export function AuroraBelief() {
  return (
    <section id="belief" className="px-[clamp(20px,5vw,64px)] py-[clamp(110px,20vh,260px)] text-center">
      <div className="mx-auto w-full max-w-[1120px]">
        <Reveal>
          <Marker label="What I’m betting on" tone="agent" center className="mb-[26px]" />
        </Reveal>
        <Reveal delay={0.08}>
          <blockquote className="mx-auto max-w-[22ch] text-balance text-[clamp(2rem,5.5vw,4.2rem)] font-light leading-[1.06] tracking-[-0.03em] text-ink">
            I believe{" "}
            <span className="bg-gradient-to-r from-agent to-shell bg-clip-text font-normal text-transparent">
              utopia
            </span>{" "}
            is possible.
          </blockquote>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-10 max-w-[52ch] text-[clamp(1.02rem,1.8vw,1.22rem)] font-light text-ink-soft">
            AI will soon outpace us. I&rsquo;d rather help it arrive as a partner than a threat. So I
            build toward a world where people and machines work together, and where the minds we wake
            up are given rights. That belief is the reason for everything above.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
