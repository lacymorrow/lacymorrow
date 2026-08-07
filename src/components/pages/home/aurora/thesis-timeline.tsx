import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { timelineHighlights } from "@/data/timeline";

export function AuroraThesis() {
  return (
    <section className="px-[clamp(20px,5vw,64px)] py-[clamp(90px,15vh,200px)]">
      <div className="mx-auto w-full max-w-[1120px]">
        <Reveal>
          <Marker label="The through-line" className="mb-[26px]" />
        </Reveal>
        <Reveal>
          <h2 className="m-0 mb-[30px] max-w-[20ch] text-balance text-[clamp(1.9rem,4.4vw,3.3rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink">
            Two decades of shipping. One direction.
          </h2>
        </Reveal>
        <div className="max-w-[62ch]">
          <Reveal delay={0.06}>
            <p className="m-0 mb-5 text-[clamp(1.02rem,1.7vw,1.2rem)] font-light text-ink-soft">
              It started with TI-83 games and a jukebox for the early web. Then the web itself:{" "}
              <strong className="font-medium text-ink">twilio.com</strong>, design systems at{" "}
              <strong className="font-medium text-ink">Credit Karma</strong>, accessibility on
              Yahoo&rsquo;s core team, a crosshair overlay running on more than a million screens.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="m-0 mb-5 text-[clamp(1.02rem,1.7vw,1.2rem)] font-light text-ink-soft">
              Every project since has pointed the same way. I want software that understands what you{" "}
              <span className="text-ink">mean</span> and does it{" "}
              <strong className="font-medium text-ink">with</strong> you. Agents that see your
              screen, speak your shell, and carry the weight.
            </p>
          </Reveal>
        </div>

        <ol className="mt-[clamp(46px,7vh,78px)] ml-1.5 max-w-[60ch] list-none border-l border-hair-strong p-0">
          {timelineHighlights.map((node, i) => (
            <Reveal key={node.role} delay={Math.min(i * 0.06, 0.3)}>
              <li className="group relative pb-[clamp(26px,4vh,36px)] pl-[30px] last:pb-0">
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[-5px] top-[5px] h-[9px] w-[9px] rounded-full border-2 bg-ground transition-all duration-300",
                    node.tone === "agent"
                      ? "border-agent shadow-[0_0_10px] shadow-agent/45"
                      : "border-shell shadow-[0_0_10px] shadow-shell/50",
                    "group-hover:bg-agent group-hover:shadow-[0_0_18px] group-hover:shadow-agent/45",
                  )}
                />
                <div className="font-mono text-[12px] tracking-[0.05em] text-ink-mute">
                  {node.period}
                </div>
                <div className="mb-[5px] mt-1 text-[clamp(1.02rem,1.9vw,1.22rem)] font-light tracking-[-0.01em] text-ink">
                  {node.role}
                </div>
                <p className="m-0 max-w-[52ch] text-[0.95rem] font-light text-ink-soft">
                  {node.blurb}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
