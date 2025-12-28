const prettySnakeCase = (str: string): string => {
	return str.split('_')
		.map((word: string) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
}

export default prettySnakeCase;
