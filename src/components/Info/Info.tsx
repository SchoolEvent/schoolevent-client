import { Info as InfoIcon } from '@phosphor-icons/react'
import { Space, Tooltip } from 'antd'

import { TInfoProps } from './Info-types'

import './Info-styles.less'

export function Info(props: TInfoProps) {
	const { direction = 'horizontal', children, tooltip } = props

	if (tooltip) {
		return (
			<Tooltip overlayClassName="info__tooltip" title={children}>
				<InfoIcon className="info__icon" />
			</Tooltip>
		)
	}

	return (
		<Space direction={direction} className="info__container" align="center">
			<InfoIcon className="info__icon" size="16px" />
			{children}
		</Space>
	)
}
