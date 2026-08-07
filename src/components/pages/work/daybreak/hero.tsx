import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";

export function DaybreakHero() {
  return (
    <section className="relative flex min-h-[90svh] flex-col justify-center px-[clamp(20px,5vw,56px)] pb-[90px] pt-[140px]">
      <div className="mx-auto w-full max-w-[940px]">
        <Reveal blur={0}>
          <Marker label="Engineer · Builder · Optimist" className="mb-7" />
        </Reveal>
        <Reveal blur={0} delay={0.05}>
          <h1 className="m-0 mb-8 max-w-[17ch] text-balance text-[clamp(2.5rem,6.6vw,5.2rem)] font-medium leading-[1.04] tracking-[-0.03em] text-ink">
            Toward <span className="font-serif font-normal italic">harmony</span> between humans and
            machines.
          </h1>
        </Reveal>
        <Reveal blur={0} delay={0.1}>
          <p className="m-0 max-w-[44ch] text-[clamp(1.05rem,2vw,1.3rem)] text-ink-soft">
            I&rsquo;m Lacy Morrow. I&rsquo;ve shipped open source for two decades. Now I build the AI
            agents that will work beside us. This is the working record.
          </p>
        </Reveal>
        <Reveal blur={0} delay={0.15}>
          <div className="mt-[clamp(46px,8vh,80px)] inline-flex items-center gap-3 font-mono text-[11.5px] uppercase tracking-[0.16em] text-ink-mute">
            <span className="h-[7px] w-[7px] rounded-full bg-agent" aria-hidden /> the arc, the work,
            the receipts
          </div>
        </Reveal>
      </div>
    </section>
  );
}
