/**
 * @module wait
 * @description Delay for a specified amount of time
 * @param {number | string} [ms=1000] - The amount of time in milliseconds to delay
 * @returns {void | Promise<void>}
 */

const wait = async (ms = 1000) => await new Promise((resolve) => setTimeout(resolve, Number(ms)));

export default wait;
