import { Space, Typography } from 'antd'
import { useDrag } from 'react-dnd'
import { useNavigate } from 'react-router-dom'

import { IDragItemProps } from '../../AppointmentsLayout-types'

export function DragItem({ appointment }: IDragItemProps) {
	const navigate = useNavigate()

	const [{ isDragging }, drag] = useDrag({
		type: appointment.status,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: appointment,
	})

	return (
		<Space
			ref={drag}
			direction="vertical"
			className="drag-item"
			style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}
			onClick={() => {
				navigate(`/appointments?id=${appointment.id}`)
			}}
		>
			<Typography.Text strong>{appointment.school_name}</Typography.Text>
			<Typography.Text>{appointment.created_at}</Typography.Text>
			<Typography.Text>{appointment.status}</Typography.Text>
		</Space>
	)
}
