import { useEffect, useRef, useState } from "react";

// Scroll-scrubbed exploded drawings. Frames come from scripts/teardown-frames.cjs:
// white-on-black grayscale PNGs, screened onto the page color inside the canvas.

interface Drawing {
	id: string;
	kicker: string;
	title: string;
	description: string;
	width: number;
	height: number;
}

const DRAWINGS: Drawing[] = [
	{
		id: "racer",
		kicker: "FPV racing drone",
		title: "5-inch racing quad",
		description:
			"Carbon frame, four 2207 motors, a 30.5 mm flight stack and a 6S pack.",
		width: 1400,
		height: 1131,
	},
	{
		id: "keepsake",
		kicker: "Wearable",
		title: "Keepsake",
		description:
			"A chest-worn recorder I designed and soldered: an ESP32-C6, a MEMS mic and a memory card in a printed shell.",
		width: 1400,
		height: 1300,
	},
];

const FRAMES = 40;
const PAGE = "#09090b";
// Ink strength: white lines screened at this alpha land near zinc-300.
const INK = 0.8;
// Within each drawing's share of the scroll: hold assembled, explode, then hold exploded with labels.
const HOLD_START = 0.12;
const EXPLODE_END = 0.68;
const LABELS_END = 0.8;

const frameUrl = (id: string, i: number) =>
	`/teardown/${id}/${String(i).padStart(2, "0")}.png`;
const clamp = (n: number) => Math.min(1, Math.max(0, n));

interface Loaded {
	frames: (HTMLImageElement | undefined)[];
	labels?: HTMLImageElement;
}

function loadImage(src: string) {
	const img = new Image();
	img.src = src;
	return img.decode().then(() => img);
}

export function TeardownWorkbench() {
	const sectionRef = useRef<HTMLElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const loaded = useRef<Loaded[]>(DRAWINGS.map(() => ({ frames: [] })));
	const [active, setActive] = useState(0);
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduced(query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);

	useEffect(() => {
		if (reduced) return;
		const section = sectionRef.current;
		const canvas = canvasRef.current;
		if (!section || !canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;

		let raf = 0;
		let shown = -1;

		const draw = () => {
			raf = 0;
			const rect = section.getBoundingClientRect();
			const travel = rect.height - window.innerHeight;
			const progress = clamp(-rect.top / travel) * DRAWINGS.length;
			const index = Math.min(DRAWINGS.length - 1, Math.floor(progress));
			const local = progress - index;
			const drawing = DRAWINGS[index];
			const set = loaded.current[index];

			if (index !== shown) {
				shown = index;
				setActive(index);
				canvas.width = drawing.width;
				canvas.height = drawing.height;
			}

			const target = Math.round(
				clamp((local - HOLD_START) / (EXPLODE_END - HOLD_START)) * (FRAMES - 1),
			);
			// Until every frame arrives, stand in with the nearest one that has.
			let frame: HTMLImageElement | undefined;
			for (let d = 0; d < FRAMES && !frame; d++) {
				frame = set.frames[target - d] ?? set.frames[target + d];
			}
			context.globalCompositeOperation = "source-over";
			context.globalAlpha = 1;
			context.fillStyle = PAGE;
			context.fillRect(0, 0, canvas.width, canvas.height);
			// Screen drops the black ground, so the lines sit directly on the page color.
			context.globalCompositeOperation = "screen";
			context.globalAlpha = INK;
			if (frame) context.drawImage(frame, 0, 0);
			const labels = clamp((local - EXPLODE_END) / (LABELS_END - EXPLODE_END));
			if (set.labels && labels > 0) {
				context.globalCompositeOperation = "lighten";
				context.globalAlpha = INK * labels;
				context.drawImage(set.labels, 0, 0);
			}
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(draw);
		};

		// Fetch frames only once the section is about a screen away, ends first so the
		// scrub works early and fills in as the rest arrive.
		const order = [0, FRAMES - 1, ...Array.from({ length: FRAMES - 2 }, (_, i) => i + 1)];
		let started = false;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting || started) return;
				started = true;
				observer.disconnect();
				DRAWINGS.forEach((drawing, d) => {
					const set = loaded.current[d];
					for (const i of order) {
						loadImage(frameUrl(drawing.id, i))
							.then((img) => {
								set.frames[i] = img;
								schedule();
							})
							.catch(() => {});
					}
					loadImage(`/teardown/${drawing.id}/labels.png`)
						.then((img) => {
							set.labels = img;
							schedule();
						})
						.catch(() => {});
				});
			},
			{ rootMargin: "100% 0px" },
		);
		observer.observe(section);

		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		schedule();
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
			if (raf) cancelAnimationFrame(raf);
		};
	}, [reduced]);

	const heading = (
		<div className="max-w-sm">
			<p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500">
				Workbench
			</p>
			<h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-zinc-100 sm:text-3xl">
				I build hardware too.
			</h2>
		</div>
	);

	const caption = (drawing: Drawing) => (
		<div className="max-w-sm">
			<p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500">
				{drawing.kicker}
			</p>
			<h3 className="mt-2 text-lg font-medium text-zinc-100">{drawing.title}</h3>
			<p className="mt-1 text-sm leading-relaxed text-zinc-400">
				{drawing.description}
			</p>
		</div>
	);

	if (reduced) {
		return (
			<section className="px-6 pb-24 sm:px-10">
				<div className="mx-auto max-w-6xl">
					{heading}
					{DRAWINGS.map((drawing) => (
						<figure key={drawing.id} className="isolate mt-12 bg-[#09090b]">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={`/teardown/${drawing.id}/labels.png`}
								alt={`Exploded drawing of the ${drawing.title}`}
								width={drawing.width}
								height={drawing.height}
								loading="lazy"
								className="mx-auto w-full max-w-3xl opacity-80 mix-blend-screen"
							/>
							<figcaption className="mt-6">{caption(drawing)}</figcaption>
						</figure>
					))}
				</div>
			</section>
		);
	}

	const drawing = DRAWINGS[active];
	return (
		<section
			ref={sectionRef}
			className="relative"
			style={{ height: `${DRAWINGS.length * 200 + 100}vh` }}
			aria-label="Exploded drawings of hardware I have built"
		>
			<div className="sticky top-0 flex h-screen flex-col gap-6 overflow-hidden px-6 py-10 sm:px-10 md:flex-row md:items-center">
				<div className="flex shrink-0 flex-col gap-8 md:w-72">
					{heading}
					<div key={drawing.id} className="animate-in fade-in duration-500">
						{caption(drawing)}
					</div>
				</div>
				<div className="relative min-h-0 flex-1 self-stretch">
					<canvas
						ref={canvasRef}
						role="img"
						aria-label={`Exploded drawing of the ${drawing.title}`}
						className="absolute inset-0 m-auto max-h-full max-w-full"
					/>
				</div>
			</div>
		</section>
	);
}
