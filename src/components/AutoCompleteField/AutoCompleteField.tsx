import { AutoComplete, Input } from 'antd'

import { IAutoCompleteFieldProps } from './AutoCompleteField-types'

export function AutoCompleteField(props: IAutoCompleteFieldProps) {
	const { readOnly, ...autoCompleteProps } = props

	// TODO: set ellipsis on the input
	if (readOnly) {
		return <Input value={autoCompleteProps.value} readOnly />
	}

	return <AutoComplete {...autoCompleteProps} />
}
