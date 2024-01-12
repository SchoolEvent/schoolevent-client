import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { CalendarLayout } from '@components'

export const calendarRoute: RouteObject = {
	path: 'calendar',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Calendier</title>
			</Helmet>
			<CalendarLayout />
		</>
	),
}
