export const isDigit = (str: string) => {
	const digit = /^\d+$/;
	return digit.test(str);
};
