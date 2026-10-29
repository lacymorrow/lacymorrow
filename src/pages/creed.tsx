import Head from 'next/head';

import { CreedPage } from '@/components/pages/creed/creed-page';

export default function Creed() {
	return (
		<>
			<Head>
				<title>Creed | Lacy Morrow</title>
				<meta
					name="description"
					content="A running list of aphorisms Lacy Morrow collects and tries to live by. One line at a time, added to whenever a good one turns up."
				/>
			</Head>
			<CreedPage />
		</>
	);
}
