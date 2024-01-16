// import { EventListComponent } from './EventListComponent'
// export const EventList = () => {
// 	return <EventListComponent />
// }
import { Card, Col, Flex, Image, List, Row } from 'antd'
import { useEffect, useState } from 'react'

import { useSupabase } from '@utils'

import { IEventFormFields } from '../type'

export const EventList = () => {
	const supabase = useSupabase()
	const [events, setEvents] = useState<IEventFormFields[]>([])
	// const [backgroundUrl, setBackgroundURL] = useState<string>()

	const fetchEvents = async () => {
		const { data, error } = await supabase.from('events').select('*')
		if (error) {
			console.error('Error fetching events:', error)
			return []
		}
		setEvents(data)
	}
	const getBackgroundUrl = async (event_background: string) => {
		const { data } = await supabase.storage.from('pictures').getPublicUrl(event_background)
		console.log('tmp', data.publicUrl)

		return data.publicUrl
	}

	useEffect(() => {
		fetchEvents()
	}, [])

	// ...

	return (
		<List>
			{events.map((event) => (
				<List.Item key={event.id}>
					<Flex justify="space-between">
						<Row>
							<Flex vertical>
								<Col>{event.event_name}</Col>
								<Col>{event.event_type}</Col>
								<Col>{`${event.event_date.toString()} - ${event.event_time.toString()}`}</Col>
								<Col>{event.event_position}</Col>
								<Col>{event.event_creator}</Col>
								<Card>
									<Col>{event.event_description}</Col>
								</Card>
							</Flex>

							<Row>
								{typeof event.event_background === 'string' && (
									<Col>
										<Image
											width={272}
											alt={event.event_background}
											src={getBackgroundUrl(event.event_background?.file)?.toString() || ''}
										/>
									</Col>
								)}
							</Row>
						</Row>
					</Flex>
				</List.Item>
			))}
		</List>
	)
	// END: be15d9bcejpp

	return (
		<List>
			{events.map((event) => (
				<List.Item key={event.id}>
					<Flex justify="space-between">
						<Row>
							<Flex vertical>
								<Col>{event.event_name}</Col>
								<Col>{event.event_type}</Col>
								<Col>{`${event.event_date.toString()} - ${event.event_time.toString()}`}</Col>
								<Col>{event.event_position}</Col>
								<Col>{event.event_creator}</Col>
								<Card>
									<Col>{event.event_description}</Col>
								</Card>
							</Flex>

							<Row>
								{typeof event.event_background === 'string' && (
									<Col>
										<Image width={272} alt={event.event_background} src={event.event_background} />
									</Col>
								)}
							</Row>
						</Row>
					</Flex>
				</List.Item>
			))}
		</List>
	)
}
