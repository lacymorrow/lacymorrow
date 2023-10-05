import fs from 'fs/promises';
import path from 'path';
export const fetchVersion = async () => {
	const filepath = path.join(process.cwd(), 'version.txt');
	const data = await fs.readFile(filepath, 'utf8');
	// Remove 'v' and newlines
	return String(data).replace(/v|\n/g, '');
};
