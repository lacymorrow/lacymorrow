import { useEffect, useState } from "react";
import Silk from "@/components/ui/react-bits/silk";
import { FleetSubscribe } from "@/components/pages/home/aurora/fleet-subscribe";
import Socials from "@/components/layout/socials";

const ROLES = [
	"software engineer",
	"agent builder",
	"drone pilot",
	"open-source maintainer",
];

interface Project {
	title: string;
	description: string;
	href: string;
	featured?: boolean;
	accent?: string;
}

const PROJECTS: Project[] = [
	{
		title: "Lacy Shell",
		description:
			"Talk to your terminal. Natural language routes to AI agents.",
		href: "https://lacy.sh",
		featured: true,
		accent: "#8B5CF6",
	},
	{
		title: "Uibrary",
		description: "Production-ready UI components.",
		href: "https://uibrary.com",
	},
	{
		title: "Build and Serve",
		description: "Senior engineering for teams that need it fast.",
		href: "https://buildandserve.com",
	},
	{
		title: "Juno",
		description:
			"AI that sees and controls your desktop. Computer Use, local.",
		href: "https://junebug.ai",
		featured: true,
		accent: "#F59E0B",
	},
	{
		title: "Vibe Rehab",
		description: "Code rescue for AI-generated projects.",
		href: "https://vibe.rehab",
	},
	{
		title: "shipx",
		description: "Interactive release CLI. Bump, tag, publish, ship.",
		href: "https://github.com/lacymorrow/shipx",
	},
	{
		title: "Shipkit",
		description: "Ship Next.js apps in 30 seconds. Auth, payments, AI.",
		href: "https://shipkit.io",
		featured: true,
		accent: "#3B82F6",
	},
	{
		title: "Paperclip Hub",
		description: "Plugin hub for Paperclip AI agents.",
		href: "https://cliphub.fyi",
	},
	{
		title: "OpenClaw Trading",
		description: "Autonomous AI trading agents.",
		href: "https://github.com/lacymorrow/openclaw-alpaca-trading-skill",
	},
	{
		title: "CrossOver",
		description: "Gaming overlay for any screen. 1.2K stars.",
		href: "https://gh.lacymorrow.com/crossover",
		featured: true,
		accent: "#EF4444",
	},
	{
		title: "MCP Servers",
		description: "AI agent desktop automation tools.",
		href: "https://github.com/lacymorrow",
	},
	{
		title: "Hitchhiker's Guide AI",
		description: "My favorite book, now an AI.",
		href: "https://hitchhikersgalaxy.guide",
	},
	{
		title: "Cloud0",
		description: "100% private, offline AI chat.",
		href: "https://cloud0.dev",
	},
	{
		title: "Generative Website",
		description: "Pages generated on the fly.",
		href: "https://gen.lacy.sh",
	},
	{
		title: "Interactive Globe",
		description: "Real-time data on a 3D globe.",
		href: "https://globe.lacy.sh",
	},
	{
		title: "XSPF Jukebox",
		description: "One of the original web audio players.",
		href: "https://xspf-jukebox.vercel.app",
	},
];

const NAV = ["Work", "Play", "Writing", "Contact"];
const FOOTER_NAV = ["Work", "Play", "Writing", "About", "Contact"];

export function WorkshopHome() {
	const [roleIndex, setRoleIndex] = useState(0);
	const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");

	useEffect(() => {
		const id = setInterval(() => {
			setPhase("exit");
			setTimeout(() => {
				setRoleIndex((i) => (i + 1) % ROLES.length);
				setPhase("enter");
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setPhase("idle");
					});
				});
			}, 300);
		}, 3500);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="dark">
			<style>{`
				body { background: #09090b !important; }
			`}</style>

			{/* Hero */}
			<section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
				<div className="absolute inset-0 opacity-25">
					<Silk
						speed={2}
						scale={1}
						colors={["#4C3A5E", "#8B4580", "#A03050"]}
						colorMix={0.8}
						noiseIntensity={1.2}
						rotation={0}
					/>
				</div>
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#09090b] to-transparent" />

				<nav className="absolute right-4 top-5 z-10 flex gap-5 sm:right-8 sm:top-8 sm:gap-7">
					{NAV.map((name) => (
						<a
							key={name}
							href={`/${name.toLowerCase()}`}
							className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-600 transition-colors hover:text-zinc-300"
						>
							{name}
						</a>
					))}
				</nav>

				<div className="relative z-10 px-6 text-center">
					<h1 className="text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem]">
						Lacy Morrow
					</h1>
					<div className="mx-auto mt-5 h-6 overflow-hidden">
						<p
							className={[
								"font-mono text-sm tracking-wide text-zinc-500 transition-all duration-300",
								phase === "exit" && "-translate-y-full opacity-0",
								phase === "enter" && "translate-y-full opacity-0 !duration-0",
								phase === "idle" && "translate-y-0 opacity-100",
							]
								.filter(Boolean)
								.join(" ")}
						>
							{ROLES[roleIndex]}
						</p>
					</div>
				</div>
			</section>

			{/* Project Wall */}
			<section className="px-4 pb-24 pt-8 sm:px-6">
				<div
					className="mx-auto grid max-w-6xl grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
					style={{ gridAutoFlow: "dense" }}
				>
					{PROJECTS.map((p) => {
						const isExternal = p.href.startsWith("http");
						return (
							<a
								key={p.title}
								href={p.href}
								target={isExternal ? "_blank" : undefined}
								rel={isExternal ? "noopener noreferrer" : undefined}
								className={[
									"group rounded-lg border border-zinc-800/60 bg-zinc-900/40 transition-all duration-200",
									"hover:border-zinc-700 hover:bg-zinc-900/80",
									p.featured
										? "col-span-1 p-5 sm:col-span-2 sm:p-6"
										: "p-4",
								].join(" ")}
							>
								{p.featured && p.accent && (
									<div
										className="mb-3 h-px w-8 rounded-full opacity-80"
										style={{ backgroundColor: p.accent }}
									/>
								)}
								<h3
									className={[
										"font-medium text-zinc-100",
										p.featured ? "text-[17px]" : "text-sm",
									].join(" ")}
								>
									{p.title}
								</h3>
								<p
									className={[
										"mt-1 leading-relaxed",
										p.featured
											? "text-sm text-zinc-400"
											: "text-xs text-zinc-500",
									].join(" ")}
								>
									{p.description}
								</p>
							</a>
						);
					})}
				</div>
			</section>

			{/* Fleet Log + Footer */}
			<footer className="px-6 pb-12">
				<div className="mx-auto max-w-md text-center">
					<p className="mb-4 font-mono text-xs text-zinc-600">
						Thirteen agents run the ops behind everything here.
					</p>
					<FleetSubscribe source="home-workshop" />
				</div>

				<div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-zinc-800/40 pt-6">
					<nav className="flex flex-wrap gap-4 sm:gap-5">
						{FOOTER_NAV.map((name) => (
							<a
								key={name}
								href={`/${name.toLowerCase()}`}
								className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-600 transition-colors hover:text-zinc-300"
							>
								{name}
							</a>
						))}
					</nav>
					<Socials />
				</div>

				<div className="mt-8 text-center">
					<a
						href="/?grove=1"
						className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-700 transition-colors hover:text-zinc-400"
					>
						&#9992; fly the 3d world
					</a>
				</div>
			</footer>
		</div>
	);
}
