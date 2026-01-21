/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lacymorrow.com',
  generateRobotsTxt: false, // Using manual robots.txt for more control
  generateIndexSitemap: false,
  exclude: ['/api/*', '/404'],
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Higher priority for main pages
    const highPriorityPaths = ['/', '/about', '/work', '/play', '/contact'];
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: highPriorityPaths.includes(path) ? 1.0 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
}
