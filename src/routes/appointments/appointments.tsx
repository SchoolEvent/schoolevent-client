import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { AppointmentsLayout, ProtectedRoute } from '@components'
import { FavoriteContactsProvider } from '@contexts'

export const appointmentsRoute: RouteObject = {
	path: 'appointments',
	element: (
		<ProtectedRoute>
			<Helmet>
				<title>SchoolEvent | Rendez-vous</title>
			</Helmet>
			<FavoriteContactsProvider>
				<DndProvider backend={HTML5Backend}>
					<AppointmentsLayout />
				</DndProvider>
			</FavoriteContactsProvider>
		</ProtectedRoute>
	),
}
