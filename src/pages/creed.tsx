import Head from 'next/head';

import { CreedPage } from '@/components/pages/creed/creed-page';

export default function Creed() {
	return (
		<>
			<Head>
				<title>Creed — Lacy Morrow</title>
				<meta
					name="description"
					content="Words to live by — a quiet stream of aphorisms."
				/>
			</Head>
			<CreedPage />
		</>
	);
}
