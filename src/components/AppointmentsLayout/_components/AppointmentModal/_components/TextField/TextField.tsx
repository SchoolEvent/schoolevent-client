import { Input, Space, Typography } from 'antd'

import { ITextFieldProps } from './TextField-types'

export function TextField(props: ITextFieldProps) {
	const { value, label, viewMode } = props

	if (viewMode) {
		return (
			<Space className="text-field text-field__view">
				{label && <Typography.Text>{label} :</Typography.Text>}
				<Typography.Text>{value}</Typography.Text>
			</Space>
		)
	} else {
		return <Input className="text-field text-field__edit" value={value ?? undefined} />
	}
}
