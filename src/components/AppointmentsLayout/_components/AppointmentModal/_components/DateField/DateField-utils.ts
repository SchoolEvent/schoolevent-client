import { IGetClassnameParams } from './DateField-types'

export function getClassname(params: IGetClassnameParams) {
	const { viewMode, block } = params

	let classname = 'date-field'

	if (viewMode) {
		classname += ' date-field--view'
	}

	if (block) {
		classname += ' date-field--block'
	}

	return classname
}
