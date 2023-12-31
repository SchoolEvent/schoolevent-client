export function isStringEmpty(str: string | undefined) {
	if (str === undefined) {
		return true
	}

	return str.trim() === ''
}
