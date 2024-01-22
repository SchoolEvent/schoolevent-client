import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Flex, Input, List, Modal, Space } from 'antd'
import 'dayjs/locale/fr'
import { useState } from 'react'

import { Appointment, appointments } from '../appointment'

import './CalendarList-styles.less'

export function CalendarList() {
	const [search, setSearch] = useState('')
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

	const showAppointmentDetails = (appointment: Appointment) => {
		setSelectedAppointment(appointment)
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const filteredAppointments = appointments.filter((appointment) => {
		const matchName = appointment.name.toLowerCase().includes(search.toLowerCase())
		const matchDescription = appointment.description.toLowerCase().includes(search.toLowerCase())
		const matchPosition = appointment.position.toLowerCase().includes(search.toLowerCase())

		return matchName || matchDescription || matchPosition
	})

	return (
		<Space className="calendar-list" direction="vertical">
			<Input
				placeholder="Rechercher mes rendez-vous"
				prefix={<SearchIcon />}
				onChange={handleSearchChange}
			/>
			<List
				dataSource={filteredAppointments}
				renderItem={(item) => (
					<List.Item key={item.name} onClick={() => showAppointmentDetails(item)}>
						<List.Item.Meta
							className="favorites-list__item"
							title={item.name}
							description={
								<Flex justify="space-between">
									<i>
										{item.position} - {item.date.format('DD/MM/YYYY')}
									</i>
								</Flex>
							}
						/>
					</List.Item>
				)}
			/>
			<Modal
				title="Les détails de l'événement :"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				{selectedAppointment && (
					<div>
						<p>Type: {selectedAppointment.type}</p>
						<p>Name: {selectedAppointment.name}</p>
						<p>Description: {selectedAppointment.description}</p>
						<p>Position: {selectedAppointment.position}</p>
						<p>Date: {selectedAppointment.date.format('DD/MM/YYYY')}</p>
						<p>Participant: {selectedAppointment.participant}</p>
					</div>
				)}
			</Modal>
		</Space>
	)
}
