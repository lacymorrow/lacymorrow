/**
 * The L mark. Same letterform weight as the home wordmark, filled with the
 * hero ribbon (blue, violet, pink, orange from src/components/ui/shaders.tsx).
 * The hairlines resolve at large sizes and average out to a gradient below
 * about 48px, which is why the favicon can be this same file.
 */
export const Mark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <clipPath id="lm-l">
        <path d="M140 80 L260 80 L260 312 L372 312 L372 432 L140 432 Z" />
      </clipPath>
      <linearGradient id="lm-g" gradientUnits="userSpaceOnUse" x1="140" y1="80" x2="372" y2="432">
        <stop offset="0" stopColor="#4D66FF" />
        <stop offset=".34" stopColor="#9E4DF5" />
        <stop offset=".67" stopColor="#F0389E" />
        <stop offset="1" stopColor="#FF8C47" />
      </linearGradient>
      <pattern id="lm-s" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-60)">
        <rect width="12" height="5" fill="#000" fillOpacity="0.2" />
      </pattern>
    </defs>
    <rect width="512" height="512" fill="url(#lm-g)" clipPath="url(#lm-l)" />
    <rect width="512" height="512" fill="url(#lm-s)" clipPath="url(#lm-l)" />
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
