// Exports a scroll-scrub image sequence from a /teardown drawing project.
// Usage: node scripts/teardown-frames.cjs <teardown project dir> <drawing id> [frames=40]
// Writes public/teardown/<id>/00.png .. NN.png (assembled -> exploded) plus labels.png
// (the exploded frame with part labels), all cropped to one shared box. Frames are 16-level
// grayscale PNGs, white ink on black, meant for mix-blend-mode: screen over a dark page;
// that is about a fifth the size of the same frames as WebP with alpha.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const sharp = require("sharp");

const [root, id, count = "40"] = process.argv.slice(2);
if (!root || !id) throw Error("Usage: teardown-frames.cjs <project dir> <drawing id> [frames]");
const project = path.resolve(root);
const tools = path.join(project, "tools/teardown");
const { RUNTIME, load } = require(path.join(tools, "scripts/config.cjs"));
const { findChrome } = require(path.join(tools, "scripts/commands.cjs"));
const SHEET = require(path.join(tools, "assets/sheet.js"));

const { modelScripts } = load(path.join(project, "drawing.json"));
const context = { console, structuredClone };
context.self = context;
vm.createContext(context);
for (const file of [...RUNTIME, ...modelScripts]) vm.runInContext(fs.readFileSync(file, "utf8"), context);
const model = context.DrawingModels[id];
if (!model) throw Error(`No model named ${id}`);

const INK = "#ffffff";
const WIDTH = 2800;
const HEIGHT = Math.round((WIDTH * SHEET.height) / SHEET.width);
const OUTPUT_WIDTH = 1400;
const frames = Number(count);
// Same curve as the viewer, so scroll reads like the click animation.
const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), `teardown-${id}-`));
const chrome = findChrome();

function rasterize(name, explosion, annotate) {
	const { markup } = model({}, { explosion, fitExplosion: 1, isolated: null, fill: false, annotate });
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${SHEET.width} ${SHEET.height}"><style>path{fill:none;stroke:${INK};stroke-linejoin:round}text{font-family:Inter,Helvetica,sans-serif;font-size:3.2px;fill:${INK};letter-spacing:.08em}circle{fill:${INK}}${SHEET.css("technical")}</style>${markup}</svg>`;
	const file = path.join(scratch, `${name}.svg`);
	fs.writeFileSync(file, svg);
	const png = file.replace(".svg", ".png");
	execFileSync(chrome, ["--headless", "--disable-gpu", "--hide-scrollbars", `--screenshot=${png}`, `--window-size=${WIDTH},${HEIGHT}`, "--default-background-color=00000000", `file://${file}`], { stdio: "ignore" });
	return png;
}

(async () => {
	const pngs = Array.from({ length: frames }, (_, i) => rasterize(String(i).padStart(2, "0"), ease(i / (frames - 1)), false));
	const labels = rasterize("labels", 1, true);

	// One crop box for every frame, so the drawing never shifts while scrubbing.
	let box = null;
	for (const png of [pngs[0], pngs.at(-1), labels]) {
		const { info } = await sharp(png).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
		const left = -info.trimOffsetLeft, top = -info.trimOffsetTop;
		const next = { left, top, right: left + info.width, bottom: top + info.height };
		box = box ? { left: Math.min(box.left, next.left), top: Math.min(box.top, next.top), right: Math.max(box.right, next.right), bottom: Math.max(box.bottom, next.bottom) } : next;
	}
	const pad = 24;
	const region = {
		left: Math.max(0, box.left - pad),
		top: Math.max(0, box.top - pad),
		width: Math.min(WIDTH, box.right + pad) - Math.max(0, box.left - pad),
		height: Math.min(HEIGHT, box.bottom + pad) - Math.max(0, box.top - pad),
	};

	const out = path.join(__dirname, "../public/teardown", id);
	fs.mkdirSync(out, { recursive: true });
	let bytes = 0;
	for (const png of [...pngs, labels]) {
		const target = path.join(out, path.basename(png));
		const { size } = await sharp(png).extract(region).resize({ width: OUTPUT_WIDTH }).flatten({ background: "#000" }).grayscale().png({ palette: true, colors: 16 }).toFile(target);
		bytes += size;
	}
	const height = Math.round((region.height * OUTPUT_WIDTH) / region.width);
	fs.rmSync(scratch, { recursive: true, force: true });
	// Copy the size into DRAWINGS in src/components/pages/home/teardown-workbench.tsx.
	console.log(`${id}: ${frames} frames + labels, ${OUTPUT_WIDTH}x${height}, ${(bytes / 1024).toFixed(0)} KB -> ${out}`);
})();
