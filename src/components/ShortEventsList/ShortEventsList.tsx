import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { Input, List, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useSupabase } from '@utils'

dayjs.extend(utc)
dayjs.extend(timezone)

export function ShortEventsList() {
	const [search, setSearch] = useState('')
	const supabase = useSupabase()

	const { data, isLoading } = useQuery({
		queryKey: ['short-events'],
		queryFn: async () => {
			const { data, error } = await supabase.from('events').select('id, event_title, event_date')

			if (error) {
				throw error
			}

			return data
		},
	})

	if (isLoading) {
		return <LoadingList />
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const filteredEvents =
		data?.filter((event) => {
			const matchTitle = event.event_title.toLowerCase().includes(search.toLowerCase())
			const matchDate = event.event_date.toLowerCase().includes(search.toLowerCase())

			return matchTitle || matchDate
		}) ?? []

	return (
		<Space className="events-list" direction="vertical">
			<Typography.Title className="events-list__title" level={5}>
				Établissements favoris
			</Typography.Title>
			<Input
				placeholder="Rechercher des événements"
				prefix={<SearchIcon />}
				onChange={handleSearchChange}
			/>
			<List
				dataSource={filteredEvents}
				loading={isLoading}
				renderItem={(item) => (
					<List.Item key={item.id}>
						<Link to={`/events/view/${item.id}`} style={{ width: '100%' }}>
							<List.Item.Meta
								className="events-list__item"
								title={item.event_title}
								description={<i>{dayjs(item.event_date).format('DD MMMM YYYY')}</i>}
							/>
						</Link>
					</List.Item>
				)}
			/>
		</Space>
	)
}

function LoadingList() {
	return (
		<Space className="events-list" direction="vertical">
			<Input placeholder="Rechercher des événements" prefix={<SearchIcon />} />
			<List dataSource={[]} loading />
		</Space>
	)
}
