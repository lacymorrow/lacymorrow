/**
 * The dawn wash for the Daybreak face — a warm glow from above (amber/rose/
 * lilac, from the daybreak --aur-* tokens) that fades down into the porcelain
 * ground. The counterpart to Aurora's cosmic field.
 */
export function DaybreakBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ground">
      <div
        className="absolute inset-x-0 top-0 h-[72vh] opacity-80"
        style={{
          background: [
            "radial-gradient(70% 60% at 78% -12%, hsl(var(--aur-1) / 0.55), transparent 60%)",
            "radial-gradient(64% 54% at 14% -8%, hsl(var(--aur-2) / 0.45), transparent 60%)",
            "radial-gradient(92% 62% at 50% -22%, hsl(var(--aur-3) / 0.42), transparent 64%)",
          ].join(", "),
          maskImage: "linear-gradient(to bottom, black 0%, transparent 88%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 88%)",
        }}
      />
    </div>
  );
}
