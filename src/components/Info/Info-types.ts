import { TooltipProps } from 'antd'

export type TInfoProps = TInfoTooltipProps | TInfoNoTooltipProps

type TInfoCommonProps = {
	children: React.ReactNode
}

type TInfoTooltipProps = TInfoCommonProps & {
	tooltip: true
	direction?: never
	tooltipProps?: Omit<TooltipProps, 'title'>
}

type TInfoNoTooltipProps = TInfoCommonProps & {
	tooltip?: never
	direction?: 'vertical' | 'horizontal'
	tooltipProps?: never
}
