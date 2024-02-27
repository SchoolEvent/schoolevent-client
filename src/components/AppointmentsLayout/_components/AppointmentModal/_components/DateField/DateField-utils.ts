import { IGetClassnameParams } from './DateField-types'

export function getClassname(params: IGetClassnameParams) {
	const { readOnly, block } = params

	let classname = 'date-field'

	if (readOnly) {
		classname += ' date-field--view'
	}

	if (block) {
		classname += ' date-field--block'
	}

	return classname
}
