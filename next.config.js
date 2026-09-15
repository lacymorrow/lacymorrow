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
      permanent: false,
    },
    {
      source: "/v2/",
      destination: "/v2/index.html",
      permanent: false,
    },
    {
      source: "/v3",
      destination: "/v3/index.html",
      permanent: false,
    },
    {
      source: "/v3/",
      destination: "/v3/index.html",
      permanent: false,
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
      permanent: false,
    },
    {
      source: "/crossover",
      destination: "/play/crossover",
      permanent: false,
    },
    {
      source: "/drones",
      destination: "/work/drones/flymore",
      permanent: false,
    },
    {
      source: "/donate",
      destination: "/about/donate",
      permanent: false,
    },
    // Redirects for play
    {
      source: "/3d",
      destination: "/play/3d",
      permanent: false,
    },
    {
      source: "/projects/xspf",
      destination: "/play/flash/xspf",
      permanent: false,
    },
    {
      source: "/xspf",
      destination: "/play/flash/xspf",
      permanent: false,
    },
    {
      source: "/projects/:path*",
      destination: "/play/:path*",
      permanent: false,
    },
  ],
};

/**
 * Four of the Flash pieces under /play/art were drawn when Flash could pull
 * a colour theme off Adobe Kuler, and two of them still carry Lacy's email
 * address in that request URL. Kuler has not existed since 2014, so the
 * request only ever fails, but the browser still sends it.
 *
 * Ruffle's own `allowNetworking` does not stop it: in this build that option
 * governs navigation inside the movie, not URLLoader fetches. This does stop
 * it, because a connect-src violation is refused before any request leaves
 * the machine. Scoped to fetch and XHR only, so nothing else on the page
 * changes, and to the pages that actually run a SWF.
 */
const CONNECT_SRC = [
  "connect-src 'self'",
  // Umami, loaded in _document.jsx. It posts to /api/send.
  "https://analytics.lacy.sh",
  // The art pages render through the `react-ruffle` package, which fetches
  // its WebAssembly from unpkg rather than from the copy already sitting in
  // public/ruffle. Worth moving those pages onto the self-hosted player, at
  // which point this entry goes away.
  "https://unpkg.com",
].join(" ");

nextConfig.headers = async () => [
  {
    source: "/",
    headers: [{ key: "Content-Security-Policy", value: CONNECT_SRC }],
  },
  {
    source: "/play/art/:path*",
    headers: [{ key: "Content-Security-Policy", value: CONNECT_SRC }],
  },
];

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  defaultShowCopyCode: true,
  turbopack: {}
});

module.exports = withNextra(nextConfig);






