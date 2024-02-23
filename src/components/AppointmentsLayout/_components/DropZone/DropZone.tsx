import { Plus } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Typography } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useDrop } from 'react-dnd'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@contexts'
import { TAppointment } from '@types'
import { useSupabase } from '@utils'

import { IconButton } from '../../../IconButton/IconButton'
import { IDropZoneProps } from '../../AppointmentsLayout-types'
import { DragItem } from '../DragItem/DragItem'

import './DropZone-styles.less'

dayjs.extend(utc)
dayjs.extend(timezone)

export function DropZone(props: IDropZoneProps) {
	const { columnStatus, title, className, accepts } = props

	const { user } = useAuth()
	const navigate = useNavigate()
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	/**
	 * Fetch appointments of status <columnStatus>
	 */
	const { data: response } = useQuery({
		queryKey: ['appointments', { status: columnStatus }],
		queryFn: async () => {
			const { data, error, count } = await supabase
				.from('appointments')
				.select('*, users(id, email)', { count: 'exact' }) // This select statement allows to make a join request and get both the appointment and the assignee at the same time
				.eq('apt_status', columnStatus)
				.or(`assignee.eq.${user!.id},author_id.eq.${user!.id}`)

			if (error) {
				throw error
			}

			return { appointment: data, count }
		},
	})

	/**
	 * Update appointment status to <columnStatus>
	 */
	const updateAppointment = async (appointment: TAppointment) => {
		// It should update the contacted/planned date only if the appointment
		// is not already contacted/planned.
		const shouldUpdate =
			(columnStatus === 'contacted' && !appointment.contacted_date) ||
			(columnStatus === 'planned' && !appointment.planned_date)

		const currentDate = dayjs().tz().toISOString()

		let updatedAppointment: Partial<
			Pick<TAppointment, 'apt_status' | 'contacted_date' | 'planned_date'>
		> = { apt_status: columnStatus }

		if (shouldUpdate && columnStatus === 'contacted') {
			updatedAppointment = { ...updatedAppointment, contacted_date: currentDate }
		}

		if (shouldUpdate && columnStatus === 'planned') {
			updatedAppointment = { ...updatedAppointment, planned_date: currentDate }
		}

		return await supabase.from('appointments').update(updatedAppointment).eq('id', appointment.id)
	}

	const mutation = useMutation({
		mutationFn: updateAppointment,
		onSuccess: (_, { id }) => {
			queryClient.refetchQueries({ queryKey: ['appointments'] })
			queryClient.invalidateQueries({ queryKey: ['appointment', { appointmentId: id }] })
		},
	})

	const [{ isOver }, drop] = useDrop({
		accept: accepts,
		drop: (item: TAppointment) => {
			mutation.mutate(item)
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
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
			<div
				className={classNames('drop-zone__list-container', {
					'drop-zone__list-container--hover': isOver,
				})}
				ref={drop}
			>
				<div className="drop-zone__list-container__list">
					{response?.appointment.map((appointment) => (
						<DragItem key={appointment.id} appointment={appointment} />
					))}
				</div>
			</div>
			<IconButton
				title="Nouveau suivi"
				className="new-apt-btn"
				type="dashed"
				icon={<Plus size={16} />}
				onClick={() => navigate(`/appointments?action=new&status=${columnStatus}`)}
				block
			/>
		</div>
	)
}
