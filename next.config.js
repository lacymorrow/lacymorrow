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
			source: '/casper',
			destination: '/play/casper',
			permanent: false,
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
		{
			source: '/drones',
			destination: '/work/drones/flymore',
			permanent: false,
		},
		{
			source: '/donate',
			destination: '/about/donate',
			permanent: true,
		},
		{
			source: '/projects/:path*',
			destination: '/play/:path*',
			permanent: true,
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
