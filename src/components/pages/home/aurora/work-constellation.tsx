import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { flagshipProjects } from "@/data/projects";

export function AuroraWork() {
  return (
    <section id="work" className="px-[clamp(20px,5vw,64px)] py-[clamp(60px,8vh,120px)]">
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mb-[clamp(40px,7vh,84px)]">
          <Reveal>
            <Marker label="What I’m building" tone="agent" className="mb-[26px]" />
          </Reveal>
          <Reveal>
            <h2 className="m-0 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.6rem)] font-light tracking-[-0.02em] text-ink">
              A handful of things I&rsquo;d put my name on.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(16px,2.2vw,26px)] md:grid-cols-2">
          {flagshipProjects.map((p, i) => {
            const agent = p.tone === "agent";
            return (
              <Reveal key={p.name} delay={Math.min(i * 0.08, 0.24)}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative block h-full overflow-hidden rounded-[20px] border border-hair bg-card-mood p-[clamp(26px,3vw,40px)] backdrop-blur-xl",
                    "transition-all duration-500 hover:-translate-y-1.5 hover:border-hair-strong",
                    agent
                      ? "hover:shadow-[0_24px_60px_-30px] hover:shadow-agent/45"
                      : "hover:shadow-[0_24px_60px_-30px] hover:shadow-shell/50",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 w-[3px] opacity-55 transition-opacity duration-500 group-hover:opacity-100",
                      agent ? "bg-agent" : "bg-shell",
                    )}
                  />
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute">
                    {p.kind}
                  </div>
                  <h3 className="mb-3 mt-3 text-[clamp(1.35rem,2.4vw,1.85rem)] font-normal tracking-[-0.02em] text-ink">
                    {p.name}
                  </h3>
                  <p className="mb-[22px] max-w-[40ch] text-[0.98rem] font-light text-ink-soft">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between gap-3.5">
                    <span
                      className={cn(
                        "font-mono text-[12px]",
                        agent ? "text-agent" : "text-shell",
                      )}
                    >
                      {p.stat}
                    </span>
                    <span className="font-mono text-[13px] text-ink-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                      Open ↗
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
