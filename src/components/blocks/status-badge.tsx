import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/data/projects";

const CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "border-shell/40 text-shell bg-shell/8",
  },
  shipped: {
    label: "Shipped",
    className: "border-agent/40 text-agent bg-agent/8",
  },
  beta: {
    label: "Beta",
    className: "border-[hsl(var(--aur-1))]/40 text-[hsl(var(--aur-1))] bg-[hsl(var(--aur-1))]/8",
  },
  archived: {
    label: "Archived",
    className: "border-ink-mute/30 text-ink-mute bg-ink-mute/5",
  },
};

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const c = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] font-mono text-[11px] uppercase tracking-[0.12em]",
        c.className,
        className,
      )}
    >
      {(status === "active" || status === "beta") && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" aria-hidden />
      )}
      {c.label}
    </span>
  );
}
