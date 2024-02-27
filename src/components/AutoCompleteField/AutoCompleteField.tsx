import { AutoComplete, Input, Typography } from 'antd'
import classNames from 'classnames'

import { IAutoCompleteFieldProps } from './AutoCompleteField-types'

import './AutoCompleteField-styles.less'

export function AutoCompleteField(props: IAutoCompleteFieldProps) {
	const { readOnly, className, emptyText = '-', ...autoCompleteProps } = props

	if (readOnly) {
		return autoCompleteProps.value ? (
			<Input
				className={classNames('auto-complete-field--readonly', className)}
				value={autoCompleteProps.value}
				readOnly
			/>
		) : (
			<Typography.Text type="secondary">{emptyText}</Typography.Text>
		)
	}

	return (
		<AutoComplete {...autoCompleteProps} className={classNames('auto-complete-field', className)} />
	)
}
