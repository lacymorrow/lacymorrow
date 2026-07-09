import { motion, useReducedMotion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

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

export const CreedPage = () => {
	const reducedMotion = useReducedMotion();
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

			<a href="/" className="creed-escape">
				&larr; lacymorrow.com
			</a>

			<main className="creed-content">
				{creed.map((text) => (
					<CreedLine key={text} text={text} />
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
