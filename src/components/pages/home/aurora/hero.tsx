import { FleetSubscribe } from "./fleet-subscribe";

const RECEIPTS = [
	{ strong: "since 2004", label: "shipping software" },
	{ strong: "1.2K ★", label: "CrossOver" },
	{ strong: "13", label: "agents in the fleet" },
];

export function FleetHero() {
	return (
		<section
			id="top"
			className="mx-auto w-full max-w-[680px] px-6 pb-16 pt-20"
		>
			<h1 className="mb-6 max-w-[22ch] text-balance text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
				I build AI agents that control computers. I run my life on them.
			</h1>

			<p className="mb-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
				Two decades shipping software. Creator of CrossOver, an open-source tool
				with 1.2K stars. Thirteen agents run the ops behind everything you see
				here.
			</p>

			<ul className="mb-8 flex list-none flex-wrap gap-x-3 gap-y-2 p-0 font-mono text-[12px]">
				{RECEIPTS.map((r) => (
					<li
						key={r.label}
						className="border border-border px-3 py-1 text-muted-foreground"
					>
						<b className="font-medium text-foreground">{r.strong}</b>{" "}
						<span>{r.label}</span>
					</li>
				))}
			</ul>

			<div className="mb-8">
				<div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
					The Fleet Log · dispatches from the ops
				</div>
				<FleetSubscribe />
			</div>
		</section>
	);
}
