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
		remotePatterns: [{
			protocol: 'https',
			hostname: 's.gravatar.com',
			port: '',
			pathname: '/avatar/**',
		}],
	},
	redirects: async () => [
		{
			source: '/about/contact',
			destination: '/contact',
			permanent: true,
		},
		{
			source: '/casper',
			destination: 'https://casper.lacymorrow.com',
			permanent: false,
		},
		{
			source: '/drones',
			destination: '/work/drones/flymore',
			permanent: false,
		},
		{
			source: '/donate',
			destination: '/about/donate',
			permanent: false,
		},
		{
			source: '/work',
			destination: '/work/companies/swell-energy',
			permanent: false,
		},
		// Redirects for play
		{
			source: '/3d',
			destination: '/play/3d',
			permanent: false,
		},
		{
			source: '/play',
			destination: '/play/crossover',
			permanent: false,
		},
		{
			source: '/projects/xspf',
			destination: '/play/flash/xspf',
			permanent: true,
		},
		{
			source: '/projects/:path*',
			destination: '/play/:path*',
			permanent: false,
		},
	]
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.jsx',
	defaultShowCopyCode: true
})

module.exports = withNextra(nextConfig)
