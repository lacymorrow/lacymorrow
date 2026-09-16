// Refreshes the numbers the workshop world is built from. Runs from the
// `prebuild` hook, never fails the build, and keeps the committed snapshot
// when anything looks wrong. See docs/worlds/workshop.md section 5.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(here, "../src/components/pages/home/worlds/workshop/data.json");
const TIMEOUT_MS = 10_000;
const MIN_DOWNLOADS = 1_000_000;
const MAX_DOWNLOADS = 200_000_000;
const STALE_DAYS = 7;

const getJson = async (url, signal) => {
  const res = await fetch(url, {
    signal,
    headers: { accept: "application/json", "user-agent": "lacymorrow.com prebuild" },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
};

const monthsBetween = (from, to) =>
  (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());

const refresh = async () => {
  const current = JSON.parse(await readFile(target, "utf8"));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let downloads = 0;
    let releases = 0;
    for (let page = 1; page <= 5; page += 1) {
      const list = await getJson(
        `https://api.github.com/repos/lacymorrow/crossover/releases?per_page=100&page=${page}`,
        controller.signal,
      );
      if (!Array.isArray(list)) throw new Error("releases response is not a list");
      releases += list.length;
      for (const release of list) {
        for (const asset of release.assets ?? []) downloads += asset.download_count ?? 0;
      }
      if (list.length < 100) break;
    }
    if (downloads < MIN_DOWNLOADS || downloads > MAX_DOWNLOADS) {
      throw new Error(`download count ${downloads} is outside the sane range`);
    }

    const pkg = await getJson("https://registry.npmjs.org/album-art", controller.signal);
    const point = await getJson(
      "https://api.npmjs.org/downloads/point/last-month/album-art",
      controller.signal,
    );
    const created = new Date(pkg.time.created);
    const now = new Date();
    if (Number.isNaN(created.getTime())) throw new Error("album-art created date missing");

    const next = {
      fetchedAt: now.toISOString().slice(0, 10),
      crossoverDownloads: downloads,
      crossoverReleases: releases,
      albumArtFirstPublished: created.toISOString().slice(0, 10),
      albumArtMonths: monthsBetween(created, now),
      albumArtLastMonth: Number(point.downloads) || current.albumArtLastMonth,
    };

    // Only touch the committed file when the title would change or the
    // snapshot is a week old, so local builds do not dirty the tree daily.
    const ageDays = (now - new Date(current.fetchedAt)) / 86_400_000;
    const titleChanged =
      Math.floor(next.crossoverDownloads / 1e6) !== Math.floor(current.crossoverDownloads / 1e6);
    if (!titleChanged && ageDays < STALE_DAYS) {
      console.log(`[workshop] snapshot from ${current.fetchedAt} is fresh, kept`);
      return;
    }
    await writeFile(target, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`[workshop] snapshot refreshed: ${downloads} downloads across ${releases} releases`);
  } catch (error) {
    console.warn(`[workshop] keeping committed snapshot: ${error.message}`);
  } finally {
    clearTimeout(timer);
  }
};

refresh();
