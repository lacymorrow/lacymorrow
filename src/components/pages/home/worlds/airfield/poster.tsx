import { Osd } from "./osd";
import { PADS, PALETTE } from "./track";

/**
 * The still: the frame at progress 0.10, just lifted off the pad, gate 1
 * ahead with gate 2 through it, the pits at the right edge. Server
 * rendered, the permanent fallback, and frame one for everyone. One hand
 * authored SVG, no fonts, no filters. The OSD is the same HTML as the
 * live world so the vocabulary is identical either way.
 */

const ALT =
  "The view from a racing drone that has just lifted off a launch pad on a school field at dusk. Two lit square gates stand in a line ahead. Off to the right, twenty-four small drones sit on foam pads beside two canopy tents. The on-screen display reads CLUTZZ, 16.7 volts, gate 0 of 8.";

// The tree line, 110 m out and half lost to fog, as one polygon.
const TREE_LINE =
  "0,730 0,690 13,682 27,688 44,672 62,667 75,658 88,683 104,666 121,689 140,670 160,680 179,665 199,681 220,673 241,685 264,668 287,672 308,658 329,666 339,654 349,687 363,674 377,671 396,663 415,690 434,670 453,667 466,648 479,675 495,666 512,675 521,661 530,689 542,681 555,675 572,661 590,674 611,662 633,676 655,666 677,673 695,660 713,678 722,666 732,669 741,653 750,671 772,652 795,668 806,653 818,670 841,662 864,665 880,648 897,668 906,652 915,684 935,663 956,686 978,675 1001,681 1022,660 1044,683 1057,671 1070,686 1083,676 1097,668 1117,649 1137,683 1156,675 1175,690 1190,673 1206,665 1221,644 1237,683 1254,667 1272,682 1286,671 1301,687 1318,678 1336,677 1357,669 1379,674 1391,657 1403,671 1425,651 1448,678 1457,668 1467,685 1480,675 1493,689 1516,673 1540,681 1556,670 1573,689 1593,670 1600,730";

// Sky stops at p 0.10, the dusk lerp a tenth of the way down.
const SKY = { zenith: "#203148", mid: "#5b6d8b", low: "#ca8a77", horizon: "#ecb587" };
const GRASS = "#394839";
const FOGGED_TREE = "#847058";
const FOGGED_BRICK = "#a87c68";

/** A quad on its pad, seen from 10 to 20 m: a tiny cross with a dot. */
const Quad = ({ x, y, s, color }: { x: number; y: number; s: number; color: string }) => (
  <g stroke={color} strokeWidth={s * 0.22} strokeLinecap="round">
    <path d={`M${x - s},${y - s * 0.5}l${s * 2},${s}M${x - s},${y + s * 0.5}l${s * 2},${-s}`} />
  </g>
);

const OSD_INITIAL = { voltage: "16.7V", gates: "GATE 0/8", timer: "00:00.8" };

export const Poster = () => {
  return (
    <div className="relative size-full" style={{ background: PALETTE.skyMid[0] }}>
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={ALT}
      >
        <defs>
          <linearGradient id="airfield-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY.zenith} />
            <stop offset="0.42" stopColor={SKY.mid} />
            <stop offset="0.86" stopColor={SKY.low} />
            <stop offset="1" stopColor={SKY.horizon} />
          </linearGradient>
          <radialGradient id="airfield-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={PALETTE.sun} stopOpacity="0.9" />
            <stop offset="0.35" stopColor={PALETTE.sun} stopOpacity="0.35" />
            <stop offset="1" stopColor={PALETTE.sun} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="airfield-vignette" cx="0.5" cy="0.5" r="0.72">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.38" />
          </radialGradient>
        </defs>

        {/* Sky, the sun low to the left, the tree line, the school */}
        <rect width="1600" height="722" fill="url(#airfield-sky)" />
        <ellipse cx="60" cy="700" rx="260" ry="120" fill="url(#airfield-sun)" />
        <polygon points={TREE_LINE} fill={FOGGED_TREE} />
        <rect x="0" y="672" width="250" height="52" fill={FOGGED_BRICK} />
        <rect x="8" y="690" width="234" height="8" fill={PALETTE.window} opacity="0.85" />

        {/* Grass */}
        <rect y="720" width="1600" height="280" fill={GRASS} />

        {/* Gate spill on the grass, then gate 2 through gate 1 */}
        <ellipse cx="800" cy="768" rx="30" ry="6" fill={PALETTE.led} opacity="0.18" />
        <ellipse cx="800" cy="812" rx="62" ry="12" fill={PALETTE.led} opacity="0.18" />
        <rect x="772" y="712" width="56" height="56" fill="none" stroke={PALETTE.led} strokeWidth="3" />
        <path d="M774,768v8M826,768v8" stroke={PALETTE.trunk} strokeWidth="2" />
        <rect x="741" y="694" width="118" height="118" fill="none" stroke={PALETTE.led} strokeWidth="6" />
        <path d="M745,812v14M855,812v14" stroke={PALETTE.trunk} strokeWidth="3" />

        {/* The launch pad's edge, below and behind */}
        <path d="M560,1000L700,900L900,900L1040,1000Z" fill={PALETTE.ink} />
        <path d="M600,1000L708,912L892,912L1000,1000Z" fill={PALETTE.pad} />

        {/* The pits: two tents and the 24 quads, 4 by 6 */}
        <path d="M1400,780L1460,742L1520,780Z" fill={PALETTE.cream} />
        <path d="M1410,780v34M1510,780v34" stroke={PALETTE.trunk} strokeWidth="2" />
        <path d="M1500,776L1560,736L1620,776Z" fill={PALETTE.cream} />
        <path d="M1508,776v36M1610,776v36" stroke={PALETTE.trunk} strokeWidth="2" />
        {PADS.map(([px, , pz], i) => {
          const row = Math.round((pz - 3) / 3);
          const col = Math.round((px - 9) / 2);
          const depth = 1 - row * 0.16;
          const x = 1130 + col * 52 * depth + row * 26;
          const y = 832 + row * 40;
          return (
            <Quad
              key={i}
              x={x}
              y={y}
              s={8 * depth + 2}
              color={PALETTE.quads[i % PALETTE.quads.length]}
            />
          );
        })}

        {/* The quad's own props, spinning */}
        <ellipse cx="140" cy="60" rx="150" ry="70" fill={PALETTE.cream} opacity="0.16" />
        <ellipse cx="1460" cy="60" rx="150" ry="70" fill={PALETTE.cream} opacity="0.16" />

        <rect width="1600" height="1000" fill="url(#airfield-vignette)" />
      </svg>
      <Osd quality="high" initial={OSD_INITIAL} />
    </div>
  );
};
