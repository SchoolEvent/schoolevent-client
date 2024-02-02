import { ChatDots as MessageIcon, Paperclip as PaperclipIcon } from '@phosphor-icons/react'
import { Avatar, Space, Typography } from 'antd'
import { useDrag } from 'react-dnd'
import { useNavigate } from 'react-router-dom'

import { IDragItemProps } from '../../AppointmentsLayout-types'
import { DateField } from '../AppointmentModal/_components/DateField/DateField'

import './DragItem-styles.less'

export function DragItem({ appointment }: IDragItemProps) {
	const navigate = useNavigate()

	const [{ isDragging }, drag] = useDrag({
		type: appointment.apt_status,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: appointment,
	})

	const renderDate = () => {
		switch (appointment.apt_status) {
			case 'contacted':
				if (appointment.contacted_date) {
					return (
						<Space>
							<Typography.Text strong>Contacté le : </Typography.Text>
							<DateField value={appointment.contacted_date} viewMode />
						</Space>
					)
				}

				break
			case 'planned':
				if (appointment.planned_date) {
					return (
						<Space>
							<Typography.Text strong>Rendez-vous le : </Typography.Text>
							<DateField value={appointment.planned_date} viewMode />
						</Space>
					)
				}

				break
			default:
				return null
		}
	}

	return (
		<Space
			ref={drag}
			direction="vertical"
			className="drag-item"
			size="middle"
			style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}
			onClick={() => {
				navigate(`/appointments?action=edit&id=${appointment.id}`)
			}}
		>
			<Space direction="vertical" size={0}>
				<Typography.Text strong>{appointment.school_name}</Typography.Text>
				<Space>
					<Typography.Text type="secondary">{appointment.school_postal_code}</Typography.Text>
					<Typography.Text type="secondary">{appointment.school_city}</Typography.Text>
				</Space>
			</Space>

			{appointment.contact_phone && (
				<Space>
					<Typography.Text strong>Téléphone : </Typography.Text>
					<Typography.Text>{appointment.contact_phone}</Typography.Text>
				</Space>
			)}

			{appointment.contact_name && (
				<Space>
					<Typography.Text strong>Contact : </Typography.Text>
					<Typography.Text>{appointment.contact_name}</Typography.Text>
				</Space>
			)}

			{renderDate()}

			<div className="drag-item__footer">
				{appointment.assignees && appointment.assignees.length > 0 && (
					<div className="drag-item__footer__item">
						<Avatar>{appointment.assignees[0]}</Avatar>
					</div>
				)}
				<div className="drag-item__footer__item">
					<Typography.Text type="secondary">0</Typography.Text>
					<MessageIcon size={16} />
				</div>
				<div className="drag-item__footer__item">
					<Typography.Text type="secondary">
						{appointment.attachements?.length ?? 0}
					</Typography.Text>
					<PaperclipIcon size={16} />
				</div>
			</div>
		</Space>
	)
}
