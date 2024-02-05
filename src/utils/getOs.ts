export const getOs = () => {
	// @ts-ignore
	if (navigator?.userAgentData?.platform) {
		// eslint-disable-next-line no-nested-ternary
		return navigator.platform === 'MacIntel'
			? 'mac'
			: navigator.platform === 'Win32'
				? 'windows'
				: 'linux';
	}

	if (navigator?.platform) {
		// eslint-disable-next-line no-nested-ternary
		return navigator.platform === 'MacIntel'
			? 'mac'
			: navigator.platform === 'Win32'
				? 'windows'
				: 'linux';
	}

	if (process?.platform) {
		// eslint-disable-next-line no-nested-ternary
		return process.platform === 'darwin'
			? 'mac'
			: process.platform === 'win32'
				? 'windows'
				: 'linux';
	}
};
