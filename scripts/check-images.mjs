#!/usr/bin/env node
/**
 * Regression test: verify every local image referenced in MDX has a
 * corresponding file in public/, and every jpg/png also has a .webp sibling.
 *
 * Run: node scripts/check-images.mjs
 * Exit code 1 on any missing file.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");

const mdxFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".mdx") || entry.endsWith(".md")) mdxFiles.push(full);
  }
}

walk(join(ROOT, "src", "pages"));

const IMG_RE = /!\[[^\]]*\]\(([^)\s]+)/g;
const SRC_RE = /(?:src|srcSet)\s*[=:]\s*["']([^\s"']+\.(jpe?g|png|webp|gif|svg))(?=[\s"'])/gi;

let errors = 0;

for (const file of mdxFiles) {
  const content = readFileSync(file, "utf-8");
  const refs = new Set();

  for (const m of content.matchAll(IMG_RE)) refs.add(m[1]);
  for (const m of content.matchAll(SRC_RE)) refs.add(m[1]);

  for (const ref of refs) {
    if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("//")) continue;
    if (!ref.startsWith("/")) continue;

    const absPath = join(PUBLIC, ref);
    if (!existsSync(absPath)) {
      console.error(`MISSING: ${ref}  (referenced in ${file.replace(ROOT + "/", "")})`);
      errors++;
      continue;
    }

    if (/\.(jpe?g|png)$/i.test(ref)) {
      const webpPath = absPath.replace(/\.(jpe?g|png)$/i, ".webp");
      if (!existsSync(webpPath)) {
        console.error(`MISSING_WEBP: ${ref.replace(/\.(jpe?g|png)$/i, ".webp")}  (referenced in ${file.replace(ROOT + "/", "")})`);
        errors++;
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} image issue(s) found.`);
  process.exit(1);
} else {
  console.log(`All image references verified (${mdxFiles.length} MDX files scanned).`);
}
