import { Helmet } from 'react-helmet'
import { Outlet, RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@components'
import { eventFormRoute } from '@routes'

export const eventsRoute: RouteObject = {
	path: 'events',
	element: (
		<ProtectedRoute>
			<Helmet>
				<title>SchoolEvent | Évènements</title>
			</Helmet>
			<Outlet />
		</ProtectedRoute>
	),
	children: [eventFormRoute],
}
