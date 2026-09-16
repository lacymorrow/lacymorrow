import { COUNT, RUNNER_SHEETS } from "./data";
import { DESK_Z, presses } from "./layout";
import { palette } from "./palette";

/**
 * The still: the crane shot at the end of the timeline, drawn flat as inline
 * SVG. Server rendered, and the permanent fallback for reduced motion, no
 * WebGL, a failed world, and JavaScript off. docs/worlds/fleet.md section 8.
 */

export const POSTER_ALT =
  "A dark print shop at night, drawn flat. Two rows of seventeen platen presses face a center aisle, each with a small status lamp. A pale runner of paper, nine thousand one hundred sheets, one for every million tokens the agents have read, runs the length of the aisle to a desk at the far end, where one lamp is on and a signed sheet waits by the mail slot.";

/**
 * The same hall as the world, flattened. Near is the desk at the bottom of
 * the frame; the rows recede toward the door. One divide per point keeps the
 * drawing and the scene in agreement about where anything is.
 */
const depth = (z: number) => 1 / (1 + (DESK_Z - z) * 0.075);

const pt = (x: number, y: number, z: number): [number, number] => {
  const d = depth(z);
  return [800 + x * 130 * d, 300 + 430 * d - y * 130 * d];
};

const poly = (points: [number, number][]) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Fourteen running, two still waiting their turn, one refusing. */
const lampColor = (i: number) =>
  i === 2 ? palette.refused : i === 13 || i === 16 ? palette.waiting : palette.running;

const Press = ({ index }: { index: number }) => {
  const press = presses[index]!;
  const { side, z } = press;
  // The face that looks at the aisle, and the top, which is all the depth a
  // flat drawing needs.
  const inner = side * 1.6;
  const outer = side * 2.85;
  const near = z - 0.8;
  const far = z + 0.8;
  const h = 1.3;

  const face = poly([pt(inner, 0, near), pt(inner, h, near), pt(inner, h, far), pt(inner, 0, far)]);
  const top = poly([pt(inner, h, near), pt(outer, h, near), pt(outer, h, far), pt(inner, h, far)]);
  const [lx, ly] = pt(inner, h * 0.78, z);

  return (
    <g>
      <polygon points={top} fill={palette.body} />
      <polygon points={face} fill={palette.platen} />
      <circle cx={lx} cy={ly} r={3.4 * depth(z) + 1.4} fill={lampColor(index)} />
    </g>
  );
};

export const Poster = () => {
  // Far to near, so the near rows sit over the far ones.
  const order = [...presses].sort((a, b) => a.z - b.z);
  const [deskL, deskT] = pt(-0.8, 0.78, DESK_Z - 0.4);
  const [deskR] = pt(0.8, 0.78, DESK_Z - 0.4);
  const [, deskB] = pt(-0.8, 0, DESK_Z - 0.4);

  return (
    <div
      className="size-full"
      style={{ background: palette.background }}
      role="img"
      aria-label={POSTER_ALT}
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="size-full"
        aria-hidden="true"
      >
        <title>{POSTER_ALT}</title>
        <rect width="1600" height="900" fill={palette.background} />
        <polygon
          points={poly([pt(-3.5, 0, 1), pt(3.5, 0, 1), pt(3.5, 0, DESK_Z + 1), pt(-3.5, 0, DESK_Z + 1)])}
          fill={palette.floor}
        />
        {/* The runner: one sheet per million tokens, drawn as the strip they
            make when you lay them all down the aisle. */}
        <polygon
          points={poly([pt(-0.85, 0, 1.2), pt(0.85, 0, 1.2), pt(0.85, 0, 23), pt(-0.85, 0, 23)])}
          fill={palette.paper}
          opacity="0.6"
        />
        {order.map((press) => (
          <Press key={press.role.name} index={press.index} />
        ))}
        {/* The one warm light in the world. */}
        <ellipse
          cx={(deskL + deskR) / 2}
          cy={deskT + 6}
          rx={(deskR - deskL) * 0.78}
          ry={54}
          fill={palette.deskLamp}
          opacity="0.14"
        />
        <polygon
          points={poly([
            pt(-0.8, 0.78, DESK_Z - 0.4),
            pt(0.8, 0.78, DESK_Z - 0.4),
            pt(0.8, 0.78, DESK_Z + 0.4),
            pt(-0.8, 0.78, DESK_Z + 0.4),
          ])}
          fill={palette.body}
        />
        <polygon points={poly([pt(-0.8, 0.78, DESK_Z - 0.4), pt(0.8, 0.78, DESK_Z - 0.4), pt(0.8, 0, DESK_Z - 0.4), pt(-0.8, 0, DESK_Z - 0.4)])} fill={palette.steel} />
        {/* The signed sheet, waiting by the slot. */}
        <polygon
          points={poly([
            pt(-0.11, 0.79, DESK_Z - 0.3),
            pt(0.11, 0.79, DESK_Z - 0.3),
            pt(0.11, 0.79, DESK_Z + 0.0),
            pt(-0.11, 0.79, DESK_Z + 0.0),
          ])}
          fill={palette.paper}
        />
        <path
          d={`M${pt(-0.04, 0.8, DESK_Z - 0.22).join(" ")} q 22 -14 44 2 q 16 10 30 -6`}
          stroke={palette.ink}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x={deskR - 40}
          y={deskT - 34}
          width={34}
          height={34}
          fill={palette.steel}
        />
        <rect x={deskR - 35} y={deskT - 25} width={24} height={4} fill={palette.background} />
        {/* Keeps the bottom of the frame dark enough for the overlay copy. */}
        <rect y={deskB - 30} width="1600" height={930 - deskB} fill={palette.background} opacity="0.55" />
      </svg>
      <span className="sr-only">
        {COUNT} presses, one for each agent. {RUNNER_SHEETS.toLocaleString()} sheets on the runner,
        one for every million tokens they have read.
      </span>
    </div>
  );
};

export default Poster;
