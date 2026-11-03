import { useState } from "react";
import { ModelCard } from "@/components/mdx/model-card";

const BASE = "/static/3d/e450-switch-cover";

interface Variant {
	id: string;
	label: string;
	slug: string;
	photo: string;
	alt: string;
}

const variants: Variant[] = [
	{ id: "single", label: "One switch", slug: "single", photo: "single-installed", alt: "Single switch cover installed above the door window switches" },
	{ id: "side", label: "Two side by side", slug: "double-side-by-side", photo: "double-side-by-side-installed", alt: "Double side-by-side switch cover installed below the door-lock buttons" },
	{ id: "stacked", label: "Two stacked", slug: "double-stacked", photo: "double-stacked-installed", alt: "Double stacked switch cover installed over a vertically offset switch pair" },
	{ id: "triple", label: "Three, driver's side", slug: "triple-drivers", photo: "triple-drivers-installed", alt: "Triple driver-side switch cover installed over the driver-side window and lock cluster" },
];

export const FordSwitchCovers = () => {
	const [active, setActive] = useState(variants[0].id);
	const v = variants.find((x) => x.id === active) ?? variants[0];
	const file = (ext: string) => `${BASE}/ford-e450-switch-cover-${v.slug}.${ext}`;

	return (
		<div className="my-4">
			<p className="mb-2 text-sm font-medium">Which switches do you have?</p>
			<div role="tablist" aria-label="Switch layout" className="flex flex-wrap gap-2">
				{variants.map((x) => (
					<button
						key={x.id}
						type="button"
						role="tab"
						id={`ford-tab-${x.id}`}
						aria-selected={x.id === active}
						aria-controls="ford-panel"
						onClick={() => setActive(x.id)}
						className={`rounded-full border px-3 py-1.5 text-sm transition ${
							x.id === active ? "border-foreground bg-foreground text-background" : "hover:bg-muted"
						}`}
					>
						{x.label}
					</button>
				))}
			</div>
			<div role="tabpanel" id="ford-panel" aria-labelledby={`ford-tab-${v.id}`}>
				<ModelCard
					key={v.id}
					src={file("glb")}
					poster={`${BASE}/photos/${v.photo}.jpg`}
					posterAlt={v.alt}
					pitch={35}
					files={{ stl: file("stl"), obj: file("obj"), zip: file("zip"), glb: file("glb") }}
				/>
			</div>
		</div>
	);
};
