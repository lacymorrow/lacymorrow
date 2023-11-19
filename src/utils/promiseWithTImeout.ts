// Promise with timeout; pass an async function and timeout (ms)
export const promiseWithTimeout = (prom: Promise<any>, time: number) => {
	let timer: any;
	return Promise.race([
		prom,
		new Promise((_r, reject) => {
			timer = setTimeout(() => reject(new Error(`timeout`)), time);
			return timer;
		}),
	]).finally(() => clearTimeout(timer));
};
