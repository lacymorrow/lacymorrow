// Improved throttle function from https://underscorejs.org/docs/modules/throttle.html
// Prevents a function from being called too often
// Allows for leading and trailing options

const now = (): number => new Date().getTime();

export const throttle = (
	func: Function,
	wait: number,
	options: { leading?: boolean; trailing?: boolean } = {
		leading: false,
		trailing: true,
	},
): Function => {
	let timeout: ReturnType<typeof setTimeout> | null;
	let context: any;
	let args: IArguments | null;
	let result: any;
	let previous = 0;
	// eslint-disable-next-line no-param-reassign
	if (!options) options = {};

	const later = (): void => {
		previous = options.leading === false ? 0 : now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) {
			context = null;
			args = null;
		}
	};

	// eslint-disable-next-line func-names
	const throttled = function (this: any): any {
		const currentTime = now();
		if (!previous && options.leading === false) previous = currentTime;
		const remaining = wait - (currentTime - previous);
		context = this;
		// eslint-disable-next-line prefer-rest-params
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = currentTime;
			result = func.apply(context, args);
			if (!timeout) {
				context = null;
				args = null;
			}
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};

	// eslint-disable-next-line func-names
	throttled.cancel = function (): void {
		if (timeout) {
			clearTimeout(timeout);
		}
		previous = 0;
		timeout = null;
		context = null;
		args = null;
	};

	return throttled;
};

// Simple throttle function
// export const throttle = (fn: Function, wait: number) => {
// 	let timeout: any;
// 	return (...args: any[]) => {
// 		if (!timeout) {
// 			timeout = setTimeout(() => {
// 				fn(...args);
// 				timeout = null;
// 			}, wait);
// 		}
// 	};
// };
