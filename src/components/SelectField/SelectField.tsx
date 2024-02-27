import { Input, Select, Typography } from 'antd'
import classNames from 'classnames'

import { ISelectFieldProps } from './SelectField-types'

import './SelectField-styles.less'

export function SelectField(props: ISelectFieldProps) {
	const { readOnly, className, emptyText = '-', ...selectProps } = props

	const readOnlyValue = selectProps.options?.find((option) => option.value === selectProps.value)
		?.label

	if (readOnly) {
		return readOnlyValue ? (
			<Input
				className={classNames('select-field--readonly', className)}
				value={readOnlyValue as string}
				readOnly
			/>
		) : (
			<Typography.Text type="secondary">{emptyText}</Typography.Text>
		)
	}

	return <Select {...selectProps} className={classNames('select-field', className)} />
}
