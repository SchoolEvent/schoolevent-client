import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Input, List, Space } from 'antd'
import 'dayjs/locale/fr'
import { useState } from 'react'

import { appointments } from '../appointment'

import './CalendarList-styles.less'

export function CalendarList() {
	const [search, setSearch] = useState('')

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
			{' '}
			{/* Utilisez la même classe CSS */}
			<Input
				placeholder="Rechercher des rendez-vous"
				prefix={<SearchIcon />}
				onChange={handleSearchChange}
			/>
			<List
				dataSource={filteredAppointments}
				renderItem={(item) => (
					<List.Item key={item.name}>
						<List.Item.Meta className="calendar-list__item" title={item.name} />
					</List.Item>
				)}
			/>
		</Space>
	)
}
