/**
 * Converts large JPEG/PNG images to WebP format for SEO/performance.
 * Skips files already smaller than MIN_SIZE_KB and GIFs (animation support).
 * Existing .webp files are skipped unless --force is passed.
 *
 * Usage: node scripts/convert-to-webp.mjs [--force]
 */
import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import sharp from "sharp";

const DIRS = ["public/static", "public/images/external"];
const EXTS = new Set([".jpg", ".jpeg", ".png"]);
const MIN_SIZE_KB = 30; // skip images already under this size
const WEBP_QUALITY = 80;
const force = process.argv.includes("--force");

async function findImages(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await findImages(full)));
      } else if (EXTS.has(extname(entry.name).toLowerCase())) {
        results.push(full);
      }
    }
  } catch {
    // dir may not exist
  }
  return results;
}

async function main() {
  const cwd = process.cwd();
  let converted = 0;
  let skipped = 0;

  for (const dir of DIRS) {
    const images = await findImages(join(cwd, dir));
    for (const src of images) {
      const info = await stat(src);
      if (info.size < MIN_SIZE_KB * 1024) {
        skipped++;
        continue;
      }

      const dest = src.replace(/\.(jpe?g|png)$/i, ".webp");
      try {
        const destStat = await stat(dest).catch(() => null);
        if (destStat && !force) {
          console.log(`  skip (exists): ${dest.replace(cwd, "")}`);
          skipped++;
          continue;
        }
        await sharp(src).webp({ quality: WEBP_QUALITY }).toFile(dest);
        const saved = info.size - (await stat(dest)).size;
        console.log(
          `  ✓ ${src.replace(cwd, "")} → ${dest.replace(cwd, "")}  (saved ${Math.round(saved / 1024)}KB)`
        );
        converted++;
      } catch (err) {
        console.error(`  ✗ ${src.replace(cwd, "")}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone. Converted: ${converted}, Skipped: ${skipped}`);
}

main().catch(console.error);
