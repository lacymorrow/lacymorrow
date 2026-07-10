import { versions } from "@/data/versions";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const VersionsTimeline = () => {
	return (
		<div className="relative mx-auto max-w-3xl px-4 py-8">
			<div
				aria-hidden="true"
				className="absolute bottom-4 left-6 top-4 w-px bg-gradient-to-b from-transparent via-neutral-700 to-transparent md:left-8"
			/>
			<ol className="space-y-10">
				{versions.map((v) => (
					<li key={v.version} className="relative pl-14 md:pl-20">
						<span
							aria-hidden="true"
							className={cn(
								"absolute left-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border md:left-5",
								v.isCurrent
									? "border-cyan-400/70 bg-cyan-400/20 shadow-[0_0_16px_2px_rgba(34,211,238,0.4)]"
									: "border-neutral-600 bg-neutral-900",
							)}
						>
							<span
								className={cn(
									"h-2 w-2 rounded-full",
									v.isCurrent ? "bg-cyan-300" : "bg-neutral-500",
								)}
							/>
						</span>

						<article
							className={cn(
								"rounded-xl border p-5 transition-colors md:p-6",
								v.isCurrent
									? "border-cyan-400/30 bg-neutral-950/70"
									: "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700",
							)}
						>
							<header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
								<span
									className={cn(
										"font-mono text-xs uppercase tracking-widest",
										v.isCurrent ? "text-cyan-300" : "text-neutral-500",
									)}
								>
									{v.version}
									{v.isCurrent && " · current"}
								</span>
								<h3 className="text-lg font-semibold text-neutral-100 md:text-xl">
									{v.name}
								</h3>
								<span className="ml-auto text-xs text-neutral-500 md:text-sm">
									{v.dateRange}
								</span>
							</header>

							<p className="mb-4 text-sm leading-relaxed text-neutral-400 md:text-base">
								{v.description}
							</p>

							<div className="mb-4 flex flex-wrap gap-1.5">
								{v.techStack.map((tech) => (
									<span
										key={tech}
										className="rounded-full border border-neutral-800 bg-neutral-900/60 px-2.5 py-0.5 text-xs text-neutral-400"
									>
										{tech}
									</span>
								))}
							</div>

							{v.isCurrent ? (
								<Link
									href={v.url}
									className="inline-flex items-center gap-1 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
								>
									You are here
									<span aria-hidden="true">→</span>
								</Link>
							) : (
								<a
									href={v.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-sm font-medium text-neutral-300 transition-colors hover:text-neutral-100"
								>
									Visit this version
									<span aria-hidden="true">→</span>
								</a>
							)}
						</article>
					</li>
				))}
			</ol>
		</div>
	);
};
