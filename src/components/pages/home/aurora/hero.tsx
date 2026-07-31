"use client";

import { motion, useReducedMotion } from "motion/react";

import { AuroraField } from "./aurora-field";
import { FleetSubscribe } from "./fleet-subscribe";

const EASE = [0.2, 0.7, 0.2, 1] as const;

const RECEIPTS = [
	{ strong: "20 yrs", label: "shipping open source" },
	{ strong: "1.2K ★", label: "CrossOver" },
	{ strong: "217K", label: "users a month" },
	{ strong: "13", label: "agents in the fleet" },
];

export function AuroraHero() {
	const reduce = useReducedMotion();

	const rise = (delay: number) =>
		reduce
			? {}
			: {
					initial: { opacity: 0, y: 20, filter: "blur(8px)" },
					animate: { opacity: 1, y: 0, filter: "blur(0px)" },
					transition: { duration: 1.1, delay, ease: EASE },
				};

	return (
		<section
			id="top"
			className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
		>
			<AuroraField
				className="pointer-events-none absolute inset-0 z-0 opacity-45 [mask-image:linear-gradient(to_bottom,black_0%,black_40%,transparent_82%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_40%,transparent_82%)]"
			/>
			<div className="relative z-10 mx-auto w-full max-w-[1120px] px-[clamp(20px,5vw,64px)] pb-20 pt-[120px]">
				<motion.div
					{...rise(0.15)}
					className="mb-[30px] inline-flex items-center gap-[10px] font-mono text-[clamp(12px,1.6vw,14px)] text-ink-mute"
				>
					<span className="h-[14px] w-[3px] rounded-[2px] bg-shell shadow-[0_0_10px] shadow-shell/50" aria-hidden />
					~ lacy&nbsp;
					{reduce ? (
						<span className="inline-block h-[15px] w-[8px] bg-agent" aria-hidden />
					) : (
						<motion.span
							aria-hidden
							animate={{ opacity: [1, 1, 0, 0] }}
							transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
							className="inline-block h-[15px] w-[8px] bg-agent shadow-[0_0_10px] shadow-agent/50"
						/>
					)}
				</motion.div>

				<motion.h1
					{...rise(0.45)}
					className="m-0 mb-[34px] max-w-[20ch] text-balance text-[clamp(2.4rem,6.4vw,5.2rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink"
				>
					I build{" "}
					<span className="bg-gradient-to-r from-shell via-ink to-agent bg-clip-text font-normal text-transparent">
						AI agents
					</span>{" "}
					that control computers. I run my life on them.
				</motion.h1>

				<motion.p
					{...rise(0.75)}
					className="m-0 mb-[26px] max-w-[52ch] text-[clamp(1.05rem,2.1vw,1.3rem)] font-light text-ink-soft"
				>
					Two decades shipping open source. CrossOver has 1.2K stars and reaches
					217K users a month. Thirteen agents run the ops behind everything you see here.
				</motion.p>

				<motion.ul
					{...rise(0.9)}
					className="m-0 mb-[36px] flex list-none flex-wrap gap-x-3 gap-y-2 p-0"
				>
					{RECEIPTS.map((r) => (
						<li
							key={r.label}
							className="rounded-full border border-hair px-[14px] py-[6px] font-mono text-[12px] text-ink-soft"
						>
							<b className="font-semibold text-shell">{r.strong}</b>{" "}
							<span className="text-ink-mute">{r.label}</span>
						</li>
					))}
				</motion.ul>

				<motion.div {...rise(1.05)} className="mb-[clamp(48px,7vh,84px)]">
					<div className="mb-3 inline-flex items-center gap-[10px] font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
						<span className="h-px w-[26px] bg-hair-strong" aria-hidden />
						The Fleet Log · dispatches from the ops
					</div>
					<FleetSubscribe />
				</motion.div>

				<motion.div
					{...rise(1.25)}
					className="inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-mute"
				>
					<span className="h-px w-[46px] bg-hair-strong" aria-hidden /> scroll to unfold
				</motion.div>
			</div>
		</section>
	);
}
