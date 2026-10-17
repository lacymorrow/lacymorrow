/**
 * The mark. An L whose foot is the horizon, with the sun coming up over it:
 * L for Lacy, sunrise for Morrow (tomorrow). The sun carries the site's ribbon
 * palette (src/components/ui/shaders.tsx); the letter takes the text colour so
 * it sits right on the light docs theme and the dark home page alike.
 */
export const Mark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient id="lm-sun" gradientUnits="userSpaceOnUse" cx="302" cy="344" r="96">
        <stop offset="0" stopColor="#FF8C47" />
        <stop offset=".45" stopColor="#F0389E" />
        <stop offset=".8" stopColor="#9E4DF5" />
        <stop offset="1" stopColor="#4D66FF" />
      </radialGradient>
    </defs>
    <path d="M206 344 A96 96 0 0 1 398 344 Z" fill="url(#lm-sun)" />
    <path d="M112 84 H204 V344 H400 V428 H112 Z" fill="currentColor" />
  </svg>
);

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Mark className="size-5" />
      <div>Lacy Morrow</div>
    </div>
  );
};

export default Logo;
