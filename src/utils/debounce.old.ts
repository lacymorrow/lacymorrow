const debounce = function (func: (...args: any[]) => void, wait: number = 100) {
	let timeout: NodeJS.Timeout | string | number | undefined;
	return function (this: unknown, ...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};
};

export default debounce;
