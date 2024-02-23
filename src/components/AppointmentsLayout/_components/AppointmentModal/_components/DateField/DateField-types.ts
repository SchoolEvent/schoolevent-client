import { DatePicker } from 'antd'
import { ComponentProps } from 'react'

export interface IDateFieldProps {
	value: string | null | undefined
	label?: React.ReactNode
	viewMode: boolean
	showTime?: true
	block?: true
}

export type TDateFieldProps = ComponentProps<typeof DatePicker> & {
	label?: React.ReactNode
	readOnly: boolean
	block?: true
	showTime?: boolean
}

export interface IGetClassnameParams {
	readOnly: boolean
	block?: boolean
}
