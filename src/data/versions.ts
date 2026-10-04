export interface SiteVersion {
	/** Version label, e.g. "v4". */
	version: string;
	/** Human readable span, e.g. "2010 to 2013". No dashes. */
	dateRange: string;
	/** One short line. The stack, nothing more. */
	note: string;
	url: string;
	screenshot: string;
	isCurrent: boolean;
}

export const versions: SiteVersion[] = [
	{
		version: "v4",
		dateRange: "2024 to now",
		note: "Next.js and Nextra",
		url: "/",
		screenshot: "/static/versions/v4.png",
		isCurrent: true,
	},
	{
		version: "v3",
		dateRange: "2014",
		note: "Foundation 5 and Grunt",
		url: "/v3/index.html",
		screenshot: "/static/versions/v3.png",
		isCurrent: false,
	},
	{
		version: "v2",
		dateRange: "2010 to 2013",
		note: "Foundation and jQuery",
		url: "/v2/index.html",
		screenshot: "/static/versions/v2.png",
		isCurrent: false,
	},
];
