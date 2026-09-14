import { palette } from "./palette";

/**
 * The still: the 0.60 frame of the live world, drawn as inline SVG. Server
 * rendered, and the permanent fallback when the world cannot run.
 * docs/worlds/workshop.md section 8.
 */

export const POSTER_ALT =
  "A workshop at night. A desk lamp lights a bench and one monitor showing a crosshair. Beyond the bench, twenty-four thousand small lit screens stretch into the dark, one for every thousand downloads of CrossOver.";

const ROWS = 72;
const NEAR_ROWS = 3;

const rowY = (k: number) => 640 - (470 * k) / (k + 9);
const rowScale = (k: number) => 9 / (k + 9);

const accentFor = (i: number) => (i % 9 === 4 ? palette.accents[i % 3] : palette.dot);

/** One monitor, drawn at scale s (1 = the nearest row). */
const Screen = ({ x, y, s, i }: { x: number; y: number; s: number; i: number }) => {
  const w = 26 * s;
  const h = 15 * s;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={palette.surface} />
      <rect x={x + 2 * s} y={y + 1.5 * s} width={w - 4 * s} height={h - 3 * s} fill={palette.display} />
      <path
        d={`M${cx - 4 * s} ${cy}h${2.5 * s}M${cx + 1.5 * s} ${cy}h${2.5 * s}M${cx} ${cy - 4 * s}v${2.5 * s}M${cx} ${cy + 1.5 * s}v${2.5 * s}`}
        stroke={palette.arm}
        strokeOpacity={0.85}
        strokeWidth={Math.max(0.75, s)}
      />
      <circle cx={cx} cy={cy} r={Math.max(1, 1.2 * s)} fill={accentFor(i)} />
    </g>
  );
};

const NearField = () => {
  const screens: JSX.Element[] = [];
  let i = 0;
  for (let k = 0; k < NEAR_ROWS; k += 1) {
    const s = rowScale(k);
    const y = rowY(k) - 7.5 * s;
    const half = 260 + 16 * k;
    const step = 38 * s;
    const jitter = (k * 11) % 17;
    for (let x = 800 - half + jitter; x < 800 + half - 26 * s; x += step) {
      // Leave the middle of the nearest row for the monitor.
      if (k === 0 && Math.abs(x - 787) < 80) continue;
      screens.push(<Screen key={`${k}-${x}`} x={x} y={y} s={s} i={i} />);
      i += 1;
    }
  }
  return <>{screens}</>;
};

const FarField = () => {
  const lines: JSX.Element[] = [];
  for (let k = NEAR_ROWS; k < ROWS; k += 1) {
    const s = rowScale(k);
    const y = rowY(k);
    const half = Math.min(790, 260 + 16 * k);
    const on = Math.max(1.2, 26 * s);
    // The gap never closes, so the far rows stay a crowd of lights instead
    // of collapsing into one grey band at the horizon.
    const off = Math.max(2.4, 12 * s);
    lines.push(
      <line
        key={k}
        x1={800 - half}
        x2={800 + half}
        y1={y}
        y2={y}
        stroke={palette.mark}
        strokeWidth={Math.max(1, 15 * s)}
        strokeDasharray={`${on.toFixed(2)} ${off.toFixed(2)}`}
        strokeDashoffset={(((k * 7) % 13) / 13) * (on + off)}
        opacity={(0.8 * (1 - k / 80) ** 1.4).toFixed(3)}
      />,
    );
  }
  return <>{lines}</>;
};

const Rack = () => {
  const tiles: JSX.Element[] = [];
  const surfaces = [palette.surface, palette.frame, palette.benchTop];
  for (let i = 0; i < 149; i += 1) {
    const col = i % 12;
    const row = Math.floor(i / 12);
    const accent = i % 12 === 11;
    tiles.push(
      <rect
        key={i}
        x={1380 + col * 13}
        y={560 - row * 13}
        width={10}
        height={10}
        fill={accent ? palette.accents[i % 3] : surfaces[(i * 7 + row) % 3]}
      />,
    );
  }
  return (
    <g>
      <rect x={1372} y={386} width={172} height={188} fill={palette.frame} />
      {tiles}
    </g>
  );
};

export const Poster = () => (
  <svg
    className="size-full"
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label={POSTER_ALT}
  >
    <title>{POSTER_ALT}</title>
    <rect width="1600" height="900" fill={palette.background} />
    <FarField />
    <NearField />
    <Rack />
    {/* Lamp pool: the one warm color in the still. */}
    <ellipse cx={880} cy={702} rx={150} ry={14} fill={palette.lamp} opacity={0.08} />
    {/* Bench and trestles. */}
    <rect x={600} y={696} width={400} height={10} fill={palette.benchTop} />
    <rect x={616} y={706} width={12} height={60} fill={palette.frame} />
    <rect x={972} y={706} width={12} height={60} fill={palette.frame} />
    {/* Monitor. */}
    <rect x={740} y={612} width={120} height={72} fill={palette.surface} />
    <rect x={747} y={618} width={106} height={60} fill={palette.display} />
    <path d="M782 648h10M808 648h10M800 630v10M800 656v10" stroke={palette.arm} strokeOpacity={0.85} strokeWidth={3} />
    <circle cx={800} cy={648} r={4} fill={palette.dot} />
    <rect x={796} y={684} width={8} height={12} fill={palette.surface} />
    <rect x={780} y={694} width={40} height={3} fill={palette.surface} />
    {/* Lamp: arm and shade. */}
    <line x1={936} y1={696} x2={904} y2={606} stroke={palette.frame} strokeWidth={3} />
    <path d="M888 610L920 610L928 630L880 630Z" fill={palette.surface} />
  </svg>
);

export default Poster;
