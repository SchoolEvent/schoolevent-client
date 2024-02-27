import { AutoCompleteProps } from 'antd'

export interface IAutoCompleteFieldProps extends AutoCompleteProps {
	readOnly?: boolean
	emptyText?: string
}
