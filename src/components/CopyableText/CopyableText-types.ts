export interface ICopyableTextProps {
	label?: string
	text: string
	className?: string
}

export interface IInputCopyableTextProps extends Omit<ICopyableTextProps, 'strong'> {
	icon?: React.ReactNode
}
