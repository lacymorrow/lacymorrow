import { ART_BASE } from "./pieces";

/**
 * The still: the scene at about progress 0.3. Server rendered, the first
 * paint, and the permanent fallback with no WebGL, reduced motion or a saved
 * data connection. Inline SVG plus five captured WebPs, 43 KB in total.
 * docs/worlds/flash.md, 8.
 */

const ALT =
  "Made in Flash. Lime, cyan and orange swooshes cross a black stage. A magenta ribbon carries small frames of Flash pieces named tree, orbit, expand and weave toward an easel showing isometrics, one of 21 generative pieces written in ActionScript.";

const BACKGROUND = "#06070f";
const MAGENTA = "#ff0099";
const FURNITURE = "#26262b";
const PANEL_EDGE = "#1a1a1f";

interface SwooshProps {
  id: string;
  body: string;
  gloss: string;
}

/** A band with the 2004 fill: 55 percent shade at one edge, full at the other. */
const Swoosh = ({ id, body, gloss }: SwooshProps) => (
  <>
    <path d={body} fill={`url(#${id})`} />
    <path d={gloss} fill="#ffffff" opacity={0.4} />
  </>
);

const RIBBON_FRAMES = [
  { name: "tree", x: 150, y: 214, w: 96, angle: 7 },
  { name: "orbit", x: 300, y: 284, w: 118, angle: 8 },
  { name: "expand", x: 466, y: 372, w: 144, angle: 9 },
  { name: "weave", x: 648, y: 474, w: 176, angle: 10 },
];

const Landscape = () => (
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    className="hidden size-full landscape:block"
    role="img"
    aria-label={ALT}
  >
    <defs>
      <linearGradient id="flash-lime" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#6d8c00" />
        <stop offset="1" stopColor="#c6ff00" />
      </linearGradient>
      <linearGradient id="flash-cyan" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#0d7e8c" />
        <stop offset="1" stopColor="#19e6ff" />
      </linearGradient>
      <linearGradient id="flash-orange" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#8c4c00" />
        <stop offset="1" stopColor="#ff8a00" />
      </linearGradient>
      <linearGradient id="flash-ribbon" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#8c0054" />
        <stop offset="1" stopColor={MAGENTA} />
      </linearGradient>
    </defs>

    <rect width="1600" height="900" fill={BACKGROUND} />

    <Swoosh
      id="flash-orange"
      body="M 1680 96 C 1220 214 900 404 380 618 L 404 706 C 950 486 1258 292 1700 186 Z"
      gloss="M 1680 118 C 1226 234 906 422 392 634 L 398 656 C 918 444 1232 256 1684 140 Z"
    />
    <Swoosh
      id="flash-lime"
      body="M -80 612 C 250 470 570 524 1040 238 L 1068 322 C 594 606 286 554 -80 682 Z"
      gloss="M -80 634 C 254 494 574 546 1046 262 L 1052 284 C 578 570 274 520 -80 656 Z"
    />
    <Swoosh
      id="flash-cyan"
      body="M -80 792 C 288 744 622 716 1004 552 L 1020 596 C 640 764 312 790 -80 836 Z"
      gloss="M -80 806 C 292 758 626 730 1006 568 L 1010 582 C 630 744 300 774 -80 820 Z"
    />

    {/* The gallery ribbon, carrying four pieces toward the gate. */}
    <path
      d="M -60 168 C 236 214 420 302 566 404 C 718 512 878 704 1096 900 L 1224 900 C 980 676 806 500 654 388 C 492 268 252 196 -60 232 Z"
      fill="url(#flash-ribbon)"
    />
    <path
      d="M -60 186 C 240 230 424 318 570 420 C 722 528 880 716 1100 900 L 1120 900 C 892 700 730 526 582 418 C 434 310 244 226 -60 206 Z"
      fill="#ffffff"
      opacity={0.32}
    />
    {RIBBON_FRAMES.map((frame) => (
      <g key={frame.name} transform={`rotate(${frame.angle} ${frame.x} ${frame.y})`}>
        <image
          href={`${ART_BASE}/thumbs-sm/${frame.name}.webp`}
          x={frame.x - frame.w / 2}
          y={frame.y - (frame.w * 3) / 8}
          width={frame.w}
          height={(frame.w * 3) / 4}
          preserveAspectRatio="none"
        />
        <rect
          x={frame.x - frame.w / 2}
          y={frame.y - (frame.w * 3) / 8}
          width={frame.w}
          height={(frame.w * 3) / 4}
          fill="none"
          stroke="#ffffff"
          strokeWidth={1.4}
        />
      </g>
    ))}

    {/* The easel. */}
    <g stroke={FURNITURE} strokeWidth={9} strokeLinecap="round">
      <line x1="1006" y1="612" x2="960" y2="890" />
      <line x1="1476" y1="612" x2="1520" y2="890" />
      <line x1="1242" y1="612" x2="1242" y2="884" />
    </g>
    <rect x="964" y="604" width="556" height="20" rx="4" fill={FURNITURE} />
    <rect x="978" y="164" width="528" height="452" fill={PANEL_EDGE} />
    <image
      href={`${ART_BASE}/thumbs/isometrics.webp`}
      x="1000"
      y="186"
      width="484"
      height="363"
      preserveAspectRatio="xMidYMid meet"
    />
  </svg>
);

const Portrait = () => (
  <svg
    viewBox="0 0 900 1600"
    preserveAspectRatio="xMidYMid slice"
    className="size-full landscape:hidden"
    role="img"
    aria-label={ALT}
  >
    <defs>
      <linearGradient id="flash-lime-p" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#6d8c00" />
        <stop offset="1" stopColor="#c6ff00" />
      </linearGradient>
      <linearGradient id="flash-ribbon-p" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#8c0054" />
        <stop offset="1" stopColor={MAGENTA} />
      </linearGradient>
    </defs>

    <rect width="900" height="1600" fill={BACKGROUND} />

    <Swoosh
      id="flash-lime-p"
      body="M -60 1010 C 180 926 520 958 960 794 L 980 876 C 540 1036 214 1010 -60 1076 Z"
      gloss="M -60 1030 C 186 946 524 978 962 816 L 966 836 C 528 998 208 1030 -60 1054 Z"
    />

    {/* The easel, stacked over the ribbon. */}
    <g stroke={FURNITURE} strokeWidth={9} strokeLinecap="round">
      <line x1="196" y1="836" x2="164" y2="1120" />
      <line x1="704" y1="836" x2="736" y2="1120" />
    </g>
    <rect x="160" y="828" width="580" height="18" rx="4" fill={FURNITURE} />
    <rect x="172" y="360" width="556" height="472" fill={PANEL_EDGE} />
    <image
      href={`${ART_BASE}/thumbs/isometrics.webp`}
      x="194"
      y="382"
      width="512"
      height="384"
      preserveAspectRatio="xMidYMid meet"
    />

    <path
      d="M -60 872 C 180 918 380 1000 520 1108 C 660 1218 742 1330 812 1436 L 940 1436 C 852 1288 730 1186 592 1076 C 434 958 220 892 -60 922 Z"
      fill="url(#flash-ribbon-p)"
    />
    {RIBBON_FRAMES.slice(1).map((frame, i) => {
      const x = 170 + i * 205;
      const y = 976 + i * 112;
      const w = 124 + i * 24;
      return (
        <g key={frame.name} transform={`rotate(${frame.angle} ${x} ${y})`}>
          <image
            href={`${ART_BASE}/thumbs-sm/${frame.name}.webp`}
            x={x - w / 2}
            y={y - (w * 3) / 8}
            width={w}
            height={(w * 3) / 4}
            preserveAspectRatio="none"
          />
          <rect
            x={x - w / 2}
            y={y - (w * 3) / 8}
            width={w}
            height={(w * 3) / 4}
            fill="none"
            stroke="#ffffff"
            strokeWidth={1.4}
          />
        </g>
      );
    })}
  </svg>
);

export const Poster = () => (
  <div className="size-full" style={{ background: BACKGROUND }}>
    <Landscape />
    <Portrait />
  </div>
);

export default Poster;
