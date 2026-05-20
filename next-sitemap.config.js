/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.lacymorrow.com',
  generateRobotsTxt: true,
  exclude: [
    '/sink',
    '/lacy',
    '/404',
    // Archive pages: kept for permalinks but not part of the active site
    '/about/archive/*',
    // Uncurated art experiments (only the ones in play/art/_meta.json are indexed)
    '/play/art/blank',
    '/play/art/continual',
    '/play/art/converge',
    '/play/art/lines',
    '/play/art/multi',
    '/play/art/offset',
    '/play/art/orbit',
    '/play/art/scribble',
    '/play/art/scribe',
    '/play/art/shine',
    '/play/art/shinier',
    '/play/art/shinierier',
    '/play/art/sprout',
    '/play/art/stix',
    '/play/art/theme',
    '/play/art/weave',
    // Uncurated flash demos (only xspf is indexed)
    '/play/flash/flashpress',
    '/play/flash/gallery',
    '/play/flash/giga-player',
    '/play/flash/interactive-ui',
    '/play/flash/viewr',
  ],
}
