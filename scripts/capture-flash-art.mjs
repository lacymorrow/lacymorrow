#!/usr/bin/env node
/**
 * Captures still frames of the 21 Flash art pieces through Ruffle and packs
 * them into the atlases the `flash` home world uses (docs/worlds/flash.md,
 * section 5). Run once, commit the outputs, rerun only when a piece changes.
 *
 *   node scripts/capture-flash-art.mjs [--only name,name] [--out <dir>]
 *
 * Needs a Chromium that Playwright can launch. `playwright-core` is resolved
 * from PLAYWRIGHT_CORE (a path to its index.mjs) or from the global npm root,
 * so it is not a dependency of the site. `sharp` already is one.
 *
 * Outputs (all under public/static/play/art unless --out is given):
 *   easel/<name>.webp        2 by 2 atlas of 360x270 frames at 0.5, 1.5, 3, 6 s
 *   easel-low/<name>.webp    same at 266x200
 *
 * The ribbon sheet and the thumbnails this used to write are gone with the
 * flying-frames reel it fed. The player shows one atlas at a time.
 *
 * The sizes are smaller than the spec's first estimate on purpose: the pieces
 * are fine lines on flat color, which WebP compresses badly, and 533x400
 * atlases came to 1.6 MB for the set. 360x270 at quality 75 keeps the full
 * scroll (every atlas plus the ribbon) under the world's 1000 KB budget.
 * plus src/components/pages/home/worlds/flash/pieces.json and a contact sheet
 * in the scratchpad (or the cwd) as evidence.
 */

import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const PORT = 5055;

// Lacy's order from the brief and _meta.json: isometrics first, weave last.
const ORDER = [
  "isometrics", "stix", "rtext", "offset", "sprout", "continual", "tree",
  "scribe", "shine", "shinier", "shinierier", "shapes", "lines", "scribble",
  "multi", "orbit", "expand", "theme", "converge", "blank", "weave",
];

const STAGE_W = 533;
const STAGE_H = 400;
const EASEL_W = 360;
const EASEL_H = 270;
const LOW_W = 266;
const LOW_H = 200;
const TILE_W = 256;
const TILE_H = 192;
const FRAME_TIMES_MS = [500, 1500, 3000, 6000];
const WEBP = { quality: 80, effort: 6 };
const WEBP_EASEL = { quality: 75, effort: 6 };
// Below this share of ink at 6 s a piece is treated as a stub that did not
// render. 0.5 percent, not 2: `rtext` (a few words) and `shapes` (a small
// dot spiral) are real pieces at 0.7 and 1.7 percent.
const MIN_INK = 0.005;

const args = process.argv.slice(2);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const only = argValue("--only")?.split(",").filter(Boolean);
const OUT = resolve(argValue("--out") ?? join(PUBLIC, "static", "play", "art"));
const PIECES_JSON = join(ROOT, "src", "components", "pages", "home", "worlds", "flash", "pieces.json");
const SCRATCH = process.env.CLAUDE_SCRATCHPAD ?? process.cwd();

// ---------------------------------------------------------------------------
// Playwright without a dependency.

const loadPlaywright = async () => {
  const candidates = [process.env.PLAYWRIGHT_CORE];
  try {
    const globalRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
    candidates.push(join(globalRoot, "playwright-core", "index.mjs"));
  } catch {
    // no npm on PATH, fall through
  }
  candidates.push("/opt/homebrew/lib/node_modules/playwright-core/index.mjs");
  for (const c of candidates) {
    if (c && existsSync(c)) return import(pathToFileURL(c).href);
  }
  try {
    return await import("playwright-core");
  } catch {
    throw new Error("playwright-core not found. Set PLAYWRIGHT_CORE to its index.mjs.");
  }
};

// ---------------------------------------------------------------------------
// A static server for public/ that gets the wasm mime type right.

const MIME = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".wasm": "application/wasm",
  ".swf": "application/x-shockwave-flash",
  ".html": "text/html",
  ".json": "application/json",
};

const serve = () =>
  new Promise((ok) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
      const path = url.pathname === "/" ? "/__capture.html" : url.pathname;
      if (path === "/__capture.html") {
        res.writeHead(200, { "content-type": "text/html" });
        res.end(PAGE);
        return;
      }
      const file = join(PUBLIC, decodeURIComponent(path));
      if (!file.startsWith(PUBLIC)) {
        res.writeHead(403).end();
        return;
      }
      try {
        const s = await stat(file);
        if (!s.isFile()) throw new Error("dir");
        res.writeHead(200, {
          "content-type": MIME[extname(file)] ?? "application/octet-stream",
          "content-length": s.size,
        });
        res.end(await readFile(file));
      } catch {
        res.writeHead(404).end();
      }
    });
    server.listen(PORT, () => ok(server));
  });

const PAGE = `<!doctype html>
<html><head><meta charset="utf-8"><title>capture</title>
<style>
  html, body { margin: 0; background: #000; }
  #host { position: absolute; left: 60px; top: 40px; width: ${STAGE_W}px; height: ${STAGE_H}px; }
  ruffle-player { width: ${STAGE_W}px; height: ${STAGE_H}px; display: block; }
</style>
<script src="/ruffle/ruffle.js"></script>
</head><body><div id="host"></div></body></html>`;

// ---------------------------------------------------------------------------
// One frame. Read the player's canvas straight from the page: a page
// screenshot needs the compositor, which the heavier pieces starve on a
// software GL. Falls back to a clipped screenshot if the canvas is not there.

const grab = async (page, box) => {
  const dataUrl = await page.evaluate(() => {
    const player = document.querySelector("#host ruffle-player");
    const canvas = player?.shadowRoot?.querySelector("canvas");
    return canvas ? canvas.toDataURL("image/png") : null;
  });
  if (dataUrl) return Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  return page.screenshot({ type: "png", clip: box, animations: "allow", caret: "hide", timeout: 8000 });
};

// ---------------------------------------------------------------------------
// Capture one piece: four PNG buffers at 2x, or null if it never loaded.

const capture = async (page, name) => {
  const loaded = await page.evaluate(
    ({ name, w, h }) =>
      new Promise((done) => {
        const host = document.getElementById("host");
        host.innerHTML = "";
        const player = window.RufflePlayer.newest().createPlayer();
        player.style.width = `${w}px`;
        player.style.height = `${h}px`;
        host.appendChild(player);
        const timer = setTimeout(() => done(false), 15000);
        player.addEventListener("loadeddata", () => {
          clearTimeout(timer);
          done(true);
        });
        player.addEventListener("error", () => {
          clearTimeout(timer);
          done(false);
        });
        player.load({
          url: `/flash/art/${name}.swf`,
          autoplay: "on",
          unmuteOverlay: "hidden",
          splashScreen: false,
          letterbox: "off",
          contextMenu: "off",
          preferredRenderer: "canvas",
          backgroundColor: null,
        });
      }),
    { name, w: STAGE_W, h: STAGE_H },
  );
  if (!loaded) return null;

  const box = await page.locator("#host").boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.up();
  const t0 = Date.now();

  const frames = [];
  let next = 0;
  // Slow Lissajous over the stage so mouse-reactive pieces produce something.
  while (next < FRAME_TIMES_MS.length) {
    const t = (Date.now() - t0) / 1000;
    await page.mouse.move(
      cx + Math.sin(t * 1.1) * box.width * 0.35,
      cy + Math.sin(t * 0.7 + 1) * box.height * 0.35,
    );
    if (Date.now() - t0 >= FRAME_TIMES_MS[next]) {
      frames.push(await grab(page, box));
      next += 1;
    } else {
      await page.waitForTimeout(16);
    }
  }
  await page.evaluate(() => {
    document.getElementById("host").innerHTML = "";
  });
  return frames;
};

// ---------------------------------------------------------------------------
// Ink coverage: fraction of pixels more than 24 levels from the dominant color.

const measure = async (png) => {
  const { data, info } = await sharp(png)
    .resize(STAGE_W, STAGE_H, { kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buckets = new Map();
  const n = info.width * info.height;
  for (let i = 0; i < n; i += 1) {
    const r = data[i * 3] >> 3;
    const g = data[i * 3 + 1] >> 3;
    const b = data[i * 3 + 2] >> 3;
    const key = (r << 10) | (g << 5) | b;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  let best = 0;
  let bestKey = 0;
  for (const [k, c] of buckets) {
    if (c > best) {
      best = c;
      bestKey = k;
    }
  }
  // Refine the dominant color to the mean of its bucket.
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let cnt = 0;
  for (let i = 0; i < n; i += 1) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    if ((((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)) === bestKey) {
      sr += r;
      sg += g;
      sb += b;
      cnt += 1;
    }
  }
  const dr = Math.round(sr / cnt);
  const dg = Math.round(sg / cnt);
  const db = Math.round(sb / cnt);
  let ink = 0;
  for (let i = 0; i < n; i += 1) {
    const d =
      Math.abs(data[i * 3] - dr) + Math.abs(data[i * 3 + 1] - dg) + Math.abs(data[i * 3 + 2] - db);
    if (d > 24) ink += 1;
  }
  const hex = `#${[dr, dg, db].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  return { coverage: ink / n, background: hex };
};

// ---------------------------------------------------------------------------

const kb = (buf) => `${(buf.length / 1024).toFixed(1)} KB`;

const main = async () => {
  const names = only ?? ORDER;
  for (const n of names) {
    if (!existsSync(join(PUBLIC, "flash", "art", `${n}.swf`))) {
      throw new Error(`missing public/flash/art/${n}.swf`);
    }
  }

  await Promise.all(
    ["easel", "easel-low", "thumbs", "thumbs-sm"].map((d) => mkdir(join(OUT, d), { recursive: true })),
  );
  await mkdir(dirname(PIECES_JSON), { recursive: true });

  const server = await serve();
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({ viewport: { width: 700, height: 500 }, deviceScaleFactor: 2 });
  page.on("pageerror", (e) => console.warn(`  page error: ${e.message}`));
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
  await page.waitForFunction(() => !!window.RufflePlayer?.newest, null, { timeout: 30000 });

  const pieces = [];
  const sixSecond = new Map();
  const smallTiles = new Map();
  let total = 0;

  for (const name of names) {
    process.stdout.write(`${name.padEnd(12)} `);
    const frames = await capture(page, name);
    if (!frames) {
      console.log("did not load, skipped");
      continue;
    }
    const { coverage, background } = await measure(frames[3]);
    if (coverage < MIN_INK) {
      console.log(`blank (${(coverage * 100).toFixed(1)}% ink), left out of pieces.json`);
    }

    const at = (png, w, h) => sharp(png).resize(w, h, { kernel: "lanczos3" }).removeAlpha().png().toBuffer();
    const full = await Promise.all(frames.map((f) => at(f, STAGE_W, STAGE_H)));
    const easelFrames = await Promise.all(frames.map((f) => at(f, EASEL_W, EASEL_H)));
    const low = await Promise.all(frames.map((f) => at(f, LOW_W, LOW_H)));
    const thumbSm = await at(frames[3], 320, 240);
    const tile = await at(frames[3], TILE_W, TILE_H);

    const atlas = (tiles, w, h) =>
      sharp({ create: { width: w * 2, height: h * 2, channels: 3, background: "#000" } })
        .composite(tiles.map((input, i) => ({ input, left: (i % 2) * w, top: Math.floor(i / 2) * h })))
        .webp(WEBP_EASEL)
        .toBuffer();

    const easel = await atlas(easelFrames, EASEL_W, EASEL_H);
    const easelLow = await atlas(low, LOW_W, LOW_H);
    const thumb = await sharp(full[3]).webp(WEBP).toBuffer();
    const thumbSmWebp = await sharp(thumbSm).webp(WEBP).toBuffer();

    await Promise.all([
      writeFile(join(OUT, "easel", `${name}.webp`), easel),
      writeFile(join(OUT, "easel-low", `${name}.webp`), easelLow),
      writeFile(join(OUT, "thumbs", `${name}.webp`), thumb),
      writeFile(join(OUT, "thumbs-sm", `${name}.webp`), thumbSmWebp),
    ]);
    total += easel.length + easelLow.length + thumb.length + thumbSmWebp.length;
    sixSecond.set(name, full[3]);
    smallTiles.set(name, tile);

    console.log(
      `ink ${(coverage * 100).toFixed(1).padStart(5)}%  bg ${background}  easel ${kb(easel)}  low ${kb(easelLow)}  thumb ${kb(thumb)}  sm ${kb(thumbSmWebp)}`,
    );
    if (coverage >= MIN_INK) {
      // Not every piece has a page under /play/art; those link to the index.
      const page = existsSync(join(ROOT, "src", "pages", "play", "art", `${name}.mdx`));
      pieces.push({
        name,
        href: page ? `/play/art/${name}` : "/play/art",
        background,
        coverage: Number(coverage.toFixed(4)),
      });
    }
  }

  await browser.close();
  server.close();

  // Ribbon atlas: every kept piece, in order, 7 by 3.
  const ribbonNames = only
    ? (JSON.parse(await readFile(PIECES_JSON, "utf8").catch(() => "[]"))).map((p) => p.name)
    : pieces.map((p) => p.name);
  const tiles = [];
  for (let i = 0; i < ribbonNames.length; i += 1) {
    const n = ribbonNames[i];
    const input =
      smallTiles.get(n) ??
      (await sharp(join(OUT, "thumbs-sm", `${n}.webp`))
        .resize(TILE_W, TILE_H, { kernel: "lanczos3" })
        .png()
        .toBuffer()
        .catch(() => null));
    if (input) tiles.push({ input, left: (i % 7) * TILE_W, top: Math.floor(i / 7) * TILE_H });
  }
  const ribbon = await sharp({
    create: { width: TILE_W * 7, height: TILE_H * 3, channels: 3, background: "#06070f" },
  })
    .composite(tiles)
    .webp(WEBP)
    .toBuffer();
  await writeFile(join(OUT, "ribbon.webp"), ribbon);
  total += ribbon.length;
  console.log(`\nribbon.webp ${kb(ribbon)} (${tiles.length} tiles)`);

  if (!only) {
    await writeFile(PIECES_JSON, `${JSON.stringify(pieces.map((p, order) => ({ order, ...p })), null, 2)}\n`);
    console.log(`pieces.json: ${pieces.length} pieces`);
  }

  // Contact sheet, the evidence artifact.
  const sheetTiles = [];
  let i = 0;
  for (const [, png] of sixSecond) {
    sheetTiles.push({ input: png, left: (i % 7) * STAGE_W, top: Math.floor(i / 7) * STAGE_H });
    i += 1;
  }
  const sheet = join(SCRATCH, "flash-art-contact-sheet.png");
  await sharp({ create: { width: STAGE_W * 7, height: STAGE_H * 3, channels: 3, background: "#222" } })
    .composite(sheetTiles)
    .png()
    .toFile(sheet);
  console.log(`contact sheet: ${sheet}`);
  console.log(`total written: ${(total / 1024).toFixed(0)} KB`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
