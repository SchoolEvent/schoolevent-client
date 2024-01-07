export type TInfoProps = TInfoTooltipProps | TInfoNoTooltipProps

type TInfoCommonProps = {
	children: React.ReactNode
}

type TInfoTooltipProps = TInfoCommonProps & {
	tooltip: true
	direction?: never
}

type TInfoNoTooltipProps = TInfoCommonProps & {
	tooltip?: never
	direction?: 'vertical' | 'horizontal'
}
