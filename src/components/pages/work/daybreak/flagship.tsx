import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { flagshipProjects } from "@/data/projects";

/** The flagship work, in editorial rows rather than Aurora's constellation. */
export function DaybreakFlagship() {
  return (
    <section id="work" className="px-[clamp(20px,5vw,56px)] py-[clamp(60px,9vh,120px)]">
      <div className="mx-auto w-full max-w-[940px]">
        <Reveal blur={0}>
          <Marker label="What I’m building" tone="agent" className="mb-6" />
        </Reveal>
        <Reveal blur={0}>
          <h2 className="m-0 mb-[clamp(30px,5vh,56px)] max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium tracking-[-0.02em] text-ink">
            A handful of things I&rsquo;d put my name on.
          </h2>
        </Reveal>

        <div className="grid gap-[clamp(14px,2vw,20px)]">
          {flagshipProjects.map((p, i) => {
            const agent = p.tone === "agent";
            return (
              <Reveal key={p.name} blur={0} delay={Math.min(i * 0.05, 0.2)}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-[clamp(16px,3vw,34px)] rounded-[18px] border border-hair bg-ground-2 p-[clamp(22px,3vw,32px)] transition-all duration-500 hover:-translate-y-1 hover:border-hair-strong hover:shadow-[0_30px_60px_-34px] hover:shadow-agent/25 max-[640px]:grid-cols-1"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "min-h-[44px] w-[3px] self-stretch rounded-[3px] max-[640px]:h-[3px] max-[640px]:min-h-0 max-[640px]:w-11",
                      agent ? "bg-agent" : "bg-shell",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                      {p.kind}
                    </span>
                    <h3 className="mb-2 mt-1.5 text-[clamp(1.2rem,2.2vw,1.55rem)] font-medium tracking-[-0.015em] text-ink">
                      {p.name}
                    </h3>
                    <p className="m-0 max-w-[52ch] text-[0.96rem] text-ink-soft">{p.description}</p>
                  </span>
                  <span className="whitespace-nowrap text-right max-[640px]:text-left">
                    <span
                      className={cn(
                        "block font-mono text-[12px]",
                        agent ? "text-agent" : "text-shell",
                      )}
                    >
                      {p.stat}
                    </span>
                    <span className="font-mono text-[13px] text-ink-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-agent">
                      Open ↗
                    </span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
