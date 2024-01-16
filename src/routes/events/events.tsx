import { Helmet } from 'react-helmet'
import { Outlet, RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@components'
import { eventFormRoute } from '@routes'

import { EventList } from '../../components/events/eventsList/EventList'

export const eventsRoute: RouteObject = {
	path: 'events',
	element: (
		<ProtectedRoute>
			<Helmet>
				<title>SchoolEvent | Évènements</title>
			</Helmet>
			<EventList />
			<Outlet />
		</ProtectedRoute>
	),
	children: [eventFormRoute],
}
