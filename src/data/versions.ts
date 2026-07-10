export interface SiteVersion {
	version: string;
	name: string;
	dateRange: string;
	techStack: string[];
	description: string;
	url: string;
	screenshot?: string;
	isCurrent: boolean;
}

export const versions: SiteVersion[] = [
	{
		version: "v4",
		name: "Aurora Daybreak",
		dateRange: "2024 – present",
		techStack: ["Next.js 16", "Nextra v2", "React 18", "Tailwind CSS", "TypeScript", "Vercel"],
		description:
			"The current era. Content-first portfolio built on Next.js Pages Router and Nextra v2. MDX pages, a shared component map, and a shadcn/ui design system on top of Tailwind. Deployed on Vercel with a two-face home layout and an evolving Aurora aesthetic.",
		url: "/",
		isCurrent: true,
	},
	{
		version: "v3",
		name: "Off-Canvas Landing",
		dateRange: "2014",
		techStack: ["Foundation 5", "Grunt", "jQuery"],
		description:
			"A minimal single-page landing built during my time at Twilio in San Francisco. Foundation 5 with an off-canvas nav on mobile, Grunt as the build pipeline, and a compact intro pointing out to social profiles. Fast, boring, on purpose.",
		url: "/v3/index.html",
		isCurrent: false,
	},
	{
		version: "v2",
		name: "Foundation Portfolio",
		dateRange: "2010 – 2013",
		techStack: ["Foundation", "jQuery", "Orangebox", "Google Fonts"],
		description:
			"The original full portfolio. Built on Foundation with jQuery and Orangebox for lightbox galleries, isotope filtering across a project grid, and an inline contact form. Snapshot of my Invitae-era San Francisco work — freelance side, open source, and Flash experiments still living side by side.",
		url: "/v2/index.html",
		isCurrent: false,
	},
];
