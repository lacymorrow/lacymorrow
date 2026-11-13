import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

const MAX_TITLE = 70;

const fontData = fetch(new URL('../../assets/fonts/Inter-ExtraBold.ttf', import.meta.url)).then((res) => res.arrayBuffer());

function clean(value: string | null, fallback: string) {
	const text = (value ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_TITLE);
	return text || fallback;
}

// Inner-page card. Same system as the home card (public/og.jpg): black field,
// the hero ribbon's four stops on the right, one big line of text.
export default async function handler(req: NextRequest) {
	const font = await fontData;
	const { searchParams } = new URL(req.url);
	const title = clean(searchParams.get('title'), 'Lacy Morrow');
	const size = title.length > 40 ? 60 : title.length > 22 ? 80 : 104;

	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '80px 96px',
					background: '#09090b',
					color: '#fff',
					fontFamily: 'Inter',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						width: 280,
						height: 630,
						display: 'flex',
						background:
							'linear-gradient(160deg, #4D66FF 0%, #9E4DF5 34%, #F0389E 67%, #FF8C47 100%)',
						opacity: 0.9,
					}}
				/>
				<div style={{ display: 'flex', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
					Lacy Morrow
				</div>
				<div
					style={{
						display: 'flex',
						fontSize: size,
						fontWeight: 800,
						lineHeight: 1.05,
						letterSpacing: -2,
						maxWidth: 780,
					}}
				>
					{title}
				</div>
				<div style={{ display: 'flex', fontSize: 28, color: '#a1a1aa' }}>lacymorrow.com</div>
			</div>
		),
		{ width: 1200, height: 630, fonts: [{ name: 'Inter', data: font, weight: 800, style: 'normal' }] },
	);
}
