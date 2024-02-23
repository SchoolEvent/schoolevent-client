import { Input, Select } from 'antd'

import { ISelectFieldProps } from './SelectField-types'

export function SelectField(props: ISelectFieldProps) {
	const { readOnly, ...selectProps } = props

	const readOnlyValue = selectProps.options?.find((option) => option.value === selectProps.value)
		?.label

	// TODO: set ellipsis on the input
	if (readOnly) {
		return <Input value={readOnlyValue as string} readOnly />
	}

	return <Select {...selectProps} />
}
