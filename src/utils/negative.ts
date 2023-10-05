// negate array
export const negativeArray = function (arr: any[]) {
	return arr.map((num) => negative(num))
}

// negate something
export const negative = function (num: string | number) {
	if (typeof num === "number") return -1 * num
	num = parseFloat(num)
	return String(-1 * num)
}
export default negative
