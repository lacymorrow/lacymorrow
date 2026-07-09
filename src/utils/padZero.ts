export const padZero = (str: string, len?: number) => {
	 
	len = len || 2;
	const zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
};
