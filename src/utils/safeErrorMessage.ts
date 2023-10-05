export const safeErrorMessage = (message: string | object | any) => {
	if (!message) return 'safeErrorMessage: No message provided'
	if (typeof message === 'string') return message
	if (typeof message === 'object' && message instanceof Error) return message.message
	if (typeof message === 'object' && message?.detail) return message.detail
	if (typeof message === 'object' && message instanceof Object) return JSON.stringify(message)

	console.log('safeErrorMessage: message is not a string or object')
	return 'safeErrorMessage: Unkown error'
}
