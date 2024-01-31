import { Plus as PlusIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { Button, Skeleton, Space, Typography } from 'antd'

import { useSupabase } from '@utils'

import { Modal } from '..'

import { IAppointmentModalProps } from '../../AppointmentsLayout-types'

export function AppointmentModal(props: IAppointmentModalProps) {
	const { appointmentId } = props

	const supabase = useSupabase()

	const { data: response, isLoading } = useQuery({
		queryKey: ['appointments', appointmentId],
		queryFn: async () => await supabase.from('appointments').select().eq('id', appointmentId),
	})

	return (
		<Modal
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
				{response?.data ? <Typography.Text>{response.data[0].apt_status}</Typography.Text> : null}

				{response?.data?.[0].apt_status === 'planned' && (
					<Button type="primary" className="create-event-btn" icon={<PlusIcon size={16} />} block>
						Créer l'évènement
					</Button>
				)}
			</Space>
		</Modal>
	)
}
