export const prefersReducedMotion = () => {
	if (typeof window === 'undefined') {
		return false;
	}
	// Grab the prefers reduced media query.
	const mediaQuery = window?.matchMedia('(prefers-reduced-motion: reduce)');
	return !mediaQuery || mediaQuery.matches;
};
