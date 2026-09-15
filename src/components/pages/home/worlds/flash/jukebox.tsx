import { pieces, atlasUrl, type Piece } from "./pieces";

/**
 * The player. One component, used twice: the Poster renders it still, the
 * world renders it playing. Everything here is DOM, so the playlist is a real
 * list of real links that never moves. docs/worlds/flash.md.
 */

export const BACKDROP = "#06070f";
const CHROME_TOP = "#3a3f47";
const CHROME_BOTTOM = "#22262c";
const WELL = "#0c0d11";
const ROW_A = "#131519";
const ROW_B = "#0f1115";
const NOW = "#4ade80";
const INK = "#e7e7ea";
const DIM = "#8b8f97";

/**
 * Where each captured frame sits in the 2 by 2 atlas. The sampled box is a
 * whisker over a quarter so a scaled WebP never shows a sliver of the frame
 * next door along the seam.
 */
const FRAME_POSITION = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"] as const;
const FRAME_ZOOM = "201% 201%";

interface JukeboxProps {
  /** The piece on the screen. */
  current: number;
  /** Which captured frame, 0 to 3: the piece drawing itself. */
  frame: number;
  quality?: "low" | "high";
  /** Pointing at a row previews it. The Poster passes nothing. */
  onPreview?: (index: number | null) => void;
}

const Row = ({
  piece,
  index,
  isCurrent,
  onPreview,
}: {
  piece: Piece;
  index: number;
  isCurrent: boolean;
  onPreview?: (index: number | null) => void;
}) => (
  <li style={{ background: index % 2 === 0 ? ROW_A : ROW_B }}>
    <a
      href={piece.href}
      onMouseEnter={onPreview ? () => onPreview(index) : undefined}
      onFocus={onPreview ? () => onPreview(index) : undefined}
      onBlur={onPreview ? () => onPreview(null) : undefined}
      className="flex items-baseline gap-2 px-2 py-[2px] no-underline outline-none"
      style={{
        color: isCurrent ? NOW : INK,
        background: isCurrent ? "rgba(74,222,128,0.10)" : "transparent",
        boxShadow: isCurrent ? `inset 2px 0 0 ${NOW}` : "none",
      }}
    >
      <span style={{ color: isCurrent ? NOW : DIM, fontSize: 10 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="truncate" style={{ fontSize: 11.5 }}>
        {piece.name}
      </span>
    </a>
  </li>
);

export const Jukebox = ({ current, frame, quality = "high", onPreview }: JukeboxProps) => {
  const piece = pieces[current] ?? pieces[0];
  if (!piece) return null;

  return (
    <div
      // The player sits up top and leaves the bottom of the panel to the
      // stage's overlay copy, which is why this padding is not symmetric.
      className="flex size-full items-start justify-center px-4 pb-[176px] pt-[64px] sm:px-8 sm:pt-[88px]"
      style={{ background: BACKDROP, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
    >
      <div
        className="flex w-full max-w-[760px] flex-col overflow-hidden rounded-[4px]"
        style={{
          border: "1px solid #4a505a",
          boxShadow: "0 1px 0 rgba(255,255,255,0.12) inset, 0 24px 60px rgba(0,0,0,0.6)",
          background: `linear-gradient(${CHROME_TOP}, ${CHROME_BOTTOM})`,
        }}
      >
        <div
          className="flex items-center justify-between px-2 py-[6px]"
          style={{
            borderBottom: "1px solid #191c21",
            boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset",
          }}
        >
          <span style={{ fontSize: 11, letterSpacing: "0.08em", color: INK }}>
            flashart.swf
          </span>
          <span className="flex gap-[5px]" aria-hidden="true">
            {["#7a8088", "#7a8088", "#7a8088"].map((c, i) => (
              <span
                key={i}
                className="block size-[9px] rounded-[2px]"
                style={{ background: c, boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset" }}
              />
            ))}
          </span>
        </div>

        <div className="flex flex-col gap-[6px] p-[6px] sm:flex-row">
          <div
            className="relative w-full self-start sm:w-[58%]"
            style={{
              aspectRatio: "4 / 3",
              background: `${WELL} url(${atlasUrl(piece.name, quality)}) no-repeat`,
              backgroundSize: FRAME_ZOOM,
              backgroundPosition: FRAME_POSITION[Math.min(3, Math.max(0, frame))],
              border: "1px solid #14171c",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset",
              imageRendering: "auto",
            }}
            role="img"
            aria-label={`${piece.name}, a Flash piece drawing itself`}
          />

          <div
            className="flex min-w-0 flex-1 flex-col"
            style={{ border: "1px solid #14171c", background: ROW_B }}
          >
            <div
              className="px-2 py-[3px]"
              style={{ fontSize: 10, letterSpacing: "0.1em", color: DIM, background: "#181b20" }}
            >
              {pieces.length} pieces
            </div>
            {/* Two columns at every width. One column of 21 rows makes the
                window taller than the screen beside it, which leaves a band
                of empty chrome under the art. */}
            <ol className="m-0 grid flex-1 list-none grid-cols-2 content-start gap-0 p-0">
              {pieces.map((p, i) => (
                <Row
                  key={p.name}
                  piece={p}
                  index={i}
                  isCurrent={i === current}
                  onPreview={onPreview}
                />
              ))}
            </ol>
          </div>
        </div>

        <div
          className="flex items-center justify-between gap-3 px-2 py-[6px]"
          style={{ borderTop: "1px solid #191c21", fontSize: 11, color: DIM }}
        >
          <span className="truncate">
            <span style={{ color: INK }}>{piece.name}</span>
            <span className="px-2">·</span>
            ActionScript
          </span>
          <a
            href={piece.href}
            className="shrink-0 no-underline"
            style={{ color: NOW }}
            onMouseEnter={onPreview ? () => onPreview(current) : undefined}
          >
            open this piece &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default Jukebox;
