import { promises as fs } from 'fs';

export const getJsonFile = async (src: string) => {
	return JSON.parse(
		await fs.readFile(
			src,
			'utf8',
		),
	)
};
