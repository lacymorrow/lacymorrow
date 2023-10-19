const debounce = function (func: (Function), wait: number = 100) {
	let timeout: NodeJS.Timeout | string | number | undefined;
	return function (this: Function, ...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};
};

export default debounce;
