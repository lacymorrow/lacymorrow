/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Static Site Generation
  // output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },

  // cors: {
  //   origin: "*",
  // },
  // experimental: { serverActions:true },

  // Turbopack is default in Next.js 16+
  turbopack: {},

  images: {
    // For Static Site Generation
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
        port: "",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/v2",
      destination: "/v2/index.html",
      permanent: true,
    },
    {
      source: "/v2/",
      destination: "/v2/index.html",
      permanent: true,
    },
    {
      source: "/v3",
      destination: "/v3/index.html",
      permanent: true,
    },
    {
      source: "/v3/",
      destination: "/v3/index.html",
      permanent: true,
    },
    {
      source: "/about/contact",
      destination: "/contact",
      permanent: true,
    },
    {
      source: "/:path*",
      has: [{ type: "host", value: "resume.lacymorrow.com" }],
      destination: "https://lacymorrow.com/about/resume",
      permanent: true,
    },
    {
      source: "/resume",
      destination: "/about/resume",
      permanent: true,
    },
    {
      source: "/vcard",
      destination: "/contact",
      permanent: true,
    },
    {
      source: "/casper",
      destination: "https://casper.lacymorrow.com",
      permanent: true,
    },
    {
      source: "/crossover",
      destination: "/play/crossover",
      permanent: true,
    },
    {
      source: "/drones",
      destination: "/work/drones/flymore",
      permanent: true,
    },
    {
      source: "/donate",
      destination: "/about/donate",
      permanent: true,
    },
    // Redirects for play
    {
      source: "/3d",
      destination: "/play/3d",
      permanent: true,
    },
    {
      source: "/play",
      destination: "/play/crossover",
      permanent: true,
    },
    {
      source: "/projects/xspf",
      destination: "/play/flash/xspf",
      permanent: true,
    },
    {
      source: "/xspf",
      destination: "/play/flash/xspf",
      permanent: true,
    },
    {
      source: "/projects/:path*",
      destination: "/play/:path*",
      permanent: true,
    },
  ],
};

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
  turbopack: {}
});

module.exports = withNextra(nextConfig);






