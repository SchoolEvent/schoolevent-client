import { Modal as AntdModal } from 'antd'
import { useNavigate } from 'react-router-dom'

import { IModalProps } from '../../AppointmentsLayout-types'

import './Modal-styles.less'

export function Modal(props: IModalProps) {
	const { onCancelCallback, children, footer = null, ...modalProps } = props

	const navigate = useNavigate()

	return (
		<AntdModal
			className="appointment-modal"
			open
			{...modalProps}
			onCancel={() => {
				onCancelCallback?.()
				navigate('/appointments')
			}}
			footer={footer}
		>
			{children}
		</AntdModal>
	)
}
