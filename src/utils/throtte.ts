// Prevents a function from being called too often
export const throttle = (fn: Function, wait: number) => {
	let timeout: any;
	return (...args: any[]) => {
		if (!timeout) {
			timeout = setTimeout(() => {
				fn(...args);
				timeout = null;
			}, wait);
		}
	};
};
