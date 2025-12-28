const prettyCamelCase = (str: string): string => {
	return str.split(/(?=[A-Z])/)
		.map((word: string) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
}

export default prettyCamelCase;
