/**
 * The ambient aurora wash behind the whole home — a fixed field of soft
 * radial glows built from the mood's --aur-* tokens, so it recolors with the
 * mood dial. The Silk shader (Phase 2) layers into the hero on top of this.
 */
export function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ground">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: [
            "radial-gradient(60% 45% at 82% -8%, hsl(var(--aur-1) / 0.28), transparent 60%)",
            "radial-gradient(55% 40% at 8% 4%, hsl(var(--aur-2) / 0.20), transparent 58%)",
            "radial-gradient(85% 60% at 50% 112%, hsl(var(--aur-3) / 0.30), transparent 62%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
