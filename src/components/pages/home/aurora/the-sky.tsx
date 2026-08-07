import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";

export function AuroraSky() {
  return (
    <section className="px-[clamp(20px,5vw,64px)] py-[clamp(90px,16vh,200px)]">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center gap-[clamp(30px,5vw,70px)] md:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <Marker label="Above the ground" className="mb-[26px]" />
          </Reveal>
          <Reveal>
            <h2 className="m-0 mb-[26px] text-balance text-[clamp(1.8rem,4vw,2.9rem)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
              There&rsquo;s another life, a few hundred feet up.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="m-0 mb-[18px] max-w-[42ch] text-[clamp(1.02rem,1.7vw,1.18rem)] font-light text-ink-soft">
              I fly FPV drones and shoot aerial cinematography. I co-founded{" "}
              <strong className="font-medium text-ink">Flymore Academy</strong>, taught kids to build
              their own quads, and ran Charlotte&rsquo;s first drone race, a Drone&nbsp;Nationals
              qualifier.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="m-0 max-w-[42ch] text-[clamp(1.02rem,1.7vw,1.18rem)] font-light text-ink-soft">
              It&rsquo;s the same instinct as the code. Build the machine, then point it somewhere no
              one&rsquo;s been. The engineering is just the runway.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div
            aria-hidden
            className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-hair"
            style={{
              background: [
                "radial-gradient(120% 80% at 50% 120%, hsl(var(--agent) / 0.35), transparent 55%)",
                "radial-gradient(90% 60% at 30% 10%, hsl(var(--shell) / 0.30), transparent 50%)",
                "linear-gradient(180deg, hsl(var(--ground-2)), hsl(var(--ground)))",
              ].join(", "),
            }}
          >
            {/* a faint flight arc across the horizon */}
            <div
              className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--shell) / 0.5) 30%, hsl(var(--agent) / 0.7) 55%, transparent)",
              }}
            />
            <div
              className="absolute left-[55%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-agent"
              style={{ boxShadow: "0 0 16px 2px hsl(var(--agent) / 0.7)" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
