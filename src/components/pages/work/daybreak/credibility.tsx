import { Marker } from "@/components/faces/marker";
import { Reveal } from "@/components/ui/reveal";

const COMPANIES = ["Twilio", "Credit Karma", "Duke Energy", "Viasat", "Yahoo", "10up"];

const CREDS = [
  { label: "Arctic Code Vault", strong: "Contributor" },
  { strong: "1,200+", label: "GitHub stars" },
  { strong: "~130", label: "repositories, mostly open" },
  { label: "B.S. Computer Science" },
];

/** The receipts, in editorial rows — the credibility payload for recruiters. */
export function DaybreakCredibility() {
  return (
    <section className="px-[clamp(20px,5vw,56px)] py-[clamp(70px,12vh,150px)]">
      <div className="mx-auto w-full max-w-[940px]">
        <Reveal blur={0}>
          <Marker label="The receipts" className="mb-8" />
        </Reveal>

        <Reveal blur={0}>
          <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3.5 border-b border-hair pb-[30px]">
            <span className="min-w-[96px] font-mono text-[12px] uppercase tracking-[0.14em] text-ink-mute">
              Shipped for
            </span>
            <span className="flex flex-wrap gap-x-[26px] gap-y-3">
              {COMPANIES.map((c) => (
                <span
                  key={c}
                  className="text-[clamp(1.05rem,2vw,1.5rem)] font-medium text-ink"
                >
                  {c}
                </span>
              ))}
            </span>
          </div>
        </Reveal>

        <Reveal blur={0}>
          <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3.5 pt-[30px]">
            <span className="min-w-[96px] font-mono text-[12px] uppercase tracking-[0.14em] text-ink-mute">
              Proof
            </span>
            <span className="flex flex-wrap gap-2.5">
              {CREDS.map((c, i) => (
                <span
                  key={i}
                  className="rounded-full border border-hair bg-ground-2 px-[15px] py-[7px] text-[12.5px] text-ink-soft"
                >
                  {c.strong && <b className="font-semibold text-shell">{c.strong} </b>}
                  {c.label}
                </span>
              ))}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
