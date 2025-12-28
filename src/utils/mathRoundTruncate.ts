const mathRoundTruncate = (value: number, precision: number = 0): number => {
	return Math.trunc(value * Math.pow(10, precision)) / Math.pow(10, precision);
};

export default mathRoundTruncate;
