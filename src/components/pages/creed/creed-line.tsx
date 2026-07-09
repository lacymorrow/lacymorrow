import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface CreedLineProps {
	text: string;
	reducedMotion?: boolean;
}

// Focus zone ≈ the middle 30% of the viewport: with offset ["start end", "end start"]
// a short element sits at viewport center when scroll progress ≈ 0.5.
const PROGRESS = [0, 0.25, 0.4, 0.6, 0.75, 1];
const OPACITY = [0.05, 0.15, 1, 1, 0.15, 0.05];
const DRIFT = [8, 6, 0, 0, -6, -8];

export const CreedLine = ({ text, reducedMotion }: CreedLineProps) => {
	const ref = useRef<HTMLParagraphElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});
	const opacity = useTransform(scrollYProgress, PROGRESS, OPACITY);
	const y = useTransform(scrollYProgress, PROGRESS, DRIFT);

	return (
		<motion.p
			ref={ref}
			className="creed-line"
			style={reducedMotion ? undefined : { opacity, y }}
		>
			{text}
		</motion.p>
	);
};
