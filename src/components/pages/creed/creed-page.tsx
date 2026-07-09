import { motion, useReducedMotion } from 'framer-motion';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';

import Silk from '@/components/ui/react-bits/silk';
import { creed } from '@/data/creed';
import { CreedLine } from './creed-line';

// Variable font — weight 200 is applied via the .creed-line CSS rule.
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

// Aurora palette: cosmic base, shell-green (human), agent-magenta (AI).
const AURORA_COLORS = ['#0A0A12', '#1B3A2D', '#2D1B3A'];

const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 767px)');
		const update = () => setIsMobile(mediaQuery.matches);
		update();
		mediaQuery.addEventListener('change', update);
		return () => mediaQuery.removeEventListener('change', update);
	}, []);

	return isMobile;
};

// False during SSR and hydration, true after — so markup that depends on
// client-only values stays identical between server and client.
const useMounted = () =>
	useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);

export const CreedPage = () => {
	// useReducedMotion() is null during SSR but a boolean on the client, so
	// honor it only after mount to keep server and client markup identical.
	const mounted = useMounted();
	const prefersReducedMotion = useReducedMotion();
	const reducedMotion = mounted && !!prefersReducedMotion;
	const isMobile = useIsMobile();

	return (
		<div className={`creed-root ${inter.className}`}>
			<div className="creed-bg" aria-hidden="true">
				<Silk
					speed={reducedMotion ? 0 : isMobile ? 1 : 1.5}
					scale={0.8}
					colors={AURORA_COLORS}
					colorMix={0.6}
					noiseIntensity={2.0}
					rotation={0.2}
					dpr={isMobile ? [1, 1.5] : [1, 2]}
					frameloop={reducedMotion ? 'demand' : 'always'}
				/>
			</div>
			<div className="creed-vignette" aria-hidden="true" />

			<Link href="/" className="creed-escape">
				&larr; lacymorrow.com
			</Link>

			<main className="creed-content">
				{creed.map((text) => (
					<CreedLine key={text} text={text} reducedMotion={reducedMotion} />
				))}
			</main>

			{!reducedMotion && (
				<motion.div
					className="creed-scroll-hint"
					aria-hidden="true"
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 0.2, 0] }}
					transition={{ duration: 3, times: [0, 0.4, 1], delay: 1 }}
				>
					&#8964;
				</motion.div>
			)}
		</div>
	);
};
