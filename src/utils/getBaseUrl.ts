import { cache } from 'react';

export const getBaseUrl = cache(() => {
	if (process.env.VERCEL_URL) {
		return process.env.VERCEL_URL;
	}

	if (process.env.PORT) {
		return `http://localhost:${process.env.PORT}`;
	}

	return 'https://lacymorrow.com';
});
