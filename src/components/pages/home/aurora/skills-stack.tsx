import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import resumeData from "@/data/resume.json";

const LEVEL_STYLE: Record<string, { color: string; bg: string }> = {
  Expert: { color: "text-shell", bg: "bg-shell/15" },
  Senior: { color: "text-ink-soft", bg: "bg-ink/10" },
  Evolving: { color: "text-agent", bg: "bg-agent/15" },
};

export function AuroraSkills() {
  const skills = resumeData.skills;

  return (
    <section className="px-[clamp(20px,5vw,64px)] py-[clamp(90px,16vh,200px)]">
      <div className="mx-auto w-full max-w-[1120px]">
        <Reveal>
          <Marker label="The toolkit" tone="agent" className="mb-[26px]" />
        </Reveal>
        <Reveal>
          <h2 className="m-0 mb-[clamp(40px,6vh,70px)] max-w-[22ch] text-balance text-[clamp(1.7rem,3.6vw,2.6rem)] font-light tracking-[-0.02em] text-ink">
            Twenty years of tools. Five disciplines.
          </h2>
        </Reveal>

        <div className="space-y-[clamp(18px,3vh,30px)]">
          {skills.map((cat, i) => {
            const style = LEVEL_STYLE[cat.level] ?? LEVEL_STYLE.Senior;
            return (
              <Reveal key={cat.name} delay={Math.min(i * 0.06, 0.24)}>
                <div className="group flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-[clamp(16px,3vw,40px)]">
                  <div className="flex shrink-0 items-center gap-3 sm:w-[170px]">
                    <span className="text-[clamp(1.05rem,1.8vw,1.2rem)] font-normal tracking-[-0.01em] text-ink">
                      {cat.name}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
                        style.bg,
                        style.color,
                      )}
                    >
                      {cat.level}
                    </span>
                  </div>
                  <p className="m-0 text-[clamp(0.9rem,1.5vw,1.02rem)] font-light text-ink-mute">
                    {cat.keywords.join(" · ")}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
