"use client";

import { Moon, Sun } from "lucide-react";

import { otherMood } from "@/config/mood";
import { useMood } from "@/context/mood-provider";
import { cn } from "@/lib/utils";

/**
 * The mood dial — a quiet control that morphs the whole face aurora↔daybreak.
 * Toggling is always an explicit choice, so it persists across routes.
 */
export function MoodDial({ className }: { className?: string }) {
  const { mood, toggle } = useMood();
  const isAurora = mood === "aurora";
  const next = otherMood(mood);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch mood to ${next}`}
      title={`Switch to ${next}`}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-hair-strong px-3 py-1.5",
        "text-ink-soft transition-colors hover:border-agent hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agent focus-visible:ring-offset-2 focus-visible:ring-offset-ground",
        className,
      )}
    >
      {isAurora ? (
        <Moon className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12" aria-hidden />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden />
      )}
      <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
        {isAurora ? "Aurora" : "Daybreak"}
      </span>
    </button>
  );
}
