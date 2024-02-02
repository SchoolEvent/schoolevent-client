export interface IDateFieldProps {
	value: string | null | undefined
	label?: React.ReactNode
	viewMode: boolean
	showTime?: true
	block?: true
}

export interface IGetClassnameParams {
	viewMode: boolean
	block?: boolean
}
