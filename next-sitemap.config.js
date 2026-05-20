/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.lacymorrow.com',
  generateRobotsTxt: true,
  // next-sitemap's matcher supports `*` wildcards and `!`-prefix negation only
  // (not minimatch / extglobs). Use wildcards plus explicit negations so the
  // curated demos listed in each section's _meta.json stay indexed and any
  // newly-added experiments get excluded automatically.
  exclude: [
    '/sink',
    '/lacy',
    '/404',
    // Archive pages: kept for permalinks but not part of the active site
    '/about/archive',
    '/about/archive/*',
    // Uncurated art experiments — curated entries in play/art/_meta.json stay indexed
    '/play/art/*',
    '!/play/art/isometrics',
    '!/play/art/tree',
    '!/play/art/rtext',
    '!/play/art/expand',
    // Uncurated flash demos — only xspf is curated
    '/play/flash/*',
    '!/play/flash/xspf',
  ],
}
