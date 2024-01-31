import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Typography } from 'antd'
import classNames from 'classnames'
import { useDrop } from 'react-dnd'

import { IAppointment } from '@types'
import { useSupabase } from '@utils'

import { IDropZoneProps } from '../../AppointmentsLayout-types'
import { DragItem } from '../DragItem/DragItem'

import './DropZone-styles.less'

export function DropZone(props: IDropZoneProps) {
	const { columnStatus, title, className, accepts } = props

	const supabase = useSupabase()
	const queryClient = useQueryClient()

	/**
	 * Fetch appointments of status <columnStatus>
	 */
	const fetchAppointments = async () =>
		await supabase.from('appointments').select('*', { count: 'exact' }).eq('status', columnStatus)

	const { data: response } = useQuery({
		queryKey: ['appointments', { status: columnStatus }],
		queryFn: fetchAppointments,
	})

	/**
	 * Update appointment status to <columnStatus>
	 */
	const updateAppointment = async (appointment: IAppointment) =>
		await supabase
			.from('appointments')
			.update({ ...appointment, status: columnStatus })
			.eq('id', appointment.id)

	const mutation = useMutation({
		mutationFn: updateAppointment,
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['appointments'] })
		},
	})

	const [, drop] = useDrop({
		accept: accepts,
		drop: (item: IAppointment) => {
			mutation.mutate(item)
		},
	})

	return (
		<div className={classNames('drop-zone', className)}>
			<div className="drop-zone__title-container">
				<Typography.Title className="drop-zone__title" level={5}>
					{title}
				</Typography.Title>
				<Typography.Title className="drop-zone__count" level={5} type="secondary">
					{response?.count}
				</Typography.Title>
			</div>
			<div className="drop-zone__drop-zone" ref={drop}>
				{response?.data?.map((appointment) => (
					<DragItem key={appointment.id} appointment={appointment} />
				))}
			</div>
		</div>
	)
}
