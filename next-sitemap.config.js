/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.lacymorrow.com',
  generateRobotsTxt: true,
  exclude: ['/sink', '/lacy', '/404'],
}
