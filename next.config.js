/** @type {import('next').NextConfig} */
const nextConfig = {
	// For Static Site Generation
	// output: 'export',

	// cors: {
  //   origin: "*",
  // },
	// experimental: { serverActions:true },

	images: {
		// For Static Site Generation
		// unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
    ],
  },
	redirects: async () => [
		{
			source: '/about/contact',
			destination: '/contact',
			permanent: true,
		},
		{
			source: '/work',
			destination: '/work/companies/twilio',
			permanent: true,
		},
		{
			source: '/play',
			destination: '/play/crossover',
			permanent: true,
		},
	]
}

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
	defaultShowCopyCode: true
})

module.exports = withNextra(nextConfig)