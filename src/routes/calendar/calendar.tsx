import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { CalendarLayout, ProtectedRoute } from '@components'

export const calendarRoute: RouteObject = {
	path: 'calendar',
	element: (
		<ProtectedRoute>
			<Helmet>
				<title>SchoolEvent | Calendier</title>
			</Helmet>
			<CalendarLayout />
		</ProtectedRoute>
	),
}
