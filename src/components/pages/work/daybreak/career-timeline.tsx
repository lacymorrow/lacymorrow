import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { timeline } from "@/data/timeline";

/** The full career arc — the credibility spine of the Daybreak face. */
export function CareerTimeline() {
  return (
    <section className="px-[clamp(20px,5vw,56px)] py-[clamp(70px,12vh,150px)]">
      <div className="mx-auto w-full max-w-[940px]">
        <Reveal blur={0}>
          <Marker label="The arc" className="mb-6" />
        </Reveal>
        <Reveal blur={0}>
          <h2 className="m-0 mb-3 max-w-[20ch] text-balance text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink">
            Two decades of shipping. <span className="font-serif font-normal italic">One direction.</span>
          </h2>
        </Reveal>
        <Reveal blur={0}>
          <p className="mb-14 max-w-[58ch] text-[clamp(1.05rem,1.8vw,1.24rem)] text-ink-soft">
            From the early web to autonomous agents, every step has pointed the same way. I want{" "}
            <span className="font-serif italic text-ink">
              software that understands what you mean, and does it with you.
            </span>
          </p>
        </Reveal>

        <ol className="ml-1.5 list-none border-l border-hair-strong p-0">
          {timeline.map((node, i) => (
            <Reveal key={node.role} blur={0} delay={Math.min(i * 0.04, 0.24)}>
              <li className="group relative pb-[34px] pl-[30px] last:pb-0">
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[-5px] top-[6px] h-[9px] w-[9px] rounded-full border-2 bg-ground transition-all duration-300",
                    node.tone === "agent" ? "border-agent" : "border-shell",
                    "group-hover:bg-agent group-hover:shadow-[0_0_0_5px] group-hover:shadow-agent/15",
                  )}
                />
                <div className="font-mono text-[12px] tracking-[0.04em] text-ink-mute">
                  {node.period}
                </div>
                <div className="mb-1 mt-1 text-[clamp(1.05rem,1.9vw,1.25rem)] font-medium tracking-[-0.01em] text-ink">
                  {node.role}
                </div>
                <p className="m-0 max-w-[54ch] text-[0.95rem] text-ink-soft">{node.blurb}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
