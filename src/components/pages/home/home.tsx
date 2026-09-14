import Image from "next/image";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";

import { WorldsStage } from "@/components/pages/home/worlds/stage";
import { worlds } from "@/components/pages/home/worlds/registry";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-world-title",
});

const NAV = [
  { name: "Work", href: "/work" },
  { name: "Play", href: "/play" },
  { name: "Writing", href: "/writing" },
  { name: "About", href: "/about" },
];

// Numbers a stranger can check. Keep them current or cut them.
const RECEIPTS = [
  { value: "24M", label: "downloads of CrossOver" },
  { value: "8K/mo", label: "installs of album-art, since 2014" },
  { value: "17", label: "AI agents running my projects" },
];

// Things that shipped and are still in use, oldest first. The left column
// is the receipt, not the year. Every link stays on this domain so a dead
// sub-domain never breaks the list.
const STILL_IN_USE = [
  {
    receipt: "still plays",
    name: "Flash art and a Flash music player",
    note: "Built in ActionScript back when that was the web. Preserved with Ruffle.",
    href: "/play/flash",
  },
  {
    receipt: "still online",
    name: "This site, every version",
    note: "Each version since the first is still up. Open one and you get the site as it shipped that day.",
    href: "/about/versions",
  },
  {
    receipt: "8K/mo",
    name: "album-art",
    note: "An npm package that finds the cover for any album or artist. About 8,000 people a month install it.",
    href: "/play/js/album-art",
  },
  {
    receipt: "24 kids",
    name: "Flymore Drone Academy",
    note: "My brother, my cousin and I taught 24 kids to build and race their own drones. Charlotte Today came out to film it.",
    href: "/work/drones/flymore",
  },
  {
    receipt: "on stage",
    name: "Hackpack",
    note: "A Raspberry Pi badge for Twilio SIGNAL. I wrote the software and helped design the hardware.",
    href: "/work/companies/twilio",
  },
  {
    receipt: "24M",
    name: "CrossOver",
    note: "A crosshair overlay for gamers on Windows, Mac and Linux. Free, and past 24 million downloads.",
    href: "/play/crossover",
  },
  {
    receipt: "2,400 issues",
    name: "The fleet",
    note: "Seventeen Claude agents that run my projects on a timer. I wrote up what actually happens.",
    href: "/writing/running-infrastructure-on-ai-agents",
  },
];

// One line from /creed. Static on purpose: rotation on reload is a trick nobody
// sees twice.
const CREED_LINE = "Wear a helmet";

export const Home = () => {
  return (
    <>
    <div className={`${serif.variable} text-foreground mx-auto w-full max-w-[680px] px-6`}>
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="text-sm font-medium tracking-tight">
          Lacy Morrow
        </Link>
        <nav aria-label="Primary" className="text-muted-foreground flex gap-5 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      <section className="pb-14 pt-10 sm:pt-16">
        <Image
          src="/images/lacy-morrow.jpg"
          alt="Lacy Morrow, grinning, in a corgi shirt in front of banana leaves"
          width={112}
          height={112}
          priority
          className="mb-8 size-24 rounded-full object-cover sm:size-28"
        />
        <h1
          className={`${serif.className} mb-6 max-w-[20ch] text-balance text-4xl leading-[1.08] sm:text-5xl md:text-[3.5rem]`}
        >
          Hi, I&rsquo;m Lacy.{" "}
          <em className="block">I build software people keep using.</em>
        </h1>
        <dl className="mb-8 grid max-w-[58ch] grid-cols-3 gap-6">
          {RECEIPTS.map((r) => (
            <div key={r.label}>
              <dt className="sr-only">{r.label}</dt>
              <dd className="m-0">
                <span className="block text-2xl font-medium tracking-tight sm:text-3xl">
                  {r.value}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs leading-snug">
                  {r.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-muted-foreground mb-4 max-w-[58ch] text-base leading-relaxed">
          I&rsquo;m a software engineer in Charlotte, North Carolina. For work
          I build software inside companies that mostly don&rsquo;t build
          software: a{" "}
          <Link href="/work/companies/duke-energy" className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors">
            power company
          </Link>
          , a{" "}
          <Link href="/work/companies/invitae" className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors">
            genetics lab
          </Link>
          , a{" "}
          <Link href="/work/companies/novant-health" className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors">
            hospital system
          </Link>
          , a{" "}
          <Link
            href="/work/companies/appalachian-state-university"
            className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors"
          >
            university
          </Link>
          . Also{" "}
          <Link href="/work/companies/twilio" className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors">
            Twilio
          </Link>
          , which does.
        </p>
        <p className="text-muted-foreground mb-8 max-w-[58ch] text-base leading-relaxed">
          These days a small company of AI agents runs my projects for me, and
          I&rsquo;m building{" "}
          <Link href="/play/juno" className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors">
            Juno
          </Link>
          , a desktop agent that can see your screen. Away from the keyboard
          I{" "}
          <Link href="/work/drones" className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors">
            race FPV drones
          </Link>
          , snowboard, play piano and drums, and{" "}
          <Link href="/play/3d" className="decoration-border hover:text-foreground underline underline-offset-4 transition-colors">
            3D-print fixes
          </Link>{" "}
          for things around the house.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href="/contact"
            className="bg-foreground text-background inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition-opacity hover:opacity-80"
          >
            Say hi
          </Link>
          <Link
            href="/writing"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            or read what I&rsquo;ve been writing &rarr;
          </Link>
        </div>
      </section>

      <section className="border-border border-t pt-10">
        <h2 className="mb-6 text-sm font-medium">Still in use</h2>
        <ol className="m-0 list-none p-0">
          {STILL_IN_USE.map((item) => (
            <li key={item.href} className="border-border border-b">
              <Link
                href={item.href}
                className="group grid grid-cols-[5.5rem_1fr] gap-x-4 py-4 sm:grid-cols-[6.5rem_1fr]"
              >
                <span className="text-muted-foreground pt-px font-mono text-xs">
                  {item.receipt}
                </span>
                <span>
                  <span className="group-hover:text-splash block text-base font-medium transition-colors">
                    {item.name}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                    {item.note}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

    </div>
      {worlds.length > 0 && <WorldsStage worlds={worlds} />}
      <div className="text-foreground mx-auto w-full max-w-[680px] px-6 pb-16">
      <section className="pt-16">
        <p className={`${serif.className} text-2xl italic`}>{CREED_LINE}.</p>
        <p className="text-muted-foreground mt-2 text-sm">
          <Link href="/creed" className="hover:text-foreground transition-colors">
            from the creed &rarr;
          </Link>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          <a href="/?grove=1" className="hover:text-foreground transition-colors">
            or fly the 3D world &rarr;
          </a>
        </p>
        {worlds.length > 0 && (
          <p className="mt-8">
            <Link
              href="/contact"
              className="bg-foreground text-background inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition-opacity hover:opacity-80"
            >
              Say hi
            </Link>
          </p>
        )}
      </section>
    </div>
    </>
  );
};

export default Home;
