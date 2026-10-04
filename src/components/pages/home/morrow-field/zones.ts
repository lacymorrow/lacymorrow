export interface Zone {
  name: string;
  desc: string;
  route: string;
  x: number;
  z: number;
}

export const ZONES: Zone[] = [
  {
    name: "Work",
    desc: "Companies, clients and professional history. Duke Energy, Twilio, Credit Karma and more.",
    route: "/work",
    x: -52,
    z: -24,
  },
  {
    name: "Play",
    desc: "Open-source packages, experiments and art. The fun stuff.",
    route: "/play",
    x: 52,
    z: -24,
  },
  {
    name: "Flash Arcade",
    desc: "The legacy Flash collection, resurrected via Ruffle. Insert coin.",
    route: "/play/flash",
    x: 46,
    z: 34,
  },
  {
    name: "Blog",
    desc: "Blog posts and essays on building software.",
    route: "/blog",
    x: -46,
    z: 34,
  },
  {
    name: "Archive",
    desc: "About, mentions, and the deep archive.",
    route: "/about",
    x: 0,
    z: -60,
  },
  {
    name: "Post Office",
    desc: "Say hello. The contact form goes straight to Lacy.",
    route: "/contact",
    x: 0,
    z: 56,
  },
  {
    name: "Airfield",
    desc: "FPV drones & flying. Thread all 5 gates for a surprise.",
    route: "/work/drones",
    x: 76,
    z: 6,
  },
];

export const NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Play", href: "/play" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
