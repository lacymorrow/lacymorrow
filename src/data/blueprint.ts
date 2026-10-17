/**
 * Content for /blueprint — a drafting sheet whose subject is a person instead
 * of a building. Keynotes are numbered top to bottom, the way they are read on
 * a real sheet, and each one matches a numbered bubble in the drawing.
 */

export interface BlueprintKeynote {
	/** Bubble number in the drawing. */
	number: number;
	/** Sheet-style code for the assembly this layer stands in for. */
	code: string;
	/** The building system, in drafting language. */
	system: string;
	/** What the system is, in plain language. */
	title: string;
	/** Two or three facts, shortest first. */
	items: string[];
}

export const keynotes: BlueprintKeynote[] = [
	{
		number: 1,
		code: 'A-01',
		system: 'Section cut',
		title: 'Where the work gets imagined',
		items: [
			'Agentic engineering: Duke Energy, American City Business Journals, 2025 to 2026',
			'Fleets of coding agents that ship real pull requests',
			'The eyes face inward on this sheet. That is the whole premise',
		],
	},
	{
		number: 2,
		code: 'A-02',
		system: 'Systems',
		title: 'What is running right now',
		items: [
			'Juno, an AI desktop app',
			'lacy, an AI shell you talk to',
			'Paperclip, a company of agents that holds its own standup',
		],
	},
	{
		number: 3,
		code: 'A-03',
		system: 'Structure',
		title: 'The load-bearing years',
		items: [
			'Twilio, Senior Web Engineer on the Brand Team, 2017 to 2022',
			'The Paste design system and the SIGNAL conference sites',
			'Credit Karma, Novant Health, Lowe’s, Viasat, Swell Energy',
		],
	},
	{
		number: 4,
		code: 'A-04',
		system: 'Footing',
		title: 'What it was poured on',
		items: [
			'Flash, drawn frame by frame, starting 2003',
			'PHP and WordPress themes, including Casper',
			'Open source in JavaScript, PHP and Python, still up',
		],
	},
];

/**
 * The one overall dimension on the sheet. Per-layer years live in the keynotes
 * where they can be read, rather than as four more labels on the chain.
 */
export const overallDimension = {
	span: '2003 to 2026',
	measure: '23 years',
};

/** Fields in the title block, drawn bottom right the way a real sheet does it. */
export const titleBlock = [
	{ label: 'Project', value: 'Lacy Morrow' },
	{ label: 'Drawing', value: 'Sectional elevation, exploded' },
	{ label: 'Sheet', value: 'A-01' },
	{ label: 'Scale', value: '1:1, life size' },
	{ label: 'Drawn by', value: 'Hand and machine' },
	{ label: 'Date', value: '2026' },
	{ label: 'Revision', value: '01' },
];
