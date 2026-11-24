import dynamic from "next/dynamic";
import { useState } from "react";

const View3d = dynamic(() => import("@/components/mdx/view-3d").then((m) => m.View3d), {
	ssr: false,
	loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});

export interface ModelFiles {
	stl: string;
	glb: string;
	obj?: string;
	zip?: string;
	[label: string]: string | undefined;
}

export interface ModelCardProps {
	/** .glb used by the live viewer */
	src: string;
	/** Omit when the page lists downloads itself */
	files?: ModelFiles;
	/** Still shown until the viewer is opened (installed photo where one exists) */
	poster?: string;
	posterAlt?: string;
	pitch?: number;
}

export const ModelCard = ({ src, files, poster, posterAlt = "", pitch }: ModelCardProps) => {
	const [live, setLive] = useState(false);
	const { stl, ...others } = files ?? { stl: "" };
	const extras = Object.entries(others).filter(([, href]) => href);

	return (
		<figure className="my-4 max-w-md">
			<div className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
				{live ? (
					<View3d src={src} pitch={pitch} />
				) : (
					<button
						type="button"
						onClick={() => setLive(true)}
						className="group absolute inset-0 block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
						aria-label="Open the interactive 3D model"
					>
						{poster ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={poster} alt={posterAlt} className="h-full w-full object-cover" loading="lazy" width="1600" height="1200" />
						) : null}
						<span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow transition group-hover:bg-background">
							Spin the 3D model
						</span>
					</button>
				)}
			</div>
			{files ? (
			<figcaption className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
				<a
					href={stl}
					download
					className="rounded-md bg-foreground px-3 py-1.5 text-sm font-semibold text-background no-underline hover:opacity-90"
				>
					Download STL
				</a>
				<span className="text-muted-foreground">
					also{" "}
					{extras.map(([label, href], i) => (
						<span key={label}>
							{i > 0 ? " " : ""}
							<a href={href} download>
								<code>.{label}</code>
							</a>
						</span>
					))}
				</span>
			</figcaption>
			) : null}
		</figure>
	);
};
