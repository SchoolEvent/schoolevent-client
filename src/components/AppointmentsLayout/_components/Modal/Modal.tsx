import { Plus as PlusIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { Modal as AntdModal, Button, Skeleton, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useSupabase } from '@utils'

import { IModalProps } from '../../AppointmentsLayout-types'

import './Modal-styles.less'

export function Modal({ appointmentId }: IModalProps) {
	const navigate = useNavigate()
	const supabase = useSupabase()

	const { data: response, isLoading } = useQuery({
		queryKey: ['appointments', appointmentId],
		queryFn: async () => await supabase.from('test_appointments').select().eq('id', appointmentId),
	})

	return (
		<AntdModal
			className="appointment-modal"
			open
			centered
			onCancel={() => {
				navigate('/appointments')
			}}
			footer={null}
			title={
				isLoading ? (
					<Skeleton.Input style={{ height: 'var(--ant-font-size-heading-4)' }} active />
				) : (
					response?.data?.[0].school_name
				)
			}
		>
			<Space direction="vertical" style={{ width: '100%' }}>
				{response?.data ? <Typography.Text>{response.data[0].created_at}</Typography.Text> : null}
				{response?.data ? <Typography.Text>{response.data[0].status}</Typography.Text> : null}

				{response?.data?.[0].status === 'planned' && (
					<Button type="primary" className="create-event-btn" icon={<PlusIcon size={16} />} block>
						Créer l'évènement
					</Button>
				)}
			</Space>
		</AntdModal>
	)
}
