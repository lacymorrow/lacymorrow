import { versions } from "@/data/versions";
import { cn } from "@/lib/utils";

/**
 * Previous versions of the site, as thumbnails.
 * One row of text per entry: version, span, stack. Nothing else.
 */
export const SiteVersions = () => (
	<ul className="not-prose mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
		{versions.map((v) => (
			<li key={v.version}>
				<a
					href={v.url}
					{...(v.isCurrent ? {} : { target: "_blank", rel: "noopener noreferrer" })}
					className="group block focus:outline-none"
				>
					<picture>
						<source srcSet={v.screenshot.replace(/\.png$/, ".webp")} type="image/webp" />
						<img
							src={v.screenshot}
							alt={`lacymorrow.com ${v.version}, ${v.dateRange}`}
							loading="lazy"
							width={800}
							height={533}
							className={cn(
								"aspect-[3/2] w-full rounded-md border object-cover object-top",
								"border-neutral-200 dark:border-neutral-800",
								"transition group-hover:border-neutral-400 dark:group-hover:border-neutral-600",
								"group-focus-visible:ring-2 group-focus-visible:ring-current",
							)}
						/>
					</picture>

					<p className="mt-2 flex flex-wrap items-baseline gap-x-2 whitespace-nowrap text-sm">
						<span className="font-medium text-neutral-900 group-hover:underline dark:text-neutral-100">
							{v.version}
						</span>
						<span className="text-neutral-500 dark:text-neutral-400">{v.dateRange}</span>
						{v.isCurrent && (
							<span className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
								current
							</span>
						)}
					</p>
					<p className="text-xs text-neutral-500 dark:text-neutral-400">{v.note}</p>
				</a>
			</li>
		))}
	</ul>
);
