"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MoodDial } from "@/components/mood/mood-dial";
import { cn } from "@/lib/utils";

interface ScrollNavProps {
  nav: { href: string; label: string }[];
}

export function ScrollNav({ nav }: ScrollNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(20px,5vw,64px)] py-[22px] backdrop-blur-[14px] transition-[background-color,border-color] duration-500",
          scrolled
            ? "border-b border-hair bg-ground/90"
            : "border-b border-transparent",
        )}
        style={
          scrolled
            ? undefined
            : { background: "linear-gradient(to bottom, hsl(var(--ground) / 0.72), transparent)" }
        }
      >
        <Link href="#top" className="text-[15px] font-semibold tracking-[0.01em] text-ink">
          Lacy Morrow{" "}
          <span className="font-normal text-ink-mute">·&nbsp;builder</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-[clamp(14px,3vw,34px)]">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="hidden text-[13.5px] tracking-[0.01em] text-ink-soft transition-colors hover:text-ink sm:inline"
            >
              {n.label}
            </a>
          ))}
          <Link
            href="/work"
            title="A focused, credibility-first view — for recruiters & proposals"
            className="hidden items-center gap-2 rounded-full border border-hair-strong px-[14px] py-[7px] font-mono text-[12px] tracking-[0.04em] text-ink-soft transition-colors hover:border-shell hover:text-ink min-[660px]:inline-flex"
          >
            <span
              className="h-[5px] w-[5px] rounded-full bg-shell shadow-[0_0_8px] shadow-shell/50"
              aria-hidden
            />
            /work
          </Link>
          <MoodDial />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="relative z-[60] flex h-8 w-8 flex-col items-center justify-center gap-[5px] sm:hidden"
          >
            <span
              className={cn(
                "h-[1.5px] w-[18px] rounded-full bg-ink transition-all duration-300",
                mobileOpen && "translate-y-[6.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-[1.5px] w-[18px] rounded-full bg-ink transition-all duration-300",
                mobileOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-[1.5px] w-[18px] rounded-full bg-ink transition-all duration-300",
                mobileOpen && "-translate-y-[6.5px] -rotate-45",
              )}
            />
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ground/60 backdrop-blur-sm sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <nav
        aria-label="Mobile"
        className={cn(
          "fixed inset-y-0 right-0 z-[45] flex w-[min(280px,80vw)] flex-col gap-2 bg-ground/95 px-8 pt-[100px] backdrop-blur-xl transition-transform duration-300 sm:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {nav.map((n) => (
          <a
            key={n.href}
            href={n.href}
            onClick={() => setMobileOpen(false)}
            className="py-3 text-[1.1rem] font-light tracking-[-0.01em] text-ink-soft transition-colors hover:text-ink"
          >
            {n.label}
          </a>
        ))}
        <Link
          href="/work"
          onClick={() => setMobileOpen(false)}
          className="mt-2 inline-flex items-center gap-2 py-3 font-mono text-[13px] tracking-[0.04em] text-shell transition-colors hover:text-ink"
        >
          <span
            className="h-[5px] w-[5px] rounded-full bg-shell shadow-[0_0_8px] shadow-shell/50"
            aria-hidden
          />
          /work
        </Link>
        <a
          href="https://github.com/lacymorrow"
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 font-mono text-[13px] text-ink-mute transition-colors hover:text-ink"
        >
          GitHub ↗
        </a>
      </nav>
    </>
  );
}
