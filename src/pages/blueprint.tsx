import Head from 'next/head';

import { BlueprintPage } from '@/components/pages/blueprint/blueprint-page';

export default function Blueprint() {
	return (
		<>
			<Head>
				<title>Sectional Elevation | Lacy Morrow</title>
				<meta
					name="description"
					content="A drafting sheet whose subject is a person instead of a house: four assemblies, pulled apart, with the eyes facing inward."
				/>
				{/* Prototype sheet, kept out of search until it earns a place in the nav. */}
				<meta name="robots" content="noindex, follow" />
			</Head>
			<BlueprintPage />
		</>
	);
}
