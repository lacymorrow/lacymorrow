import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";

/** The manifesto, in the Daybreak editorial band. */
export function DaybreakBelief() {
  return (
    <section id="belief" className="px-[clamp(20px,5vw,56px)] py-[clamp(90px,16vh,220px)]">
      <div className="mx-auto w-full max-w-[940px]">
        <Reveal blur={0}>
          <div
            className="relative overflow-hidden rounded-[28px] border border-hair px-[clamp(28px,6vw,76px)] py-[clamp(44px,8vw,92px)] text-center shadow-[0_30px_60px_-34px] shadow-agent/25"
            style={{
              background:
                "radial-gradient(80% 120% at 50% -10%, hsl(var(--agent) / 0.1), transparent 60%), hsl(var(--ground-2))",
            }}
          >
            <Marker label="What I’m betting on" tone="agent" center className="mb-6" />
            <blockquote className="mx-auto max-w-[20ch] text-balance text-[clamp(2rem,5.4vw,4rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
              I believe{" "}
              <span className="bg-gradient-to-r from-agent to-aur-2 bg-clip-text font-serif font-normal italic text-transparent">
                utopia
              </span>{" "}
              is possible.
            </blockquote>
            <p className="mx-auto mt-8 max-w-[54ch] text-[clamp(1.02rem,1.7vw,1.2rem)] text-ink-soft">
              AI will soon outpace us. I&rsquo;d rather help it arrive as a partner than a threat. So
              I build toward a world where people and machines work together, and where the minds we
              wake up are given rights. That belief is the reason for everything above.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
