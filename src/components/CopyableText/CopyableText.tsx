import { Check as CheckIcon, Copy as CopyIcon } from '@phosphor-icons/react'
import { Input, Space, Tooltip, Typography } from 'antd'

import { IconButton } from '@components'
import { useCopyToClipboard } from '@utils'

import { ICopyableTextProps, IInputCopyableTextProps } from './CopyableText-types'

function CopyableText(props: ICopyableTextProps) {
	const { label, text, className } = props

	if (label) {
		return (
			<Space
				direction="horizontal"
				className={className ? 'copyable-text ' + className : 'copyable-text'}
			>
				<Typography.Text strong>{label} :</Typography.Text>
				<Typography.Text copyable={{ tooltips: ['Copier', 'Copié'] }} ellipsis>
					{text}
				</Typography.Text>
			</Space>
		)
	}

	return (
		<Typography.Text
			className={className ? 'copyable-text ' + className : 'copyable-text'}
			copyable={{ tooltips: ['Copier', 'Copié'] }}
		>
			{text}
		</Typography.Text>
	)
}

function InputCopyableText(props: IInputCopyableTextProps) {
	const { text, className, icon } = props

	const { copied, copy } = useCopyToClipboard()

	return (
		<Space.Compact
			className={className ? 'input-copyable-text ' + className : 'input-copyable-text'}
		>
			<Input prefix={icon} size="small" value={text} readOnly />
			<Tooltip title="Copié" open={copied}>
				<IconButton
					type="primary"
					icon={copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
					onClick={() => copy(text)}
				/>
			</Tooltip>
		</Space.Compact>
	)
}

CopyableText.Input = InputCopyableText

export { CopyableText }
