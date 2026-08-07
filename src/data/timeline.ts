import resumeData from "@/data/resume.json";

/**
 * Curated career timeline for the bespoke faces.
 *
 * Order + curated copy + tone live here; dates and titles are DERIVED from
 * `resume.json` by matching `company`, so there is one source of truth for the
 * facts. Non-employment nodes (e.g. open source) carry their own `period`.
 *
 * Aurora shows a tight highlight slice; Daybreak can show the fuller arc.
 */

interface ResumeWork {
  name: string;
  position: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  location?: string;
}

const work = ((resumeData as { work?: ResumeWork[] }).work ?? []);

function findWork(company: string): ResumeWork | undefined {
  return work.find((w) => w.name === company);
}

function yearOf(date?: string): string {
  return date ? date.slice(0, 4) : "";
}

function derivePeriod(company?: string): string {
  const w = company ? findWork(company) : undefined;
  if (!w) return "";
  const start = yearOf(w.startDate);
  const end = w.endDate ? yearOf(w.endDate) : "now";
  return start && start !== end ? `${start} – ${end}` : start || end;
}

export interface TimelineNode {
  /** company name — must match a resume.json work[].name to derive dates/title */
  company?: string;
  /** display role; falls back to the resume position */
  role: string;
  /** resolved date range (derived from resume unless overridden) */
  period: string;
  /** curated one-line blurb */
  blurb: string;
  /** signal color: agent (AI era) or shell (web era) */
  tone: "shell" | "agent";
}

interface TimelineSeed {
  company?: string;
  role: string;
  period?: string;
  blurb: string;
  tone?: "shell" | "agent";
}

const seeds: TimelineSeed[] = [
  {
    company: "Duke Energy",
    role: "Agentic Engineer · Duke Energy",
    blurb: "Built the AI orchestration layer running autonomous agents in production.",
    tone: "agent",
  },
  {
    company: "Twilio Inc.",
    role: "Senior Web Engineer · Twilio",
    blurb:
      "Owned twilio.com and its sub-sites. Built the React design system and the SIGNAL Hackpack hardware badge.",
  },
  {
    company: "Viasat",
    role: "Senior React Engineer · Viasat",
    blurb: "React for in-flight entertainment. Software that ships at 35,000 feet.",
  },
  {
    company: "Yahoo",
    role: "Accessibility Engineer · Yahoo",
    blurb: "On the core accessibility team, making the web work for everyone.",
  },
  {
    company: "10up",
    role: "Senior Web Engineer · 10up",
    blurb: "On the Electron team, building desktop apps out of web tech before that was normal.",
  },
  {
    company: "Flymore (Startup)",
    role: "Co-Founder · Flymore Academy",
    blurb:
      "Taught kids to build FPV drones. Ran Charlotte’s first drone race, a Drone Nationals qualifier.",
  },
  {
    company: "Appalachian State University",
    role: "Full-Stack Web Developer · App State",
    blurb: "Where the shipping started. Full-stack work for the university while I finished my CS degree.",
  },
  {
    role: "Open source · independent",
    period: "since 2008",
    blurb:
      "An XSPF jukebox that Hype Machine picked up, then CrossOver, then dozens of libraries. Arctic Code Vault Contributor.",
  },
];

export const timeline: TimelineNode[] = seeds.map((s) => ({
  company: s.company,
  role: s.role,
  period: s.period ?? derivePeriod(s.company),
  blurb: s.blurb,
  tone: s.tone ?? "shell",
}));

/** Tight highlight slice for the Aurora home. */
export const timelineHighlights: TimelineNode[] = [
  timeline[0], // Duke — agentic
  timeline[1], // Twilio
  timeline[3], // Yahoo — a11y
  timeline[5], // Flymore — drones
  timeline[6], // App State — origin
  timeline[7], // open source
];
