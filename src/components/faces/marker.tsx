import { cn } from "@/lib/utils";

interface MarkerProps {
  /** the eyebrow label */
  label: string;
  /** which signal color the bar carries: shell (green/human) or agent (magenta/AI) */
  tone?: "shell" | "agent";
  /** center the marker (for centered sections) */
  center?: boolean;
  className?: string;
}

/**
 * The Lacy-Shell prompt-bar eyebrow — the structural signature shared by both
 * faces. A short colored bar (green = shell/human, magenta = agent/AI) beside
 * an uppercase label.
 */
export function Marker({ label, tone = "shell", center, className }: MarkerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-[11px]",
        center && "justify-center",
        className,
      )}
    >
      <span
        className={cn(
          "h-[15px] w-[3px] rounded-[2px]",
          tone === "shell" ? "bg-shell shadow-[0_0_12px] shadow-shell/50" : "bg-agent shadow-[0_0_12px] shadow-agent/45",
        )}
        aria-hidden
      />
      <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-mute">
        {label}
      </span>
    </div>
  );
}
