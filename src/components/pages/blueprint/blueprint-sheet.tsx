/**
 * The drawing on /blueprint: a figure cut into four assemblies and pulled
 * apart on isometric plates, the way an exploded axonometric separates a
 * building into its systems.
 *
 * No text lives inside this SVG beyond the keynote numbers, because SVG text
 * scales with the drawing and would be unreadable on a phone. Everything else
 * is HTML around the sheet.
 */

const CENTER_X = 430;
const PLATE_HALF_WIDTH = 200;
const PLATE_HALF_DEPTH = 62;

/** Plate centers, top assembly first. */
const PLATES = [250, 580, 880, 1180];

/** An isometric plate: the horizontal plane each assembly rests on. */
const plate = (y: number) =>
	[
		`${CENTER_X},${y - PLATE_HALF_DEPTH}`,
		`${CENTER_X + PLATE_HALF_WIDTH},${y}`,
		`${CENTER_X},${y + PLATE_HALF_DEPTH}`,
		`${CENTER_X - PLATE_HALF_WIDTH},${y}`,
	].join(' ');

interface KeynoteBubbleProps {
	number: number;
	/** Bubble position. */
	x: number;
	y: number;
	/** Where the leader line lands on the drawing. */
	targetX: number;
	targetY: number;
}

const KeynoteBubble = ({
	number,
	x,
	y,
	targetX,
	targetY,
}: KeynoteBubbleProps) => (
	<g>
		<line className="bp-leader" x1={x - 24} y1={y} x2={x - 56} y2={y} />
		<line className="bp-leader" x1={x - 56} y1={y} x2={targetX} y2={targetY} />
		<circle className="bp-leader-dot" cx={targetX} cy={targetY} r={4} />
		<circle className="bp-bubble" cx={x} cy={y} r={23} />
		<text className="bp-bubble-number" x={x} y={y}>
			{number}
		</text>
	</g>
);

/** An almond eye with a pupil, drawn around its own center. */
const Eye = ({ x, y, cut }: { x: number; y: number; cut?: boolean }) => (
	<g>
		<path
			className={cut ? 'bp-accent' : 'bp-line'}
			d={`M ${x - 19} ${y} q 19 -15 38 0 q -19 15 -38 0`}
		/>
		<circle
			className={cut ? 'bp-pupil-accent' : 'bp-pupil'}
			cx={x}
			cy={y}
			r={5}
		/>
	</g>
);

export const BlueprintSheet = () => (
	<svg
		className="bp-drawing"
		viewBox="0 0 900 1300"
		role="img"
		aria-labelledby="bp-drawing-title bp-drawing-desc"
	>
		<title id="bp-drawing-title">
			Exploded sectional elevation of a person
		</title>
		<desc id="bp-drawing-desc">
			A figure drawn in blueprint hairlines and separated into four numbered
			assemblies on stacked isometric plates: a head cut in half down the
			middle with one eye looking outward and one looking inward, a ribcage
			carrying service runs, a braced pelvic frame, and legs standing on a
			hatched footing pad. The four keynotes beside the drawing describe each
			assembly.
		</desc>

		<defs>
			{/* Standard 45-degree section hatch, for faces the cut passes through. */}
			<pattern
				id="bp-hatch"
				width={8}
				height={8}
				patternUnits="userSpaceOnUse"
				patternTransform="rotate(45)"
			>
				<line className="bp-hatch-line" x1={0} y1={0} x2={0} y2={8} />
			</pattern>
			<marker
				id="bp-arrow"
				viewBox="0 0 10 10"
				refX={9}
				refY={5}
				markerWidth={6}
				markerHeight={6}
				orient="auto-start-reverse"
			>
				<path className="bp-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
			</marker>
		</defs>

		{/* Projection lines: what tells the eye these parts belong together. */}
		<g aria-hidden="true">
			{[CENTER_X, 330, 530].map((x) => (
				<line className="bp-ghost" key={x} x1={x} y1={40} x2={x} y2={1240} />
			))}
		</g>

		{/* The one overall dimension. Its label is HTML, alongside the sheet. */}
		<g aria-hidden="true">
			<line
				className="bp-dimension"
				x1={46}
				y1={40}
				x2={46}
				y2={1210}
				markerStart="url(#bp-arrow)"
				markerEnd="url(#bp-arrow)"
			/>
			<line className="bp-dimension-tick" x1={28} y1={40} x2={64} y2={40} />
			<line className="bp-dimension-tick" x1={28} y1={1210} x2={64} y2={1210} />
		</g>

		{/* 1. Section cut through the head. One eye looks out, one looks in. */}
		<g className="bp-layer" style={{ animationDelay: '0ms' }}>
			<polygon className="bp-plate" points={plate(PLATES[0])} />
			<path
				className="bp-cut-fill"
				d="M 430 30 A 74 86 0 0 1 430 202 Z"
				fill="url(#bp-hatch)"
			/>
			<ellipse className="bp-line" cx={430} cy={116} rx={74} ry={86} />
			<path className="bp-line" d="M 406 196 L 406 246 M 454 196 L 454 246" />
			{/* Interior, revealed by the cut. */}
			<path className="bp-line-soft" d="M 430 54 A 48 58 0 0 1 430 178" />
			<path className="bp-line-soft" d="M 430 76 A 26 32 0 0 1 430 154" />
			<line className="bp-cut" x1={430} y1={28} x2={430} y2={248} />
			<Eye x={392} y={106} />
			<Eye x={468} y={106} cut />
			{/* The left eye looks out of the drawing. */}
			<line
				className="bp-sightline-soft"
				x1={373}
				y1={106}
				x2={300}
				y2={106}
				markerEnd="url(#bp-arrow)"
			/>
			{/* The right eye, on the cut side, turns back into the interior. */}
			<path
				className="bp-sightline"
				d="M 468 122 Q 468 170 434 160"
				markerEnd="url(#bp-arrow)"
			/>
			<KeynoteBubble number={1} x={700} y={110} targetX={504} targetY={96} />
		</g>

		{/* 2. Systems: the ribcage, run like mechanical services. */}
		<g className="bp-layer" style={{ animationDelay: '120ms' }}>
			<polygon className="bp-plate" points={plate(PLATES[1])} />
			{/* Shoulder yoke, drawn as one line so the chest closes at the top. */}
			<path className="bp-line" d="M 325 406 L 380 392 L 480 392 L 535 406" />
			<path className="bp-line" d="M 380 392 Q 364 470 392 556" />
			<path className="bp-line" d="M 480 392 Q 496 470 468 556" />
			<path className="bp-line" d="M 392 556 Q 430 570 468 556" />
			{[424, 456, 488, 520].map((y, index) => (
				<path
					className="bp-line-soft"
					key={y}
					d={`M ${378 - index * 2} ${y} Q 430 ${y + 16} ${482 + index * 2} ${y}`}
				/>
			))}
			<line className="bp-ghost" x1={430} y1={396} x2={430} y2={560} />
			{/* Arms, hanging close to the body. */}
			<path className="bp-line" d="M 325 406 Q 308 486 316 568" />
			<path className="bp-line" d="M 352 414 Q 338 486 344 568" />
			<path className="bp-line" d="M 535 406 Q 552 486 544 568" />
			<path className="bp-line" d="M 508 414 Q 522 486 516 568" />
			{/* Service run: the part of a body that is wired, not framed. */}
			<path className="bp-accent" d="M 430 548 L 430 486 L 470 458 L 470 410" />
			<circle className="bp-node" cx={430} cy={486} r={5} />
			<circle className="bp-node" cx={470} cy={458} r={5} />
			<KeynoteBubble number={2} x={700} y={462} targetX={535} targetY={406} />
		</g>

		{/* 3. Structure: the braced frame that carries the load. */}
		<g className="bp-layer" style={{ animationDelay: '240ms' }}>
			<polygon className="bp-plate" points={plate(PLATES[2])} />
			<path className="bp-line" d="M 384 700 L 476 700 L 466 768 L 394 768 Z" />
			<path
				className="bp-line-soft"
				d="M 384 700 L 466 768 M 476 700 L 394 768"
			/>
			<circle className="bp-joint" cx={400} cy={762} r={7} />
			<circle className="bp-joint" cx={460} cy={762} r={7} />
			<path className="bp-line" d="M 390 768 L 388 872 M 414 768 L 414 872" />
			<path className="bp-line" d="M 446 768 L 446 872 M 470 768 L 472 872" />
			<KeynoteBubble number={3} x={700} y={744} targetX={476} targetY={706} />
		</g>

		{/* 4. Footing: shins, feet, and the pad everything is poured on. */}
		<g className="bp-layer" style={{ animationDelay: '360ms' }}>
			<polygon className="bp-plate" points={plate(PLATES[3])} />
			<path className="bp-line" d="M 392 1048 L 394 1148 M 414 1048 L 414 1148" />
			<path className="bp-line" d="M 446 1048 L 446 1148 M 468 1048 L 466 1148" />
			{/* Knees above, ankles below: the joints the load passes through. */}
			<circle className="bp-joint" cx={403} cy={1050} r={8} />
			<circle className="bp-joint" cx={457} cy={1050} r={8} />
			<circle className="bp-joint" cx={403} cy={1148} r={8} />
			<circle className="bp-joint" cx={457} cy={1148} r={8} />
			<path className="bp-line" d="M 391 1152 L 384 1178 L 428 1178 L 417 1152" />
			<path className="bp-line" d="M 469 1152 L 476 1178 L 432 1178 L 443 1152" />
			<rect
				className="bp-cut-fill"
				x={352}
				y={1178}
				width={156}
				height={26}
				fill="url(#bp-hatch)"
			/>
			<rect className="bp-cut" x={352} y={1178} width={156} height={26} />
			<KeynoteBubble number={4} x={700} y={1066} targetX={468} targetY={1060} />
		</g>
	</svg>
);
