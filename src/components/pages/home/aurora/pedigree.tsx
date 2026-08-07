import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";

const COMPANIES = ["Twilio", "Credit Karma", "Duke Energy", "Viasat", "Yahoo"];

const CREDS = [
  { label: "Arctic Code Vault", strong: "Contributor" },
  { strong: "1,200+", label: "GitHub stars" },
  { strong: "~130", label: "repositories, mostly open" },
  { label: "B.S. Computer Science" },
];

const OS_CONTRIBUTIONS = ["Electron", "NW.js", "cdnjs"];

export function AuroraPedigree() {
  return (
    <section className="px-[clamp(20px,5vw,64px)] py-[clamp(90px,16vh,200px)] text-center">
      <div className="mx-auto w-full max-w-[1120px]">
        <Reveal>
          <Marker label="The receipts" center className="mb-[26px]" />
        </Reveal>
        <Reveal>
          <p className="mx-auto mb-10 max-w-[24ch] text-balance text-[clamp(1.3rem,3vw,2rem)] font-light tracking-[-0.02em] text-ink">
            The ideas are new. The hands have been shipping for a long time.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div
            aria-label="Companies worked with"
            className="mb-10 flex flex-wrap justify-center gap-x-[clamp(22px,4vw,56px)] gap-y-4"
          >
            {COMPANIES.map((c) => (
              <span
                key={c}
                className="text-[clamp(1rem,2.2vw,1.5rem)] font-medium text-ink-mute transition-colors duration-300 hover:text-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="inline-flex flex-wrap justify-center gap-x-3 gap-y-2.5">
            {CREDS.map((c, i) => (
              <span
                key={i}
                className="rounded-full border border-hair px-[15px] py-[7px] text-[12.5px] text-ink-soft"
              >
                {c.strong && <b className="font-semibold text-shell">{c.strong} </b>}
                {c.label}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mx-auto mt-5 text-[13px] font-light text-ink-mute">
            Open-source contributor to{" "}
            {OS_CONTRIBUTIONS.map((name, i) => (
              <span key={name}>
                {i > 0 && (i === OS_CONTRIBUTIONS.length - 1 ? ", and " : ", ")}
                <span className="font-medium text-ink-soft">{name}</span>
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <blockquote className="mx-auto mt-[clamp(40px,7vh,70px)] max-w-[52ch] border-l-2 border-shell/30 pl-6 text-left">
            <p className="m-0 text-[clamp(0.95rem,1.6vw,1.1rem)] font-light italic text-ink-soft">
              &ldquo;Lacy is an extremely talented engineer with a very broad range of skills.
              His work output is incredible. If there is any opportunity to work with Lacy, I
              take it. He is the definition of an A player.&rdquo;
            </p>
            <footer className="mt-3 font-mono text-[12px] text-ink-mute">
              — Ryan Kirkram, Senior Software Engineer at Yahoo
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
