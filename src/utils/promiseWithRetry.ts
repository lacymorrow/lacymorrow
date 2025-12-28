
// retryOperation(func, 1000, 5)
//   .then(console.log)
//   .catch(console.log);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const retryOperation = (
	operation: () => any,
	delay: number,
	retries: number,
): Promise<any> =>
	new Promise((resolve, reject) => {
		return operation()
			.then(resolve)
			.catch((error: any) => {
				if (retries > 0) {
					return wait(delay)
						.then(
							retryOperation.bind(
								null,
								operation,
								delay,
								retries - 1,
							),
						)
						.then(resolve)
						.catch((err) => {
							let errorMessage = 'Operation failed';
							if (err instanceof Error) {
								errorMessage = err.message;
							}
							reject(errorMessage);
						});
				}
				return reject(error);
			});
	});
