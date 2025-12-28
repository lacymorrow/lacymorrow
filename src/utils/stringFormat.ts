/* eslint prefer-const: "off" */
// Turn a string into a template string and replace %s with the arguments passed in

// Example:
// stringFormat('Hello %s, welcome to %s', 'John Doe', 'the party')

function stringFormat(str: string, ...rest: any[]): string {
	let args = [].slice.call(rest, 0),
		i = 0;

	return str.replace(/%s/g, () => args[i++]);
}

export default stringFormat;
